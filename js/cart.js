/* VISER – cart state (localStorage) + cart page rendering */
const FREE_SHIP_AT = 1999, SHIP_FEE = 99;
const Cart = {
  KEY: 'viser_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) {} Cart.badge(); document.dispatchEvent(new CustomEvent('cart:change')); },
  key: (id, size, color) => `${id}|${size}|${color}`,
  add(id, size, color, qty = 1) {
    const items = this.get(), k = this.key(id, size, color), f = items.find(i => i.key === k);
    if (f) f.qty = Math.min(10, f.qty + qty); else items.push({ key: k, id: Number(id), size, color, qty: Math.min(10, qty) });
    this.save(items);
  },
  setQty(k, q) { const items = this.get(), f = items.find(i => i.key === k); if (!f) return; f.qty = Math.max(1, Math.min(10, q)); this.save(items); },
  remove(k) { this.save(this.get().filter(i => i.key !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((n, i) => n + i.qty, 0); },
  lines() { return this.get().map(i => ({ ...i, p: getProduct(i.id) })).filter(l => l.p); },
  subtotal() { return this.lines().reduce((s, l) => s + l.p.price * l.qty, 0); },
  shipping() { const s = this.subtotal(); return s === 0 || s >= FREE_SHIP_AT ? 0 : SHIP_FEE; },
  total() { return this.subtotal() + this.shipping(); },
  badge() { $$('.bag-count').forEach(el => { const n = Cart.count(); el.textContent = n; el.hidden = n === 0; }); }
};

function renderCartPage() {
  const root = $('#cart-root'); if (!root) return;
  const lines = Cart.lines();
  if (!lines.length) {
    root.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
      <h2>Your bag is empty</h2><p>Nothing here yet. Start with something you'll actually wear.</p>
      <a class="btn" href="shop.html">Start shopping</a></div>`;
    return;
  }
  const sub = Cart.subtotal(), ship = Cart.shipping();
  const left = FREE_SHIP_AT - sub;
  root.innerHTML = `<div class="cart-grid">
    <div class="cart-lines">${lines.map(l => `
      <div class="cline" data-key="${esc(l.key)}">
        <a href="product.html?id=${l.p.id}" class="cimg"><img src="${l.p.image}" alt="${esc(l.p.name)}" loading="lazy"></a>
        <div class="cinfo">
          <a href="product.html?id=${l.p.id}" class="cname">${esc(l.p.name)}</a>
          <p class="cmeta">Size: ${esc(l.size)} &nbsp;·&nbsp; Colour: ${esc(l.color)}</p>
          <p class="cprice">${money(l.p.price)}</p>
          <div class="cact">
            <div class="qty"><button data-q="-1" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button data-q="1" aria-label="Increase quantity">+</button></div>
            <button class="link-btn" data-remove>Remove</button>
          </div>
        </div>
        <div class="ctotal">${money(l.p.price * l.qty)}</div>
      </div>`).join('')}
      <a class="link-btn back" href="shop.html">← Continue shopping</a>
    </div>
    <aside class="summary"><h2>Order summary</h2>
      <div class="srow"><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="srow"><span>Shipping</span><span>${ship ? money(ship) : 'Free'}</span></div>
      ${left > 0 ? `<p class="note">Add ${money(left)} more for free shipping.</p>` : `<p class="note ok">You've unlocked free shipping.</p>`}
      <div class="srow total"><span>Total</span><span>${money(sub + ship)}</span></div>
      <a class="btn full" href="checkout.html">Proceed to checkout</a>
      <p class="note">Taxes included. Demo store: no real payment is taken.</p>
    </aside></div>`;
}
document.addEventListener('click', e => {
  const line = e.target.closest('.cline'); if (!line) return;
  const k = line.dataset.key;
  const q = e.target.closest('[data-q]');
  if (q) { const cur = Cart.get().find(i => i.key === k); Cart.setQty(k, cur.qty + Number(q.dataset.q)); }
  if (e.target.closest('[data-remove]')) { Cart.remove(k); toast('Item removed from your bag'); }
});
document.addEventListener('cart:change', renderCartPage);
document.addEventListener('DOMContentLoaded', () => { Cart.badge(); renderCartPage(); });
