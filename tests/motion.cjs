const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://127.0.0.1:8765', { waitUntil: 'domcontentloaded' });
      // Registra apenas a presença dos efeitos; não depende da duração de frames.
      await page.evaluate(() => {
        window.motionCalls = [];
        const original = Element.prototype.animate;
        Element.prototype.animate = function (frames, options) {
          window.motionCalls.push(this.className);
          return original.call(this, frames, options);
        };
      });
      for (const id of ['servicos', 'portfolio', 'sobre', 'contato', 'inicio']) {
        await page.locator(`.nav-links a[href="#${id}"]`).click();
        await page.waitForFunction(id => {
          const top = document.getElementById(id).getBoundingClientRect().top;
          return Math.abs(top - 100) < 4 || (id === 'inicio' && Math.abs(top) < 4);
        }, id);
        await page.locator(`.nav-links a[href="#${id}"][aria-current="location"]`).waitFor();
        assert.equal(new URL(page.url()).hash, '#' + id);
      }
      const count = await page.evaluate(() => window.motionCalls.length);
      assert.ok(reducedMotion === 'reduce' ? count === 0 : count > 0);
      await page.locator('.nav-links a[href="#portfolio"]').click();
      assert.equal(await page.locator('.portfolio-slide').count(), 1);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 375, height: 900 });
      await page.locator('.menu-toggle').click();
      await page.locator('.mobile-panel a[href="#sobre"]').click();
      await page.locator('.mobile-panel a[href="#sobre"][aria-current="location"]').waitFor({ state: 'attached' });
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
      await page.locator('.about-visual img').evaluate(image => image.decode());
      assert.ok(await page.locator('.about-visual img').evaluate(image => image.naturalWidth === 720 && image.src.endsWith('iguana-notebook-v2.webp')));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await page.locator('.about-visual').evaluate(el => getComputedStyle(el).opacity), '1');
      assert.deepEqual(errors, []);
      await page.close();
    }
    const noScript = await browser.newPage({ javaScriptEnabled: false });
    await noScript.goto('http://127.0.0.1:8765', { waitUntil: 'domcontentloaded' });
    assert.equal(await noScript.locator('#sobre .reveal').first().evaluate(el => getComputedStyle(el).opacity), '1');
    console.log('PASS: navigation, active links, entry animations, reduced motion, portfolio, mobile menu, notebook image, no-JS visibility.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
