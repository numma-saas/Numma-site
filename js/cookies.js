// NUMMA — Bandeau cookies conforme CNIL (recommandation 2020-092)
// Trois choix au même niveau : Accepter / Refuser / Personnaliser
// Stockage local du consentement (clé "numma-consent"), expiration 6 mois (180j)
(function () {
  'use strict';

  var STORAGE_KEY = 'numma-consent';
  var CONSENT_TTL_DAYS = 180;

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.ts) return null;
      var age = (Date.now() - data.ts) / (1000 * 60 * 60 * 24);
      if (age > CONSENT_TTL_DAYS) return null;
      return data;
    } catch (e) { return null; }
  }

  function saveConsent(consent) {
    try {
      consent.ts = Date.now();
      consent.v = '1.0';
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (e) { /* fail silently */ }
  }

  function applyConsent(consent) {
    // Hooks pour activer / désactiver les services tiers selon le consentement.
    // Placeholders — pas de tag tiers actif aujourd'hui sur le site marketing.
    window.NUMMA_CONSENT = consent;
    // Exemple : if (consent.analytics) { /* charger Plausible / GA4 anonymisé */ }
    // Exemple : if (consent.marketing) { /* charger pixel LinkedIn Insight */ }
  }

  function styleNode() {
    var css = ''
      + '.cookie-banner{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;'
      + 'background:#fff;border:1px solid rgba(124,58,237,.18);border-radius:16px;'
      + 'box-shadow:0 24px 60px -20px rgba(15,23,42,.25),0 8px 24px -12px rgba(15,23,42,.18);'
      + 'padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:1rem;max-width:920px;margin:0 auto;'
      + 'font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;}'
      + '.cookie-banner h2{margin:0 0 .25rem;font-size:1.05rem;font-weight:700;color:#0f172a;}'
      + '.cookie-banner p{margin:0;font-size:.95rem;line-height:1.55;color:#475569;}'
      + '.cookie-banner a{color:#7C3AED;text-decoration:underline;}'
      + '.cookie-actions{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:flex-end;}'
      + '.cookie-actions button{font:inherit;cursor:pointer;border-radius:999px;padding:.6rem 1.1rem;border:1px solid transparent;transition:transform .15s ease,box-shadow .15s ease,background .15s ease;}'
      + '.cookie-actions .c-accept{background:linear-gradient(135deg,#7C3AED,#FB923C);color:#fff;border:none;font-weight:600;}'
      + '.cookie-actions .c-accept:hover{transform:translateY(-1px);box-shadow:0 12px 24px -12px rgba(124,58,237,.45);}'
      + '.cookie-actions .c-refuse{background:#fff;color:#0f172a;border-color:#e2e8f0;}'
      + '.cookie-actions .c-refuse:hover{background:#f8fafc;}'
      + '.cookie-actions .c-custom{background:transparent;color:#7C3AED;border-color:#c4b5fd;}'
      + '.cookie-actions .c-custom:hover{background:#f5f3ff;}'
      + '.cookie-modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;}'
      + '.cookie-modal{background:#fff;border-radius:18px;max-width:560px;width:100%;padding:1.75rem;box-shadow:0 30px 80px -30px rgba(15,23,42,.45);max-height:90vh;overflow-y:auto;}'
      + '.cookie-modal h2{margin:0 0 .5rem;font-size:1.25rem;font-weight:700;}'
      + '.cookie-modal p{font-size:.95rem;line-height:1.55;color:#475569;margin:0 0 1rem;}'
      + '.cookie-cat{border:1px solid #e2e8f0;border-radius:12px;padding:1rem;margin-bottom:.75rem;display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;}'
      + '.cookie-cat h3{margin:0 0 .25rem;font-size:1rem;font-weight:600;}'
      + '.cookie-cat small{color:#64748b;font-size:.85rem;line-height:1.5;display:block;}'
      + '.cookie-switch{position:relative;display:inline-block;width:44px;height:24px;flex-shrink:0;margin-top:.15rem;}'
      + '.cookie-switch input{opacity:0;width:0;height:0;}'
      + '.cookie-switch .slider{position:absolute;cursor:pointer;inset:0;background:#cbd5e1;border-radius:999px;transition:.2s;}'
      + '.cookie-switch .slider::before{content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;}'
      + '.cookie-switch input:checked + .slider{background:#7C3AED;}'
      + '.cookie-switch input:checked + .slider::before{transform:translateX(20px);}'
      + '.cookie-switch input:disabled + .slider{background:#94a3b8;cursor:not-allowed;}'
      + '.cookie-modal-actions{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:flex-end;margin-top:1rem;}'
      + '.cookie-modal-actions button{font:inherit;cursor:pointer;border-radius:999px;padding:.6rem 1.1rem;border:1px solid transparent;font-weight:500;}'
      + '.cookie-modal-actions .save{background:linear-gradient(135deg,#7C3AED,#FB923C);color:#fff;border:none;font-weight:600;}'
      + '.cookie-modal-actions .cancel{background:#fff;color:#0f172a;border-color:#e2e8f0;}'
      + '@media (max-width: 640px){.cookie-banner{padding:1rem;border-radius:14px;}.cookie-actions{justify-content:stretch;}.cookie-actions button{flex:1 1 auto;text-align:center;}}';
    var s = document.createElement('style');
    s.id = 'numma-cookie-styles';
    s.textContent = css;
    return s;
  }

  function buildBanner() {
    var w = document.createElement('div');
    w.className = 'cookie-banner';
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-modal', 'false');
    w.setAttribute('aria-label', 'Bandeau de gestion des cookies');
    w.innerHTML = ''
      + '<div>'
      + '<h2>Vos cookies, votre choix.</h2>'
      + '<p>NUMMA utilise uniquement des cookies strictement nécessaires au bon fonctionnement du service. Avec votre accord, nous pouvons aussi mesurer l\'audience de manière anonyme et améliorer votre expérience. <a href="politique-confidentialite.html">En savoir plus</a>.</p>'
      + '</div>'
      + '<div class="cookie-actions">'
      + '<button type="button" class="c-custom" data-act="custom">Personnaliser</button>'
      + '<button type="button" class="c-refuse" data-act="refuse">Tout refuser</button>'
      + '<button type="button" class="c-accept" data-act="accept">Tout accepter</button>'
      + '</div>';
    return w;
  }

  function buildModal(currentConsent) {
    var c = currentConsent || { necessary: true, analytics: false, marketing: false };
    var bd = document.createElement('div');
    bd.className = 'cookie-modal-backdrop';
    bd.setAttribute('role', 'dialog');
    bd.setAttribute('aria-modal', 'true');
    bd.setAttribute('aria-label', 'Préférences cookies');
    bd.innerHTML = ''
      + '<div class="cookie-modal">'
      + '<h2>Préférences cookies</h2>'
      + '<p>Choisissez les catégories de cookies que vous autorisez. Vous pourrez modifier ce choix à tout moment depuis le pied de page.</p>'
      + '<div class="cookie-cat"><div><h3>Strictement nécessaires</h3><small>Indispensables au fonctionnement du site et de votre session NUMMA. Ne peuvent pas être désactivés.</small></div><label class="cookie-switch"><input type="checkbox" data-cat="necessary" checked disabled><span class="slider"></span></label></div>'
      + '<div class="cookie-cat"><div><h3>Mesure d\'audience anonyme</h3><small>Statistiques de fréquentation agrégées (Plausible-like). Aucun identifiant personnel n\'est collecté, IP anonymisée.</small></div><label class="cookie-switch"><input type="checkbox" data-cat="analytics"' + (c.analytics ? ' checked' : '') + '><span class="slider"></span></label></div>'
      + '<div class="cookie-cat"><div><h3>Marketing & contenu personnalisé</h3><small>Traçage publicitaire (LinkedIn Insight, etc.) pour mesurer l\'efficacité des campagnes. Désactivé par défaut.</small></div><label class="cookie-switch"><input type="checkbox" data-cat="marketing"' + (c.marketing ? ' checked' : '') + '><span class="slider"></span></label></div>'
      + '<div class="cookie-modal-actions">'
      + '<button type="button" class="cancel" data-act="cancel">Annuler</button>'
      + '<button type="button" class="save" data-act="save">Enregistrer mes choix</button>'
      + '</div>'
      + '</div>';
    return bd;
  }

  function show() {
    if (document.getElementById('numma-cookie-styles')) return;
    document.head.appendChild(styleNode());
    var banner = buildBanner();
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var act = e.target && e.target.getAttribute('data-act');
      if (!act) return;
      if (act === 'accept') {
        saveConsent({ necessary: true, analytics: true, marketing: true });
        banner.remove();
        applyConsent(window.NUMMA_CONSENT = { necessary: true, analytics: true, marketing: true });
      } else if (act === 'refuse') {
        saveConsent({ necessary: true, analytics: false, marketing: false });
        banner.remove();
        applyConsent({ necessary: true, analytics: false, marketing: false });
      } else if (act === 'custom') {
        openModal(banner);
      }
    });
  }

  function openModal(banner) {
    var current = readConsent() || { necessary: true, analytics: false, marketing: false };
    var modal = buildModal(current);
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.remove();
        return;
      }
      var act = e.target && e.target.getAttribute('data-act');
      if (act === 'cancel') {
        modal.remove();
      } else if (act === 'save') {
        var inputs = modal.querySelectorAll('input[data-cat]');
        var consent = { necessary: true, analytics: false, marketing: false };
        inputs.forEach(function (i) { consent[i.getAttribute('data-cat')] = i.checked; });
        saveConsent(consent);
        applyConsent(consent);
        modal.remove();
        if (banner) banner.remove();
      }
    });
  }

  // Public API : ouvrir les préférences depuis un lien du footer
  window.NUMMA_openCookiePrefs = function () { openModal(null); };

  // Init
  document.addEventListener('DOMContentLoaded', function () {
    var c = readConsent();
    if (c) {
      applyConsent(c);
    } else {
      show();
    }

    // Lien de réouverture des préférences depuis le footer
    document.querySelectorAll('[data-cookie-prefs]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.NUMMA_openCookiePrefs();
      });
    });
  });
})();
