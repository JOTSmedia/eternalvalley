import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

function loadingScreen() {
  const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), {
    url: 'https://jotsmedia.github.io/eternalvalley/', runScripts: 'outside-only',
  });
  const w = dom.window;
  let now = 0, frames = [], timers = [], entered = 0, drawn = 0;
  const gradient = { addColorStop() {} };
  const context = new Proxy({}, { get(target, key) {
    if (key in target) return target[key];
    if (key.startsWith('create')) return () => gradient;
    if (key === 'arc' || key === 'drawImage') return () => { drawn++; };
    return () => {};
  } });
  w.HTMLCanvasElement.prototype.getContext = () => context;
  w.Image = class { complete = false; naturalWidth = 0; };
  w.performance.now = () => now;
  w.requestAnimationFrame = fn => { frames.push(fn); return frames.length; };
  w.setTimeout = (fn, delay) => { timers.push({ fn, at: now + delay }); return timers.length; };
  w.clearTimeout = () => {};
  w.enter = () => { entered++; };
  const script = [...w.document.scripts].find(s => s.textContent.includes('function initPhotorealCornerRevealPreloader'));
  w.eval(script.textContent);
  return { w, get entered() { return entered; }, get drawn() { return drawn; },
    advance(ms) {
      const end = now + ms;
      while (now < end) {
        now = Math.min(end, now + 16);
        const next = frames; frames = []; next.forEach(fn => fn(now));
        const due = timers.filter(t => t.at <= now); timers = timers.filter(t => t.at > now);
        due.forEach(t => t.fn());
      }
    }, close() { dom.window.close(); },
  };
}

test('a fast boot displays a rainbow before entering the site', () => {
  const screen = loadingScreen();
  assert.ok(screen.drawn >= 7, 'rainbow bands draw before the photo arrives');
  screen.w.__finishPreloader();
  screen.advance(1100);
  assert.equal(screen.entered, 0);
  assert.equal(screen.w.document.getElementById('preloader').classList.contains('is-done'), false);
  screen.advance(450);
  assert.equal(screen.entered, 1);
  assert.equal(screen.w.document.getElementById('preloaderPct').textContent, '100%');
  screen.close();
});

test('an unloaded application never reveals a dead navigation shell', () => {
  const screen = loadingScreen();
  screen.w.document.getElementById('preloader').click();
  screen.advance(12000);
  assert.equal(screen.entered, 0);
  assert.equal(screen.w.document.getElementById('preloader').classList.contains('is-done'), false);
  assert.equal(screen.w.document.getElementById('preloaderNote').classList.contains('hidden'), false);
  assert.ok(screen.w.document.getElementById('startupReloadBtn'));
  assert.equal(screen.w.document.getElementById('preloaderPct').hidden, true);
  screen.close();
});

test('a missed finish callback recovers from the completed application flag', () => {
  const screen = loadingScreen();
  screen.w.__rbvBooted = true;
  screen.advance(1600);
  assert.equal(screen.entered, 1);
  screen.close();
});

test('a module download failure immediately exposes a reload action', () => {
  const screen = loadingScreen();
  const module = screen.w.document.querySelector('script[type="module"][src]');
  module.dispatchEvent(new screen.w.Event('error'));
  assert.ok(screen.w.document.getElementById('startupReloadBtn'));
  assert.match(screen.w.document.getElementById('preloaderNote').textContent, /required site file/i);
  assert.equal(screen.entered, 0);
  screen.close();
});
