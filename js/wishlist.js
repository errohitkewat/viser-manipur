/* VISER – wishlist state (localStorage) + wishlist page */
const Wish = {
  KEY: 'viser_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  has(id) { return this.get().includes(Number(id)); },
  toggle(id) {
    id = Number(id); let list = this.get(); const on = !list.includes(id);
    list = on ? [...list, id] : list.filter(x => x !== id);
    try { localStorage.setItem(this.KEY, JSON.stringify(list)); } catch (e) {}
    Wish.badge(); document.dispatchEvent(new CustomEvent('wish:change'));
    return on;
  },
  badge() { $$('.wish-count').forEach(el => { const n = Wish.get().length; el.textContent = n; el.hidden = n === 0; }); },
  sync() { $$('[data-wish]').forEach(b => { const on = Wish.has(b.dataset.wish); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); }
};

function renderWishlistPage() {
  const root = $('#wish-root'); if (!root) return;
  const items = Wish.get().map(getProduct).filter(Boolean);
  if (!items.length) {
    root.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>
      <h2>Your wishlist is empty</h2><p>Tap the heart on anything you like and it will wait for you here.</p>
      <a class="btn" href="shop.html">Browse the shop</a></div>`;
    return;
  }
  root.innerHTML = `<p class="count-line">${items.length} saved item${items.length > 1 ? 's' : ''}</p>
    <div class="pgrid">${items.map(p => `<div class="wcol">${productCard(p)}
      <div class="wact"><button class="btn sm" data-wadd="${p.id}">${p.inStock ? 'Add to cart' : 'Sold out'}</button><button class="link-btn" data-wremove="${p.id}">Remove</button></div></div>`).join('')}</div>`;
  Wish.sync();
}
document.addEventListener('click', e => {
  const add = e.target.closest('[data-wadd]'), rem = e.target.closest('[data-wremove]');
  if (add) {
    const p = getProduct(add.dataset.wadd); if (!p.inStock) return;
    if (p.sizes.length === 1) { Cart.add(p.id, p.sizes[0], p.colors[0], 1); toast(`${p.name} added to your bag`); }
    else openQuickView(p.id);
  }
  if (rem) { Wish.toggle(rem.dataset.wremove); toast('Removed from wishlist'); }
});
document.addEventListener('wish:change', () => { renderWishlistPage(); });
document.addEventListener('DOMContentLoaded', () => { Wish.badge(); renderWishlistPage(); Wish.sync(); });
