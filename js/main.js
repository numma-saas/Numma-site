// NUMMA — menu mobile, formulaire, état actif
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  const closeMenu = () => {
    if (!links) return;
    links.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // Hamburger toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      // Lock scroll while menu is open (mobile)
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when any link (excluding top-level "has-dropdown" header if desired) is clicked
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (links.classList.contains('open')) closeMenu();
      });
    });
  }

  // Close mobile menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links && links.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close mobile menu on resize to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 960 && links && links.classList.contains('open')) {
        closeMenu();
      }
    }, 120);
  });

  // Highlight current page in nav
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Contact form: graceful fake submit
  const form = document.querySelector('form[data-contact]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Envoi en cours…';
      btn.disabled = true;
      setTimeout(() => {
        form.innerHTML = '<div style="text-align:center;padding:2rem 0;"><h3 style="color:var(--numma-purple-700);margin-bottom:.5rem;">Merci !</h3><p>Nous revenons vers vous sous 24 h ouvrées.</p></div>';
      }, 900);
    });
  }
});
