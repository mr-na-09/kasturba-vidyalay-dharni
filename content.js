(function () {
  var D = window.SCHOOL || {};

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function observe(nodes) {
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function addNav(id, label) {
    var a = el('a', '', label);
    a.href = '#' + id;
    document.getElementById('menu').insertBefore(a, document.querySelector('#menu a[href="#admission"]'));
  }

  function fill(id, label, items, build) {
    var sec = document.getElementById(id);
    if (!sec || !items || !items.length) return;
    var grid = sec.querySelector('.dyn-grid');
    var made = [];
    items.forEach(function (it) {
      var card = build(it);
      card.classList.add('reveal');
      grid.appendChild(card);
      made.push(card);
    });
    sec.hidden = false;
    addNav(id, label);
    observe(made);
  }

  var p = D.principal || {};
  if (p.message) document.getElementById('principalMsg').textContent = '“' + p.message + '”';
  if (p.name) document.querySelector('.principal-name').firstChild.nodeValue = p.name;
  if (p.photo) {
    var ph = document.querySelector('.principal-photo');
    var img = el('img');
    img.src = p.photo;
    img.alt = p.name || 'मुख्याध्यापक';
    ph.textContent = '';
    ph.appendChild(img);
  }

  if (D.notices && D.notices.length) {
    var ng = document.getElementById('noticeGrid');
    ng.textContent = '';
    var nn = [];
    D.notices.forEach(function (n) {
      var a = el('article', 'notice reveal');
      a.appendChild(el('span', 'chip', n.tag || 'सूचना'));
      a.appendChild(el('h3', '', n.title));
      a.appendChild(el('p', '', n.text || ''));
      ng.appendChild(a);
      nn.push(a);
    });
    observe(nn);
  }

  fill('teachers', 'शिक्षक', D.teachers, function (t) {
    var c = el('article', 'teacher');
    var pic = el('div', 'teacher-photo');
    if (t.photo) {
      var i = el('img');
      i.src = t.photo; i.alt = t.name; i.loading = 'lazy';
      pic.appendChild(i);
    } else {
      pic.textContent = (t.name || '').trim().charAt(0);
    }
    c.appendChild(pic);
    c.appendChild(el('h3', '', t.name));
    c.appendChild(el('p', '', [t.role, t.subject].filter(Boolean).join(' · ')));
    return c;
  });

  fill('facilities', 'सुविधा', D.facilities, function (f) {
    var c = el('article', 'notice');
    c.appendChild(el('h3', '', f.title));
    c.appendChild(el('p', '', f.text || ''));
    return c;
  });

  fill('results', 'निकाल', D.results, function (r) {
    var c = el('article', 'result');
    c.appendChild(el('strong', '', r.value));
    c.appendChild(el('span', '', r.label));
    return c;
  });

  var c = D.contact || {};
  var col = document.querySelector('.footer-grid > div:nth-child(2)');
  if (c.address) col.appendChild(el('p', '', c.address));
  if (c.email) {
    var mp = el('p');
    var ma = el('a', '', c.email);
    ma.href = 'mailto:' + c.email;
    mp.appendChild(ma);
    col.appendChild(mp);
  }
  if (c.mapQuery) {
    var sec = document.getElementById('map');
    var f = document.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(c.mapQuery) + '&output=embed';
    f.title = 'शाळेचे स्थान';
    f.loading = 'lazy';
    sec.querySelector('.map-frame').appendChild(f);
    sec.hidden = false;
  }
})();