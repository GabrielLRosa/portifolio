class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Add loading class to body
        document.body.classList.add('loading');

        // Wait for all resources to load
        window.addEventListener('load', () => {

            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 2500);
        });
    }
}

// Initialize loading manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoadingManager();
}); 