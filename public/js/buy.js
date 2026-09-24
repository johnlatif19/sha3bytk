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
      dir: 'rtl', lang: 'ar', switchLabel: 'EN', themeLabel: 'Dark',
      title: 'Sha3bytk | شراء شعبية',
      tagline: 'بيع • اشتري • شعبيتك',
      back: 'رجوع',
      badge: 'طلب شراء',
      title2: 'اطلب شعبية PUBG',
      sub: 'املأ البيانات التالية بدقة. بعد الإرسال هيتم التواصل معاك على الواتساب لتأكيد الطلب.',
      secBasic: 'البيانات الأساسية',
      secGame: 'بيانات اللعبة',
      secType: 'نوع الشعبية',
      lblName: 'الاسم',
      lblPhone: 'رقم الهاتف / WhatsApp',
      lblGameName: 'الاسم داخل اللعبة',
      lblPubgId: 'PUBG ID',
      typeCard: 'كارت',
      typeMisc: 'متفرقات',
      lblAmount: 'عدد الشعبية المطلوبة',
      lblDetails: 'تفاصيل إضافية',
      lblCardImage: 'صورة الكارت',
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
      errGameName: 'من فضلك أدخل الاسم داخل اللعبة.',
      errPubgId: 'من فضلك أدخل PUBG ID.',
      errType: 'من فضلك اختر نوع الشعبية.',
      errAmount: 'من فضلك أدخل عدد شعبية صحيح.',
      errImage: 'من فضلك ارفع صورة الكارت.',
      errSend: 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.',
      uploading: 'جارٍ رفع الصورة...',
      sending: 'جارٍ إرسال الطلب...',
      reviewName: 'الاسم',
      reviewPhone: 'رقم الهاتف',
      reviewGameName: 'الاسم داخل اللعبة',
      reviewPubgId: 'PUBG ID',
      reviewType: 'نوع الشعبية',
      reviewAmount: 'عدد الشعبية',
      reviewDetails: 'تفاصيل إضافية',
      typeCardVal: 'كارت',
      typeMiscVal: 'متفرقات',
    },
    en: {
      dir: 'ltr', lang: 'en', switchLabel: 'AR', themeLabel: 'Dark',
      title: 'Sha3bytk | Buy Popularity',
      tagline: 'Sell • Buy • Your Popularity',
      back: 'Back',
      badge: 'Buy Request',
      title2: 'Order PUBG Popularity',
      sub: 'Fill the form carefully. After submitting, we will contact you on WhatsApp to confirm.',
      secBasic: 'Basic Information',
      secGame: 'Game Information',
      secType: 'Popularity Type',
      lblName: 'Name',
      lblPhone: 'Phone / WhatsApp',
      lblGameName: 'In-game Name',
      lblPubgId: 'PUBG ID',
      typeCard: 'Card',
      typeMisc: 'Misc',
      lblAmount: 'Requested Popularity Amount',
      lblDetails: 'Extra Details',
      lblCardImage: 'Card Image',
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
      errGameName: 'Please enter your in-game name.',
      errPubgId: 'Please enter your PUBG ID.',
      errType: 'Please choose a popularity type.',
      errAmount: 'Please enter a valid amount.',
      errImage: 'Please upload the card image.',
      errSend: 'Failed to send the order. Please try again.',
      uploading: 'Uploading image...',
      sending: 'Sending order...',
      reviewName: 'Name',
      reviewPhone: 'Phone',
      reviewGameName: 'In-game Name',
      reviewPubgId: 'PUBG ID',
      reviewType: 'Popularity Type',
      reviewAmount: 'Amount',
      reviewDetails: 'Details',
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
    if (btn) {
      btn.textContent = theme === 'dark'
        ? (currentLang === 'ar' ? 'Light' : 'Light')
        : (currentLang === 'ar' ? 'Dark' : 'Dark');
    }
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
      gameName: document.getElementById('gameName').value.trim(),
      pubgId: document.getElementById('pubgId').value.trim(),
      popularityType: typeEl ? typeEl.value : '',
      popularityAmount: document.getElementById('popularityAmount').value.trim(),
      details: document.getElementById('details').value.trim(),
    };
  };

  const validate = () => {
    clearErrs();
    const v = getFormValues();
    let ok = true;

    if (!v.name) { showErr('name', t('errName')); ok = false; }

    const digits = v.phone.replace(/\D/g, '');
    if (!v.phone || digits.length < 8) { showErr('phone', t('errPhone')); ok = false; }

    if (!v.gameName) { showErr('gameName', t('errGameName')); ok = false; }
    if (!v.pubgId) { showErr('pubgId', t('errPubgId')); ok = false; }

    if (!v.popularityType) { showErr('popularityType', t('errType')); ok = false; }

    if (v.popularityType === 'misc') {
      const n = Number(v.popularityAmount);
      if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
        showErr('popularityAmount', t('errAmount'));
        ok = false;
      }
    }

    if (v.popularityType === 'card') {
      if (!currentFile && !uploadedImageUrl) {
        showErr('cardImage', t('errImage'));
        ok = false;
      }
    }

    return ok;
  };

  const toggleTypeFields = () => {
    const typeEl = document.querySelector('input[name="popularityType"]:checked');
    const type = typeEl ? typeEl.value : '';
    const amountField = document.getElementById('amountField');
    const detailsField = document.getElementById('detailsField');
    const cardField = document.getElementById('cardUploadField');

    amountField.hidden = type !== 'misc';
    detailsField.hidden = type !== 'misc';
    cardField.hidden = type !== 'card';

    if (type !== 'misc') {
      document.getElementById('popularityAmount').value = '';
    }
    if (type !== 'card') {
      currentFile = null;
      uploadedImageUrl = '';
      document.getElementById('cardImage').value = '';
      const prev = document.getElementById('cardPreview');
      const img = document.getElementById('cardPreviewImg');
      if (img) img.removeAttribute('src');
      if (prev) prev.hidden = true;
    }
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

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: fd,
    });

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
    rows.push([t('reviewGameName'), v.gameName]);
    rows.push([t('reviewPubgId'), v.pubgId]);
    rows.push([t('reviewType'), typeLabel]);

    if (v.popularityType === 'misc') {
      rows.push([t('reviewAmount'), v.popularityAmount]);
      if (v.details) rows.push([t('reviewDetails'), v.details]);
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
      type: 'buy',
      name: v.name,
      phone: v.phone,
      gameName: v.gameName,
      pubgId: v.pubgId,
      popularityType: v.popularityType,
    };

    if (v.popularityType === 'misc') {
      payload.popularityAmount = Number(v.popularityAmount);
      if (v.details) payload.details = v.details;
    }

    if (v.popularityType === 'card' && imageUrl) {
      payload.cardImageUrl = imageUrl;
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

    document.querySelectorAll('input[name="popularityType"]').forEach((r) => {
      r.addEventListener('change', toggleTypeFields);
    });
    toggleTypeFields();

    const fileInput = document.getElementById('cardImage');
    if (fileInput) fileInput.addEventListener('change', handleFileChange);

    const form = document.getElementById('buyForm');
    if (form) form.addEventListener('submit', (e) => e.preventDefault());

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