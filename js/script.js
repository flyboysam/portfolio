// Button click audio functionality
let buttonClickAudio = null;
let audioInitialized = false;

// Preload audio on first user interaction (required by browsers)
function initAudio() {
  if (!audioInitialized) {
    console.log('Initializing audio...');
    try {
      buttonClickAudio = new Audio('audio/button-click.mp3');
      buttonClickAudio.volume = 0.6;
      buttonClickAudio.load();
      audioInitialized = true;
      console.log('Audio initialized successfully');
    } catch (err) {
      console.error('Audio initialization error:', err);
    }
  }
}

function playButtonClick() {
  console.log('playButtonClick called');
  initAudio(); // Initialize on first click
  
  if (buttonClickAudio) {
    buttonClickAudio.currentTime = 0; // Reset to start
    const playPromise = buttonClickAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('✓ Audio played successfully');
      }).catch(err => {
        console.error('✗ Audio playback error:', err);
      });
    }
  } else {
    console.error('✗ buttonClickAudio is null');
  }
}

// Add click listener to all buttons after DOM loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Setting up button listeners');
  
  // Select all button elements
  const allButtons = document.querySelectorAll('button, .button, a.button, [class*="__button"]');
  
  console.log('Found ' + allButtons.length + ' buttons');
  
  allButtons.forEach(function(btn, index) {
    console.log('Button ' + index + ':', btn.className || btn.tagName);
    btn.addEventListener('click', function(e) {
      console.log('>>> Button clicked:', btn.className || btn.tagName);
      
      // If it's a link that navigates internally, delay navigation to play sound
      if (btn.tagName === 'A' && btn.href && !btn.hasAttribute('target')) {
        const href = btn.href;
        // Check if it's an internal link (not external)
        if (href.includes(window.location.hostname) || href.startsWith('#') || 
            href.endsWith('.html') || href.indexOf('http') === -1) {
          e.preventDefault(); // Prevent immediate navigation
          playButtonClick();
          
          // Navigate after a short delay to let sound play
          setTimeout(function() {
            window.location.href = href;
          }, 150); // 150ms delay
        } else {
          // External link, just play sound
          playButtonClick();
        }
      } else {
        // Regular button or external link with target
        playButtonClick();
      }
    }, false);
  });
});

// Menu toggle with error handling
const menuIcon = document.querySelector(".icon-menu");
if (menuIcon) {
  menuIcon.addEventListener("click", function (event) {
    event.preventDefault();
    document.body.classList.toggle("menu-open");
  });
}

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

// Premium Apple-style animations with optimized performance
(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return; // Skip animations if user prefers reduced motion
  }

  // Unified scroll handler for better performance
  let scrollTicking = false;
  let lastScrollY = 0;
  let scrollDirection = 0;

  // Optimized Intersection Observer - batched updates for ultra-smooth performance
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20% 0px', // Trigger even earlier for smoother appearance
    threshold: 0.05 // Lower threshold for earlier, smoother triggers
  };

  // Batch animation updates to prevent jerky scroll
  let animationQueue = [];
  let isProcessingQueue = false;

  const processAnimationQueue = () => {
    if (animationQueue.length === 0) {
      isProcessingQueue = false;
      return;
    }
    
    isProcessingQueue = true;
    const batch = animationQueue.splice(0, 3); // Process 3 at a time for smoother feel
    
    requestAnimationFrame(() => {
      batch.forEach((entry, index) => {
        // Stagger within batch for ultra-smooth appearance
        setTimeout(() => {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }, index * 20);
      });
      
      if (animationQueue.length > 0) {
        setTimeout(processAnimationQueue, 20); // Slightly slower for smoother feel
      } else {
        isProcessingQueue = false;
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
        animationQueue.push(entry);
        if (!isProcessingQueue) {
          processAnimationQueue();
        }
      }
    });
  }, observerOptions);

  // Also observe elements that might already be in viewport on page load
  const checkInitialViewport = () => {
    const allAnimated = document.querySelectorAll('.scroll-animate, .scroll-animate-scale, .image-reveal, .text-reveal');
    allAnimated.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport && !el.classList.contains('animate-in')) {
        // Small delay to ensure smooth animation even for visible elements
        setTimeout(() => {
          el.classList.add('animate-in');
        }, 100);
      }
    });
  };

  // Initialize all scroll animations - Optimized to prevent jerky scroll
  function initScrollAnimations() {
    // Main sections - Prioritize containers over nested elements for smoother performance
    const containerSelectors = [
      '.about__container',
      '.services__container',
      '.testimonial__container',
      '.outro__container',
      '.services-page__item',
      '.services-page__container',
      '.contact__container'
    ];

    // Content elements - Animate separately for staggered effect
    const contentSelectors = [
      '.about__content',
      '.about__image',
      '.services__row',
      '.testimonial__item',
      '.item-testimonial',
      '.services-page__content',
      '.services-page__img',
      '.contact__info',
      '.contact__form-wrapper'
    ];

    // Title elements - Animate with slight delay
    const titleSelectors = [
      '.about__title',
      '.services__title',
      '.testimonial__title',
      '.outro__title',
      '.services-page__title',
      '.contact__title'
    ];

    // Animate containers first
    containerSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el && !el.classList.contains('scroll-animate')) {
          el.classList.add('scroll-animate');
          observer.observe(el);
        }
      });
    });

    // For home page: Only animate containers, skip nested elements to prevent jerky scroll
    const isHomePage = document.querySelector('.about-home, .page__services.services');
    
    if (!isHomePage) {
      // On other pages, animate content elements
      setTimeout(() => {
        contentSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            const parentAnimated = el.closest('.scroll-animate');
            // Only animate if not inside an animated container
            if (el && !el.classList.contains('scroll-animate') && !parentAnimated) {
              el.classList.add('scroll-animate');
              observer.observe(el);
            }
          });
        });
      }, 100);
    }

    // Animate standalone titles (not nested in containers)
    setTimeout(() => {
      titleSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          const parentAnimated = el.closest('.scroll-animate');
          if (el && !el.classList.contains('scroll-animate') && !parentAnimated) {
            el.classList.add('scroll-animate');
            observer.observe(el);
          }
        });
      });
    }, 150);

    // Service items with staggered delays - Ultra smooth
    document.querySelectorAll('.item-services').forEach((item, index) => {
      if (item && !item.classList.contains('scroll-animate-scale')) {
        // Optimized stagger delay for smoother sequential animation
        item.style.setProperty('--delay', `${index * 0.2}s`);
        item.classList.add('scroll-animate-scale');
        observer.observe(item);
      }
    });

    // Images with blur reveal effect - All pages
    document.querySelectorAll('.about__image img, .services-page__img img, .item-services__image img, .item-testimonial__image img').forEach(img => {
      if (img && !img.classList.contains('image-reveal')) {
        img.classList.add('image-reveal');
        observer.observe(img);
      }
    });

    // Text elements for reveal animation - All pages
    document.querySelectorAll('.about__text, .services-page__text, .contact__text, .outro__text, .item-services__text').forEach(text => {
      if (text && !text.classList.contains('text-reveal')) {
        text.classList.add('text-reveal');
        observer.observe(text);
      }
    });

    // Titles for smooth reveal
    document.querySelectorAll('.services-page__title, .about__title, .contact__title, .outro__title').forEach(title => {
      if (title && !title.classList.contains('scroll-animate')) {
        title.classList.add('scroll-animate');
        observer.observe(title);
      }
    });

    // Buttons for smooth reveal
    document.querySelectorAll('.services-page__button, .about__button, .outro__button').forEach(button => {
      if (button && !button.classList.contains('scroll-animate-scale')) {
        button.classList.add('scroll-animate-scale');
        observer.observe(button);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollAnimations();
      // Check for elements already in viewport after a short delay
      setTimeout(checkInitialViewport, 200);
    });
  } else {
    initScrollAnimations();
    // Check for elements already in viewport after a short delay
    setTimeout(checkInitialViewport, 200);
  }

  // Optimized parallax - only hero section, disabled for smoother scroll
  const parallaxElements = document.querySelectorAll('.main__container');
  let parallaxEnabled = false; // Disable parallax by default for smoother scroll
  
  function updateScrollEffects() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const deltaY = scrollY - lastScrollY;
    
    // Only update if scroll change is significant (reduces unnecessary updates)
    if (Math.abs(deltaY) < 1.5 && scrollY > 0) {
      scrollTicking = false;
      return;
    }
    
    // Parallax disabled by default for ultra-smooth scroll
    // Can be enabled if needed, but disabled for best performance
    
    lastScrollY = scrollY;
    scrollTicking = false;
  }

  // Throttled scroll handler with better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollEffects);
      scrollTicking = true;
    }
    
    // Clear any pending timeouts
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollTicking = false;
    }, 150);
  }, { passive: true });

  // Premium micro-interactions
  function initMicroInteractions() {
    // Button press effect
    document.querySelectorAll('.button, button, a.button').forEach(btn => {
      btn.addEventListener('mousedown', function() {
        this.style.transform = 'translate3d(0, 0, 0) scale(0.97)';
      }, { passive: true });
      
      btn.addEventListener('mouseup', function() {
        this.style.transform = '';
      }, { passive: true });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
      }, { passive: true });
    });

    // Card hover depth effect - Ultra smooth with requestAnimationFrame
    document.querySelectorAll('.item-services, .testimonial__item').forEach(card => {
      let rafId = null;
      let lastX = 0;
      let lastY = 0;
      
      card.addEventListener('mousemove', function(e) {
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          // Smooth interpolation for ultra-smooth feel
          const targetRotateX = (y - centerY) / 30; // Further reduced
          const targetRotateY = (centerX - x) / 30;
          const rotateX = lastX + (targetRotateX - lastX) * 0.3;
          const rotateY = lastY + (targetRotateY - lastY) * 0.3;
          
          lastX = rotateX;
          lastY = rotateY;
          
          this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -4px, 0)`;
          this.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
      }, { passive: true });
      
      card.addEventListener('mouseleave', function() {
        if (rafId) cancelAnimationFrame(rafId);
        lastX = 0;
        lastY = 0;
        this.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        this.style.transform = '';
      }, { passive: true });
    });

    // Image zoom on hover - Ultra smooth transitions
    document.querySelectorAll('.about__image img, .services-page__img img, .item-services__image img').forEach(img => {
      img.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        this.style.transform = 'scale3d(1.05, 1.05, 1)';
      }, { passive: true });
      
      img.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        this.style.transform = '';
      }, { passive: true });
    });

    // Smooth focus states
    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('focus', function() {
        this.style.outline = '2px solid rgba(79, 216, 232, 0.6)';
        this.style.outlineOffset = '2px';
      }, { passive: true });
      
      el.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
      }, { passive: true });
    });
  }

  // Initialize micro-interactions
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMicroInteractions);
  } else {
    initMicroInteractions();
  }

  // Smooth page transitions
  document.querySelectorAll('a[href^="#"], a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

})();