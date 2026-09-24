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
      title: 'Sha3bytk | دخول الإدارة',
      tagline: 'بيع • اشتري • شعبيتك',
      back: 'رجوع',
      badge: 'منطقة الإدارة',
      title2: 'تسجيل دخول الأدمن',
      sub: 'أدخل بياناتك للوصول إلى لوحة التحكم.',
      lblUser: 'اسم المستخدم',
      lblPass: 'كلمة المرور',
      submit: 'تسجيل الدخول',
      submitting: 'جارٍ الدخول...',
      show: '🐵',
      hide: '🙈',
      errUser: 'من فضلك أدخل اسم المستخدم.',
      errPass: 'من فضلك أدخل كلمة المرور.',
      errInvalid: 'بيانات الدخول غير صحيحة.',
      errServer: 'حدث خطأ في السيرفر. حاول مرة أخرى.',
      success: 'تم تسجيل الدخول بنجاح',
      rights: 'جميع الحقوق محفوظة.',
    },
    en: {
      dir: 'ltr', lang: 'en', switchLabel: 'AR',
      title: 'Sha3bytk | Admin Login',
      tagline: 'Sell • Buy • Your Popularity',
      back: 'Back',
      badge: 'Admin Area',
      title2: 'Admin Login',
      sub: 'Enter your credentials to access the dashboard.',
      lblUser: 'Username',
      lblPass: 'Password',
      submit: 'Sign in',
      submitting: 'Signing in...',
      show: '🐵',
      hide: '🙈',
      errUser: 'Please enter your username.',
      errPass: 'Please enter your password.',
      errInvalid: 'Invalid credentials.',
      errServer: 'Server error. Please try again.',
      success: 'Logged in successfully',
      rights: 'All rights reserved.',
    },
  };

  let currentLang = 'ar';

  const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || key;

  const getStored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
  const setStored = (lang) => { try { localStorage.setItem(STORAGE_KEY, lang); } catch {} };

  const getTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
  const setTheme = (theme) => { try { localStorage.setItem(THEME_KEY, theme); } catch {} };

  const setToken = (token) => { try { localStorage.setItem(TOKEN_KEY, token); } catch {} };
  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };

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

    const toggle = document.getElementById('passToggleText');
    const passInput = document.getElementById('password');
    if (toggle && passInput) {
      toggle.textContent = passInput.type === 'password' ? dict.show : dict.hide;
    }

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

  const setMsg = (msg, type) => {
    const el = document.getElementById('formMsg');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.remove('error', 'success');
    if (type) el.classList.add(type);
  };

  const validate = () => {
    clearErrs();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    let ok = true;

    if (!user) { showErr('username', t('errUser')); ok = false; }
    if (!pass) { showErr('password', t('errPass')); ok = false; }

    return ok;
  };

  const doLogin = async (username, password) => {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.error || (res.status === 401 ? t('errInvalid') : t('errServer'));
      throw new Error(msg);
    }
    return data;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    applyLang(getStored() === 'en' ? 'en' : 'ar');
    applyTheme(getTheme() === 'dark' ? 'dark' : 'light');

    if (getToken()) {
      window.location.replace('/dashboard');
      return;
    }

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

    const passToggle = document.getElementById('passToggle');
    const passInput = document.getElementById('password');
    const passText = document.getElementById('passToggleText');
    if (passToggle && passInput && passText) {
      passToggle.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        passText.textContent = isPass ? t('hide') : t('show');
      });
    }

    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const original = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = t('submitting');
        setMsg('', null);

        try {
          const data = await doLogin(username, password);
          if (data && data.token) {
            setToken(data.token);
            setMsg(t('success'), 'success');
            setTimeout(() => window.location.replace('/dashboard'), 500);
          } else {
            setMsg(t('errServer'), 'error');
          }
        } catch (err) {
          setMsg(err.message || t('errServer'), 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = original;
        }
      });
    }
  });
})();