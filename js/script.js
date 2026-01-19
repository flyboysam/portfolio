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

// Optimized scroll animations with better performance
(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return; // Skip animations if user prefers reduced motion
  }

  // Optimized Intersection Observer with single threshold for better performance
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px', // Trigger slightly earlier
    threshold: 0.1 // Single threshold for better performance
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Use requestAnimationFrame for smooth class addition
        requestAnimationFrame(() => {
          entry.target.classList.add('animate-in');
          // Unobserve immediately after animation starts to reduce overhead
          observer.unobserve(entry.target);
        });
      }
    });
  }, observerOptions);

  // Batch DOM queries and setup
  function initScrollAnimations() {
    // Elements to animate - batch query for better performance
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

    // Use document fragment for batch processing
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && !el.classList.contains('scroll-animate')) {
          el.classList.add('scroll-animate');
          observer.observe(el);
        }
      });
    });

    // Staggered animation for service items - optimized
    const serviceItems = document.querySelectorAll('.item-services');
    serviceItems.forEach((item, index) => {
      if (item && !item.classList.contains('scroll-animate-scale')) {
        // Use CSS custom property instead of inline style for better performance
        item.style.setProperty('--delay', `${index * 0.1}s`);
        item.classList.add('scroll-animate-scale');
        observer.observe(item);
      }
    });
  }

  // Initialize animations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  // Optimized parallax effect - only for hero section, reduced complexity
  let parallaxTicking = false;
  let lastScrollY = 0;
  const parallaxElements = document.querySelectorAll('.main__container');
  
  function updateParallax() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const deltaY = scrollY - lastScrollY;
    
    // Only update if scroll change is significant (reduces unnecessary updates)
    if (Math.abs(deltaY) < 1 && scrollY > 0) {
      parallaxTicking = false;
      return;
    }
    
    if (scrollY < window.innerHeight * 1.2) {
      parallaxElements.forEach((el) => {
        if (el) {
          // Use transform3d for GPU acceleration
          const yPos = -(scrollY * 0.15);
          el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
      });
    }
    
    lastScrollY = scrollY;
    parallaxTicking = false;
  }

  // Throttled scroll handler with passive listener
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // Disable aerospace parallax on scroll - let CSS animations handle it
  // This reduces JavaScript overhead significantly
  // The CSS animations are already smooth and performant

})();