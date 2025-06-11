document.addEventListener('DOMContentLoaded', function() {
  const leftCursor = document.querySelector('.left-cursor');
  const rightCursor = document.querySelector('.right-cursor');
  const logoIcon = document.querySelector('.logo-icon');
  const contactLink = document.querySelector('.contact-link');
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // DESKTOP BEHAVIOR
  if (!isMobile && leftCursor && rightCursor) {
    let isScrolling = false;

    // Hide cursors during scroll
    window.addEventListener('scroll', function() {
      isScrolling = true;
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
      setTimeout(() => isScrolling = false, 50);
    });

    // Mouse move handler for custom cursors
    document.addEventListener('mousemove', function(e) {
      if (isScrolling) return;

      const isOverClickable = e.target.closest('.top-bar') ||
                             e.target === logoIcon ||
                             e.target === contactLink ||
                             e.target.closest('a');

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

    // Hide cursors when mouse leaves window
    document.addEventListener('mouseout', function() {
      leftCursor.style.display = 'none';
      rightCursor.style.display = 'none';
    });

    // Click navigation handler
    document.addEventListener('click', function(e) {
      if (e.target.closest('.top-bar') ||
          e.target === logoIcon ||
          e.target === contactLink ||
          e.target.closest('a')) {
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;
      const pageContainer = document.body;

      if (isLeftSide) {
        pageContainer.classList.add('slide-out-right');
        setTimeout(() => {
          window.location.href = './in-numbers.html';
        }, 600);
      } else {
        pageContainer.classList.add('slide-out-left');
        setTimeout(() => {
          window.location.href = './team.html';
        }, 600);
      }
    });
  }

  // MOBILE BEHAVIOR
  if (isMobile) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 50;

    function handleSwipe() {
      const diffX = touchStartX - touchEndX;
      const diffY = Math.abs(touchStartY - touchEndY);
      
      if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
        const pageContainer = document.body;
        
        if (diffX > 0) {
          pageContainer.classList.add('slide-out-left');
          setTimeout(() => {
            window.location.href = './team.html';
          }, 500);
        } else {
          pageContainer.classList.add('slide-out-right');
          setTimeout(() => {
            window.location.href = './in-Numbers.html';
          }, 500);
        }
      }
    }

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }
});