(()=>{"use strict";
const HASH="fd7b9283552a0d3e7f87df5fcfa0ff5d5d0830b3c944f999a85172ab2f4482fd",$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem("mh_"+k))??d}catch{return d}},set(k,v){try{localStorage.setItem("mh_"+k,JSON.stringify(v))}catch{}}};
const DEF={wa:"201505299711",fb:"",tt:"",mail:"menastak3hena7z@gmail.com",ph1:"01505299711",ph2:"01021744071",headline:"نصنع لك حضورك الرقمي...",p1:1500,p2:4500,p3:0,base:1000};
const cfg=()=>({...DEF,...store.get("cfg",{})});
const T={ar:{plans:"الأسعار والباقات",plansS:"اختر الباقة المناسبة أو اطلب باقة مخصصة",b:"أساسية",p:"احترافية",c:"مخصصة",start:"ابدأ الآن",calc:"حاسبة تكلفة المشروع",type:"نوع الموقع",pages:"عدد الصفحات",est:"التكلفة التقديرية",order:"اطلب مشروعك",name:"الاسم",phone:"رقم الهاتف",det:"تفاصيل المشروع",send:"إرسال الطلب",track:"متابعة طلبك",code:"كود الطلب",chk:"تتبع",done:"تم استلام طلبك! كود المتابعة:",nf:"لا يوجد طلب بهذا الكود",st:["استلام الطلب","التصميم","التطوير","الاختبار","التسليم"],egp:"ج.م",ct:"حسب الاتفاق",home:"الرئيسية",work:"أعمالنا",services:"خدماتنا",contact:"أرسل لنا فكرتك"},
en:{plans:"Pricing & Plans",plansS:"Pick a plan or ask for a custom one",b:"Basic",p:"Professional",c:"Custom",start:"Get started",calc:"Project Cost Calculator",type:"Website type",pages:"Number of pages",est:"Estimated cost",order:"Order your project",name:"Name",phone:"Phone",det:"Project details",send:"Send request",track:"Track your order",code:"Order code",chk:"Track",done:"Request received! Tracking code:",nf:"No order with this code",st:["Received","Design","Development","Testing","Delivered"],egp:"EGP",ct:"Per agreement",home:"Home",work:"Our work",services:"Services",contact:"Send your idea"}};
let L=store.get("lang","ar");const t=k=>T[L][k];
const TYPES=[["شركات / Corporate",0],["مطعم / Restaurant",300],["متجر إلكتروني / Store",2500],["تطبيق ويب / Web app",4000]];
const FEATS=[["لوحة تحكم / Dashboard",1500],["دعم عربي وإنجليزي / Bilingual",600],["نظام حجز / Booking",900],["دفع إلكتروني / Payments",1800],["SEO",500]];
const IC={wa:'<path d="M12 3.5a8.5 8.5 0 0 0-7.300 12.800L3.500 20.500l4.300-1.100A8.500 8.500 0 1 0 12 3.500z"/><path d="M9 8.500c0 3.500 3 6.500 6.500 6.500l1-1.500-2-1-1 .8c-1-.4-2-1.400-2.400-2.400l.8-1-1-2z"/>',fb:'<path d="M14 8h2V5h-2.500C11.300 5 10 6.400 10 8.500V10H8v3h2v6h3v-6h2l.5-3H13V8.700c0-.5.200-.7 1-.7z"/>',tt:'<path d="M14 4v10.500a2.500 2.500 0 1 1-2.500-2.500M14 4c.3 2.200 1.800 3.700 4 4"/>'};
const svg=k=>`<svg viewBox="0 0 24 24">${IC[k]}</svg>`;
function socials(){const c=cfg(),u={wa:`https://wa.me/${c.wa}`,fb:c.fb,tt:c.tt};
 return Object.keys(u).filter(k=>u[k]).map(k=>`<a href="${u[k]}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${svg(k)}</a>`).join("")}
function applyCfg(){const c=cfg(),h=$(".hero-headline");if(h)h.firstChild.textContent=c.headline;
 $$("#whatsappLink,[data-whatsapp]").forEach(a=>a.href=`https://wa.me/${c.wa}`);
 $$(".soc").forEach(e=>e.innerHTML=socials());
 const ml=$("#cmail");if(ml)ml.innerHTML=`${c.mail} · ${c.ph1} · ${c.ph2}`;
 const pr=[c.p1,c.p2,c.p3];$$(".pr").forEach((e,i)=>e.textContent=pr[i]?pr[i].toLocaleString("en")+" "+t("egp"):t("ct"))}
function lang(){const d=T[L];document.documentElement.lang=L;document.documentElement.dir=L=="ar"?"rtl":"ltr";
 $$("[data-t]").forEach(e=>e.textContent=d[e.dataset.t]);
 $$("[data-ph]").forEach(e=>e.placeholder=d[e.dataset.ph]);
 const m={"#home.nav-link":"home","[data-spy=work]":"work","[data-spy=services]":"services"};
 for(const s in m){const e=$(".nav-link"+s.replace("#home.nav-link","[data-spy=home]"));if(e&&e.lastChild)e.lastChild.textContent=d[m[s]]}
 $("#langBtn").textContent=L=="ar"?"EN":"ع";store.set("lang",L);calc();applyCfg()}
function calc(){const c=cfg(),ty=+$("#ctype").value,pg=+$("#cpages").value||1;let s=c.base+TYPES[ty][1]+Math.max(0,pg-3)*250;
 $$(".cf:checked").forEach(x=>s+=+x.value);$("#ctotal").textContent=s.toLocaleString("en")+" "+t("egp");return s}
const orders=()=>store.get("orders",[]);
function stagesHtml(i){return t("st").map((s,n)=>`<span class="${n<=i?"on":""}">${s}</span>`).join("")}
async function sha(s){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
let authed=false;
async function gate(then){if(authed)return then();const p=prompt(L=="ar"?"كلمة السر":"Password");if(p===null)return;
 if(await sha("mh::"+p)===HASH){authed=true;then()}else alert(L=="ar"?"كلمة سر خاطئة":"Wrong password")}
function openOv(id){$("#"+id).classList.add("open")}
function renderAdmin(){const o=orders();$("#atb").innerHTML=o.map((r,i)=>`<tr><td>${r.id}</td><td>${esc(r.name)}<br>${esc(r.phone)}</td><td>${esc(r.type)} · ${r.est}</td><td><select data-i="${i}">${t("st").map((s,n)=>`<option value="${n}" ${n==r.stage?"selected":""}>${s}</option>`).join("")}</select></td><td><button class="x" data-d="${i}" style="font-size:18px">🗑</button></td></tr>`).join("")||"<tr><td>—</td></tr>"}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderSettings(){const c=cfg();$("#sfields").innerHTML=Object.keys(DEF).map(k=>`<label>${k}</label><input data-k="${k}" value="${esc(c[k])}">`).join("")}
function build(){
 const sec=document.createElement("div");
 sec.innerHTML=`<section class="xs" id="plans"><h2 data-t="plans"></h2><p class="sub" data-t="plansS"></p><div class="plans">
 ${[["b",1],["p",2],["c",3]].map(([k,n],i)=>`<div class="plan ${i==1?"hot":""}"><h3 data-t="${k}"></h3><div class="pr"></div><ul>${[["صفحات حتى 5","Up to 5 pages"],["تصميم متجاوب","Responsive design"],["دعم فني","Support"]].slice(0,i==0?2:3).map(x=>`<li>${x[0]} / ${x[1]}</li>`).join("")}${i>0?"<li>لوحة تحكم / Dashboard</li>":""}</ul><a class="btn2" href="#order" data-t="start"></a></div>`).join("")}</div></section>
 <section class="xs" id="calc"><h2 data-t="calc"></h2><div class="box"><label data-t="type"></label><select id="ctype">${TYPES.map((x,i)=>`<option value="${i}">${x[0]}</option>`).join("")}</select><label data-t="pages"></label><input id="cpages" type="number" min="1" value="3">${FEATS.map(f=>`<label class="chk"><input type="checkbox" class="cf" value="${f[1]}">${f[0]} (+${f[1]})</label>`).join("")}<div class="total" id="ctotal"></div></div></section>
 <section class="xs" id="order"><h2 data-t="order"></h2><form class="box" id="oform"><div class="sgrid"><div><label data-t="name"></label><input id="oname" required></div><div><label data-t="phone"></label><input id="ophone" required></div></div><label data-t="det"></label><textarea id="odet" rows="3"></textarea><p style="text-align:center;margin-top:16px"><button class="btn2" data-t="send"></button></p><p id="omsg" class="total" style="font-size:20px"></p></form></section>
 <section class="xs" id="track"><h2 data-t="track"></h2><div class="box"><label data-t="code"></label><input id="tcode" placeholder="MH-0000"><p style="text-align:center;margin-top:12px"><button class="btn2" id="tbtn" data-t="chk"></button></p><div class="stages" id="tres"></div></div></section>
 <div class="soc" id="soc2"></div><p style="text-align:center;color:var(--muted)" id="cmail"></p>`;
 const ct=$("#contact");ct.before(...sec.children);const f=$(".footer");f.insertBefore(Object.assign(document.createElement("div"),{className:"soc"}),f.querySelector("p"));$$(".soc").forEach(e=>e.id||0);
 $$("#soc2").forEach(e=>e.className="soc");
 $("header nav, #nav").insertAdjacentHTML("beforeend",`<a href="#plans" class="nav-link" data-t="plans"></a>`);
 document.body.insertAdjacentHTML("beforeend",`<div class="tools"><button class="fab" id="langBtn"></button><button class="fab" id="gearBtn" aria-label="settings"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg></button><button class="fab" id="admBtn">☰</button></div>
 <div class="ov" id="ovS"><div class="box"><button class="x" data-c>×</button><h3>⚙ Settings</h3><div id="sfields"></div><p style="margin-top:14px"><button class="btn2" id="ssave">حفظ / Save</button> <button class="btn2" id="sreset">Reset</button></p></div></div>
 <div class="ov" id="ovA"><div class="box" style="max-width:980px"><button class="x" data-c>×</button><h3>Dashboard</h3><div style="overflow:auto"><table><tbody id="atb"></tbody></table></div></div></div>
 <div class="ov" id="ovP"><div class="box"><button class="x" data-c>×</button><div class="pv" id="pv"></div><div class="nv"><button class="btn2" id="pp">→</button><span id="pt"></span><button class="btn2" id="pn">←</button></div></div></div>`)}
function init(){build();
 $$(".ov [data-c]").forEach(b=>b.onclick=()=>b.closest(".ov").classList.remove("open"));
 $("#langBtn").onclick=()=>{L=L=="ar"?"en":"ar";lang()};
 $("#gearBtn").onclick=()=>gate(()=>{renderSettings();openOv("ovS")});
 $("#admBtn").onclick=()=>gate(()=>{renderAdmin();openOv("ovA")});
 $("#ssave").onclick=()=>{const c={};$$("#sfields input").forEach(i=>c[i.dataset.k]=isNaN(DEF[i.dataset.k])?i.value.trim():+i.value);store.set("cfg",c);applyCfg();calc();alert("✓")};
 $("#sreset").onclick=()=>{store.set("cfg",{});renderSettings();applyCfg()};
 $("#atb").onchange=e=>{const o=orders();o[e.target.dataset.i].stage=+e.target.value;store.set("orders",o)};
 $("#atb").onclick=e=>{const d=e.target.dataset.d;if(d!==undefined){const o=orders();o.splice(d,1);store.set("orders",o);renderAdmin()}};
 $("#ctype").onchange=$("#cpages").oninput=calc;$$(".cf").forEach(x=>x.onchange=calc);
 $("#oform").onsubmit=e=>{e.preventDefault();const o=orders(),id="MH-"+String(Math.floor(1000+Math.random()*9000));
  const r={id,name:$("#oname").value,phone:$("#ophone").value,type:TYPES[$("#ctype").value][0],est:$("#ctotal").textContent,det:$("#odet").value,stage:0,at:Date.now()};
  o.push(r);store.set("orders",o);$("#omsg").textContent=t("done")+" "+id;
  window.open(`https://wa.me/${cfg().wa}?text=${encodeURIComponent(`طلب جديد ${id}\n${r.name} - ${r.phone}\n${r.type} - ${r.est}\n${r.det}`)}`,"_blank")};
 $("#tbtn").onclick=()=>{const r=orders().find(x=>x.id==$("#tcode").value.trim().toUpperCase());$("#tres").innerHTML=r?stagesHtml(r.stage):t("nf")};
 const cards=$$(".project-card");let ci=0;const show=i=>{ci=(i+cards.length)%cards.length;$("#pv").innerHTML=cards[ci].querySelector(".project-preview").outerHTML;$("#pt").textContent=cards[ci].querySelector("h3:last-of-type,.project-meta h3").textContent};
 cards.forEach((c,i)=>c.onclick=()=>{show(i);openOv("ovP")});$("#pn").onclick=()=>show(ci+1);$("#pp").onclick=()=>show(ci-1);
 lang()}
// حماية (ردع فقط — الحماية الحقيقية تتم على السيرفر)
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("keydown",e=>{if(e.key=="F12"||(e.ctrlKey&&/^[usc]$/i.test(e.key)&&e.key.toLowerCase()!="c")||(e.ctrlKey&&e.shiftKey&&/^[ijc]$/i.test(e.key)))e.preventDefault()});
if(top!==self){try{top.location=self.location}catch{document.body.innerHTML=""}}
init()})();
