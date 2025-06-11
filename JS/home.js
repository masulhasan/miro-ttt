$(document).ready(function () {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const $container = $(".full-landing-image");

  // Enhanced ripple effect & settings (desktop only)
  if (!isMobile) {
    // Check if WebGL is supported (important for Safari)
    function isWebGLSupported() {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    if (isWebGLSupported()) {
      $container.ripples({
        perturbance: 0.15,        // Increased from 0.05 for bigger waves
        dropRadius: 35,           // Increased from 20 for larger ripples
        resolution: 1024,         // Increased from 512 for better quality
        imageUrl: null,
        dropEffect: true,
        interactive: true,
        crossOrigin: "",
        damping: 0.02,           // Reduced from 0.05 for longer-lasting waves
        autoStart: true
      });

      // Initial ripples with bigger effect
      setTimeout(function () {
        const width = $container.width();
        const height = $container.height();
        for (let i = 0; i < 4; i++) {  // Increased from 3
          $container.ripples("drop",
            Math.random() * width,
            Math.random() * height,
            50,      // Increased from 30 for bigger initial drops
            0.08     // Increased from 0.04 for stronger effect
          );
        }
      }, 500);

      // Continuous ripples with enhanced visibility
      setInterval(function () {
        const width = $container.width();
        const height = $container.height();
        $container.ripples("drop",
          Math.random() * width,
          Math.random() * height,
          25 + Math.random() * 40,  // Increased range: 25-65 instead of 15-35
          0.03 + Math.random() * 0.08  // Increased range: 0.03-0.11 instead of 0.01-0.05
        );
      }, 2500);  // Slightly more frequent: every 2.5s instead of 3s

      $(window).on('resize', function () {
        $container.ripples('updateSize');
      });

      // Enhanced mousemove ripples
      document.addEventListener("mousemove", function (e) {
        if (Math.random() > 0.94) {  // Increased frequency: 6% chance instead of 3%
          $container.ripples("drop",
            e.clientX,
            e.clientY,
            12,    // Increased from 5
            0.03   // Increased from 0.01
          );
        }
      });

      // Enhanced click ripples
      $(document).on("click", function (e) {
        if (e.target.closest(".top-bar") ||
          e.target === document.querySelector(".logo-icon") ||
          e.target === document.querySelector(".contact-link")) {
          return;
        }

        const middle = window.innerWidth / 2;
        const isLeftSide = e.clientX < middle;

        // Much bigger click ripple
        $container.ripples("drop", e.clientX, e.clientY, 80, 0.12);  // Increased from 40, 0.05

        if (isLeftSide) {
          document.body.classList.add("slide-out-right");
        } else {
          document.body.classList.add("slide-out-left");
        }

        $(document.body).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
          if (isLeftSide) {
            window.location.href = "./contact.html";
          } else {
            window.location.href = "./renewable-confidence.html";
          }
        });
      });
    } else {
      // Fallback for browsers without WebGL support
      console.log("WebGL not supported, ripple effects disabled");
    }
  }

  // Custom cursors (desktop only)
  if (!isMobile) {
    const leftCursor = document.querySelector(".left-cursor");
    const rightCursor = document.querySelector(".right-cursor");
    const leftActive = document.querySelector(".left-active");
    const rightActive = document.querySelector(".right-active");
    const logoIcon = document.querySelector(".logo-icon");
    const contactLink = document.querySelector(".contact-link");

    let isScrolling = false;

    window.addEventListener("scroll", function () {
      isScrolling = true;
      leftCursor.style.display = "none";
      rightCursor.style.display = "none";
      leftActive.classList.remove("active");
      rightActive.classList.remove("active");
      setTimeout(() => isScrolling = false, 50);
    });

    document.addEventListener("mousemove", function (e) {
      if (isScrolling) return;

      const isOverClickable = e.target.closest(".top-bar") ||
        e.target === logoIcon ||
        e.target === contactLink;

      if (isOverClickable) {
        leftCursor.style.display = "none";
        rightCursor.style.display = "none";
        leftActive.classList.remove("active");
        rightActive.classList.remove("active");
        return;
      }

      const middle = window.innerWidth / 2;
      const isLeftSide = e.clientX < middle;

      if (isLeftSide) {
        leftCursor.style.display = "block";
        leftCursor.style.left = e.clientX + "px";
        leftCursor.style.top = e.clientY + "px";
        rightCursor.style.display = "none";
        leftActive.classList.add("active");
        rightActive.classList.remove("active");
        leftCursor.classList.add("active");
        rightCursor.classList.remove("active");
      } else {
        rightCursor.style.display = "block";
        rightCursor.style.left = e.clientX + "px";
        rightCursor.style.top = e.clientY + "px";
        leftCursor.style.display = "none";
        rightActive.classList.add("active");
        leftActive.classList.remove("active");
        rightCursor.classList.add("active");
        leftCursor.classList.remove("active");
      }
    });

    document.addEventListener("mouseout", function () {
      leftCursor.style.display = "none";
      rightCursor.style.display = "none";
      leftActive.classList.remove("active");
      rightActive.classList.remove("active");
      leftCursor.classList.remove("active");
      rightCursor.classList.remove("active");
    });

    [logoIcon, contactLink].forEach(el => {
      el.addEventListener("mouseenter", () => {
        document.body.style.cursor = "pointer";
      });
      el.addEventListener("mouseleave", () => {
        document.body.style.cursor = "none";
      });
    });
  }

  // Swipe navigation on mobile with slide effect
  if (isMobile) {
    let touchStartX = null;
    let touchEndX = null;

    document.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (touchStartX === null || touchEndX === null) return;

      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe Left
          document.body.classList.add("slide-out-left");
          $(document.body).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            window.location.href = "./renewable-confidence.html";
          });
        } else {
          // Swipe Right
          document.body.classList.add("slide-out-right");
          $(document.body).one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
            window.location.href = "./contact.html";
          });
        }
      }

      touchStartX = null;
      touchEndX = null;
    }
  }
});