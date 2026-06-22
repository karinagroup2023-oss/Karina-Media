// Tamelia — витрина магазина (фронт без бэкенда). Каталог, фильтры, корзина.
const CATS = [
  { id:"dress", name:"Платья",  word:"Платье" },
  { id:"blouse",name:"Блузки",  word:"Блуза" },
  { id:"suit",  name:"Костюмы", word:"Костюм" },
  { id:"skirt", name:"Юбки",    word:"Юбка" },
  { id:"pants", name:"Брюки",   word:"Брюки" },
  { id:"outer", name:"Верхняя одежда", word:"Пальто" },
  { id:"knit",  name:"Трикотаж",word:"Свитер" },
];
const COLORS = [
  { id:"black", name:"Чёрный",  g:["#4a4a4a","#1a1a1a"] },
  { id:"white", name:"Белый",   g:["#ffffff","#e7e1d8"] },
  { id:"beige", name:"Бежевый", g:["#e7d7c2","#c8b08e"] },
  { id:"wine",  name:"Бордовый",g:["#b4596e","#7a2a3e"] },
  { id:"blue",  name:"Синий",   g:["#7d93b8","#3b4d77"] },
  { id:"green", name:"Зелёный", g:["#8aa68f","#4e6b54"] },
  { id:"grey",  name:"Серый",   g:["#b6b3ae","#777169"] },
  { id:"powder",name:"Пудровый",g:["#e7cdd0","#cfa3a9"] },
];
const SIZES = [42,44,46,48,50,52,54,56,58,60,62];
const BRANDS = ["Zara","Tommy Hilfiger","Mango","Massimo Dutti","Calvin Klein","Guess","Reserved","H&M","LC Waikiki","Ostin"];
const NAMES = {
  dress:["Аврора","Нур","Виктория","Мадина","Флоренция","Лагуна","Камелия","Этель","Жасмин","Орхидея","Грация","Соната"],
  blouse:["Шёлк","Астана","Бриз","Перо","Лотос","Эфир","Нежность","Ваниль","Муза","Капри"],
  suit:["Бизнес","Леди","Премьер","Статус","Милан","Эталон","Капитал","Формат"],
  skirt:["Тюльпан","Волна","Карандаш","Плиссе","Латте","Феерия"],
  pants:["Комфорт","Палаццо","Чинос","Стрит","Класс","Слим"],
  outer:["Осень","Классик","Турин","Берген","Винтер","Палермо","Скандик","Дрезден"],
  knit:["Уют","Кашемир","Норвегия","Облако","Зефир","Тепло"],
};
const BASE = { dress:22000, blouse:13000, suit:38000, skirt:14000, pants:16000, outer:42000, knit:15000 };

const rnd = (s) => { const x = Math.sin(s*9301 + 49297) * 233280; return x - Math.floor(x); };
const fmt = (n) => n.toLocaleString("ru-RU");
const starts = [42,44,46], ends = [56,58,60,62];

const PRODUCTS = [];
let idc = 0;
for (const cat of CATS) {
  for (const nm of NAMES[cat.id]) {
    for (let v = 0; v < 4; v++) {
      idc++;
      const r = rnd(idc), r2 = rnd(idc*2.7), r3 = rnd(idc*5.1);
      const color = COLORS[Math.floor(r2 * COLORS.length)];
      let price = BASE[cat.id] + Math.floor(r * 20) * 1000;
      price = Math.floor(price/1000)*1000 + 900;
      const start = starts[Math.floor(r3 * starts.length)];
      const end = ends[Math.floor(rnd(idc*3.3) * ends.length)];
      const sizes = SIZES.filter(s => s >= start && s <= end);
      const brand = BRANDS[Math.floor(rnd(idc*7.7) * BRANDS.length)];
      let tag = null, old = null;
      if (r > 0.82) { tag = { t:"sale", x:"Скидка" }; old = price + (Math.floor(r3*8)+4)*1000; }
      else if (r > 0.62) tag = { t:"hit", x:"Хит" };
      else if (v === 0) tag = { t:"new", x:"Новинка" };
      PRODUCTS.push({ id:idc, cat:cat.id, brand, name:`${cat.word} «${nm}»`, price, old, sizes, color:color.id, colorName:color.name, g:color.g, tag });
    }
  }
}
const PMAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

const st = { cat:"all", brands:new Set(), sizes:new Set(), colors:new Set(), priceMax:59900, sort:"new", q:"", shown:24 };
let cart = {};
try { cart = JSON.parse(localStorage.getItem("tamelia_cart") || "{}"); } catch(e) { cart = {}; }
const saveCart = () => localStorage.setItem("tamelia_cart", JSON.stringify(cart));

const $ = (s) => document.querySelector(s);

// ---- Рендер фильтров ----
function buildFilters() {
  const cl = $("#catList");
  const counts = {}; PRODUCTS.forEach(p => counts[p.cat] = (counts[p.cat]||0)+1);
  cl.innerHTML = `<div class="fcat on" data-cat="all">Все <span class="n">${PRODUCTS.length}</span></div>` +
    CATS.map(c => `<div class="fcat" data-cat="${c.id}">${c.name} <span class="n">${counts[c.id]||0}</span></div>`).join("");
  cl.querySelectorAll(".fcat").forEach(el => el.onclick = () => {
    cl.querySelectorAll(".fcat").forEach(x => x.classList.remove("on"));
    el.classList.add("on"); st.cat = el.dataset.cat; st.shown = 24; render();
  });

  $("#brandList").innerHTML = BRANDS.map(b => `<button class="fopt" data-brand="${b}">${b}</button>`).join("");
  $("#brandList").querySelectorAll(".fopt").forEach(el => el.onclick = () => {
    const b = el.dataset.brand; el.classList.toggle("on");
    st.brands.has(b) ? st.brands.delete(b) : st.brands.add(b); st.shown = 24; render();
  });

  $("#sizeList").innerHTML = SIZES.map(s => `<button class="fopt" data-size="${s}">${s}</button>`).join("");
  $("#sizeList").querySelectorAll(".fopt").forEach(el => el.onclick = () => {
    const s = +el.dataset.size; el.classList.toggle("on");
    st.sizes.has(s) ? st.sizes.delete(s) : st.sizes.add(s); st.shown = 24; render();
  });

  $("#colorList").innerHTML = COLORS.map(c =>
    `<div class="swatch" title="${c.name}" data-color="${c.id}" style="background:linear-gradient(145deg,${c.g[0]},${c.g[1]})"></div>`).join("");
  $("#colorList").querySelectorAll(".swatch").forEach(el => el.onclick = () => {
    const c = el.dataset.color; el.classList.toggle("on");
    st.colors.has(c) ? st.colors.delete(c) : st.colors.add(c); st.shown = 24; render();
  });
}

// ---- Фильтрация ----
function getList() {
  let list = PRODUCTS.filter(p => {
    if (st.cat !== "all" && p.cat !== st.cat) return false;
    if (st.brands.size && !st.brands.has(p.brand)) return false;
    if (st.sizes.size && !p.sizes.some(s => st.sizes.has(s))) return false;
    if (st.colors.size && !st.colors.has(p.color)) return false;
    if (p.price > st.priceMax) return false;
    if (st.q && !(p.name.toLowerCase().includes(st.q) || p.brand.toLowerCase().includes(st.q))) return false;
    return true;
  });
  if (st.sort === "cheap") list = list.slice().sort((a,b) => a.price - b.price);
  else if (st.sort === "exp") list = list.slice().sort((a,b) => b.price - a.price);
  return list;
}

function card(p) {
  const tag = p.tag ? `<span class="tag ${p.tag.t}">${p.tag.x}</span>` : "";
  const old = p.old ? `<span class="old">${fmt(p.old)} ₸</span>` : "";
  const sizes = p.sizes.map(s => `<span class="szb">${s}</span>`).join("");
  const opts = p.sizes.map(s => `<option value="${s}">${s}</option>`).join("");
  return `<div class="prod">
    <div class="ph" style="background:linear-gradient(160deg,${p.g[0]},${p.g[1]})">${tag}</div>
    <div class="info">
      <div class="brand">${p.brand}</div>
      <div class="nm">${p.name}</div>
      <div class="col">Цвет: ${p.colorName}</div>
      <div class="prow"><span class="pr">${fmt(p.price)} ₸</span>${old}</div>
      <div class="sizes">${sizes}</div>
      <div class="add">
        <select aria-label="Размер">${opts}</select>
        <button data-id="${p.id}">В корзину</button>
      </div>
    </div>
  </div>`;
}

function render() {
  const list = getList();
  const box = $("#products");
  $("#count").textContent = `Найдено: ${list.length}`;
  if (!list.length) { box.innerHTML = `<div class="empty">Ничего не найдено. Попробуйте сбросить фильтры.</div>`; $("#more").style.display = "none"; return; }
  const slice = list.slice(0, st.shown);
  box.innerHTML = slice.map(card).join("");
  $("#more").style.display = list.length > st.shown ? "" : "none";
  box.querySelectorAll(".add button").forEach(btn => btn.onclick = () => {
    const sel = btn.parentElement.querySelector("select");
    addToCart(+btn.dataset.id, +sel.value, btn);
  });
}

// ---- Корзина ----
function cartQty() { return Object.values(cart).reduce((a,i) => a + i.qty, 0); }
function cartTotal() { return Object.values(cart).reduce((a,i) => a + PMAP[i.id].price * i.qty, 0); }

function addToCart(id, size, btn) {
  const key = id + "|" + size;
  cart[key] = cart[key] || { id, size, qty:0 };
  cart[key].qty++; saveCart(); updateCartCount(); renderCart();
  if (btn) { btn.textContent = "✓ В корзине"; btn.classList.add("added"); setTimeout(() => { btn.textContent = "В корзину"; btn.classList.remove("added"); }, 1200); }
}
function updateCartCount() {
  const n = cartQty(), el = $("#cartCount");
  el.textContent = n; el.style.display = n ? "flex" : "none";
}
function renderCart() {
  const items = Object.entries(cart);
  const box = $("#citems"), foot = $("#cfoot");
  if (!items.length) { box.innerHTML = `<div class="cempty">Корзина пуста.<br>Добавьте понравившиеся модели.</div>`; foot.innerHTML = ""; return; }
  box.innerHTML = items.map(([key, it]) => {
    const p = PMAP[it.id];
    return `<div class="citem">
      <div class="th" style="background:linear-gradient(160deg,${p.g[0]},${p.g[1]})"></div>
      <div>
        <div class="cn">${p.name}</div>
        <div class="cmeta">${p.brand} · размер ${it.size} · ${p.colorName}</div>
        <div class="qty"><button data-k="${key}" data-d="-1">−</button><span>${it.qty}</span><button data-k="${key}" data-d="1">+</button></div>
        <button class="crm" data-rm="${key}">Удалить</button>
      </div>
      <div class="cp">${fmt(p.price * it.qty)} ₸</div>
    </div>`;
  }).join("");
  foot.innerHTML = `<div class="total"><span>Итого</span><b>${fmt(cartTotal())} ₸</b></div>
    <button class="btn btn-wa" id="checkout" style="width:100%;justify-content:center">Оформить в WhatsApp →</button>
    <p style="color:var(--muted);font-size:12px;text-align:center;margin-top:10px">Оплата Kaspi · доставка по Казахстану</p>`;
  box.querySelectorAll(".qty button").forEach(b => b.onclick = () => {
    const it = cart[b.dataset.k]; if (!it) return;
    it.qty += (+b.dataset.d); if (it.qty < 1) delete cart[b.dataset.k];
    saveCart(); updateCartCount(); renderCart();
  });
  box.querySelectorAll(".crm").forEach(b => b.onclick = () => { delete cart[b.dataset.rm]; saveCart(); updateCartCount(); renderCart(); });
  $("#checkout").onclick = checkout;
}
function checkout() {
  const lines = Object.values(cart).map(it => { const p = PMAP[it.id]; return `• ${p.brand} ${p.name} (р.${it.size}) ×${it.qty} — ${fmt(p.price*it.qty)} ₸`; });
  const msg = `Здравствуйте! Хочу оформить заказ в Tamelia:\n\n${lines.join("\n")}\n\nИтого: ${fmt(cartTotal())} ₸`;
  window.open("https://wa.me/77027315093?text=" + encodeURIComponent(msg), "_blank");
}

// ---- Управление (поиск, сортировка, цена, дроверы) ----
$("#search").oninput = (e) => { st.q = e.target.value.trim().toLowerCase(); st.shown = 24; render(); };
$("#sort").onchange = (e) => { st.sort = e.target.value; render(); };
$("#priceRange").oninput = (e) => { st.priceMax = +e.target.value; $("#priceVal").textContent = fmt(st.priceMax) + " ₸"; st.shown = 24; render(); };
$("#more").onclick = () => { st.shown += 24; render(); };
$("#clearFilters").onclick = () => {
  st.cat = "all"; st.brands.clear(); st.sizes.clear(); st.colors.clear(); st.priceMax = 59900; st.q = "";
  st.shown = 24; $("#search").value = ""; $("#priceRange").value = 59900; $("#priceVal").textContent = "59 900 ₸";
  buildFilters(); render();
};

const overlay = $("#overlay"), filters = $("#filters"), cartEl = $("#cart");
function openDrawer(el) { el.classList.add("on"); overlay.classList.add("on"); document.body.classList.add("lock"); }
function closeDrawers() { filters.classList.remove("on"); cartEl.classList.remove("on"); overlay.classList.remove("on"); document.body.classList.remove("lock"); }
$("#openCart").onclick = () => { renderCart(); openDrawer(cartEl); };
$("#closeCart").onclick = closeDrawers;
$("#openFilters").onclick = () => openDrawer(filters);
$("#openFilters2").onclick = () => openDrawer(filters);
overlay.onclick = closeDrawers;

// ---- Старт ----
buildFilters();
render();
updateCartCount();
