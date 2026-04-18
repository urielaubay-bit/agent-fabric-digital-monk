(function () {
  "use strict";

  var COOKIE_KEY = "dm_cookie_preferences_v1";
  var DEFAULT_PREFERENCES = {
    necessary: true,
    analytics: false,
    marketing: false
  };

  function isSpanish() {
    return (document.documentElement.lang || "es").toLowerCase().indexOf("es") === 0;
  }

  function getCopy() {
    if (isSpanish()) {
      return {
        title: "Usamos cookies",
        body: "Usamos cookies necesarias y, con tu permiso, cookies de analitica y marketing para mejorar la experiencia.",
        policy: "Consulta nuestra politica de privacidad y terminos.",
        acceptAll: "Aceptar todas",
        rejectOptional: "Rechazar opcionales",
        customize: "Personalizar",
        modalTitle: "Preferencias de cookies",
        necessary: "Necesarias (siempre activas)",
        analytics: "Analitica",
        marketing: "Marketing",
        save: "Guardar preferencias",
        close: "Cerrar",
        settings: "Configuracion de cookies",
        privacy: "Politica de privacidad",
        terms: "Terminos y condiciones"
      };
    }

    return {
      title: "We use cookies",
      body: "We use necessary cookies and, with your permission, analytics and marketing cookies to improve your experience.",
      policy: "See our privacy policy and terms.",
      acceptAll: "Accept all",
      rejectOptional: "Reject optional",
      customize: "Customize",
      modalTitle: "Cookie preferences",
      necessary: "Necessary (always active)",
      analytics: "Analytics",
      marketing: "Marketing",
      save: "Save preferences",
      close: "Close",
      settings: "Cookie settings",
      privacy: "Privacy policy",
      terms: "Terms and conditions"
    };
  }

  function getPolicyLinks() {
    var inHtmlDir = window.location.pathname.indexOf("/html/") !== -1;
    return {
      privacy: inHtmlDir ? "privacy-policy.html" : "html/privacy-policy.html",
      terms: inHtmlDir ? "terms-and-conditions.html" : "html/terms-and-conditions.html"
    };
  }

  function readPreferences() {
    try {
      var raw = localStorage.getItem(COOKIE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return {
        necessary: true,
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing
      };
    } catch (error) {
      return null;
    }
  }

  function writePreferences(preferences) {
    var payload = {
      necessary: true,
      analytics: !!preferences.analytics,
      marketing: !!preferences.marketing,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
  }

  function canRun(category, preferences) {
    if (category === "necessary") return true;
    return !!preferences[category];
  }

  function activateDeferredScripts(preferences) {
    var scripts = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');
    scripts.forEach(function (script) {
      if (script.dataset.cookieExecuted === "true") return;

      var category = script.dataset.cookieCategory || "necessary";
      if (!canRun(category, preferences)) return;

      var executable = document.createElement("script");
      Array.prototype.slice.call(script.attributes).forEach(function (attr) {
        if (attr.name === "type" || attr.name === "data-cookie-category") return;
        executable.setAttribute(attr.name, attr.value);
      });

      if (script.dataset.cookieSrc) {
        executable.src = script.dataset.cookieSrc;
      } else {
        executable.text = script.textContent;
      }

      script.dataset.cookieExecuted = "true";
      script.parentNode.insertBefore(executable, script.nextSibling);
    });
  }

  function injectStyles() {
    if (document.getElementById("dm-cookie-style")) return;

    var style = document.createElement("style");
    style.id = "dm-cookie-style";
    style.textContent = [
      ".dm-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1200;background:#1f2a2e;color:#fff;border-radius:12px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:960px;margin:0 auto;}",
      ".dm-cookie-banner h5{margin:0 0 8px;font-size:18px;color:#fff;}",
      ".dm-cookie-banner p{margin:0 0 10px;opacity:.9;line-height:1.45;}",
      ".dm-cookie-banner .dm-cookie-links a{color:#C1FF72;text-decoration:underline;}",
      ".dm-cookie-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}",
      ".dm-cookie-btn{border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;border-radius:999px;padding:8px 14px;font-size:14px;cursor:pointer;}",
      ".dm-cookie-btn.primary{background:#C1FF72;color:#1f2a2e;border-color:#C1FF72;font-weight:700;}",
      ".dm-cookie-btn:hover{opacity:.92;}",
      ".dm-cookie-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;z-index:1250;}",
      ".dm-cookie-modal-backdrop.open{display:block;}",
      ".dm-cookie-modal{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,520px);background:#fff;border-radius:12px;padding:20px;color:#1f2a2e;}",
      ".dm-cookie-modal h5{margin:0 0 14px;}",
      ".dm-cookie-row{display:flex;align-items:flex-start;gap:10px;margin:10px 0;}",
      ".dm-cookie-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;}",
      ".dm-cookie-settings-btn{position:fixed;left:16px;bottom:16px;z-index:1190;border:none;border-radius:999px;padding:8px 12px;background:#1f2a2e;color:#fff;font-size:12px;cursor:pointer;display:none;}",
      ".dm-cookie-settings-btn.visible{display:inline-block;}",
      "@media (max-width:576px){.dm-cookie-banner{left:10px;right:10px;bottom:10px;padding:12px;}.dm-cookie-settings-btn{left:10px;bottom:10px;}}"
    ].join("");
    document.head.appendChild(style);
  }

  function buildUI() {
    if (document.getElementById("dm-cookie-banner")) return;

    var copy = getCopy();
    var links = getPolicyLinks();

    var banner = document.createElement("div");
    banner.id = "dm-cookie-banner";
    banner.className = "dm-cookie-banner";
    banner.innerHTML =
      "<h5>" + copy.title + "</h5>" +
      "<p>" + copy.body + "</p>" +
      '<p class="dm-cookie-links">' + copy.policy +
      ' <a href="' + links.privacy + '">' + copy.privacy + "</a> · " +
      '<a href="' + links.terms + '">' + copy.terms + "</a></p>" +
      '<div class="dm-cookie-actions">' +
      '<button type="button" class="dm-cookie-btn primary" id="dm-cookie-accept">' + copy.acceptAll + "</button>" +
      '<button type="button" class="dm-cookie-btn" id="dm-cookie-reject">' + copy.rejectOptional + "</button>" +
      '<button type="button" class="dm-cookie-btn" id="dm-cookie-customize">' + copy.customize + "</button>" +
      "</div>";

    var backdrop = document.createElement("div");
    backdrop.id = "dm-cookie-modal-backdrop";
    backdrop.className = "dm-cookie-modal-backdrop";
    backdrop.innerHTML =
      '<div class="dm-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="dm-cookie-modal-title">' +
      '<h5 id="dm-cookie-modal-title">' + copy.modalTitle + "</h5>" +
      '<label class="dm-cookie-row"><input type="checkbox" checked disabled> <span>' + copy.necessary + "</span></label>" +
      '<label class="dm-cookie-row"><input type="checkbox" id="dm-cookie-analytics"> <span>' + copy.analytics + "</span></label>" +
      '<label class="dm-cookie-row"><input type="checkbox" id="dm-cookie-marketing"> <span>' + copy.marketing + "</span></label>" +
      '<div class="dm-cookie-modal-actions">' +
      '<button type="button" class="dm-cookie-btn" id="dm-cookie-close">' + copy.close + "</button>" +
      '<button type="button" class="dm-cookie-btn primary" id="dm-cookie-save">' + copy.save + "</button>" +
      "</div>" +
      "</div>";

    var settingsBtn = document.createElement("button");
    settingsBtn.id = "dm-cookie-settings-btn";
    settingsBtn.className = "dm-cookie-settings-btn";
    settingsBtn.type = "button";
    settingsBtn.textContent = copy.settings;

    document.body.appendChild(banner);
    document.body.appendChild(backdrop);
    document.body.appendChild(settingsBtn);
  }

  function openModal() {
    var backdrop = document.getElementById("dm-cookie-modal-backdrop");
    if (backdrop) backdrop.classList.add("open");

    var current = readPreferences() || DEFAULT_PREFERENCES;
    var analytics = document.getElementById("dm-cookie-analytics");
    var marketing = document.getElementById("dm-cookie-marketing");
    if (analytics) analytics.checked = !!current.analytics;
    if (marketing) marketing.checked = !!current.marketing;
  }

  function closeModal() {
    var backdrop = document.getElementById("dm-cookie-modal-backdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  function hideBanner() {
    var banner = document.getElementById("dm-cookie-banner");
    if (banner) banner.style.display = "none";
  }

  function showBanner() {
    var banner = document.getElementById("dm-cookie-banner");
    if (banner) banner.style.display = "block";
  }

  function setSettingsButtonVisible(visible) {
    var button = document.getElementById("dm-cookie-settings-btn");
    if (!button) return;
    button.classList.toggle("visible", visible);
  }

  function applyPreferences(preferences) {
    activateDeferredScripts(preferences);
    window.dispatchEvent(new CustomEvent("dm:cookie-consent-updated", {
      detail: {
        necessary: true,
        analytics: !!preferences.analytics,
        marketing: !!preferences.marketing
      }
    }));
  }

  function saveAndApply(preferences) {
    writePreferences(preferences);
    applyPreferences(preferences);
    hideBanner();
    closeModal();
    setSettingsButtonVisible(true);
  }

  function bindEvents() {
    var accept = document.getElementById("dm-cookie-accept");
    var reject = document.getElementById("dm-cookie-reject");
    var customize = document.getElementById("dm-cookie-customize");
    var close = document.getElementById("dm-cookie-close");
    var save = document.getElementById("dm-cookie-save");
    var settings = document.getElementById("dm-cookie-settings-btn");
    var backdrop = document.getElementById("dm-cookie-modal-backdrop");

    if (accept) {
      accept.addEventListener("click", function () {
        saveAndApply({ necessary: true, analytics: true, marketing: true });
      });
    }

    if (reject) {
      reject.addEventListener("click", function () {
        saveAndApply({ necessary: true, analytics: false, marketing: false });
      });
    }

    if (customize) customize.addEventListener("click", openModal);
    if (settings) settings.addEventListener("click", openModal);
    if (close) close.addEventListener("click", closeModal);
    if (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (event.target === backdrop) closeModal();
      });
    }

    if (save) {
      save.addEventListener("click", function () {
        var analytics = document.getElementById("dm-cookie-analytics");
        var marketing = document.getElementById("dm-cookie-marketing");
        saveAndApply({
          necessary: true,
          analytics: analytics ? analytics.checked : false,
          marketing: marketing ? marketing.checked : false
        });
      });
    }
  }

  function initConsent() {
    injectStyles();
    buildUI();
    bindEvents();

    var saved = readPreferences();
    if (saved) {
      hideBanner();
      setSettingsButtonVisible(true);
      applyPreferences(saved);
    } else {
      showBanner();
      setSettingsButtonVisible(false);
    }

    window.dmCookieConsent = {
      getPreferences: function () {
        return readPreferences();
      },
      canUse: function (category) {
        var preferences = readPreferences();
        if (!preferences) return category === "necessary";
        return canRun(category, preferences);
      },
      openSettings: openModal,
      setPreferences: function (preferences) {
        saveAndApply({
          necessary: true,
          analytics: !!preferences.analytics,
          marketing: !!preferences.marketing
        });
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent);
  } else {
    initConsent();
  }
})();
(function () {
  "use strict";

  var COOKIE_KEY = "dm_cookie_preferences_v1";
  var DEFAULT_PREFERENCES = {
    necessary: true,
    analytics: false,
    marketing: false
  };

  function isSpanish() {
    return (document.documentElement.lang || "es").toLowerCase().indexOf("es") === 0;
  }

  function getCopy() {
    if (isSpanish()) {
      return {
        title: "Usamos cookies",
        body: "Usamos cookies necesarias y, con tu permiso, cookies de analitica y marketing para mejorar la experiencia.",
        policy: "Consulta nuestra politica de privacidad y terminos.",
        acceptAll: "Aceptar todas",
        rejectOptional: "Rechazar opcionales",
        customize: "Personalizar",
        modalTitle: "Preferencias de cookies",
        necessary: "Necesarias (siempre activas)",
        analytics: "Analitica",
        marketing: "Marketing",
        save: "Guardar preferencias",
        close: "Cerrar",
        settings: "Configuracion de cookies",
        privacy: "Politica de privacidad",
        terms: "Terminos y condiciones"
      };
    }

    return {
      title: "We use cookies",
      body: "We use necessary cookies and, with your permission, analytics and marketing cookies to improve your experience.",
      policy: "See our privacy policy and terms.",
      acceptAll: "Accept all",
      rejectOptional: "Reject optional",
      customize: "Customize",
      modalTitle: "Cookie preferences",
      necessary: "Necessary (always active)",
      analytics: "Analytics",
      marketing: "Marketing",
      save: "Save preferences",
      close: "Close",
      settings: "Cookie settings",
      privacy: "Privacy policy",
      terms: "Terms and conditions"
    };
  }

  function getPolicyLinks() {
    var inHtmlDir = window.location.pathname.indexOf("/html/") !== -1;
    return {
      privacy: inHtmlDir ? "privacy-policy.html" : "html/privacy-policy.html",
      terms: inHtmlDir ? "terms-and-conditions.html" : "html/terms-and-conditions.html"
    };
  }

  function readPreferences() {
    try {
      var raw = localStorage.getItem(COOKIE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return {
        necessary: true,
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing
      };
    } catch (error) {
      return null;
    }
  }

  function writePreferences(preferences) {
    var payload = {
      necessary: true,
      analytics: !!preferences.analytics,
      marketing: !!preferences.marketing,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(payload));
  }

  function canRun(category, preferences) {
    if (category === "necessary") return true;
    return !!preferences[category];
  }

  function activateDeferredScripts(preferences) {
    var scripts = document.querySelectorAll('script[type="text/plain"][data-cookie-category]');
    scripts.forEach(function (script) {
      if (script.dataset.cookieExecuted === "true") return;

      var category = script.dataset.cookieCategory || "necessary";
      if (!canRun(category, preferences)) return;

      var executable = document.createElement("script");
      Array.prototype.slice.call(script.attributes).forEach(function (attr) {
        if (attr.name === "type" || attr.name === "data-cookie-category") return;
        executable.setAttribute(attr.name, attr.value);
      });

      if (script.dataset.cookieSrc) {
        executable.src = script.dataset.cookieSrc;
      } else {
        executable.text = script.textContent;
      }

      script.dataset.cookieExecuted = "true";
      script.parentNode.insertBefore(executable, script.nextSibling);
    });
  }

  function injectStyles() {
    if (document.getElementById("dm-cookie-style")) return;

    var style = document.createElement("style");
    style.id = "dm-cookie-style";
    style.textContent = [
      ".dm-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1200;background:#1f2a2e;color:#fff;border-radius:12px;padding:16px;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:960px;margin:0 auto;}",
      ".dm-cookie-banner h5{margin:0 0 8px;font-size:18px;color:#fff;}",
      ".dm-cookie-banner p{margin:0 0 10px;opacity:.9;line-height:1.45;}",
      ".dm-cookie-banner .dm-cookie-links a{color:#C1FF72;text-decoration:underline;}",
      ".dm-cookie-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}",
      ".dm-cookie-btn{border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;border-radius:999px;padding:8px 14px;font-size:14px;cursor:pointer;}",
      ".dm-cookie-btn.primary{background:#C1FF72;color:#1f2a2e;border-color:#C1FF72;font-weight:700;}",
      ".dm-cookie-btn:hover{opacity:.92;}",
      ".dm-cookie-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;z-index:1250;}",
      ".dm-cookie-modal-backdrop.open{display:block;}",
      ".dm-cookie-modal{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(92vw,520px);background:#fff;border-radius:12px;padding:20px;color:#1f2a2e;}",
      ".dm-cookie-modal h5{margin:0 0 14px;}",
      ".dm-cookie-row{display:flex;align-items:flex-start;gap:10px;margin:10px 0;}",
      ".dm-cookie-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;}",
      ".dm-cookie-settings-btn{position:fixed;left:16px;bottom:16px;z-index:1190;border:none;border-radius:999px;padding:8px 12px;background:#1f2a2e;color:#fff;font-size:12px;cursor:pointer;display:none;}",
      ".dm-cookie-settings-btn.visible{display:inline-block;}",
      "@media (max-width:576px){.dm-cookie-banner{left:10px;right:10px;bottom:10px;padding:12px;}.dm-cookie-settings-btn{left:10px;bottom:10px;}}"
    ].join("");
    document.head.appendChild(style);
  }

  function buildUI() {
    if (document.getElementById("dm-cookie-banner")) return;

    var copy = getCopy();
    var links = getPolicyLinks();

    var banner = document.createElement("div");
    banner.id = "dm-cookie-banner";
    banner.className = "dm-cookie-banner";
    banner.innerHTML =
      '<h5>' + copy.title + '</h5>' +
      '<p>' + copy.body + '</p>' +
      '<p class="dm-cookie-links">' + copy.policy +
      ' <a href="' + links.privacy + '">' + copy.privacy + '</a> · ' +
      '<a href="' + links.terms + '">' + copy.terms + "</a></p>" +
      '<div class="dm-cookie-actions">' +
      '<button type="button" class="dm-cookie-btn primary" id="dm-cookie-accept">' + copy.acceptAll + "</button>" +
      '<button type="button" class="dm-cookie-btn" id="dm-cookie-reject">' + copy.rejectOptional + "</button>" +
      '<button type="button" class="dm-cookie-btn" id="dm-cookie-customize">' + copy.customize + "</button>" +
      "</div>";

    var backdrop = document.createElement("div");
    backdrop.id = "dm-cookie-modal-backdrop";
    backdrop.className = "dm-cookie-modal-backdrop";
    backdrop.innerHTML =
      '<div class="dm-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="dm-cookie-modal-title">' +
      '<h5 id="dm-cookie-modal-title">' + copy.modalTitle + "</h5>" +
      '<label class="dm-cookie-row"><input type="checkbox" checked disabled> <span>' + copy.necessary + "</span></label>" +
      '<label class="dm-cookie-row"><input type="checkbox" id="dm-cookie-analytics"> <span>' + copy.analytics + "</span></label>" +
      '<label class="dm-cookie-row"><input type="checkbox" id="dm-cookie-marketing"> <span>' + copy.marketing + "</span></label>" +
      '<div class="dm-cookie-modal-actions">' +
      '<button type="button" class="dm-cookie-btn" id="dm-cookie-close">' + copy.close + "</button>" +
      '<button type="button" class="dm-cookie-btn primary" id="dm-cookie-save">' + copy.save + "</button>" +
      "</div>" +
      "</div>";

    var settingsBtn = document.createElement("button");
    settingsBtn.id = "dm-cookie-settings-btn";
    settingsBtn.className = "dm-cookie-settings-btn";
    settingsBtn.type = "button";
    settingsBtn.textContent = copy.settings;

    document.body.appendChild(banner);
    document.body.appendChild(backdrop);
    document.body.appendChild(settingsBtn);
  }

  function openModal() {
    var backdrop = document.getElementById("dm-cookie-modal-backdrop");
    if (backdrop) backdrop.classList.add("open");

    var current = readPreferences() || DEFAULT_PREFERENCES;
    var analytics = document.getElementById("dm-cookie-analytics");
    var marketing = document.getElementById("dm-cookie-marketing");
    if (analytics) analytics.checked = !!current.analytics;
    if (marketing) marketing.checked = !!current.marketing;
  }

  function closeModal() {
    var backdrop = document.getElementById("dm-cookie-modal-backdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  function hideBanner() {
    var banner = document.getElementById("dm-cookie-banner");
    if (banner) banner.style.display = "none";
  }

  function showBanner() {
    var banner = document.getElementById("dm-cookie-banner");
    if (banner) banner.style.display = "block";
  }

  function setSettingsButtonVisible(visible) {
    var button = document.getElementById("dm-cookie-settings-btn");
    if (!button) return;
    button.classList.toggle("visible", visible);
  }

  function applyPreferences(preferences) {
    activateDeferredScripts(preferences);
    window.dispatchEvent(new CustomEvent("dm:cookie-consent-updated", {
      detail: {
        necessary: true,
        analytics: !!preferences.analytics,
        marketing: !!preferences.marketing
      }
    }));
  }

  function saveAndApply(preferences) {
    writePreferences(preferences);
    applyPreferences(preferences);
    hideBanner();
    closeModal();
    setSettingsButtonVisible(true);
  }

  function bindEvents() {
    var accept = document.getElementById("dm-cookie-accept");
    var reject = document.getElementById("dm-cookie-reject");
    var customize = document.getElementById("dm-cookie-customize");
    var close = document.getElementById("dm-cookie-close");
    var save = document.getElementById("dm-cookie-save");
    var settings = document.getElementById("dm-cookie-settings-btn");
    var backdrop = document.getElementById("dm-cookie-modal-backdrop");

    if (accept) {
      accept.addEventListener("click", function () {
        saveAndApply({ necessary: true, analytics: true, marketing: true });
      });
    }

    if (reject) {
      reject.addEventListener("click", function () {
        saveAndApply({ necessary: true, analytics: false, marketing: false });
      });
    }

    if (customize) customize.addEventListener("click", openModal);
    if (settings) settings.addEventListener("click", openModal);
    if (close) close.addEventListener("click", closeModal);
    if (backdrop) {
      backdrop.addEventListener("click", function (event) {
        if (event.target === backdrop) closeModal();
      });
    }

    if (save) {
      save.addEventListener("click", function () {
        var analytics = document.getElementById("dm-cookie-analytics");
        var marketing = document.getElementById("dm-cookie-marketing");
        saveAndApply({
          necessary: true,
          analytics: analytics ? analytics.checked : false,
          marketing: marketing ? marketing.checked : false
        });
      });
    }
  }

  function initConsent() {
    injectStyles();
    buildUI();
    bindEvents();

    var saved = readPreferences();
    if (saved) {
      hideBanner();
      setSettingsButtonVisible(true);
      applyPreferences(saved);
    } else {
      showBanner();
      setSettingsButtonVisible(false);
    }

    window.dmCookieConsent = {
      getPreferences: function () {
        return readPreferences();
      },
      canUse: function (category) {
        var preferences = readPreferences();
        if (!preferences) return category === "necessary";
        return canRun(category, preferences);
      },
      openSettings: openModal,
      setPreferences: function (preferences) {
        saveAndApply({
          necessary: true,
          analytics: !!preferences.analytics,
          marketing: !!preferences.marketing
        });
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initConsent);
  } else {
    initConsent();
  }
})();
