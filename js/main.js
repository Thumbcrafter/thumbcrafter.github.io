// ===== MAIN JAVASCRIPT FILE FOR THUMBCRAFTER =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE NAVIGATION =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ===== SMOOTH SCROLLING FOR NAVIGATION =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== PAGE LOAD ANIMATIONS =====
    function animateOnLoad() {
        const animatedElements = document.querySelectorAll('.fade-in-up');
        
        // Add staggered delay for hero elements
        animatedElements.forEach((element, index) => {
            if (element.closest('.hero')) {
                element.style.transitionDelay = `${index * 0.2}s`;
            }
        });

        // Trigger animations after a short delay
        setTimeout(() => {
            animatedElements.forEach(element => {
                element.classList.add('visible');
            });
        }, 100);
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    function handleScrollReveal() {
        const elements = document.querySelectorAll('.fade-in-up');
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.8;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerPoint) {
                element.classList.add('visible');
            }
        });
    }

    // ===== THUMBNAIL SLIDER OPTIMIZATION =====
    function optimizeSlider() {
        const sliderTrack = document.querySelector('.slider-track');
        
        if (sliderTrack) {
            // Use GPU-optimized transforms
            sliderTrack.style.transform = 'translate3d(0, 0, 0)';
            sliderTrack.style.willChange = 'transform';
            
            // Pause animation on hover for better UX
            const slider = document.querySelector('.thumbnail-slider');
            slider.addEventListener('mouseenter', () => {
                sliderTrack.style.animationPlayState = 'paused';
            });
            
            slider.addEventListener('mouseleave', () => {
                sliderTrack.style.animationPlayState = 'running';
            });
        }
    }

    // ===== CONTACT FORM HANDLING =====
    function handleContactForm() {
        const form = document.querySelector('.contact-form');
        const submitBtn = document.querySelector('.submit-btn');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                
                // Basic validation
                if (!name || !email || !message) {
                    showNotification('Please fill in all fields.', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address.', 'error');
                    return;
                }
                
                // Show loading state
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Submit to Formspree
                fetch('https://formspree.io/f/xanbagpw', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                        form.reset();
                    } else {
                        throw new Error('Failed to send message');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Failed to send message. Please try again.', 'error');
                })
                .finally(() => {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                });
            });
        }
    }

    // ===== EMAIL VALIDATION =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--brand-accent)' : type === 'error' ? '#ff4757' : 'var(--brand-accent-light)'};
            color: ${type === 'success' ? 'var(--brand-bg)' : 'white'};
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ===== NAVBAR SCROLL EFFECT =====
    function handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove background on scroll
            if (scrollTop > 50) {
                navbar.style.background = 'rgba(1, 20, 38, 0.98)';
            } else {
                navbar.style.background = 'rgba(1, 20, 38, 0.95)';
            }
            
            // Hide/show navbar on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // ===== PERFORMANCE OPTIMIZATION =====
    function optimizePerformance() {
        // Use Intersection Observer for scroll animations if supported
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);
            
            // Observe all animated elements
            document.querySelectorAll('.fade-in-up').forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback to scroll event
            window.addEventListener('scroll', handleScrollReveal);
        }
        
        // Throttle scroll events for better performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScrollReveal();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    function enhanceAccessibility() {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid var(--brand-accent)';
                this.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', function() {
                this.style.outline = 'none';
            });
        });
        
        // Add skip to content link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--brand-accent);
            color: var(--brand-bg);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10001;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // ===== FULLSCREEN IMAGE VIEWER =====
    function initFullscreenImageViewer() {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const closeBtn = document.getElementById('closeModal');
        
        // Add click event to all showcase images
        const showcaseImages = document.querySelectorAll('.showcase img, .slide img');
        
        showcaseImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                modalImage.src = this.src;
                modalImage.alt = this.alt;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Initialize zoom and pan functionality
                initImageZoomAndPan(modalImage);
            });
        });
        
        // Close modal functionality
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            // Reset image transform
            modalImage.style.transform = 'scale(1) translate(0, 0)';
            modalImage.classList.remove('zoomed');
        }
        
        function initImageZoomAndPan(img) {
            let isZoomed = false;
            let currentScale = 1;
            let startX, startY, translateX = 0, translateY = 0;
            
            img.addEventListener('click', function(e) {
                if (!isZoomed) {
                    // First click: zoom in
                    currentScale = 2;
                    isZoomed = true;
                    img.classList.add('zoomed');
                    img.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
                    e.stopPropagation();
                } else {
                    // Second click: zoom out
                    currentScale = 1;
                    isZoomed = false;
                    img.classList.remove('zoomed');
                    translateX = 0;
                    translateY = 0;
                    img.style.transform = 'scale(1) translate(0, 0)';
                    e.stopPropagation();
                }
            });
            
            // Touch events for mobile
            let initialDistance = 0;
            let initialScale = 1;
            
            img.addEventListener('touchstart', function(e) {
                if (e.touches.length === 2) {
                    initialDistance = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    initialScale = currentScale;
                }
            });
            
            img.addEventListener('touchmove', function(e) {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    const currentDistance = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    
                    const scale = (currentDistance / initialDistance) * initialScale;
                    currentScale = Math.max(1, Math.min(scale, 4));
                    
                    img.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
                    isZoomed = currentScale > 1;
                    img.classList.toggle('zoomed', isZoomed);
                }
            });
            
            // Mouse wheel zoom for desktop
            img.addEventListener('wheel', function(e) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                currentScale = Math.max(1, Math.min(currentScale * delta, 4));
                
                img.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
                isZoomed = currentScale > 1;
                img.classList.toggle('zoomed', isZoomed);
            });
            
            // Pan functionality when zoomed
            img.addEventListener('mousedown', function(e) {
                if (isZoomed) {
                    startX = e.clientX - translateX;
                    startY = e.clientY - translateY;
                    
                    function onMouseMove(e) {
                        translateX = e.clientX - startX;
                        translateY = e.clientY - startY;
                        img.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
                    }
                    
                    function onMouseUp() {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    }
                    
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                }
            });
        }
    }

    // ===== INITIALIZATION =====
    function init() {
        // Initialize all functionality
        animateOnLoad();
        optimizeSlider();
        handleContactForm();
        handleNavbarScroll();
        optimizePerformance();
        enhanceAccessibility();
        initFullscreenImageViewer();
        
        // Initial scroll reveal check
        handleScrollReveal();
        
        // Add window resize handler for responsive adjustments
        window.addEventListener('resize', () => {
            // Recalculate positions and sizes if needed
            handleScrollReveal();
        });
    }

    // ===== START THE APPLICATION =====
    init();
    
    // ===== EXPOSE FUNCTIONS FOR DEBUGGING (OPTIONAL) =====
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.ThumbCrafter = {
            showNotification,
            handleScrollReveal,
            optimizeSlider
        };
    }
});

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}
