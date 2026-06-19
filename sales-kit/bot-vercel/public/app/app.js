const tg = window.Telegram?.WebApp;
tg?.ready(); tg?.expand();
const app = document.getElementById("app");
const sub = document.getElementById("hdSub");
const state = { niche: null };

function go(screen){ window.scrollTo(0,0); screen(); }

const NICHES = [
  { key:"beauty",    name:"Бьюти",    img:"img/beauty.jpg",    demo:"https://drelima-miniapp.vercel.app" },
  { key:"shop",      name:"Магазин",  img:"img/shop.jpg",      demo:"https://nura-store-liard.vercel.app" },
  { key:"services",  name:"Услуги",   img:"img/services.jpg",  demo:"https://app-ivory-five-19.vercel.app" },
  { key:"education", name:"Обучение", img:"img/education.jpg", demo:"https://agenio-website.vercel.app/miniapp.html" },
];

const screens = {};

screens.showroom = function(){
  sub.textContent = "Мини-аппы и сайты для бизнеса";
  tg?.BackButton?.hide();
  const tiles = NICHES.map(n =>
    `<div class="tile" data-key="${n.key}"><img src="${n.img}" alt=""><div class="ov"></div><div class="nm">${n.name}</div></div>`
  ).join("");
  app.innerHTML = `
    <p class="lbl">Выбери свою сферу — покажу живой пример</p>
    <div class="grid2">${tiles}</div>
    <button class="cta sticky" id="wantBtn">Хочу себе такой</button>`;
  app.querySelectorAll(".tile").forEach(t => t.onclick = () => {
    const n = NICHES.find(x => x.key === t.dataset.key);
    state.niche = n.name;
    state.demoUrl = n.demo;
    go(screens.demo);
  });
  document.getElementById("wantBtn").onclick = () => go(screens.template);
};

screens.demo = function(){
  sub.textContent = state.niche ? `Пример: ${state.niche}` : "Живой пример";
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(screens.showroom));
  app.innerHTML = `
    <div class="demobar"><button class="back" id="backNiches">← Ниши</button><span>Так это работает вживую</span></div>
    <div class="frame"><iframe src="${state.demoUrl}" title="demo" loading="lazy"></iframe></div>
    <button class="cta sticky" id="wantThis">Сделать такой мне</button>`;
  document.getElementById("backNiches").onclick = () => go(screens.showroom);
  document.getElementById("wantThis").onclick = () => go(screens.lead);
};

screens.template = function(){
  sub.textContent = state.niche ? `Пример: ${state.niche}` : "Так это будет у тебя";
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(screens.showroom));
  app.innerHTML = `
    <p class="lbl">Каталог / услуги</p>
    <div class="grid2">
      <div class="prod"><div class="img"><img src="img/beauty.jpg" alt=""></div><div class="pb"><div class="nm">Услуга 1</div><div class="pr">от 10 000 ₸</div></div></div>
      <div class="prod"><div class="img"><img src="img/services.jpg" alt=""></div><div class="pb"><div class="nm">Услуга 2</div><div class="pr">от 15 000 ₸</div></div></div>
    </div>
    <div class="book"><img src="img/booking.jpg" alt=""><div class="ov"></div><span>Записаться · выбрать время</span></div>
    <button class="cta sticky" id="mineBtn">Сделать такой мне</button>`;
  document.getElementById("mineBtn").onclick = () => go(screens.lead);
};

screens.lead = function(){
  sub.textContent = "Оставить заявку";
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(screens.showroom));
  const u = tg?.initDataUnsafe?.user || {};
  const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
  app.innerHTML = `
    <div class="ok" style="padding:10px 0"><h2 style="font-size:18px">Соберём за 5 дней</h2></div>
    <p class="lbl">Имя</p>
    <input class="fld" id="fName" placeholder="Ваше имя" value="${fullName}">
    <p class="lbl">Телефон / WhatsApp</p>
    <input class="fld" id="fPhone" placeholder="+7 …" inputmode="tel">
    <button class="cta ghost" id="pullPhone" style="margin-top:8px">Подтянуть телефон из Telegram</button>
    <p class="lbl">Сфера</p>
    <input class="fld" id="fNiche" placeholder="Например: салон красоты" value="${state.niche||""}">
    <button class="cta sticky" id="sendBtn" style="margin-top:12px">Отправить заявку</button>`;

  document.getElementById("pullPhone").onclick = () => {
    if(!tg?.requestContact){ tg?.showAlert?.("Введите номер вручную"); return; }
    tg.requestContact((ok, res) => {
      const phone = res?.responseUnsafe?.contact?.phone_number || res?.contact?.phone_number;
      if(ok && phone){ document.getElementById("fPhone").value = phone; }
      else if(ok){ tg?.showAlert?.("Контакт отправлен. Если поле пустое — введите номер вручную"); }
      else { tg?.showAlert?.("Не получилось — введите номер вручную"); }
    });
  };

  document.getElementById("sendBtn").onclick = submitLead;
};

async function submitLead(){
  const name = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const niche = document.getElementById("fNiche").value.trim();
  if(!name || !phone){ tg?.showAlert?.("Заполните имя и телефон"); return; }
  const btn = document.getElementById("sendBtn"); btn.disabled = true; btn.textContent = "Отправляю…";
  try{
    const r = await fetch("/api/lead", {
      method:"POST", headers:{"content-type":"application/json"},
      body: JSON.stringify({ name, phone, niche, initData: tg?.initData || "" })
    });
    const j = await r.json();
    if(j.ok){
      app.innerHTML = `<div class="ok"><h2>Заявка принята</h2><p>Еркин свяжется с вами лично сегодня вечером. Место и условия придержим.</p><button class="cta" id="backBtn">В начало</button></div>`;
      document.getElementById("backBtn").onclick = () => go(screens.showroom);
    } else { throw new Error(j.error||"fail"); }
  }catch(e){ tg?.showAlert?.("Не отправилось, попробуйте ещё раз"); btn.disabled=false; btn.textContent="Отправить заявку"; }
}

go(screens.showroom);
