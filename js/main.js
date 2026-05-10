/* main.js */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map((p, i) => {
    const paths  = getImagePaths(p);
    const imgTag = buildImgTag(paths, p.emoji);
    if (p.comingSoon) {
      return `
      <div class="product-card coming-soon-card" style="animation:sectionIn 0.4s ease ${i*0.07}s both">
        <div class="coming-soon-img">
          <div class="coming-soon-overlay">
            <span class="cs-lock">🔒</span>
            <span class="cs-label">Próximamente</span>
          </div>
          ${imgTag}
        </div>
        <div class="product-body">
          <span class="tier-badge tier-${p.tier}">${p.tierLabel}</span>
          <div class="product-name">${p.name}</div>
          ${p.sub ? `<div class="product-sub">${p.sub}</div>` : ''}
          <div class="product-desc">${p.desc}</div>
          <div class="product-price cs-price">— MXN</div>
          <div class="btn-unavailable">⏳ Aún no disponible</div>
        </div>
      </div>`;
    }
    return `
    <div class="product-card" onclick="openModal(PRODUCTS[${i}])"
         style="animation:sectionIn 0.4s ease ${i*0.07}s both">
      <div class="product-img-wrap">${imgTag}</div>
      <div class="product-body">
        <span class="tier-badge tier-${p.tier}">${p.tierLabel}</span>
        <div class="product-name">${p.name}</div>
        ${p.sub ? `<div class="product-sub">${p.sub}</div>` : ''}
        <div class="product-desc">${p.desc}</div>
        <div class="product-price">$${p.price} <span>MXN</span></div>
        <button class="btn-add" onclick="event.stopPropagation();addToCart(${p.id})">+ Agregar al carrito</button>
      </div>
    </div>`;
  }).join('');
}
