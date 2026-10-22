(function () {
  const target = document.getElementById('giscus-comments');
  if (!target) return;
  const cfg = window.VESPERQUILL_COMMENTS || {};
  if (!cfg.repo || !cfg.repoId || !cfg.categoryId) return;
  const note = document.getElementById('comments-setup-note');
  if (note) note.remove();
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  for (const [k,v] of Object.entries({
    'data-repo':cfg.repo,'data-repo-id':cfg.repoId,
    'data-category':cfg.category||'General','data-category-id':cfg.categoryId,
    'data-mapping':'pathname','data-strict':'1','data-reactions-enabled':'1',
    'data-emit-metadata':'0','data-input-position':'top','data-theme':'light',
    'data-lang':'en','data-loading':'lazy'
  })) s.setAttribute(k,v);
  target.appendChild(s);
})();
