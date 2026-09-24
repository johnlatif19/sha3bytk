# Sha3bytk 🎮
**بيع • اشتري • شعبيتك**

منصة ويب Production-ready لبيع وشراء "الشعبية" الخاصة بلعبة PUBG.

![Logo](https://i.ibb.co/YJYrcxZ/sha3bytk.png)

---

## ✨ المميزات

- 🏠 صفحة رئيسية باختيار **شراء** أو **بيع**
- 🛒 صفحة شراء مع Validation كامل و Summary قبل الإرسال
- 💰 صفحة بيع مع **حاسبة شعبية** تفاعلية
- 🔐 تسجيل دخول آمن (JWT) للإدارة
- 📊 Dashboard احترافي مع إحصائيات، بحث، فلترة، تغيير حالة الطلب
- 🖼️ رفع الصور عبر **Cloudinary**
- 🔥 تخزين الطلبات في **Firebase Firestore**
- 🌐 واجهة عربية RTL متجاوبة بالكامل
- 🛡️ أمان: Helmet, CORS, Rate Limiting, Sanitization

---

## 🧱 التقنيات

- **Backend:** Node.js + Express
- **Database:** Firebase Firestore
- **Storage:** Cloudinary
- **Auth:** JWT + bcrypt
- **Deploy:** Vercel

---

## 📁 هيكل المشروع
/
├── public/
│ ├── home.html
│ ├── buy.html
│ ├── sale.html
│ ├── login.html
│ └── dashboard.html
├── server.js
├── vercel.json
├── package.json
├── .env.example
└── README.md

text

---

## ⚙️ API Endpoints

| Method | Endpoint | الوصف | Auth |
|--------|----------|-------|------|
| POST | `/api/login` | تسجيل دخول الأدمن | ❌ |
| POST | `/api/upload` | رفع صورة إلى Cloudinary | ❌ |
| POST | `/api/orders` | إنشاء طلب (buy/sale) | ❌ |
| GET | `/api/admin/orders` | جلب كل الطلبات | ✅ JWT |
| GET | `/api/admin/stats` | إحصائيات الطلبات | ✅ JWT |
| PATCH | `/api/admin/orders/:id` | تحديث حالة الطلب | ✅ JWT |

---

## 🚀 التشغيل محلياً

### 1. تثبيت الحزم
```bash
npm install