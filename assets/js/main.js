(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody   = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    ) return;
    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  /**
   * Sticky header on scroll up
   */
  let lastScrollTop = 0;
  function handleStickyHeader() {
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky')) return;
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = `-${selectHeader.offsetHeight + 50}px`;
    } else if (st > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = "0";
    } else {
      selectHeader.style.removeProperty('top');
      selectHeader.style.removeProperty('position');
    }
    lastScrollTop = st;
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToggle() {
    document.body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  /**
   * Service modals
   */
  function initServiceModals() {
    document.querySelectorAll('.service-item').forEach(item => {
      item.addEventListener('click', function() {
        const data  = this.closest('[data-service-title]').dataset;
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        document.getElementById('serviceModalLabel').textContent     = data.serviceTitle;
        document.querySelector('.service-modal-description').innerHTML = data.serviceDescription;
        document.querySelector('.service-modal-icon').innerHTML        = `<i class="bi ${data.serviceIcon}"></i>`;
        document.querySelector('.service-modal-features').innerHTML    =
          data.serviceFeatures.split('|').map(f => `
            <div class="col-6">
              <div class="d-flex align-items-center p-3 bg-light rounded">
                <i class="bi bi-check2-circle text-success me-3"></i>
                <span class="text-dark">${f}</span>
              </div>
            </div>
          `).join('');
        modal.show();
      });
    });
  }

  /**
   * Main initialization
   */
  function init() {
    // 1) Scrolling effects
    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('scroll', handleStickyHeader);
    window.addEventListener('load', toggleScrolled);

    // 2) Mobile nav
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
    document.querySelectorAll('#navmenu a').forEach(link => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) mobileNavToggle();
      });
    });
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        const li = toggle.parentNode;
        li.classList.toggle('active');
        li.nextElementSibling.classList.toggle('dropdown-active');
      });
    });

    // 3) Preloader
    const pre = document.getElementById('preloader');
    if (pre) window.addEventListener('load', () => pre.remove());

    // 4) Scroll-top button
    const scrollBtn = document.querySelector('.scroll-top');
    function toggleScrollTop() {
      scrollBtn?.classList.toggle('active', window.scrollY > 100);
    }
    scrollBtn?.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    // 5) AOS
    window.addEventListener('load', () => {
      AOS.init({ duration:600, easing:'ease-in-out', once:true, mirror:false });
    });

    // 6) Carousel indicators
    document.querySelectorAll('.carousel-indicators').forEach(indicators => {
      const carousel = indicators.closest('.carousel');
      carousel.querySelectorAll('.carousel-item').forEach((_, i) => {
        indicators.innerHTML += `<li data-bs-target="#${carousel.id}" data-bs-slide-to="${i}"${i===0?' class="active"':''}></li>`;
      });
    });

    // 7) Swiper
    function initSwiper() {
      document.querySelectorAll('.init-swiper').forEach(sw => {
        const cfg = JSON.parse(sw.querySelector('.swiper-config').textContent.trim());
        if (sw.classList.contains('swiper-tab')) initSwiperWithCustomPagination(sw, cfg);
        else new Swiper(sw, cfg);
      });
    }
    window.addEventListener('load', initSwiper);

    // 8) GLightbox
    GLightbox({ selector: '.glightbox' });

    // 9) **Theme toggle** (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');
    const bodyEl      = document.body;
    // Init from localStorage
    if (localStorage.getItem('theme') === 'dark') {
      bodyEl.classList.add('dark-mode');
      themeIcon.classList.replace('bi-sun-fill','bi-moon-fill');
    }
    themeToggle.addEventListener('click', () => {
      const isDark = bodyEl.classList.toggle('dark-mode');
      themeIcon.classList.replace(
        isDark ? 'bi-sun-fill'  : 'bi-moon-fill',
        isDark ? 'bi-moon-fill' : 'bi-sun-fill'
      );
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // 10) Language switch
    document.getElementById('language-select').addEventListener('change', e => {
      window.location.href = e.target.value === 'fr' ? 'index.html' : 'index.html';
    });

    // 11) Service Modals
    initServiceModals();
  }

  // Kick off
  document.addEventListener('DOMContentLoaded', init);

})();
