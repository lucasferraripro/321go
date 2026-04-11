// 321 GO! — main.js
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = ''; spans[1].style.opacity = ''; spans[2].style.transform = '';
    }
  });
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60 ? 'rgba(15,22,35,.97)' : 'rgba(15,22,35,.85)';
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.card, .copa-card, .contato-card, .feature-item').forEach((el, i) => {
  el.style.opacity = '0'; el.style.transform = 'translateY(32px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  el.dataset.delay = (i % 3) * 100;
  observer.observe(el);
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => { if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id'); });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current && !link.classList.contains('nav-cta')) link.style.color = '#f07040';
  });
});

const wppFloat = document.getElementById('wpp-float');
if (wppFloat) {
  wppFloat.style.opacity = '0'; wppFloat.style.transform = 'translateY(20px)'; wppFloat.style.transition = 'opacity .4s ease, transform .4s ease';
  window.addEventListener('scroll', () => {
    wppFloat.style.opacity = window.scrollY > 300 ? '1' : '0';
    wppFloat.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(20px)';
  });
}
