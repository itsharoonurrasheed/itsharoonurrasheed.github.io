/* ============================================================
   HAROON UR RASHEED — Portfolio JavaScript
   ============================================================ */

'use strict';

// ─── Cursor ───────────────────────────────────────────────────
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
});

(function animFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(1.8)';
    cursorFollower.style.transform += ' scale(1.4)';
    cursorFollower.style.background = 'rgba(99,102,241,0.15)';
  });
  el.addEventListener('mouseleave', () => {
    cursorFollower.style.background = 'transparent';
  });
});

// ─── Navbar Scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
  const y = window.scrollY;

  // Navbar glass effect
  navbar.classList.toggle('scrolled', y > 30);

  // Back to top visibility
  backToTop.classList.toggle('visible', y > 400);

  // Active nav link highlighting
  let current = '';
  sections.forEach(sec => {
    if (y >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─── Back to Top ──────────────────────────────────────────────
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Hamburger Menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinksEl.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ─── Typing Animation ─────────────────────────────────────────
const typedTextEl = document.getElementById('typedText');
const words = [
  'CS Student',
  'Data Scientist',
  'Problem Solver',
  'Software Developer',
];
let wordIndex = 0;
let charIndex  = 0;
let isDeleting = false;

function typeWord() {
  const currentWord = words[wordIndex];
  if (!isDeleting) {
    typedTextEl.textContent = currentWord.slice(0, ++charIndex);
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeWord, 1800);
      return;
    }
    setTimeout(typeWord, 90);
  } else {
    typedTextEl.textContent = currentWord.slice(0, --charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
      setTimeout(typeWord, 400);
      return;
    }
    setTimeout(typeWord, 45);
  }
}
setTimeout(typeWord, 800);

// ─── Particle Canvas ──────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 70;
const particles = [];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 1.8 + 0.4;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.5 + 0.1;
    const hue = Math.random() > 0.5 ? 240 : 190;
    this.color = `hsla(${hue}, 80%, 70%, ${this.alpha})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── Scroll Animations (Intersection Observer) ────────────────
const aosItems = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bars when skills section visible
      if (entry.target.classList.contains('skill-card')) {
        entry.target.classList.add('visible');
      }
    }
  });
}, { threshold: 0.15 });

aosItems.forEach(el => aosObserver.observe(el));

// ─── Skill Cards Visibility for Bar Animation ─────────────────
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });
skillCards.forEach(c => skillObserver.observe(c));

// ─── Stats Counter Animation ──────────────────────────────────
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const target = +el.dataset.target;
        let count = 0;
        const step = target / 40;
        const interval = setInterval(() => {
          count += step;
          if (count >= target) { el.textContent = target; clearInterval(interval); }
          else el.textContent = Math.ceil(count);
        }, 40);
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── Skills Tab Filter ────────────────────────────────────────
const skillTabs = document.querySelectorAll('.skill-tab');
skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const category = tab.dataset.tab;
    skillCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
        card.classList.remove('visible');
      }
    });
  });
});

// ─── Contact Form ─────────────────────────────────────────────
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    form.style.opacity = '0';
    form.style.transform = 'scale(0.95)';
    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
    }, 300);
  }, 1500);
});

// ─── Smooth hover glow on project cards ───────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.08), var(--clr-surface) 70%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ─── Scroll indicator fade ────────────────────────────────────
const scrollInd = document.getElementById('scrollIndicator');
if (scrollInd) {
  window.addEventListener('scroll', () => {
    scrollInd.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });
}

// ─── Staggered animation delays for grid items ────────────────
document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.05}s`;
});

// ─── Light / Dark Theme Toggle ────────────────────────────────
const themeToggleBtn = document.getElementById('themeToggle');
const root           = document.documentElement;

function getCurrentTheme() {
  return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
  localStorage.setItem('portfolio-theme', theme);
  updateParticleColors(theme);
}

function toggleTheme() {
  const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';

  // Spin animation
  themeToggleBtn.classList.remove('spin');
  void themeToggleBtn.offsetWidth; // reflow to restart animation
  themeToggleBtn.classList.add('spin');
  themeToggleBtn.addEventListener('animationend', () => {
    themeToggleBtn.classList.remove('spin');
  }, { once: true });

  applyTheme(next);
}

themeToggleBtn.addEventListener('click', toggleTheme);

// Sync particle colors to active theme
function updateParticleColors(theme) {
  const isLight = theme === 'light';
  particles.forEach(p => {
    const hue = Math.random() > 0.5 ? 240 : 190;
    const alpha = isLight
      ? Math.random() * 0.3 + 0.08
      : Math.random() * 0.5 + 0.1;
    p.color = `hsla(${hue}, 70%, ${isLight ? '40%' : '70%'}, ${alpha})`;
  });
}

// Apply saved theme on JS load (CSS handles flash prevention)
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) applyTheme(savedTheme);

