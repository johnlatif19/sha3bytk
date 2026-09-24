(() => {
  'use strict';

  const STORAGE_KEY = 'sha3bytk_lang';
  const THEME_KEY = 'sha3bytk_theme';
  const API_BASE = '';

  const PRICE = {
    card: { normal: 120, jahfala: 140 },
    misc: { normal: 10, jahfala: 20 },
    unit: 10000,
    minMisc: 10000,
  };

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
      title: 'Sha3bytk | بيع شعبية',
      tagline: 'بيع • اشتري • شعبيتك',
      back: 'رجوع',
      badge: 'طلب بيع',
      title2: 'بِع شعبيتك',
      sub: 'املأ البيانات التالية بدقة. بعد الإرسال هيتم التواصل معاك على الواتساب لتأكيد الطلب.',
      secBasic: 'البيانات الأساسية',
      secType: 'نوع الشعبية',
      lblName: 'الاسم',
      lblPhone: 'رقم الهاتف / WhatsApp',
      typeCard: 'كارت',
      typeMisc: 'متفرقات',
      lblCardName: 'اسم الكارت',
      lblCardImage: 'صورة الكارت',
      lblAmount: 'عدد الشعبية التي تريد بيعها',
      amountHint: 'الحد الأدنى 10,000 شعبية',
      calcTitle: 'حاسبة الشعبية',
      calcType: 'نوع الشعبية',
      calcKind: 'الفئة',
      calcAmount: 'عدد الشعبية',
      calcAmountHint: 'الحد الأدنى 10,000 شعبية',
      calcCardCount: 'عدد الكروت',
      calcTotal: 'السعر الإجمالي',
      kindNormal: 'عادي',
      kindJahfala: 'جحفلة',
      currency: 'جنيه',
      review: 'مراجعة الطلب',
      reviewTitle: 'راجع بيانات طلبك',
      edit: 'تعديل',
      confirm: 'تأكيد وإرسال',
      successTitle: 'تم استلام طلبك بنجاح',
      successSub: 'رقم الطلب الخاص بك',
      successNote: 'احتفظ برقم الطلب للمتابعة. سيتم التواصل معاك على الواتساب.',
      backHome: 'العودة للرئيسية',
      rights: 'جميع الحقوق محفوظة.',
      errName: 'من فضلك أدخل الاسم.',
      errPhone: 'من فضلك أدخل رقم WhatsApp صحيح.',
      errType: 'من فضلك اختر نوع الشعبية.',
      errCardName: 'من فضلك أدخل اسم الكارت.',
      errImage: 'من فضلك ارفع صورة الكارت.',
      errAmount: 'من فضلك أدخل عدد شعبية صحيح.',
      errMinAmount: 'الحد الأدنى 10,000 شعبية.',
      errSend: 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.',
      uploading: 'جارٍ رفع الصورة...',
      sending: 'جارٍ إرسال الطلب...',
      reviewName: 'الاسم',
      reviewPhone: 'رقم الهاتف',
      reviewType: 'نوع الشعبية',
      reviewCardName: 'اسم الكارت',
      reviewAmount: 'عدد الشعبية',
      typeCardVal: 'كارت',
      typeMiscVal: 'متفرقات',
    },
    en: {
      dir: 'ltr', lang: 'en', switchLabel: 'AR',
      title: 'Sha3bytk | Sell Popularity',
      tagline: 'Sell • Buy • Your Popularity',
      back: 'Back',
      badge: 'Sell Request',
      title2: 'Sell your Popularity',
      sub: 'Fill the form carefully. After submitting, we will contact you on WhatsApp to confirm.',
      secBasic: 'Basic Information',
      secType: 'Popularity Type',
      lblName: 'Name',
      lblPhone: 'Phone / WhatsApp',
      typeCard: 'Card',
      typeMisc: 'Misc',
      lblCardName: 'Card Name',
      lblCardImage: 'Card Image',
      lblAmount: 'Amount of Popularity you want to sell',
      amountHint: 'Minimum is 10,000 popularity',
      calcTitle: 'Popularity Calculator',
      calcType: 'Popularity Type',
      calcKind: 'Category',
      calcAmount: 'Amount',
      calcAmountHint: 'Minimum is 10,000 popularity',
      calcCardCount: 'Number of cards',
      calcTotal: 'Total Price',
      kindNormal: 'Normal',
      kindJahfala: 'Jahfala',
      currency: 'EGP',
      review: 'Review Order',
      reviewTitle: 'Review your order',
      edit: 'Edit',
      confirm: 'Confirm & Send',
      successTitle: 'Order received successfully',
      successSub: 'Your Order ID',
      successNote: 'Keep the Order ID for follow-up. We will contact you on WhatsApp.',
      backHome: 'Back to Home',
      rights: 'All rights reserved.',
      errName: 'Please enter your name.',
      errPhone: 'Please enter a valid WhatsApp number.',
      errType: 'Please choose a popularity type.',
      errCardName: 'Please enter the card name.',
      errImage: 'Please upload the card image.',
      errAmount: 'Please enter a valid amount.',
      errMinAmount: 'Minimum is 10,000 popularity.',
      errSend: 'Failed to send the order. Please try again.',
      uploading: 'Uploading image...',
      sending: 'Sending order...',
      reviewName: 'Name',
      reviewPhone: 'Phone',
      reviewType: 'Popularity Type',
      reviewCardName: 'Card Name',
      reviewAmount: 'Amount',
      typeCardVal: 'Card',
      typeMiscVal: 'Misc',
    },
  };

  let currentLang = 'ar';
  let currentFile = null;
  let uploadedImageUrl = '';

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

    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.textContent = dict.switchLabel;

    const theme = getTheme() === 'dark' ? 'dark' : 'light';
    applyTheme(theme);
    updateCalculator();
  };

  const showErr = (name, msg) => {
    const el = document.querySelector(`[data-err="${name}"]`);
    if (el) el.textContent = msg || '';
  };

  const clearErrs = () => {
    document.querySelectorAll('.err').forEach((el) => (el.textContent = ''));
  };

  const getFormValues = () => {
    const typeEl = document.querySelector('input[name="popularityType"]:checked');
    return {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      popularityType: typeEl ? typeEl.value : '',
      cardName: document.getElementById('cardName').value.trim(),
      popularityAmount: document.getElementById('popularityAmount').value.trim(),
    };
  };

  const toggleTypeFields = () => {
    const typeEl = document.querySelector('input[name="popularityType"]:checked');
    const type = typeEl ? typeEl.value : '';
    const cardFields = document.getElementById('cardFields');
    const miscFields = document.getElementById('miscFields');

    cardFields.hidden = type !== 'card';
    miscFields.hidden = type !== 'misc';

    if (type !== 'card') {
      currentFile = null;
      uploadedImageUrl = '';
      document.getElementById('cardImage').value = '';
      const prev = document.getElementById('cardPreview');
      const img = document.getElementById('cardPreviewImg');
      if (img) img.removeAttribute('src');
      if (prev) prev.hidden = true;
      document.getElementById('cardName').value = '';
    }
    if (type !== 'misc') {
      document.getElementById('popularityAmount').value = '';
    }
  };

  const validate = () => {
    clearErrs();
    const v = getFormValues();
    let ok = true;

    if (!v.name) { showErr('name', t('errName')); ok = false; }

    const digits = v.phone.replace(/\D/g, '');
    if (!v.phone || digits.length < 8) { showErr('phone', t('errPhone')); ok = false; }

    if (!v.popularityType) { showErr('popularityType', t('errType')); ok = false; }

    if (v.popularityType === 'card') {
      if (!v.cardName) { showErr('cardName', t('errCardName')); ok = false; }
      if (!currentFile && !uploadedImageUrl) { showErr('cardImage', t('errImage')); ok = false; }
    }

    if (v.popularityType === 'misc') {
      const n = Number(v.popularityAmount);
      if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
        showErr('popularityAmount', t('errAmount'));
        ok = false;
      } else if (n < PRICE.minMisc) {
        showErr('popularityAmount', t('errMinAmount'));
        ok = false;
      }
    }

    return ok;
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    const prev = document.getElementById('cardPreview');
    const img = document.getElementById('cardPreviewImg');

    if (!file) {
      currentFile = null;
      if (img) img.removeAttribute('src');
      if (prev) prev.hidden = true;
      return;
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showErr('cardImage', 'jpg / jpeg / png / webp فقط');
      e.target.value = '';
      currentFile = null;
      if (img) img.removeAttribute('src');
      if (prev) prev.hidden = true;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showErr('cardImage', '5MB كحد أقصى');
      e.target.value = '';
      currentFile = null;
      if (img) img.removeAttribute('src');
      if (prev) prev.hidden = true;
      return;
    }

    showErr('cardImage', '');
    currentFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (img) img.src = ev.target.result;
      if (prev) prev.hidden = false;
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!currentFile) return uploadedImageUrl;
    const fd = new FormData();
    fd.append('image', currentFile);

    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
    if (!res.ok) {
      let msg = t('errSend');
      try { const j = await res.json(); if (j && j.error) msg = j.error; } catch {}
      throw new Error(msg);
    }
    const data = await res.json();
    uploadedImageUrl = data.url || '';
    return uploadedImageUrl;
  };

  const escapeHtml = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const renderReview = (imageUrl) => {
    const v = getFormValues();
    const typeLabel = v.popularityType === 'card' ? t('typeCardVal') : t('typeMiscVal');

    const rows = [];
    rows.push([t('reviewName'), v.name]);
    rows.push([t('reviewPhone'), v.phone]);
    rows.push([t('reviewType'), typeLabel]);

    if (v.popularityType === 'card') {
      rows.push([t('reviewCardName'), v.cardName]);
    } else {
      rows.push([t('reviewAmount'), v.popularityAmount]);
    }

    const html = rows
      .map(
        ([k, val]) =>
          `<div class="review-row"><span class="review-key">${escapeHtml(k)}</span><span class="review-val">${escapeHtml(val)}</span></div>`
      )
      .join('');

    const imgHtml = imageUrl
      ? `<div class="review-img"><img src="${escapeHtml(imageUrl)}" alt="card" draggable="false" /></div>`
      : '';

    document.getElementById('reviewBody').innerHTML = html + imgHtml;
  };

  const openModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  };

  const closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  };

  const submitOrder = async (imageUrl) => {
    const v = getFormValues();
    const payload = {
      type: 'sale',
      name: v.name,
      phone: v.phone,
      popularityType: v.popularityType,
    };

    if (v.popularityType === 'card') {
      payload.cardName = v.cardName;
      if (imageUrl) payload.cardImageUrl = imageUrl;
    } else {
      payload.popularityAmount = Number(v.popularityAmount);
    }

    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || t('errSend'));
    return data;
  };

  const getCalcType = () => {
    const el = document.querySelector('input[name="calcType"]:checked');
    return el ? el.value : '';
  };

  const getCalcKind = (type) => {
    if (type === 'card') {
      const el = document.querySelector('input[name="calcCardKind"]:checked');
      return el ? el.value : '';
    }
    if (type === 'misc') {
      const el = document.querySelector('input[name="calcMiscKind"]:checked');
      return el ? el.value : '';
    }
    return '';
  };

  const sanitizeIntInput = (input) => {
    let val = input.value;
    if (val.startsWith('-')) val = val.replace(/-/g, '');
    if (val && !/^\d+$/.test(val)) val = val.replace(/[^\d]/g, '');
    input.value = val;
    return val;
  };

  const updateCalculator = () => {
    const cardKindRow = document.getElementById('calcCardKindRow');
    const cardCountRow = document.getElementById('calcCardCountRow');
    const miscKindRow = document.getElementById('calcMiscKindRow');
    const amountRow = document.getElementById('calcAmountRow');
    const resultBox = document.getElementById('calcResult');
    const valueEl = document.getElementById('calcValue');
    if (!resultBox || !valueEl) return;

    const type = getCalcType();
    cardKindRow.hidden = type !== 'card';
    cardCountRow.hidden = type !== 'card';
    miscKindRow.hidden = type !== 'misc';
    amountRow.hidden = type !== 'misc';

    if (type === 'card') {
      const kind = getCalcKind('card');
      const countInput = document.getElementById('calcCardCount');
      const countRaw = countInput.value.trim();
      const count = Number(countRaw);

      if (!kind || !countRaw || !Number.isFinite(count) || count < 1 || !Number.isInteger(count)) {
        resultBox.hidden = true;
        return;
      }

      const total = count * PRICE.card[kind];
      valueEl.textContent = String(Math.round(total * 100) / 100);
      resultBox.hidden = false;
      return;
    }

    if (type === 'misc') {
      const kind = getCalcKind('misc');
      const amountInput = document.getElementById('calcAmount');
      const amountRaw = amountInput.value.trim();
      const amount = Number(amountRaw);

      if (!kind || !amountRaw || !Number.isFinite(amount) || amount < PRICE.minMisc) {
        resultBox.hidden = true;
        return;
      }

      const unitPrice = PRICE.misc[kind];
      const total = (amount / PRICE.unit) * unitPrice;
      valueEl.textContent = String(Math.round(total * 100) / 100);
      resultBox.hidden = false;
      return;
    }

    resultBox.hidden = true;
  };

  const openCalcPanel = () => {
    const panel = document.getElementById('calcPanel');
    if (panel) panel.hidden = false;
  };

  const closeCalcPanel = () => {
    const panel = document.getElementById('calcPanel');
    if (panel) panel.hidden = true;
  };

  const toggleCalcPanel = () => {
    const panel = document.getElementById('calcPanel');
    if (!panel) return;
    panel.hidden = !panel.hidden;
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

    document.querySelectorAll('input[name="popularityType"]').forEach((r) => {
      r.addEventListener('change', toggleTypeFields);
    });
    toggleTypeFields();

    const fileInput = document.getElementById('cardImage');
    if (fileInput) fileInput.addEventListener('change', handleFileChange);

    const form = document.getElementById('saleForm');
    if (form) form.addEventListener('submit', (e) => e.preventDefault());

    const calcFab = document.getElementById('calcFab');
    if (calcFab) calcFab.addEventListener('click', toggleCalcPanel);

    const calcClose = document.getElementById('calcClose');
    if (calcClose) calcClose.addEventListener('click', closeCalcPanel);

    document.querySelectorAll('input[name="calcType"]').forEach((r) => {
      r.addEventListener('change', () => {
        const amountInput = document.getElementById('calcAmount');
        const countInput = document.getElementById('calcCardCount');
        if (amountInput) amountInput.value = '';
        if (countInput) countInput.value = '';
        updateCalculator();
      });
    });

    document.querySelectorAll('input[name="calcCardKind"], input[name="calcMiscKind"]').forEach((r) => {
      r.addEventListener('change', updateCalculator);
    });

    const calcAmount = document.getElementById('calcAmount');
    if (calcAmount) {
      calcAmount.addEventListener('input', () => {
        sanitizeIntInput(calcAmount);
        updateCalculator();
      });
    }

    const calcCardCount = document.getElementById('calcCardCount');
    if (calcCardCount) {
      calcCardCount.addEventListener('input', () => {
        sanitizeIntInput(calcCardCount);
        updateCalculator();
      });
    }

    const popularityAmount = document.getElementById('popularityAmount');
    if (popularityAmount) {
      popularityAmount.addEventListener('input', () => {
        sanitizeIntInput(popularityAmount);
      });
    }

    document.addEventListener('click', (e) => {
      const panel = document.getElementById('calcPanel');
      const fab = document.getElementById('calcFab');
      if (!panel || panel.hidden) return;
      if (panel.contains(e.target) || (fab && fab.contains(e.target))) return;
      closeCalcPanel();
    });

    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) {
      reviewBtn.addEventListener('click', async () => {
        if (!validate()) return;
        reviewBtn.disabled = true;
        const original = reviewBtn.textContent;
        try {
          if (currentFile) {
            reviewBtn.textContent = t('uploading');
            await uploadImage();
          }
          renderReview(uploadedImageUrl);
          openModal('reviewModal');
        } catch (err) {
          alert(err.message || t('errSend'));
        } finally {
          reviewBtn.disabled = false;
          reviewBtn.textContent = original;
        }
      });
    }

    const modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click', () => closeModal('reviewModal'));

    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.addEventListener('click', () => closeModal('reviewModal'));

    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        const original = confirmBtn.textContent;
        confirmBtn.textContent = t('sending');
        try {
          const data = await submitOrder(uploadedImageUrl);
          closeModal('reviewModal');
          const idBox = document.getElementById('orderIdBox');
          if (idBox) idBox.textContent = `#${data.orderId || 'PUB-000000'}`;
          openModal('successModal');
        } catch (err) {
          alert(err.message || t('errSend'));
        } finally {
          confirmBtn.disabled = false;
          confirmBtn.textContent = original;
        }
      });
    }

    document.querySelectorAll('.modal').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m && m.id === 'reviewModal') closeModal('reviewModal');
      });
    });
  });
})();