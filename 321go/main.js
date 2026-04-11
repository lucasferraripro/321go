// ============================================================
// 321 GO! — Agência de Viagens — main.js
// ============================================================

// ---- Mobile menu ----
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  nav.classList.toggle('open');
  // Animate hamburger lines
  const spans = hamburger.querySelectorAll('span');
  if (nav.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on nav link click
nav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- Header scroll effect ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.style.background = 'rgba(15,22,35,.97)';
    header.style.borderBottomColor = 'rgba(255,255,255,.1)';
  } else {
    header.style.background = 'rgba(15,22,35,.85)';
    header.style.borderBottomColor = 'rgba(255,255,255,.06)';
  }
});

// ---- Scroll-reveal for cards ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on position
      const delay = (entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply to cards
document.querySelectorAll('.card, .copa-card, .contato-card, .feature-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(32px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  el.dataset.delay = (i % 3) * 100; // stagger by column
  observer.observe(el);
});

// ---- Smooth active nav highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      if (!link.classList.contains('nav-cta')) {
        link.style.color = '#f07040';
      }
    }
  });
});

// ---- Show/hide WhatsApp float button ----
const wppFloat = document.getElementById('wpp-float');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    wppFloat.style.opacity = '1';
    wppFloat.style.transform = 'translateY(0)';
  } else {
    wppFloat.style.opacity = '0';
    wppFloat.style.transform = 'translateY(20px)';
  }
});

// Initial state
wppFloat.style.opacity = '0';
wppFloat.style.transform = 'translateY(20px)';
wppFloat.style.transition = 'opacity .4s ease, transform .4s ease';

// ---- Copa card count-up for prices ----
function animateCountUp(el, target, prefix, suffix, duration) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = prefix + Math.floor(start).toLocaleString('pt-BR') + suffix;
  }, 16);
}

// ---- Add year to footer ----
const yearEls = document.querySelectorAll('.year');
yearEls.forEach(el => el.textContent = new Date().getFullYear());
