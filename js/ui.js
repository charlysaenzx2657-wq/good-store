/* ui.js — navegación, toast, modal, imágenes */

function buildImgTag(paths, emoji, extraClass) {
  const cls = extraClass || '';
  const escapedPaths = JSON.stringify(paths);
  return `<img
    src="${paths[0]}"
    class="${cls}"
    style="width:100%;height:100%;object-fit:cover;display:block"
    onerror="tryNextImage(this,${escapedPaths},1,'${emoji}')"
    alt="Producto"
  >`;
}

function tryNextImage(img, paths, index, emoji) {
  if (index < paths.length) {
    img.src = paths[index];
    img.onerror = () => tryNextImage(img, paths, index + 1, emoji);
  } else {
    const ph = document.createElement('div');
    ph.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:var(--surface2)';
    ph.innerHTML = `<span style="font-size:36px">${emoji}</span><span style="font-size:10px;color:var(--muted);letter-spacing:0.5px">SIN IMAGEN</span>`;
    img.replaceWith(ph);
  }
}

function showSection(id) {
  document.querySelectorAll('.page-section').forEach(s => {
    s.classList.add('hidden');
    s.style.animation = '';
  });
  const target = document.getElementById('section-' + id);
  if (target) {
    target.classList.remove('hidden');
    void target.offsetHeight;
    target.style.animation = 'sectionIn 0.4s ease both';
  }
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-section="${id}"]`);
  if (btn) btn.classList.add('active');
  if (id === 'cart') renderCart();
  const bar = document.querySelector('.socials-bar');
  if (bar) window.scrollTo({ top: bar.offsetTop - 70, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function openModal(product) {
  if (product.comingSoon) return;
  const paths = getImagePaths(product);
  const imgTag = buildImgTag(paths, product.emoji);
  document.getElementById('modal-content').innerHTML = `
    <div style="border-radius:10px;overflow:hidden;margin-bottom:18px;height:200px;background:var(--surface2)">
      ${imgTag}
    </div>
    <span class="tier-badge tier-${product.tier}" style="margin-bottom:12px">${product.tierLabel}</span>
    <h3 style="font-family:'Rajdhani',sans-serif;font-size:24px;font-weight:700;color:var(--text);margin-bottom:6px">${product.name}</h3>
    ${product.sub ? `<p style="font-size:13px;color:var(--muted);margin-bottom:10px">${product.sub}</p>` : ''}
    <p style="font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:16px">${product.desc}</p>
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <span style="font-family:'Rajdhani',sans-serif;font-size:28px;font-weight:700;color:var(--gold-lt)">$${product.price} <span style="font-size:14px;color:var(--muted);font-weight:400">MXN</span></span>
      <button class="btn-primary" onclick="addToCart(${product.id});closeModal()">Agregar al carrito</button>
    </div>`;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

window.addEventListener('scroll', () => {
  document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 20);
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
});

document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});

function handleContact(e) {
  e.preventDefault();
  showToast('✓ Mensaje enviado. ¡Te respondemos pronto!');
  e.target.reset();
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
