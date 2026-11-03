// إعدادات الموقع: غيّر رقم واتساب إلى رقمك بصيغة دولية بدون + أو مسافات.
const WHATSAPP_NUMBER = "201505299711";

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const contactBtn = document.getElementById("contactBtn");
const contactMenu = document.getElementById("contactMenu");

function closeMenus() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  contactMenu.classList.remove("open");
  contactBtn.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

contactBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = contactMenu.classList.toggle("open");
  contactBtn.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-drop")) {
    contactMenu.classList.remove("open");
    contactBtn.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenus(); });

document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", closeMenus));

// روابط واتساب
const message = encodeURIComponent("مرحبًا، أريد الاستفسار عن تصميم وتطوير موقع إلكتروني لمشروعي.");
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
document.querySelectorAll("#whatsappLink, [data-whatsapp]").forEach(a => { a.href = waUrl; });

document.getElementById("year").textContent = new Date().getFullYear();

// إظهار الأقسام عند التمرير
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(item => revealObserver.observe(item));

// تمييز الرابط النشط في القائمة حسب القسم الظاهر
const spyLinks = [...document.querySelectorAll(".nav-link[data-spy]")];
const spyMap = { home: "home", services: "services", work: "work" };
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const key = spyMap[entry.target.id];
    if (!key) return;
    spyLinks.forEach(l => l.classList.toggle("active", l.dataset.spy === key));
  });
}, { rootMargin: "-40% 0px -55% 0px" });
Object.keys(spyMap).forEach(id => { const el = document.getElementById(id); if (el) spyObserver.observe(el); });
