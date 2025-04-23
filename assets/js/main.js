(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }

  /**
   * Scroll up sticky header effect
   */
  let lastScrollTop = 0;
  function handleStickyHeader() {
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky')) return;
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = `-${selectHeader.offsetHeight + 50}px`;
    } else if (scrollTop > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = "0";
    } else {
      selectHeader.style.removeProperty('top');
      selectHeader.style.removeProperty('position');
    }
    lastScrollTop = scrollTop;
  }

  /**
   * Mobile navigation management
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  /**
   * Initialize service modals
   */
  function initServiceModals() {
    document.querySelectorAll('.service-item').forEach(item => {
      item.addEventListener('click', function() {
        const parent = this.closest('[data-service-title]');
        const serviceData = parent.dataset;
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));

        document.getElementById('serviceModalLabel').textContent = serviceData.serviceTitle;
        document.querySelector('.service-modal-description').innerHTML = serviceData.serviceDescription;
        document.querySelector('.service-modal-icon').innerHTML = `<i class="bi ${serviceData.serviceIcon}"></i>`;

        const featuresContainer = document.querySelector('.service-modal-features');
        featuresContainer.innerHTML = serviceData.serviceFeatures.split('|').map(feature => `
            <div class="col-6">
                <div class="d-flex align-items-center p-3 bg-light rounded">
                    <i class="bi bi-check2-circle text-success me-3"></i>
                    <span class="text-dark">${feature}</span>
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
    // Event listeners
    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('scroll', handleStickyHeader);
    window.addEventListener('load', toggleScrolled);

    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);

    document.querySelectorAll('#navmenu a').forEach(navLink => {
      navLink.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) mobileNavToggle();
      });
    });

    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    // Preloader
    const preloader = document.querySelector('#preloader');
    if (preloader) window.addEventListener('load', () => preloader.remove());

    // Scroll top button
    let scrollTopBtn = document.querySelector('.scroll-top');
    function toggleScrollTop() {
      scrollTopBtn?.classList.toggle('active', window.scrollY > 100);
    }
    scrollTopBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    // AOS initialization
    window.addEventListener('load', () => {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
    });

    // Carousel indicators
    document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
      const carousel = carouselIndicator.closest('.carousel');
      carousel.querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
        const indicator = `<li data-bs-target="#${carousel.id}" data-bs-slide-to="${index}" ${
          index === 0 ? 'class="active"' : ""
        }></li>`;
        carouselIndicator.innerHTML += indicator;
      });
    });

    // Swiper initialization
    function initSwiper() {
      document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
        let config = JSON.parse(
          swiperElement.querySelector(".swiper-config").innerHTML.trim()
        );
        if (swiperElement.classList.contains("swiper-tab")) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      });
    }
    window.addEventListener("load", initSwiper);

    // GLightbox initialization
    const glightbox = GLightbox({ selector: '.glightbox' });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const bodyElement = document.body;
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      bodyElement.classList.add('dark-mode');
      themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
    }
    themeToggle.addEventListener('click', () => {
      bodyElement.classList.toggle('dark-mode');
      if (bodyElement.classList.contains('dark-mode')) {
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        localStorage.setItem('theme', 'dark');
      } else {
        themeIcon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        localStorage.setItem('theme', 'light');
      }
    });

    // Language selection
    document.getElementById('language-select').addEventListener('change', (e) => {
      window.location.href = e.target.value === 'fr' ? 'index.html' : 'index.html';
    });

    // Service modals initialization
    initServiceModals();
  }

  // Start everything
  document.addEventListener('DOMContentLoaded', init);
})();