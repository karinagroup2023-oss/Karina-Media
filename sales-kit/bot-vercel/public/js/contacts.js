// Форма заявки сайта KARINA Media → /api/web-lead
(function(){
  const form = document.getElementById("leadForm");
  if(!form) return;
  const sel = { product:null, day:null, slot:null };

  function group(id, key){
    document.querySelectorAll("#"+id+" .chip").forEach(c => c.addEventListener("click", () => {
      document.querySelectorAll("#"+id+" .chip").forEach(x => x.classList.remove("sel"));
      c.classList.add("sel"); sel[key] = c.dataset.v;
    }));
  }
  group("prodChips","product"); group("dayChips","day"); group("slotChips","slot");

  function normalizePhone(code, raw){
    let d = (raw||"").replace(/\D/g,"");
    if(code === "7"){ if(d.length===11 && (d[0]==="8"||d[0]==="7")) d = d.slice(1); }
    else if(d.startsWith(code)){ d = d.slice(code.length); }
    return "+" + code + d;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fName").value.trim();
    const rawPhone = document.getElementById("fPhone").value.trim();
    if(!name || !rawPhone){ alert("Заполните имя и телефон"); return; }
    const phone = normalizePhone(document.getElementById("fCode").value, rawPhone);
    const time = (sel.day && sel.slot) ? `${sel.day}, ${sel.slot}` : null;
    const payload = {
      name, phone,
      product: sel.product,
      niche: document.getElementById("fNiche").value.trim() || null,
      time,
      company: document.getElementById("fCompany").value,
    };
    const btn = document.getElementById("sendBtn");
    btn.disabled = true; btn.textContent = "Отправляю…";
    try{
      const r = await fetch("/api/web-lead", {
        method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify(payload),
      });
      const j = await r.json();
      if(!j.ok) throw new Error("fail");
      document.getElementById("formCard").innerHTML =
        `<div style="text-align:center;padding:24px 6px">
          <div style="font-size:42px">🎉</div>
          <h3 style="margin:12px 0 8px">Заявка принята!</h3>
          <p style="color:var(--muted)">Свяжемся с вами${time ? " — " + time : " сегодня"}. Покажем пример под вашу нишу и посчитаем стоимость.</p>
        </div>`;
    }catch(err){
      alert("Не отправилось, попробуйте ещё раз");
      btn.disabled = false; btn.textContent = "Отправить заявку →";
    }
  });
})();
