/**
 * app.js — Grocott Fysioterapi Booking System
 * 
 * Kilder / Referencer:
 * - MDN Web Docs: addEventListener https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * - MDN Web Docs: classList https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * - MDN Web Docs: innerHTML https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 * - MDN Web Docs: querySelector https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * 
 * Struktur:
 * 1. Data (services, tider, åbningstider)
 * 2. State (hvad er valgt)
 * 3. Funktioner (render, events, navigation)
 * 4. Init (start programmet)
 */


/* ============================================================
   1. DATA
   Al data der vises i UI'et samles her som arrays og objects
   ============================================================ */

/**
 * Services — array af objects
 * Hver service har: id, name, desc, dur, price
 */
const services = [
  {
    id: "s1",
    name: "Konsultation 15 min.",
    desc: "Kortere opfølgning eller enkelt spørgsmål",
    dur: "15 min.",
    price: "225 kr."
  },
  {
    id: "s2",
    name: "Konsultation 30 min.",
    desc: "Fokuseret behandling af et specifikt problem",
    dur: "30 min.",
    price: "400 kr."
  },
  {
    id: "s3",
    name: "Konsultation 45 min.",
    desc: "Tilpasset behandling af specifikke gener",
    dur: "45 min.",
    price: "500 kr."
  },
  {
    id: "s4",
    name: "Konsultation 60 min.",
    desc: "Fuld undersøgelse og behandling",
    dur: "60 min.",
    price: "650 kr."
  },
  {
    id: "s5",
    name: "Konsultation 90 min.",
    desc: "Grundig første konsultation inkl. anamnese",
    dur: "90 min.",
    price: "850 kr."
  },
  {
    id: "s6",
    name: "Konsultation 120 min.",
    desc: "Udvidet forløb til komplekse problemstillinger",
    dur: "120 min.",
    price: "1.100 kr."
  },
  {
    id: "s7",
    name: "Akuttid",
    desc: "Pludselig opståede smerter — tillæg +300 kr.",
    dur: "Variabel",
    price: "Fra 700 kr."
  }
];

/**
 * Ledige dage i maj 2026 — array af tal (dagnumre)
 */
const availableDays = [14, 15, 16, 18, 19, 20, 22, 23, 25, 26, 27, 28, 29, 30];

/**
 * Ledige tider pr. dag — object med dagnummer som key
 * Værdi er et array af tidsstrenge
 */
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
  30: ["09:00", "10:30", "11:00", "13:00", "14:00"]
};

/** Månedsnavne til kalenderen */
const monthNames = [
  "Januar", "Februar", "Marts", "April", "Maj", "Juni",
  "Juli", "August", "September", "Oktober", "November", "December"
];

/** Ugedagsnavne til kalenderen */
const weekDayNames = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];


/* ============================================================
   2. STATE
   State = hvad brugeren har valgt / hvor i flowet de er
   Ændringer i state → opdatering af UI
   ============================================================ */

const state = {
  currentStep: 1,       // Hvilket trin er aktivt (1–5)
  selectedService: null, // id på valgt service (string eller null)
  calMonth: 4,          // Aktiv måned i kalender (0-indexeret, 4 = maj)
  calYear: 2026,        // Aktivt år i kalender
  selectedDate: null,   // Valgt dag som tal (fx 14) eller null
  selectedDateStr: "",  // Formateret datostreng til visning (fx "14. maj 2026")
  selectedTime: null,   // Valgt tid som streng (fx "13:30") eller null
  contactName: "",      // Navn fra kontaktformular
  contactPhone: "",     // Telefon fra kontaktformular
  contactEmail: "",     // Email fra kontaktformular
  contactNote: ""       // Valgfri besked fra kontaktformular
};


/* ============================================================
   3A. PAGE NAVIGATION
   Skifter mellem forsiden (home) og bookingsiden
   ============================================================ */

/**
 * Skifter synlig side
 * @param {string} pageName - "home" eller "booking"
 */
function showPage(pageName) {
  // Hent alle sider
  const pages = document.querySelectorAll(".page");

  // Fjern .active fra alle sider
  pages.forEach(function (page) {
    page.classList.remove("active");
  });

  // Tilføj .active til den valgte side
  const targetPage = document.getElementById("pag" + capitalize(pageName));
  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Scroll til toppen ved sideskift
  window.scrollTo(0, 0);

  // Nulstil booking når man går til bookingsiden fra forsiden
  if (pageName === "booking" && state.currentStep === 5) {
    restart();
  }
}

/**
 * Gør første bogstav stort
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/* ============================================================
   3B. BOOKING NAVIGATION
   Styrer trinene i bookingflowet
   ============================================================ */

/**
 * Går til et bestemt trin i bookingflowet
 * Tjekker at brugeren må hoppe til det valgte trin
 * @param {number} stepNumber - Trinnummer (1–5)
 */
function goTo(stepNumber) {
  // Trin 2 kræver valgt service
  if (stepNumber === 2 && !state.selectedService) return;

  // Trin 3 kræver valgt dato og tid
  if (stepNumber === 3 && (!state.selectedDate || !state.selectedTime)) return;

  // Trin 4 (bekræft) kræver udfyldt kontaktformular
  if (stepNumber === 4) {
    // Gem kontaktdata fra inputfelterne
    state.contactName  = document.getElementById("fName").value.trim();
    state.contactPhone = document.getElementById("fPhone").value.trim();
    state.contactEmail = document.getElementById("fEmail").value.trim();
    state.contactNote  = document.getElementById("fNote").value.trim();

    // Tjek at obligatoriske felter er udfyldt
    if (!state.contactName || !state.contactPhone || !state.contactEmail) return;

    // Render bekræftelsesvisning
    renderConfirm();
  }

  // Opdater state og UI
  state.currentStep = stepNumber;
  updateStepVisibility();
  updateProgressBar();
  updateSidebar();

  // Scroll til toppen af bookingsiden
  window.scrollTo(0, 0);
}

/**
 * Viser det aktive trin, skjuler de andre
 * Understøtter både BEM (.bview--active) og legacy (.active)
 */
function updateStepVisibility() {
  const views = document.querySelectorAll(".bview");

  views.forEach(function (view) {
    view.classList.remove("active");
    view.classList.remove("bview--active");
  });

  const activeView = document.getElementById("v" + state.currentStep);
  if (activeView) {
    activeView.classList.add("active");
    activeView.classList.add("bview--active");
  }
}

/**
 * Opdaterer progressbaren øverst på bookingsiden
 * Bruger BEM: prog-step--active og prog-step--done
 */
function updateProgressBar() {
  for (let i = 1; i <= 4; i++) {
    const stepEl   = document.getElementById("ps" + i);
    const circleEl = document.getElementById("pc" + i);
    const lineEl   = document.getElementById("pl" + i);

    if (!stepEl) continue;

    // Nulstil BEM modifier klasser
    stepEl.classList.remove("prog-step--active", "prog-step--done");
    circleEl.innerHTML = i;

    if (i === state.currentStep) {
      stepEl.classList.add("prog-step--active");
    } else if (i < state.currentStep) {
      stepEl.classList.add("prog-step--done");
      circleEl.innerHTML = "✓";
    }

    // Farv linjen
    if (lineEl) {
      if (i < state.currentStep) {
        lineEl.classList.add("prog-line--done");
      } else {
        lineEl.classList.remove("prog-line--done");
      }
    }
  }
}

/**
 * Nulstiller hele bookingflowet til start
 */
function restart() {
  // Nulstil state
  state.currentStep    = 1;
  state.selectedService = null;
  state.selectedDate   = null;
  state.selectedDateStr = "";
  state.selectedTime   = null;
  state.contactName    = "";
  state.contactPhone   = "";
  state.contactEmail   = "";
  state.contactNote    = "";
  state.calMonth       = 4;
  state.calYear        = 2026;

  // Nulstil inputfelter i kontaktformularen
  const inputs = ["fName", "fPhone", "fEmail", "fNote"];
  inputs.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // Opdater UI
  renderServices();
  renderCalendar();
  updateStepVisibility();
  updateProgressBar();
  updateSidebar();

  // Deaktivér knapper
  document.getElementById("svcNext").disabled = true;
  document.getElementById("dtNext").disabled = true;
  document.getElementById("contactNext").disabled = true;
}


/* ============================================================
   3C. SERVICE SELECTION
   Rendere listen af services og håndterer valg
   ============================================================ */

/**
 * Renderer service-listen i trin 1
 * Bruger forEach til at loope over services-arrayet og bygge HTML
 */
function renderServices() {
  const listEl = document.getElementById("serviceList");
  if (!listEl) return;

  // Nulstil listen
  listEl.innerHTML = "";

  // Loop over alle services og opret et kort for hver
  services.forEach(function (service) {
    // Opret et nyt element
    const card = document.createElement("div");

    // Sæt klasser — BEM: service-card, modifier --selected hvis valgt
    card.className = "service-card";
    if (state.selectedService === service.id) {
      card.classList.add("service-card--selected");
      // Bruges af CSS som .service-card.selected (alias)
      // BEM klasse sat ovenfor
    }

    // Bygger HTML indeni kortet
    card.innerHTML =
      '<div class="svc-check">' +
        (state.selectedService === service.id
          ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'
          : "") +
      "</div>" +
      '<div class="svc-info">' +
        '<div class="svc-name">' + service.name + "</div>" +
        '<div class="svc-desc">' + service.desc + "</div>" +
      "</div>" +
      '<div class="svc-meta">' +
        '<div class="svc-price">' + service.price + "</div>" +
        '<div class="svc-dur">' + service.dur + "</div>" +
      "</div>";

    // Tilføj click event — vælger denne service
    card.addEventListener("click", function () {
      selectService(service.id);
    });

    // Tilføj kortet til listen i DOM'en
    listEl.appendChild(card);
  });
}

/**
 * Sætter valgt service i state og opdaterer UI
 * @param {string} serviceId - id på den valgte service
 */
function selectService(serviceId) {
  // Opdater state
  state.selectedService = serviceId;

  // Re-render servicelisten så valgt service markeres
  renderServices();

  // Aktiver "fortsæt"-knappen
  document.getElementById("svcNext").disabled = false;

  // Opdater sidebar med booking-oversigt
  updateSidebar();
}


/* ============================================================
   3D. CALENDAR
   Renderer kalender og håndterer dato-valg
   ============================================================ */

/**
 * Renderer kalenderen for den aktive måned/år i state
 * Bygger et gitter med ugedage og dagnumre
 */
function renderCalendar() {
  const gridEl  = document.getElementById("calGrid");
  const labelEl = document.getElementById("calMonthLabel");
  if (!gridEl || !labelEl) return;

  // Opdater månedsoverskrift
  labelEl.textContent = monthNames[state.calMonth] + " " + state.calYear;

  // Nulstil gitteret
  gridEl.innerHTML = "";

  // Tilføj ugedagsnavne (Ma, Ti, On...)
  weekDayNames.forEach(function (dayName) {
    const dayLabel = document.createElement("div");
    dayLabel.className = "cal__wday";
    dayLabel.textContent = dayName;
    gridEl.appendChild(dayLabel);
  });

  // Beregn hvilken ugedag den 1. i måneden falder på
  // getDay() returnerer 0=søndag, 1=mandag... vi konverterer til mandag=0
  const firstDayOfMonth  = new Date(state.calYear, state.calMonth, 1).getDay();
  const offsetFromMonday = (firstDayOfMonth + 6) % 7;

  // Antal dage i aktuel og forrige måned
  const daysInMonth     = new Date(state.calYear, state.calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(state.calYear, state.calMonth, 0).getDate();

  // Tilføj grå dage fra forrige måned (udfylder starten af gitteret)
  for (let i = 0; i < offsetFromMonday; i++) {
    const cell = document.createElement("div");
    cell.className = "cal__cell";
    cell.textContent = daysInPrevMonth - offsetFromMonday + 1 + i;
    gridEl.appendChild(cell);
  }

  // Tilføj dage i aktuel måned
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "cal__cell cal__cell--in-month";
    cell.textContent = day;

    // Tjek om dagen er ledig (kun maj 2026 har ledige tider i vores data)
    const isAvailable = availableDays.includes(day)
      && state.calMonth === 4
      && state.calYear === 2026;

    const isSelected  = state.selectedDate === day;
    const isToday     = state.calMonth === 4 && state.calYear === 2026 && day === 14;

    if (isSelected) {
      cell.classList.add("cal__cell--selected");
    } else if (isAvailable) {
      cell.classList.add("cal__cell--avail");
    }

    if (isToday && !isSelected) {
      cell.classList.add("cal__cell--today");
    }

    // Klik-event kun på ledige dage
    if (isAvailable) {
      cell.addEventListener("click", function () {
        selectDate(day);
      });
    }

    gridEl.appendChild(cell);
  }

  // Udfyld resten af gitteret med dage fra næste måned
  const totalCells    = offsetFromMonday + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  for (let i = 1; i <= remainingCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cal__cell";
    cell.textContent = i;
    gridEl.appendChild(cell);
  }
}

/**
 * Skifter kalenderen til forrige eller næste måned
 * @param {number} direction - -1 for forrige, +1 for næste
 */
function changeMonth(direction) {
  state.calMonth += direction;

  // Håndter år-skift
  if (state.calMonth > 11) {
    state.calMonth = 0;
    state.calYear++;
  } else if (state.calMonth < 0) {
    state.calMonth = 11;
    state.calYear--;
  }

  renderCalendar();
}

/**
 * Sætter valgt dato i state og viser ledige tider
 * @param {number} day - Dagnummer
 */
function selectDate(day) {
  // Opdater state
  state.selectedDate = day;
  state.selectedTime = null; // Nulstil tid når dato ændres

  // Lav en læsbar datostreng
  const shortMonths = ["jan", "feb", "mar", "apr", "maj", "jun",
                       "jul", "aug", "sep", "okt", "nov", "dec"];
  state.selectedDateStr = day + ". " + shortMonths[state.calMonth] + " " + state.calYear;

  // Re-render kalender (markerer valgt dag)
  renderCalendar();

  // Vis tider for den valgte dag
  renderTimes();

  // Deaktivér "fortsæt"-knap indtil en tid er valgt
  document.getElementById("dtNext").disabled = true;

  // Opdater sidebar
  updateSidebar();
}


/* ============================================================
   3E. TIME SLOTS
   Renderer ledige tider for valgt dato
   ============================================================ */

/**
 * Renderer tids-panelet til højre for kalenderen
 * Viser enten en placeholder, ledige tider eller "ingen tider"
 */
function renderTimes() {
  const section = document.getElementById("timesSection");
  if (!section) return;

  // Ingen dato valgt — vis placeholder
  if (!state.selectedDate) {
    section.innerHTML = '<div class="times__placeholder">← Vælg en dato<br>for at se ledige tider</div>';
    return;
  }

  // Hent tider for den valgte dag (eller tomt array hvis ingen)
  const times = availableTimes[state.selectedDate] || [];

  // Ingen ledige tider
  if (times.length === 0) {
    section.innerHTML = '<div class="times__placeholder">Ingen ledige tider denne dag</div>';
    return;
  }

  // Byg tids-gitter
  let html = '<div class="times__label">Ledige tider — <span class="times__date-str">' + state.selectedDateStr + "</span></div>";
  html += '<div class="times__grid">';

  times.forEach(function (time) {
    const isSelected = state.selectedTime === time;
    const btnClass = isSelected ? "time-btn time-btn--selected" : "time-btn";

    // data-time attribut bruges til at hente tid i event handler
    html += '<button class="' + btnClass + '" data-time="' + time + '">' + time + "</button>";
  });

  html += "</div>";
  section.innerHTML = html;

  // Tilføj click events til alle tids-knapper
  const timeButtons = section.querySelectorAll(".time-btn");
  timeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      selectTime(btn.getAttribute("data-time"));
    });
  });
}

/**
 * Sætter valgt tid i state og opdaterer UI
 * @param {string} time - Tidsstreng (fx "13:30")
 */
function selectTime(time) {
  // Opdater state
  state.selectedTime = time;

  // Re-render tider (markerer valgt tid)
  renderTimes();

  // Aktiver "fortsæt"-knap
  document.getElementById("dtNext").disabled = false;

  // Opdater sidebar
  updateSidebar();
}


/* ============================================================
   3F. CONTACT FORM
   Validerer kontaktformularen i realtid
   ============================================================ */

/**
 * Tjekker om kontaktformularen er udfyldt korrekt
 * Kaldes ved hvert input-event på formularens felter
 */
function checkContact() {
  const name  = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const email = document.getElementById("fEmail").value.trim();

  // Aktiver knappen hvis alle tre obligatoriske felter har indhold
  const allFilled = name !== "" && phone !== "" && email !== "";
  document.getElementById("contactNext").disabled = !allFilled;
}


/* ============================================================
   3G. CONFIRM STEP
   Viser en oversigt over bookingen inden bekræftelse
   ============================================================ */

/**
 * Renderer bekræftelsesvisningen i trin 4
 * Henter data fra state og viser en tabel med alle valg
 */
function renderConfirm() {
  const container = document.getElementById("confirmDetails");
  if (!container) return;

  // Find det valgte service-object
  const service = services.find(function (s) {
    return s.id === state.selectedService;
  });

  if (!service) return;

  // Byg HTML for bekræftelses-oversigten
  container.innerHTML =
    '<div class="confirm-row">' +
      '<span class="confirm-key">Behandling</span>' +
      '<span class="confirm-val">' + service.name + "</span>" +
    "</div>" +
    '<div class="confirm-row">' +
      '<span class="confirm-key">Varighed</span>' +
      '<span class="confirm-val">' + service.dur + "</span>" +
    "</div>" +
    '<div class="confirm-row">' +
      '<span class="confirm-key">Dato</span>' +
      '<span class="confirm-val">' + state.selectedDateStr + "</span>" +
    "</div>" +
    '<div class="confirm-row">' +
      '<span class="confirm-key">Klokkeslæt</span>' +
      '<span class="confirm-val">' + state.selectedTime + "</span>" +
    "</div>" +
    '<div class="confirm-row">' +
      '<span class="confirm-key">Navn</span>' +
      '<span class="confirm-val">' + state.contactName + "</span>" +
    "</div>" +
    '<div class="confirm-row">' +
      '<span class="confirm-key">Telefon</span>' +
      '<span class="confirm-val">' + state.contactPhone + "</span>" +
    "</div>" +
    '<div class="confirm-row">' +
      '<span class="confirm-key">E-mail</span>' +
      '<span class="confirm-val">' + state.contactEmail + "</span>" +
    "</div>" +
    (state.contactNote
      ? '<div class="confirm-row"><span class="confirm-key">Bemærkning</span><span class="confirm-val">' + state.contactNote + "</span></div>"
      : "") +
    '<div class="confirm-total">' +
      "<span>Pris</span><span>" + service.price + "</span>" +
    "</div>" +
    '<div class="btn-row">' +
      '<button class="btn btn-ghost" onclick="goTo(3)">← Tilbage</button>' +
      '<button class="btn btn-primary" onclick="submitBooking()">Bekræft booking</button>' +
    "</div>";
}

/**
 * "Indsender" bookingen — viser successiden
 * I et rigtigt projekt ville dette sende data til en server
 */
function submitBooking() {
  const service = services.find(function (s) {
    return s.id === state.selectedService;
  });

  // Sæt email i succesbeskeden
  const emailEl = document.getElementById("confirmEmail");
  if (emailEl) emailEl.textContent = state.contactEmail;

  // Vis booking-detaljer på successiden
  const detailsEl = document.getElementById("successDetails");
  if (detailsEl && service) {
    detailsEl.innerHTML =
      '<div class="bsum-title">Din booking</div>' +
      '<div class="confirm-row"><span class="confirm-key">Behandling</span><span class="confirm-val">' + service.name + "</span></div>" +
      '<div class="confirm-row"><span class="confirm-key">Dato & tid</span><span class="confirm-val">' + state.selectedDateStr + " · " + state.selectedTime + "</span></div>" +
      '<div class="confirm-row"><span class="confirm-key">Navn</span><span class="confirm-val">' + state.contactName + "</span></div>";
  }

  // Gå til successtrin
  state.currentStep = 5;
  updateStepVisibility();
}


/* ============================================================
   3H. SIDEBAR
   Opdaterer booking-oversigten i sidebjælken løbende
   ============================================================ */

/**
 * Opdaterer sidebjælken med aktuel booking-oversigt
 * Vises kun hvis en service er valgt
 */
function updateSidebar() {
  const container = document.getElementById("bookingSummary");
  if (!container) return;

  // Find valgt service
  const service = services.find(function (s) {
    return s.id === state.selectedService;
  });

  // Skjul sidebar-kortet hvis ingen service er valgt
  if (!service) {
    container.innerHTML = "";
    return;
  }

  // Byg oversigt
  let html =
    '<div class="booking-summary-card">' +
    '<div class="bsum-title">Din booking</div>' +
    '<div class="bsum-row"><span>Behandling</span><strong>' + service.name + "</strong></div>" +
    '<div class="bsum-row"><span>Pris</span><strong>' + service.price + "</strong></div>";

  if (state.selectedDateStr) {
    html += '<div class="bsum-row"><span>Dato</span><strong>' + state.selectedDateStr + "</strong></div>";
  }

  if (state.selectedTime) {
    html += '<div class="bsum-row"><span>Tid</span><strong>' + state.selectedTime + "</strong></div>";
  }

  if (state.contactName) {
    html += '<div class="bsum-row"><span>Navn</span><strong>' + state.contactName + "</strong></div>";
  }

  html += "</div>";
  container.innerHTML = html;
}


/* ============================================================
   3I. NAVIGATION — SCROLL OG HAMBURGER MENU
   Håndterer scroll-effekter og mobilmenu
   ============================================================ */

/**
 * Tilføjer "nav--scrolled"-klasse til nav når siden scrolles
 */
function initNavScroll() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  });
}

/**
 * Åbner/lukker hamburger-menuen på mobil
 */
function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    navLinks.classList.toggle("open");
  }
}

/**
 * Lukker hamburger-menuen når et link klikkes
 */
function initMenuClose() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;

  const links = navLinks.querySelectorAll("a, button");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
    });
  });
}


/* ============================================================
   3J. KONTAKTSIDE — FORMULAR
   Validerer og "sender" kontaktformularen på kontakt.html
   ============================================================ */

/**
 * Håndterer indsendelse af kontaktformularen på kontakt.html
 * Tjekker obligatoriske felter og viser bekræftelse
 */
function submitContactForm() {
  const name  = document.getElementById("cfName");
  const email = document.getElementById("cfEmail");
  const msg   = document.getElementById("cfMsg");
  const error = document.getElementById("cfError");

  // Tjek at vi er på kontaktsiden
  if (!name) return;

  const nameOk  = name.value.trim() !== "";
  const emailOk = email.value.trim() !== "";
  const msgOk   = msg.value.trim() !== "";

  if (!nameOk || !emailOk || !msgOk) {
    // Vis fejlbesked
    error.style.display = "block";
    return;
  }

  // Skjul fejl og formular, vis bekræftelse
  error.style.display = "none";
  document.getElementById("contactForm").style.display = "none";
  document.getElementById("cfSuccess").style.display = "block";
}


/* ============================================================
   4. INIT
   ============================================================ */

/**
 * Initialiserer applikationen
 * Kaldes når DOM'en er klar (DOMContentLoaded)
 */
function init() {
  // Render services i trin 1
  renderServices();

  // Render kalender i trin 2
  renderCalendar();

  // Sæt op scroll-effekt på nav
  initNavScroll();

  // Luk mobilmenu ved link-klik
  initMenuClose();

  // Input-events på kontaktformularen
  const contactFields = ["fName", "fPhone", "fEmail"];
  contactFields.forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", checkContact);
    }
  });
}

// Kør init() når hele HTML-dokumentet er indlæst
document.addEventListener("DOMContentLoaded", init);


/* ============================================================
   KONTAKTFORMULAR (kontakt.html)
   Validerer og "sender" kontaktformularen — viser feedback
   ============================================================ */

/**
 * Håndterer indsendelse af kontaktformularen på kontakt.html
 * Tjekker at obligatoriske felter er udfyldt og viser succes-besked
 */
function sendMessage() {
  const name    = document.getElementById("cName");
  const email   = document.getElementById("cEmail");
  const msg     = document.getElementById("cMsg");
  const feedback = document.getElementById("formFeedback");
  const success  = document.getElementById("formSuccess");
  const sendBtn  = document.getElementById("sendBtn");

  // Tjek at de obligatoriske felter eksisterer (vi er på kontakt.html)
  if (!name || !email || !msg) return;

  // Validering: navn, email og besked skal udfyldes
  if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
    feedback.textContent = "Udfyld venligst navn, e-mail og besked.";
    feedback.style.display = "inline";
    feedback.style.color   = "#c0392b";
    return;
  }

  // Skjul feedback-fejl
  feedback.style.display = "none";

  // Skjul formular og knap — vis succes-besked
  document.getElementById("contactForm").style.opacity = ".4";
  sendBtn.disabled   = true;
  sendBtn.textContent = "Sendt ✓";
  success.style.display = "block";

  // Scroll succes-beskeden i syne
  success.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
