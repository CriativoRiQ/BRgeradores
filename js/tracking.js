/* Consentimento (LGPD) + rastreamento. Nada é carregado sem consentimento e sem IDs reais.
   PREENCHA os IDs abaixo para ativar. Enquanto estiverem vazios, nenhum script de terceiros é carregado. */
(function () {
  'use strict';
  var CONFIG = {
    GTM_ID: '',            // ex.: 'GTM-XXXXXXX'  (se preenchido, GA4/Ads/Pixel podem ser configurados dentro do GTM)
    GA4_ID: '',            // ex.: 'G-XXXXXXXXXX' (usado só se GTM_ID estiver vazio)
    META_PIXEL_ID: '',     // ex.: '123456789012345' (usado só se GTM_ID estiver vazio)
    GADS_ID: '',           // ex.: 'AW-XXXXXXXXX'
    GADS_CONVERSION_LABEL: '' // ex.: 'AbC-D_efG-h12345' (rótulo da conversão de lead)
  };
  var KEY = 'br_consent_v1';
  var w = window; w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  // Consent Mode v2: tudo negado por padrão
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });

  var loaded = { gtm: false, ga: false, fb: false };
  function readConsent() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function saveConsent(a, m) { try { localStorage.setItem(KEY, JSON.stringify({ analytics: a, marketing: m, ts: Date.now() })); } catch (e) {} }
  function script(src, attrs) { var s = document.createElement('script'); s.async = true; s.src = src; for (var k in attrs) s.setAttribute(k, attrs[k]); document.head.appendChild(s); }

  function applyConsent(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (CONFIG.GTM_ID && (c.analytics || c.marketing) && !loaded.gtm) {
      loaded.gtm = true; w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      script('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(CONFIG.GTM_ID));
    } else if (!CONFIG.GTM_ID) {
      var gid = (c.analytics && CONFIG.GA4_ID) ? CONFIG.GA4_ID : (c.marketing && CONFIG.GADS_ID ? CONFIG.GADS_ID : '');
      if (gid && !loaded.ga) {
        loaded.ga = true; script('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gid));
        gtag('js', new Date());
        if (c.analytics && CONFIG.GA4_ID) gtag('config', CONFIG.GA4_ID, { anonymize_ip: true });
        if (c.marketing && CONFIG.GADS_ID) gtag('config', CONFIG.GADS_ID);
      }
      if (c.marketing && CONFIG.META_PIXEL_ID && !loaded.fb) {
        loaded.fb = true;
        !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(w, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        w.fbq('init', CONFIG.META_PIXEL_ID); w.fbq('track', 'PageView');
      }
    }
    if (c.analytics) captureUtm();
  }

  /* UTMs: guardados na sessão apenas com consentimento de estatística */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  function utmFromUrl() { var p = new URLSearchParams(location.search), o = {}; UTM_KEYS.forEach(function (k) { var v = p.get(k); if (v) o[k] = v.slice(0, 100); }); return o; }
  function captureUtm() { var u = utmFromUrl(); if (Object.keys(u).length) { try { sessionStorage.setItem('br_utm', JSON.stringify(u)); } catch (e) {} } }
  function getUtm() { var u = utmFromUrl(); if (Object.keys(u).length) return u; try { return JSON.parse(sessionStorage.getItem('br_utm')) || {}; } catch (e) { return {}; } }

  /* Evento de conversão/engajamento — só dispara o que o usuário consentiu */
  function track(name, params) {
    params = params || {};
    var c = readConsent() || { analytics: false, marketing: false };
    w.dataLayer.push({ event: name, br: params });
    if (c.analytics && CONFIG.GA4_ID && !CONFIG.GTM_ID) gtag('event', name, params);
    if (c.marketing && w.fbq && !CONFIG.GTM_ID) {
      if (name === 'generate_lead') w.fbq('track', 'Lead', params); else if (name === 'whatsapp_click') w.fbq('track', 'Contact', params); else w.fbq('trackCustom', name, params);
    }
    if (c.marketing && CONFIG.GADS_ID && CONFIG.GADS_CONVERSION_LABEL && (name === 'generate_lead' || name === 'whatsapp_click') && !CONFIG.GTM_ID) {
      gtag('event', 'conversion', { send_to: CONFIG.GADS_ID + '/' + CONFIG.GADS_CONVERSION_LABEL });
    }
  }

  /* Banner */
  var box, init = function () {
    box = document.getElementById('cookie'); if (!box) return;
    var c = readConsent();
    if (c) applyConsent(c); else setTimeout(function () { box.classList.add('show'); }, 900);
    function choose(a, m) { saveConsent(a, m); applyConsent({ analytics: a, marketing: m }); box.classList.remove('show'); }
    document.getElementById('ckAll').addEventListener('click', function () { choose(true, true); });
    document.getElementById('ckNone').addEventListener('click', function () { choose(false, false); });
    var open = document.getElementById('cookieOpen'); if (open) open.addEventListener('click', function () { box.classList.add('show'); document.getElementById('ckAll').focus(); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  w.BRTrack = { track: track, getUtm: getUtm };
})();
