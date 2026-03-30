// --- Core Selectors ---
const navbar = document.querySelector('.navbar');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const heroImageWrapper = document.querySelector('.image-wrapper');
const revealElements = document.querySelectorAll('.reveal');
const typedTextSpan = document.querySelector(".typed-text");
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// --- Mobile Menu Toggle ---
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}


// --- Performance Optimized Handlers ---
let ticker = false;
const mouse = { x: 0, y: 0 };
const scrollPos = { y: window.scrollY };

// Throttled update function
function updateUI() {
    // 1. Navbar background change on scroll
    if (navbar) {
        if (scrollPos.y > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // 2. Custom Cursor (Direct Transform for Performance)
    if (cursorDot && cursorOutline) {
        cursorDot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
        cursorOutline.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    }

    // 3. 3D Tilt Effect on Hero Image
    if (heroImageWrapper) {
        const xAxis = (window.innerWidth / 2 - mouse.x) / 25;
        const yAxis = (window.innerHeight / 2 - mouse.y) / 25;
        heroImageWrapper.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(1.02)`;
    }

    ticker = false;
}

function requestTick() {
    if (!ticker) {
        requestAnimationFrame(updateUI);
        ticker = true;
    }
}

// --- Listeners ---

// Global Mouse listener
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    requestTick();
}, { passive: true });

// Global Scroll listener
window.addEventListener('scroll', () => {
    scrollPos.y = window.scrollY;
    requestTick();
}, { passive: true });

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Reveal elements on scroll
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
};
const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});
revealElements.forEach(el => revealObserver.observe(el));

// Initially reveal hero section on load
window.addEventListener('load', () => {
    setTimeout(() => {
        const hero = document.querySelector('#about');
        if(hero) hero.classList.add('active');
    }, 100);
});

// Cursor Hover Effects
document.querySelectorAll('a, button, .btn, .glass-card, .image-wrapper').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Card Glow Effect (Optimized: Cache rect on enter)
document.querySelectorAll('.glass-card').forEach(card => {
    let rect = card.getBoundingClientRect();
    
    card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', e => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

// Typing Effect
const textArray = [
    "Data Analytics Specialist.", 
    "Machine Learning Engineer.", 
    "Agentic AI Developer.", 
    "Problem Solver."
];
const typingDelay = 100;
const erasingDelay = 40;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (!typedTextSpan) return;
  if (charIndex < textArray[textArrayIndex].length) {
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (!typedTextSpan) return;
  if (charIndex > 0) {
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    textArrayIndex++;
    if(textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 400);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});
