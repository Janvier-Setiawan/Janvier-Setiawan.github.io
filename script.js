// Enhanced Tab switching functionality with animations
class TabSystem {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.currentTab = 'about';
        this.isAnimating = false;
        
        this.init();
        this.initParticleEffect();
    }
    
    init() {
        // Add click event listeners to tab buttons
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.closest('.tab-button').getAttribute('data-tab');
                this.switchTab(tabId);
            });
            
            // Add ripple effect
            button.addEventListener('click', this.createRipple);
        });
        
        // Handle URL hash routing
        this.handleHashRouting();
        window.addEventListener('hashchange', () => {
            this.handleHashRouting();
        });
        
        // Handle keyboard navigation
        this.handleKeyboardNavigation();
        
        // Add intersection observer for scroll animations
        this.initScrollAnimations();
        
        // Add mouse tracking for floating elements
        this.initMouseTracking();
    }
    
    createRipple(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Add ripple styles
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
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
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    switchTab(tabId) {
        // Don't switch if it's already the current tab or if animating
        if (tabId === this.currentTab || this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Remove active class from current tab button and content
        this.tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        const currentContent = document.getElementById(this.currentTab);
        
        // Animate out current content
        if (currentContent) {
            currentContent.style.transform = 'translateY(-30px) scale(0.95)';
            currentContent.style.opacity = '0';
            
            setTimeout(() => {
                currentContent.classList.remove('active');
            }, 200);
        }
        
        // Add active class to new tab button
        const newTabButton = document.querySelector(`[data-tab="${tabId}"]`);
        const newTabContent = document.getElementById(tabId);
        
        if (newTabButton && newTabContent) {
            newTabButton.classList.add('active');
            
            // Animate in new content
            setTimeout(() => {
                newTabContent.classList.add('active');
                newTabContent.style.transform = 'translateY(30px) scale(0.95)';
                newTabContent.style.opacity = '0';
                
                // Trigger reflow
                newTabContent.offsetHeight;
                
                newTabContent.style.transform = 'translateY(0) scale(1)';
                newTabContent.style.opacity = '1';
                
                this.currentTab = tabId;
                this.isAnimating = false;
                
                // Animate content elements
                this.animateContentElements(newTabContent);
                
            }, 250);
            
            // Update URL hash
            this.updateHash(tabId);
            
            // Add tab switch particle effect
            this.triggerTabSwitchEffect(newTabButton);
        }
    }
    
    animateContentElements(container) {
        const elements = container.querySelectorAll('.section, .project, .essay-item, .contact-link');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    triggerTabSwitchEffect(button) {
        const rect = button.getBoundingClientRect();
        const particles = [];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            const angle = (i * 45) * Math.PI / 180;
            const distance = 50 + Math.random() * 30;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { 
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
        }
        
        setTimeout(() => {
            particles.forEach(particle => particle.remove());
        }, 800);
    }
    
    initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all content sections
        document.querySelectorAll('.section, .project, .essay-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    initMouseTracking() {
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Parallax effect for floating shapes
        const shapes = document.querySelectorAll('.shape');
        
        const updateParallax = () => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            shapes.forEach((shape, index) => {
                const speed = 0.02 + (index * 0.01);
                const x = (mouseX - centerX) * speed;
                const y = (mouseY - centerY) * speed;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            requestAnimationFrame(updateParallax);
        };
        
        updateParallax();
    }
    
    initParticleEffect() {
        // Create floating particles in background
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float ${10 + Math.random() * 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            particleContainer.appendChild(particle);
        }
    }
    
    handleHashRouting() {
        const hash = window.location.hash.substring(1);
        const validTabs = ['about', 'work', 'essays', 'contact'];
        
        if (hash && validTabs.includes(hash)) {
            this.switchTab(hash);
        } else if (!hash) {
            this.switchTab('about');
        }
    }
    
    updateHash(tabId) {
        if (history.pushState) {
            history.pushState(null, null, `#${tabId}`);
        } else {
            window.location.hash = tabId;
        }
    }
    
    handleKeyboardNavigation() {
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => {
                let targetIndex = index;
                
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = index > 0 ? index - 1 : this.tabButtons.length - 1;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = index < this.tabButtons.length - 1 ? index + 1 : 0;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = this.tabButtons.length - 1;
                        break;
                    default:
                        return;
                }
                
                this.tabButtons[targetIndex].focus();
                const tabId = this.tabButtons[targetIndex].getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
}

// Enhanced page loading with stagger animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab system
    new TabSystem();
    
    // Page load animation sequence
    const timeline = [
        { selector: '.header', delay: 0, duration: 800 },
        { selector: '.navigation', delay: 300, duration: 600 },
        { selector: '.content', delay: 600, duration: 800 }
    ];
    
    timeline.forEach(({ selector, delay, duration }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    });
    
    // Initialize scroll-triggered animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('animate-in');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check
});

// Performance optimizations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Preload and optimize
const preloadContent = () => {
    // Preload any heavy content
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
};

preloadContent();
