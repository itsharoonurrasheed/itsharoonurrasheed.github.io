'use strict';

/* ── Theme ─────────────────────────────────────── */
const root     = document.documentElement;
const btnLight = document.getElementById('btnLight');
const btnDark  = document.getElementById('btnDark');

function setTheme(t) {
  t === 'dark'
    ? root.setAttribute('data-theme','dark')
    : root.removeAttribute('data-theme');
  localStorage.setItem('theme', t);
  btnLight.classList.toggle('active', t === 'light');
  btnDark.classList.toggle('active',  t === 'dark');
}
setTheme(localStorage.getItem('theme') || 'light');
btnLight.addEventListener('click', () => setTheme('light'));
btnDark.addEventListener('click',  () => setTheme('dark'));

/* ── Intro → Portfolio transition ──────────────── */
const intro   = document.getElementById('intro');
const site    = document.getElementById('site');
const enterBtn= document.getElementById('enterBtn');

enterBtn.addEventListener('click', () => {
  intro.classList.add('exit');
  site.classList.add('show');
  intro.addEventListener('transitionend', () => intro.remove(), { once: true });
});

/* ── Active nav link on scroll ─────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── Reveal on scroll (fade-in) ─────────────────── */
const revealEls = document.querySelectorAll(
  '.hero-left, .hero-right, .tech-item, .proj-item, .about-left, .about-right, .contact-form, .connect-info'
);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 6) * 0.07}s`;
      entry.target.classList.add('reveal', 'in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ── Smooth scroll for all anchor links ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── Contact form handler ───────────────────────── */
function handleForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#16a34a';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}
