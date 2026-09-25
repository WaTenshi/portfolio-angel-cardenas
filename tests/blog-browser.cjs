/* Run with Playwright available in NODE_PATH; no application dependency is needed. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const url = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4175/portfolio-angel-cardenas/';
const output = process.env.PORTFOLIO_ARTIFACTS || path.join(os.tmpdir(), 'portfolio-blog-checks');
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ['--disable-dev-shm-usage'], args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  try {
    assert.equal((await page.goto(url)).status(), 200);
    await page.locator('.blog-fab').waitFor();
    assert.equal(await page.locator('.project-card').count(), 7);
    assert.deepEqual(await page.locator('.project-group-clients h4').allTextContents(), ['Susana Riquelme Peluquería', 'Calzados Paula', 'Hallazgo Beauty & Care']);
    assert.deepEqual(await page.locator('.project-group-clients .project-link').evaluateAll(links => links.map(link => link.href)), ['https://susanariquelmepeluqueria.cl/', 'https://calzadospaula.cl/', 'https://mihallazgo.cl/']);
    assert.deepEqual(await page.locator('.project-group-personal h4').allTextContents(), ['JournalFit', 'Consultora Psicológica', 'Sistema de Certificados', 'Invitación de boda']);
    assert.deepEqual(await page.locator('.featured h3').allTextContents(), ['Instituto Grupo Crexer', 'FACEA UdeC']);
    assert(!requests.some(request => /ArticlePage-|del-codigo-a-la-realidad-/.test(request)), 'portfolio should not download Markdown or its renderer');
    await page.locator('.blog-fab').click();
    await page.locator('.blog-hero').waitFor();
    assert(page.url().endsWith('/blog/'));
    assert.equal(await page.locator('.featured-story').count(), 1);
    assert.equal(await page.locator('.archive-story').count(), 1);
    assert(!requests.some(request => /ArticlePage-|del-codigo-a-la-realidad-/.test(request)), 'index should only load article metadata');
    await page.locator('.featured-story .blog-read-link').click();
    await page.locator('.article-body h2').first().waitFor();
    assert.equal(await page.locator('.article-body h2').count(), 5);
    assert.equal(await page.locator('.article-page').getAttribute('lang'), 'es');
    assert.equal(await page.locator('time').getAttribute('datetime'), '2026-07-14');
    assert((await page.locator('time').innerText()).includes('14'));
    assert.equal(await page.locator('.article-pagination').count(), 0);
    assert.equal(await page.locator('.related-articles').count(), 0);
    assert.equal((await page.reload()).status(), 200);
    await page.locator('.article-body').waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const fraction of [0, .5, 1]) {
      await page.evaluate(fraction => {
        const body = document.querySelector('.article-body');
        const top = body.getBoundingClientRect().top + scrollY - 100;
        window.scrollTo({ top: top + Math.max(1, body.offsetHeight - innerHeight + 100) * fraction, behavior: 'instant' });
      }, fraction);
      await page.waitForTimeout(120);
      assert(Math.abs(Number(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow')) - fraction * 100) <= 1);
    }
    await page.goBack(); await page.locator('.blog-hero').waitFor();
    await page.goForward(); await page.locator('.article-body').waitFor();
    const articleUrl = url + 'blog/del-codigo-a-la-realidad/';
    await page.goto(articleUrl + '#dar-soporte-al-mismo-sistema-que-desarrollo');
    await page.waitForFunction(() => Math.abs(document.getElementById('dar-soporte-al-mismo-sistema-que-desarrollo')?.getBoundingClientRect().top - 212) < 15);
    // Shared preferences persist across document navigation. Article text stays Spanish.
    await page.locator('.blog-controls button').first().click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('.article-page').getAttribute('lang'), 'es');
    await page.locator('.blog-controls button').nth(1).click();
    await page.locator('.blog-controls button').nth(2).click();
    await page.locator('.blog-portfolio-link').click();
    await page.locator('.blog-fab').waitFor();
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
    const variants=[];
    for (const width of [320,390,780,1024,1440]) {
      await page.setViewportSize({width,height:900});
      for (const theme of ['light','dark']) {
        await page.evaluate(theme => {localStorage.setItem('theme', theme); localStorage.setItem('language','es');},theme);
        for (const suffix of ['', 'blog/', 'blog/del-codigo-a-la-realidad/']) {
          await page.goto(url + suffix); await page.evaluate(()=>document.fonts.ready);
          await page.locator(suffix.includes('del-codigo') ? '.article-body' : suffix ? '.blog-hero' : '.blog-fab').waitFor();
          const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
          assert(!overflow,`horizontal overflow: ${width} ${theme} ${suffix}`);
          const clipped=await page.locator('h1,h2,.blog-header-inner').evaluateAll(elements=>elements.filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.textContent));
          assert.deepEqual(clipped,[],`clipped headings: ${width} ${theme} ${suffix}`);
          if(width===1440 || width===390) await page.screenshot({path:path.join(output,`${suffix ? suffix.includes('del-codigo') ? 'article' : 'blog' : 'portfolio'}-${width}-${theme}.png`)});
          if(width===390 && !suffix) {
            await page.locator('input[name="name"]').focus();
            await page.locator('input[name="name"]').scrollIntoViewIfNeeded();
            const fab=await page.locator('.blog-fab').boundingBox(); const input=await page.locator('input[name="name"]').boundingBox();
            assert(fab.y>=input.y+input.height || fab.y+fab.height<=input.y,'FAB covers focused field');
          }
          variants.push({width,theme,suffix});
        }
      }
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(articleUrl); await page.locator('.article-body').waitFor();
    await page.locator('.mobile-toc summary').click();
    await page.locator('.mobile-toc a').nth(2).click();
    assert(page.url().includes('#dar-soporte'));
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(() => document.querySelectorAll('.blog-controls button')[2]?.disabled);
    assert(await page.locator('.blog-controls button').nth(2).isDisabled());
    assert.equal(await page.locator('[data-reveal]').evaluateAll(es=>es.filter(e=>getComputedStyle(e).opacity==='0').length),0);
    assert.equal((await page.goto(url+'blog/not-an-article/')).status(),404);
    await page.locator('.blog-not-found').waitFor();
    assert.equal((await page.goto(url+'unknown/')).status(),404);
    await page.locator('.blog-not-found').waitFor();
    const results={responsiveCases:variants.length,errors,checks:'native navigation, history, reload, static 404, deferred Markdown, date, original headings, reading progress, deep links, shared preferences, mobile TOC, reduced motion, FAB focus clearance'};
    assert.deepEqual(errors,[]);
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));console.log(results);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
