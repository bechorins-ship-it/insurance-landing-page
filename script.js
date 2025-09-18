// חשיפה גלובלית כדי ש-onclick יעבוד
window.calculate = function () {
  const age = parseInt(document.getElementById("age")?.value) || 30;
  const smoker = document.getElementById("smoker")?.value === "yes";
  const loan = parseInt(document.getElementById("loan")?.value) || 500000;
  const years = parseInt(document.getElementById("years")?.value) || 20;

  let base = loan / years / 100;
  let factor = smoker ? 1.3 : 1;
  let price = base * factor + age * 0.5;
  let min = Math.round(price * 0.9);
  let max = Math.round(price * 1.1);

  const el = document.getElementById("result");
  if (el) el.textContent = `טווח חודשי לדוגמה: ${min} ₪ - ${max} ₪`;
};

document.addEventListener("DOMContentLoaded", function () {
  // ===== חיבור submit לטופס בפועל (לא ל-div עם id="form") =====
  const realForm = document.querySelector(".form-card form");
  if (realForm) {
    realForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("✅ הטופס נשלח (דמו)");
    });
  }

  // ===== כפתורי בחירה (מין/עישון) =====
  function initToggle(parent = document) {
    parent.querySelectorAll(".choice-group").forEach(group => {
      const buttons = group.querySelectorAll(".choice-btn");
      const hidden = group.querySelector('input[type="hidden"]');
      if (!hidden) return;
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          buttons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          hidden.value = btn.getAttribute("data-value");
        });
      });
    });
  }
  initToggle(document);

  // ===== בן/בת זוג =====
  let partnerAdded = false;
  const addPartnerBtn = document.getElementById("add-partner");
  const partnerHolder = document.getElementById("partner-section");

  if (addPartnerBtn && partnerHolder) {
    addPartnerBtn.addEventListener("click", function () {
      if (partnerAdded) return;
      partnerAdded = true;
      addPartnerBtn.style.display = "none";

      partnerHolder.innerHTML = `
        <div id="partner-fields">
          <h3>פרטי בן/בת זוג</h3>
          <div class="form-row">
            <input type="text" placeholder="שם מלא" required>
            <input type="tel" placeholder="טלפון" pattern="(\\+972\\d{8,9}|972\\d{8,9}|0\\d{8,9})" required>
          </div>
          <div class="form-row">
            <input type="number" placeholder="גיל" min="18" max="70" required>
          </div>
          <div class="form-row choice-group">
            <label>בחר מין:</label>
            <div class="choices">
              <button type="button" class="choice-btn" data-value="male">👨 גבר</button>
              <button type="button" class="choice-btn" data-value="female">👩 אישה</button>
            </div>
            <input type="hidden" name="gender2" id="gender2" required>
          </div>
          <div class="form-row choice-group">
            <label>מצב עישון:</label>
            <div class="choices">
              <button type="button" class="choice-btn" data-value="smoker">🚬 מעשן</button>
              <button type="button" class="choice-btn" data-value="nonsmoker">🚭 לא מעשן</button>
            </div>
            <input type="hidden" name="smoker2" id="smoker2" required>
          </div>
          <button type="button" id="remove-partner" class="btn-add" style="background:#ffdddd; color:#900;">❌ הסר בן זוג</button>
        </div>`;
      initToggle(partnerHolder);

      document.getElementById("remove-partner").addEventListener("click", () => {
        partnerHolder.innerHTML = "";
        partnerAdded = false;
        addPartnerBtn.style.display = "block";
      });
    });
  }

  // ===== סכום ביטוח: ±10K ו-±100K עם פורמט פסיקים =====
  const amountInput = document.getElementById("insuranceAmount");
  const btns = {
    sub10: document.getElementById("sub10k"),
    add10: document.getElementById("add10k"),
    sub100: document.getElementById("sub100k"),
    add100: document.getElementById("add100k"),
  };

  function parseNum(v) { return parseInt(String(v).replace(/,/g, "")) || 0; }
  function clamp(n) { return Math.min(6000000, Math.max(0, n)); }
  function setVal(n) {
    if (!amountInput) return;
    amountInput.value = clamp(n).toLocaleString();
  }

  if (amountInput) {
    // ערך התחלתי (שומר על 300,000 אם כתוב כבר)
    setVal(parseNum(amountInput.value || 300000));

    // חיבור ארבעת הכפתורים
    [
      [btns.sub10, -10000],
      [btns.add10,  10000],
      [btns.sub100, -100000],
      [btns.add100,  100000],
    ].forEach(([btn, delta]) => {
      if (btn) btn.addEventListener("click", () => {
        setVal(parseNum(amountInput.value) + delta);
      });
    });

    // הקלדה חופשית עם פסיקים
    amountInput.addEventListener("input", () => {
      setVal(parseNum(amountInput.value));
    });
  }

  // ===== הגבלת גיל 18–70 =====
  const ageInput = document.querySelector('input[name="age"]');
  if (ageInput) {
    ageInput.addEventListener("change", () => {
      let v = parseInt(ageInput.value) || 18;
      if (v < 18) v = 18;
      if (v > 70) v = 70;
      ageInput.value = v;
    });
  }
});
