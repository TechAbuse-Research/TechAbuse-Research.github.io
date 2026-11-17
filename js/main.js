(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var CONTACT_EMAIL = ['TechAbuse-Research', 'rhul.ac.uk'].join('@');

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  function el(tag, attrs, children) {
    var node = doc.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'text') node.textContent = value;
        else if (key === 'class') node.className = value;
        else node.setAttribute(key, value === true ? '' : String(value));
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? doc.createTextNode(child) : child);
    });
    return node;
  }

  function icon(name) {
    var svg = doc.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = doc.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#' + name);
    svg.appendChild(use);
    return svg;
  }

  function initQuickExit() {
    each(doc.querySelectorAll('[data-quick-exit]'), function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        quickExit(link.href);
      });
    });
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) root.classList.remove('is-exiting');
    });
  }

  function quickExit(url) {
    root.classList.add('is-exiting');
    try { doc.title = 'Loading'; } catch (e) { }
    window.location.replace(url);
  }

  function initHeader() {
    var ticking = false;
    function update() {
      ticking = false;
      root.classList.toggle('is-scrolled', window.scrollY > 24);
    }
    update();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  function initMenu() {
    var nav = doc.querySelector('.site-nav');
    var toggle = doc.querySelector('.nav-toggle');
    var menu = doc.getElementById('site-menu');
    if (!nav || !toggle || !menu) return;

    function isOpen() { return toggle.getAttribute('aria-expanded') === 'true'; }
    function setOpen(open, returnFocus) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open && returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () { setOpen(!isOpen()); });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) setOpen(false, true);
    });
    doc.addEventListener('click', function (event) {
      if (isOpen() && !event.target.closest('.site-header__bar')) setOpen(false);
    });
    nav.addEventListener('focusout', function (event) {
      if (isOpen() && event.relatedTarget && !nav.contains(event.relatedTarget)) setOpen(false);
    });
    if (window.matchMedia) {
      var wide = window.matchMedia('(min-width: 67rem)');
      var onChange = function () { if (wide.matches) setOpen(false); };
      if (wide.addEventListener) wide.addEventListener('change', onChange);
      else if (wide.addListener) wide.addListener(onChange);
    }
  }

  function initInPageLinks() {
    doc.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var id;
      try { id = decodeURIComponent(link.getAttribute('href').slice(1)); } catch (e) { return; }
      if (!id) return;
      var target = doc.getElementById(id);
      if (!target) return;
      event.preventDefault();
      goTo(target, id);
    });
  }

  function goTo(target, id) {
    var behavior = reducedMotion() ? 'auto' : 'smooth';
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: behavior });
    } else {
      target.scrollIntoView({ behavior: behavior, block: 'start' });
    }
    try {
      var url = id === 'top' ? window.location.pathname + window.location.search : '#' + id;
      window.history.replaceState(null, '', url);
    } catch (e) { }

    var focusTarget = target;
    if (!focusTarget.matches('a[href], button, input, textarea, select, [tabindex]')) {
      focusTarget.setAttribute('tabindex', '-1');
    }
    try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); }
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = doc.querySelectorAll('.site-menu a[href^="#"]');
    if (!links.length) return;

    var sectionToLink = {
      resources: 'resources',
      team: 'team',
      handbook: 'handbook',
      'handbook-uk': 'handbook',
      'handbook-switzerland': 'handbook',
      checklists: 'checklists',
      contact: 'contact'
    };
    var linkById = {};
    each(links, function (link) { linkById[link.getAttribute('href').slice(1)] = link; });

    var sections = Object.keys(sectionToLink)
      .map(function (id) { return doc.getElementById(id); })
      .filter(function (section) { return section && !section.hidden; });

    var visible = {};
    var current = null;

    function setCurrent(key) {
      if (key === current) return;
      current = key;
      each(links, function (link) { link.removeAttribute('aria-current'); });
      if (key && linkById[key]) linkById[key].setAttribute('aria-current', 'true');
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var key = null;
      sections.forEach(function (section) {
        if (!key && visible[section.id]) key = sectionToLink[section.id];
      });
      setCurrent(key);
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function mailtoHref(subject) {
    return 'mailto:' + CONTACT_EMAIL + (subject ? '?subject=' + encodeURIComponent(subject) : '');
  }

  function initEmailLinks() {
    each(doc.querySelectorAll('a.js-email'), function (link) {
      link.addEventListener('click', function (event) {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.location.href = mailtoHref(link.getAttribute('data-subject'));
      });
    });
  }

  function initHandbook() {
    var data = window.TAR_HANDBOOK;
    var containers = doc.querySelectorAll('[data-edition-feature], [data-edition-grid]');

    if (!data || !Array.isArray(data.editions) || !data.languages || !data.layouts || !data.regions) {
      each(containers, function (container) {
        container.appendChild(el('p', { class: 'status' }, [
          'Downloads could not be loaded. Please refresh the page, or email ',
          el('a', { href: mailtoHref('Tech Abuse Handbook'), text: CONTACT_EMAIL }),
          ' for a copy.'
        ]));
      });
      return;
    }

    var editions = data.editions.filter(function (edition) {
      var ok = edition && data.regions[edition.region] && data.languages[edition.language] && data.layouts[edition.layout];
      if (!ok && window.console) console.warn('Tech Abuse Research: ignoring an invalid handbook edition in js/resources.js', edition);
      return ok;
    });

    each(doc.querySelectorAll('[data-edition-feature]'), function (node) { renderFeature(node, data, editions); });
    each(doc.querySelectorAll('[data-edition-grid]'), function (node) { renderGrid(node, data, editions); });
    each(doc.querySelectorAll('[data-region-languages]'), function (node) { renderRegionLanguages(node, data, editions); });
  }

  function isAvailable(edition) {
    return edition.status === 'available' && typeof edition.file === 'string' && safeHref(edition.file) !== null;
  }

  function safeHref(path) {
    var value = String(path || '').trim();
    if (!value || /^(javascript|data|vbscript|file):/i.test(value)) return null;
    return value;
  }

  function layoutOrder(data) { return Object.keys(data.layouts); }

  function sortByLayout(list, data) {
    var order = layoutOrder(data);
    return list.slice().sort(function (a, b) { return order.indexOf(a.layout) - order.indexOf(b.layout); });
  }

  function editionLabel(edition, data) {
    return 'Tech Abuse Handbook, ' + data.regions[edition.region].label + ', ' +
      data.languages[edition.language].name + ', ' + data.layouts[edition.layout].name.toLowerCase();
  }

  function versionTag(edition) {
    return edition.version ? 'v' + String(edition.version).trim().replace(/^v/i, '').replace(/\./g, '-') : '';
  }

  function downloadName(edition, data) {
    var parts = ['Tech-Abuse-Handbook', edition.region === 'uk' ? 'UK' : data.regions[edition.region].name,
      data.languages[edition.language].name, data.layouts[edition.layout].short || edition.layout];
    if (versionTag(edition)) parts.push(versionTag(edition));
    return parts.join('_')
      .replace(/[^A-Za-z0-9_-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/-_/g, '_')
      .replace(/_-/g, '_')
      .replace(/-$/, '') + '.pdf';
  }

  function downloadLink(edition, data) {
    var size = edition.size ? String(edition.size) : '';
    var label = 'Download PDF' + (size ? ' (' + size + ')' : '') + ': ' + editionLabel(edition, data);
    var link = el('a', {
      class: 'dl-btn',
      href: safeHref(edition.file),
      download: downloadName(edition, data),
      type: 'application/pdf',
      hreflang: edition.language,
      'aria-label': label
    }, [icon('i-download'), el('span', { text: 'Download PDF' })]);
    countDownloads(link, edition, data);
    return link;
  }

  function countDownloads(link, edition, data) {
    var name = 'download/' + edition.region + '/handbook-' + edition.language + '-' + edition.layout +
      (versionTag(edition) ? '-' + versionTag(edition) : '');
    var title = editionLabel(edition, data) + (edition.version ? ', version ' + edition.version : '');
    function send() {
      var counter = window.goatcounter;
      if (!counter || typeof counter.count !== 'function') return;
      try { counter.count({ path: name, title: title, event: true }); } catch (e) { }
    }
    link.addEventListener('click', send);
    link.addEventListener('auxclick', function (event) { if (event.button === 1) send(); });
  }

  function sizeText(edition) {
    return isAvailable(edition) && edition.size ? 'PDF, ' + edition.size : '';
  }

  function statusLabel(edition) {
    var text = edition.status === 'unavailable' ? 'Currently unavailable' : 'Coming soon';
    return el('span', { class: 'status' }, [icon('i-clock'), el('span', { text: text })]);
  }

  function metaText(edition) {
    var parts = [];
    if (sizeText(edition)) parts.push(sizeText(edition));
    if (edition.version) parts.push('Version ' + edition.version);
    if (edition.published) parts.push(edition.published);
    return parts.join(' · ');
  }

  function coverImage(edition, data, alt) {
    var img = el('img', { src: edition.cover, alt: alt, loading: 'lazy', decoding: 'async' });
    if (edition.coverSrcset) {
      img.setAttribute('srcset', edition.coverSrcset);
      img.setAttribute('sizes', edition.layout === 'mobile'
        ? '(min-width: 75rem) 172px, (min-width: 40rem) 140px, 112px'
        : '(min-width: 75rem) 215px, (min-width: 40rem) 176px, 140px');
    }
    return img;
  }

  function renderFeature(container, data, editions) {
    var region = container.getAttribute('data-edition-feature');
    var language = container.getAttribute('data-language');
    var items = sortByLayout(editions.filter(function (e) {
      return e.region === region && e.language === language;
    }), data);
    if (!items.length) return;

    var lang = data.languages[language];
    var list = el('ul', { class: 'feature__list', role: 'list' });
    items.forEach(function (edition) {
      var layout = data.layouts[edition.layout];
      var media = el('div', { class: 'feature-item__media' });
      if (edition.cover) {
        var frame = el('div', { class: edition.layout === 'mobile' ? 'cover-device' : 'cover-paper' });
        frame.appendChild(coverImage(edition, data, 'Cover of the ' + editionLabel(edition, data)));
        media.appendChild(frame);
      } else {
        media.appendChild(el('div', { class: 'cover-missing', text: 'Cover preview coming soon' }));
      }
      var meta = metaText(edition);
      list.appendChild(el('li', { class: 'feature-item feature-item--' + edition.layout }, [
        media,
        el('div', { class: 'feature-item__body' }, [
          el('p', { class: 'feature-item__label' }, [icon(edition.layout === 'mobile' ? 'i-phone' : 'i-laptop'), layout.name]),
          meta ? el('p', { class: 'feature-item__meta', text: meta }) : null,
          isAvailable(edition) ? downloadLink(edition, data) : statusLabel(edition)
        ])
      ]));
    });

    container.appendChild(el('div', { class: 'feature' }, [
      el('h3', { class: 'feature__title', text: 'Download in ' + lang.name }),
      list
    ]));
  }

  function renderGrid(container, data, editions) {
    var region = container.getAttribute('data-edition-grid');
    var exclude = (container.getAttribute('data-exclude') || '').split(/[\s,]+/).filter(Boolean);
    var groups = [];
    var byLanguage = {};
    editions.forEach(function (edition) {
      if (edition.region !== region || exclude.indexOf(edition.language) !== -1) return;
      if (!byLanguage[edition.language]) {
        byLanguage[edition.language] = { language: edition.language, editions: [] };
        groups.push(byLanguage[edition.language]);
      }
      byLanguage[edition.language].editions.push(edition);
    });
    if (!groups.length) return;

    var list = el('ul', { class: 'lang-grid', role: 'list' });
    groups.forEach(function (group) {
      var lang = data.languages[group.language];
      var withCover = group.editions.filter(function (e) { return e.cover && e.layout === 'desktop'; })[0] ||
        group.editions.filter(function (e) { return e.cover; })[0];
      var name = el('h4', { class: 'lang-card__name' }, [
        el('span', { class: 'lang-card__native', lang: group.language, dir: lang.dir || null, text: lang.nativeName || lang.name }),
        lang.nativeName && lang.nativeName !== lang.name ? el('span', { class: 'lang-card__english', text: lang.name }) : null
      ]);
      var formats = el('ul', { class: 'lang-card__formats', role: 'list' });
      sortByLayout(group.editions, data).forEach(function (edition) {
        var size = sizeText(edition);
        formats.appendChild(el('li', { class: 'format' + (isAvailable(edition) ? ' format--available' : '') }, [
          el('span', { class: 'format__label' }, [icon(edition.layout === 'mobile' ? 'i-phone' : 'i-laptop'), data.layouts[edition.layout].name]),
          size ? el('span', { class: 'format__size', text: size }) : null,
          isAvailable(edition) ? downloadLink(edition, data) : statusLabel(edition)
        ]));
      });
      list.appendChild(el('li', { class: 'lang-card' }, [
        el('div', { class: 'lang-card__head' }, [
          withCover ? el('img', {
            class: 'lang-card__thumb', src: withCover.cover, alt: '', loading: 'lazy', decoding: 'async',
            width: withCover.layout === 'desktop' ? 480 : 360,
            height: withCover.layout === 'desktop' ? 681 : 640
          }) : null,
          name
        ]),
        formats
      ]));
    });
    container.appendChild(list);
  }

  function renderRegionLanguages(node, data, editions) {
    var region = node.getAttribute('data-region-languages');
    var codes = [];
    editions.forEach(function (edition) {
      if (edition.region === region && codes.indexOf(edition.language) === -1) codes.push(edition.language);
    });
    if (!codes.length) return;
    node.textContent = '';
    codes.forEach(function (code) {
      var lang = data.languages[code];
      node.appendChild(el('li', { lang: code, dir: lang.dir || null, title: lang.name, text: lang.nativeName || lang.name }));
    });
  }


  var EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  var LONG_MAILTO = 2000;

  function countWords(text) {
    var trimmed = String(text || '').trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  function plural(n, word) {
    return n + ' ' + word + (n === 1 ? '' : 's');
  }

  function addDescribedBy(input, id) {
    var ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (ids.indexOf(id) === -1) ids.push(id);
    input.setAttribute('aria-describedby', ids.join(' '));
  }

  function removeDescribedBy(input, id) {
    var ids = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== id; });
    if (ids.length) input.setAttribute('aria-describedby', ids.join(' '));
    else input.removeAttribute('aria-describedby');
  }

  function initRequestForm() {
    var form = doc.getElementById('access-form');
    if (!form) return;
    form.noValidate = true;

    var summary = doc.getElementById('error-summary');
    var summaryList = summary.querySelector('.error-summary__list');
    var submitButton = doc.getElementById('prepare-email');
    var submitHint = doc.getElementById('prepare-hint');
    var result = doc.getElementById('request-result');
    var resultText = doc.getElementById('request-text');
    var copyButton = doc.getElementById('copy-request');
    var copyStatus = doc.getElementById('copy-status');
    var reopenLink = doc.getElementById('reopen-email');
    var organisation = doc.getElementById('req-org');
    var counter = doc.getElementById('req-purpose-count');
    var counterLive = doc.getElementById('req-purpose-count-live');
    var counterLimit = doc.getElementById('req-purpose-limit');

    function field(id) {
      return { input: doc.getElementById(id), error: doc.getElementById(id + '-error') };
    }
    var fields = {
      name: field('req-name'),
      email: field('req-email'),
      purpose: field('req-purpose')
    };
    var order = ['name', 'email', 'purpose'];
    var purpose = fields.purpose.input;
    var maxWords = parseInt(purpose.getAttribute('data-max-words'), 10) || 500;

    var liveTimer = null;
    function wordMessage(words) {
      var remaining = maxWords - words;
      return remaining >= 0
        ? 'You have ' + plural(remaining, 'word') + ' remaining'
        : 'You have ' + plural(-remaining, 'word') + ' too many';
    }
    function updateCounter(announce) {
      var words = countWords(purpose.value);
      var message = wordMessage(words);
      counter.textContent = message;
      counter.classList.toggle('is-over', words > maxWords);
      if (liveTimer) window.clearTimeout(liveTimer);
      if (announce) liveTimer = window.setTimeout(function () { counterLive.textContent = message; }, 1000);
    }
    counterLimit.textContent = 'You can enter up to ' + maxWords + ' words.';
    addDescribedBy(purpose, counterLimit.id);
    updateCounter(false);
    purpose.addEventListener('input', function () { updateCounter(true); });

    function values() {
      return {
        name: fields.name.input.value.trim(),
        email: fields.email.input.value.trim(),
        organisation: organisation.value.trim(),
        purpose: purpose.value.trim()
      };
    }

    function check(key, v) {
      if (key === 'name' && !v.name) return 'Enter your name';
      if (key === 'email' && !v.email) return 'Enter your email address';
      if (key === 'email' && !EMAIL_PATTERN.test(v.email)) return 'Enter an email address in the correct format, like name@example.org';
      if (key === 'purpose' && !v.purpose) return 'Tell us briefly how you intend to use the checklists';
      if (key === 'purpose' && countWords(v.purpose) > maxWords) return 'The purpose of your request must be ' + maxWords + ' words or fewer';
      return null;
    }

    function errorsFor(v) {
      var errors = [];
      order.forEach(function (key) {
        var message = check(key, v);
        if (message) errors.push({ key: key, message: message });
      });
      return errors;
    }

    function updateButton() {
      var ready = errorsFor(values()).length === 0;
      if (ready) {
        submitButton.removeAttribute('aria-disabled');
        removeDescribedBy(submitButton, submitHint.id);
      } else {
        submitButton.setAttribute('aria-disabled', 'true');
        addDescribedBy(submitButton, submitHint.id);
      }
      submitHint.hidden = ready;
    }

    function setError(key, message) {
      var f = fields[key];
      var wrapper = f.input.closest('.field');
      if (message) {
        f.error.textContent = '';
        f.error.appendChild(el('span', { class: 'visually-hidden', text: 'Error: ' }));
        f.error.appendChild(doc.createTextNode(message));
        f.error.hidden = false;
        wrapper.classList.add('has-error');
        f.input.setAttribute('aria-invalid', 'true');
        addDescribedBy(f.input, f.error.id);
      } else {
        f.error.textContent = '';
        f.error.hidden = true;
        wrapper.classList.remove('has-error');
        f.input.removeAttribute('aria-invalid');
        removeDescribedBy(f.input, f.error.id);
      }
    }

    function showSummary(errors) {
      summaryList.textContent = '';
      if (!errors.length) {
        summary.hidden = true;
        return;
      }
      errors.forEach(function (item) {
        var input = fields[item.key].input;
        var link = el('a', { href: '#' + input.id, text: item.message });
        link.addEventListener('click', function (event) {
          event.preventDefault();
          try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
          input.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
        });
        summaryList.appendChild(el('li', null, [link]));
      });
      summary.hidden = false;
      try { summary.focus({ preventScroll: true }); } catch (e) { summary.focus(); }
      summary.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
    }

    var attempted = false;

    order.forEach(function (key) {
      var input = fields[key].input;
      var handler = function () {
        updateButton();
        if (!attempted || !input.closest('.field').classList.contains('has-error')) return;
        if (!check(key, values())) setError(key, null);
      };
      input.addEventListener('input', handler);
      input.addEventListener('change', handler);
    });

    function buildEmail(v) {
      var subject = 'Tech Abuse Checklists — Access Request';
      var lines = [
        'Hello Tech Abuse Research team,',
        '',
        'I would like to request access to the Tech Abuse Checklists.',
        '',
        'Name: ' + v.name,
        'Email address: ' + v.email,
        'Organisation or affiliation: ' + (v.organisation || 'Not provided'),
        '',
        'Purpose of request:',
        v.purpose.replace(/\r?\n/g, '\r\n'),
        '',
        'Kind regards,',
        v.name
      ];
      var body = lines.join('\r\n');
      return {
        href: mailtoHref(subject) + '&body=' + encodeURIComponent(body),
        text: 'To: ' + CONTACT_EMAIL + '\r\nSubject: ' + subject + '\r\n\r\n' + body
      };
    }

    function showResult(mail) {
      each(result.querySelectorAll('[data-email-address]'), function (node) { node.textContent = CONTACT_EMAIL; });
      resultText.value = mail.text;
      reopenLink.setAttribute('href', mail.href);
      copyStatus.textContent = '';
      result.hidden = false;
      try { result.focus({ preventScroll: true }); } catch (e) { result.focus(); }
      result.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
      if (mail.href.length > LONG_MAILTO) {
        window.setTimeout(function () {
          copyStatus.textContent = 'Your request is quite long, so some email apps may shorten it. Please check the draft, or copy the text below.';
        }, 150);
      }
    }

    function clearResult() {
      result.hidden = true;
      resultText.value = '';
      copyStatus.textContent = '';
      reopenLink.setAttribute('href', '#request-access');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      attempted = true;
      var v = values();
      var errors = errorsFor(v);
      order.forEach(function (key) { setError(key, check(key, v)); });
      showSummary(errors);
      updateButton();
      if (errors.length) {
        clearResult();
        return;
      }
      var mail = buildEmail(v);
      showResult(mail);
      window.location.href = mail.href;
    });

    form.addEventListener('reset', function () {
      attempted = false;
      order.forEach(function (key) { setError(key, null); });
      showSummary([]);
      clearResult();
      window.setTimeout(function () {
        updateCounter(false);
        counterLive.textContent = '';
        updateButton();
      }, 0);
    });

    form.addEventListener('input', function () { if (!result.hidden) clearResult(); });
    form.addEventListener('change', function () { if (!result.hidden) clearResult(); });

    copyButton.addEventListener('click', function () {
      var text = resultText.value;
      function report(ok) {
        copyStatus.textContent = ok
          ? 'Copied. You can paste it into a new email to ' + CONTACT_EMAIL + '.'
          : 'Copying did not work here. Please select the text below and copy it.';
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { report(true); }, function () { report(fallbackCopy()); });
      } else {
        report(fallbackCopy());
      }
    });

    function fallbackCopy() {
      try {
        resultText.focus();
        resultText.select();
        return doc.execCommand('copy');
      } catch (e) {
        return false;
      }
    }

    updateButton();
  }

  function init() {
    [initQuickExit, initHeader, initMenu, initEmailLinks, initInPageLinks, initHandbook, initScrollSpy, initRequestForm].forEach(function (fn) {
      try { fn(); } catch (error) {
        if (window.console) console.error('Tech Abuse Research: ' + (fn.name || 'init') + ' failed', error);
      }
    });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
