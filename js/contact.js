function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');
  const submitBtn = document.getElementById('contactSubmit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (name.length < 2) {
      showStatus('error', 'Nombre debe tener al menos 2 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('error', 'Email inválido.');
      return;
    }

    if (message.length < 10) {
      showStatus('error', 'Mensaje debe tener al menos 10 caracteres.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '$ enviando...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        showStatus('success', 'Mensaje enviado correctamente. [OK]');
        form.reset();
      } else {
        showStatus('error', 'Error al enviar. Intenta de nuevo. [FAIL]');
      }
    } catch (err) {
      showStatus('error', 'Error de conexión. Intenta de nuevo. [FAIL]');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = '$ enviar<span class="cursor cursor--hidden"></span>';
  });

  function showStatus(type, message) {
    status.className = `contact-form__status contact-form__status--visible contact-form__status--${type}`;
    status.textContent = message;
    setTimeout(() => {
      status.classList.remove('contact-form__status--visible');
    }, 5000);
  }
}
