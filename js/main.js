document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    handleStepItemClick();
    loadDescriptionContent();
    initializeLanguage();
});

function handleStepItemClick() {
    const stepItems = document.querySelectorAll('.step p[id]');
    const substepItems = document.querySelectorAll('.substep p[id]');
    const substeps = document.querySelectorAll('.substep');
    const menuElement = document.querySelector('.content__menu');
    const descriptionElement = document.querySelector('.content__description');
    
    function updateDescriptionVisibility(activeId) {
        const descriptionSpans = document.querySelectorAll('.description__text');
        const descriptionWrapper = document.querySelector('.description__wrapper');

        descriptionSpans.forEach(span => {
            span.classList.remove('description__text--visible');
        });
        
        descriptionSpans.forEach(span => {
            if (span.id.endsWith(activeId)) {
                span.classList.add('description__text--visible');
                if (descriptionWrapper) {
                    descriptionWrapper.scrollTop = 0;
                }
            }
        });
    }

    function handleItemClick(item, setpType) {
        setpType === 'step' && stepItems.forEach(p => p.classList.remove('item__active'));
        substepItems.forEach(p => p.classList.remove('item__active'));
        
        const clickedId = item.id;
        
        document.querySelectorAll(`[id="${clickedId}"]`).forEach(element => {
            element.classList.add('item__active');
        });
        
        if (menuElement) {
            setpType === 'step' ? menuElement.classList.add('step--selected') : menuElement.classList.add('substep--selected');
        }

        if (clickedId === 'step-projetos' && setpType === 'step') {
            if (descriptionElement) {
                descriptionElement.classList.remove('content__description--visible');
            }
            
            substeps.forEach(substep => {
                substep.classList.add('substep--visible');
            });
        } else {
            substeps.forEach(substep => {
                substep.classList.remove('substep--visible');
            });

            setpType === 'step' && menuElement.classList.remove('substep--selected');
            
            if (descriptionElement) {
                descriptionElement.classList.add('content__description--visible');
            }
        }

        updateDescriptionVisibility(clickedId);
        
        console.log(`Step items with ID "${clickedId}" selected`);
    }
    
    stepItems.forEach(item => {
        item.addEventListener('click', function() {
            handleItemClick(this, 'step');
        });
    });

    substepItems.forEach(item => {
        item.addEventListener('click', function() {
            handleItemClick(this, 'substep');
        });
    });
}

async function loadDescriptionContent(language = 'pt-BR') {
    try {
        const contentFile = language === 'en' ? 'js/content.en.json' : 'js/content.json';
        const response = await fetch(contentFile);
        const content = await response.json();
        
        const descriptionSpans = document.querySelectorAll('.description__text');
        descriptionSpans.forEach(span => {
            const spanId = span.id;
            
            if (spanId === 'description__step-contato' && content[spanId]) {
                const contatoData = content[spanId];
                const liElements = span.querySelectorAll('li');
                
                liElements.forEach(li => {
                    const liId = li.id;
                    if (contatoData[liId]) {
                        li.innerHTML = '';
                        
                        if (liId === 'email') {
                            const emailLink = document.createElement('a');
                            emailLink.href = `mailto:${contatoData[liId]}`;
                            emailLink.textContent = contatoData[liId];
                            emailLink.style.color = 'inherit';
                            emailLink.style.textDecoration = 'none';
                            li.appendChild(emailLink);
                        } else if (liId === 'linkedin' || liId === 'github') {
                            const socialLink = document.createElement('a');
                            socialLink.href = contatoData[liId];
                            socialLink.textContent = liId;
                            socialLink.target = '_blank';
                            socialLink.rel = 'noopener noreferrer';
                            socialLink.style.color = 'inherit';
                            socialLink.style.textDecoration = 'none';
                            li.appendChild(socialLink);
                        } else {
                            li.textContent = contatoData[liId];
                        }
                    }
                });
            } 
            else if (content[spanId]) {
                span.textContent = content[spanId];
            }
        });

        const i18nElements = document.querySelectorAll('[data-i18n]');
        i18nElements.forEach(element => {
            const key = element.dataset.i18n;
            const keys = key.split('.');
            let value = content;
            
            for (const k of keys) {
                value = value[k];
            }
            
            if (value) {
                element.textContent = value;
            }
        });
        
        console.log(`Content loaded successfully in ${language}`);
    } catch (error) {
        console.error('Error loading description content:', error);
    }
}

function initializeLanguage() {
    const langButtons = document.querySelectorAll('.header__btn');
    const savedLang = localStorage.getItem('language') || 'pt-BR';
    
    langButtons.forEach(btn => {
        if (btn.dataset.lang === savedLang) {
            btn.classList.add('active');
        }
    });
    
    loadDescriptionContent(savedLang);
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            localStorage.setItem('language', lang);
            loadDescriptionContent(lang);
        });
    });
} 