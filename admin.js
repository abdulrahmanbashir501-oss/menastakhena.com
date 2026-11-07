let client;
let allOrders = [];
const $ = (id) => document.getElementById(id);
function showDashboard(show) { $('loginPanel').classList.toggle('hidden', show); $('dashboard').classList.toggle('hidden', !show); }
function configReady() {
  const c = window.APP_CONFIG || {};
  return c.SUPABASE_URL && !c.SUPABASE_URL.includes('YOUR-PROJECT') && c.SUPABASE_ANON_KEY && !c.SUPABASE_ANON_KEY.includes('YOUR_');
}
async function loadOrders() {
  $('ordersBody').innerHTML = '<tr><td colspan="7">جارٍ تحميل الطلبات...</td></tr>';
  const { data, error } = await client.from('orders').select('*').order('created_at', { ascending: false });
  if (error) { $('ordersBody').innerHTML = '<tr><td colspan="7">تعذر تحميل الطلبات. تأكد من صلاحيات حساب الإدارة.</td></tr>'; $('dashMessage').textContent = error.message; return; }
  allOrders = data || []; renderOrders();
}
function renderOrders() {
  const q = $('searchInput').value.trim().toLowerCase();
  const rows = allOrders.filter(o => `${o.name} ${o.phone}`.toLowerCase().includes(q));
  $('ordersBody').innerHTML = rows.map(o => `<tr>
    <td>${escapeHtml(o.name)}</td><td dir="ltr">${escapeHtml(o.phone)}</td><td>${escapeHtml(o.project_type)}</td>
    <td>${escapeHtml(o.budget || 'غير محددة')}</td><td>${new Date(o.created_at).toLocaleString('ar-EG')}</td>
    <td><select data-status="${o.id}" aria-label="حالة الطلب"><option ${o.status==='جديد'?'selected':''}>جديد</option><option ${o.status==='قيد التواصل'?'selected':''}>قيد التواصل</option><option ${o.status==='قيد التنفيذ'?'selected':''}>قيد التنفيذ</option><option ${o.status==='مكتمل'?'selected':''}>مكتمل</option><option ${o.status==='مؤرشف'?'selected':''}>مؤرشف</option></select></td>
    <td><button class="secondary-btn" data-details="${o.id}">عرض</button></td></tr>`).join('') || '<tr><td colspan="7">لا توجد طلبات.</td></tr>';
  document.querySelectorAll('[data-status]').forEach(el => el.addEventListener('change', async e => {
    const { error } = await client.from('orders').update({status:e.target.value}).eq('id', e.target.dataset.status);
    $('dashMessage').textContent = error ? 'تعذر تحديث الحالة.' : 'تم تحديث حالة الطلب.';
    if (!error) { const o=allOrders.find(x=>x.id===e.target.dataset.status); if(o)o.status=e.target.value; }
  }));
  document.querySelectorAll('[data-details]').forEach(el => el.addEventListener('click', () => {
    const o=allOrders.find(x=>x.id===el.dataset.details); if(!o)return;
    alert(`الاسم: ${o.name}\nالهاتف: ${o.phone}\nالبريد: ${o.email || '-'}\nالمشروع: ${o.project_type}\nالميزانية: ${o.budget || '-'}\nموعد التنفيذ: ${o.timeline || '-'}\n\nالتفاصيل:\n${o.details}`);
  }));
}
function escapeHtml(v='') { return String(v).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
document.addEventListener('DOMContentLoaded', async () => {
  if (!configReady()) { $('loginMessage').textContent='أكمل إعداد config.js وSupabase أولًا.'; $('loginMessage').classList.add('error'); return; }
  client=window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_ANON_KEY);
  const {data:{session}}=await client.auth.getSession();
  if(session) {showDashboard(true); await loadOrders();}
  $('loginForm').addEventListener('submit', async e=>{
    e.preventDefault(); const f=new FormData(e.target);
    const {error}=await client.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});
    if(error){$('loginMessage').textContent='بيانات الدخول غير صحيحة أو الحساب غير مفعّل.'; $('loginMessage').classList.add('error');return;}
    showDashboard(true); await loadOrders();
  });
  $('logoutBtn').addEventListener('click', async()=>{await client.auth.signOut();showDashboard(false);});
  $('refreshBtn').addEventListener('click',loadOrders);
  $('searchInput').addEventListener('input',renderOrders);
});
