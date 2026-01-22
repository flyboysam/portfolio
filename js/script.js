// Button click audio functionality
let buttonClickAudio = null;
let audioInitialized = false;

// Preload audio on first user interaction (required by browsers)
function initAudio() {
  if (!audioInitialized) {
    try {
      buttonClickAudio = new Audio('audio/button-click.mp3');
      buttonClickAudio.volume = 0.6;
      buttonClickAudio.load();
      audioInitialized = true;
    } catch (err) {
      // Silently handle audio initialization errors
    }
  }
}

function playButtonClick() {
  initAudio(); // Initialize on first click
  
  if (buttonClickAudio) {
    buttonClickAudio.currentTime = 0; // Reset to start
    const playPromise = buttonClickAudio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Silently handle audio playback errors
      });
    }
  }
}

// Add click listener to all buttons after DOM loads
document.addEventListener('DOMContentLoaded', function() {
  // Select all button elements
  const allButtons = document.querySelectorAll('button, .button, a.button, [class*="__button"]');
  
  allButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      
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
  
  // Mac detection for platform-specific optimizations
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || 
                /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  
  if (prefersReducedMotion) {
    return; // Skip animations if user prefers reduced motion
  }

  // Unified scroll handler for better performance - CONSOLIDATED
  let scrollTicking = false;
  let lastScrollY = 0;
  let parallaxScrollTimeout = null;
  let lastParallaxUpdate = 0;

  // Apple-style: Track scroll state to pause animations during active scrolling
  let isScrolling = false;
  let scrollStateTimeout = null;
  let scrollVelocityTimeout = null;

  // Optimized Intersection Observer - batched updates for ultra-smooth performance
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20% 0px', // Trigger even earlier for smoother appearance
    threshold: 0.05 // Lower threshold for earlier, smoother triggers
  };

  // Consolidated scroll handler - handles all scroll-related tasks
  function handleScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const deltaY = scrollY - lastScrollY;
        const now = performance.now();
        
        // Update scroll state for animation pausing
        if (!isScrolling) {
          isScrolling = true;
          document.body.classList.add('scrolling');
        }
        
        // Clear existing timeouts
        if (scrollStateTimeout) clearTimeout(scrollStateTimeout);
        if (scrollVelocityTimeout) clearTimeout(scrollVelocityTimeout);
        
        // Update parallax if needed (throttled)
        if (layers.length > 0 && (now - lastParallaxUpdate) >= 16) {
          updateParallax(scrollY);
          lastParallaxUpdate = now;
        }
        
        // Reset scrolling flag after scroll stops
        scrollStateTimeout = setTimeout(() => {
          isScrolling = false;
          document.body.classList.remove('scrolling');
          // Process any queued animations now that scrolling has stopped
          if (animationQueue.length > 0 && !isProcessingQueue) {
            processAnimationQueue();
          }
        }, isMac ? 300 : 200);
        
        lastScrollY = scrollY;
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  // Parallax layers - cache for performance
  const layers = document.querySelectorAll('.parallax .layer');
  
  // Single scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Batch animation updates to prevent jerky scroll
  let animationQueue = [];
  let isProcessingQueue = false;

  const processAnimationQueue = () => {
    // Don't process animations while actively scrolling
    if (isScrolling) {
      return;
    }
    
    if (animationQueue.length === 0) {
      isProcessingQueue = false;
      return;
    }
    
    isProcessingQueue = true;
    const batch = animationQueue.splice(0, 3); // Process 3 at a time for smoother feel
    
    requestAnimationFrame(() => {
      if (isScrolling) {
        isProcessingQueue = false;
        return;
      }
      
      batch.forEach((entry, index) => {
        // Use requestAnimationFrame for stagger instead of setTimeout
        requestAnimationFrame(() => {
          if (!isScrolling) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      });
      
      // Process next batch on next frame
      if (animationQueue.length > 0 && !isScrolling) {
        requestAnimationFrame(processAnimationQueue);
      } else {
        isProcessingQueue = false;
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
        // Only queue animations if not actively scrolling
        if (!isScrolling) {
          animationQueue.push(entry);
          if (!isProcessingQueue) {
            processAnimationQueue();
          }
        } else {
          // Queue for later when scrolling stops
          animationQueue.push(entry);
        }
      }
    });
  }, observerOptions);

  // Also observe elements that might already be in viewport on page load - OPTIMIZED
  const checkInitialViewport = () => {
    // Use IntersectionObserver instead of getBoundingClientRect for better performance
    const initialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animate-in')) {
          requestAnimationFrame(() => {
            entry.target.classList.add('animate-in');
          });
          initialObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '50% 0px' }); // Check if element is in top half of viewport
    
    const allAnimated = document.querySelectorAll('.scroll-animate, .scroll-animate-scale, .image-reveal, .text-reveal');
    allAnimated.forEach(el => {
      initialObserver.observe(el);
    });
    
    // Clean up after a short delay
    setTimeout(() => {
      initialObserver.disconnect();
    }, 1000);
  };

  // Initialize all scroll animations - Optimized to prevent jerky scroll
  function initScrollAnimations() {
    // Cache DOM queries to avoid repeated lookups
    const isHomePage = document.querySelector('.about-home, .page__services.services');
    
    // Main sections - Prioritize containers over nested elements for smoother performance
    const containerSelectors = [
      '.about__container',
      '.services__container',
      '.skills__container',
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
      '.skills__title',
      '.outro__title',
      '.services-page__title',
      '.contact__title'
    ];

    // Animate containers first - batch DOM queries
    containerSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && !el.classList.contains('scroll-animate')) {
          el.classList.add('scroll-animate');
          observer.observe(el);
        }
      });
    });

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
    document.querySelectorAll('.services-page__title, .about__title, .skills__title, .contact__title, .outro__title').forEach(title => {
      if (title && !title.classList.contains('scroll-animate')) {
        title.classList.add('scroll-animate');
        observer.observe(title);
      }
    });
    
    // Skills items for staggered animation
    document.querySelectorAll('.skills__category').forEach((item, index) => {
      if (item && !item.classList.contains('scroll-animate-scale')) {
        item.style.setProperty('--delay', `${index * 0.15}s`);
        item.classList.add('scroll-animate-scale');
        observer.observe(item);
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

  // Parallax scrolling animation for background layers - OPTIMIZED
  function updateParallax(scrollY) {
    if (layers.length > 0) {
      // Move each layer at different speeds for depth effect
      // Use translate3d for better GPU acceleration on all platforms
      for (let i = 1; i < layers.length; i++) {
        const layer = layers[layers.length - i];
        const speed = i * 0.1;
        layer.style.transform = `translate3d(0, ${speed * scrollY}px, 0)`;
      }
    }
  }
  
  // Initialize parallax on page load
  if (layers.length > 0) {
    updateParallax(window.pageYOffset || document.documentElement.scrollTop);
  }

  // Apple-style subtle micro-interactions - Only when not scrolling
  function initMicroInteractions() {
    // Apple-style subtle button press effect
    document.querySelectorAll('.button, button, a.button').forEach(btn => {
      btn.addEventListener('mousedown', function() {
        if (!isScrolling) {
          this.style.transform = 'translate3d(0, 0, 0) scale(0.98)';
          this.style.transition = 'transform 0.2s var(--ease-ultra-in)';
        }
      }, { passive: true });
      
      btn.addEventListener('mouseup', function() {
        if (!isScrolling) {
          this.style.transition = 'transform 0.4s var(--ease-ultra-out)';
          this.style.transform = '';
        }
      }, { passive: true });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.4s var(--ease-ultra-out)';
        this.style.transform = '';
      }, { passive: true });
    });

    // Apple-style subtle card hover - Very gentle lift
    document.querySelectorAll('.item-services, .testimonial__item').forEach(card => {
      card.addEventListener('mouseenter', function() {
        if (!isScrolling) {
          this.style.transition = 'transform 0.6s var(--ease-ultra-smooth)';
          this.style.transform = 'translate3d(0, -2px, 0)';
        }
      }, { passive: true });
      
      card.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.6s var(--ease-ultra-smooth)';
        this.style.transform = '';
      }, { passive: true });
    });

    // Apple-style subtle image zoom - Very gentle
    document.querySelectorAll('.about__image img, .services-page__img img, .item-services__image img').forEach(img => {
      img.addEventListener('mouseenter', function() {
        if (!isScrolling) {
          this.style.transition = 'transform 0.8s var(--ease-ultra-smooth)';
          this.style.transform = 'scale3d(1.02, 1.02, 1)';
        }
      }, { passive: true });
      
      img.addEventListener('mouseleave', function() {
        this.style.transition = 'transform 0.8s var(--ease-ultra-smooth)';
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

  // Enhanced Smooth Scrolling - Cross-Platform (Mac & Windows)
  // Check for reduced motion preference (use existing isMac from parent scope)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Polyfill for browsers that don't support smooth scrolling natively
  function smoothScrollTo(target, duration = 800) {
    const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
    if (!targetElement) return;

    // Respect reduced motion preference
    if (prefersReducedMotion) {
      targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }

    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80; // Account for header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Check if browser supports smooth scrolling natively
    const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    if (supportsSmoothScroll) {
      // Use native smooth scroll for better performance
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }

    // Custom smooth scroll animation for older browsers
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function - cubic ease-in-out for smooth feel (optimized for Mac and Windows)
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Ensure we end at the exact target position
        window.scrollTo(0, targetPosition);
      }
    }

    requestAnimationFrame(animation);
  }

  // Enhanced smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        smoothScrollTo(href, 800);
      }
    });
  });

  // Smooth scrolling for programmatic navigation
  window.smoothScrollTo = smoothScrollTo;

  // Enhanced wheel event handling for ultra-smooth scrolling (only if motion is not reduced)
  if (!prefersReducedMotion) {
    let wheelTimeout;
    let wheelScrolling = false;
    let lastWheelTime = 0;
    let wheelVelocity = 0;

    function handleWheel(e) {
      const now = performance.now();
      const deltaTime = now - lastWheelTime;
      lastWheelTime = now;
      
      // Calculate wheel velocity for Mac trackpad
      if (isMac && deltaTime > 0) {
        wheelVelocity = Math.abs(e.deltaY) / deltaTime;
      }
      
      // Clear any pending scroll end
      clearTimeout(wheelTimeout);
      
      if (!wheelScrolling) {
        wheelScrolling = true;
        // Mac: Enhanced smooth scrolling for trackpad
        if (isMac) {
          document.body.style.scrollBehavior = 'smooth';
          document.documentElement.style.scrollBehavior = 'smooth';
          // Optimize for Mac trackpad momentum
          document.body.style.webkitOverflowScrolling = 'touch';
        } else {
          document.body.style.scrollBehavior = 'smooth';
          document.documentElement.style.scrollBehavior = 'smooth';
        }
      }

      // Reset scroll behavior after scrolling stops
      // Mac trackpad momentum requires longer timeout
      wheelTimeout = setTimeout(() => {
        wheelScrolling = false;
        wheelVelocity = 0;
        // Keep smooth behavior for better UX
      }, isMac ? 300 : 150); // Longer for Mac momentum scrolling
    }

    // Add wheel listener for enhanced smooth scrolling (passive for performance)
    // Mac trackpads benefit from passive listeners
    window.addEventListener('wheel', handleWheel, { passive: true });
    
    // Mac-specific: Trackpad gesture support
    if (isMac) {
      // Handle trackpad momentum scrolling
      window.addEventListener('touchstart', () => {
        document.documentElement.style.scrollBehavior = 'smooth';
      }, { passive: true });
      
      window.addEventListener('touchmove', () => {
        document.documentElement.style.scrollBehavior = 'smooth';
      }, { passive: true });
    }
  }

  // Smooth scrolling for keyboard navigation (arrow keys, page up/down)
  if (!prefersReducedMotion) {
    let keyboardScrollTimeout;
    window.addEventListener('keydown', function(e) {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'];
      if (keys.includes(e.key)) {
        clearTimeout(keyboardScrollTimeout);
        document.documentElement.style.scrollBehavior = 'smooth';
        if (isMac) {
          document.body.style.scrollBehavior = 'smooth';
        }
        
        keyboardScrollTimeout = setTimeout(() => {
          // Keep smooth behavior
        }, 300);
      }
    }, { passive: true });
  }

})();