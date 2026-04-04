document.addEventListener('DOMContentLoaded', () => {

  // ---- Animaciones al hacer scroll ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('animate-in'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '0px 0px 100px 0px'
  });

  // Delay escalonado para service-cards
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.dataset.delay = i * 120;
  });

  // Observar todos los .animate-element
  document.querySelectorAll('.animate-element').forEach(el => observer.observe(el));

  // Forzar animación de elementos ya visibles en el viewport al cargar
  setTimeout(() => {
    document.querySelectorAll('.animate-element').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('animate-in');
        observer.unobserve(el);
      }
    });
  }, 100);

  // ---- Navbar scroll ----
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.querySelector('.navbar-links')?.classList.remove('open');
      document.querySelector('.hamburger')?.classList.remove('active');
    });
  });

  // ---- Hamburger mobile ----
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar-links');
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    hamburger?.classList.toggle('active');
  });

  // ---- Formulario AJAX sin redirección ----
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = `
            <div class="form-success">
              <div class="form-success-icon">✅</div>
              <h3>¡Mensaje enviado!</h3>
              <p>Gracias por contactarme. Te responderé a la brevedad posible.</p>
              <button class="btn btn-primary" style="margin-top:1rem;width:auto;" onclick="location.reload()">
                Enviar otro mensaje
              </button>
            </div>`;
        } else {
          throw new Error('Error');
        }
      } catch {
        btn.textContent = originalText;
        btn.disabled = false;
        let err = form.querySelector('.form-error-msg');
        if (!err) {
          err = document.createElement('p');
          err.className = 'form-error-msg';
          err.style.cssText = 'color:#e53e3e;margin-top:.5rem;font-size:.9rem;';
          form.appendChild(err);
        }
        err.textContent = '⚠️ Hubo un problema. Por favor intenta de nuevo.';
      }
    });
  }

  // ---- Estilos dinámicos ----
  const style = document.createElement('style');
  style.textContent = `
    .animate-element {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s ease-out, transform 0.7s ease-out;
    }
    .animate-element.animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px;
    }
    .hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background-color: var(--color-primary, #1D9E75);
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 768px) {
      .hamburger { display: flex; }
      .navbar-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(13,17,23,0.98);
        flex-direction: column;
        padding: 1rem 1.5rem;
        gap: 1rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 999;
      }
      .navbar-links.open { display: flex; }
    }

    .form-success { text-align: center; padding: 2rem 1rem; }
    .form-success-icon { font-size: 3rem; margin-bottom: 1rem; }
    .form-success h3 { color: var(--color-primary, #1D9E75); font-size: 1.5rem; margin-bottom: .5rem; }
    .form-success p { color: rgba(255,255,255,0.75); }
  `;
  document.head.appendChild(style);

  // ---- Fix icono GitHub (reemplazar emoji roto) ----
  document.querySelectorAll('a').forEach(a => {
    if (a.textContent.includes('GitHub')) {
      const icon = a.querySelector('.contact-icon, span:first-child');
      if (icon && (icon.textContent.includes('\uD83D') || icon.textContent.trim() === '')) {
        icon.textContent = '🐙';
      }
    }
  });

});
