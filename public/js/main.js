/* =============================================================
   SNELGROVE ICE CREAM — Main JavaScript
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navigation scroll behavior ----
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile hamburger menu ----
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Active nav link ----
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === 'index.html' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ---- Hero Slider ----
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = slider.querySelectorAll('.hero-slider__slide');
    const prevBtn = slider.querySelector('.hero-slider__arrow--prev');
    const nextBtn = slider.querySelector('.hero-slider__arrow--next');
    let current = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 6000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let userPaused = reducedMotion;

    function goToSlide(index) {
      slides[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
    }

    function nextSlide() { goToSlide(current + 1); }
    function prevSlide() { goToSlide(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      if (slides.length > 1 && !userPaused) autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    // Arrow clicks (arrows are optional)
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

    // Keyboard navigation
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { prevSlide(); startAutoplay(); }
      if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
    });

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
        startAutoplay();
      }
    }, { passive: true });

    // Pause autoplay on hover, resume on leave
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Pause/play control (WCAG 2.2.2); starts paused if the user prefers reduced motion
    const pauseBtn = slider.querySelector('.hero-slider__pause');
    if (pauseBtn) {
      const iconPause = pauseBtn.querySelector('.hero-slider__pause-icon-pause');
      const iconPlay = pauseBtn.querySelector('.hero-slider__pause-icon-play');
      function renderPauseBtn() {
        pauseBtn.setAttribute('aria-pressed', String(userPaused));
        pauseBtn.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
        if (iconPause) iconPause.hidden = userPaused;
        if (iconPlay) iconPlay.hidden = !userPaused;
      }
      pauseBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        renderPauseBtn();
        if (userPaused) stopAutoplay(); else startAutoplay();
      });
      renderPauseBtn();
    }

    // Start autoplay
    startAutoplay();
  }

  // ---- Intersection Observer for scroll-in animations ----
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

});
