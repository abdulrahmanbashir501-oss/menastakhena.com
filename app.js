const form = document.getElementById('requestForm');
const message = document.getElementById('formMessage');
const button = document.getElementById('submitBtn');
document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';
  message.className = 'form-message';

  const cfg = window.APP_CONFIG || {};
  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.includes('YOUR-PROJECT') ||
      !cfg.SUPABASE_ANON_KEY || cfg.SUPABASE_ANON_KEY.includes('YOUR_')) {
    message.textContent = 'النظام يحتاج إعداد قاعدة البيانات أولًا. راجع ملف README.';
    message.classList.add('error');
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  data.name = (data.name || '').trim();
  data.phone = (data.phone || '').trim();
  data.details = (data.details || '').trim();
  if (data.name.length < 2 || data.phone.length < 7 || data.details.length < 10) {
    message.textContent = 'راجع الاسم ورقم الهاتف والتفاصيل قبل الإرسال.';
    message.classList.add('error');
    return;
  }

  button.disabled = true;
  button.firstChild.textContent = 'جارٍ إرسال الطلب...';
  try {
    const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    const { data: result, error } = await client.functions.invoke('submit-order', { body: data });
    if (error || !result?.success) throw new Error(result?.error || error?.message || 'تعذر إرسال الطلب');
    form.reset();
    message.textContent = 'تم استلام طلبك بنجاح! هنتواصل معاك قريبًا.';
  } catch (err) {
    console.error(err);
    message.textContent = 'حصلت مشكلة أثناء الإرسال. حاول مرة تانية أو تواصل معنا مباشرة.';
    message.classList.add('error');
  } finally {
    button.disabled = false;
    button.firstChild.textContent = 'إرسال طلب المشروع ';
  }
});
