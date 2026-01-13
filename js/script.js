document.querySelector(".icon-menu").addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Apple-style scroll animations
(function() {
  'use strict';

  // Create Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Optional: Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Elements to animate - query each separately to ensure all are found
  const selectors = [
    '.about__container',
    '.about__content',
    '.about__image',
    '.services__container',
    '.testimonial__container',
    '.testimonial__item',
    '.outro__container',
    '.services-page__item',
    '.contact__container'
  ];

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el) {
        el.classList.add('scroll-animate');
        observer.observe(el);
      }
    });
  });

  // Staggered animation for service items
  const serviceItems = document.querySelectorAll('.item-services');
  serviceItems.forEach((item, index) => {
    if (item) {
      item.style.transitionDelay = `${index * 0.15}s`;
      item.classList.add('scroll-animate');
      observer.observe(item);
    }
  });

  // Subtle parallax effect for hero sections (Apple-style)
  let lastScrollTop = 0;
  const parallaxElements = document.querySelectorAll('.main__container, .main__caption, .main__title, .main__text, .main__button');
  
  function updateParallax() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    parallaxElements.forEach((el, index) => {
      if (el && scrollTop < window.innerHeight * 1.5) {
        const speed = 0.3 + (index * 0.05);
        const yPos = -(scrollTop * speed * 0.3);
        el.style.transform = `translateY(${yPos}px)`;
        
        // Subtle opacity fade
        if (scrollTop < window.innerHeight) {
          const opacity = Math.max(0.5, 1 - (scrollTop / window.innerHeight) * 0.3);
          el.style.opacity = opacity;
        }
      }
    });
    
    lastScrollTop = scrollTop;
  }

  // Smooth scroll behavior with easing
  function initParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Only initialize parallax if elements exist
  if (parallaxElements.length > 0) {
    initParallax();
  }
})();