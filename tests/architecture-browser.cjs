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
    await page.locator('.project-card', { hasText: 'JournalFit' }).waitFor()
    assert.equal(await page.locator('.architecture-explorer').count(), 0)
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(({ name }) => name.includes('ProjectArchitectureExplorer'))), false, 'explorer bundle must stay lazy')
    await page.locator('.project-card', { hasText: 'JournalFit' }).locator('.architecture-link').click()
    await page.locator('.architecture-explorer').waitFor()
    assert.equal(await page.evaluate(() => performance.getEntriesByType('resource').some(({ name }) => name.includes('ProjectArchitectureExplorer'))), true, 'explorer bundle should load on demand')
    assert.match(page.url(), /architecture=journalfit/)
    assert.equal(await page.locator('.architecture-node').count(), 7)
    assert.equal(await page.locator('[role="dialog"]').getAttribute('aria-modal'), 'true')
    await page.locator('.architecture-node', { hasText: 'Routine service' }).click()
    await page.locator('.architecture-details', { hasText: 'Fuente privada verificada' }).waitFor()
    assert.equal(await page.locator('.architecture-code-button').count(), 0, 'private source must not expose previews')
    await page.getByRole('tab', { name: /Flujo de datos/ }).click()
    assert.match(page.url(), /view=data-flow/)
    await page.getByRole('button', { name: 'PLAY' }).click()
    await page.getByRole('tab', { name: /Decisiones/ }).click()
    assert.equal(await page.locator('.architecture-decision').count(), 3)
    await page.keyboard.press('Escape')
    await page.locator('.architecture-explorer').waitFor({ state: 'detached' })

    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      for (const theme of ['light', 'dark']) {
        const language = theme === 'light' ? 'en' : 'es'
        await page.setViewportSize({ width, height: 900 })
        await page.evaluate(([nextTheme, nextLanguage]) => { localStorage.setItem('theme', nextTheme); localStorage.setItem('language', nextLanguage) }, [theme, language])
        await page.goto(`${url}?architecture=certificados&view=architecture`)
        await page.locator('.architecture-explorer').waitFor()
        assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
        assert.equal(await page.locator('html').getAttribute('lang'), language)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `overflow at ${width} ${theme}`)
      }
    }
    assert.deepEqual(errors, [])
  } finally {
    await browser.close()
  }
})().catch((error) => { console.error(error); process.exitCode = 1 })
