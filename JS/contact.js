// ====================================
// SLIDE ANIMATION SYSTEM - CONTACT PAGE
// ====================================

class SlideAnimationSystem {
  constructor(config = {}) {
    this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    this.isScrolling = false;
    
    // Navigation mapping for contact page
    this.navigationMap = config.navigationMap || {
      left: './Team.html',     // Previous page
      right: './index.html'    // Next page (back to home)
    };
    
    // Elements to exclude from slide navigation
    this.excludeSelectors = config.excludeSelectors || [
      '.top-bar', '.logo-icon', '.contact-link', 'button', 'a', 
      'input', 'textarea', 'select', '.email-link', '.phone-link', '.address-link'
    ];
    
    this.init();
  }

  // Handle page entrance animation
  handlePageEntrance() {
    const urlParams = new URLSearchParams(window.location.search);
    const slideDirection = urlParams.get('slide');
    
    if (slideDirection === 'from-left') {
      document.body.classList.add('slide-in-from-left');
    } else if (slideDirection === 'from-right') {
      document.body.classList.add('slide-in-from-right');
    }
    
    // Clean up URL parameters
    if (slideDirection) {
      const url = new URL(window.location);
      url.searchParams.delete('slide');
      window.history.replaceState({}, '', url);
    }
  }

  // Navigate with slide animation
  navigateWithSlide(isLeft, isSwipe = false) {
    const targetPage = isLeft ? this.navigationMap.left : this.navigationMap.right;
    
    if (!targetPage) return;

    const pageContainer = document.body;
    const animationClass = isLeft ? 'slide-out-right' : 'slide-out-left';
    const slideParam = isLeft ? 'from-right' : 'from-left';
    
    // Add slide animation class
    pageContainer.classList.add(animationClass);

    // Navigate after animation completes
    const duration = this.isMobile ? 500 : 600;
    
    setTimeout(() => {
      // Add slide parameter to URL for entrance animation
      const separator = targetPage.includes('?') ? '&' : '?';
      window.location.href = `${targetPage}${separator}slide=${slideParam}`;
    }, duration);
  }

  // Check if element should be excluded from navigation
  isExcludedElement(element) {
    return this.excludeSelectors.some(selector => {
      return element.closest(selector) || element.matches(selector);
    });
  }

  // Initialize desktop behavior
  initDesktopBehavior() {
    if (this.isMobile) return;

    const leftCursor = document.querySelector('.left-cursor');
    const rightCursor = document.querySelector('.right-cursor');

    // Only initialize cursor behavior if cursors exist
    if (leftCursor && rightCursor) {
      window.addEventListener('scroll', () => {
        this.isScrolling = true;
        leftCursor.style.display = 'none';
        rightCursor.style.display = 'none';
        setTimeout(() => this.isScrolling = false, 50);
      });

      document.addEventListener('mousemove', (e) => {
        if (this.isScrolling) return;

        const isOverClickable = this.isExcludedElement(e.target);

        if (isOverClickable) {
          leftCursor.style.display = 'none';
          rightCursor.style.display = 'none';
          document.body.style.cursor = 'pointer';
          return;
        } else {
          document.body.style.cursor = 'none';
        }

        const middle = window.innerWidth / 2;
        const isLeftSide = e.clientX < middle;

        if (isLeftSide) {
          leftCursor.style.display = 'block';
          leftCursor.style.left = e.clientX + 'px';
          leftCursor.style.top = e.clientY + 'px';
          rightCursor.style.display = 'none';
        } else {
          rightCursor.style.display = 'block';
          rightCursor.style.left = e.clientX + 'px';
          rightCursor.style.top = e.clientY + 'px';
          leftCursor.style.display = 'none';
        }
      });

      document.addEventListener('mouseout', () => {
        leftCursor.style.display = 'none';
        rightCursor.style.display = 'none';
      });
    }

    // Desktop click navigation with slide animations
    document.addEventListener('click', (e) => {
      if (this.isExcludedElement(e.target)) {
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      this.navigateWithSlide(isLeftSide);
    });

    // Handle cursor changes for clickable elements
    const clickableElements = document.querySelectorAll('a, button, .logo-icon, .contact-link, .email-link, .phone-link, .address-link');
    clickableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
      });
      el.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'none';
      });
    });
  }

  // Initialize mobile swipe behavior
  initMobileBehavior() {
    if (!this.isMobile) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 50;

    const handleSwipe = () => {
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);
      
      // Only process horizontal swipes that are more horizontal than vertical
      if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
        if (diffX > 0) {
          // Swipe left: slide out left and go to next (home)
          this.navigateWithSlide(false, true);
        } else {
          // Swipe right: slide out right and go to previous (team)
          this.navigateWithSlide(true, true);
        }
      }
    };

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  // Initialize the system
  init() {
    // Handle page entrance animation
    this.handlePageEntrance();
    
    // Initialize behaviors based on device type
    this.initDesktopBehavior();
    this.initMobileBehavior();
  }
}

// ====================================
// INITIALIZE CONTACT PAGE
// ====================================

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the slide animation system for Contact page
  const slideSystem = new SlideAnimationSystem({
    navigationMap: {
      left: './team.html',     // Previous page (Team)
      right: './index.html'    // Next page (Home)
    },
    excludeSelectors: [
      '.top-bar', '.logo-icon', '.contact-link', 'button', 'a', 
      'input', 'textarea', 'select', '.email-link', '.phone-link', '.address-link',
      'a[href^="mailto:"]', 'a[href^="tel:"]', 'a.address-link'
    ]
  });

  // Contact page specific functionality can be added here if needed
  console.log('Contact page with slide animations initialized');
});