/* VISER – shared UI: header/footer, product card, quick view, search, slider, toasts */
const IG_URL = 'https://www.instagram.com/viser._.manipur/';
const ICON = {
  search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  ig: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".6" fill="currentColor"/></svg>'
};
const NAV = [['Home', 'index.html', 'home'], ['Shop', 'shop.html', 'shop'], ['Men', 'men.html', 'men'], ['Women', 'women.html', 'women'], ['Footwear', 'footwear.html', 'footwear'], ['Accessories', 'accessories.html', 'accessories'], ['About', 'about.html', 'about'], ['Contact', 'contact.html', 'contact']];

/* ---------- image fallback: never show a blank/broken image ---------- */
function fallbackSrc(alt, dark) {
  const t = String(alt || '').replace(/[<>&"']/g, '').slice(0, 40);
  const bg = dark ? '#2B2724' : '#E6E4DF', fg = dark ? '#F8F7F4' : '#191919', sub = dark ? '#B9B4AC' : '#777';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1000'><rect width='800' height='1000' fill='${bg}'/><text x='400' y='490' font-family='Arial,sans-serif' font-weight='700' font-size='60' letter-spacing='16' text-anchor='middle' fill='${fg}'>VISER</text><text x='400' y='545' font-family='Arial,sans-serif' font-size='24' text-anchor='middle' fill='${sub}'>${t}</text></svg>`);
}
function fixImg(img) { if (img.dataset.fb) return; img.dataset.fb = 1; img.removeAttribute('srcset'); img.src = fallbackSrc(img.alt, !!img.closest('[data-dark]')); }
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') fixImg(e.target); }, true);

/* ---------- toast ---------- */
function toast(msg) {
  let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- product card ---------- */
function priceHTML(p) { return `<span class="now">${money(p.price)}</span>${p.original ? ` <s>${money(p.original)}</s>` : ''}`; }
function productCard(p) {
  const d = discountPct(p);
  return `<article class="pcard">
    <div class="pimg">
      <a href="product.html?id=${p.id}" aria-label="${esc(p.name)}"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="600" height="750"></a>
      <div class="badges">${d ? `<span class="badge sale">−${d}%</span>` : ''}${p.isNew ? '<span class="badge">New</span>' : ''}${!p.inStock ? '<span class="badge dark">Sold out</span>' : ''}</div>
      <button class="wish-btn" data-wish="${p.id}" aria-label="Add ${esc(p.name)} to wishlist" aria-pressed="false">${ICON.heart}</button>
      <button class="qv-btn" data-quick="${p.id}">Quick view</button>
    </div>
    <div class="pinfo">
      <span class="pcat">${esc(p.cat)}</span>
      <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <p class="price">${priceHTML(p)}</p>
      <div class="dots">${p.colors.slice(0, 5).map(c => `<i title="${c}" style="background:${COLORS[c] || '#999'}"></i>`).join('')}</div>
    </div></article>`;
}
function renderGrid(el, list) { el.innerHTML = list.map(productCard).join(''); Wish.sync(); }

/* ---------- quick view ---------- */
function openQuickView(id) {
  const p = getProduct(id); if (!p) return;
  closeQuickView();
  let size = p.sizes.length === 1 ? p.sizes[0] : '', color = p.colors[0];
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'qv'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', p.name);
  m.innerHTML = `<div class="modal-bg" data-close></div><div class="modal-box qv-box">
    <button class="modal-x" data-close aria-label="Close">${ICON.close}</button>
    <div class="qv-img"><img src="${p.image}" alt="${esc(p.name)}"></div>
    <div class="qv-info"><span class="pcat">${esc(p.cat)}</span><h2>${esc(p.name)}</h2><p class="price lg">${priceHTML(p)}</p>
      <p class="qv-desc">${esc(p.description)}</p>
      <p class="opt-label">Colour: <b id="qvColor">${color}</b></p><div class="swatches">${p.colors.map((c, i) => `<button class="sw${i ? '' : ' on'}" data-color="${c}" title="${c}" aria-label="${c}" style="--c:${COLORS[c] || '#999'}"></button>`).join('')}</div>
      <p class="opt-label">Size</p><div class="sizes">${p.sizes.map(s => `<button class="size${p.sizes.length === 1 ? ' on' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
      <p class="err" id="qvErr" hidden>Please choose a size.</p>
      <div class="qv-actions"><button class="btn full" id="qvAdd" ${p.inStock ? '' : 'disabled'}>${p.inStock ? 'Add to bag' : 'Sold out'}</button><a class="link-btn" href="product.html?id=${p.id}">View full details</a></div>
    </div></div>`;
  document.body.appendChild(m); document.body.classList.add('lock');
  requestAnimationFrame(() => m.classList.add('open'));
  m.addEventListener('click', e => {
    if (e.target.closest('[data-close]')) return closeQuickView();
    const sw = e.target.closest('.sw'), sz = e.target.closest('.size');
    if (sw) { color = sw.dataset.color; $$('.sw', m).forEach(b => b.classList.toggle('on', b === sw)); $('#qvColor', m).textContent = color; }
    if (sz) { size = sz.dataset.size; $$('.size', m).forEach(b => b.classList.toggle('on', b === sz)); $('#qvErr', m).hidden = true; }
    if (e.target.closest('#qvAdd')) {
      if (!size) { $('#qvErr', m).hidden = false; return; }
      Cart.add(p.id, size, color, 1); toast(`${p.name} added to your bag`); closeQuickView();
    }
  });
  const f = $('.modal-x', m); f && f.focus();
}
function closeQuickView() { const m = $('#qv'); if (m) m.remove(); if (!$('.modal')) document.body.classList.remove('lock'); }

/* ---------- header / footer ---------- */
function buildChrome() {
  const page = document.body.dataset.page || '';
  const h = $('#site-header');
  if (h) h.innerHTML = `
  <div class="announce"><p>Discover the latest collection – <a href="shop.html">Shop VISER</a><span class="hide-sm"> &nbsp;|&nbsp; Free shipping on orders above ${money(FREE_SHIP_AT)}</span></p></div>
  <header class="header" id="header"><div class="header-in">
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
    <a class="logo" href="index.html" aria-label="VISER home">VISER</a>
    <nav class="nav" aria-label="Main">${NAV.map(n => `<a href="${n[1]}"${n[2] === page ? ' class="active" aria-current="page"' : ''}>${n[0]}</a>`).join('')}</nav>
    <div class="hicons">
      <button class="icon-btn" id="searchBtn" aria-label="Search">${ICON.search}</button>
      <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${ICON.heart}<span class="count wish-count" hidden>0</span></a>
      <a class="icon-btn" href="cart.html" aria-label="Shopping bag">${ICON.bag}<span class="count bag-count" hidden>0</span></a>
    </div></div></header>
  <div class="scrim" id="scrim"></div>
  <aside class="mnav" id="mnav" aria-label="Menu"><div class="mnav-top"><a class="logo" href="index.html">VISER</a><button class="icon-btn" id="mclose" aria-label="Close menu">${ICON.close}</button></div>
    <nav>${NAV.map(n => `<a href="${n[1]}"${n[2] === page ? ' class="active"' : ''}>${n[0]}</a>`).join('')}<a href="wishlist.html">Wishlist</a><a href="cart.html">Bag</a></nav>
    <a class="mnav-ig" href="${IG_URL}" target="_blank" rel="noopener">${ICON.ig} @viser._.manipur</a></aside>
  <div class="search-ov" id="searchOv" role="dialog" aria-label="Search"><div class="search-in">
    <form id="searchForm" role="search"><input id="searchInput" type="search" placeholder="Search t-shirts, sneakers, bags…" autocomplete="off" aria-label="Search products"><button class="icon-btn" aria-label="Search">${ICON.search}</button></form>
    <button class="search-x" id="searchClose" aria-label="Close search">${ICON.close}</button>
    <div class="search-res" id="searchRes"></div></div></div>`;
  const f = $('#site-footer');
  if (f) f.innerHTML = `<footer class="footer"><div class="wrap">
    <div class="fgrid">
      <div class="fbrand"><a class="logo" href="index.html">VISER</a><p>An independent fashion label from Manipur. Everyday essentials, streetwear and footwear made for the way you move.</p>
        <a class="ig-link" href="${IG_URL}" target="_blank" rel="noopener">${ICON.ig} @viser._.manipur</a></div>
      <div><h4>Shop</h4><a href="shop.html">All products</a><a href="men.html">Men</a><a href="women.html">Women</a><a href="footwear.html">Footwear</a><a href="accessories.html">Accessories</a></div>
      <div><h4>Support</h4><a href="contact.html">Contact us</a><a href="contact.html#shipping">Shipping information</a><a href="contact.html#returns">Returns &amp; exchange</a><a href="wishlist.html">Wishlist</a><a href="cart.html">Your bag</a></div>
      <div><h4>VISER</h4><a href="about.html">About us</a><a href="contact.html#privacy">Privacy policy</a><a href="contact.html#terms">Terms &amp; conditions</a><p class="ph">Imphal, Manipur, India<br>[Store address – to be added]<br>[Phone – to be added]<br>[Email – to be added]</p></div>
    </div>
    <div class="fbot"><p>© ${new Date().getFullYear()} VISER. All rights reserved.</p><p>Demo storefront – no real payments are processed.</p></div></div></footer>`;
}

function initChrome() {
  const burger = $('#burger'), mnav = $('#mnav'), scrim = $('#scrim');
  if (!burger) return;
  const set = open => { mnav.classList.toggle('open', open); scrim.classList.toggle('show', open); burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.classList.toggle('lock', open); };
  burger.onclick = () => set(!mnav.classList.contains('open')); $('#mclose').onclick = () => set(false); scrim.onclick = () => { set(false); $('#filters') && $('#filters').classList.remove('open'); document.body.classList.remove('lock'); scrim.classList.remove('show'); };
  $$('#mnav a').forEach(a => a.addEventListener('click', () => set(false)));
  const ov = $('#searchOv'), inp = $('#searchInput'), res = $('#searchRes');
  const openS = () => { ov.classList.add('open'); document.body.classList.add('lock'); setTimeout(() => inp.focus(), 60); };
  const closeS = () => { ov.classList.remove('open'); if (!$('.modal')) document.body.classList.remove('lock'); };
  $('#searchBtn').onclick = openS; $('#searchClose').onclick = closeS; ov.addEventListener('click', e => { if (e.target === ov) closeS(); });
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase(); if (q.length < 2) { res.innerHTML = ''; return; }
    const hits = PRODUCTS.filter(p => (p.name + ' ' + p.cat + ' ' + p.gender + ' ' + p.colors.join(' ')).toLowerCase().includes(q));
    res.innerHTML = hits.length ? hits.slice(0, 6).map(p => `<a class="sr" href="product.html?id=${p.id}"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"><span><b>${esc(p.name)}</b><small>${esc(p.cat)}</small></span><em>${money(p.price)}</em></a>`).join('') + (hits.length > 6 ? `<a class="sr-all" href="shop.html?q=${encodeURIComponent(q)}">See all ${hits.length} results</a>` : '')
      : '<p class="sr-none">No products found. Try “sneakers”, “hoodie” or “bag”.</p>';
  });
  $('#searchForm').addEventListener('submit', e => { e.preventDefault(); const q = inp.value.trim(); if (q) location.href = 'shop.html?q=' + encodeURIComponent(q); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); closeS(); closeQuickView(); $('#filters') && $('#filters').classList.remove('open'); } });
  const hd = $('#header'); const onS = () => hd.classList.toggle('scrolled', scrollY > 10); addEventListener('scroll', onS, { passive: true }); onS();
}

/* ---------- hero slider ---------- */
function initSlider() {
  $$('.hero').forEach(hero => {
    const slides = $$('.slide', hero), dots = $('.hero-dots', hero); let i = 0, timer;
    if (slides.length < 2) return;
    dots.innerHTML = slides.map((_, n) => `<button aria-label="Go to slide ${n + 1}"></button>`).join('');
    const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k !== i); }); $$('button', dots).forEach((b, k) => b.classList.toggle('on', k === i)); };
    const auto = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(i + 1), 6500); };
    $('[data-prev]', hero).onclick = () => { go(i - 1); auto(); }; $('[data-next]', hero).onclick = () => { go(i + 1); auto(); };
    $$('button', dots).forEach((b, k) => b.onclick = () => { go(k); auto(); });
    hero.addEventListener('mouseenter', () => clearInterval(timer)); hero.addEventListener('mouseleave', auto);
    let x0 = null; hero.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    hero.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) { go(i + (dx < 0 ? 1 : -1)); auto(); } x0 = null; });
    go(0); auto();
  });
}

/* ---------- misc ---------- */
function initReveal() {
  const els = $$('.reveal'); if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}
function initForms() {
  $$('.nl-form').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const em = $('input', f), msg = $('.nl-msg', f.parentElement);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim());
    msg.textContent = ok ? 'Thanks for subscribing. (Demo: your email is saved only in this browser.)' : 'Please enter a valid email address.'; msg.className = 'nl-msg ' + (ok ? 'ok' : 'bad');
    if (ok) { try { const l = JSON.parse(localStorage.getItem('viser_news') || '[]'); l.push(em.value.trim()); localStorage.setItem('viser_news', JSON.stringify(l)); } catch (x) {} f.reset(); }
  }));
  const cf = $('#contactForm');
  if (cf) cf.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    const chk = (name, fn) => { const el = cf.elements[name], bad = !fn(el.value.trim()); el.closest('.field').classList.toggle('bad', bad); if (bad) ok = false; };
    chk('name', v => v.length > 1); chk('email', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)); chk('phone', v => !v || /^[6-9]\d{9}$/.test(v.replace(/[\s+-]|^91/g, ''))); chk('message', v => v.length > 9);
    const out = $('#contactOut'); out.hidden = !ok; if (ok) { out.textContent = 'Thank you – your message has been recorded in this demo. (A real email service must be connected before messages reach VISER.)'; cf.reset(); }
  });
}
function renderHomeGrids() {
  $$('[data-grid]').forEach(el => {
    const kind = el.dataset.grid, n = Number(el.dataset.n || 8);
    const list = kind === 'new' ? PRODUCTS.filter(p => p.isNew && p.inStock).slice(0, n)
      : kind === 'best' ? PRODUCTS.filter(p => p.featured && !p.isNew && p.inStock).slice(0, n)
      : kind === 'related' ? [] : PRODUCTS.slice(0, n);
    if (kind !== 'related') renderGrid(el, list);
  });
}

document.addEventListener('click', e => {
  const q = e.target.closest('[data-quick]'), w = e.target.closest('[data-wish]');
  if (q) { e.preventDefault(); openQuickView(q.dataset.quick); }
  if (w) { e.preventDefault(); const on = Wish.toggle(w.dataset.wish); Wish.sync(); toast(on ? 'Saved to your wishlist' : 'Removed from wishlist'); }
});
buildChrome();
document.addEventListener('DOMContentLoaded', () => {
  initChrome(); initSlider(); renderHomeGrids(); initForms(); Cart.badge(); Wish.badge(); Wish.sync(); initReveal();
  $$('img').forEach(i => { if (i.complete && i.naturalWidth === 0 && i.getAttribute('src')) fixImg(i); });
  document.body.classList.add('ready');
});
