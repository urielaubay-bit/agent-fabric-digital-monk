(function () {
    const DEFAULT_LANG = 'es';
    const COUNTRY_TO_LANG = {
        'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'VE': 'es',
        'UY': 'es', 'PY': 'es', 'BO': 'es', 'EC': 'es', 'GT': 'es', 'HN': 'es', 'SV': 'es',
        'NI': 'es', 'CR': 'es', 'PA': 'es', 'DO': 'es', 'PR': 'es',
        'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr',
        'CN': 'zh', 'HK': 'zh', 'TW': 'zh', 'SG': 'zh'
    };

    function translatePage(lang) {
        if (!window.translations[lang]) {
            console.error('No translation found for:', lang, '— falling back to', DEFAULT_LANG);
        }

        const dictionary = window.translations[lang] || window.translations[DEFAULT_LANG];

        if (!dictionary) {
            console.error('Dictionary not found for:', lang);
            return;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = dictionary[key];
            if (translation) {
                // If it's an input or textarea, translate the placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    // Otherwise translate content
                    if (translation.includes('<')) {
                        el.innerHTML = translation;
                    } else {
                        el.textContent = translation;
                    }
                }
            }
        });

        document.querySelectorAll('[data-i18n-wa]').forEach(el => {
            const key = el.getAttribute('data-i18n-wa');
            const translation = dictionary[key];
            if (translation) {
                el.href = "https://wa.me/529514837121?text=" + encodeURIComponent(translation);
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('user_lang', lang);

        // Sync the header dropdown
        const select = document.getElementById('langSelect');
        if (select) select.value = lang;
    }

    function init() {
        const lang = localStorage.getItem('user_lang') || DEFAULT_LANG;
        translatePage(lang);
    }

    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.setLanguage = translatePage;
})();
