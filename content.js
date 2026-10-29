(function () {
  var D = window.SCHOOL || {};

  function get(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function observe(nodes) {
    if (!('IntersectionObserver' in window)) { nodes.forEach(function (n) { n.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    nodes.forEach(function (n) { io.observe(n); });
  }
  function addNav(id, label) {
    var a = el('a', '', label);
    a.href = '#' + id;
    document.getElementById('menu').insertBefore(a, document.querySelector('#menu a[href="#admission"]'));
  }
  function fill(id, items, build) {
    var sec = document.getElementById(id);
    if (!sec || !items || !items.length) return;
    var grid = sec.querySelector('.dyn-grid'), made = [];
    grid.textContent = '';
    items.forEach(function (it) { var c = build(it); c.classList.add('reveal'); grid.appendChild(c); made.push(c); });
    sec.hidden = false;
    addNav(id, shortTitle(id));
    observe(made);
  }
  function shortTitle(id) {
    return { teachers: 'शिक्षक', facilities: 'सुविधा', results: 'निकाल', faq: 'प्रश्नोत्तरे' }[id] || id;
  }
  function imgOf(src, alt) { var i = el('img'); i.src = src; i.alt = alt || ''; i.loading = 'lazy'; return i; }

  var root = document.documentElement.style;
  if (D.theme) {
    if (D.theme.navy) root.setProperty('--navy', D.theme.navy);
    if (D.theme.gold) root.setProperty('--gold', D.theme.gold);
  }

  document.querySelectorAll('[data-k]').forEach(function (n) {
    var v = get(D, n.getAttribute('data-k'));
    if (typeof v === 'string' && v) n.textContent = v;
  });

  var s = D.site || {};
  var bt = document.querySelector('.brand-text');
  if (s.name) { bt.firstChild.nodeValue = s.name; document.title = s.name + (s.tagline ? ' – ' + s.tagline : ''); }
  if (s.tagline) bt.querySelector('small').textContent = s.tagline;
  if (s.logo) {
    var bm = document.querySelector('.brand-mark');
    bm.textContent = '';
    bm.style.background = 'none';
    bm.appendChild(imgOf(s.logo, s.name));
    bm.firstChild.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
  }

  var h = D.hero || {};
  if (h.title1 || h.gold || h.title2) {
    var h1 = document.querySelector('.hero h1');
    h1.textContent = '';
    h1.appendChild(document.createTextNode((h.title1 || '') + ' '));
    h1.appendChild(el('span', 'gold-text', h.gold || ''));
    h1.appendChild(document.createTextNode(' ' + (h.title2 || '')));
  }

  if (D.stats && D.stats.length) {
    var sb = document.querySelector('.hero-stats');
    sb.textContent = '';
    D.stats.forEach(function (x, i) {
      var d = el('div', 'stat' + (D.stats.length % 2 && i === D.stats.length - 1 ? ' stat-wide' : ''));
      d.appendChild(el('strong', String(x.value).length > 8 ? 'udise' : '', x.value));
      d.appendChild(el('span', '', x.label));
      sb.appendChild(d);
    });
  }

  var ab = D.about || {};
  var abBox = document.querySelector('#about .reveal');
  if ((ab.paragraphs && ab.paragraphs.length) || (ab.points && ab.points.length)) {
    abBox.querySelectorAll('p, ul').forEach(function (n) { n.remove(); });
    (ab.paragraphs || []).forEach(function (t) { abBox.appendChild(el('p', '', t)); });
    var ul = el('ul', 'ticks');
    (ab.points || []).forEach(function (t) { ul.appendChild(el('li', '', t)); });
    abBox.appendChild(ul);
  }

  var p = D.principal || {};
  if (p.message) document.getElementById('principalMsg').textContent = '“' + p.message + '”';
  if (p.name) document.querySelector('.principal-name').firstChild.nodeValue = p.name;
  if (p.photo) {
    var ph = document.querySelector('.principal-photo');
    ph.textContent = '';
    ph.appendChild(imgOf(p.photo, p.name || 'मुख्याध्यापक'));
  }

  if (D.notices && D.notices.length) {
    var ng = document.getElementById('noticeGrid'), nn = [];
    ng.textContent = '';
    D.notices.forEach(function (n) {
      var a = el('article', 'notice reveal');
      a.appendChild(el('span', 'chip', n.tag || 'सूचना'));
      a.appendChild(el('h3', '', n.title));
      a.appendChild(el('p', '', n.text || ''));
      ng.appendChild(a); nn.push(a);
    });
    observe(nn);
  }

  if (D.gallery && D.gallery.length) {
    var gal = document.querySelector('.gallery'), gm = [];
    gal.textContent = '';
    D.gallery.forEach(function (g, i) {
      var f = el('figure', 'g-item reveal');
      if (i % 5 === 0) f.classList.add('g-tall');
      if (i % 5 === 3) f.classList.add('g-wide');
      f.appendChild(imgOf(g.src, g.caption || 'शाळेचे छायाचित्र'));
      if (g.caption) { var fc = el('figcaption'); fc.appendChild(el('span', '', g.caption)); f.appendChild(fc); }
      gal.appendChild(f); gm.push(f);
    });
    observe(gm);
  }

  fill('teachers', D.teachers, function (t) {
    var c = el('article', 'teacher'), pic = el('div', 'teacher-photo');
    if (t.photo) pic.appendChild(imgOf(t.photo, t.name)); else pic.textContent = (t.name || '').trim().charAt(0);
    c.appendChild(pic);
    c.appendChild(el('h3', '', t.name));
    c.appendChild(el('p', '', [t.role, t.subject].filter(Boolean).join(' · ')));
    return c;
  });
  fill('facilities', D.facilities, function (f) {
    var c = el('article', 'notice');
    c.appendChild(el('h3', '', f.title));
    c.appendChild(el('p', '', f.text || ''));
    return c;
  });
  fill('results', D.results, function (r) {
    var c = el('article', 'result');
    c.appendChild(el('strong', '', r.value));
    c.appendChild(el('span', '', r.label));
    return c;
  });
  fill('faq', D.faq, function (q) {
    var d = el('details', 'faq-item');
    d.appendChild(el('summary', '', q.q));
    d.appendChild(el('p', '', q.a));
    return d;
  });

  var ad = D.admission || {};
  if (ad.steps && ad.steps.length) {
    var ol = document.querySelector('.steps'), sm = [];
    ol.textContent = '';
    ad.steps.forEach(function (st) {
      var li = el('li', 'step reveal');
      li.appendChild(el('h3', '', st.title));
      li.appendChild(el('p', '', st.text || ''));
      ol.appendChild(li); sm.push(li);
    });
    observe(sm);
  }
  var box = document.getElementById('admissionInfo'), any = false;
  if (ad.documents && ad.documents.length) {
    box.appendChild(el('h3', '', 'आवश्यक कागदपत्रे'));
    var dl = el('ul', 'ticks');
    ad.documents.forEach(function (x) { dl.appendChild(el('li', '', x)); });
    box.appendChild(dl); any = true;
  }
  if (ad.lastDate) { box.appendChild(el('p', '', 'प्रवेशाची शेवटची तारीख: ' + ad.lastDate)); any = true; }
  if (ad.fee) { box.appendChild(el('p', '', 'फी संबंधी माहिती: ' + ad.fee)); any = true; }
  if (any) box.hidden = false;

  var c = D.contact || {};
  var col = document.querySelector('.footer-grid > div:nth-child(2)');
  if (c.phone) {
    var tel = col.querySelector('a[href^="tel"]');
    tel.href = 'tel:' + c.phone;
    tel.textContent = c.phone;
  }
  if (c.whatsapp) {
    var msg = encodeURIComponent('नमस्कार, मला प्रवेशाबद्दल माहिती हवी आहे.');
    document.querySelector('.wa-float').href = 'https://wa.me/' + c.whatsapp + '?text=' + msg;
    col.querySelector('a[href^="https://wa.me"]').href = 'https://wa.me/' + c.whatsapp;
  }
  if (c.address) col.appendChild(el('p', '', c.address));
  if (c.email) {
    var mp = el('p'), ma = el('a', '', c.email);
    ma.href = 'mailto:' + c.email;
    mp.appendChild(ma); col.appendChild(mp);
  }
  if (c.mapQuery) {
    var sec = document.getElementById('map'), f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(c.mapQuery) + '&output=embed';
    f.title = 'शाळेचे स्थान'; f.loading = 'lazy';
    sec.querySelector('.map-frame').appendChild(f);
    sec.hidden = false;
  }
})();