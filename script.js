// Synchronized Hero Background and Slider Animation - Four Layer Transition
let currentSlideIndex = 0;
const totalSlides = 5; // 5 background slides (Mc1-Mc5)
const bgSlides = document.querySelectorAll('.bg-slide');
const sliderContainer = document.querySelector('.slider-container');
const sliderItems = document.querySelectorAll('.slider-item');
let currentActiveSliderIndex = 0; // Track which slider item is active
let animationInterval = null;

// Map slide indices to active slider items and positions based on Figma design
// Positions are calculated responsively based on screen size
// Mc1 (0) -> f1 (index 0, position 0), Mc2 (1) -> f2 (index 1, position varies), 
// Mc3 (2) -> f3 (index 2, position varies), Mc4 (3) -> f4 (index 3, position varies), 
// Mc5 (4) -> f5 (index 4, position varies, which is duplicate of f1)

// Function to calculate responsive slider positions
function getSliderPositions() {
    const screenWidth = window.innerWidth;

    // Mobile (max-width: 768px)
    if (screenWidth <= 768) {
        return [
            { itemIndex: 0, position: 0 },      // Mc1 -> f1
            { itemIndex: 1, position: -114 },   // Mc2 -> f2 (98px + 16px gap)
            { itemIndex: 2, position: -228 },   // Mc3 -> f3
            { itemIndex: 3, position: -342 },   // Mc4 -> f4
            { itemIndex: 4, position: -456 }    // Mc5 -> f5
        ];
    }
    // Tablet (769px - 1024px)
    else if (screenWidth <= 1024) {
        return [
            { itemIndex: 0, position: 0 },      // Mc1 -> f1
            { itemIndex: 1, position: -164 },   // Mc2 -> f2 (140px + 24px gap)
            { itemIndex: 2, position: -328 },   // Mc3 -> f3
            { itemIndex: 3, position: -492 },   // Mc4 -> f4
            { itemIndex: 4, position: -656 }    // Mc5 -> f5
        ];
    }
    // Desktop (1025px - 1439px)
    else if (screenWidth <= 1439) {
        return [
            { itemIndex: 0, position: 0 },      // Mc1 -> f1
            { itemIndex: 1, position: -180 },   // Mc2 -> f2 (156px + 24px gap)
            { itemIndex: 2, position: -360 },   // Mc3 -> f3
            { itemIndex: 3, position: -540 },   // Mc4 -> f4
            { itemIndex: 4, position: -720 }    // Mc5 -> f5
        ];
    }
    // Large Desktop (1440px+)
    else {
        return [
            { itemIndex: 0, position: 0 },      // Mc1 -> f1
            { itemIndex: 1, position: -212 },   // Mc2 -> f2 (188px + 24px gap)
            { itemIndex: 2, position: -424 },   // Mc3 -> f3
            { itemIndex: 3, position: -636 },   // Mc4 -> f4
            { itemIndex: 4, position: -848 }    // Mc5 -> f5
        ];
    }
}

let slideToSliderMap = getSliderPositions();

function initSynchronizedHeroAnimation() {
    if (bgSlides.length === 0 || !sliderContainer || sliderItems.length === 0) return;

    // Initialize first slide
    bgSlides[0].classList.add('active');
    sliderItems[0].classList.add('active');
    sliderContainer.style.transform = 'translateX(0)';
    sliderContainer.setAttribute('data-slide', '0');

    // Four-layer synchronized transition function with seamless forward-only infinite loop
    function transitionToNextSlide() {
        const previousSlideIndex = currentSlideIndex;
        const previousSliderIndex = currentActiveSliderIndex;

        // Layer 1: Remove active class from current background slide (opacity fade transition)
        bgSlides[previousSlideIndex].classList.remove('active');

        // Layer 4: Remove active class from current slider item (size shrink transition)
        sliderItems[previousSliderIndex].classList.remove('active');

        // Move to next slide
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        const sliderConfig = slideToSliderMap[currentSlideIndex];
        currentActiveSliderIndex = sliderConfig.itemIndex;

        // Layer 1: Add active class to new background slide (opacity fade transition)
        bgSlides[currentSlideIndex].classList.add('active');

        // Handle seamless infinite forward loop
        if (previousSlideIndex === 4 && currentSlideIndex === 0) {
            // We're transitioning from slide 5 (index 4) back to slide 1 (index 0)
            // To create seamless forward loop, we need to:
            // 1. Instantly reset position to slide 1 (0) without animation
            // 2. Switch active classes from slide 5 to slide 1
            // 3. Re-enable transitions for next cycle
            
            // Disable transition for instant reset
            sliderContainer.style.transition = 'none';
            
            // Reset position to slide 1 (0)
            sliderContainer.style.transform = 'translateX(0)';
            
            // Switch active classes
            sliderItems[4].classList.remove('active');
            sliderItems[0].classList.add('active');
            
            // Re-enable transition after reset completes
            // Use double requestAnimationFrame to ensure DOM update happens
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sliderContainer.style.transition = '';
                });
            });
        } else {
            // Normal forward progression: Layer 3 - Move slider container horizontally (rightward)
            sliderContainer.style.transform = `translateX(${sliderConfig.position}px)`;

            // Layer 4: Add active class to new slider item (size grow transition)
            sliderItems[currentActiveSliderIndex].classList.add('active');
        }

        // Update data attribute for tracking
        sliderContainer.setAttribute('data-slide', currentSlideIndex.toString());
    }

    // Start the synchronized animation
    // Initial delay, then transition every 4 seconds
    setTimeout(() => {
        animationInterval = setInterval(transitionToNextSlide, 4000);
    }, 3000); // Start after 3 seconds on first slide
}

// Recalculate slider positions on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        slideToSliderMap = getSliderPositions();
        // Update current slider position
        if (sliderContainer && currentSlideIndex < slideToSliderMap.length) {
            const currentConfig = slideToSliderMap[currentSlideIndex];
            sliderContainer.style.transition = 'none';
            sliderContainer.style.transform = `translateX(${currentConfig.position}px)`;
            setTimeout(() => {
                sliderContainer.style.transition = '';
            }, 50);
        }
    }, 250);
});

// Stories Section Navigation
const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');
const paginationDots = document.querySelectorAll('.dot');
let currentStoryIndex = 0;
const totalStories = paginationDots.length;

function updateStoriesDisplay(index) {
    // Remove active class from all dots
    paginationDots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current dot
    if (paginationDots[index]) {
        paginationDots[index].classList.add('active');
    }

    // Here you would update the story content/images
    // For now, we'll just update the pagination
}

if (prevArrow) {
    prevArrow.addEventListener('click', () => {
        currentStoryIndex = (currentStoryIndex - 1 + totalStories) % totalStories;
        updateStoriesDisplay(currentStoryIndex);
    });
}

if (nextArrow) {
    nextArrow.addEventListener('click', () => {
        currentStoryIndex = (currentStoryIndex + 1) % totalStories;
        updateStoriesDisplay(currentStoryIndex);
    });
}

// Pagination dots click handlers
paginationDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentStoryIndex = index;
        updateStoriesDisplay(currentStoryIndex);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// NAVBAR STICKY BEHAVIOR WITH SLIDE-DOWN ANIMATION
// ============================================
// Behavior:
// 1. Navbar visible at top (non-sticky)
// 2. Navbar hides when scrolling inside hero section
// 3. Navbar becomes sticky ONLY after hero section is fully scrolled past
// 4. Smooth slide-down animation with transform translateY
// ============================================

const navbar = document.querySelector('.navbar');

// Generic function to find hero section on any page
function findHeroSection() {
    // Try different hero section selectors for different pages
    const heroSelectors = [
        '.hero-section',           // Home page
        '.showcase-hero',          // Showcase page
        '.our-story-hero',         // Our Story page
        '.bridal-hero',            // Bridal Artistry page
        '.floral-hero',            // Floral Stories page
        '.stories-love-hero',      // Stories of Love page
    ];
    
    for (const selector of heroSelectors) {
        const section = document.querySelector(selector);
        if (section) {
            return section;
        }
    }
    
    // If no hero section found, use the first section as reference
    const firstSection = document.querySelector('section');
    return firstSection || null;
}

const heroSection = findHeroSection();

// Initialize navbar state
function initNavbarState() {
    if (!navbar) return;
    
    // Ensure navbar is always visible
    navbar.style.visibility = 'visible';
    navbar.style.opacity = '1';
    navbar.style.display = 'flex';
    
    // Check if we're on a page with hero section
    if (heroSection) {
        // Initialize with nav-visible state (at top, non-sticky)
        navbar.classList.remove('sticky', 'nav-hidden', 'nav-sticky');
        navbar.classList.add('nav-visible');
    } else {
        // For pages without any section, use legacy sticky behavior
        handleLegacyNavbarBehavior();
    }
}

// Legacy navbar behavior for pages without hero section
function handleLegacyNavbarBehavior() {
    if (!navbar) return;
    
    const logo = navbar.querySelector('.navbar-logo');
    const body = document.body;
    
    // Check if page has dark navbar background (#401F28) by default
    const hasDarkNavbar = body.classList.contains('bridal-artistry-page') ||
                         body.classList.contains('floral-stories-page') ||
                         body.classList.contains('showcase-page') ||
                         body.classList.contains('our-story-page') ||
                         body.classList.contains('contact-page');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 0) {
            navbar.classList.add('sticky');
            if (logo) {
                logo.classList.add('logo-white');
            }
        } else {
            navbar.classList.remove('sticky');
            if (logo && !hasDarkNavbar) {
                logo.classList.remove('logo-white');
            } else if (logo && hasDarkNavbar) {
                logo.classList.add('logo-white');
            }
        }
    });
}

// Hero section navbar behavior with IntersectionObserver
// Works with any hero section type (hero-section, showcase-hero, our-story-hero, etc.)
function initHeroNavbarBehavior() {
    if (!navbar || !heroSection) return;
    
    // Ensure hero section has position relative for sentinel positioning
    const heroStyles = window.getComputedStyle(heroSection);
    if (heroStyles.position === 'static') {
        heroSection.style.position = 'relative';
    }
    
    // Create sentinel element at bottom of hero section to detect when it's passed
    // Check if sentinel already exists to avoid duplicates
    let sentinel = heroSection.querySelector('[data-navbar-sentinel]');
    if (!sentinel) {
        sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.bottom = '0';
        sentinel.style.left = '0';
        sentinel.style.width = '1px';
        sentinel.style.height = '1px';
        sentinel.style.pointerEvents = 'none';
        sentinel.style.zIndex = '-1';
        sentinel.setAttribute('data-navbar-sentinel', 'true');
        heroSection.appendChild(sentinel);
    }
    
    // Use scroll event for precise control (more reliable than IntersectionObserver for this use case)
    // Throttle scroll events for better performance
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroRect = heroSection.getBoundingClientRect();
                const heroBottomPassed = heroRect.bottom <= 0;
                
                // Update navbar state
                updateNavbarState(heroBottomPassed, scrollY);
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Update navbar state based on scroll position
function updateNavbarState(heroBottomPassed, scrollY) {
    if (!navbar || !heroSection) return;
    
    // State 1: At top of page - visible, non-sticky
    if (scrollY <= 10) { // Small threshold to handle sub-pixel scrolling
        navbar.classList.remove('nav-hidden', 'nav-sticky', 'sticky');
        navbar.classList.add('nav-visible');
        return;
    }
    
    // State 2: Hero bottom passed - sticky (always visible with dark background)
    if (heroBottomPassed) {
        navbar.classList.remove('nav-visible', 'nav-hidden', 'sticky');
        navbar.classList.add('nav-sticky');
        return;
    }
    
    // State 3: Inside hero section - hide when scrolling down
    // (scrollY > 10 ensures we're past the very top)
    if (!heroBottomPassed && scrollY > 10) {
        navbar.classList.remove('nav-visible', 'nav-sticky', 'sticky');
        navbar.classList.add('nav-hidden');
    }
}

// Initialize logo color based on navbar state on page load
function initializeLogoColor() {
    const navbar = document.querySelector('.navbar');
    const logo = navbar?.querySelector('.navbar-logo');
    const body = document.body;
    
    if (navbar && logo) {
        // Check if page has dark navbar background (#401F28) by default
        const hasDarkNavbar = body.classList.contains('bridal-artistry-page') ||
                             body.classList.contains('floral-stories-page') ||
                             body.classList.contains('showcase-page') ||
                             body.classList.contains('our-story-page') ||
                             body.classList.contains('contact-page');
        
        // Check if navbar is sticky (background is #401F28)
        if (hasDarkNavbar || navbar.classList.contains('sticky') || window.pageYOffset > 0) {
            logo.classList.add('logo-white');
        } else {
            logo.classList.remove('logo-white');
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSynchronizedHeroAnimation();
    updateStoriesDisplay(0);
    initializeLogoColor();
    initNavbarState();
    
    // Initialize hero navbar behavior if hero section exists
    // This now works for all pages with any type of hero section
    if (heroSection) {
        initHeroNavbarBehavior();
    }

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Gallery item hover effects are handled via CSS transitions

// Button click handlers
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', function (e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Mobile Menu Toggle Functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuOverlay = document.getElementById('mobile-menu-overlay');
    const menuClose = document.getElementById('mobile-menu-close');
    const hamburgerIcon = menuToggle?.querySelector('.hamburger-icon');
    const closeIcon = menuToggle?.querySelector('.close-icon');

    // Only initialize if elements exist and screen width is 768px or less
    function checkScreenWidth() {
        return window.innerWidth <= 768;
    }

    function toggleMenu() {
        if (!checkScreenWidth()) return;

        if (menuOverlay && menuToggle) {
            const isOpen = menuOverlay.classList.contains('active');

            if (isOpen) {
                // Close menu
                menuOverlay.classList.remove('active');
                menuToggle.classList.remove('menu-open');
                document.body.style.overflow = '';
            } else {
                // Open menu
                menuOverlay.classList.add('active');
                menuToggle.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    function closeMenu() {
        if (menuOverlay && menuToggle) {
            menuOverlay.classList.remove('active');
            menuToggle.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    }

    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (checkScreenWidth()) {
                toggleMenu();
            }
        });
    }

    if (menuClose) {
        menuClose.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }

    // Close menu when clicking on overlay (but not on menu content)
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function (e) {
            if (e.target === menuOverlay) {
                closeMenu();
            }
        });
    }

    // Close menu when clicking on mobile menu links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Small delay to allow navigation
            setTimeout(() => {
                closeMenu();
            }, 100);
        });
    });

    // Close menu when clicking on mobile menu button
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function () {
            setTimeout(() => {
                closeMenu();
            }, 100);
        });
    }

    // Handle window resize - close menu if screen becomes larger than 768px
    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, 250);
    });
}

// Initialize mobile menu on DOM load
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
});