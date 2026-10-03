/* Analítica y consentimiento — Amigos Seafood & Steak House
 *
 * El identificador de Google Analytics va aquí abajo y en ningún otro sitio.
 * Mientras diga XXXX el archivo no hace nada: no carga Google, no pone cookies
 * y no enseña el cartel. Así nunca se pide un permiso que no sirve de nada.
 *
 * Google no se carga hasta que la persona acepta. Quien rechaza o no responde
 * no llega a tocar un servidor de Google desde este sitio. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX';
  var CLAVE = 'amigos-consentimiento';   // 'si' | 'no'
  if (GA_ID.indexOf('XXXX') !== -1) return;

  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var T = EN ? {
    texto: 'We use Google Analytics to see which pages people visit and improve the site. It stays off until you accept.',
    politica: 'Privacy policy', si: 'Accept', no: 'Decline', aria: 'Cookie notice'
  } : {
    texto: 'Usamos Google Analytics para saber qué páginas se visitan y mejorar el sitio. No se activa hasta que lo aceptes.',
    politica: 'Política de privacidad', si: 'Aceptar', no: 'Rechazar', aria: 'Aviso de cookies'
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) {} }

  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });

  var cargado = false;
  function activar() {
    if (cargado) return;
    cargado = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  /* Clics en los enlaces ya marcados con data-ev. Si nadie aceptó, estas
     llamadas se quedan en la cola y no salen del navegador. */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('[data-ev]');
    if (a) gtag('event', 'clic_' + a.getAttribute('data-ev'));
  });

  var CSS = '.amg-ck{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;'
    + 'background:var(--noche,#121014);color:var(--hueso,#FAF6EF);border:1px solid rgba(233,196,143,.28);'
    + 'border-radius:14px;padding:18px 20px;box-shadow:0 18px 50px rgba(0,0,0,.45);'
    + 'font-family:var(--sans,system-ui,sans-serif)}'
    + '.amg-ck p{margin:0 0 14px;font-size:14px;line-height:1.55;color:rgba(250,246,239,.82)}'
    + '.amg-ck a{color:var(--ambar-suave,#E9C48F)}'
    + '.amg-ck-btns{display:flex;gap:10px;flex-wrap:wrap}'
    + '.amg-ck button{flex:1 1 auto;min-width:130px;padding:12px 18px;font-family:inherit;font-size:12px;'
    + 'font-weight:700;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;cursor:pointer;'
    + 'border:1px solid transparent}'
    + '.amg-ck .si{background:var(--rojo,#BF2A22);color:#fff}'
    + '.amg-ck .no{background:transparent;color:var(--hueso,#FAF6EF);border-color:rgba(250,246,239,.4)}'
    + '@media (max-width:420px){.amg-ck button{flex:1 1 100%}}';

  function cartel() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    var c = document.createElement('div');
    c.className = 'amg-ck';
    c.setAttribute('role', 'dialog');
    c.setAttribute('aria-label', T.aria);
    c.innerHTML = '<p>' + T.texto + ' <a href="/privacidad">' + T.politica + '</a>.</p>'
      + '<div class="amg-ck-btns"><button type="button" class="si">' + T.si + '</button>'
      + '<button type="button" class="no">' + T.no + '</button></div>';
    document.body.appendChild(c);

    function cerrar(v) { guardar(v); c.remove(); if (v === 'si') activar(); }
    c.querySelector('.si').addEventListener('click', function () { cerrar('si'); });
    c.querySelector('.no').addEventListener('click', function () { cerrar('no'); });
    c.querySelector('.si').focus();
  }

  /* Enlace de la política de privacidad para volver a decidir. */
  var volver = document.getElementById('cambiar-consentimiento');
  if (volver) volver.addEventListener('click', function (e) {
    e.preventDefault();
    try { localStorage.removeItem(CLAVE); } catch (err) {}
    if (!document.querySelector('.amg-ck')) cartel();
  });

  var elegido = leer();
  if (elegido === 'si') activar();
  else if (!elegido) cartel();
})();
