/**
 * Animation Orchestration
 * GSAP ScrollTrigger & IntersectionObserver Scroll Sequences
 */

import { gsap } from 'gsap';

// Fallback to window.gsap if loaded via CDN
const GsapLib = typeof gsap !== 'undefined' ? gsap : (window.gsap || null);

export class AnimationManager {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.statsAnimated = false;
    
    this.initHeroEntrance();
    this.initScrollAnimations();
    this.initNavigationTracker();
    this.initTimelineProgression();
  }

  /* ========================================================================
     1. HERO ENTRANCE SEQUENCE
     ======================================================================== */
  initHeroEntrance() {
    if (this.isReducedMotion || !GsapLib) {
      document.querySelectorAll('.hero-content > *, .hero-visual-wrapper').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const tl = GsapLib.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });

    // Initial state
    GsapLib.set('.hero-eyebrow', { opacity: 0, y: 20 });
    GsapLib.set('.hero-name .first-name', { opacity: 0, x: -30 });
    GsapLib.set('.hero-name .last-name', { opacity: 0, x: -30 });
    GsapLib.set('.hero-roles', { opacity: 0, y: 15 });
    GsapLib.set('.hero-bio', { opacity: 0, y: 20 });
    GsapLib.set('.hero-actions', { opacity: 0, y: 20 });
    GsapLib.set('.hero-hud-top-right, .hero-hud-bottom-left', { opacity: 0 });
    GsapLib.set('.hero-scroll-indicator', { opacity: 0 });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, delay: 0.2 })
      .to('.hero-name .first-name', { opacity: 1, x: 0 }, '-=0.5')
      .to('.hero-name .last-name', { opacity: 1, x: 0 }, '-=0.6')
      .to('.hero-roles', { opacity: 1, y: 0 }, '-=0.5')
      .to('.hero-bio', { opacity: 1, y: 0 }, '-=0.5')
      .to('.hero-actions', { opacity: 1, y: 0 }, '-=0.5')
      .to('.hero-hud-top-right, .hero-hud-bottom-left', { opacity: 1, stagger: 0.2 }, '-=0.3')
      .to('.hero-scroll-indicator', { opacity: 1 }, '-=0.2');
  }

  /* ========================================================================
     2. SCROLL OBSERVER & NUMBER COUNTER ANIMATIONS
     ======================================================================== */
  initScrollAnimations() {
    // Animate Statistics in About Section
    const statsSection = document.getElementById('about');
    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateCounters();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const isPadded = el.getAttribute('data-pad') === 'true';

      if (this.isReducedMotion || isNaN(target)) {
        el.textContent = (isPadded ? String(target).padStart(2, '0') : target) + suffix;
        return;
      }

      let current = 0;
      const duration = 1600;
      const startTime = performance.now();

      const updateCounter = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quart
        const ease = 1 - Math.pow(1 - progress, 4);
        current = Math.floor(ease * target);

        el.textContent = (isPadded ? String(current).padStart(2, '0') : current) + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = (isPadded ? String(target).padStart(2, '0') : target) + suffix;
        }
      };
      requestAnimationFrame(updateCounter);
    });
  }

  /* ========================================================================
     3. NAVIGATION ACTIVE TRACKER
     ======================================================================== */
  initNavigationTracker() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  /* ========================================================================
     4. TIMELINE SEQUENTIAL PROGRESSION
     ======================================================================== */
  initTimelineProgression() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          const marker = entry.target.querySelector('.marker-square');
          if (marker && !marker.classList.contains('muted')) {
            marker.classList.add('filled');
          }
        }
      });
    }, { threshold: 0.4 });

    timelineItems.forEach(item => observer.observe(item));
  }
}
