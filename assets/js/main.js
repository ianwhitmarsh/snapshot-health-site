/* Snapshot Health — interactions & animations */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero / subhero entrance ---------- */
  window.addEventListener('load', function () {
    var h = document.querySelector('.hero') || document.querySelector('.subhero');
    if (h) h.classList.add('loaded');
  });
  /* safety: if load already fired */
  if (document.readyState === 'complete') {
    var h0 = document.querySelector('.hero') || document.querySelector('.subhero');
    if (h0) h0.classList.add('loaded');
  }




  /* ---------- Adaptive lazy video loading ----------
     - Nothing downloads until it's needed (posters show instantly)
     - Slow connections / data-saver / phones get lighter encodes
     - Background loops pause when far off screen                    */
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var slowNet = !!(conn && (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '')));
  var useSmall = slowNet || window.innerWidth < 768;

  function attachVideo(v) {
    if (v.dataset.attached) return;
    v.dataset.attached = '1';
    var base = 'assets/video/' + v.dataset.vid + (useSmall ? '-small' : '');
    var s = document.createElement('source');
    s.src = base + '.mp4';
    s.type = 'video/mp4';
    v.appendChild(s);
    v.preload = v.hasAttribute('data-hover') ? 'metadata' : 'auto';
    v.load();
    if (!v.hasAttribute('data-hover')) {
      var tryPlay = function () { v.play().catch(function () {}); };
      if (v.readyState >= 3) tryPlay();
      else v.addEventListener('canplay', tryPlay, { once: true });
    }
  }

  var lazyVids = Array.prototype.slice.call(document.querySelectorAll('video[data-vid]'));
  lazyVids.forEach(function (v) { if (v.hasAttribute('data-eager')) attachVideo(v); });

  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { attachVideo(e.target); vio.unobserve(e.target); }
      });
    }, { rootMargin: '900px 0px 900px 0px' });
    lazyVids.forEach(function (v) { if (!v.hasAttribute('data-eager')) vio.observe(v); });

    /* pause/resume looping backgrounds by visibility */
    var pio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (v.hasAttribute('data-hover') || !v.dataset.attached) return;
        if (e.isIntersecting) { v.play().catch(function () {}); }
        else { v.pause(); }
      });
    }, { rootMargin: '250px 0px 250px 0px' });
    lazyVids.forEach(function (v) { if (!v.hasAttribute('data-hover')) pio.observe(v); });
  } else {
    lazyVids.forEach(attachVideo);
  }

  /* ---------- Fixed header state ---------- */
  var scrolledState = false;
  function headerState() {
    var s = window.scrollY > 60;
    if (s !== scrolledState) {
      scrolledState = s;
      document.body.classList.toggle('scrolled', s);
    }
  }
  headerState();
  window.addEventListener('scroll', headerState, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navEl = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  if (navEl && navToggle) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navEl.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (navEl.classList.contains('open') && !navEl.contains(e.target)) {
        navEl.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll-jacked horizontal donut section (all devices) ---------- */
  var section = document.getElementById('apSection');
  var track = document.getElementById('carousel');
  if (section && track) {
    var dist = 0;
    var lastW = 0;
    var lastH = 0;
    function layout() {
      track.style.transform = 'translateX(0)';
      dist = track.scrollWidth - document.documentElement.clientWidth;
      if (dist < 0) dist = 0;
      /* 10% more scroll distance so cards drift in a touch slower */
      section.style.height = (window.innerHeight + dist * 1.12) + 'px';
    }
    function onScroll() {
      var rect = section.getBoundingClientRect();
      var rel = -rect.top; /* how far we've scrolled into the section */
      var p = Math.max(0, Math.min(1, dist ? rel / (dist * 1.12) : 1));
      track.style.transform = 'translateX(' + (-p * dist).toFixed(1) + 'px)';
    }
    function maybeRelayout() {
      /* ignore mobile URL-bar height changes; only re-layout on real width changes
         or big height jumps (rotation) */
      var w = document.documentElement.clientWidth;
      var h = window.innerHeight;
      if (w !== lastW || Math.abs(h - lastH) > 140) {
        lastW = w; lastH = h;
        layout(); onScroll();
      }
    }
    lastW = document.documentElement.clientWidth;
    lastH = window.innerHeight;
    layout();
    onScroll();
    window.addEventListener('resize', maybeRelayout);
    window.addEventListener('orientationchange', function () { setTimeout(function () { lastW = 0; maybeRelayout(); }, 250); });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Reveal-on-scroll ---------- */
  var revealTargets = [
    ['.why h2', 0], ['.why .lede', 1], ['.why .col', 'stagger'], ['.why .watch', 0], ['.claire-card', 0],
    ['.roi h2', 0], ['.roi .tag', 1], ['.rio-card', 0], ['.roi .cdc', 0],
    ['.awareness-problem h2', 0],
    ['.solution h2', 0], ['.solution .lede', 1], ['.sol-card', 'stagger'],
    ['.tracking h2', 0], ['.tracking p', 1],
    ['.screening h2', 0], ['.screening .vid', 0], ['.screening .copy', 1],
    ['.noapps p', 0],
    ['.testimonials h2', 0], ['.t-card', 'stagger'],
    ['.lowcost h2', 0],
    ['.about-block h2', 0], ['.about-block p', 1], ['.about-block .btn', 2],
    ['.goal h2', 0], ['.goal p', 1], ['.goal img', 1],
    ['.contact h2', 0], ['.form-card', 1],
    ['.wwt-cells .copy', 0], ['.wwt-bio .copy', 0], ['.wwt-mental .copy', 0], ['.wwt-boost .inner', 0]
  ];
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (t) {
      var els = document.querySelectorAll(t[0]);
      els.forEach(function (el, i) {
        el.classList.add('rv');
        var d = t[1] === 'stagger' ? i * 0.14 : (t[1] * 0.14);
        el.style.setProperty('--d', d.toFixed(2) + 's');
        io.observe(el);
      });
    });
  }

  /* ---------- Donut draw + count-up ---------- */
  var donuts = document.querySelectorAll('.donut-wrap');
  donuts.forEach(function (d) {
    var arc = d.querySelectorAll('svg circle')[1];
    if (!arc) return;
    arc.classList.add('donut-arc');
    var target = arc.getAttribute('stroke-dasharray'); /* "X 276.46" */
    d.dataset.target = target;
    if (!reduced) arc.setAttribute('stroke-dasharray', '0 276.46');
  });
  if (!reduced && 'IntersectionObserver' in window) {
    var fireDonut = function (d) {
      if (d.dataset.fired) return;
      d.dataset.fired = '1';
      var arc = d.querySelectorAll('svg circle')[1];
      arc.setAttribute('stroke-dasharray', d.dataset.target);
      var pctEl = d.querySelector('.pct');
      if (pctEl) {
        var final = parseInt(pctEl.dataset.final || pctEl.textContent, 10) || 0;
        pctEl.dataset.final = final;
        var t0 = null;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 1450);
          var eased = 1 - Math.pow(1 - p, 3);
          pctEl.textContent = Math.round(final * eased) + '%';
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    };
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        fireDonut(e.target);
        dio.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    donuts.forEach(function (d) { dio.observe(d); });
    /* fallback for browsers where IO misses transform-driven movement */
    var pending = Array.prototype.slice.call(donuts);
    function donutCheck() {
      if (!pending.length) { window.removeEventListener('scroll', donutCheck); return; }
      pending = pending.filter(function (d) {
        var r = d.getBoundingClientRect();
        var visible = r.left < window.innerWidth - r.width * 0.35 && r.right > r.width * 0.35 && r.top < window.innerHeight && r.bottom > 0;
        if (visible && !d.dataset.done) {
          d.dataset.done = '1';
          fireDonut(d);
          return false;
        }
        return !d.dataset.done;
      });
    }
    window.addEventListener('scroll', donutCheck, { passive: true });
  }

  /* ---------- Tracking chart draw ---------- */
  var tracking = document.querySelector('.tracking');
  if (tracking && !reduced && 'IntersectionObserver' in window) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { tracking.classList.add('drawn'); tio.unobserve(tracking); }
      });
    }, { threshold: 0.45 });
    tio.observe(tracking);
  } else if (tracking) {
    tracking.classList.add('drawn');
  }

  /* ---------- Testimonials: play on click/tap ---------- */
  document.querySelectorAll('.t-card').forEach(function (card) {
    var frame = card.querySelector('.frame');
    var video = card.querySelector('video');
    if (!frame || !video) return;
    frame.style.cursor = 'pointer';
    frame.addEventListener('click', function () {
      attachVideo(video);
      if (card.classList.contains('playing')) {
        card.classList.remove('playing');
        video.pause();
      } else {
        /* pause any other playing testimonial */
        document.querySelectorAll('.t-card.playing').forEach(function (o) {
          o.classList.remove('playing');
          var ov = o.querySelector('video'); if (ov) ov.pause();
        });
        card.classList.add('playing');
        video.muted = false;
        video.play().catch(function () { video.muted = true; video.play().catch(function(){}); });
      }
    });
  });

  /* ---------- Claire card: open full video in popup player ---------- */
  var claire = document.getElementById('claireCard');
  var modal = document.getElementById('videoModal');
  if (claire && modal) {
    var modalVideo = document.getElementById('modalVideo');
    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modalVideo.play().catch(function () {});
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalVideo.pause();
    }
    claire.addEventListener('click', openModal);
    modal.querySelector('.vm-back').addEventListener('click', closeModal);
    modal.querySelector('.vm-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  }

  /* ---------- Contact form: send to CRM webhook, then show thank-you ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var WEBHOOK = 'https://services.leadconnectorhq.com/hooks/0GMF7Dzolx7LCNT4lfT3/webhook-trigger/f8532551-de8a-478b-9fd2-306ea55e950d';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var payload = {
        group_size: (document.getElementById('f-group') || {}).value || '',
        company: (document.getElementById('f-org') || {}).value || '',
        name: (document.getElementById('f-name') || {}).value || '',
        phone: (document.getElementById('f-phone') || {}).value || '',
        page: window.location.href,
        submitted_at: new Date().toISOString()
      };
      try {
        fetch(WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(function () {});
      } catch (err) {}
      var cardEl = form.closest('.form-card');
      if (cardEl) cardEl.classList.add('sent');
    });
  }
})();
