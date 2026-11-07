# منصتك هنا — نظام استقبال طلبات العملاء

هذه حزمة بداية قابلة للنشر، وتتضمن صفحة طلبات ولوحة إدارة وقاعدة بيانات ووظيفة آمنة لإرسال الطلبات. **ليست منشورة أو متصلة بحساباتك بعد**؛ يلزم إكمال الإعداد أدناه قبل استقبال طلبات حقيقية.

## الملفات
- `index.html`: صفحة العميل.
- `admin.html`: لوحة الإدارة.
- `config.js`: رابط Supabase ومفتاح anon العام فقط.
- `supabase/schema.sql`: إنشاء جدول الطلبات وسياسات الوصول.
- `supabase/functions/submit-order`: يستقبل الطلب ويحفظه ويرسل إشعار واتساب عند إعداد بيانات Meta.

## 1) إعداد قاعدة البيانات
1. أنشئ مشروعًا في Supabase.
2. افتح SQL Editor وشغّل محتوى `supabase/schema.sql`.
3. من Project Settings > API انسخ Project URL و anon/public key وضعهما في `config.js`.
4. من Authentication > Users أنشئ حساب دخول خاصًا بك. لا تضع بيانات الدخول داخل ملفات الموقع.

## 2) نشر وظيفة استقبال الطلب
باستخدام Supabase CLI:
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy submit-order
supabase secrets set SUPABASE_URL="YOUR_SUPABASE_URL" SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
```
مفتاح Service Role سري للغاية: ضعه كـ Secret فقط، ولا تضعه في `config.js` أو أي ملف يراه المتصفح.

يمكنك إضافة:
```bash
supabase secrets set ALLOWED_ORIGIN="https://YOUR-DOMAIN"
```
واجعل النطاق هو عنوان موقعك الفعلي.

## 3) إعداد إشعار WhatsApp
إشعارات واتساب التلقائية تتطلب **WhatsApp Business Platform / Cloud API** من Meta، وليس مجرد تثبيت تطبيق WhatsApp Business. ستحتاج إلى إعداد حساب أعمال ورقم مُسجّل في المنصة ورمز وصول صالح، وإنشاء قالب رسالة معتمد باسم `new_order_notice` ولغة `ar` ويحتوي أربعة متغيرات في نص الرسالة، بالترتيب:
1. اسم العميل
2. رقم العميل
3. نوع المشروع
4. الميزانية

بعد اعتماد القالب، أضف الأسرار:
```bash
supabase secrets set WHATSAPP_TOKEN="YOUR_META_ACCESS_TOKEN" WHATSAPP_PHONE_NUMBER_ID="YOUR_PHONE_NUMBER_ID" OWNER_WHATSAPP_NUMBER="201XXXXXXXXX" WHATSAPP_TEMPLATE_NAME="new_order_notice" WHATSAPP_TEMPLATE_LANGUAGE="ar"
```
اكتب رقم الاستقبال بصيغة دولية من غير `+`، مثل `20` ثم رقمك. لا ترسل رموز الوصول أو كلمات المرور في المحادثات.

## 4) لوحة الإدارة
- افتح `admin.html` بعد النشر.
- سجّل الدخول بالبريد وكلمة المرور اللذين أنشأتهما في Supabase Auth.
- لوحة الإدارة تقرأ وتعدّل الطلبات للمستخدمين المسجلين. لا تنشئ حسابات عامة للعملاء.

## 5) النشر
ارفع ملفات الواجهة (`index.html`, `admin.html`, `styles.css`, `config.js`, `app.js`, `admin.js`) إلى استضافة HTTPS مثل GitHub Pages أو Netlify أو Vercel. انشر وظيفة Supabase بشكل منفصل كما في الخطوات السابقة.

## ملاحظات مهمة قبل الإطلاق
- لم يتم اختبار الربط بحساب Supabase أو Meta لأن بيانات حساباتك غير متوفرة.
- لا تضع Service Role Key أو WhatsApp Token في ملفات الواجهة.
- أضف حماية من الرسائل المزعجة ومعدل إرسال (rate limiting) قبل حملة عامة واسعة.
- اختبر طلبًا تجريبيًا وتأكد من ظهوره في لوحة الإدارة ووصول إشعار واتساب قبل مشاركة الرابط.
- بيانات العملاء شخصية؛ اجمع الحد الأدنى اللازم واحتفظ بها بأمان.
