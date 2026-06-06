/* ============================================================
   BISHAM SILWAL — PORTFOLIO WEBSITE
   script.js — All interactivity, animations, and effects
   
   SECTIONS:
   1. Custom Cursor
   2. Particle Background
   3. Loading Screen
   4. Navigation (scroll behavior + mobile menu)
   5. Scroll Progress Bar
   6. Scroll Reveal Animations
   7. Animated Counters
   8. Typing Text Animation
   9. Skill Bar Animations
   10. 3D Tilt Card Effect
   11. Project Filter (Portfolio page)
   12. Scroll-to-Top Button
   13. Page Transition
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. CUSTOM CURSOR
  // The cursor-dot moves instantly; cursor-ring follows with delay.
  // On button/link hover → CSS class "cursor-hover" expands ring.
  // ============================================================
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot moves instantly
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    }
  });

  // Ring uses requestAnimationFrame for smooth lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor expands on hover over interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .glass-card, .skill-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });

  // ============================================================
  // 2. PARTICLE BACKGROUND
  // Creates animated dots on a canvas element.
  // HOW TO ADJUST: change particleCount, speed, or colors below.
  // ============================================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80; // Reduce for better performance on slow devices

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.vx   = (Math.random() - 0.5) * 0.3;
        this.vy   = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
        // Randomly pick blue or cyan tones
        const colors = ['59,130,246', '6,182,212', '139,92,246'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    // Draw connecting lines between nearby particles
    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
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
  }

  // ============================================================
  // 3. LOADING SCREEN
  // Hides after 2 seconds. Adjust timeout for faster/slower loading.
  // ============================================================
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger reveal animations after loader hides
      triggerReveal();
    }, 2000);
  } else {
    triggerReveal();
  }

  // ============================================================
  // 4. NAVIGATION
  // ============================================================
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  // Add "scrolled" class when user scrolls down → adds glass effect
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
  }, { passive: true });

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close menu when any link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // 5. SCROLL PROGRESS BAR
  // ============================================================
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    }
  }, { passive: true });

  // ============================================================
  // 6. SCROLL REVEAL ANIMATIONS
  // Elements with class "reveal" animate in when they enter viewport.
  // ============================================================
  function triggerReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    const observer  = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Also trigger skill bars when they reveal
          const bar = entry.target.querySelector('.skill-bar-fill');
          if (bar) {
            bar.style.width = bar.dataset.width || '80%';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  }

  // ============================================================
  // 7. ANIMATED COUNTERS
  // Elements with class "counter" count up from 0 to data-target.
  // e.g. <span class="counter stat-number" data-target="5">0</span>
  // ============================================================
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '+');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ============================================================
  // 8. TYPING TEXT ANIMATION
  // Cycles through titles defined in data-texts attribute.
  // e.g. <span id="typing-text" data-texts='["Title 1","Title 2"]'></span>
  // ============================================================
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    let texts, textIndex = 0, charIndex = 0, isDeleting = false;

    try {
      texts = JSON.parse(typingEl.dataset.texts);
    } catch {
      texts = ['Database Administrator', 'SQL Server Specialist', 'IT Support Specialist'];
    }

    function typeText() {
      const current = texts[textIndex];
      if (isDeleting) {
        typingEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 60 : 100;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex  = (textIndex + 1) % texts.length;
        delay = 400;
      }
      setTimeout(typeText, delay);
    }
    setTimeout(typeText, 1000);
  }

  // ============================================================
  // 9. SKILL BAR ANIMATIONS
  // Bars animate when scrolled into view (handled in reveal observer).
  // Data-width attribute sets the fill percentage.
  // ============================================================
  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width || '80%';
        skillBarObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.skill-bar-fill').forEach(bar => skillBarObserver.observe(bar));

  // ============================================================
  // 10. 3D TILT CARD EFFECT
  // Cards subtly tilt toward the mouse pointer.
  // ============================================================
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================================
  // 11. PROJECT FILTER (Portfolio page)
  // Clicking a filter button shows/hides cards based on data-category.
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const show = (filter === 'all' || category === filter);
        card.classList.toggle('hidden', !show);
      });
    });
  });

  // ============================================================
  // 12. SCROLL-TO-TOP BUTTON
  // ============================================================
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // 13. PAGE TRANSITION (smooth cross-page fade)
  // ============================================================
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only handle internal HTML page links
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && href.endsWith('.html')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.add('page-leaving');
        setTimeout(() => { window.location.href = href; }, 300);
      });
    }
  });

}); // end DOMContentLoaded