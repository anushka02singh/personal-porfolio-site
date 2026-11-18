// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Contact form — static demo only, no backend attached.
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = "Thanks for reaching out! (This is a static demo — no message was actually sent.)";
    contactForm.reset();
  });
}

// "Develop" reveal — polaroids fade in from grayscale/dark as they enter view,
// mimicking a photo developing. Falls back to fully visible if IntersectionObserver
// or prefers-reduced-motion isn't available.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const developables = document.querySelectorAll('.polaroid, .project-card, .project-row-thumb-wrap');

// stagger the "develop" cascade — each photo in a row/grid catches the
// light a beat after its neighbor, instead of all firing at once
developables.forEach((el, i) => {
  const host = el.closest('.hang') || el;
  const groupIndex = Array.prototype.indexOf.call(host.parentElement.children, host);
  const delay = Math.min(groupIndex, 6) * 90;
  el.style.transitionDelay = `${delay}ms`;
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  developables.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
  );
  developables.forEach((el) => observer.observe(el));
}

// Cursor "wind" — hanging polaroids tilt away from the pointer
const pushes = document.querySelectorAll('.hang-push');
if (pushes.length && !prefersReducedMotion) {
  window.addEventListener('pointermove', (e) => {
    pushes.forEach((p) => {
      const r = p.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = Math.abs(e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      const strength = Math.max(0, 1 - dy * 2.2);
      p.style.setProperty('--wind', (-dx * 22 * strength).toFixed(2) + 'deg');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
