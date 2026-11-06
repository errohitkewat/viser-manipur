/* VISER – listing pages (shop, men, women, footwear, accessories): filters, sort, load more */
(function () {
  const rootEl = document.getElementById('shop-root'); if (!rootEl) return;
  const scope = document.body.dataset.scope || 'all';
  const base = PRODUCTS.filter(p => inScope(p, scope));
  const facet = ['footwear', 'accessories'].includes(scope) ? 'cat' : 'grp';
  const ORDER = ['T-shirts', 'Shirts', 'Hoodies', 'Jeans', 'Trousers', 'Dresses', 'Sneakers', 'Shoes', 'Casual Shoes', 'Sports Shoes', 'Accessories', 'Bags', 'Caps', 'Watches', 'Belts', 'Sunglasses'];
  const cats = [...new Set(base.map(p => p[facet]))].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const sizes = [...new Set(base.flatMap(p => p.sizes))];
  const colors = [...new Set(base.flatMap(p => p.colors))].sort();
  const PMIN = Math.floor(Math.min(...base.map(p => p.price)) / 100) * 100, PMAX = Math.ceil(Math.max(...base.map(p => p.price)) / 100) * 100;
  const PAGE = 12;
  const S = { gender: new Set(), cat: new Set(), size: new Set(), color: new Set(), stock: false, min: PMIN, max: PMAX, q: '', sort: 'featured', shown: PAGE };

  // URL params (e.g. shop.html?cat=Sneakers&gender=women&q=hoodie)
  const params = new URLSearchParams(location.search);
  const pc = params.get('cat'); if (pc && cats.includes(pc)) S.cat.add(pc);
  const pg = params.get('gender'); if (scope === 'all' && ['men', 'women'].includes(pg)) S.gender.add(pg);
  S.q = (params.get('q') || '').trim().toLowerCase();
  if (['newest', 'low', 'high', 'featured'].includes(params.get('sort'))) S.sort = params.get('sort');

  const filtersEl = document.getElementById('filters'), grid = document.getElementById('grid'), chipsEl = document.getElementById('chips');
  const countEl = document.getElementById('count'), moreBtn = document.getElementById('loadMore'), sortEl = document.getElementById('sort'), scrim = document.getElementById('scrim');

  const chk = (f, v, label) => `<label class="chk"><input type="checkbox" data-f="${f}" value="${esc(v)}"><span>${esc(label || v)}</span></label>`;
  filtersEl.innerHTML = `
    <div class="f-head"><h2>Filters</h2><button class="icon-btn f-close" aria-label="Close filters">${ICON.close}</button></div>
    ${scope === 'all' ? `<div class="fgroup"><h3>Shop for</h3>${chk('gender', 'men', 'Men')}${chk('gender', 'women', 'Women')}</div>` : ''}
    <div class="fgroup"><h3>Category</h3>${cats.map(c => chk('cat', c)).join('')}</div>
    <div class="fgroup"><h3>Price</h3>
      <p class="prange"><span id="pMinL"></span><span id="pMaxL"></span></p>
      <input type="range" id="pMin" min="${PMIN}" max="${PMAX}" step="100" value="${PMIN}" aria-label="Minimum price">
      <input type="range" id="pMax" min="${PMIN}" max="${PMAX}" step="100" value="${PMAX}" aria-label="Maximum price"></div>
    <div class="fgroup"><h3>Size</h3><div class="chips-row">${sizes.map(s => `<button type="button" class="size" data-f="size" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>
    <div class="fgroup"><h3>Colour</h3><div class="color-list">${colors.map(c => `<button type="button" class="cl" data-f="color" data-v="${c}"><i style="background:${COLORS[c] || '#999'}"></i>${c}</button>`).join('')}</div></div>
    <div class="fgroup"><h3>Availability</h3><label class="chk"><input type="checkbox" id="stockOnly"><span>In stock only</span></label></div>
    <div class="f-foot"><button class="btn full f-apply">Show results</button></div>`;

  const match = p => {
    if (S.gender.size && ![...S.gender].some(g => inScope(p, g))) return false;
    if (S.cat.size && !S.cat.has(p[facet])) return false;
    if (S.size.size && !p.sizes.some(s => S.size.has(s))) return false;
    if (S.color.size && !p.colors.some(c => S.color.has(c))) return false;
    if (S.stock && !p.inStock) return false;
    if (p.price < S.min || p.price > S.max) return false;
    if (S.q && !(p.name + ' ' + p.cat + ' ' + p.gender + ' ' + p.colors.join(' ')).toLowerCase().includes(S.q)) return false;
    return true;
  };
  const sorters = {
    featured: (a, b) => (b.featured - a.featured) || (a.id - b.id),
    newest: (a, b) => (b.isNew - a.isNew) || (b.id - a.id),
    low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price
  };
  const labelOf = { men: 'Men', women: 'Women' };

  function syncUI() {
    $$('input[data-f]', filtersEl).forEach(i => i.checked = S[i.dataset.f].has(i.value));
    $$('button[data-f]', filtersEl).forEach(b => b.classList.toggle('on', S[b.dataset.f].has(b.dataset.v)));
    $('#stockOnly').checked = S.stock; $('#pMin').value = S.min; $('#pMax').value = S.max;
    $('#pMinL').textContent = money(S.min); $('#pMaxL').textContent = money(S.max); sortEl.value = S.sort;
  }
  function render() {
    syncUI();
    const list = base.filter(match).sort(sorters[S.sort]);
    const vis = list.slice(0, S.shown);
    grid.innerHTML = vis.length ? vis.map(productCard).join('') : `<div class="empty wide"><h2>No products match these filters</h2><p>Try removing a filter or widening the price range.</p><button class="btn" data-clear>Clear all filters</button></div>`;
    Wish.sync();
    countEl.textContent = list.length ? `Showing ${vis.length} of ${list.length} product${list.length > 1 ? 's' : ''}` : 'Showing 0 products';
    moreBtn.hidden = vis.length >= list.length;
    $('.f-apply', filtersEl).textContent = `Show ${list.length} result${list.length === 1 ? '' : 's'}`;
    const chips = [];
    S.gender.forEach(v => chips.push(['gender', v, labelOf[v]])); S.cat.forEach(v => chips.push(['cat', v, v]));
    S.size.forEach(v => chips.push(['size', v, 'Size ' + v])); S.color.forEach(v => chips.push(['color', v, v]));
    if (S.stock) chips.push(['stock', '', 'In stock']);
    if (S.min > PMIN || S.max < PMAX) chips.push(['price', '', `${money(S.min)} – ${money(S.max)}`]);
    if (S.q) chips.push(['q', '', `“${S.q}”`]);
    chipsEl.hidden = !chips.length;
    chipsEl.innerHTML = chips.length ? `<span class="chips-l">Active filters</span>` + chips.map(c => `<button class="chip" data-chip="${c[0]}" data-v="${esc(c[1])}">${esc(c[2])} <b aria-hidden="true">×</b><span class="vh">remove</span></button>`).join('') + `<button class="link-btn" data-clear>Clear all</button>` : '';
  }
  function clearAll() { S.gender.clear(); S.cat.clear(); S.size.clear(); S.color.clear(); S.stock = false; S.min = PMIN; S.max = PMAX; S.q = ''; S.shown = PAGE; render(); }
  const toggle = (set, v) => { set.has(v) ? set.delete(v) : set.add(v); S.shown = PAGE; render(); };

  filtersEl.addEventListener('change', e => { const i = e.target; if (i.id === 'stockOnly') { S.stock = i.checked; S.shown = PAGE; render(); } else if (i.dataset.f) toggle(S[i.dataset.f], i.value); });
  filtersEl.addEventListener('click', e => {
    const b = e.target.closest('button[data-f]'); if (b) toggle(S[b.dataset.f], b.dataset.v);
    if (e.target.closest('.f-close, .f-apply')) closeDrawer();
  });
  $('#pMin').addEventListener('input', e => { S.min = Math.min(Number(e.target.value), S.max); S.shown = PAGE; render(); });
  $('#pMax').addEventListener('input', e => { S.max = Math.max(Number(e.target.value), S.min); S.shown = PAGE; render(); });
  sortEl.addEventListener('change', () => { S.sort = sortEl.value; S.shown = PAGE; render(); });
  moreBtn.addEventListener('click', () => { S.shown += PAGE; render(); });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-clear]')) clearAll();
    const c = e.target.closest('[data-chip]');
    if (c) { const k = c.dataset.chip, v = c.dataset.v; if (S[k] instanceof Set) S[k].delete(v); else if (k === 'stock') S.stock = false; else if (k === 'price') { S.min = PMIN; S.max = PMAX; } else if (k === 'q') S.q = ''; S.shown = PAGE; render(); }
    const t = e.target.closest('[data-set-cat]');
    if (t) { e.preventDefault(); S.cat = new Set([t.dataset.setCat]); S.shown = PAGE; render(); document.getElementById('grid-top').scrollIntoView({ behavior: 'smooth' }); }
  });

  // mobile drawer
  function closeDrawer() { filtersEl.classList.remove('open'); scrim.classList.remove('show'); document.body.classList.remove('lock'); }
  document.getElementById('filterBtn').addEventListener('click', () => { filtersEl.classList.add('open'); scrim.classList.add('show'); document.body.classList.add('lock'); });

  // "new arrivals" strip on collection pages
  const arr = document.getElementById('arrivals');
  if (arr) renderGrid(arr, base.filter(p => p.isNew && p.inStock).sort((a, b) => b.id - a.id).slice(0, 4));
  render();
})();
