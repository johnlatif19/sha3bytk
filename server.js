require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;

const app = express();
app.set('trust proxy', 1);

/* ============================================================
 *  ENV VALIDATION
 * ============================================================ */
const REQUIRED_ENV = [
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH',
  'JWT_SECRET',
  'FIREBASE_CONFIG',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing ENV variables:', missing.join(', '));
}

/* ============================================================
 *  FIREBASE INIT
 * ============================================================ */
let db = null;
try {
  if (process.env.FIREBASE_CONFIG) {
    let raw = process.env.FIREBASE_CONFIG.trim();

    // دعم JSON عادي أو Base64
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(raw);
    } catch {
      serviceAccount = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    }

    // إصلاح private_key إذا جاء بـ \n حرفية
    if (serviceAccount.private_key && serviceAccount.private_key.includes('\\n')) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    db = admin.firestore();
    console.log('✅ Firebase initialized');
  }
} catch (err) {
  console.error('❌ Firebase init error:', err.message);
}

/* ============================================================
 *  CLOUDINARY INIT
 * ============================================================ */
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('✅ Cloudinary configured');
} catch (err) {
  console.error('❌ Cloudinary config error:', err.message);
}

/* ============================================================
 *  MIDDLEWARES
 * ============================================================ */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

/* ============================================================
 *  RATE LIMITERS
 * ============================================================ */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10,
  message: { error: 'محاولات دخول كثيرة، حاول لاحقاً.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'طلبات كثيرة جداً، حاول لاحقاً.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ============================================================
 *  MULTER (memory storage - compatible with Vercel)
 * ============================================================ */
const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new Error('نوع الملف غير مسموح. يُسمح فقط بـ jpg, jpeg, png, webp'));
    }
    cb(null, true);
  },
});

/* ============================================================
 *  HELPERS
 * ============================================================ */
function sanitizeString(v, maxLen = 500) {
  if (typeof v !== 'string') return '';
  return v
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, maxLen);
}

function sanitizePhone(v) {
  if (typeof v !== 'string') return '';
  const cleaned = v.replace(/[^\d+\-\s]/g, '').trim();
  return cleaned.slice(0, 20);
}

function generateOrderId() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `PUB-${n}`;
}

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
}

/* ============================================================
 *  AUTH MIDDLEWARE
 * ============================================================ */
function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

/* ============================================================
 *  ROUTES: AUTH
 * ============================================================ */
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'من فضلك أدخل اسم المستخدم وكلمة المرور.' });
    }

    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!expectedUser || !expectedHash) {
      return res.status(500).json({ error: 'إعدادات الأدمن غير مكتملة على السيرفر.' });
    }

    const userOk = username === expectedUser;
    const passOk = await bcrypt.compare(password, expectedHash);

    if (!userOk || !passOk) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة.' });
    }

    const token = signToken({ role: 'admin', username: expectedUser });
    return res.json({ token, username: expectedUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'حدث خطأ في السيرفر.' });
  }
});

/* ============================================================
 *  ROUTES: UPLOAD
 * ============================================================ */
app.post('/api/upload', apiLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'من فضلك ارفع صورة.' });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'sha3bytk',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, uploaded) => {
          if (error) return reject(error);
          resolve(uploaded);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'فشل رفع الصورة.' });
  }
});

/* ============================================================
 *  ROUTES: ORDERS (Public Create)
 * ============================================================ */
app.post('/api/orders', apiLimiter, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'قاعدة البيانات غير مهيأة.' });
    }

    const body = req.body || {};
    const type = body.type === 'buy' || body.type === 'sale' ? body.type : null;
    if (!type) {
      return res.status(400).json({ error: 'نوع الطلب غير صحيح.' });
    }

    const name = sanitizeString(body.name, 100);
    const phone = sanitizePhone(body.phone);

    if (!name) return res.status(400).json({ error: 'من فضلك أدخل الاسم.' });
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      return res.status(400).json({ error: 'من فضلك أدخل رقم WhatsApp صحيح.' });
    }

    const order = {
      id: generateOrderId(),
      type,
      name,
      phone,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (type === 'buy') {
      const gameName = sanitizeString(body.gameName, 100);
      const pubgId = sanitizeString(body.pubgId, 50);
      const popularityAmount = Number(body.popularityAmount);
      const popularityType = ['card', 'misc'].includes(body.popularityType)
        ? body.popularityType
        : null;

      if (!gameName) return res.status(400).json({ error: 'من فضلك أدخل الاسم داخل اللعبة.' });
      if (!pubgId) return res.status(400).json({ error: 'من فضلك أدخل PUBG ID.' });
      if (!popularityType) {
        return res.status(400).json({ error: 'من فضلك اختر نوع الشعبية.' });
      }

      order.gameName = gameName;
      order.pubgId = pubgId;
      order.popularityType = popularityType;

      if (popularityType === 'misc') {
        if (!Number.isFinite(popularityAmount) || popularityAmount <= 0) {
          return res.status(400).json({ error: 'من فضلك أدخل عدد شعبية صحيح.' });
        }
        order.popularityAmount = Math.floor(popularityAmount);
        order.details = sanitizeString(body.details, 500);
      }

      if (popularityType === 'card' && body.cardImageUrl) {
        order.cardImageUrl = sanitizeString(body.cardImageUrl, 500);
      }
    }

    if (type === 'sale') {
      const popularityType = ['card', 'misc'].includes(body.popularityType)
        ? body.popularityType
        : null;

      if (!popularityType) {
        return res.status(400).json({ error: 'من فضلك اختر نوع الشعبية.' });
      }
      order.popularityType = popularityType;

      if (popularityType === 'card') {
        const cardName = sanitizeString(body.cardName, 100);
        const cardImageUrl = sanitizeString(body.cardImageUrl, 500);
        if (!cardName) {
          return res.status(400).json({ error: 'من فضلك أدخل اسم الكارت.' });
        }
        if (!cardImageUrl) {
          return res.status(400).json({ error: 'من فضلك ارفع صورة الكارت.' });
        }
        order.cardName = cardName;
        order.cardImageUrl = cardImageUrl;
      }

      if (popularityType === 'misc') {
        const amount = Number(body.popularityAmount);
        if (!Number.isFinite(amount) || amount <= 0) {
          return res.status(400).json({ error: 'من فضلك أدخل عدد شعبية صحيح.' });
        }
        order.popularityAmount = Math.floor(amount);
      }

      if (body.details) {
        order.details = sanitizeString(body.details, 500);
      }
    }

    await db.collection('orders').doc(order.id).set(order);

    return res.status(201).json({
      success: true,
      message: 'تم استلام طلبك بنجاح',
      orderId: order.id,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء إرسال الطلب.' });
  }
});

/* ============================================================
 *  ROUTES: ADMIN
 * ============================================================ */
app.get('/api/admin/orders', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'قاعدة البيانات غير مهيأة.' });

    const snap = await db
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(500)
      .get();

    const orders = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        ...d,
        createdAt: d.createdAt?.toDate?.()?.toISOString?.() || null,
      };
    });

    return res.json({ orders });
  } catch (err) {
    console.error('Admin orders error:', err);
    return res.status(500).json({ error: 'فشل جلب الطلبات.' });
  }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'قاعدة البيانات غير مهيأة.' });

    const snap = await db.collection('orders').get();
    const stats = {
      total: 0,
      buy: 0,
      sale: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    snap.forEach((doc) => {
      const d = doc.data();
      stats.total++;
      if (d.type === 'buy') stats.buy++;
      if (d.type === 'sale') stats.sale++;
      if (d.status && stats[d.status] !== undefined) stats[d.status]++;
    });

    return res.json({ stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'فشل جلب الإحصائيات.' });
  }
});

app.patch('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'قاعدة البيانات غير مهيأة.' });

    const id = sanitizeString(req.params.id, 50);
    const allowed = ['pending', 'processing', 'completed', 'cancelled'];
    const status = req.body?.status;

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'حالة الطلب غير صحيحة.' });
    }

    const ref = db.collection('orders').doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'الطلب غير موجود.' });
    }

    await ref.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ success: true, id, status });
  } catch (err) {
    console.error('Admin update error:', err);
    return res.status(500).json({ error: 'فشل تحديث الطلب.' });
  }
});

/* ============================================================
 *  HEALTH CHECK
 * ============================================================ */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

/* ============================================================
 *  ERROR HANDLER
 * ============================================================ */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'حجم الصورة كبير جداً (الحد 5MB).' });
    }
    return res.status(400).json({ error: 'خطأ في رفع الملف.' });
  }

  if (err?.message && err.message.includes('نوع الملف')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'حدث خطأ غير متوقع.' });
});

/* ============================================================
 *  HTML ROUTES (for direct navigation on Vercel)
 * ============================================================ */
const htmlRoutes = {
  '/': 'home.html',
  '/home': 'home.html',
  '/buy': 'buy.html',
  '/sale': 'sale.html',
  '/login': 'login.html',
  '/dashboard': 'dashboard.html',
};

Object.entries(htmlRoutes).forEach(([route, file]) => {
  app.get(route, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', file));
  });
});

/* ============================================================
 *  LOCAL SERVER
 * ============================================================ */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Sha3bytk server running on http://localhost:${PORT}`);
  });
}

module.exports = app;