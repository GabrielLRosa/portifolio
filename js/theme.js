function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSavedTheme() {
    return localStorage.getItem('theme');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeText(theme);
}

function updateThemeText(theme) {
    const themeText = document.querySelector('.theme__text');
    const themeButton = document.querySelector('#themeButton');
    const currentLang = localStorage.getItem('language') || 'pt-BR';
    
    // Load the appropriate content file
    fetch(currentLang === 'en' ? 'js/content.en.json' : 'js/content.json')
        .then(response => response.json())
        .then(content => {
            // Update the button text
            themeText.textContent = theme === 'light' ? content.theme.dark : content.theme.light;
            
            // Update aria-label
            themeButton.setAttribute('aria-label', content.theme.aria);
        })
        .catch(error => console.error('Error loading theme text:', error));
}

function initializeTheme() {
    const themeButton = document.querySelector('#themeButton');
    const savedTheme = getSavedTheme();
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;
    
    applyTheme(initialTheme);

    themeButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getSavedTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
} 