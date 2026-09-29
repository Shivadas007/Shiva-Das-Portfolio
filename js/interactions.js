/**
 * User Interactions & Micro-Experiences
 * Custom Cyber Cursor, 3D Tilt Systems, Contact Form Handler, and Mobile Navigation
 */

export class InteractionManager {
  constructor() {
    this.isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    if (!this.isTouch) {
      this.initCustomCursor();
      this.init3DTilt();
    }
    
    this.initContactForm();
    this.initMobileNav();
    this.initSmoothScroll();
    this.initProjectsHorizontalScroll();
  }

  /* ========================================================================
     3.5 PROJECTS HORIZONTAL SCROLL & CAROUSEL
     ======================================================================== */
  initProjectsHorizontalScroll() {
    const container = document.getElementById('projects-scroll-container');
    const thumb = document.getElementById('projects-scroll-thumb');
    const btnLeft = document.querySelector('.proj-scroll-left');
    const btnRight = document.querySelector('.proj-scroll-right');

    if (!container) return;

    const updateThumb = () => {
      if (!thumb) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        thumb.style.width = '100%';
        thumb.style.transform = 'translateX(0)';
        return;
      }
      const scrollRatio = container.scrollLeft / maxScroll;
      const thumbWidthPercent = Math.max(20, (container.clientWidth / container.scrollWidth) * 100);
      thumb.style.width = `${thumbWidthPercent}%`;
      const availableTrack = 100 - thumbWidthPercent;
      thumb.style.transform = `translateX(${scrollRatio * availableTrack}%)`;
    };

    container.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb, { passive: true });
    updateThumb();

    if (btnLeft) {
      btnLeft.addEventListener('click', () => {
        container.scrollBy({ left: -340, behavior: 'smooth' });
      });
    }

    if (btnRight) {
      btnRight.addEventListener('click', () => {
        container.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }

    // Drag to scroll for desktop mouse users
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    container.addEventListener('mousedown', (e) => {
      // Allow clicking interactive links/buttons normally
      if (e.target.closest('a, button')) return;
      isDown = true;
      container.classList.add('is-dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('is-dragging');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  }

  /* ========================================================================
     1. CUSTOM CYBER CURSOR
     ======================================================================== */
  initCustomCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Smooth trailing for outer ring
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover states for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-node-card, .scanner-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (el.classList.contains('title-magenta') || el.classList.contains('active-magenta')) {
          ring.classList.add('active-magenta');
        } else {
          ring.classList.add('active');
        }
      });

      el.addEventListener('mouseleave', () => {
        ring.classList.remove('active', 'active-magenta');
      });
    });
  }

  /* ========================================================================
     2. 3D TILT WITH PERSPECTIVE & SPOTLIGHT
     ======================================================================== */
  init3DTilt() {
    // 1. About Scanner Card 3D Tilt
    const scannerCard = document.querySelector('.scanner-card');
    if (scannerCard) {
      scannerCard.addEventListener('mousemove', (e) => {
        const rect = scannerCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        scannerCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      scannerCard.addEventListener('mouseleave', () => {
        scannerCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    }

    // 2. Project Cards 3D Tilt
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* ========================================================================
     3. CONTACT FORM VALIDATION & TRANSMISSION PROTOCOL
     ======================================================================== */
  initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.elements['name']?.value.trim();
      const email = form.elements['email']?.value.trim();
      const message = form.elements['message']?.value.trim();

      // Validation
      if (!name || !email || !message) {
        feedback.className = 'form-feedback error';
        feedback.innerHTML = 'SIGNAL ERROR // ALL QUANTUM FIELDS REQUIRED';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.className = 'form-feedback error';
        feedback.innerHTML = 'TRANSMISSION PROTOCOL FAILED // INVALID SIGNAL FREQUENCY (EMAIL)';
        return;
      }

      // Simulate transmission
      const submitBtn = form.querySelector('.btn-transmit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'TRANSMITTING SIGNAL...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        feedback.className = 'form-feedback success';
        feedback.innerHTML = 'SIGNAL TRANSMITTED // 200 OK — ENCRYPTED PACKET DELIVERED TO SHIVA DAS';
        form.reset();

        setTimeout(() => {
          feedback.style.display = 'none';
        }, 6000);
      }, 1200);
    });
  }

  /* ========================================================================
     4. MOBILE NAVIGATION
     ======================================================================== */
  initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ========================================================================
     5. SMOOTH SCROLLING
     ======================================================================== */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL hash smoothly
          if (history.pushState) {
            history.pushState(null, '', targetId);
          }
        }
      });
    });
  }
}
