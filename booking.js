/**
 * booking.js — Grocott Fysioterapi
 * Beskrivelse: Alt logik for bookingflowet på booking.html
 *
 * Kilder / Referencer:
 * - MDN addEventListener  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * - MDN innerHTML         https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 * - MDN createElement     https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * - MDN querySelector     https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * - MDN forEach           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 *
 * Indhold:
 *  1. DATA    — services, ledige dage og tider, kalendernavne
 *  2. STATE   — hvad brugeren har valgt
 *  3. RENDER  — funktioner der bygger UI fra state
 *  4. EVENTS  — klik og input-handlers
 *  5. INIT    — starter booking når DOM er klar
 */


/* ============================================================
   1. DATA
   ============================================================ */

// Services — array af objects med id, name, desc, dur og price
const services = [
  { id: "s1", name: "Konsultation 15 min.",  desc: "Kortere opfølgning eller enkelt spørgsmål",      dur: "15 min.",  price: "225 kr."    },
  { id: "s2", name: "Konsultation 30 min.",  desc: "Fokuseret behandling af et specifikt problem",   dur: "30 min.",  price: "400 kr."    },
  { id: "s3", name: "Konsultation 45 min.",  desc: "Tilpasset behandling af specifikke gener",       dur: "45 min.",  price: "500 kr."    },
  { id: "s4", name: "Konsultation 60 min.",  desc: "Fuld undersøgelse og behandling",                dur: "60 min.",  price: "650 kr."    },
  { id: "s5", name: "Konsultation 90 min.",  desc: "Grundig første konsultation inkl. anamnese",     dur: "90 min.",  price: "850 kr."    },
  { id: "s6", name: "Konsultation 120 min.", desc: "Udvidet forløb til komplekse problemstillinger", dur: "120 min.", price: "1.100 kr."  },
  { id: "s7", name: "Akuttid",               desc: "Pludselig opståede smerter — tillæg +300 kr.",   dur: "Variabel", price: "Fra 700 kr." },
];

// Ledige dage i maj 2026 — array af tal (dagnumre)
const availableDays = [14, 15, 16, 18, 19, 20, 22, 23, 25, 26, 27, 28, 29, 30];

// Ledige tider pr. dag — object: dagnummer som key, array af tidsstrenge som value
const availableTimes = {
  14: ["13:30", "14:00", "14:30", "17:30", "18:00", "18:30", "19:00", "19:30"],
  15: ["08:00", "09:00", "10:30", "13:00", "14:00", "15:00", "16:00"],
  16: ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00"],
  18: ["09:00", "10:00", "11:30", "13:00", "14:00"],
  19: ["08:30", "10:00", "11:00", "13:30", "14:00", "15:30"],
  20: ["09:00", "10:30", "13:00", "14:00", "16:00", "17:30"],
  22: ["09:00", "11:00", "13:00", "14:30", "16:00"],
  23: ["10:00", "11:00", "13:00", "15:00"],
  25: ["08:00", "09:30", "11:00", "13:30", "14:00", "16:00"],
  26: ["09:00", "10:00", "11:00", "13:00", "14:00", "16:30"],
  27: ["08:30", "10:00", "11:30", "13:00", "14:30"],
  28: ["09:00", "10:30", "12:00", "13:30", "15:00"],
  29: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:30"],
  30: ["09:00", "10:30", "11:00", "13:00", "14:00"],
};

// Månedsnavne til kalenderoverskrift
const monthNames = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December"
];

// Korte månedsnavne til datostreng, fx "14. maj 2026"
const monthNamesShort = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "aug", "sep", "okt", "nov", "dec"
];

// Ugedagsnavne til kalender-header
const weekDayNames = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];


/* ============================================================
   2. STATE
   State = hvad brugeren har valgt.
   Regel: UI opdateres kun ved at ændre state og kalde render.
   ============================================================ */

const state = {
  currentStep:     1,     // Aktivt trin (1–5)
  selectedService: null,  // id på valgt service, fx "s2"
  calMonth:        4,     // Aktiv måned (0-indekseret — 4 = maj)
  calYear:         2026,  // Aktivt år
  selectedDate:    null,  // Valgt dag som tal, fx 14
  selectedDateStr: "",    // Formateret dato, fx "14. maj 2026"
  selectedTime:    null,  // Valgt tid, fx "13:30"
  contactName:     "",
  contactPhone:    "",
  contactEmail:    "",
  contactNote:     "",
};


/* ============================================================
   3. RENDER — bygger UI fra state
   ============================================================ */

/**
 * Viser det aktive trin og skjuler de andre.
 * Toggler view--active på .view-elementerne.
 */
function updateStepVisibility() {
  document.querySelectorAll(".view").forEach(function (view) {
    view.classList.remove("view--active");
  });
  const active = document.getElementById("v" + state.currentStep);
  if (active) active.classList.add("view--active");
}

/**
 * Opdaterer progressbaren øverst på siden.
 * for-loop fra 1–4 sætter BEM modifier klasser på hvert trin.
 */
function updateProgressBar() {
  for (let i = 1; i <= 4; i++) {
    const stepEl   = document.getElementById("ps" + i);
    const circleEl = document.getElementById("pc" + i);
    const lineEl   = document.getElementById("pl" + i);
    if (!stepEl) continue;

    stepEl.classList.remove("prog-step--active", "prog-step--done");
    circleEl.textContent = i;

    if (i === state.currentStep) {
      stepEl.classList.add("prog-step--active");
    } else if (i < state.currentStep) {
      stepEl.classList.add("prog-step--done");
      circleEl.textContent = "✓";
    }

    if (lineEl) lineEl.classList.toggle("prog-line--done", i < state.currentStep);
  }
}

/**
 * Renderer listen af services i trin 1.
 * forEach loop opretter et DOM-element for hver service.
 */
function renderServices() {
  const listEl = document.getElementById("serviceList");
  if (!listEl) return;
  listEl.innerHTML = "";

  services.forEach(function (service) {
    const isSelected = state.selectedService === service.id;
    const card = document.createElement("div");
    card.className = "service" + (isSelected ? " service--selected" : "");

    card.innerHTML =
      '<div class="service__check">' +
        (isSelected ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : "") +
      "</div>" +
      '<div class="service__info">' +
        '<div class="service__name">' + service.name + "</div>" +
        '<div class="service__desc">' + service.desc + "</div>" +
      "</div>" +
      '<div class="service__meta">' +
        '<div class="service__price">' + service.price + "</div>" +
        '<div class="service__dur">'   + service.dur   + "</div>" +
      "</div>";

    // Klik → gem valg i state og re-render
    card.addEventListener("click", function () {
      state.selectedService = service.id;
      renderServices();
      document.getElementById("svcNext").disabled = false;
      updateSidebar();
    });

    listEl.appendChild(card);
  });
}

/**
 * Renderer kalenderen for den aktive måned.
 * Bygger et 7-kolonne gitter med ugedagsnavne og dagnumre.
 */
function renderCalendar() {
  const gridEl  = document.getElementById("calGrid");
  const labelEl = document.getElementById("calMonthLabel");
  if (!gridEl || !labelEl) return;

  labelEl.textContent = monthNames[state.calMonth] + " " + state.calYear;
  gridEl.innerHTML = "";

  // Ugedagsnavne øverst i gitteret
  weekDayNames.forEach(function (name) {
    const wday = document.createElement("div");
    wday.className   = "cal__wday";
    wday.textContent = name;
    gridEl.appendChild(wday);
  });

  // getDay() giver 0=søndag, (+ 6) % 7 konverterer til mandag=0
  const firstDay        = new Date(state.calYear, state.calMonth, 1).getDay();
  const offset          = (firstDay + 6) % 7;
  const daysInMonth     = new Date(state.calYear, state.calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(state.calYear, state.calMonth, 0).getDate();

  // Grå dage fra forrige måned
  for (let i = 0; i < offset; i++) {
    const cell = document.createElement("div");
    cell.className   = "cal__cell";
    cell.textContent = daysInPrevMonth - offset + 1 + i;
    gridEl.appendChild(cell);
  }

  // Dage i aktuel måned
  for (let day = 1; day <= daysInMonth; day++) {
    const isAvailable = availableDays.includes(day) && state.calMonth === 4 && state.calYear === 2026;
    const isSelected  = state.selectedDate === day;
    const isToday     = state.calMonth === 4 && state.calYear === 2026 && day === 14;

    const cell = document.createElement("div");
    cell.className   = "cal__cell cal__cell--in";
    cell.textContent = day;

    if (isSelected)             cell.classList.add("cal__cell--selected");
    else if (isAvailable)       cell.classList.add("cal__cell--avail");
    if (isToday && !isSelected) cell.classList.add("cal__cell--today");

    if (isAvailable) {
      cell.addEventListener("click", function () { selectDate(day); });
    }
    gridEl.appendChild(cell);
  }

  // Grå dage fra næste måned
  const remaining = (offset + daysInMonth) % 7;
  if (remaining) {
    for (let i = 1; i <= 7 - remaining; i++) {
      const cell = document.createElement("div");
      cell.className   = "cal__cell";
      cell.textContent = i;
      gridEl.appendChild(cell);
    }
  }
}

/**
 * Renderer ledige tidsknapper for den valgte dato.
 */
function renderTimes() {
  const section = document.getElementById("timesSection");
  if (!section) return;

  if (!state.selectedDate) {
    section.innerHTML = '<div class="times__placeholder">← Vælg en dato<br>for at se ledige tider</div>';
    return;
  }

  const times = availableTimes[state.selectedDate] || [];
  if (!times.length) {
    section.innerHTML = '<div class="times__placeholder">Ingen ledige tider denne dag</div>';
    return;
  }

  // Byg én knap per ledig tid med map
  const btns = times.map(function (time) {
    const sel = state.selectedTime === time;
    return '<button class="time' + (sel ? " time--selected" : "") +
           '" data-time="' + time + '" type="button">' + time + "</button>";
  }).join("");

  section.innerHTML =
    '<div class="times__label">Ledige tider — <span class="times__date">' + state.selectedDateStr + "</span></div>" +
    '<div class="times__grid">' + btns + "</div>";

  // Tilføj click events til de nye tidsknapper
  section.querySelectorAll("[data-time]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.selectedTime = btn.getAttribute("data-time");
      renderTimes();
      document.getElementById("dtNext").disabled = false;
      updateSidebar();
    });
  });
}

/**
 * Renderer bekræftelsesoversigten i trin 4.
 */
function renderConfirm() {
  const container = document.getElementById("confirmDetails");
  if (!container) return;
  const service = services.find(function (s) { return s.id === state.selectedService; });
  if (!service) return;

  // Hjælpefunktion: én bekræftelsesrække
  const row = function (key, val) {
    return '<div class="confirm-row"><span class="confirm-row__k">' + key +
           '</span><span class="confirm-row__v">' + val + "</span></div>";
  };

  container.innerHTML =
    row("Behandling", service.name) +
    row("Varighed",   service.dur) +
    row("Dato",       state.selectedDateStr) +
    row("Klokkeslæt", state.selectedTime) +
    row("Navn",       state.contactName) +
    row("Telefon",    state.contactPhone) +
    row("E-mail",     state.contactEmail) +
    (state.contactNote ? row("Bemærkning", state.contactNote) : "") +
    '<div class="confirm-total"><span>Pris</span><span>' + service.price + "</span></div>" +
    '<div class="btn-row">' +
      '<button class="btn-ghost" type="button" onclick="goTo(3)">← Tilbage</button>' +
      '<button class="btn-primary" type="button" onclick="submitBooking()">Bekræft booking</button>' +
    "</div>";
}

/**
 * Opdaterer booking-opsummeringen i sidebjælken.
 */
function updateSidebar() {
  const container = document.getElementById("bookingSummary");
  if (!container) return;
  const service = services.find(function (s) { return s.id === state.selectedService; });

  if (!service) { container.innerHTML = ""; return; }

  let html =
    '<div class="bsum">' +
    '<div class="bsum__title">Din booking</div>' +
    '<div class="bsum__row"><span>Behandling</span><strong>' + service.name  + "</strong></div>" +
    '<div class="bsum__row"><span>Pris</span><strong>'       + service.price + "</strong></div>";

  if (state.selectedDateStr) html += '<div class="bsum__row"><span>Dato</span><strong>' + state.selectedDateStr + "</strong></div>";
  if (state.selectedTime)    html += '<div class="bsum__row"><span>Tid</span><strong>'  + state.selectedTime    + "</strong></div>";
  if (state.contactName)     html += '<div class="bsum__row"><span>Navn</span><strong>' + state.contactName     + "</strong></div>";

  html += "</div>";
  container.innerHTML = html;
}


/* ============================================================
   4. EVENTS — klik og input-handlers
   ============================================================ */

/**
 * Går til et bestemt trin.
 * Validerer at betingelserne er opfyldt inden trinnet skiftes.
 * Eksponeres til window så onclick="goTo(2)" i HTML virker.
 */
function goTo(stepNumber) {
  if (stepNumber === 2 && !state.selectedService) return;
  if (stepNumber === 3 && (!state.selectedDate || !state.selectedTime)) return;

  if (stepNumber === 4) {
    state.contactName  = document.getElementById("fName").value.trim();
    state.contactPhone = document.getElementById("fPhone").value.trim();
    state.contactEmail = document.getElementById("fEmail").value.trim();
    state.contactNote  = document.getElementById("fNote").value.trim();
    if (!state.contactName || !state.contactPhone || !state.contactEmail) return;
    renderConfirm();
  }

  state.currentStep = stepNumber;
  updateStepVisibility();
  updateProgressBar();
  updateSidebar();
  window.scrollTo(0, 0);
}

/**
 * Skifter måneden i kalendervisningen.
 * Eksponeres til window da den kaldes fra onclick i HTML.
 */
function changeMonth(direction) {
  state.calMonth += direction;
  if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
  else if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
  renderCalendar();
}

/**
 * Gemmer valgt dato i state og viser ledige tider.
 */
function selectDate(day) {
  state.selectedDate    = day;
  state.selectedTime    = null;
  state.selectedDateStr = day + ". " + monthNamesShort[state.calMonth] + " " + state.calYear;
  renderCalendar();
  renderTimes();
  document.getElementById("dtNext").disabled = true;
  updateSidebar();
}

/**
 * Validerer kontaktformularen i realtid.
 * Aktiverer "fortsæt"-knappen når alle tre felter er udfyldt.
 */
function checkContact() {
  const name  = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const email = document.getElementById("fEmail").value.trim();
  const btn   = document.getElementById("contactNext");
  if (btn) btn.disabled = !(name && phone && email);
}

/**
 * Viser trin 5 (success) og udfylder bekræftelseskortet.
 * Eksponeres til window da den kaldes fra onclick i HTML.
 */
function submitBooking() {
  const service  = services.find(function (s) { return s.id === state.selectedService; });
  const emailEl  = document.getElementById("confirmEmail");
  const detailEl = document.getElementById("successDetails");

  if (emailEl) emailEl.textContent = state.contactEmail;

  if (detailEl && service) {
    detailEl.innerHTML =
      '<div class="bsum__title">Din booking</div>' +
      '<div class="confirm-row"><span class="confirm-row__k">Behandling</span><span class="confirm-row__v">' + service.name + "</span></div>" +
      '<div class="confirm-row"><span class="confirm-row__k">Dato & tid</span><span class="confirm-row__v">' + state.selectedDateStr + " · " + state.selectedTime + "</span></div>" +
      '<div class="confirm-row"><span class="confirm-row__k">Navn</span><span class="confirm-row__v">' + state.contactName + "</span></div>";
  }

  state.currentStep = 5;
  updateStepVisibility();
}

/**
 * Genindlæser siden — nulstiller hele bookingflowet.
 * Eksponeres til window da den kaldes fra onclick i HTML.
 */
function restart() {
  window.location.reload();
}


/* ============================================================
   5. INIT — starter booking når DOM er klar
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Kun aktiv på booking.html — stop hvis serviceList ikke findes
  if (!document.getElementById("serviceList")) return;

  // Første render
  renderServices();
  renderCalendar();
  updateStepVisibility();

  // Realtidsvalidering af kontaktformular
  ["fName", "fPhone", "fEmail"].forEach(function (id) {
    const field = document.getElementById(id);
    if (field) field.addEventListener("input", checkContact);
  });

  // Eksponér til window så onclick="" i booking.html virker
  window.goTo          = goTo;
  window.changeMonth   = changeMonth;
  window.submitBooking = submitBooking;
  window.restart       = restart;
});
