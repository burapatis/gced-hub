/* =============================================================
   เข้าใจโลก เข้าใจคน — Main JavaScript (Vanilla JS)
   ครอบคลุม: เมนูมือถือ, โหมดสีอ่อน/เข้ม, ปรับขนาดตัวอักษร, ปุ่มกลับขึ้นบน,
   ตัวกรอง/ค้นหา, สถานการณ์จำลอง, แบบทดสอบ, และฟอร์ม mockup
   ============================================================= */
(function () {
  'use strict';

  /* ---------- เมนูมือถือ ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // ปิดเมนูเมื่อกด Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- โหมดสีอ่อน/เข้ม (Dark mode) ---------- */
  var THEME_KEY = 'gced-theme';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* ใช้งานต่อได้แม้บันทึกไม่สำเร็จ */ }
    return null;
  }

  function updateThemeButton(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', isDark ? 'เปลี่ยนเป็นโหมดสีอ่อน' : 'เปลี่ยนเป็นโหมดสีเข้ม');
    btn.textContent = isDark ? 'โหมดอ่อน' : 'โหมดเข้ม';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton(theme);
  }

  applyTheme(getStoredTheme() || getSystemTheme());

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ใช้งานต่อได้แม้บันทึกไม่สำเร็จ */ }
      applyTheme(next);
    });
  }

  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });
  } catch (e) { /* ไม่รองรับ matchMedia */ }

  /* ---------- ปรับขนาดตัวอักษร (Accessibility) ---------- */
  var FONT_KEY = 'gced-font-size';
  var FONT_STEPS = [16, 18, 20, 22];
  var DEFAULT_STEP = 1; // 18px

  function applyFontStep(step) {
    step = Math.min(Math.max(step, 0), FONT_STEPS.length - 1);
    document.documentElement.style.fontSize = FONT_STEPS[step] + 'px';
    try { localStorage.setItem(FONT_KEY, String(step)); } catch (e) { /* ใช้งานต่อได้แม้บันทึกไม่สำเร็จ */ }
    return step;
  }

  var currentStep = DEFAULT_STEP;
  try {
    var saved = localStorage.getItem(FONT_KEY);
    if (saved !== null && !isNaN(parseInt(saved, 10))) {
      currentStep = applyFontStep(parseInt(saved, 10));
    }
  } catch (e) { /* ไม่มี localStorage ก็ใช้ค่าเริ่มต้น */ }

  var btnInc = document.getElementById('font-increase');
  var btnDec = document.getElementById('font-decrease');
  var btnReset = document.getElementById('font-reset');

  if (btnInc) btnInc.addEventListener('click', function () { currentStep = applyFontStep(currentStep + 1); });
  if (btnDec) btnDec.addEventListener('click', function () { currentStep = applyFontStep(currentStep - 1); });
  if (btnReset) btnReset.addEventListener('click', function () { currentStep = applyFontStep(DEFAULT_STEP); });

  /* ---------- ปุ่มกลับขึ้นด้านบน ---------- */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.hidden = window.scrollY < 400;
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var main = document.getElementById('main-content');
      if (main) main.focus();
    });
  }

  /* ---------- ตัวกรองแบบใช้ซ้ำได้ (คลังทรัพยากร / ห้องเรียน) ---------- */
  function setupFilter(options) {
    var form = document.getElementById(options.formId);
    var grid = document.getElementById(options.gridId);
    var empty = document.getElementById(options.emptyId);
    if (!form || !grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll(options.itemSelector));
    var selects = Array.prototype.slice.call(form.querySelectorAll('select[data-filter-key]'));
    var searchInput = options.searchId ? document.getElementById(options.searchId) : null;
    var status = form.querySelector('.filter-status');

    function matches(item) {
      // ตรวจตามตัวกรองแบบ dropdown
      for (var i = 0; i < selects.length; i++) {
        var key = selects[i].getAttribute('data-filter-key');
        var value = selects[i].value;
        if (!value) continue;
        var itemValue = item.getAttribute('data-' + key) || '';
        if (itemValue.indexOf(value) === -1) return false;
      }
      // ตรวจตามคำค้น (เทียบกับข้อความทั้งการ์ด)
      if (searchInput && searchInput.value.trim()) {
        var q = searchInput.value.trim().toLowerCase();
        if (item.textContent.toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    }

    function applyFilter() {
      var visible = 0;
      items.forEach(function (item) {
        var show = matches(item);
        item.hidden = !show;
        if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
      if (status) {
        status.textContent = 'แสดง ' + visible + ' จาก ' + items.length + ' รายการ';
      }
    }

    selects.forEach(function (sel) { sel.addEventListener('change', applyFilter); });
    if (searchInput) searchInput.addEventListener('input', applyFilter);
    form.addEventListener('submit', function (event) { event.preventDefault(); });

    applyFilter();
  }

  setupFilter({
    formId: 'resource-filter',
    gridId: 'resource-grid',
    emptyId: 'resource-empty',
    itemSelector: '.resource-card',
    searchId: 'resource-search'
  });

  setupFilter({
    formId: 'classroom-filter',
    gridId: 'classroom-grid',
    emptyId: 'classroom-empty',
    itemSelector: '.js-filter-item',
    searchId: null
  });

  /* ---------- ค้นหาทั้งเว็บ (/search/) ---------- */
  var siteSearch = document.getElementById('site-search');
  if (siteSearch) {
    var searchForm = document.getElementById('site-search-form');
    var searchInput = document.getElementById('site-search-input');
    var searchStatus = document.getElementById('site-search-status');
    var searchResults = document.getElementById('site-search-results');
    var searchEmpty = document.getElementById('site-search-empty');
    var searchHint = document.getElementById('site-search-hint');
    var indexData = null;
    var debounceTimer = null;

    function normalize(text) {
      return (text || '').toLowerCase();
    }

    function scoreEntry(entry, query) {
      var q = normalize(query);
      var title = normalize(entry.title);
      var desc = normalize(entry.description);
      var text = normalize(entry.text);
      var section = normalize(entry.sectionTitle);
      var score = 0;
      if (title.indexOf(q) !== -1) score += 10;
      if (desc.indexOf(q) !== -1) score += 6;
      if (section.indexOf(q) !== -1) score += 4;
      if (text.indexOf(q) !== -1) score += 2;
      return score;
    }

    function makeSnippet(text, query) {
      if (!text) return '';
      var lower = text.toLowerCase();
      var q = query.toLowerCase();
      var idx = lower.indexOf(q);
      if (idx === -1) return text.slice(0, 140) + (text.length > 140 ? '…' : '');
      var start = Math.max(0, idx - 50);
      var end = Math.min(text.length, idx + q.length + 90);
      var snippet = text.slice(start, end);
      if (start > 0) snippet = '…' + snippet;
      if (end < text.length) snippet += '…';
      return snippet;
    }

    function renderResults(results, query) {
      if (!searchResults) return;
      searchResults.innerHTML = '';
      results.forEach(function (entry) {
        var article = document.createElement('article');
        article.className = 'search-result';

        var meta = document.createElement('p');
        meta.className = 'search-result-meta';
        meta.innerHTML = '<span class="search-result-badge">' + entry.kind + '</span><span>' + entry.sectionTitle + '</span>';

        var title = document.createElement('h3');
        title.className = 'search-result-title';
        var link = document.createElement('a');
        link.href = entry.url;
        link.textContent = entry.title;
        title.appendChild(link);

        article.appendChild(meta);
        article.appendChild(title);

        if (entry.description) {
          var desc = document.createElement('p');
          desc.className = 'search-result-desc';
          desc.textContent = entry.description;
          article.appendChild(desc);
        }

        var snippet = makeSnippet(entry.text, query);
        if (snippet) {
          var snip = document.createElement('p');
          snip.className = 'search-result-snippet';
          snip.textContent = snippet;
          article.appendChild(snip);
        }

        searchResults.appendChild(article);
      });
    }

    function setStatus(message) {
      if (searchStatus) searchStatus.textContent = message || '';
    }

    function runSearch() {
      if (!searchInput || !indexData) return;
      var query = searchInput.value.trim();
      var params = new URLSearchParams(window.location.search);

      if (query) params.set('q', query);
      else params.delete('q');

      var next = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.replaceState(null, '', next);

      if (!query) {
        if (searchResults) searchResults.hidden = true;
        if (searchEmpty) searchEmpty.hidden = true;
        if (searchHint) searchHint.hidden = false;
        setStatus('');
        return;
      }

      if (searchHint) searchHint.hidden = true;

      var results = indexData
        .map(function (entry) {
          return { entry: entry, score: scoreEntry(entry, query) };
        })
        .filter(function (item) { return item.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .map(function (item) { return item.entry; });

      if (results.length) {
        renderResults(results, query);
        if (searchResults) searchResults.hidden = false;
        if (searchEmpty) searchEmpty.hidden = true;
        setStatus('พบ ' + results.length + ' รายการสำหรับ “' + query + '”');
      } else {
        if (searchResults) searchResults.hidden = true;
        if (searchEmpty) searchEmpty.hidden = false;
        setStatus('ไม่พบผลลัพธ์สำหรับ “' + query + '”');
      }
    }

    function scheduleSearch() {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(runSearch, 220);
    }

    fetch(siteSearch.getAttribute('data-index-url'))
      .then(function (response) {
        if (!response.ok) throw new Error('index load failed');
        return response.json();
      })
      .then(function (data) {
        indexData = data;
        var initial = new URLSearchParams(window.location.search).get('q');
        if (initial && searchInput) {
          searchInput.value = initial;
          runSearch();
        }
      })
      .catch(function () {
        setStatus('ไม่สามารถโหลดดัชนีค้นหาได้ กรุณารีเฟรชหน้าเว็บ');
        if (searchHint) searchHint.hidden = true;
      });

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        runSearch();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', scheduleSearch);
    }
  }

  /* ---------- สถานการณ์จำลอง (Interactive Scenario) ---------- */
  var scenario = document.getElementById('scenario');
  if (scenario) {
    var outcomes = {
      react: 'ผลที่ตามมา: บทสนทนายิ่งร้อนแรงขึ้น และถ้าข่าวไม่จริง เราก็มีส่วนส่งต่อความเข้าใจผิดและความเกลียดชังโดยไม่ตั้งใจ — ลองคิดดูว่ามีทางเลือกอื่นที่ช่วยให้ทุกฝ่ายได้ข้อมูลที่ถูกต้องมากกว่านี้ไหม',
      silent: 'ผลที่ตามมา: ความเงียบช่วยให้เราปลอดภัยชั่วคราว แต่ข่าวที่อาจไม่จริงยังคงแพร่ต่อไป — บางครั้งการตั้งคำถามอย่างสุภาพ เช่น "ข่าวนี้มาจากไหนนะ" ก็ช่วยชะลอความเกลียดชังได้โดยไม่ต้องขัดแย้งกับใคร',
      check: 'ยอดเยี่ยม: การหยุดก่อน ตรวจสอบแหล่งที่มา และชวนคุยอย่างใจเย็น คือหัวใจของการเป็นพลเมืองดิจิทัลที่รับผิดชอบ — เราช่วยให้กลุ่มได้ข้อมูลที่ถูกต้อง โดยยังรักษาความสัมพันธ์กับเพื่อนไว้ได้'
    };

    var resultBox = document.getElementById('scenario-result');
    var resultText = document.getElementById('scenario-result-text');
    var resetBtn = document.getElementById('scenario-reset');
    var optionButtons = Array.prototype.slice.call(scenario.querySelectorAll('.scenario-option'));

    optionButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-outcome');
        if (resultText && outcomes[key]) resultText.textContent = outcomes[key];
        if (resultBox) resultBox.hidden = false;
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (resultBox) resultBox.hidden = true;
        if (optionButtons.length) optionButtons[0].focus();
      });
    }
  }

  /* ---------- แบบทดสอบตนเอง (mockup) ---------- */
  var quiz = document.getElementById('quiz');
  if (quiz) {
    quiz.addEventListener('submit', function (event) {
      event.preventDefault();
      var fieldsets = quiz.querySelectorAll('fieldset');
      var total = fieldsets.length;
      var answered = 0;
      var correct = 0;

      fieldsets.forEach(function (fs) {
        var checked = fs.querySelector('input[type="radio"]:checked');
        if (checked) {
          answered++;
          if (checked.hasAttribute('data-correct')) correct++;
        }
      });

      var result = document.getElementById('quiz-result');
      if (!result) return;

      if (answered < total) {
        result.textContent = 'กรุณาตอบให้ครบทุกข้อก่อนตรวจคำตอบ (ตอบแล้ว ' + answered + '/' + total + ' ข้อ)';
        return;
      }

      if (correct === total) {
        result.textContent = 'เยี่ยมมาก! ตอบถูก ' + correct + '/' + total + ' ข้อ — คุณเข้าใจแนวคิดพื้นฐานของ GCED เป็นอย่างดี';
      } else {
        result.textContent = 'ตอบถูก ' + correct + '/' + total + ' ข้อ — ลองอ่านบทเรียนสั้นด้านบน แล้วกลับมาทำอีกครั้งได้เลย';
      }
    });
  }

  /* ---------- ฟอร์ม mockup (จดหมายข่าว / ชุมชน) ---------- */
  var mockForms = document.querySelectorAll('.js-mock-form');
  mockForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'ขอบคุณครับ/ค่ะ — นี่คือแบบฟอร์มตัวอย่าง ระบบรับข้อมูลจริงจะเปิดใช้งานในระยะถัดไป';
      }
    });
  });

  /* ---------- ปุ่มดาวน์โหลด mockup ---------- */
  var downloadButtons = document.querySelectorAll('.js-download-mock');
  downloadButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var original = btn.textContent;
      btn.textContent = 'ไฟล์จะเปิดให้ดาวน์โหลดเร็ว ๆ นี้';
      btn.disabled = true;
      window.setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 2200);
    });
  });
})();
