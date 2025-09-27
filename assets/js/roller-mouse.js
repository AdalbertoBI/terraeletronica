// Roller Mouse Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Roller Mouse page functionality
    initRollerMouse();
});

function initRollerMouse() {
    // Add smooth scrolling to internal links
    initSmoothScrolling();
    
    // Initialize feature cards hover effects
    initFeatureCards();
    
    // Initialize purchase button tracking
    initPurchaseTracking();
    
    // Initialize accessibility features
    initAccessibility();
    
    // Initialize animations
    initAnimations();
}

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initPurchaseTracking() {
    const purchaseButtons = document.querySelectorAll('.btn-purchase');
    const quoteButtons = document.querySelectorAll('.btn-quote');
    
    purchaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track purchase button click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Product',
                    event_label: 'Roller Mouse - Purchase Button',
                    value: 1
                });
            }
            
            // Add ripple effect
            createRippleEffect(this);
        });
    });
    
    quoteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track quote button click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Product',
                    event_label: 'Roller Mouse - Quote Button',
                    value: 1
                });
            }
            
            // Add ripple effect
            createRippleEffect(this);
        });
    });
}

function createRippleEffect(button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initAccessibility() {
    // Enhance keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels for better screen reader support
    const productImage = document.querySelector('.product-image img');
    if (productImage && !productImage.getAttribute('aria-label')) {
        productImage.setAttribute('aria-label', 'Roller Mouse - Mouse especial com roletes para pessoas com dificuldades motoras');
    }
}

function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .benefit-item, .specs-table'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility function for responsive image loading
function initResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Handle window resize for responsive adjustments
window.addEventListener('resize', function() {
    // Adjust layout elements on resize if needed
    const heroContent = document.querySelector('.product-content');
    if (heroContent) {
        if (window.innerWidth <= 768) {
            heroContent.style.gridTemplateColumns = '1fr';
        } else {
            heroContent.style.gridTemplateColumns = '1fr 1fr';
        }
    }
});

// Error handling for external dependencies
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
        console.warn('Failed to load external resource:', e.target.src || e.target.href);
    }
});

// Add CSS for ripple effect
if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}