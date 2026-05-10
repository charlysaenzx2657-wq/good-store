/* auth.js — Login, Registro con verificación por correo, Soporte EmailJS */

const EMAILJS_SERVICE   = 'service_sjxpfbm';
const EMAILJS_TPL_OTP   = 'template_vwb2kq7';
const EMAILJS_TPL_SOPORTE = 'template_m5lqdz5';

/* ══════════════════════════════
   SOPORTE / CONTACTO
══════════════════════════════ */
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
    document.getElementById('contact-form').reset();
    btn.textContent = 'Enviar mensaje →';
    btn.disabled = false;
  }).catch(() => {
    showToast('❌ Error al enviar. Escríbenos por WhatsApp');
    btn.textContent = 'Enviar mensaje →';
    btn.disabled = false;
  });
}

/* ══════════════════════════════
   LOGIN MODAL
══════════════════════════════ */
function openLogin() {
  const user = localStorage.getItem('sgff_user');
  if (user) {
    const u = JSON.parse(user);
    renderLoggedIn(u);
  } else {
    renderLoginForm();
  }
  document.getElementById('login-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLogin() {
  document.getElementById('login-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function switchTab(tab) {
  document.getElementById('form-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

/* ══════════════════════════════
   REGISTRO CON VERIFICACIÓN
══════════════════════════════ */
let pendingUser = null;
let otpCode     = null;
let otpExpiry   = null;

function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;

  if (!name || !email || !pass) { showToast('⚠️ Llena todos los campos'); return; }
  if (pass.length < 6)          { showToast('⚠️ Contraseña mínimo 6 caracteres'); return; }

  const users = JSON.parse(localStorage.getItem('sgff_users') || '[]');
  if (users.find(u => u.email === email)) { showToast('❌ Ese correo ya está registrado'); return; }

  // Generar código OTP 6 dígitos
  otpCode   = String(Math.floor(100000 + Math.random() * 900000));
  otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutos
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
    renderVerifyForm();
    btn.textContent = 'Crear cuenta →';
    btn.disabled = false;
  }).catch(() => {
    showToast('❌ Error al enviar. Verifica tu correo');
    btn.textContent = 'Crear cuenta →';
    btn.disabled = false;
  });
}

function doVerify() {
  const entered = document.getElementById('otp-input').value.trim();
  if (!entered) { showToast('⚠️ Ingresa el código'); return; }
  if (Date.now() > otpExpiry) { showToast('❌ El código expiró. Regístrate de nuevo'); renderRegisterForm(); return; }
  if (entered !== otpCode)    { showToast('❌ Código incorrecto'); return; }

  const users = JSON.parse(localStorage.getItem('sgff_users') || '[]');
  users.push(pendingUser);
  localStorage.setItem('sgff_users', JSON.stringify(users));
  localStorage.setItem('sgff_user', JSON.stringify(pendingUser));

  showToast(`✓ ¡Bienvenido, ${pendingUser.name}!`);
  otpCode = null; pendingUser = null;
  closeLogin();
  updateAccountBtn();
}

/* ══════════════════════════════
   LOGIN
══════════════════════════════ */
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email || !pass) { showToast('⚠️ Llena todos los campos'); return; }

  const users = JSON.parse(localStorage.getItem('sgff_users') || '[]');
  const user  = users.find(u => u.email === email && u.pass === pass);
  if (!user) { showToast('❌ Correo o contraseña incorrectos'); return; }

  localStorage.setItem('sgff_user', JSON.stringify(user));
  showToast(`✓ Bienvenido, ${user.name}!`);
  closeLogin();
  updateAccountBtn();
}

function doLogout() {
  localStorage.removeItem('sgff_user');
  showToast('Sesión cerrada');
  closeLogin();
  updateAccountBtn();
}

/* ══════════════════════════════
   RENDERS DINÁMICOS
══════════════════════════════ */
function renderLoginForm() {
  document.getElementById('login-tabs').style.display = 'flex';
  switchTab('login');
}

function renderRegisterForm() {
  document.getElementById('login-tabs').style.display = 'flex';
  switchTab('register');
}

function renderVerifyForm() {
  document.getElementById('login-tabs').style.display = 'none';
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-register').innerHTML = `
    <div class="login-logo">
      <img src="img/sistema-sensis.jpg" alt="Logo" onerror="this.style.display='none'">
      <span>Verificar correo</span>
    </div>
    <p style="font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.6">
      Te enviamos un código de 6 dígitos a <strong style="color:var(--text)">${pendingUser.email}</strong>
    </p>
    <div class="form-group">
      <label>Código de verificación</label>
      <input type="text" id="otp-input" placeholder="123456" maxlength="6"
        style="font-size:24px;letter-spacing:8px;text-align:center" oninput="this.value=this.value.replace(/\D/g,'')">
    </div>
    <button class="btn-primary" style="width:100%;margin-top:12px" onclick="doVerify()">Verificar →</button>
    <p class="login-note"><a onclick="renderRegisterForm()">← Volver</a></p>`;
  document.getElementById('form-register').style.display = 'block';
}

function renderLoggedIn(u) {
  document.getElementById('login-tabs').style.display = 'none';
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-register').style.display = 'none';

  // Mostrar perfil
  const el = document.getElementById('form-login');
  el.style.display = 'block';
  el.innerHTML = `
    <div style="text-align:center;padding:16px 0">
      <div style="font-size:52px;margin-bottom:10px">👤</div>
      <p style="font-size:18px;font-weight:700;color:var(--text);font-family:'Rajdhani',sans-serif">${u.name}</p>
      <p style="font-size:13px;color:var(--muted);margin-bottom:24px">${u.email}</p>
      <button class="btn-primary" style="width:100%" onclick="doLogout()">Cerrar sesión</button>
    </div>`;
}

function updateAccountBtn() {
  const btn  = document.querySelector('.btn-login-nav');
  const user = localStorage.getItem('sgff_user');
  if (btn) btn.textContent = user ? `👤 ${JSON.parse(user).name.split(' ')[0]}` : '👤 Cuenta';
}

window.addEventListener('DOMContentLoaded', updateAccountBtn);
