const tg = window.Telegram?.WebApp;
tg?.ready(); tg?.expand();
const app = document.getElementById("app");
const sub = document.getElementById("hdSub");
const state = { niche: null, nicheObj: null, demoUrl: null, demoLabel: null };

function go(screen){ window.scrollTo(0,0); screen(); }

// В каждой нише — варианты по формату (мини-апп / сайт). Только реальные демо.
const NICHES = [
  { key:"beauty", name:"Бьюти", img:"img/beauty.jpg", demos:[
    { kind:"Мини-апп", url:"https://drelima-miniapp.vercel.app" },
    { kind:"Сайт",     url:"https://velvet-studio-eight.vercel.app" },
  ]},
  { key:"shop", name:"Магазин", img:"img/shop.jpg", demos:[
    { kind:"Сайт — одежда",   url:"https://nura-store-liard.vercel.app" },
    { kind:"Сайт — косметика", url:"https://glowseoul-ruby.vercel.app" },
  ]},
  { key:"services", name:"Услуги", img:"img/services.jpg", demos:[
    { kind:"Мини-апп", url:"https://app-ivory-five-19.vercel.app" },
    { kind:"Сайт",     url:"https://symbat-website.vercel.app" },
  ]},
  { key:"education", name:"Обучение", img:"img/education.jpg", demos:[
    { kind:"Мини-апп", url:"https://agenio-website.vercel.app/miniapp.html" },
    { kind:"Сайт",     url:"https://studyme-self.vercel.app" },
  ]},
];

const screens = {};

screens.showroom = function(){
  sub.textContent = "Мини-аппы и сайты для бизнеса";
  tg?.BackButton?.hide();
  const tiles = NICHES.map(n =>
    `<div class="tile" data-key="${n.key}"><img src="${n.img}" alt=""><div class="ov"></div><div class="nm">${n.name}</div></div>`
  ).join("");
  app.innerHTML = `
    <p class="lbl">Выбери свою сферу — покажу живые примеры</p>
    <div class="grid2">${tiles}</div>
    <button class="cta sticky" id="wantBtn">Хочу себе такой</button>`;
  app.querySelectorAll(".tile").forEach(t => t.onclick = () => {
    state.nicheObj = NICHES.find(x => x.key === t.dataset.key);
    state.niche = state.nicheObj.name;
    go(screens.niche);
  });
  document.getElementById("wantBtn").onclick = () => go(screens.template);
};

screens.niche = function(){
  const n = state.nicheObj;
  sub.textContent = `Пример: ${n.name}`;
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(screens.showroom));
  const opts = n.demos.map((d,i) =>
    `<div class="opt" data-i="${i}"><img class="th" src="${n.img}" alt=""><div><div class="ot">${d.kind}</div><div class="os">посмотреть вживую</div></div><div class="ar">→</div></div>`
  ).join("");
  app.innerHTML = `
    <p class="lbl">Два формата — посмотри оба и выбери</p>
    ${opts}
    <button class="cta sticky" id="mineBtn">Сделать такой мне</button>`;
  app.querySelectorAll(".opt").forEach(o => o.onclick = () => {
    const d = n.demos[+o.dataset.i];
    state.demoUrl = d.url;
    state.demoLabel = `${n.name} · ${d.kind}`;
    go(screens.demo);
  });
  document.getElementById("mineBtn").onclick = () => go(screens.lead);
};

screens.demo = function(){
  sub.textContent = state.demoLabel || "Живой пример";
  tg?.BackButton?.show(); tg?.BackButton?.onClick(()=>go(screens.niche));
  app.innerHTML = `
    <div class="demoview">
      <div class="dbar"><button class="back" id="backNiche">← Назад</button><span>${state.demoLabel||""}</span></div>
      <iframe src="${state.demoUrl}" title="demo" loading="lazy"></iframe>
      <button class="cta" id="wantThis">Сделать такой мне</button>
    </div>`;
  document.getElementById("backNiche").onclick = () => go(screens.niche);
  document.getElementById("wantThis").onclick = () => go(screens.lead);
};

screens.template = function(){
  sub.textContent = "Так это будет у тебя";
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
    <div class="phone">
      <select class="fld code" id="fCode">
        <option value="7" selected>🇰🇿 +7</option>
        <option value="7">🇷🇺 +7</option>
        <option value="996">🇰🇬 +996</option>
        <option value="998">🇺🇿 +998</option>
        <option value="992">🇹🇯 +992</option>
        <option value="1">🇺🇸 +1</option>
      </select>
      <input class="fld" id="fPhone" placeholder="706 656 7765" inputmode="tel">
    </div>
    <button class="cta ghost" id="pullPhone" style="margin-top:8px">Подтянуть телефон из Telegram</button>
    <p class="lbl">Сфера</p>
    <input class="fld" id="fNiche" placeholder="Например: салон красоты" value="${state.niche||""}">
    <p class="lbl" style="margin-top:14px">Когда удобно связаться?</p>
    <div class="chips" id="dayChips">
      <button class="chip" data-day="Сегодня">Сегодня</button>
      <button class="chip" data-day="Завтра">Завтра</button>
      <button class="chip" data-day="Послезавтра">Послезавтра</button>
      <button class="chip" data-day="На неделе">На неделе</button>
    </div>
    <p class="lbl" style="margin-top:10px">Время</p>
    <div class="chips" id="slotChips">
      <button class="chip" data-slot="утро (9–12)">🌅 Утро</button>
      <button class="chip" data-slot="день (12–17)">☀️ День</button>
      <button class="chip" data-slot="вечер (17–21)">🌆 Вечер</button>
    </div>
    <button class="cta sticky" id="sendBtn" style="margin-top:12px">Отправить заявку</button>`;

  state.day = null; state.slot = null;
  document.querySelectorAll("#dayChips .chip").forEach(c => c.onclick = () => {
    document.querySelectorAll("#dayChips .chip").forEach(x => x.classList.remove("sel"));
    c.classList.add("sel"); state.day = c.dataset.day;
  });
  document.querySelectorAll("#slotChips .chip").forEach(c => c.onclick = () => {
    document.querySelectorAll("#slotChips .chip").forEach(x => x.classList.remove("sel"));
    c.classList.add("sel"); state.slot = c.dataset.slot;
  });

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

function normalizePhone(code, raw){
  let d = (raw || "").replace(/\D/g, "");
  if(code === "7"){
    if(d.length === 11 && (d[0] === "8" || d[0] === "7")) d = d.slice(1);
  } else if(d.startsWith(code)){
    d = d.slice(code.length);
  }
  return "+" + code + d;
}

async function submitLead(){
  const name = document.getElementById("fName").value.trim();
  const rawPhone = document.getElementById("fPhone").value.trim();
  const niche = document.getElementById("fNiche").value.trim();
  if(!name || !rawPhone){ tg?.showAlert?.("Заполните имя и телефон"); return; }
  const phone = normalizePhone(document.getElementById("fCode").value, rawPhone);
  if(!state.day || !state.slot){ tg?.showAlert?.("Выберите удобный день и время"); return; }
  const time = `${state.day}, ${state.slot}`;
  const btn = document.getElementById("sendBtn"); btn.disabled = true; btn.textContent = "Отправляю…";
  try{
    const r = await fetch("/api/lead", {
      method:"POST", headers:{"content-type":"application/json"},
      body: JSON.stringify({ name, phone, niche, time, initData: tg?.initData || "" })
    });
    const j = await r.json();
    if(j.ok){
      tg?.BackButton?.hide();
      app.innerHTML = `<div class="ok"><h2>Заявка принята</h2><p>Еркин свяжется с вами в выбранное время — ${time}. Место и условия придержим.</p><button class="cta" id="backBtn">В начало</button></div>`;
      document.getElementById("backBtn").onclick = () => go(screens.showroom);
    } else { throw new Error(j.error||"fail"); }
  }catch(e){ tg?.showAlert?.("Не отправилось, попробуйте ещё раз"); btn.disabled=false; btn.textContent="Отправить заявку"; }
}

go(screens.showroom);
