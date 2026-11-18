// refuse to be framed by another site (clickjacking)
if (window.top !== window.self) { document.documentElement.style.display = 'none'; try { window.top.location = window.self.location; } catch (e) {} }

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

  // sends through the form service set in data-endpoint; falls back to the visitor's own email app until one is set
  const endpoint = contactForm.dataset.endpoint || '';
  const configured = endpoint.startsWith('https://formspree.io/f/') && !endpoint.includes('YOUR_FORM_ID');
  const sendBtn = contactForm.querySelector('button[type="submit"]');
  const done = (first, msg) => {
    shoot();
    setTimeout(() => {
      caption.textContent = first ? `thanks, ${first}!` : 'thanks!';
      note.textContent = msg;
      camera.classList.add('printed');
      contactForm.reset();
    }, 450);
  };
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    const data = new FormData(contactForm);
    const first = String(data.get('name') || '').trim().split(' ')[0];
    if (data.get('_gotcha')) { done(first, 'Photo developed.'); return; } // bots fill the hidden field
    if (!configured) {
      // no form service set: still do the flash and print-out, then hand the message to the visitor's email app
      const to = ['anushka0singh', 'gmail.com'].join('@');
      const body = String(data.get('message')) + '\n\n' + String(data.get('name')) + ' (' + String(data.get('email')) + ')';
      const href = 'mailto:' + to + '?subject=' + encodeURIComponent('Portfolio message from ' + data.get('name')) + '&body=' + encodeURIComponent(body);
      done(first, 'Photo developed. Your email app should open so you can press send.');
      setTimeout(() => { window.location.href = href; }, 900);
      return;
    }
    sendBtn.disabled = true; note.textContent = 'Developing\u2026';
    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then((r) => { if (!r.ok) throw new Error('bad status'); done(first, 'Photo developed and sent! I will reply as soon as I can!'); })
      .catch(() => { note.textContent = 'That did not send. Please try again in a moment.'; })
      .finally(() => { sendBtn.disabled = false; });
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

// ---------- Experience: film roll ----------
const roll = document.getElementById('roll');
const frames = Array.from(document.querySelectorAll('.frame'));
if (roll && frames.length) {
  const vp = document.getElementById('rollVp'), trk = document.getElementById('rollTrk');
  const spool = document.getElementById('spool'), pol = roll.querySelector('.pol'), pt = roll.querySelector('.pt');
  const $ = (id) => document.getElementById(id);
  let cur = 0, shown = false, touched = false;

  const offsetFor = (i) => {
    const f = frames[i];
    const centered = vp.clientWidth / 2 - (f.offsetLeft + f.offsetWidth / 2);
    const min = Math.min(0, vp.clientWidth - trk.scrollWidth);
    return Math.max(min, Math.min(0, centered));
  };
  const go = (i, quiet) => {
    cur = Math.max(0, Math.min(frames.length - 1, i));
    const f = frames[cur];
    frames.forEach((fr, j) => fr.querySelector('.fbtn').setAttribute('aria-current', String(j === cur)));
    f.classList.add('seen');
    trk.style.transform = 'translateX(' + offsetFor(cur) + 'px)';
    spool.style.transform = 'rotate(' + (-cur * 140) + 'deg)';
    $('rollCnt').textContent = 'Frame ' + String(cur + 1).padStart(2, '0') + ' / ' + String(frames.length).padStart(2, '0');
    const fb = f.querySelector('.fbtn');
    $('pImg').textContent = 'FRAME ' + f.querySelector('.fn').textContent;
    pol.style.setProperty('--fc', f.style.getPropertyValue('--fc'));
    $('pCap').textContent = f.dataset.cap;
    $('pTitle').textContent = f.querySelector('.fr').textContent;
    $('pOrg').textContent = f.querySelector('.frame-org').textContent + ' \u00b7 ' + f.querySelector('.fy').textContent;
    $('pDesc').textContent = f.querySelector('.frame-desc').textContent;
    $('pTags').innerHTML = '';
    f.dataset.tags.split('|').forEach((t) => { const s = document.createElement('span'); s.textContent = t; $('pTags').appendChild(s); });
    if (!quiet) {
      pol.classList.remove('pop'); void pol.offsetWidth; pol.classList.add('pop');
      pt.classList.remove('swap'); void pt.offsetWidth; pt.classList.add('swap');
    }
  };

  frames.forEach((f, i) => f.querySelector('.fbtn').addEventListener('click', () => { if (!dragMoved) { touched = true; go(i); } }));
  $('rollPrev').addEventListener('click', () => { touched = true; go(cur - 1); });
  $('rollNext').addEventListener('click', () => { touched = true; go(cur + 1); });
  vp.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  });

  // drag the film sideways
  let startX = 0, startOff = 0, dragging = false, dragMoved = false;
  vp.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    touched = true; startX = e.clientX; startOff = offsetFor(cur); dragging = true; dragMoved = false;
  });
  vp.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!dragMoved && Math.abs(dx) > 6) { dragMoved = true; vp.classList.add('dragging'); vp.setPointerCapture(e.pointerId); }
    if (dragMoved) trk.style.transform = 'translateX(' + (startOff + dx) + 'px)';
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false; vp.classList.remove('dragging');
    if (dragMoved) {
      const dx = e.clientX - startX;
      go(Math.abs(dx) > 40 ? cur + (dx < 0 ? 1 : -1) : cur);
      setTimeout(() => { dragMoved = false; }, 0);
    }
  };
  vp.addEventListener('pointerup', endDrag);
  vp.addEventListener('pointercancel', endDrag);
  window.addEventListener('resize', () => go(cur, true));

  go(0, true);
  // the first frame is already developed; the rest develop in as the roll scrolls into view
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting && !shown) {
        shown = true; obs.disconnect();
        frames.forEach((_, i) => setTimeout(() => { if (!touched) go(i); }, 900 + i * 1100));
        setTimeout(() => { if (!touched) go(0); }, 900 + frames.length * 1100 + 600);
      }
    }, { threshold: 0.5 }).observe(roll);
  } else {
    frames.forEach((f) => f.classList.add('seen'));
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
