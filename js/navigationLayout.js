// Keep site controls below third-party notices without hiding those notices.
export function installNoticeLayout(doc = document) {
  let banner = null;
  const update = () => {
    const rect = banner?.getBoundingClientRect();
    const height = rect && rect.width > 0 && rect.height > 0 ? Math.max(0, rect.bottom) : 0;
    doc.documentElement.style.setProperty('--site-notice-height', `${Math.ceil(height)}px`);
  };
  const size = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
  const attributes = new MutationObserver(update);
  const find = () => {
    const next = doc.querySelector('[class*="api-load-alpha-banner"]');
    if (next !== banner) {
      size?.disconnect();
      attributes.disconnect();
      banner = next;
      if (banner) {
        size?.observe(banner);
        attributes.observe(banner, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] });
      }
    }
    update();
  };
  const observer = new MutationObserver(find);
  observer.observe(doc.body, { childList: true, subtree: true });
  window.addEventListener('resize', update, { passive: true });
  find();
  return () => {
    observer.disconnect(); size?.disconnect(); attributes.disconnect();
    window.removeEventListener('resize', update);
  };
}
