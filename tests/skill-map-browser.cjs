/* Run with Playwright available in NODE_PATH after starting the preview server. */
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const url = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4175/portfolio-angel-cardenas/'

;(async () => {
  const browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ['--disable-dev-shm-usage'], args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  try {
    await page.goto(url)
    assert.equal(await page.locator('.skill-map').count(), 0, 'skill map must stay lazy before approaching the section')
    await page.locator('#stack').scrollIntoViewIfNeeded()
    await page.locator('.skill-map').waitFor()

    await page.getByRole('button', { name: /Abrir terminal|Open interactive terminal/ }).click()
    await page.getByRole('textbox', { name: /Comando de terminal|Terminal command/ }).fill('skill react')
    await page.getByRole('textbox', { name: /Comando de terminal|Terminal command/ }).press('Enter')
    await page.locator('.terminal-dialog').waitFor({ state: 'detached' })
    await page.waitForURL(/skill=react/)

    const search = page.getByRole('combobox', { name: /Buscar tecnología|Search technology/ })
    await search.fill('react native')
    await page.getByRole('option', { name: /React Native/ }).click()
    assert.match(page.url(), /skill=react-native/)
    assert.equal(await page.locator('.skill-node[aria-pressed="true"]').count(), 1)

    await page.getByRole('button', { name: /^JournalFit\./ }).click()
    await page.waitForURL(/skillProject=journalfit/)
    assert.match(page.url(), /skillProject=journalfit/)
    await page.locator('.skill-details').getByRole('button', { name: /Explorar arquitectura|Explore architecture/ }).click()
    await page.locator('.architecture-explorer').waitFor()
    assert.match(page.url(), /architecture=journalfit/)
    assert.match(page.url(), /node=mobile-ui/)
    assert.equal(await page.locator('.architecture-node[data-selected="true"]').count(), 1)
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: /Clusters/ }).click()
    assert.match(page.url(), /skillView=clusters/)
    await page.locator('.skill-select select').nth(0).selectOption('frontend')
    assert.match(page.url(), /skillArea=frontend/)
    await page.locator('.skill-select select').nth(1).selectOption('production')
    assert.match(page.url(), /skillContext=production/)
    await page.getByRole('button', { name: /Mostrar todo|Show all/ }).click()
    await page.getByRole('button', { name: /Zoom in/ }).click()
    await page.getByRole('button', { name: /Separar|Explode/ }).click()
    await page.getByRole('button', { name: /Restablecer|Reset/ }).click()
    assert.doesNotMatch(page.url(), /skillArea|skillContext|skillView/)

    await page.getByRole('button', { name: /Recorrido|Guided tour/ }).click()
    assert.equal(await page.locator('.skill-tour-bar').getByText(/01 \/ 04/).count(), 1)
    await page.getByRole('button', { name: /Detener|Stop/ }).click()

    await page.goto(`${url}?skill=react&skillView=projects#stack`)
    await page.locator('.skill-map').waitFor()
    assert.equal(await page.locator('.skill-node[aria-pressed="true"]', { hasText: 'React' }).count(), 1)
    await page.goBack()

    for (const width of [320, 375, 768, 1024, 1440]) {
      for (const [theme, language] of [['light', 'en'], ['dark', 'es']]) {
        await page.setViewportSize({ width, height: 900 })
        await page.evaluate(([nextTheme, nextLanguage]) => { localStorage.setItem('theme', nextTheme); localStorage.setItem('language', nextLanguage) }, [theme, language])
        await page.goto(`${url}?skill=react&case=${width}-${theme}#stack`)
        await page.locator('#stack').scrollIntoViewIfNeeded()
        await page.locator('.skill-map').waitFor()
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
        assert.equal(await page.locator('html').getAttribute('lang'), language)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow at ${width} ${theme}`)
        if (width <= 375) assert.equal(await page.locator('.skill-node[data-dimmed="true"]:visible').count(), 0, 'mobile must show the local graph only')
      }
    }

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`${url}?skill=react#stack`)
    await page.locator('.skill-map').waitFor()
    assert.equal(await page.locator('.skill-packet').count(), 0)
    assert.deepEqual(errors, [])
  } finally {
    await browser.close()
  }
})().catch((error) => { console.error(error); process.exitCode = 1 })
