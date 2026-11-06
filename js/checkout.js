/* VISER – checkout (frontend demo only: no payment is processed) */
(function () {
  const root = document.getElementById('checkout-root'); if (!root) return;
  const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  const lines = Cart.lines();
  if (!lines.length) { root.innerHTML = `<div class="empty"><h2>Your bag is empty</h2><p>Add something to your bag before checking out.</p><a class="btn" href="shop.html">Browse the shop</a></div>`; return; }
  const fld = (n, label, attrs = '', type = 'text', err = 'Required') => `<div class="field"><label for="${n}">${label}</label><input id="${n}" name="${n}" type="${type}" ${attrs}><small>${err}</small></div>`;
  root.innerHTML = `<div class="cart-grid"><form id="coForm" class="co-form" novalidate>
    <h2>Contact &amp; delivery</h2>
    <div class="two">${fld('name', 'Full name', 'autocomplete="name"', 'text', 'Enter your full name')}${fld('phone', 'Phone number', 'inputmode="numeric" maxlength="10" autocomplete="tel"', 'tel', 'Enter a valid 10-digit mobile number')}</div>
    ${fld('email', 'Email', 'autocomplete="email"', 'email', 'Enter a valid email address')}
    ${fld('address', 'Delivery address', 'autocomplete="street-address"', 'text', 'Enter your full address')}
    <div class="two">${fld('city', 'City', 'autocomplete="address-level2"', 'text', 'Enter your city')}
      <div class="field"><label for="state">State</label><select id="state" name="state"><option value="">Select state</option>${STATES.map(s => `<option${s === 'Manipur' ? ' value="Manipur"' : ''}>${s}</option>`).join('')}</select><small>Select your state</small></div></div>
    ${fld('pin', 'PIN code', 'inputmode="numeric" maxlength="6" autocomplete="postal-code"', 'text', 'Enter a valid 6-digit PIN code')}
    <h2>Payment</h2>
    <label class="pay"><input type="radio" name="pay" value="cod" checked><span><b>Cash on Delivery</b><small>Pay when your order arrives.</small></span></label>
    <label class="pay"><input type="radio" name="pay" value="upi"><span><b>UPI (demo)</b><small>Interface only – no payment is processed.</small></span></label>
    <div id="upiBox" hidden>${fld('upi', 'UPI ID', 'placeholder="name@bank"', 'text', 'Enter a valid UPI ID, e.g. name@bank')}</div>
    <p class="note">Shipping: ${money(SHIP_FEE)} per order, free above ${money(FREE_SHIP_AT)}. Estimated delivery 4–7 working days (placeholder).</p>
    <button class="btn full" type="submit">Place demo order</button></form>
    <aside class="summary"><h2>Order summary</h2>
      ${lines.map(l => `<div class="sitem"><div class="simg"><img src="${l.p.image}" alt="${esc(l.p.name)}"><b>${l.qty}</b></div><div><p>${esc(l.p.name)}</p><small>${esc(l.size)} · ${esc(l.color)}</small></div><span>${money(l.p.price * l.qty)}</span></div>`).join('')}
      <div class="srow"><span>Subtotal</span><span>${money(Cart.subtotal())}</span></div>
      <div class="srow"><span>Shipping</span><span>${Cart.shipping() ? money(Cart.shipping()) : 'Free'}</span></div>
      <div class="srow total"><span>Total</span><span>${money(Cart.total())}</span></div></aside></div>`;
  const f = $('#coForm');
  f.addEventListener('change', e => { if (e.target.name === 'pay') $('#upiBox').hidden = e.target.value !== 'upi'; });
  f.addEventListener('submit', e => {
    e.preventDefault(); let ok = true; const v = n => f.elements[n].value.trim();
    const rules = { name: x => x.length > 1, phone: x => /^[6-9]\d{9}$/.test(x), email: x => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x), address: x => x.length > 5, city: x => x.length > 1, state: x => !!x, pin: x => /^[1-9]\d{5}$/.test(x) };
    if (f.elements.pay.value === 'upi') rules.upi = x => /^[\w.\-]{2,}@[\w]{2,}$/.test(x);
    Object.keys(rules).forEach(n => { const bad = !rules[n](v(n)); f.elements[n].closest('.field').classList.toggle('bad', bad); if (bad && ok) { ok = false; f.elements[n].focus(); } });
    if (!ok) return;
    const orderId = 'VSR-' + Date.now().toString().slice(-6), total = Cart.total(), name = v('name'), pay = f.elements.pay.value;
    try { localStorage.setItem('viser_last_order', JSON.stringify({ orderId, total, name, items: lines.map(l => ({ id: l.id, size: l.size, color: l.color, qty: l.qty })), at: new Date().toISOString() })); } catch (x) {}
    Cart.clear();
    root.innerHTML = `<div class="confirm"><svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="10"/><path d="m7.5 12.5 3 3 6-7"/></svg>
      <h2>Thank you, ${esc(name.split(' ')[0])}.</h2><p>Your demo order <b>${orderId}</b> has been placed for ${money(total)} (${pay === 'cod' ? 'Cash on Delivery' : 'UPI demo'}).</p>
      <p class="note">This is a frontend prototype. No payment was taken and no order was sent to VISER.</p><a class="btn" href="shop.html">Continue shopping</a></div>`;
    scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
