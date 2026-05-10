/* auth.js */
const EMAILJS_SERVICE     = 'service_sjxpfbm';
const EMAILJS_TPL_OTP     = 'template_vwb2kq7';
const EMAILJS_TPL_SOPORTE = 'template_m5lqdz5';

let pendingUser = null, otpCode = null, otpExpiry = null;

window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('sgff_user');
  if (user) enterStore(JSON.parse(user), false);
});

function enterStore(user, animate = true) {
  const auth  = document.getElementById('auth-screen');
  const store = document.getElementById('store-screen');
  if (animate) {
    auth.style.transition = 'opacity 0.5s ease';
    auth.style.opacity    = '0';
    setTimeout(() => {
      auth.style.display  = 'none';
      store.style.display = 'block';
      store.style.opacity = '0';
      store.style.transition = 'opacity 0.5s ease';
      setTimeout(() => { store.style.opacity = '1'; }, 30);
    }, 500);
  } else {
    auth.style.display  = 'none';
    store.style.display = 'block';
  }
  const nf = document.getElementById('from_name');
  const ef = document.getElementById('from_email');
  if (nf) nf.value = user.name;
  if (ef) ef.value = user.email;
  if (typeof renderProducts === 'function') renderProducts();
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('visible'));
  }, 600);
}

function switchAuthTab(tab) {
  ['login','register','verify'].forEach(t => {
    document.getElementById('auth-'+t).style.display = t===tab ? 'block':'none';
  });
  document.getElementById('atab-login').classList.toggle('active', tab==='login');
  document.getElementById('atab-register').classList.toggle('active', tab==='register');
  const tabs = document.querySelector('.auth-tabs');
  if (tabs) tabs.style.display = tab==='verify' ? 'none' : 'flex';
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;
  if (!email||!pass) { showToast('⚠️ Llena todos los campos'); return; }
  const users = JSON.parse(localStorage.getItem('sgff_users')||'[]');
  const user  = users.find(u=>u.email===email&&u.pass===pass);
  if (!user) { showToast('❌ Correo o contraseña incorrectos'); return; }
  localStorage.setItem('sgff_user', JSON.stringify(user));
  showToast(`✓ Bienvenido, ${user.name}!`);
  enterStore(user, true);
}

function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-pass').value;
  if (!name||!email||!pass) { showToast('⚠️ Llena todos los campos'); return; }
  if (pass.length<6) { showToast('⚠️ Contraseña mínimo 6 caracteres'); return; }
  const users = JSON.parse(localStorage.getItem('sgff_users')||'[]');
  if (users.find(u=>u.email===email)) { showToast('❌ Correo ya registrado'); return; }

  otpCode     = String(Math.floor(100000+Math.random()*900000));
  otpExpiry   = Date.now() + 10*60*1000;
  pendingUser = { name, email, pass };

  const btn = document.getElementById('btn-register');
  btn.textContent = 'Enviando código...';
  btn.disabled = true;

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TPL_OTP, {
    to_name: name, to_email: email, code: otpCode
  }).then(() => {
    showToast(`✓ Código enviado a ${email}`);
    document.getElementById('verify-email-label').textContent = email;
    switchAuthTab('verify');
    btn.textContent='Crear cuenta →'; btn.disabled=false;
  }).catch(err => {
    console.error(err);
    showToast('❌ Error al enviar. Verifica el correo');
    btn.textContent='Crear cuenta →'; btn.disabled=false;
  });
}

function doVerify() {
  const v = document.getElementById('otp-input').value.trim();
  if (!v) { showToast('⚠️ Ingresa el código'); return; }
  if (Date.now()>otpExpiry) { showToast('❌ Código expirado'); switchAuthTab('register'); return; }
  if (v!==otpCode) { showToast('❌ Código incorrecto'); return; }
  const users = JSON.parse(localStorage.getItem('sgff_users')||'[]');
  users.push(pendingUser);
  localStorage.setItem('sgff_users', JSON.stringify(users));
  localStorage.setItem('sgff_user',  JSON.stringify(pendingUser));
  showToast(`✓ ¡Bienvenido, ${pendingUser.name}!`);
  enterStore(pendingUser, true);
  otpCode=null; pendingUser=null;
}

function doLogout() {
  localStorage.removeItem('sgff_user');
  const store = document.getElementById('store-screen');
  const auth  = document.getElementById('auth-screen');
  store.style.transition='opacity 0.4s ease';
  store.style.opacity='0';
  setTimeout(()=>{
    store.style.display='none';
    auth.style.display='flex';
    auth.style.opacity='0';
    auth.style.transition='opacity 0.4s ease';
    setTimeout(()=>{ auth.style.opacity='1'; },30);
  },400);
  switchAuthTab('login');
  showToast('Sesión cerrada');
}

function handleContact(e) {
  e.preventDefault();
  const btn=document.getElementById('btn-send');
  btn.textContent='Enviando...'; btn.disabled=true;
  emailjs.send(EMAILJS_SERVICE, EMAILJS_TPL_SOPORTE, {
    from_name:  document.getElementById('from_name').value,
    from_email: document.getElementById('from_email').value,
    message:    document.getElementById('message').value,
  }).then(()=>{
    showToast('✓ Mensaje enviado. Te respondemos pronto!');
    document.getElementById('message').value='';
    btn.textContent='Enviar mensaje →'; btn.disabled=false;
  }).catch(()=>{
    showToast('❌ Error. Escríbenos por WhatsApp');
    btn.textContent='Enviar mensaje →'; btn.disabled=false;
  });
}
