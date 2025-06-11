const leftCursor = document.querySelector('.left-cursor');
const rightCursor = document.querySelector('.right-cursor');
const logoIcon = document.querySelector('.logo-icon');
const contactLink = document.querySelector('.contact-link');
const segments = document.querySelectorAll('.segment');

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isScrolling = false;
let activeSegment = null;

// =========================
// Desktop Cursor Behavior
// =========================
if (!isMobile) {
  window.addEventListener('scroll', function () {
    isScrolling = true;
    leftCursor.style.display = 'none';
    rightCursor.style.display = 'none';
    setTimeout(() => isScrolling = false, 50);
  });

  document.addEventListener('mousemove', function (e) {
    if (isScrolling) return;

    // FIXED: Removed .segment from this condition so cursor shows on segments
    const isOverClickable = e.target.closest('.top-bar') ||
                            e.target === logoIcon ||
                            e.target === contactLink;
                            // e.target.closest('.segment'); <- REMOVED THIS LINE

    if (isOverClickable) {
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
      return;
    }

    const middle = window.innerWidth / 2;
    const isLeftSide = e.clientX < middle;

    const cursor = isLeftSide ? leftCursor : rightCursor;
    const otherCursor = isLeftSide ? rightCursor : leftCursor;

    otherCursor.style.display = 'none';
    cursor.style.display = 'block';
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Desktop click-based navigation with slide animations
  document.addEventListener('click', function (e) {
    if (
      e.target.closest('.top-bar') ||
      e.target === logoIcon ||
      e.target === contactLink ||
      e.target.closest('.segment') ||
      e.target.closest('.team-member a')
    ) {
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
        window.location.href = './renewable-confidence.html';
      } else {
        window.location.href = './in-numbers.html';
      }
    }, 600); // Match animation duration
  });
}

// =========================
// Segment Click Behavior (Shared)
// =========================
segments.forEach(segment => {
  segment.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (activeSegment) {
      activeSegment.classList.remove('active');
    }

    if (activeSegment === this) {
      activeSegment = null;
    } else {
      this.classList.add('active');
      activeSegment = this;
    }
  });
});

// =========================
// Mobile Swipe Navigation with Slide Animations
// =========================
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
        // Swipe left: slide out left and go to next
        pageContainer.classList.add('slide-out-left');
        setTimeout(() => {
          window.location.href = './in-numbers.html';
        }, 500); // Slightly faster on mobile
      } else {
        // Swipe right: slide out right and go to previous
        pageContainer.classList.add('slide-out-right');
        setTimeout(() => {
          window.location.href = './renewable-confidence.html';
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