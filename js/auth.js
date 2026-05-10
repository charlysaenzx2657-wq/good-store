/* auth.js — Auth screen + EmailJS */

const EMAILJS_SERVICE     = 'service_sjxpfbm';
const EMAILJS_TPL_OTP     = 'template_vwb2kq7';
const EMAILJS_TPL_SOPORTE = 'template_m5lqdz5';

let pendingUser = null;
let otpCode     = null;
let otpExpiry   = null;

/* ── INIT: verificar sesión al cargar ── */
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('sgff_user');
  if (user) enterStore(JSON.parse(user));
});

function enterStore(user) {
  document.getElementById('auth-screen').style.display  = 'none';
  document.getElementById('store-screen').style.display = 'block';
  // Pre-llenar nombre en soporte
  const nameField = document.getElementById('from_name');
  if (nameField) nameField.value = user.name;
  const emailField = document.getElementById('from_email');
  if (emailField) emailField.value = user.email;
  // Render productos
  if (typeof renderProducts === 'function') renderProducts();
  // Activar reveals
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  }, 100);
}

/* ── TABS ── */
function switchAuthTab(tab) {
  document.getElementById('auth-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('auth-register').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('auth-verify').style.display   = 'none';
  document.getElementById('atab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('atab-register').classList.toggle('active', tab === 'register');
}

/* ── LOGIN ── */
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) { showToast('⚠️ Llena todos los campos'); return; }

  const users = JSON.parse(localStorage.getItem('sgff_users') || '[]');
  const user  = users.find(u => u.email === email && u.pass === pass);
  if (!user) { showToast('❌ Correo o contraseña incorrectos'); return; }

  localStorage.setItem('sgff_user', JSON.stringify(user));
  showToast(`✓ Bienvenido, ${user.name}!`);
  enterStore(user);
}

/* ── REGISTRO ── */
function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;

  if (!name || !email || !pass) { showToast('⚠️ Llena todos los campos'); return; }
  if (pass.length < 6)          { showToast('⚠️ Contraseña mínimo 6 caracteres'); return; }

  const users = JSON.parse(localStorage.getItem('sgff_users') || '[]');
  if (users.find(u => u.email === email)) { showToast('❌ Ese correo ya está registrado'); return; }

  otpCode     = String(Math.floor(100000 + Math.random() * 900000));
  otpExpiry   = Date.now() + 10 * 60 * 1000;
  pendingUser = { name, email, pass };

  const btn = document.getElementById('btn-register');
  btn.textContent = 'Enviando código...';
  btn.disabled = true;

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TPL_OTP, {
    to_name:  name,
    to_email: email,
    code:     otpCode,
  }).then(() => {
    showToast(`✓ Código enviado a ${email}`);
    document.getElementById('verify-email-label').textContent = email;
    document.getElementById('auth-register').style.display = 'none';
    document.getElementById('auth-verify').style.display   = 'block';
    document.getElementById('auth-login').style.display    = 'none';
    document.querySelector('.auth-tabs').style.display     = 'none';
    btn.textContent = 'Crear cuenta →';
    btn.disabled = false;
  }).catch((err) => {
    console.error(err);
    showToast('❌ Error al enviar. Verifica tu correo');
    btn.textContent = 'Crear cuenta →';
    btn.disabled = false;
  });
}

/* ── VERIFICAR OTP ── */
function doVerify() {
  const entered = document.getElementById('otp-input').value.trim();
  if (!entered) { showToast('⚠️ Ingresa el código'); return; }
  if (Date.now() > otpExpiry) {
    showToast('❌ El código expiró. Regístrate de nuevo');
    document.querySelector('.auth-tabs').style.display = 'flex';
    switchAuthTab('register'); return;
  }
  if (entered !== otpCode) { showToast('❌ Código incorrecto'); return; }

  const users = JSON.parse(localStorage.getItem('sgff_users') || '[]');
  users.push(pendingUser);
  localStorage.setItem('sgff_users', JSON.stringify(users));
  localStorage.setItem('sgff_user',  JSON.stringify(pendingUser));

  showToast(`✓ ¡Cuenta creada! Bienvenido, ${pendingUser.name}!`);
  otpCode = null; pendingUser = null;
  enterStore(JSON.parse(localStorage.getItem('sgff_user')));
}

/* ── LOGOUT ── */
function doLogout() {
  localStorage.removeItem('sgff_user');
  document.getElementById('store-screen').style.display = 'none';
  document.getElementById('auth-screen').style.display  = 'flex';
  document.querySelector('.auth-tabs').style.display    = 'flex';
  switchAuthTab('login');
  showToast('Sesión cerrada');
}

/* ── SOPORTE ── */
function handleContact(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-send');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TPL_SOPORTE, {
    from_name:  document.getElementById('from_name').value,
    from_email: document.getElementById('from_email').value,
    message:    document.getElementById('message').value,
  }).then(() => {
    showToast('✓ Mensaje enviado. Te respondemos pronto!');
    document.getElementById('message').value = '';
    btn.textContent = 'Enviar mensaje →';
    btn.disabled = false;
  }).catch(() => {
    showToast('❌ Error. Escríbenos por WhatsApp');
    btn.textContent = 'Enviar mensaje →';
    btn.disabled = false;
  });
}
