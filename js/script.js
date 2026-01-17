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

// Apple-style scroll animations
(function() {
  'use strict';

  // Create Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: [0.1, 0.3, 0.5]
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
    '.contact__container',
    '.about__title',
    '.services__title',
    '.testimonial__title'
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
      item.classList.add('scroll-animate-scale');
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

  // Animate 3D aerospace elements based on scroll (subtle effect)
  const aerospaceElements = document.querySelectorAll('.floating-planet, .orbital-ring, .satellite, .space-station, .star-3d, .glow-orb');
  
  function updateAerospaceParallax() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = scrollTop / (document.documentElement.scrollHeight - window.innerHeight);
    
    aerospaceElements.forEach((el, index) => {
      if (el) {
        // Very subtle speeds for different elements
        const speed = 0.02 + (index % 3) * 0.01;
        const rotation = scrollPercent * 180 * speed;
        const translateY = scrollTop * speed * 0.1;
        
        // Apply subtle transforms while preserving existing animations
        el.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
      }
    });
  }

  function initAerospaceParallax() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateAerospaceParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Only initialize aerospace parallax if elements exist
  if (aerospaceElements.length > 0) {
    initAerospaceParallax();
  }
})();