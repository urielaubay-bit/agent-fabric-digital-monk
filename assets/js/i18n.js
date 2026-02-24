(function () {
    const DEFAULT_LANG = 'en';
    const COUNTRY_TO_LANG = {
        'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'VE': 'es',
        'UY': 'es', 'PY': 'es', 'BO': 'es', 'EC': 'es', 'GT': 'es', 'HN': 'es', 'SV': 'es',
        'NI': 'es', 'CR': 'es', 'PA': 'es', 'DO': 'es', 'PR': 'es',
        'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr'
    };

    function translatePage(lang) {
        console.log('Translating page to:', lang);
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

        document.documentElement.lang = lang;
        localStorage.setItem('user_lang', lang);

        // Sync the header dropdown
        const select = document.getElementById('langSelect');
        if (select) select.value = lang;
    }

    async function init() {
        console.log('init() starting...');
        let lang = localStorage.getItem('user_lang');
        let method = 'localStorage';

        if (!lang) {
            // Priority 1: Browser Languages (more reliable on file:// than IP fetch)
            const languages = navigator.languages || [navigator.language];
            console.log('Browser languages detected:', languages);
            for (let l of languages) {
                const short = l.split('-')[0];
                if (window.translations[short]) {
                    lang = short;
                    method = `Browser (${l})`;
                    break;
                }
            }

            // Priority 2: IP-based (often fails on file:// due to CORS)
            if (!lang) {
                try {
                    console.log('Fetching IP info...');
                    const response = await fetch('https://freeipapi.com/api/json');
                    const data = await response.json();
                    const code = data.countryCode || data.country_code;
                    if (code && COUNTRY_TO_LANG[code]) {
                        lang = COUNTRY_TO_LANG[code];
                        method = `IP/Country (${code})`;
                    }
                } catch (e) {
                    console.warn('IP detection blocked (expected on file://):', e);
                }
            }
        }

        const finalLang = lang || DEFAULT_LANG;
        if (!lang) method = 'Default (en)';

        console.log(`Final Language: ${finalLang} (Source: ${method})`);

        // Hide debug info once we confirm it works, or keep subtle
        const debugBox = document.getElementById('i18n-debug');
        if (debugBox) {
            debugBox.innerHTML = `<span style="opacity:0.6">Lang: ${finalLang} (${method})</span> <button onclick="localStorage.clear(); location.reload();" style="background:none; border:none; color:#00ff00; text-decoration:underline; cursor:pointer; font-size:10px;">Reset</button>`;
        }

        translatePage(finalLang);
    }

    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.setLanguage = translatePage;
})();
