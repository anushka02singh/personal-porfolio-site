const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// ---------- Mobile nav ----------
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

// ---------- Sparkles (cursor trail + bursts) ----------
const SPARK_GLYPHS = ['✦', '✧', '★', '✶'];
const SPARK_COLORS = ['#ffffff', '#e0509f', '#c8a9f0', '#ffd9ef'];
function spawnSpark(x, y, spread, size) {
  const s = document.createElement('span');
  s.className = 'spark';
  s.textContent = SPARK_GLYPHS[Math.floor(Math.random() * SPARK_GLYPHS.length)];
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.style.setProperty('--c', SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]);
  s.style.setProperty('--sz', (size * (0.7 + Math.random() * 0.8)).toFixed(0) + 'px');
  s.style.setProperty('--dx', ((Math.random() - 0.5) * 2 * spread).toFixed(0) + 'px');
  s.style.setProperty('--dy', ((Math.random() - 0.3) * 2 * spread).toFixed(0) + 'px');
  document.body.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}
function sparkBurst(x, y) {
  for (let i = 0; i < 9; i++) spawnSpark(x, y, 70, 16);
}
if (finePointer && !prefersReducedMotion) {
  let lastSpark = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastSpark < 70) return;
    lastSpark = now;
    spawnSpark(e.clientX, e.clientY, 22, 11);
  });
}

// ---------- Contact: camera ----------
const contactForm = document.getElementById('contactForm');
const camera = document.getElementById('camera');
if (contactForm && camera) {
  const lens = document.getElementById('lens');
  const glint = camera.querySelector('.lens-glint');
  const caption = document.getElementById('printCaption');
  const note = document.getElementById('formNote');

  const shoot = () => {
    camera.classList.remove('shoot');
    void camera.offsetWidth; // restart the flash animation
    camera.classList.add('shoot');
  };

  // the lens glint follows the cursor around the camera
  if (finePointer && !prefersReducedMotion) {
    camera.addEventListener('pointermove', (e) => {
      const r = lens.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      glint.style.setProperty('--gx', Math.max(-1, Math.min(1, dx)) * 16 + 'px');
      glint.style.setProperty('--gy', Math.max(-1, Math.min(1, dy)) * 16 + 'px');
    });
  }
  lens.addEventListener('click', shoot);

  // static demo only — no backend attached
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('name').value || '').trim().split(' ')[0];
    shoot();
    setTimeout(() => {
      caption.textContent = name ? `thanks, ${name}! (demo — nothing sent)` : 'thanks! (demo — nothing sent)';
      note.textContent = 'Photo developed. This is a static demo — no message was actually sent.';
      camera.classList.add('printed');
      contactForm.reset();
    }, 450);
  });
}

// ---------- "Develop" reveal ----------
const developables = document.querySelectorAll('.polaroid, .project-card, .project-row-thumb-wrap, .shot-frame');
developables.forEach((el) => {
  const host = el.closest('.hang, .project-card-link, .shot-link, .project-row') || el;
  const idx = Array.prototype.indexOf.call(host.parentElement.children, host);
  el.style.transitionDelay = `${(idx % 4) * 110}ms`;
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
          // transition-delay is only for the reveal; clear it so hover tilt stays snappy
          setTimeout(() => { entry.target.style.transitionDelay = ''; }, 1600);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
  );
  developables.forEach((el) => observer.observe(el));
}

// ---------- Cursor wind on the clothesline ----------
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

// ---------- 3D tilt + holo glare + sparkle burst on project photos ----------
if (finePointer && !prefersReducedMotion) {
  document.querySelectorAll('.project-card, .project-row-thumb-wrap').forEach((card) => {
    card.addEventListener('pointerenter', (e) => sparkBurst(e.clientX, e.clientY));
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--ry', ((px - 0.5) * 18).toFixed(1) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 18).toFixed(1) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(0) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(0) + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// ---------- Test shots: the focus square follows the cursor ----------
document.querySelectorAll('.shot-view').forEach((v) => {
  if (!finePointer || prefersReducedMotion) return;
  const host = v.closest('.shot-link') || v;
  v.addEventListener('pointermove', (e) => {
    const r = v.getBoundingClientRect();
    v.style.setProperty('--fx', (e.clientX - r.left) + 'px');
    v.style.setProperty('--fy', (e.clientY - r.top) + 'px');
  });
  v.addEventListener('pointerleave', () => { v.style.removeProperty('--fx'); v.style.removeProperty('--fy'); });
  host.addEventListener('pointerenter', (e) => sparkBurst(e.clientX, e.clientY));
});

// ---------- Ticker speeds up with scroll ----------
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack && !prefersReducedMotion && tickerTrack.getAnimations) {
  const anim = tickerTrack.getAnimations()[0];
  if (anim) {
    let lastY = window.scrollY;
    let rate = 1;
    const loop = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      rate += (1 + Math.min(dy / 6, 7) - rate) * 0.08;
      anim.playbackRate = rate;
      requestAnimationFrame(loop);
    };
    loop();
  }
}

// ---------- Experience: "Now Playing" ----------
const player = document.getElementById('player');
const tracks = Array.from(document.querySelectorAll('.track'));
if (player && tracks.length) {
  const $ = (id) => document.getElementById(id);
  const nowTitle = $('nowTitle'), nowOrg = $('nowOrg'), nowDesc = $('nowDesc');
  const vYears = $('vYears'), axisFill = $('axisFill'), playBtn = $('playBtn');
  let current = 0, timer = null, userTookOver = false;

  const select = (i) => {
    current = (i + tracks.length) % tracks.length;
    tracks.forEach((t, j) => {
      t.classList.toggle('is-active', j === current);
      t.querySelector('.track-btn').setAttribute('aria-current', String(j === current));
    });
    const t = tracks[current];
    nowTitle.textContent = t.querySelector('.tt strong').textContent;
    nowOrg.textContent = t.querySelector('.tt small').textContent;
    nowDesc.textContent = t.querySelector('.track-desc').textContent;
    vYears.textContent = t.querySelector('.tyr').textContent;
    nowDesc.classList.remove('swap'); void nowDesc.offsetWidth; nowDesc.classList.add('swap');
    const s = +t.dataset.start, e = +t.dataset.end;
    axisFill.style.left = ((s - 2017) / 10) * 100 + '%';
    axisFill.style.width = ((e - s) / 10) * 100 + '%';
  };
  const play = () => {
    if (timer) return;
    player.classList.add('is-playing');
    playBtn.innerHTML = '&#10074;&#10074;';
    timer = setInterval(() => select(current + 1), 4800);
  };
  const pause = () => {
    clearInterval(timer); timer = null;
    player.classList.remove('is-playing');
    playBtn.innerHTML = '&#9654;';
  };

  tracks.forEach((t, i) => t.querySelector('.track-btn').addEventListener('click', () => { userTookOver = true; pause(); select(i); }));
  $('prevBtn').addEventListener('click', () => { userTookOver = true; select(current - 1); });
  $('nextBtn').addEventListener('click', () => { userTookOver = true; select(current + 1); });
  playBtn.addEventListener('click', () => { userTookOver = true; timer ? pause() : play(); });

  select(0);
  pause();
  // start spinning once it scrolls into view, unless the visitor prefers reduced motion
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { if (!userTookOver) play(); obs.disconnect(); }
    }, { threshold: 0.5 }).observe(player);
  }
}

// ---------- Case pages: window tabs + loading text ----------
document.querySelectorAll('[data-tabs]').forEach((root) => {
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  const activate = (i, focus) => {
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    panels.forEach((p, j) => p.classList.toggle('is-active', j === i));
    if (focus) tabs[i].focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); activate((i + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); activate((i - 1 + tabs.length) % tabs.length, true); }
    });
  });
});
const loadText = document.getElementById('loadText');
if (loadText) setTimeout(() => { loadText.innerHTML = 'Loaded &#10003;'; }, prefersReducedMotion ? 0 : 2100);

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
