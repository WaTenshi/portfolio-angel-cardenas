/* Run with Playwright available in NODE_PATH; YouTube is simulated locally. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const url = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4175/portfolio-angel-cardenas/';
const fakeYouTubeApi = `
(() => {
  const states = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };
  window.__fakePlayers = [];
  class Player {
    constructor(host, options) {
      this.options = options;
      this.videoId = options.videoId;
      this.state = states.CUED;
      this.currentTime = 0;
      this.duration = 186;
      this.volume = 72;
      this.muted = false;
      this.startedAt = 0;
      this.iframe = document.createElement('iframe');
      this.iframe.dataset.fakeYoutube = String(window.__fakePlayers.length + 1);
      this.iframe.title = 'YouTube';
      this.iframe.width = '360';
      this.iframe.height = '203';
      host.replaceWith(this.iframe);
      window.__fakePlayers.push(this);
      setTimeout(() => {
        options.events.onReady?.({ target: this });
        options.events.onStateChange?.({ target: this, data: states.CUED });
      });
    }
    emit(data) { this.state = data; this.options.events.onStateChange?.({ target: this, data }); }
    playVideo() { this.startedAt = Date.now(); this.emit(states.PLAYING); }
    pauseVideo() { this.currentTime = this.getCurrentTime(); this.emit(states.PAUSED); }
    loadVideoById(id) { this.videoId = id; this.currentTime = 0; this.emit(states.BUFFERING); setTimeout(() => this.playVideo()); }
    cueVideoById(id) { this.videoId = id; this.currentTime = 0; this.emit(states.CUED); }
    seekTo(value) { this.currentTime = Number(value); this.startedAt = Date.now(); }
    getCurrentTime() { return this.currentTime + (this.state === states.PLAYING ? (Date.now() - this.startedAt) / 1000 : 0); }
    getDuration() { return this.duration; }
    getPlayerState() { return this.state; }
    getVideoData() { return { video_id: this.videoId }; }
    getIframe() { return this.iframe; }
    setVolume(value) { this.volume = Number(value); }
    getVolume() { return this.volume; }
    mute() { this.muted = true; }
    unMute() { this.muted = false; }
    isMuted() { return this.muted; }
    fail(code = 150) { this.options.events.onError?.({ target: this, data: code }); }
    end() { this.emit(states.ENDED); }
    destroy() { this.iframe.remove(); }
  }
  window.YT = { Player, PlayerState: states };
  window.onYouTubeIframeAPIReady?.();
})();`;

(async () => {
  const browser = await chromium.launch({ headless: true, ignoreDefaultArgs: ['--disable-dev-shm-usage'], args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 }, colorScheme: 'dark' });
  const errors = [];
  let apiRequests = 0;
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://www.youtube.com/iframe_api', async (route) => {
    apiRequests += 1;
    await route.fulfill({ status: 200, contentType: 'text/javascript', body: fakeYouTubeApi });
  });
  await page.route('https://i.ytimg.com/**', (route) => route.fulfill({
    status: 200,
    contentType: 'image/svg+xml',
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="100%" height="100%" fill="#243028"/></svg>',
  }));

  try {
    await page.goto(url + 'blog/');
    await page.locator('.listening-section').waitFor();
    const trackCount = await page.locator('.listening-track').count();
    assert(trackCount >= 2);
    assert.deepEqual((await page.locator('.listening-track h3').allTextContents()).slice(0, 2), ['Jane!', 'chase']);
    assert.equal(await page.locator('.music-dock-collapsed').count(), 1);
    assert.equal(await page.locator('.music-youtube-mount').count(), 0);
    assert.equal(apiRequests, 0, 'YouTube API must remain lazy before playback');

    await page.locator('.listening-play').first().click();
    await page.locator('iframe[data-fake-youtube]').waitFor();
    await page.waitForFunction(() => window.__fakePlayers[0]?.state === 1);
    assert.equal(apiRequests, 1);
    assert.equal(await page.locator('.music-now-playing h2').innerText(), 'Jane!');
    const playerBox = await page.locator('iframe[data-fake-youtube]').boundingBox();
    assert(playerBox.width >= 200 && playerBox.height >= 200, 'visible YouTube player must be at least 200×200');

    await page.locator('button[aria-controls="music-queue"]').click();
    assert.equal(await page.locator('.music-queue li').count(), trackCount);
    await page.locator('.music-queue li').nth(1).locator('button').click();
    await page.waitForFunction(() => window.__fakePlayers[0].videoId === 'eiHqkDoFFFU' && window.__fakePlayers[0].state === 1);
    assert.equal(await page.locator('.music-now-playing h2').innerText(), 'chase');

    await page.locator('.music-progress-row input').evaluate((input) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '42');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('.music-volume-row input').evaluate((input) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '35');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForFunction(() => window.__fakePlayers[0].currentTime >= 42 && window.__fakePlayers[0].volume === 35);

    await page.evaluate(() => window.__fakePlayers[0].fail());
    await page.locator('.music-error').waitFor();
    const failedTrack = await page.evaluate(() => window.__fakePlayers[0].videoId);
    await page.locator('.music-error button').click();
    await page.waitForFunction((previous) => window.__fakePlayers[0].videoId !== previous && window.__fakePlayers[0].state === 1, failedTrack);

    const endedTrack = await page.evaluate(() => window.__fakePlayers[0].videoId);
    await page.evaluate(() => window.__fakePlayers[0].end());
    await page.waitForFunction((previous) => window.__fakePlayers[0].videoId !== previous && window.__fakePlayers[0].state === 1, endedTrack);

    await page.locator('.featured-story .story-art').click();
    await page.locator('.article-body').waitFor();
    assert(page.url().endsWith('/blog/del-codigo-a-la-realidad/'));
    assert.equal(await page.evaluate(() => window.__fakePlayers.length), 1, 'SPA navigation must preserve the player instance');
    assert.equal(await page.evaluate(() => window.__fakePlayers[0].state), 1, 'music must keep playing between blog views');
    assert.equal(await page.evaluate(() => performance.getEntriesByType('navigation').length), 1, 'blog navigation must not reload the document');

    await page.locator('.blog-controls button').nth(2).click();
    assert.equal(await page.locator('html').getAttribute('data-motion'), 'off');
    assert.equal(await page.locator('.music-disc').evaluate((element) => getComputedStyle(element).animationName), 'none');
    assert.equal(await page.evaluate(() => window.__fakePlayers[0].state), 1, 'motion preferences must not pause playback');

    await page.setViewportSize({ width: 320, height: 760 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const dockBox = await page.locator('.music-dock').boundingBox();
    assert(dockBox.x >= 0 && dockBox.x + dockBox.width <= 320, 'mobile dock must stay inside the viewport');

    await page.locator('.music-collapse').click();
    await page.locator('.music-dock-collapsed').waitFor();
    assert.equal(await page.evaluate(() => window.__fakePlayers[0].state), 2, 'minimizing must pause before hiding the official player');
    assert.deepEqual(errors, []);
    console.log({ checks: 'lazy YouTube, real controls, queue, seek, volume, errors, ended autoplay, SPA persistence, reduced motion, mobile bounds' });
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
