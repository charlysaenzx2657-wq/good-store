/* auth.js — sin login, tienda abierta */

// Soporte / Contacto
function handleContact(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-send');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  emailjs.send('service_sjxpfbm', 'template_m5lqdz5', {
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
