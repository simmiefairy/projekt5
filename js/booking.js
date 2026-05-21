/**
 * Filnavn: booking.js
 * Beskrivelse: Håndterer alt logik, state og rendering for bookingsystemet.
 * Kilder / Referencer:
 * - MDN Web Docs: innerHTML https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 */

const services = [
  { id: "s1", name: "Konsultation 15 min.", desc: "Kortere opfølgning eller enkelt spørgsmål", dur: "15 min.", price: "225 kr." },
  { id: "s2", name: "Konsultation 30 min.", desc: "Fokuseret behandling af et specifikt problem", dur: "30 min.", price: "400 kr." },
  { id: "s3", name: "Konsultation 45 min.", desc: "Tilpasset behandling af specifikke gener", dur: "45 min.", price: "500 kr." },
  { id: "s4", name: "Konsultation 60 min.", desc: "Fuld undersøgelse og behandling", dur: "60 min.", price: "650 kr." },
  { id: "s5", name: "Konsultation 90 min.", desc: "Grundig første konsultation inkl. anamnese", dur: "90 min.", price: "850 kr." },
  { id: "s6", name: "Konsultation 120 min.", desc: "Udvidet forløb til komplekse problemstillinger", dur: "120 min.", price: "1.100 kr." },
  { id: "s7", name: "Akuttid", desc: "Pludselig opståede smerter — tillæg +300 kr.", dur: "Variabel", price: "Fra 700 kr." }
];

const availableDays = [14, 15, 16, 18, 19, 20, 22, 23, 25, 26, 27, 28, 29, 30];
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

const monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
const weekDayNames = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];

const state = {
  currentStep: 1, selectedService: null, calMonth: 4, calYear: 2026,
  selectedDate: null, selectedDateStr: "", selectedTime: null,
  contactName: "", contactPhone: "", contactEmail: "", contactNote: ""
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("v1")) {
    renderServices();
    renderCalendar();
    updateStepVisibility();
    
    const contactFields = ["fName", "fPhone", "fEmail"];
    contactFields.forEach(function (fieldId) {
      const field = document.getElementById(fieldId);
      if (field) field.addEventListener("input", checkContact);
    });
  }
});

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

function updateStepVisibility() {
  document.querySelectorAll(".bview").forEach(function (view) {
    view.classList.remove("active", "bview--active");
  });
  const activeView = document.getElementById("v" + state.currentStep);
  if (activeView) {
    activeView.classList.add("active", "bview--active");
  }
}

function updateProgressBar() {
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById("ps" + i);
    const circleEl = document.getElementById("pc" + i);
    const lineEl = document.getElementById("pl" + i);
    if (!stepEl) continue;

    stepEl.classList.remove("prog-step--active", "prog-step--done");
    circleEl.innerHTML = i;
    if (i === state.currentStep) stepEl.classList.add("prog-step--active");
    else if (i < state.currentStep) { stepEl.classList.add("prog-step--done"); circleEl.innerHTML = "✓"; }
    
    if (lineEl) {
      if (i < state.currentStep) lineEl.classList.add("prog-line--done");
      else lineEl.classList.remove("prog-line--done");
    }
  }
}

function restart() {
  window.location.reload();
}

function renderServices() {
  const listEl = document.getElementById("serviceList");
  if (!listEl) return;
  listEl.innerHTML = "";

  services.forEach(function (service) {
    const card = document.createElement("div");
    card.className = "service-card";
    if (state.selectedService === service.id) card.classList.add("service-card--selected");

    card.innerHTML =
      '<div class="svc-check">' + (state.selectedService === service.id ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : "") + "</div>" +
      '<div class="svc-info"><div class="svc-name">' + service.name + '</div><div class="svc-desc">' + service.desc + '</div></div>' +
      '<div class="svc-meta"><div class="svc-price">' + service.price + '</div><div class="svc-dur">' + service.dur + '</div></div>';

    card.addEventListener("click", function () { selectService(service.id); });
    listEl.appendChild(card);
  });
}

function selectService(serviceId) {
  state.selectedService = serviceId;
  renderServices();
  document.getElementById("svcNext").disabled = false;
  updateSidebar();
}

function renderCalendar() {
  const gridEl = document.getElementById("calGrid");
  const labelEl = document.getElementById("calMonthLabel");
  if (!gridEl || !labelEl) return;

  labelEl.textContent = monthNames[state.calMonth] + " " + state.calYear;
  gridEl.innerHTML = "";
  weekDayNames.forEach(dayName => {
    const dayLabel = document.createElement("div");
    dayLabel.className = "cal__wday";
    dayLabel.textContent = dayName;
    gridEl.appendChild(dayLabel);
  });

  const firstDayOfMonth = new Date(state.calYear, state.calMonth, 1).getDay();
  const offsetFromMonday = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(state.calYear, state.calMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(state.calYear, state.calMonth, 0).getDate();

  for (let i = 0; i < offsetFromMonday; i++) {
    const cell = document.createElement("div"); cell.className = "cal__cell"; cell.textContent = daysInPrevMonth - offsetFromMonday + 1 + i; gridEl.appendChild(cell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div"); cell.className = "cal__cell cal__cell--in-month"; cell.textContent = day;
    const isAvailable = availableDays.includes(day) && state.calMonth === 4 && state.calYear === 2026;
    const isSelected = state.selectedDate === day;
    const isToday = state.calMonth === 4 && state.calYear === 2026 && day === 14;

    if (isSelected) cell.classList.add("cal__cell--selected");
    else if (isAvailable) cell.classList.add("cal__cell--avail");
    if (isToday && !isSelected) cell.classList.add("cal__cell--today");
    if (isAvailable) cell.addEventListener("click", function () { selectDate(day); });
    gridEl.appendChild(cell);
  }
}

window.changeMonth = function(direction) {
  state.calMonth += direction;
  if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
  else if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
  renderCalendar();
};

function selectDate(day) {
  state.selectedDate = day; state.selectedTime = null;
  const shortMonths = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
  state.selectedDateStr = day + ". " + shortMonths[state.calMonth] + " " + state.calYear;
  renderCalendar();
  renderTimes();
  document.getElementById("dtNext").disabled = true;
  updateSidebar();
}

function renderTimes() {
  const section = document.getElementById("timesSection");
  if (!section) return;
  if (!state.selectedDate) {
    section.innerHTML = '<div class="times__placeholder">← Vælg en dato<br>for at se ledige tider</div>'; return;
  }
  const times = availableTimes[state.selectedDate] || [];
  if (times.length === 0) {
    section.innerHTML = '<div class="times__placeholder">Ingen ledige tider denne dag</div>'; return;
  }

  let html = '<div class="times__label">Ledige tider — <span class="times__date-str">' + state.selectedDateStr + "</span></div><div class="times__grid">";
  times.forEach(function (time) {
    const isSelected = state.selectedTime === time;
    const btnClass = isSelected ? "time-btn time-btn--selected" : "time-btn";
    html += '<button class="' + btnClass + '" data-time="' + time + '">' + time + "</button>";
  });
  html += "</div>";
  section.innerHTML = html;

  section.querySelectorAll(".time-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { selectTime(btn.getAttribute("data-time")); });
  });
}

function selectTime(time) {
  state.selectedTime = time;
  renderTimes();
  document.getElementById("dtNext").disabled = false;
  updateSidebar();
}

function renderConfirm() {
  const container = document.getElementById("confirmDetails");
  if (!container) return;
  const service = services.find(s => s.id === state.selectedService);
  if (!service) return;

  container.innerHTML =
    '<div class="confirm-row"><span class="confirm-key">Behandling</span><span class="confirm-val">' + service.name + "</span></div>" +
    '<div class="confirm-row"><span class="confirm-key">Varighed</span><span class="confirm-val">' + service.dur + "</span></div>" +
    '<div class="confirm-row"><span class="confirm-key">Dato</span><span class="confirm-val">' + state.selectedDateStr + "</span></div>" +
    '<div class="confirm-row"><span class="confirm-key">Klokkeslæt</span><span class="confirm-val">' + state.selectedTime + "</span></div>" +
    '<div class="confirm-row"><span class="confirm-key">Navn</span><span class="confirm-val">' + state.contactName + "</span></div>" +
    '<div class="confirm-row"><span class="confirm-key">Telefon</span><span class="confirm-val">' + state.contactPhone + "</span></div>" +
    '<div class="confirm-row"><span class="confirm-key">E-mail</span><span class="confirm-val">' + state.contactEmail + "</span></div>" +
    '<div class="confirm-total"><span>Pris</span><span>' + service.price + "</span></div>" +
    '<div class="btn-row"><button class="btn-ghost" onclick="goTo(3)">← Tilbage</button><button class="btn-primary" onclick="submitBooking()">Bekræft booking</button></div>';
}

window.submitBooking = function() {
  const service = services.find(s => s.id === state.selectedService);
  const emailEl = document.getElementById("confirmEmail");
  if (emailEl) emailEl.textContent = state.contactEmail;

  const detailsEl = document.getElementById("successDetails");
  if (detailsEl && service) {
    detailsEl.innerHTML =
      '<div class="bsum-title">Din booking</div>' +
      '<div class="confirm-row"><span class="confirm-key">Behandling</span><span class="confirm-val">' + service.name + "</span></div>" +
      '<div class="confirm-row"><span class="confirm-key">Dato & tid</span><span class="confirm-val">' + state.selectedDateStr + " · " + state.selectedTime + "</span></div>" +
      '<div class="confirm-row"><span class="confirm-key">Navn</span><span class="confirm-val">' + state.contactName + "</span></div>";
  }
  state.currentStep = 5;
  updateStepVisibility();
}

function updateSidebar() {
  const container = document.getElementById("bookingSummary");
  if (!container) return;
  const service = services.find(s => s.id === state.selectedService);
  if (!service) { container.innerHTML = ""; return; }

  let html = '<div class="booking-summary-card"><div class="bsum-title">Din booking</div><div class="bsum-row"><span>Behandling</span><strong>' + service.name + "</strong></div><div class="bsum-row"><span>Pris</span><strong>" + service.price + "</strong></div>";
  if (state.selectedDateStr) html += '<div class="bsum-row"><span>Dato</span><strong>' + state.selectedDateStr + "</strong></div>";
  if (state.selectedTime) html += '<div class="bsum-row"><span>Tid</span><strong>' + state.selectedTime + "</strong></div>";
  if (state.contactName) html += '<div class="bsum-row"><span>Navn</span><strong>' + state.contactName + "</strong></div>";
  html += "</div>";
  container.innerHTML = html;
}