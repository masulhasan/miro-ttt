// RENEWABLE-CONFIDENCE.js - Fixed Video Playback
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
let isScrolling = false;
let videoObserver;

document.addEventListener('DOMContentLoaded', function () {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // ✅ Safari fallback
    if (isSafari) {
        const carousel = document.querySelector(".right-carousel");
        if (carousel) {
            const imageSet = [
                "Assets/img/Safari-Img/Ship_2.jpg",
                "Assets/img/Safari-Img/Transport_2.jpg", 
                "Assets/img/Safari-Img/219_bWV0ICgzNik_2.jpg",
                "Assets/img/Safari-Img/Plastic_Small_2.jpg"
            ];

            let imageHTML = "";
            for (let i = 0; i < 12; i++) {
                for (let j = 0; j < imageSet.length; j++) {
                    imageHTML += `<div class="carousel-image"><img src="${imageSet[j]}" alt="Fallback image ${j + 1}" /></div>`;
                }
            }

            carousel.innerHTML = `<div class="carousel-track animate-scroll">${imageHTML}</div>`;
        }
        return;
    }

    // 🔄 Non-Safari Browsers
    const leftCursor = document.querySelector('.left-cursor');
    const rightCursor = document.querySelector('.right-cursor');
    const logoIcon = document.querySelector('.logo-icon');
    const contactLink = document.querySelector('.contact-link');
    const carouselTrack = document.querySelector('.carousel-track');

    // Setup videos with faster loading
    setupVideos();
    
    // Start animation after page load
    if (carouselTrack) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                carouselTrack.classList.add('animate-scroll');
            }, 1000);
        });
    }

    setupScrollHandler(leftCursor, rightCursor);

    if (!isMobile) {
        setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink);
    } else {
        setupMobileInteractions();
    }
});

function setupVideos() {
    const videos = document.querySelectorAll('.carousel-video video');
    
    videos.forEach((video, index) => {
        // Basic video settings
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        
        // Make videos visible immediately
        video.style.opacity = '1';
        video.style.visibility = 'visible';
        
        // Force load to start downloading
        video.load();
        
        // Play first few videos when ready
        if (index < 6) {
            const playWhenReady = () => {
                if (video.readyState >= 2) {
                    video.play().catch(() => {
                        video.muted = true;
                        video.play().catch(() => {});
                    });
                }
            };

            if (video.readyState >= 2) {
                playWhenReady();
            } else {
                video.addEventListener('canplay', playWhenReady, { once: true });
                video.addEventListener('loadeddata', playWhenReady, { once: true });
            }
        }
    });

    // Setup observer after a short delay
    setTimeout(setupVideoObserver, 500);
}

function setupVideoObserver() {
    const carouselContainer = document.querySelector('.right-carousel');
    if (!carouselContainer) return;

    videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target.querySelector('video');
            if (!video) return;

            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                if (video.paused && video.readyState >= 2) {
                    video.play().catch(() => {
                        video.muted = true;
                        video.play().catch(() => {});
                    });
                }
            } else if (entry.intersectionRatio === 0) {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        root: carouselContainer,
        threshold: [0, 0.1, 0.5],
        rootMargin: '50px'
    });

    document.querySelectorAll('.carousel-video').forEach(container => {
        videoObserver.observe(container);
    });
}

function setupScrollHandler(leftCursor, rightCursor) {
    let scrollTimer;

    window.addEventListener('scroll', function () {
        if (!isScrolling) {
            isScrolling = true;
            if (leftCursor) leftCursor.style.display = 'none';
            if (rightCursor) rightCursor.style.display = 'none';
        }

        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            isScrolling = false;
        }, 150);
    }, { passive: true });
}

function setupDesktopInteractions(leftCursor, rightCursor, logoIcon, contactLink) {
    document.addEventListener('mousemove', function (e) {
        if (isScrolling) return;

        const isOverClickable = e.target.closest('.top-bar') ||
            e.target === logoIcon ||
            e.target === contactLink;

        if (isOverClickable) {
            leftCursor.style.display = 'none';
            rightCursor.style.display = 'none';
        } else {
            const middle = window.innerWidth / 2;
            const isLeftSide = e.clientX < middle;
            const cursor = isLeftSide ? leftCursor : rightCursor;
            const otherCursor = isLeftSide ? rightCursor : leftCursor;

            otherCursor.style.display = 'none';
            cursor.style.display = 'block';
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.closest('.top-bar') ||
            e.target === logoIcon ||
            e.target === contactLink) {
            return;
        }

        const middle = window.innerWidth / 2;
        const isLeftSide = e.clientX < middle;
        const pageContainer = document.body;

        if (isLeftSide) {
            pageContainer.classList.add('slide-out-right');
        } else {
            pageContainer.classList.add('slide-out-left');
        }

        setTimeout(() => {
            window.location.href = isLeftSide ? './index.html' : './partners.html';
        }, 600);
    });
}

function setupMobileInteractions() {
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 50;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            const pageContainer = document.body;

            if (diffX > 0) {
                pageContainer.classList.add('slide-out-left');
                setTimeout(() => {
                    window.location.href = './partners.html';
                }, 500);
            } else {
                pageContainer.classList.add('slide-out-right');
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 500);
            }
        }
    }, { passive: true });
}
