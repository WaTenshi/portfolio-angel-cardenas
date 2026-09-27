/* Run with Playwright available in NODE_PATH after starting the preview server. */
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4175/portfolio-angel-cardenas/'

const installFakeAudioContext = async (page) => page.addInitScript(() => {
  window.__tacticalAudioProbe = { contexts: 0, starts: 0, stops: 0, resumes: 0, suspends: 0, closes: 0 }

  class FakeAudioParam {
    constructor() { this.value = 0 }
    setValueAtTime(value) { this.value = value }
    exponentialRampToValueAtTime(value) { this.value = value }
    setTargetAtTime(value) { this.value = value }
  }

  class FakeAudioNode {
    connect() { return this }
    disconnect() {}
  }

  class FakeGainNode extends FakeAudioNode {
    constructor() {
      super()
      this.gain = new FakeAudioParam()
    }
  }

  class FakeOscillatorNode extends FakeAudioNode {
    constructor() {
      super()
      this.type = 'sine'
      this.frequency = new FakeAudioParam()
      this.ended = null
    }
    addEventListener(type, listener) {
      if (type === 'ended') this.ended = listener
    }
    start() { window.__tacticalAudioProbe.starts += 1 }
    stop() {
      window.__tacticalAudioProbe.stops += 1
      const ended = this.ended
      this.ended = null
      if (ended) queueMicrotask(ended)
    }
  }

  class FakeAudioContext {
    constructor() {
      window.__tacticalAudioProbe.contexts += 1
      this.currentTime = 0
      this.destination = new FakeAudioNode()
    }
    createGain() { return new FakeGainNode() }
    createOscillator() { return new FakeOscillatorNode() }
    resume() {
      window.__tacticalAudioProbe.resumes += 1
      return Promise.resolve()
    }
    suspend() {
      window.__tacticalAudioProbe.suspends += 1
      return Promise.resolve()
    }
    close() {
      window.__tacticalAudioProbe.closes += 1
      return Promise.resolve()
    }
  }

  Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeAudioContext })
  Object.defineProperty(window, 'webkitAudioContext', { configurable: true, value: undefined })
})

;(async () => {
  const browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ['--disable-dev-shm-usage'], args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'dark' })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))

  try {
    await installFakeAudioContext(page)
    await page.addInitScript(() => {
      localStorage.setItem('language', 'es')
      localStorage.setItem('theme', 'dark')
      localStorage.setItem('motion-paused', 'false')
      localStorage.setItem('tour-sound-muted', 'false')
    })
    await page.goto(base)
    await page.getByRole('heading', { name: /Ángel/ }).first().waitFor()

    assert.deepEqual(await page.evaluate(() => window.__tacticalAudioProbe), {
      contexts: 0, starts: 0, stops: 0, resumes: 0, suspends: 0, closes: 0,
    }, 'loading the portfolio must not create an AudioContext')
    assert.equal(await page.locator('.tactical-tour-dialog').count(), 0)

    const desktopTrigger = page.locator('.header-tour-button')
    assert.equal(await desktopTrigger.isVisible(), true, 'desktop tour launcher must remain available in the header')
    await desktopTrigger.click()
    const dialog = page.locator('.tactical-tour-dialog[open]')
    await dialog.waitFor()
    assert.equal(await page.evaluate(() => window.__tacticalAudioProbe.contexts), 1)
    assert((await page.evaluate(() => window.__tacticalAudioProbe.starts)) > 0, 'the user gesture should start the tactical ringtone')
    assert.equal(await dialog.locator('.codec-portrait img').count(), 2)
    assert.match(await dialog.locator('.codec-portrait-angel img').getAttribute('alt'), /Ángel/)
    assert.match(await dialog.locator('.codec-portrait-chimuelo img').getAttribute('alt'), /Chimuelo/)

    await dialog.locator('.codec-dialogue').waitFor({ timeout: 5000 })
    await dialog.locator('.codec-portrait-angel.is-active').waitFor()
    assert.match(await dialog.locator('.codec-dialogue .sr-only').textContent(), /Chimuelo, tenemos una visita/)
    assert.equal(await dialog.getByRole('button', { name: 'Omitir comunicación' }).count(), 1)

    await dialog.getByRole('button', { name: 'Omitir comunicación' }).click()
    const tourCard = dialog.locator('.tactical-tour-card')
    await tourCard.waitFor()
    await page.locator('[data-tour-id="hero"].is-tactical-target').waitFor()
    await dialog.locator('.tactical-spotlight').waitFor({ timeout: 3000 })
    assert.match(await tourCard.textContent(), /Objetivo 01 \/ 14/)
    assert.match(await tourCard.textContent(), /Punto de inserción/)

    const route = [
      ['projects', 'Mapa de proyectos', '02'],
      ['projects-production', 'Clientes · En producción', '03'],
      ['projects-personal', 'Proyectos personales', '04'],
      ['experience', 'Registro de campo', '05'],
      ['about', 'Perfil del operador', '06'],
      ['stack', 'Mapa tecnológico', '07'],
      ['certificate-mobile', 'Desarrollo de Aplicaciones', '08'],
      ['certificate-ai', 'IA aplicada a negocios', '09'],
      ['certificate-data', 'Bootcamp de Ciencia de Datos', '10'],
      ['blog', 'Bitácora de construcción', '11'],
      ['lab', 'Tenshi Lab', '12'],
      ['contact-form', 'Cómo iniciar contacto', '13'],
      ['linkedin', 'Contexto profesional completo', '14'],
    ]
    for (const [target, title, number] of route) {
      await tourCard.getByRole('button', { name: 'Siguiente' }).click()
      await page.locator(`[data-tour-id="${target}"].is-tactical-target`).waitFor()
      await tourCard.getByRole('heading', { name: title }).waitFor()
      assert.match(await tourCard.textContent(), new RegExp(`Objetivo ${number} / 14`))
    }

    await tourCard.getByRole('button', { name: 'Completar' }).click()
    await dialog.getByRole('heading', { name: 'Misión completada.' }).waitFor()
    await dialog.getByRole('button', { name: 'Explorar por mi cuenta' }).click()
    await dialog.waitFor({ state: 'detached' })
    await page.waitForFunction(() => document.activeElement?.classList.contains('header-tour-button'))
    assert((await page.evaluate(() => window.__tacticalAudioProbe.closes)) >= 1)

    await desktopTrigger.click()
    await page.locator('.tactical-tour-dialog[open]').waitFor()
    assert.equal(await page.evaluate(() => window.__tacticalAudioProbe.contexts), 2)
    await page.keyboard.press('Escape')
    await page.locator('.tactical-tour-dialog').waitFor({ state: 'detached' })
    await page.waitForFunction(() => document.activeElement?.classList.contains('header-tour-button'))

    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto(base)
    await page.locator('.hero-tour-button').waitFor({ state: 'attached' })
    assert.equal(await page.locator('.hero-tour-button').isHidden(), true, 'mobile tour launcher must remain visually hidden for now')
    assert.equal(await page.evaluate(() => window.__tacticalAudioProbe.contexts), 0, 'mobile reload must remain silent before interaction')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'portfolio must not overflow at 320px')

    const mobileTrigger = page.locator('.hero-tour-button')
    await mobileTrigger.evaluate((element) => { element.style.setProperty('display', 'inline-flex', 'important') })
    await mobileTrigger.click()
    const mobileDialog = page.locator('.tactical-tour-dialog[open]')
    await mobileDialog.waitFor()
    assert.equal(await page.evaluate(() => window.__tacticalAudioProbe.contexts), 1)
    assert.equal(await mobileDialog.locator('.codec-portrait img').count(), 2)
    const codecBox = await mobileDialog.locator('.codec-shell').boundingBox()
    assert(codecBox.x >= 0 && codecBox.y >= 0)
    assert(codecBox.x + codecBox.width <= 320 && codecBox.y + codecBox.height <= 800)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'codec must not overflow at 320px')

    await mobileDialog.locator('.codec-incoming button, .codec-dialogue-actions button:first-child').click()
    const mobileCard = mobileDialog.locator('.tactical-tour-card')
    await mobileCard.waitFor()
    await mobileDialog.locator('.tactical-spotlight').waitFor({ timeout: 3000 })
    const mobileCardBox = await mobileCard.boundingBox()
    assert(mobileCardBox.x >= 0 && mobileCardBox.y >= 0)
    assert(mobileCardBox.x + mobileCardBox.width <= 320 && mobileCardBox.y + mobileCardBox.height <= 800)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'tour must not overflow at 320px')

    await page.keyboard.press('Escape')
    await page.locator('.tactical-tour-dialog').waitFor({ state: 'detached' })
    await page.waitForFunction(() => document.activeElement?.classList.contains('hero-tour-button'))

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(base)
    await page.getByRole('button', { name: 'Switch to English' }).click()
    assert.equal(await page.locator('html').getAttribute('lang'), 'en')
    await page.locator('.hero-tour-button').evaluate((element) => { element.style.setProperty('display', 'inline-flex', 'important') })
    await page.locator('.hero-tour-button').click()
    const reducedDialog = page.locator('.tactical-tour-dialog[open]')
    await reducedDialog.waitFor()
    assert.equal(await reducedDialog.getAttribute('class').then((value) => value.includes('motion-off')), true)
    assert.equal(await reducedDialog.locator('.codec-shell').evaluate((element) => getComputedStyle(element).animationName), 'none')
    await reducedDialog.locator('.codec-incoming button, .codec-dialogue-actions button:first-child').click()
    await reducedDialog.getByRole('heading', { name: 'Insertion point' }).waitFor()
    await page.keyboard.press('Escape')
    await page.locator('.tactical-tour-dialog').waitFor({ state: 'detached' })
    assert.deepEqual(errors, [])
  } finally {
    await browser.close()
  }
})().catch((error) => { console.error(error); process.exitCode = 1 })
