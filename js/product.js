/* VISER – product detail page */
(function () {
  const root = document.getElementById('pd-root'); if (!root) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = getProduct(id);
  if (!p) { root.innerHTML = `<div class="empty"><h2>We couldn't find that product</h2><p>It may have been removed.</p><a class="btn" href="shop.html">Back to shop</a></div>`; return; }
  document.title = `${p.name} – VISER`;
  const sel = { size: p.sizes.length === 1 ? p.sizes[0] : '', color: p.colors[0], qty: 1 };
  const d = discountPct(p);
  const guide = ['Sneakers', 'Casual Shoes', 'Sports Shoes'].includes(p.cat)
    ? `<tr><th>UK</th><th>EU</th><th>Foot length (cm)</th></tr><tr><td>6</td><td>39</td><td>24.5</td></tr><tr><td>7</td><td>40</td><td>25.4</td></tr><tr><td>8</td><td>42</td><td>26.2</td></tr><tr><td>9</td><td>43</td><td>27.1</td></tr><tr><td>10</td><td>44</td><td>27.9</td></tr><tr><td>11</td><td>45</td><td>28.8</td></tr>`
    : ['Jeans', 'Trousers'].includes(p.cat)
      ? `<tr><th>Waist (in)</th><th>Waist (cm)</th><th>Hip (cm)</th></tr><tr><td>28</td><td>71</td><td>92</td></tr><tr><td>30</td><td>76</td><td>97</td></tr><tr><td>32</td><td>81</td><td>102</td></tr><tr><td>34</td><td>86</td><td>107</td></tr><tr><td>36</td><td>91</td><td>112</td></tr>`
      : `<tr><th>Size</th><th>Chest (in)</th><th>Length (in)</th></tr><tr><td>XS</td><td>34</td><td>26</td></tr><tr><td>S</td><td>36</td><td>27</td></tr><tr><td>M</td><td>38–40</td><td>28</td></tr><tr><td>L</td><td>42</td><td>29</td></tr><tr><td>XL</td><td>44–46</td><td>30</td></tr><tr><td>XXL</td><td>48</td><td>31</td></tr>`;
  const acc = (t, body, open) => `<details class="acc"${open ? ' open' : ''}><summary>${t}</summary><div>${body}</div></details>`;
  root.innerHTML = `
  <nav class="crumbs wrap" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=${encodeURIComponent(p.grp)}">${esc(p.cat)}</a> / <span>${esc(p.name)}</span></nav>
  <section class="pd wrap">
    <div class="gal"><div class="gal-track" id="galTrack">${p.images.map((s, i) => `<div class="gal-slide"><img src="${s}" alt="${esc(p.name)} – view ${i + 1}" ${i ? 'loading="lazy"' : ''}></div>`).join('')}</div>
      <div class="gal-thumbs" id="galThumbs">${p.images.map((s, i) => `<button class="${i ? '' : 'on'}" aria-label="Show image ${i + 1}"><img src="${s.replace('w=1100', 'w=200')}" alt="" loading="lazy"></button>`).join('')}</div></div>
    <div class="pd-info">
      <span class="pcat">${esc(p.cat)} · ${p.gender === 'unisex' ? 'Unisex' : p.gender === 'men' ? 'Men' : 'Women'}</span>
      <h1>${esc(p.name)}</h1>
      <p class="price lg">${priceHTML(p)} ${d ? `<span class="badge sale inline">−${d}%</span>` : ''}</p>
      <p class="rating" title="Demo placeholder">★★★★☆ <span>4.6 – demo rating (placeholder, not real reviews)</span></p>
      <p class="opt-label">Colour: <b id="colorName">${sel.color}</b></p>
      <div class="swatches" id="swatches">${p.colors.map((c, i) => `<button class="sw${i ? '' : ' on'}" data-color="${c}" title="${c}" aria-label="${c}" style="--c:${COLORS[c] || '#999'}"></button>`).join('')}</div>
      <p class="opt-label sizes-head">Size <button class="link-btn" id="guideBtn" type="button">Size guide</button></p>
      <div class="sizes" id="sizes">${p.sizes.map(s => `<button class="size${p.sizes.length === 1 ? ' on' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
      <p class="err" id="sizeErr" hidden>Please select a size.</p>
      <div class="buy-row"><div class="qty lg"><button id="qm" aria-label="Decrease quantity">−</button><span id="qv">1</span><button id="qp" aria-label="Increase quantity">+</button></div>
        <button class="btn grow" id="addBtn" ${p.inStock ? '' : 'disabled'}>${p.inStock ? 'Add to cart' : 'Sold out'}</button>
        <button class="wish-btn static" data-wish="${p.id}" aria-label="Add to wishlist" aria-pressed="false">${ICON.heart}</button></div>
      <button class="btn ghost full" id="buyBtn" ${p.inStock ? '' : 'disabled'}>Buy now</button>
      <div class="pin"><label for="pin">Check delivery</label><div class="pin-row"><input id="pin" inputmode="numeric" maxlength="6" placeholder="Enter 6-digit PIN code"><button class="btn sm" id="pinBtn" type="button">Check</button></div><p id="pinOut" class="note"></p></div>
      <p class="desc">${esc(p.description)}</p>
      ${acc('Product details', `<ul><li>Category: ${esc(p.cat)}</li><li>Available colours: ${p.colors.join(', ')}</li><li>Available sizes: ${p.sizes.join(', ')}</li><li>Style code: VSR-${String(p.id).padStart(4, '0')}</li></ul>`, true)}
      ${acc('Material &amp; care', `<p><b>Material:</b> ${esc(p.material)}</p><p><b>Care:</b> ${esc(p.care)}</p>`)}
      ${acc('Shipping &amp; returns', `<p>Free shipping above ${money(FREE_SHIP_AT)}, otherwise ${money(SHIP_FEE)}. Delivery timelines and the exchange window are placeholders – confirm with the VISER team before launch.</p>`)}
    </div>
  </section>
  <section class="wrap related"><h2 class="sec-title">You may also like</h2><div class="pgrid" id="related"></div></section>
  <div class="sticky-buy" id="stickyBuy"><div><b>${esc(p.name)}</b><span>${money(p.price)}</span></div><button class="btn sm" id="stickyAdd" ${p.inStock ? '' : 'disabled'}>Add to cart</button></div>
  <div class="modal" id="guideModal"><div class="modal-bg" data-gclose></div><div class="modal-box guide-box"><button class="modal-x" data-gclose aria-label="Close">${ICON.close}</button><h2>Size guide</h2><div class="tbl"><table>${guide}</table></div><p class="note">Indicative measurements for this demo store. Please confirm with VISER before launch.</p></div></div>`;

  const rel = PRODUCTS.filter(q => q.id !== p.id && (q.cat === p.cat || q.grp === p.grp)).concat(PRODUCTS.filter(q => q.id !== p.id && q.gender === p.gender)).filter((q, i, a) => a.indexOf(q) === i).slice(0, 4);
  renderGrid($('#related'), rel);

  const track = $('#galTrack'), thumbs = $$('#galThumbs button');
  thumbs.forEach((b, i) => b.onclick = () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }));
  track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); thumbs.forEach((b, k) => b.classList.toggle('on', k === i)); }, { passive: true });
  $('#swatches').onclick = e => { const b = e.target.closest('.sw'); if (!b) return; sel.color = b.dataset.color; $$('#swatches .sw').forEach(x => x.classList.toggle('on', x === b)); $('#colorName').textContent = sel.color; };
  $('#sizes').onclick = e => { const b = e.target.closest('.size'); if (!b) return; sel.size = b.dataset.size; $$('#sizes .size').forEach(x => x.classList.toggle('on', x === b)); $('#sizeErr').hidden = true; };
  const setQty = n => { sel.qty = Math.max(1, Math.min(10, n)); $('#qv').textContent = sel.qty; };
  $('#qm').onclick = () => setQty(sel.qty - 1); $('#qp').onclick = () => setQty(sel.qty + 1);
  const ready = () => { if (!sel.size) { $('#sizeErr').hidden = false; $('#sizes').scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; } return true; };
  const add = () => { if (!ready()) return false; Cart.add(p.id, sel.size, sel.color, sel.qty); return true; };
  $('#addBtn').onclick = () => { if (add()) toast(`${sel.qty} × ${p.name} (${sel.size}, ${sel.color}) added to your bag`); };
  $('#stickyAdd').onclick = () => $('#addBtn').click();
  $('#buyBtn').onclick = () => { if (add()) location.href = 'checkout.html'; };
  $('#pinBtn').onclick = () => { const v = $('#pin').value.trim(), o = $('#pinOut'); const ok = /^[1-9]\d{5}$/.test(v); o.className = 'note ' + (ok ? 'ok' : 'bad'); o.textContent = ok ? `Delivery to ${v} is available (demo result – estimate 4–7 working days).` : 'Please enter a valid 6-digit PIN code.'; };
  const gm = $('#guideModal'); $('#guideBtn').onclick = () => { gm.classList.add('open'); document.body.classList.add('lock'); };
  gm.addEventListener('click', e => { if (e.target.closest('[data-gclose]')) { gm.classList.remove('open'); document.body.classList.remove('lock'); } });
  Wish.sync();
})();
