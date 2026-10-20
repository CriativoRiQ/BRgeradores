(function () {
  'use strict';
  var root = document.documentElement, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var WA_NUMBER = '5584994793000';
  var WA_TEXT = 'Olá! Vim pelo site da BR Geradores e gostaria de solicitar um orçamento.';
  $('#yr').textContent = new Date().getFullYear();

  /* ---- Espera o fim da abertura antes de animar o hero ---- */
  var ready = root.classList.contains('ready'), queue = [];
  function whenReady(fn) { if (ready) fn(); else queue.push(fn); }
  addEventListener('br:ready', function () { ready = true; queue.splice(0).forEach(function (f) { f(); }); });

  /* ---- Header / menu ---- */
  var top = $('#top'), menu = $('#menu'), burger = $('#burger');
  function onScroll() { top.classList.toggle('sc', scrollY > 30); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  function setMenu(o) { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); burger.firstElementChild.firstElementChild.setAttribute('href', o ? '#i-x' : '#i-menu'); }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  var links = $$('.menu a'), secs = links.map(function (a) { return $(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { var i = secs.indexOf(en.target); links.forEach(function (l, k) { l.classList.toggle('act', k === i); }); } }); }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }

  /* ---- Divisão de títulos em palavras ---- */
  var idx;
  function splitNode(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w'; var i = document.createElement('i'); i.style.setProperty('--i', idx++); i.textContent = p; w.appendChild(i); frag.appendChild(w);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1 && !n.classList.contains('w')) splitNode(n);
    });
  }
  $$('[data-split]').forEach(function (el) { idx = 0; if (!reduce) splitNode(el); });

  /* ---- Revelações ao rolar ---- */
  function show(el) { el.classList.add('in'); }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); var t = en.target; if (t.closest('.hero')) whenReady(function () { show(t); }); else show(t); } });
    }, { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal],[data-split]').forEach(function (el) { io.observe(el); });
  } else $$('[data-reveal],[data-split]').forEach(show);

  /* ---- Contadores ---- */
  function count(el) {
    var end = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dur = 1600, t0 = performance.now();
    if (reduce) { el.textContent = end + suf; return; }
    (function step(now) { var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(end * e) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(step); })(t0);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { co.unobserve(en.target); var t = en.target; if (t.closest('.hero')) whenReady(function () { count(t); }); else count(t); } }); }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }

  /* ---- Parallax ---- */
  if (!reduce) {
    var px = $$('[data-parallax]').map(function (el) { return { el: el, par: el.parentElement, f: parseFloat(el.dataset.parallax), vis: true }; });
    if ('IntersectionObserver' in window) {
      var vo = new IntersectionObserver(function (es) { es.forEach(function (en) { px.forEach(function (p) { if (p.el === en.target) p.vis = en.isIntersecting; }); }); }, { rootMargin: '200px' });
      px.forEach(function (p) { vo.observe(p.el); });
    }
    var tick = false;
    function par() {
      tick = false; var vh = innerHeight, vis = px.filter(function (p) { return p.vis; });
      var offs = vis.map(function (p) { var r = p.par.getBoundingClientRect(); return r.top + r.height / 2 - vh / 2; });   // leituras
      vis.forEach(function (p, i) { p.el.style.transform = 'translate3d(0,' + (offs[i] * p.f * -1).toFixed(1) + 'px,0)'; });  // escritas
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(par); } }, { passive: true }); addEventListener('resize', par); par();
  }

  /* ---- Cards: holofote + inclinação 3D ---- */
  if (fine && !reduce) {
    $$('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
        c.style.transform = 'perspective(800px) rotateX(' + ((.5 - y / r.height) * 7).toFixed(2) + 'deg) rotateY(' + ((x / r.width - .5) * 9).toFixed(2) + 'deg) translateY(-4px)';
      });
      c.addEventListener('pointerleave', function () { c.style.transform = ''; });
    });
  }

  /* ---- Raios no hero (canvas leve, pausa fora da tela) ---- */
  var cv = $('#bolts');
  if (cv && !reduce) {
    var c2 = cv.getContext('2d'), W, H, bolts = [], on = true, next = 0, raf = 0;
    var size = function () { var d = Math.min(devicePixelRatio || 1, 1.5), r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; c2.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    var mk = function (x1, y1, x2, y2, rough, depth) { var p = [[x1, y1], [x2, y2]]; for (var d = 0; d < depth; d++) { var n = [p[0]]; for (var i = 1; i < p.length; i++) { var a = p[i - 1], b = p[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); n.push([(a[0] + b[0]) / 2 + (Math.random() - .5) * l * rough, (a[1] + b[1]) / 2 + (Math.random() - .5) * l * rough], b); } p = n; } return p; };
    var loop = function (now) {
      if (!on) { raf = 0; return; }
      c2.clearRect(0, 0, W, H);
      if (now > next && ready) {
        next = now + 2200 + Math.random() * 3200;
        var sx = Math.random() < .5 ? Math.random() * W * .25 : W * (.75 + Math.random() * .25), sy = Math.random() * H * .3;
        var p = mk(sx, sy, sx + (Math.random() - .5) * W * .25, sy + H * (.25 + Math.random() * .35), .55, 5);
        bolts.push({ p: p, life: 1 });
        if (Math.random() < .5) bolts.push({ p: mk(p[Math.floor(p.length / 2)][0], p[Math.floor(p.length / 2)][1], sx + (Math.random() - .5) * W * .4, sy + H * .5, .6, 4), life: .8 });
      }
      for (var i = bolts.length - 1; i >= 0; i--) {
        var b = bolts[i]; b.life -= .035; if (b.life <= 0) { bolts.splice(i, 1); continue; }
        var a = b.life > .5 ? 1 : b.life * 2; c2.beginPath(); c2.moveTo(b.p[0][0], b.p[0][1]); for (var k = 1; k < b.p.length; k++) c2.lineTo(b.p[k][0], b.p[k][1]);
        c2.lineWidth = 3.5; c2.strokeStyle = 'rgba(255,59,47,' + (.45 * a) + ')'; c2.shadowColor = '#ff3b2f'; c2.shadowBlur = 22; c2.stroke();
        c2.lineWidth = 1.2; c2.strokeStyle = 'rgba(255,240,200,' + a + ')'; c2.shadowBlur = 6; c2.stroke();
      }
      raf = requestAnimationFrame(loop);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting && !document.hidden; if (on && !raf) raf = requestAnimationFrame(loop); }).observe(cv);
    document.addEventListener('visibilitychange', function () { on = !document.hidden; if (on && !raf) raf = requestAnimationFrame(loop); });
    raf = requestAnimationFrame(loop);
  }



  /* ---- Carrossel de eventos (9:16): slideshow automático, foto e vídeo ao passar o mouse ---- */
  (function () {
    var track = $('#carTrack'); if (!track) return;
    var cards = $$('.ev-card', track), cnt = $('#carCount'), cur = 0, timer = null, paused = false, inView = false, hold = 0, rafc = 0;
    cards.forEach(function (c) {      // injeta foto quando data-photo estiver preenchido
      var ph = c.dataset.photo; if (!ph) return;
      var img = document.createElement('img'); img.className = 'ev-img'; img.src = ph; img.alt = c.getAttribute('aria-label') || ''; img.loading = 'lazy'; img.decoding = 'async';
      var media = $('.ev-media', c); media.appendChild(img); c.classList.add('has-img'); var logo = $('.ph-logo', media); if (logo) logo.remove();
    });
    function go(i, smooth) {
      cur = (i + cards.length) % cards.length; var c = cards[cur];
      track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: smooth === false || reduce ? 'auto' : 'smooth' });
    }
    function mark() {
      rafc = 0; var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
      cards.forEach(function (c, i) { var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } });
      cur = best; cards.forEach(function (c, i) { c.classList.toggle('is-active', i === best); }); cnt.textContent = (best + 1) + ' / ' + cards.length;
    }
    track.addEventListener('scroll', function () { if (!rafc) rafc = requestAnimationFrame(mark); }, { passive: true });
    $('#carPrev').addEventListener('click', function () { hold = Date.now() + 7000; go(cur - 1); });
    $('#carNext').addEventListener('click', function () { hold = Date.now() + 7000; go(cur + 1); });
    track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); } });
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (ev) { track.addEventListener(ev, function () { hold = Date.now() + 7000; }, { passive: true }); });
    track.addEventListener('mouseenter', function () { paused = true; }); track.addEventListener('mouseleave', function () { paused = false; });
    track.addEventListener('focusin', function () { paused = true; }); track.addEventListener('focusout', function () { paused = false; });
    function loop() { if (!reduce && inView && !paused && !document.hidden && Date.now() > hold) go(cur + 1); }
    timer = setInterval(loop, 3800);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: .3 }).observe(track);
    // vídeo sob demanda: só baixa e toca quando o mouse passa (ou toque no celular)
    function play(c) {
      var src = c.dataset.video; if (!src || $('video', c)) return;
      var v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata'; v.setAttribute('aria-hidden', 'true'); v.src = src;
      $('.ev-media', c).appendChild(v); v.play().then(function () { c.classList.add('playing'); }).catch(function () { v.remove(); });
    }
    function stop(c) { var v = $('video', c); if (v) { v.pause(); v.remove(); } c.classList.remove('playing'); }
    cards.forEach(function (c, i) {
      c.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') play(c); });
      c.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') stop(c); });
      c.addEventListener('click', function () { if (i !== cur) { go(i); return; } if ($('video', c)) stop(c); else play(c); });
    });
    addEventListener('resize', function () { go(cur, false); });
    mark();
  })();

  /* ---- WhatsApp + rastreamento de cliques ---- */
  var T = window.BRTrack || { track: function () {}, getUtm: function () { return {}; } };
  function waUrl(extra) {
    var u = T.getUtm(), o = u.utm_source ? ' [origem: ' + u.utm_source + (u.utm_campaign ? '/' + u.utm_campaign : '') + ']' : '';
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent((extra || WA_TEXT) + o);
  }
  $$('[data-wa]').forEach(function (a) {
    a.href = waUrl();
    a.addEventListener('click', function () { a.href = waUrl(); T.track('whatsapp_click', { where: a.dataset.where || 'site' }); });
  });
  $$('[data-track]').forEach(function (a) { a.addEventListener('click', function () { T.track(a.dataset.track, { where: a.dataset.where || 'site' }); }); });

  /* ---- Formulário ---- */
  var form = $('#leadForm'), msgBox = $('#formMsg'), sendBtn = $('#sendBtn'), lastSend = 0;
  function mask(v) { v = v.replace(/\D/g, '').slice(0, 11); if (v.length > 10) return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3'); if (v.length > 6) return v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3'); if (v.length > 2) return v.replace(/^(\d{2})(\d{0,5})/, '($1) $2'); return v ? '(' + v : ''; }
  $('#tel').addEventListener('input', function (e) { e.target.value = mask(e.target.value); });
  function mark(el, bad) { el.setAttribute('aria-invalid', bad ? 'true' : 'false'); }
  function clean(s) { return String(s || '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var MAIL_ENDPOINT = 'https://formsubmit.co/ajax/brggeradores@gmail.com';
  form.addEventListener('submit', function (e) {
    e.preventDefault(); msgBox.textContent = '';
    var f = form.elements, nome = clean(f.nome.value), tel = f.tel.value.replace(/\D/g, ''), tipo = f.tipo.value, msg = clean(f.msg.value), ok = true, first = null;
    var chk = [[f.nome, nome.length < 2], [f.tel, tel.length < 10 || tel.length > 11], [f.tipo, !tipo], [f.lgpd, !f.lgpd.checked]];
    chk.forEach(function (c) { mark(c[0], c[1]); if (c[1]) { ok = false; if (!first) first = c[0]; } });
    if (!ok) { first.focus(); return; }
    if (f.site.value) { msgBox.textContent = 'Recebemos! Obrigado.'; return; }               // honeypot (bots)
    if (Date.now() - lastSend < 4000) return; lastSend = Date.now();
    var u = T.getUtm(), origem = Object.keys(u).map(function (k) { return k + '=' + u[k]; }).join(' | ');
    var payload = { 'Nome': nome, 'WhatsApp': f.tel.value, 'Tipo de uso': tipo, 'Mensagem': msg || '(sem mensagem)', 'Origem (UTM)': origem || 'direto', 'Página': location.href.split('?')[0],
      _subject: 'Novo pedido de orçamento pelo site — ' + nome, _template: 'table', _captcha: 'false' };
    var fallback = 'Não foi possível enviar agora. <a href="' + waUrl('Olá! Meu nome é ' + nome + '. ' + tipo + '. ' + msg) + '" target="_blank" rel="noopener">Fale conosco pelo WhatsApp</a>.';
    sendBtn.disabled = true; msgBox.textContent = 'Enviando…';
    fetch(MAIL_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.j.success) !== 'false') {
          T.track('generate_lead', { form: 'orcamento', tipo: tipo });
          form.reset(); msgBox.innerHTML = 'Pedido enviado! Nossa equipe entra em contato em breve. Se preferir, <a href="' + waUrl() + '" target="_blank" rel="noopener">chame no WhatsApp</a>.';
        } else msgBox.innerHTML = fallback;
      })
      .catch(function () { msgBox.innerHTML = fallback; })
      .then(function () { setTimeout(function () { sendBtn.disabled = false; }, 3000); });
  });
  $$('input,select', form).forEach(function (el) { el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') mark(el, false); }); el.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true') mark(el, false); }); });
})();
