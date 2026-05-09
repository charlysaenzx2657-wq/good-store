/* cart.js */
const WA_NUMBER = '526521038109';
let cart = [];

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.comingSoon) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  updateCartBadge();
  showToast(`✓ ${p.name} agregado al carrito`);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const total = cart.reduce((a, b) => a + b.qty, 0);
  const badge = document.getElementById('cart-badge');
  const dot = document.getElementById('cart-dot');
  if (total > 0) {
    badge.textContent = total;
    badge.style.display = 'inline-flex';
    badge.style.animation = 'none';
    badge.offsetHeight;
    badge.style.animation = 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)';
    if (dot) { dot.style.display = 'block'; }
  } else {
    badge.style.display = 'none';
    if (dot) { dot.style.display = 'none'; }
  }
}

function renderCart() {
  const el = document.getElementById('cartItems');
  if (!cart.length) {
    el.innerHTML = `<div class="cart-empty"><div class="empty-icon">🛒</div><p>Tu carrito está vacío</p></div>`;
    return;
  }
  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
  el.innerHTML = cart.map(item => {
    const paths = getImagePaths(item);
    const imgTag = buildImgTag(paths, item.emoji, 'cart-thumb-img');
    return `
    <div class="cart-item">
      <div class="cart-thumb">${imgTag}</div>
      <div class="cart-info">
        <div class="cart-name">${item.name}${item.qty > 1 ? ` <small style="color:var(--muted)">×${item.qty}</small>` : ''}</div>
        <div class="cart-qty">$${item.price} MXN c/u</div>
      </div>
      <div class="cart-price">$${item.price * item.qty} MXN</div>
      <button class="btn-rm" onclick="removeFromCart(${item.id})">Quitar</button>
    </div>`;
  }).join('') + `
    <div class="cart-total-row">
      <span class="cart-total-label">Total a pagar</span>
      <span class="cart-total-val">$${total} MXN</span>
    </div>
    <button class="btn-checkout" onclick="goCheckout()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:8px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.563 4.14 1.54 5.876L.057 23.428a.5.5 0 0 0 .609.611l5.737-1.505A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.925 0-3.72-.5-5.28-1.373l-.377-.216-3.908 1.026 1.01-3.8-.232-.39A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      Pedir por WhatsApp
    </button>`;
}

function goCheckout() {
  if (!cart.length) return;
  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);
  let msg = '🎯 *Hola SENSIS GOOD FF, quiero hacer un pedido:*\n\n';
  cart.forEach(item => {
    msg += `▸ *${item.name}*${item.qty > 1 ? ` ×${item.qty}` : ''} — $${item.price * item.qty} MXN\n`;
  });
  msg += `\n💰 *Total: $${total} MXN*\n\n¿Cómo procedo con el pago? 🙏`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('Abriendo WhatsApp con tu pedido 📲');
}
