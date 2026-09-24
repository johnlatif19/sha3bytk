(() => {
  'use strict';

  const STORAGE_KEY = 'sha3bytk_lang';
  const THEME_KEY = 'sha3bytk_theme';

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
      title: 'Sha3bytk | بيع وشراء شعبية PUBG',
      tagline: 'بيع • اشتري • شعبيتك',
      badge: 'منصة شعبية PUBG',
      heroTitle: 'منصة بيع وشراء شعبية PUBG',
      heroSub:
        'اختر ما تريد: شراء شعبية من الإدارة، أو بيع شعبيتك للإدارة. كل الطلبات بتوصل مباشرة ويتم التواصل معاك على واتساب.',
      buyTag: 'شراء',
      buyTitle: 'أريد شراء شعبية',
      buyDesc:
        'اطلب شعبية كارت أو متفرقات، وحدد الكمية والتفاصيل، وهيتم التواصل معاك لتأكيد الطلب.',
      buyBtn: 'انتقل لصفحة الشراء',
      saleTag: 'بيع',
      saleTitle: 'أريد بيع شعبية',
      saleDesc:
        'بِع شعبيتك كارت أو متفرقات، وفيه حاسبة سعر تجيبلك السعر فوراً قبل ما تبعت الطلب.',
      saleBtn: 'انتقل لصفحة البيع',
      warrantyTag: 'ضمانات',
      warrantyTitle: 'الضمانات',
      warrantyDesc:
        'تصفح كل صور الضمانات السابقة الموثقة، واضغط على أي صورة لعرضها بحجم أكبر.',
      warrantyBtn: 'انتقل لصفحة الضمانات',
      f1Title: 'طلبات مباشرة',
      f1Desc: 'كل طلب بيوصل للإدارة فوراً برقم فريد للمتابعة.',
      f2Title: 'تواصل واتساب',
      f2Desc: 'التواصل معاك على رقم الواتساب اللي بتسجله في الطلب.',
      f3Title: 'حاسبة سعر',
      f3Desc: 'احسب سعر شعبيتك (كارت أو متفرقات) قبل البيع.',
      rights: 'جميع الحقوق محفوظة.',
    },
    en: {
      dir: 'ltr', lang: 'en', switchLabel: 'AR',
      title: 'Sha3bytk | Buy & Sell PUBG Popularity',
      tagline: 'Sell • Buy • Your Popularity',
      badge: 'PUBG Popularity Platform',
      heroTitle: 'Buy and Sell PUBG Popularity',
      heroSub:
        'Choose what you need: buy popularity from the admin, or sell your own popularity to us. Every request is received instantly and we contact you on WhatsApp.',
      buyTag: 'BUY',
      buyTitle: 'I want to buy popularity',
      buyDesc:
        'Order card or misc popularity, set the amount and details, and we will contact you to confirm.',
      buyBtn: 'Go to Buy page',
      saleTag: 'SELL',
      saleTitle: 'I want to sell popularity',
      saleDesc:
        'Sell your card or misc popularity — with a built-in price calculator before you submit.',
      saleBtn: 'Go to Sell page',
      warrantyTag: 'WARRANTY',
      warrantyTitle: 'Warranty Images',
      warrantyDesc:
        'Browse all previously documented warranty images. Click any image to view it larger.',
      warrantyBtn: 'Go to Warranty page',
      f1Title: 'Direct requests',
      f1Desc: 'Every order reaches the admin instantly with a unique ID.',
      f2Title: 'WhatsApp contact',
      f2Desc: 'We reach out on the WhatsApp number you provide.',
      f3Title: 'Price calculator',
      f3Desc: 'Calculate your popularity price (card or misc) before selling.',
      rights: 'All rights reserved.',
    },
  };

  let currentLang = 'ar';

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

    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = dict.switchLabel;

    const theme = getTheme() === 'dark' ? 'dark' : 'light';
    applyTheme(theme);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const storedLang = getStored() === 'en' ? 'en' : 'ar';
    applyLang(storedLang);

    const storedTheme = getTheme() === 'dark' ? 'dark' : 'light';
    applyTheme(storedTheme);

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
  });
})();
