// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle Functionality
    const menuToggle = document.querySelector('.mobileMenu-toggle');
    const navPagesContainer = document.querySelector('.navPages-container');
    const body = document.body;

    // Mobile menu toggle
    if (menuToggle && navPagesContainer) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('is-active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navPagesContainer.classList.toggle('is-open');
            body.classList.toggle('has-activeNavPages');
        });
    }

    // Mobile submenu toggles
    const mobileSubMenuToggles = document.querySelectorAll('.has-subMenu-mobile > a');
    mobileSubMenuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const subMenu = this.nextElementSibling;
            if (subMenu) {
                this.classList.toggle('is-active');
                subMenu.classList.toggle('is-open');
            }
        });
    });

    // Quick Search Functionality
    const quickSearchToggle = document.getElementById('quick-search-expand');
    const quickSearchDropdown = document.getElementById('quickSearch');
    const quickSearchInput = document.getElementById('nav-quick-search');
    const quickSearchClose = quickSearchDropdown ? quickSearchDropdown.querySelector('.modal-close') : null;

    if (quickSearchToggle && quickSearchDropdown) {
        quickSearchToggle.addEventListener('click', function() {
            const isHidden = quickSearchDropdown.getAttribute('aria-hidden') === 'true';
            
            if (isHidden) {
                quickSearchDropdown.setAttribute('aria-hidden', 'false');
                if (quickSearchInput) {
                    quickSearchInput.focus();
                }
            } else {
                quickSearchDropdown.setAttribute('aria-hidden', 'true');
            }
        });

        // Close search dropdown
        if (quickSearchClose) {
            quickSearchClose.addEventListener('click', function() {
                quickSearchDropdown.setAttribute('aria-hidden', 'true');
            });
        }

        // Close search on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && quickSearchDropdown.getAttribute('aria-hidden') === 'false') {
                quickSearchDropdown.setAttribute('aria-hidden', 'true');
                quickSearchToggle.focus();
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!quickSearchDropdown.contains(e.target) && !quickSearchToggle.contains(e.target)) {
                if (quickSearchDropdown.getAttribute('aria-hidden') === 'false') {
                    quickSearchDropdown.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }

    // Search Form Submission
    const quickSearchForm = document.querySelector('[data-quick-search-form]');
    if (quickSearchForm && quickSearchInput) {
        quickSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = quickSearchInput.value.trim();
            
            if (searchTerm) {
                // Simple search redirect - you can customize this URL
                window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            } else {
                // Show error or focus input
                quickSearchInput.focus();
                quickSearchInput.setAttribute('aria-invalid', 'true');
            }
        });

        // Clear error state when user starts typing
        quickSearchInput.addEventListener('input', function() {
            if (this.hasAttribute('aria-invalid')) {
                this.removeAttribute('aria-invalid');
            }
        });
    }

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Enhanced Accessibility for Dropdown Menus
    const hasSubMenuItems = document.querySelectorAll('.has-subMenu');
    hasSubMenuItems.forEach(function(item) {
        const trigger = item.querySelector('.navPages-action');
        const submenu = item.querySelector('.navPage-subMenu');
        
        if (trigger && submenu) {
            let hoverTimeout;
            
            // Mouse events
            item.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
                submenu.setAttribute('aria-hidden', 'false');
            });
            
            item.addEventListener('mouseleave', function() {
                hoverTimeout = setTimeout(function() {
                    submenu.setAttribute('aria-hidden', 'true');
                }, 150);
            });
            
            // Keyboard events
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isHidden = submenu.getAttribute('aria-hidden') !== 'false';
                    submenu.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
                }
                
                if (e.key === 'Escape') {
                    submenu.setAttribute('aria-hidden', 'true');
                    trigger.focus();
                }
            });
        }
    });

    // Cart functionality (basic implementation)
    const cartButton = document.querySelector('[data-cart-preview]');
    const cartQuantity = document.querySelector('.cart-quantity');
    
    if (cartButton && cartQuantity) {
        // Update cart count from localStorage or API
        updateCartCount();
        
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Here you would typically show cart dropdown or navigate to cart page
            console.log('Cart clicked - implement cart functionality');
        });
    }

    // Phone number click tracking (for analytics)
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone number clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'contact',
                    'event_label': 'phone'
                });
            }
        });
    });

    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.setAttribute('aria-invalid', 'true');
                    field.focus();
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    // Lazy loading for images (if needed)
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // Notification system (for user feedback)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        return notification;
    }

});