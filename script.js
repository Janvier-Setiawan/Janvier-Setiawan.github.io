// Tab switching functionality
class TabSystem {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.currentTab = 'about';
        
        this.init();
    }
    
    init() {
        // Add click event listeners to tab buttons
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Handle URL hash routing
        this.handleHashRouting();
        window.addEventListener('hashchange', () => {
            this.handleHashRouting();
        });
        
        // Handle keyboard navigation
        this.handleKeyboardNavigation();
    }
    
    switchTab(tabId) {
        // Don't switch if it's already the current tab
        if (tabId === this.currentTab) return;
        
        // Remove active class from current tab button and content
        this.tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        this.tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to new tab button and content
        const newTabButton = document.querySelector(`[data-tab="${tabId}"]`);
        const newTabContent = document.getElementById(tabId);
        
        if (newTabButton && newTabContent) {
            newTabButton.classList.add('active');
            
            // Small delay to ensure smooth transition
            setTimeout(() => {
                newTabContent.classList.add('active');
            }, 50);
            
            this.currentTab = tabId;
            
            // Update URL hash
            this.updateHash(tabId);
            
            // Scroll to top of content area
            this.scrollToTop();
        }
    }
    
    handleHashRouting() {
        const hash = window.location.hash.substring(1);
        const validTabs = ['about', 'work', 'essays', 'contact'];
        
        if (hash && validTabs.includes(hash)) {
            this.switchTab(hash);
        } else if (!hash) {
            // Default to about tab if no hash
            this.switchTab('about');
        }
    }
    
    updateHash(tabId) {
        // Update URL hash without triggering hashchange event
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
    
    scrollToTop() {
        // Smooth scroll to top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Smooth page loading
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab system
    new TabSystem();
    
    // Add fade-in animation to the entire page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or timers when page is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Preload content for better performance
const preloadImages = () => {
    // If you add images later, preload them here
    // const images = ['image1.jpg', 'image2.jpg'];
    // images.forEach(src => {
    //     const img = new Image();
    //     img.src = src;
    // });
};

// Call preload function
preloadImages();

// Add smooth transitions for dynamic content
const addSmoothTransitions = () => {
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
};

addSmoothTransitions();
