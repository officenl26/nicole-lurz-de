/* ═══════════════════════════════════════════════════════════════════
   nl-consent.js · Consent-Banner + Meta-Pixel für nicole-lurz.de

   - Vor Einwilligung wird nichts geladen, kein Cookie gesetzt.
   - "Akzeptieren" und "Ablehnen" sind gleichwertig (DSGVO, § 25 TDDDG).
   - Die Wahl liegt in localStorage ("nl_consent" = "accepted" | "declined").
   - Widerruf: Link mit data-nl-consent-open oder window.nlConsent.open().

   Seiten-Conversion setzen (im <head>, VOR diesem Skript):
     <script>window.NL_META_EVENT = { name: "Lead", params: { content_name: "Blind Spot Check" } };</script>
   oder als Funktion:
     <script>window.NL_META_EVENT = function (fbq) { fbq("track", "Lead"); };</script>
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var STORAGE_KEY = "nl_consent";
  var PIXEL_ID = "3469495449989802"; // Nicole-Lurz.de Pixel 2023
  var PRIVACY_URL = "https://nicole-lurz.de/datenschutz/";

  function readConsent() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function writeConsent(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  /* ---------- Meta-Pixel ---------- */
  var pixelStarted = false;

  function startPixel() {
    if (pixelStarted) return;
    pixelStarted = true;

    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
    firePageEvent();
  }

  function firePageEvent() {
    var ev = window.NL_META_EVENT;
    if (!ev) return;
    try {
      if (typeof ev === "function") { ev(window.fbq); return; }
      if (ev.name) { window.fbq("track", ev.name, ev.params || {}); }
    } catch (e) {}
  }

  /* ---------- Banner ---------- */
  var STYLE = [
    ".nlc-banner{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;",
    "background:#0F1A14;color:#E8F0E8;border-top:1px solid rgba(122,168,144,.35);",
    "font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;",
    "box-shadow:0 -8px 40px rgba(0,0,0,.35)}",
    ".nlc-inner{max-width:960px;margin:0 auto;padding:20px 24px;display:flex;",
    "gap:18px 28px;align-items:center;flex-wrap:wrap}",
    ".nlc-text{flex:1 1 320px;font-size:14px;line-height:1.6;color:#C9D8CF;margin:0}",
    ".nlc-text a{color:#7AA890;text-decoration:underline}",
    ".nlc-actions{display:flex;gap:12px;flex-wrap:wrap}",
    ".nlc-btn{font:inherit;font-size:14px;font-weight:600;padding:11px 22px;border-radius:8px;",
    "cursor:pointer;border:1px solid transparent;line-height:1;transition:opacity .15s}",
    ".nlc-btn:hover{opacity:.85}",
    ".nlc-accept{background:#7AA890;color:#0B140F}",
    ".nlc-decline{background:transparent;color:#E8F0E8;border-color:rgba(232,240,232,.4)}",
    "@media(max-width:560px){.nlc-actions{width:100%}.nlc-btn{flex:1 1 auto;text-align:center}}"
  ].join("");

  function injectStyle() {
    if (document.getElementById("nlc-style")) return;
    var s = document.createElement("style");
    s.id = "nlc-style";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function removeBanner() {
    var b = document.getElementById("nlc-banner");
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    injectStyle();
    removeBanner();

    var wrap = document.createElement("div");
    wrap.className = "nlc-banner";
    wrap.id = "nlc-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Hinweis zu Cookies und Meta-Pixel");

    wrap.innerHTML =
      '<div class="nlc-inner">' +
        '<p class="nlc-text">Diese Seite nutzt den <strong>Meta-Pixel</strong> (Facebook, Instagram), ' +
        'um die Wirkung von Anzeigen zu messen. Er setzt Cookies und übermittelt Daten an Meta in den USA. ' +
        'Das passiert nur mit deiner Einwilligung. Mehr dazu in der ' +
        '<a href="' + PRIVACY_URL + '">Datenschutzerklärung</a>.</p>' +
        '<div class="nlc-actions">' +
          '<button type="button" class="nlc-btn nlc-decline" id="nlc-decline">Ablehnen</button>' +
          '<button type="button" class="nlc-btn nlc-accept" id="nlc-accept">Akzeptieren</button>' +
        '</div>' +
      '</div>';

    (document.body || document.documentElement).appendChild(wrap);

    document.getElementById("nlc-accept").addEventListener("click", function () {
      writeConsent("accepted");
      removeBanner();
      startPixel();
    });
    document.getElementById("nlc-decline").addEventListener("click", function () {
      writeConsent("declined");
      removeBanner();
    });
  }

  /* ---------- Öffentliche Steuerung (Widerruf / erneut fragen) ---------- */
  window.nlConsent = {
    open: showBanner,
    accept: function () { writeConsent("accepted"); removeBanner(); startPixel(); },
    decline: function () { writeConsent("declined"); removeBanner(); },
    reset: function () {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      showBanner();
    },
    status: readConsent
  };

  function wireOpeners() {
    var nodes = document.querySelectorAll("[data-nl-consent-open]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("click", function (e) {
        e.preventDefault();
        showBanner();
      });
    }
  }

  /* ---------- Start ---------- */
  function init() {
    var consent = readConsent();
    if (consent === "accepted") {
      startPixel();
    } else if (consent !== "declined") {
      showBanner();
    }
    wireOpeners();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
