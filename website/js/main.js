(function () {
  'use strict';

  // ========================================
  // Typing Effect
  // ========================================
  const titles = [
    'GCP Cloud Architect',
    'Data Architect',
    'Senior Data Engineer',
    'AI Systems Designer',
  ];

  function initTypingEffect() {
    const el = document.getElementById('typedTitle');
    if (!el) return;

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 500;

    function type() {
      const currentTitle = titles[titleIndex];

      if (!isDeleting) {
        el.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentTitle.length) {
          isDeleting = true;
          setTimeout(type, pauseAfterType);
          return;
        }
        setTimeout(type, typeSpeed);
      } else {
        el.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          setTimeout(type, pauseAfterDelete);
          return;
        }
        setTimeout(type, deleteSpeed);
      }
    }

    type();
  }

  // ========================================
  // Navigation
  // ========================================
  function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav__link');

    // Scroll detection
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
      lastScroll = currentScroll;
    });

    // Mobile toggle
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
    });

    // Close menu on link click
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('.section, .hero');
    var observerOptions = {
      root: null,
      rootMargin: '-50% 0px',
      threshold: 0,
    };

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          links.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // ========================================
  // Scroll Reveal
  // ========================================
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, index) {
            if (entry.isIntersecting) {
              // Stagger the animation
              setTimeout(function () {
                entry.target.classList.add('visible');
              }, index * 100);
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      reveals.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback: show everything
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ========================================
  // Roadmap Filter
  // ========================================
  function initRoadmapFilter() {
    var legendItems = document.querySelectorAll('.legend-item');
    var milestones = document.querySelectorAll('.milestone');

    legendItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var filter = this.dataset.filter;

        if (filter === 'all') {
          // Reset all filters
          milestones.forEach(function (m) {
            m.classList.remove('dimmed');
          });
          legendItems.forEach(function (li) {
            li.classList.add('active');
          });
          return;
        }

        // Toggle this filter
        this.classList.toggle('active');

        // Get all active filters
        var activeFilters = [];
        legendItems.forEach(function (li) {
          if (li.classList.contains('active') && li.dataset.filter !== 'all') {
            activeFilters.push(li.dataset.filter);
          }
        });

        // If no filters active, show all
        if (activeFilters.length === 0) {
          milestones.forEach(function (m) {
            m.classList.remove('dimmed');
          });
          legendItems.forEach(function (li) {
            li.classList.add('active');
          });
          return;
        }

        // Apply filter
        milestones.forEach(function (m) {
          if (activeFilters.indexOf(m.dataset.status) !== -1) {
            m.classList.remove('dimmed');
          } else {
            m.classList.add('dimmed');
          }
        });

        // Update "all" button state
        var allBtn = document.querySelector('[data-filter="all"]');
        if (activeFilters.length === 3) {
          allBtn.classList.add('active');
        } else {
          allBtn.classList.remove('active');
        }
      });
    });
  }

  // ========================================
  // Smooth Scroll (for browsers without native support)
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ========================================
  // Initialize
  // ========================================
  document.addEventListener('DOMContentLoaded', function () {
    initTypingEffect();
    initNavigation();
    initScrollReveal();
    initRoadmapFilter();
    initSmoothScroll();
  });
})();
