(() => {
  'use strict';

  const STORAGE_KEY = 'sha3bytk_lang';
  const THEME_KEY = 'sha3bytk_theme';
  const API_BASE = '';

  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    const k = (e.key || '').toLowerCase();
    if (k === 'f12') { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) { e.preventDefault(); return false; }
    if (e.ctrlKey && ['u', 's', 'p'].includes(k)) { e.preventDefault(); return false; }
    if (e.metaKey && e.altKey && ['i', 'j', 'c'].includes(k)) { e.preventDefault(); return false; }
  });

  const I18N = {
    ar: {
      dir: 'rtl', lang: 'ar', switchLabel: 'EN',
      title: 'Sha3bytk | صور الضمان',
      tagline: 'بيع • اشتري • شعبيتك',
      back: 'رجوع',
      badge: 'سجل الضمانات',
      title2: 'صور الضمان',
      sub: 'كل صور الضمانات السابقة التي تم توثيقها. اضغط على أي صورة لعرضها بحجم أكبر.',
      searchPh: 'ابحث بالعنوان أو الملاحظة',
      refresh: 'تحديث',
      empty: 'لا توجد صور بعد',
      loading: 'جارٍ التحميل...',
      imagePreview: 'معاينة الصورة',
      loadFailed: 'فشل تحميل الصور. حاول مرة أخرى.',
      noTitle: 'بدون عنوان',
      rights: 'جميع الحقوق محفوظة.',
    },
    en: {
      dir: 'ltr', lang: 'en', switchLabel: 'AR',
      title: 'Sha3bytk | Warranty Images',
      tagline: 'Sell • Buy • Your Popularity',
      back: 'Back',
      badge: 'Warranty Archive',
      title2: 'Warranty Images',
      sub: 'All previously documented warranty images. Click any image to view it larger.',
      searchPh: 'Search by title or note',
      refresh: 'Refresh',
      empty: 'No images yet',
      loading: 'Loading...',
      imagePreview: 'Image preview',
      loadFailed: 'Failed to load images. Please try again.',
      noTitle: 'Untitled',
      rights: 'All rights reserved.',
    },
  };

  let currentLang = 'ar';
  let itemsCache = [];

  const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || key;

  const getStored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
  const setStored = (lang) => { try { localStorage.setItem(STORAGE_KEY, lang); } catch {} };

  const getTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
  const setTheme = (theme) => { try { localStorage.setItem(THEME_KEY, theme); } catch {} };

  const applyTheme = (theme) => {
    const html = document.documentElement;
    if (theme === 'dark') html.setAttribute('data-theme', 'dark');
    else html.removeAttribute('data-theme');

    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
  };

  const applyLang = (lang) => {
    currentLang = lang === 'en' ? 'en' : 'ar';
    const dict = I18N[currentLang];
    const html = document.documentElement;
    html.setAttribute('lang', dict.lang);
    html.setAttribute('dir', dict.dir);
    document.title = dict.title;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = dict.switchLabel;

    const theme = getTheme() === 'dark' ? 'dark' : 'light';
    applyTheme(theme);

    renderGrid();
  };

  const escapeHtml = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const escapeAttr = (s) => escapeHtml(s).replace(/`/g, '&#96;');

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      const pad = (n) => String(n).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    } catch {
      return '';
    }
  };

  const loadImages = async () => {
    const loader = document.getElementById('loader');
    const empty = document.getElementById('empty');
    if (loader) loader.hidden = false;
    if (empty) empty.hidden = true;

    try {
      const res = await fetch(`${API_BASE}/api/warranty`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'failed');

      itemsCache = Array.isArray(data.items) ? data.items : [];
      renderGrid();
    } catch (err) {
      itemsCache = [];
      alert(t('loadFailed'));
      renderGrid();
    } finally {
      if (loader) loader.hidden = true;
    }
  };

  const filteredItems = () => {
    const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    if (!q) return itemsCache;

    return itemsCache.filter((it) => {
      const hay = [it.title, it.note].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  };

  const renderGrid = () => {
    const grid = document.getElementById('grid');
    const empty = document.getElementById('empty');
    if (!grid) return;

    const items = filteredItems();

    grid.innerHTML = items
      .map((it) => {
        const title = it.title && it.title.trim() ? it.title : t('noTitle');
        const note = it.note && it.note.trim() ? it.note : '';
        const date = formatDate(it.createdAt);

        return `
          <div class="card" data-open="${escapeAttr(it.id || '')}">
            <div class="card-thumb">
              <img src="${escapeAttr(it.imageUrl || '')}" alt="warranty" loading="lazy" draggable="false" />
            </div>
            <div class="card-body">
              <div class="card-title">${escapeHtml(title)}</div>
              ${note ? `<div class="card-note">${escapeHtml(note)}</div>` : ''}
              ${date ? `<div class="card-date">${escapeHtml(date)}</div>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    if (empty) empty.hidden = items.length !== 0;
  };

  const openModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  };

  const closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  };

  const showImage = (item) => {
    if (!item) return;

    const img = document.getElementById('imgLarge');
    const title = document.getElementById('imgTitle');
    const note = document.getElementById('imgNote');
    const date = document.getElementById('imgDate');

    if (img) img.src = item.imageUrl || '';
    if (title) title.textContent = item.title && item.title.trim() ? item.title : t('noTitle');

    if (note) {
      if (item.note && item.note.trim()) {
        note.textContent = item.note;
        note.hidden = false;
      } else {
        note.textContent = '';
        note.hidden = true;
      }
    }

    if (date) {
      const d = formatDate(item.createdAt);
      date.textContent = d || '';
    }

    openModal('imgModal');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    applyLang(getStored() === 'en' ? 'en' : 'ar');
    applyTheme(getTheme() === 'dark' ? 'dark' : 'light');

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const now = document.documentElement.getAttribute('lang') === 'ar' ? 'en' : 'ar';
        applyLang(now);
        setStored(now);
      });
    }

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        setTheme(next);
      });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', renderGrid);

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', loadImages);

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const card = target.closest('[data-open]');
      if (card) {
        const id = card.getAttribute('data-open');
        const item = itemsCache.find((it) => it.id === id);
        if (item) showImage(item);
      }
    });

    const imgClose = document.getElementById('imgClose');
    if (imgClose) imgClose.addEventListener('click', () => closeModal('imgModal'));

    document.querySelectorAll('.modal').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.hidden = true;
      });
    });

    loadImages();
  });
})();
