const leftCursor = document.querySelector('.left-cursor');
const rightCursor = document.querySelector('.right-cursor');
const logoIcon = document.querySelector('.logo-icon');
const contactLink = document.querySelector('.contact-link');
const emailLink = document.querySelector('.email-link');
const phoneLink = document.querySelector('.phone-link');
const addressLink = document.querySelector('.address-link');

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ======================
// DESKTOP BEHAVIOR ONLY
// ======================
if (!isMobile && leftCursor && rightCursor) {
  let isScrolling = false;

  window.addEventListener('scroll', function () {
    isScrolling = true;
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    setTimeout(() => isScrolling = false, 50);
  });

  document.addEventListener('mousemove', function (e) {
    if (isScrolling) return;

    const isOverClickable = e.target.closest('.top-bar') ||
      e.target === logoIcon ||
      e.target === contactLink ||
      e.target === emailLink ||
      e.target === phoneLink ||
      e.target === addressLink ||
      e.target.closest('a[href^="mailto:"]') ||
      e.target.closest('a[href^="tel:"]') ||
      e.target.closest('a.address-link');

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

  document.addEventListener('mouseout', function () {
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
  });

  // Desktop click navigation with slide animations
  document.addEventListener('click', function (e) {
    if (e.target.closest('.top-bar') ||
      e.target === logoIcon ||
      e.target === contactLink ||
      e.target.closest('.team-member a') ||
      e.target === emailLink ||
      e.target === phoneLink ||
      e.target === addressLink ||
      e.target.closest('a[href^="mailto:"]') ||
      e.target.closest('a[href^="tel:"]') ||
      e.target.closest('a.address-link')) {
      return;
    }

    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;
    const pageContainer = document.body; // Use body as container

    // Add slide animation class
    if (isLeftSide) {
      pageContainer.classList.add('slide-out-right');
    } else {
      pageContainer.classList.add('slide-out-left');
    }

    // Navigate after animation completes
    setTimeout(() => {
      if (isLeftSide) {
        window.location.href = './partners.html';
      } else {
        window.location.href = './journey.html';
      }
    }, 600); // Match animation duration
  });
}

// Add pointer cursor for interactive elements if they exist
[logoIcon, contactLink, emailLink, phoneLink, addressLink].forEach(el => {
  if (el) {
    el.addEventListener('mouseenter', () => {
      document.body.style.cursor = 'pointer';
    });
    el.addEventListener('mouseleave', () => {
      document.body.style.cursor = 'none';
    });
  }
});

// ======================
// COUNTER ANIMATION
// ======================
function animateCounters() {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    let current = 0;
    const increment = Math.ceil(target / 100);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        counter.textContent = current.toLocaleString();
      }
    }, 20);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
});

// ======================
// MOBILE SWIPE NAVIGATION WITH SLIDE ANIMATIONS
// ======================
if (isMobile) {
  let touchStartX = 0;
  let touchStartY = 0;
  const swipeThreshold = 50; // Minimum swipe distance

  function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only process horizontal swipes that are more horizontal than vertical
    if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
      const pageContainer = document.body; // Use body as container
      
      if (diffX > 0) {
        // Swipe Left → slide out left and go to next page
        pageContainer.classList.add('slide-out-left');
        setTimeout(() => {
          window.location.href = './journey.html';
        }, 500); // Slightly faster on mobile
      } else {
        // Swipe Right → slide out right and go to previous page
        pageContainer.classList.add('slide-out-right');
        setTimeout(() => {
          window.location.href = './partners.html';
        }, 500);
      }
    }
  }

  let touchEndX = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });
}