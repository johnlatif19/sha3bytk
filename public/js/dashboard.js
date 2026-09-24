(() => {
  'use strict';

  const STORAGE_KEY = 'sha3bytk_lang';
  const THEME_KEY = 'sha3bytk_theme';
  const TOKEN_KEY = 'sha3bytk_token';
  const API_BASE = '';

  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') e.preventDefault();
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
      title: 'Sha3bytk | لوحة التحكم',
      tagline: 'بيع • اشتري • شعبيتك',
      siteBtn: 'الموقع',
      navBuy: 'شراء',
      navSale: 'بيع',
      navWarranty: 'صور ضمان',
      warrantyPageBtn: 'صور الضمان',
      logout: 'خروج',
      badge: 'لوحة الإدارة',
      title2: 'إدارة الطلبات',
      sub: 'تابع كل طلبات البيع والشراء وحدّث حالاتها.',
      statTotal: 'إجمالي الطلبات',
      statBuy: 'طلبات الشراء',
      statSale: 'طلبات البيع',
      statPending: 'قيد الانتظار',
      statCompleted: 'مكتملة',
      searchPh: 'ابحث بالاسم / الهاتف / رقم الطلب',
      filterAll: 'كل الحالات',
      refresh: 'تحديث',
      tabBuy: 'طلبات الشراء',
      tabSale: 'طلبات البيع',
      thId: 'الطلب',
      thName: 'الاسم',
      thGameName: 'اسم اللعبة',
      thPubgId: 'PUBG ID',
      thPhone: 'الهاتف',
      thAmount: 'الكمية',
      thType: 'النوع',
      thCardName: 'اسم الكارت',
      thStatus: 'الحالة',
      thDate: 'التاريخ',
      thActions: 'إجراءات',
      empty: 'لا توجد طلبات',
      view: 'عرض',
      delete: 'حذف',
      deleteConfirm: 'هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع.',
      deleted: 'تم حذف الطلب بنجاح',
      deleteFailed: 'فشل حذف الطلب',
      detailsTitle: 'تفاصيل الطلب',
      changeStatus: 'تغيير الحالة',
      save: 'حفظ',
      imagePreview: 'معاينة الصورة',
      statusPending: 'قيد الانتظار',
      statusProcessing: 'قيد المعالجة',
      statusCompleted: 'مكتمل',
      statusCancelled: 'ملغي',
      typeCard: 'كارت',
      typeMisc: 'متفرقات',
      orderId: 'رقم الطلب',
      orderType: 'نوع الطلب',
      buyerType: 'شراء',
      sellerType: 'بيع',
      details: 'تفاصيل إضافية',
      noData: '—',
      updated: 'تم تحديث حالة الطلب',
      updateFailed: 'فشل تحديث الطلب',
      loadFailed: 'فشل تحميل الطلبات',
      unauthorized: 'انتهت الجلسة. من فضلك سجّل الدخول مرة أخرى.',
      logoutConfirm: 'هل تريد تسجيل الخروج؟',
      rights: 'جميع الحقوق محفوظة.',

      warrantyTitle: 'صور الضمان',
      warrantySub: 'ارفع صور الضمانات هنا لتظهر في صفحة الضمانات العامة.',
      warrantyFieldTitle: 'العنوان (اختياري)',
      warrantyFieldNote: 'ملاحظة (اختياري)',
      warrantyFieldImages: 'الصور (حتى 10 صور)',
      warrantyHint: 'الحد الأقصى 5MB لكل صورة',
      warrantyUpload: 'رفع الصور',
      warrantyUploading: 'جارٍ الرفع...',
      warrantySearchPh: 'ابحث في صور الضمان',
      warrantyEmpty: 'لا توجد صور ضمان بعد',
      warrantyUploadOk: 'تم رفع الصور بنجاح',
      warrantyUploadFail: 'فشل رفع الصور. حاول مرة أخرى.',
      warrantyNoFiles: 'من فضلك اختر صورة واحدة على الأقل.',
      warrantyDeleteConfirm: 'هل أنت متأكد من حذف هذه الصورة؟',
      warrantyDeleted: 'تم حذف الصورة بنجاح',
      warrantyDeleteFailed: 'فشل حذف الصورة',
      warrantyLoadFail: 'فشل تحميل صور الضمان',
      warrantyNoTitle: 'بدون عنوان',
    },
    en: {
      dir: 'ltr', lang: 'en', switchLabel: 'AR',
      title: 'Sha3bytk | Dashboard',
      tagline: 'Sell • Buy • Your Popularity',
      siteBtn: 'Site',
      navBuy: 'Buy',
      navSale: 'Sell',
      navWarranty: 'Warranty',
      warrantyPageBtn: 'Warranty Images',
      logout: 'Logout',
      badge: 'Admin Panel',
      title2: 'Orders Management',
      sub: 'Track all buy and sell orders and update their statuses.',
      statTotal: 'Total Orders',
      statBuy: 'Buy Orders',
      statSale: 'Sale Orders',
      statPending: 'Pending',
      statCompleted: 'Completed',
      searchPh: 'Search by name / phone / order ID',
      filterAll: 'All statuses',
      refresh: 'Refresh',
      tabBuy: 'Buy Orders',
      tabSale: 'Sale Orders',
      thId: 'ID',
      thName: 'Name',
      thGameName: 'In-game Name',
      thPubgId: 'PUBG ID',
      thPhone: 'Phone',
      thAmount: 'Amount',
      thType: 'Type',
      thCardName: 'Card Name',
      thStatus: 'Status',
      thDate: 'Date',
      thActions: 'Actions',
      empty: 'No orders found',
      view: 'View',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this order? This cannot be undone.',
      deleted: 'Order deleted successfully',
      deleteFailed: 'Failed to delete the order',
      detailsTitle: 'Order Details',
      changeStatus: 'Change status',
      save: 'Save',
      imagePreview: 'Image preview',
      statusPending: 'Pending',
      statusProcessing: 'Processing',
      statusCompleted: 'Completed',
      statusCancelled: 'Cancelled',
      typeCard: 'Card',
      typeMisc: 'Misc',
      orderId: 'Order ID',
      orderType: 'Order Type',
      buyerType: 'Buy',
      sellerType: 'Sell',
      details: 'Details',
      noData: '—',
      updated: 'Order status updated',
      updateFailed: 'Failed to update order',
      loadFailed: 'Failed to load orders',
      unauthorized: 'Session expired. Please sign in again.',
      logoutConfirm: 'Do you want to logout?',
      rights: 'All rights reserved.',

      warrantyTitle: 'Warranty Images',
      warrantySub: 'Upload warranty images here to show them on the public warranty page.',
      warrantyFieldTitle: 'Title (optional)',
      warrantyFieldNote: 'Note (optional)',
      warrantyFieldImages: 'Images (up to 10)',
      warrantyHint: 'Max 5MB per image',
      warrantyUpload: 'Upload images',
      warrantyUploading: 'Uploading...',
      warrantySearchPh: 'Search warranty images',
      warrantyEmpty: 'No warranty images yet',
      warrantyUploadOk: 'Images uploaded successfully',
      warrantyUploadFail: 'Failed to upload images. Please try again.',
      warrantyNoFiles: 'Please select at least one image.',
      warrantyDeleteConfirm: 'Are you sure you want to delete this image?',
      warrantyDeleted: 'Image deleted successfully',
      warrantyDeleteFailed: 'Failed to delete the image',
      warrantyLoadFail: 'Failed to load warranty images',
      warrantyNoTitle: 'Untitled',
    },
  };

  let currentLang = 'ar';
  let ordersCache = [];
  let warrantyCache = [];
  let activeTab = 'buy';
  let currentOrderId = null;

  const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || key;

  const getStored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
  const setStored = (lang) => { try { localStorage.setItem(STORAGE_KEY, lang); } catch {} };

  const getTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
  const setTheme = (theme) => { try { localStorage.setItem(THEME_KEY, theme); } catch {} };

  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
  const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} };

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

    renderAll();
    renderWarranty();
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
    if (!iso) return t('noData');
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return t('noData');
      const pad = (n) => String(n).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    } catch {
      return t('noData');
    }
  };

  const statusLabel = (s) => {
    if (s === 'pending') return t('statusPending');
    if (s === 'processing') return t('statusProcessing');
    if (s === 'completed') return t('statusCompleted');
    if (s === 'cancelled') return t('statusCancelled');
    return s || t('noData');
  };

  const typeLabel = (v) => {
    if (v === 'card') return t('typeCard');
    if (v === 'misc') return t('typeMisc');
    return t('noData');
  };

  const statusBadge = (s) => {
    const safe = ['pending', 'processing', 'completed', 'cancelled'].includes(s) ? s : 'pending';
    return `<span class="badge badge-${safe}">${escapeHtml(statusLabel(safe))}</span>`;
  };

  const apiFetch = async (path, options = {}) => {
    const token = getToken();
    const headers = Object.assign(
      {},
      options.headers || {},
      token ? { Authorization: `Bearer ${token}` } : {}
    );

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
      clearToken();
      alert(t('unauthorized'));
      window.location.replace('/login');
      throw new Error('Unauthorized');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  /* ============ Orders ============ */
  const loadOrders = async () => {
    try {
      const data = await apiFetch('/api/admin/orders');
      ordersCache = Array.isArray(data.orders) ? data.orders : [];
      renderAll();
    } catch (err) {
      if (err.message !== 'Unauthorized') alert(t('loadFailed'));
    }
  };

  const updateStats = () => {
    const total = ordersCache.length;
    const buy = ordersCache.filter((o) => o.type === 'buy').length;
    const sale = ordersCache.filter((o) => o.type === 'sale').length;
    const pending = ordersCache.filter((o) => o.status === 'pending').length;
    const completed = ordersCache.filter((o) => o.status === 'completed').length;

    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v); };
    set('statTotal', total);
    set('statBuy', buy);
    set('statSale', sale);
    set('statPending', pending);
    set('statCompleted', completed);
  };

  const filteredOrders = (type) => {
    const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    const status = document.getElementById('statusFilter')?.value || '';

    return ordersCache.filter((o) => {
      if (o.type !== type) return false;
      if (status && o.status !== status) return false;
      if (!q) return true;

      const hay = [
        o.id, o.name, o.phone, o.gameName, o.pubgId, o.cardName,
      ].filter(Boolean).join(' ').toLowerCase();

      return hay.includes(q);
    });
  };

  const actionButtons = (id) => `
    <button type="button" class="view-btn" data-view="${escapeAttr(id)}">
      ${escapeHtml(t('view'))}
    </button>
    <button type="button" class="del-btn" data-del="${escapeAttr(id)}">
      ${escapeHtml(t('delete'))}
    </button>
  `;

  const renderBuyTable = () => {
    const body = document.getElementById('buyBody');
    const empty = document.getElementById('buyEmpty');
    if (!body) return;

    const rows = filteredOrders('buy');
    body.innerHTML = rows
      .map((o) => {
        const amount = o.popularityType === 'misc'
          ? (o.popularityAmount != null ? String(o.popularityAmount) : t('noData'))
          : t('noData');

        return `
          <tr>
            <td class="cell-id">#${escapeHtml(o.id || '')}</td>
            <td class="cell-strong">${escapeHtml(o.name || t('noData'))}</td>
            <td>${escapeHtml(o.gameName || t('noData'))}</td>
            <td>${escapeHtml(o.pubgId || t('noData'))}</td>
            <td class="cell-muted">${escapeHtml(o.phone || t('noData'))}</td>
            <td>${escapeHtml(amount)}</td>
            <td>${escapeHtml(typeLabel(o.popularityType))}</td>
            <td>${statusBadge(o.status)}</td>
            <td class="cell-muted">${escapeHtml(formatDate(o.createdAt))}</td>
            <td class="cell-actions">${actionButtons(o.id || '')}</td>
          </tr>
        `;
      })
      .join('');

    if (empty) empty.hidden = rows.length !== 0;
  };

  const renderSaleTable = () => {
    const body = document.getElementById('saleBody');
    const empty = document.getElementById('saleEmpty');
    if (!body) return;

    const rows = filteredOrders('sale');
    body.innerHTML = rows
      .map((o) => {
        const amount = o.popularityType === 'misc'
          ? (o.popularityAmount != null ? String(o.popularityAmount) : t('noData'))
          : t('noData');

        return `
          <tr>
            <td class="cell-id">#${escapeHtml(o.id || '')}</td>
            <td class="cell-strong">${escapeHtml(o.name || t('noData'))}</td>
            <td class="cell-muted">${escapeHtml(o.phone || t('noData'))}</td>
            <td>${escapeHtml(typeLabel(o.popularityType))}</td>
            <td>${escapeHtml(o.cardName || t('noData'))}</td>
            <td>${escapeHtml(amount)}</td>
            <td>${statusBadge(o.status)}</td>
            <td class="cell-muted">${escapeHtml(formatDate(o.createdAt))}</td>
            <td class="cell-actions">${actionButtons(o.id || '')}</td>
          </tr>
        `;
      })
      .join('');

    if (empty) empty.hidden = rows.length !== 0;
  };

  const renderAll = () => {
    updateStats();
    renderBuyTable();
    renderSaleTable();
  };

  const openModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  };

  const closeModal = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  };

  const buildDetailRows = (pairs) =>
    pairs
      .map(
        ([k, v]) =>
          `<div class="detail-row"><span class="detail-key">${escapeHtml(k)}</span><span class="detail-val">${escapeHtml(v == null || v === '' ? t('noData') : String(v))}</span></div>`
      )
      .join('');

  const showDetails = (order) => {
    if (!order) return;
    currentOrderId = order.id || null;

    const pairs = [];
    pairs.push([t('orderId'), '#' + (order.id || '')]);
    pairs.push([t('orderType'), order.type === 'buy' ? t('buyerType') : t('sellerType')]);
    pairs.push([t('thName'), order.name]);
    pairs.push([t('thPhone'), order.phone]);

    if (order.type === 'buy') {
      pairs.push([t('thGameName'), order.gameName]);
      pairs.push([t('thPubgId'), order.pubgId]);
      pairs.push([t('thType'), typeLabel(order.popularityType)]);
      if (order.popularityType === 'misc') {
        pairs.push([t('thAmount'), order.popularityAmount]);
        if (order.details) pairs.push([t('details'), order.details]);
      }
    } else if (order.type === 'sale') {
      pairs.push([t('thType'), typeLabel(order.popularityType)]);
      if (order.popularityType === 'card') {
        pairs.push([t('thCardName'), order.cardName]);
      } else {
        pairs.push([t('thAmount'), order.popularityAmount]);
      }
    }

    pairs.push([t('thStatus'), statusLabel(order.status)]);
    pairs.push([t('thDate'), formatDate(order.createdAt)]);

    const html =
      buildDetailRows(pairs) +
      (order.cardImageUrl
        ? `<div class="detail-img"><img src="${escapeAttr(order.cardImageUrl)}" alt="card" data-zoom="${escapeAttr(order.cardImageUrl)}" draggable="false" /></div>`
        : '');

    const body = document.getElementById('detailsBody');
    if (body) body.innerHTML = html;

    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect) {
      statusSelect.value = ['pending', 'processing', 'completed', 'cancelled'].includes(order.status)
        ? order.status
        : 'pending';
    }

    openModal('detailsModal');
  };

  const saveStatus = async () => {
    if (!currentOrderId) return;
    const select = document.getElementById('statusSelect');
    const btn = document.getElementById('saveStatusBtn');
    if (!select || !btn) return;

    const status = select.value;
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = '...';

    try {
      await apiFetch(`/api/admin/orders/${encodeURIComponent(currentOrderId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });

      const idx = ordersCache.findIndex((o) => o.id === currentOrderId);
      if (idx !== -1) ordersCache[idx].status = status;

      renderAll();
      closeModal('detailsModal');
      alert(t('updated'));
    } catch (err) {
      if (err.message !== 'Unauthorized') alert(t('updateFailed'));
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  };

  const deleteOrder = async (orderId) => {
    if (!orderId) return;
    if (!confirm(t('deleteConfirm'))) return;

    try {
      await apiFetch(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
      });

      ordersCache = ordersCache.filter((o) => o.id !== orderId);
      renderAll();
      alert(t('deleted'));
    } catch (err) {
      if (err.message !== 'Unauthorized') alert(t('deleteFailed'));
    }
  };

  /* ============ Warranty ============ */
  const loadWarranty = async () => {
    try {
      const data = await apiFetch('/api/warranty');
      warrantyCache = Array.isArray(data.items) ? data.items : [];
      renderWarranty();
    } catch (err) {
      if (err.message !== 'Unauthorized') alert(t('warrantyLoadFail'));
    }
  };

  const filteredWarranty = () => {
    const q = (document.getElementById('warrantySearchInput')?.value || '').trim().toLowerCase();
    if (!q) return warrantyCache;

    return warrantyCache.filter((it) => {
      const hay = [it.title, it.note].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  };

  const renderWarranty = () => {
    const grid = document.getElementById('warrantyGrid');
    const empty = document.getElementById('warrantyEmpty');
    if (!grid) return;

    const items = filteredWarranty();

    grid.innerHTML = items
      .map((it) => {
        const title = it.title && it.title.trim() ? it.title : t('warrantyNoTitle');
        const note = it.note && it.note.trim() ? it.note : '';
        const date = it.createdAt ? formatDate(it.createdAt) : '';

        return `
          <div class="warranty-card">
            <div class="warranty-thumb" data-wzoom="${escapeAttr(it.imageUrl || '')}">
              <img src="${escapeAttr(it.imageUrl || '')}" alt="warranty" loading="lazy" draggable="false" />
            </div>
            <div class="warranty-body">
              <div class="warranty-title">${escapeHtml(title)}</div>
              ${note ? `<div class="warranty-note">${escapeHtml(note)}</div>` : ''}
              ${date ? `<div class="warranty-date">${escapeHtml(date)}</div>` : ''}
            </div>
            <div class="warranty-actions-row">
              <button type="button" class="del-btn" data-wdel="${escapeAttr(it.id || '')}">
                ${escapeHtml(t('delete'))}
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    if (empty) empty.hidden = items.length !== 0;
  };

  const uploadWarranty = async (e) => {
    e.preventDefault();

    const input = document.getElementById('warrantyImages');
    const titleInput = document.getElementById('warrantyTitle');
    const noteInput = document.getElementById('warrantyNote');
    const btn = document.getElementById('warrantyUploadBtn');
    const msg = document.getElementById('warrantyMsg');

    if (!input || !input.files || input.files.length === 0) {
      if (msg) {
        msg.textContent = t('warrantyNoFiles');
        msg.classList.remove('success');
        msg.classList.add('error');
      }
      return;
    }

    const fd = new FormData();
    for (const f of input.files) fd.append('images', f);
    if (titleInput && titleInput.value.trim()) fd.append('title', titleInput.value.trim());
    if (noteInput && noteInput.value.trim()) fd.append('note', noteInput.value.trim());

    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = t('warrantyUploading');
    if (msg) {
      msg.textContent = '';
      msg.classList.remove('success', 'error');
    }

    try {
      await apiFetch('/api/admin/warranty', {
        method: 'POST',
        body: fd,
      });

      input.value = '';
      if (titleInput) titleInput.value = '';
      if (noteInput) noteInput.value = '';

      if (msg) {
        msg.textContent = t('warrantyUploadOk');
        msg.classList.remove('error');
        msg.classList.add('success');
      }

      await loadWarranty();
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        if (msg) {
          msg.textContent = err.message || t('warrantyUploadFail');
          msg.classList.remove('success');
          msg.classList.add('error');
        }
      }
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  };

  const deleteWarranty = async (id) => {
    if (!id) return;
    if (!confirm(t('warrantyDeleteConfirm'))) return;

    try {
      await apiFetch(`/api/admin/warranty/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      warrantyCache = warrantyCache.filter((it) => it.id !== id);
      renderWarranty();
      alert(t('warrantyDeleted'));
    } catch (err) {
      if (err.message !== 'Unauthorized') alert(t('warrantyDeleteFailed'));
    }
  };

  /* ============ Events ============ */
  const bindEvents = () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

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

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm(t('logoutConfirm'))) {
          clearToken();
          window.location.replace('/login');
        }
      });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', renderAll);

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.addEventListener('change', renderAll);

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', loadOrders);

    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        if (!target) return;
        activeTab = target;

        document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
        tab.classList.add('active');

        const panelBuy = document.getElementById('panelBuy');
        const panelSale = document.getElementById('panelSale');
        if (panelBuy) panelBuy.hidden = target !== 'buy';
        if (panelSale) panelSale.hidden = target !== 'sale';
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;

      const viewBtn = target.closest('[data-view]');
      if (viewBtn) {
        const id = viewBtn.getAttribute('data-view');
        const order = ordersCache.find((o) => o.id === id);
        if (order) showDetails(order);
        return;
      }

      const delBtn = target.closest('[data-del]');
      if (delBtn) {
        const id = delBtn.getAttribute('data-del');
        if (id) deleteOrder(id);
        return;
      }

      const wdelBtn = target.closest('[data-wdel]');
      if (wdelBtn) {
        const id = wdelBtn.getAttribute('data-wdel');
        if (id) deleteWarranty(id);
        return;
      }

      const zoomImg = target.closest('[data-zoom]');
      if (zoomImg) {
        const url = zoomImg.getAttribute('data-zoom');
        const large = document.getElementById('imgLarge');
        if (large && url) large.src = url;
        openModal('imgModal');
        return;
      }

      const wZoom = target.closest('[data-wzoom]');
      if (wZoom) {
        const url = wZoom.getAttribute('data-wzoom');
        const large = document.getElementById('imgLarge');
        if (large && url) large.src = url;
        openModal('imgModal');
      }
    });

    const detailsClose = document.getElementById('detailsClose');
    if (detailsClose) detailsClose.addEventListener('click', () => closeModal('detailsModal'));

    const imgClose = document.getElementById('imgClose');
    if (imgClose) imgClose.addEventListener('click', () => closeModal('imgModal'));

    const saveStatusBtn = document.getElementById('saveStatusBtn');
    if (saveStatusBtn) saveStatusBtn.addEventListener('click', saveStatus);

    document.querySelectorAll('.modal').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.hidden = true;
      });
    });

    if (activeTab === 'sale') {
      document.querySelectorAll('.tab').forEach((x) => {
        const isSale = x.getAttribute('data-tab') === 'sale';
        x.classList.toggle('active', isSale);
      });
      const panelBuy = document.getElementById('panelBuy');
      const panelSale = document.getElementById('panelSale');
      if (panelBuy) panelBuy.hidden = true;
      if (panelSale) panelSale.hidden = false;
    }

    const warrantyForm = document.getElementById('warrantyForm');
    if (warrantyForm) warrantyForm.addEventListener('submit', uploadWarranty);

    const warrantySearchInput = document.getElementById('warrantySearchInput');
    if (warrantySearchInput) warrantySearchInput.addEventListener('input', renderWarranty);

    const warrantyRefreshBtn = document.getElementById('warrantyRefreshBtn');
    if (warrantyRefreshBtn) warrantyRefreshBtn.addEventListener('click', loadWarranty);
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
      window.location.replace('/login');
      return;
    }

    applyLang(getStored() === 'en' ? 'en' : 'ar');
    applyTheme(getTheme() === 'dark' ? 'dark' : 'light');

    bindEvents();
    loadOrders();
    loadWarranty();
  });
})();
