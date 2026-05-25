/**
 * app.js — Grocott Fysioterapi
 * Beskrivelse: Navigation, karrusel, behandlings-modal og kontaktformular.
 *              Booking-logik er i booking.js
 *
 * Kilder / Referencer:
 * - MDN addEventListener  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * - MDN classList         https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * - MDN innerHTML         https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 * - MDN querySelector     https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * - MDN createElement     https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * - MDN forEach           https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 *
 * Indhold:
 *  1. DATA        — anmeldelser og behandlingstekster til modal
 *  2. NAVIGATION  — scroll-effekt og hamburger-menu
 *  3. KARRUSEL    — anmeldelseskarrusel med pile, prikker og swipe
 *  4. MODAL       — behandlings-popup (åbnes ved klik på .treat-kort)
 *  5. KONTAKT     — kontaktformular på contact.html
 *  6. INIT        — starter alt når DOM er klar
 */


/* ============================================================
   1. DATA
   ============================================================ */

// Anmeldelser til karrusel — array af objects
const reviews = [
  { stars: 5, text: '"Allerede efter én behandling mærkede jeg en tydelig forskel og nu har jeg ikke længere daglig hovedpine. Det er dejligt at lægge pillerne på hylden."', initials: "JA", name: "Jacob Asmussen",      label: "Svært ramt af hovedpine"          },
  { stars: 5, text: '"Nicolai har en anden tilgang end jeg har prøvet andre steder. En stor AHA-oplevelse – hvor meget jeg selv kan gøre for at afhjælpe mine smerter."',       initials: "HK", name: "Heidi Malin Kristens", label: "Nakke og spændingshovedpine"      },
  { stars: 5, text: '"Jeg har altid følt mig mødt, hørt og forstået. Vigtigst af alt har jeg opnået en større viden om mine muligheder og begrænsninger."',                     initials: "JL", name: "June Høybye Lindholm", label: "Frossen skulder og hofte dysplasi" },
  { stars: 5, text: '"Til forskel fra andre steder jeg har været, giver Nicolai en grundig forklaring på hvad problemet er og hvad vi gør for at løse det. Meget professionelt."', initials: "MR", name: "Mette Ravn",          label: "Skulder og lændesmerter"          },
  { stars: 5, text: '"Nicolai er utrolig dygtig til at lytte og finde årsagen til problemet. Mine smerter er væk efter kun to behandlinger. Kan klart anbefales!"',              initials: "TB", name: "Thomas Berg",          label: "Kroniske nakkesmerter"            },
  { stars: 5, text: '"Super god behandling. Nicolai er rolig, kompetent og forklarer alt undervejs. Jeg følte mig i de bedste hænder."',                                          initials: "AK", name: "Anne Kjær",            label: "Rygsmerter og iskias"             },
];

// Behandlingstekster til modal-popup — array af objects
const treatments = [
  {
    id: "c1", name: "Hovedpine",
    short: "Spændingshovedpine, migræne og cervikal betinget hovedpine.",
    body: "<p>Mange mennesker lever med daglig eller ugentlig hovedpine uden at vide, at det ofte kan behandles effektivt med fysioterapi. Årsagen kan ligge i stramme muskler i nakke og skuldre, fejlstilling i hvirvelsøjlen eller overbelastning af kæbeleddet.</p><h4>Hvad behandler vi?</h4><ul><li>Spændingshovedpine fra nakke og skuldre</li><li>Cervikal (nakke-betinget) migræne</li><li>Kæbe-relateret hovedpine (TMJ)</li><li>Postural hovedpine fra skærmarbejde</li></ul><h4>Behandlingsmetoder</h4><ul><li>Ledmobilisering af nakke og øvre rygsøjle</li><li>Myofascial release af nakkemuskler</li><li>Triggerpunktsbehandling</li><li>Hjemmeøvelser og postural vejledning</li></ul>",
  },
  {
    id: "c2", name: "Nakke & skulder",
    short: "Smerter, overbelastning og stivhed i nakke og skuldre.",
    body: "<p>Nakke- og skulderproblemer er blandt de hyppigste årsager til smerte og nedsat livskvalitet. Det kan skyldes skærmarbejde, stress, sportsaktivitet eller traumer som whiplash.</p><h4>Hvad behandler vi?</h4><ul><li>Nakkesmerter og stivhed</li><li>Skulderimpingement og rotatorcuff-skader</li><li>Frossen skulder (adhesiv kapsulitis)</li><li>Whiplash og traumer</li></ul><h4>Behandlingsmetoder</h4><ul><li>Ledmobilisering og manipulation</li><li>Bløddelsbehandling og myofascial release</li><li>Progressiv genoptræning</li><li>Ergonomisk vejledning</li></ul>",
  },
  {
    id: "c3", name: "Rygsmerter",
    short: "Lænderyg, diskusprolaps og kroniske rygsmerter.",
    body: "<p>Rygsmerter er den hyppigste årsag til sygefravær i Danmark. De fleste tilfælde kan behandles effektivt uden operation, men det kræver en præcis diagnose og en individuel behandlingsplan.</p><h4>Hvad behandler vi?</h4><ul><li>Lændesmerter og lænde-bækken-smerter</li><li>Diskusprolaps og nerverodsirritation (iskias)</li><li>Kroniske rygsmerter</li><li>Rygsmerter under graviditet</li></ul><h4>Behandlingsmetoder</h4><ul><li>Manuelle teknikker og ledmobilisering</li><li>Myofascial release og bløddelsbehandling</li><li>Stabilitetstræning og core-øvelser</li><li>Holdtræning for ryg</li></ul>",
  },
  {
    id: "c4", name: "Kæbegener",
    short: "TMJ-dysfunction, klik og bevægebegrænsning i kæben.",
    body: "<p>Kæbeproblemer (TMJ-dysfunction) er et underkendt område, som mange oplever i form af klik, smerter ved tygning eller ømhed i kæbeleddet. Der er ofte en tæt sammenhæng med nakke- og hovedpineproblemer.</p><h4>Hvad behandler vi?</h4><ul><li>TMJ-dysfunction (kæbeleds-dysfunction)</li><li>Klik og låsning i kæbeleddet</li><li>Smerter ved tygning og tale</li><li>Kæbespændinger fra stress</li></ul><h4>Behandlingsmetoder</h4><ul><li>Intraoral og ekstraoral kæbebehandling</li><li>Myofascial release af tyggemuskler</li><li>Mobilisering af kæbeleddet</li><li>Koordination med tandlæge ved behov</li></ul>",
  },
  {
    id: "c5", name: "Knæ & hofter",
    short: "Løbeskader, slidgigt og hofteimpingement.",
    body: "<p>Knæ- og hofteproblemer rammer mange — fra aktive løbere til ældre med slidgigt. En grundig biomekanisk analyse er nøglen til at forstå, hvorfor problemet opstår, og hvordan vi forebygger at det vender tilbage.</p><h4>Hvad behandler vi?</h4><ul><li>Løberknæ (IT-band syndrom)</li><li>Springerknæ (patellarsene-tendinopati)</li><li>Hofteimpingement (FAI)</li><li>Slidgigt i knæ og hofte</li></ul><h4>Behandlingsmetoder</h4><ul><li>Manuelle teknikker og ledmobilisering</li><li>Excentrisk styrketræning</li><li>Formthotics indlægssåler ved behov</li><li>Løbsanalyse og teknikoptimering</li></ul>",
  },
  {
    id: "c6", name: "Fod & ankel",
    short: "Hælspore, plantar fasciitis og ankelinstabilitet.",
    body: "<p>Fodproblemer kan påvirke hele kroppens bevægemønster og føre til smerter i knæ, hofte og ryg. En grundig undersøgelse af fod og ankel er derfor vigtig for hele kroppen.</p><h4>Hvad behandler vi?</h4><ul><li>Hælspore og plantar fasciitis</li><li>Ankelforstuvninger og kronisk instabilitet</li><li>Achillessene-problemer</li><li>Platfod og overproning</li></ul><h4>Behandlingsmetoder</h4><ul><li>Bløddelsbehandling og taping</li><li>Progressiv styrketræning</li><li>Formthotics indlægssåler (certificeret klinik)</li><li>Biomekanisk ganganalyse</li></ul>",
  },
];

// Aktivt indeks i karrusel (starter på 1 = det fremhævede midterkort)
let carouselActive = 1;


/* ============================================================
   2. NAVIGATION — scroll-effekt og hamburger-menu
   ============================================================ */

/**
 * Tilføjer nav--scrolled klasse til nav når siden scrolles ned.
 * CSS bruger klassen til at tilføje skygge under navigationen.
 */
function initNavScroll() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  window.addEventListener("scroll", function () {
    nav.classList.toggle("nav--scrolled", window.scrollY > 10);
  }, { passive: true });
}

/**
 * Åbner/lukker hamburger-menuen på mobil.
 * Kaldes fra onclick="toggleMenu()" i HTML.
 */
function toggleMenu() {
  const navLinks  = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  if (!navLinks) return;

  const isOpen = navLinks.classList.toggle("open");
  // Tegn X på hamburger-ikonet når menuen er åben
  if (hamburger) hamburger.classList.toggle("is-active", isOpen);
}

/**
 * Lukker menuen automatisk når et link i menuen klikkes.
 * Bruger én event listener med klik-bobling (event delegation).
 */
function initMenuClose() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;

  navLinks.addEventListener("click", function (e) {
    if (e.target.closest("a") || e.target.closest("button")) {
      navLinks.classList.remove("open");
      const hamburger = document.getElementById("hamburger");
      if (hamburger) hamburger.classList.remove("is-active");
    }
  });
}


/* ============================================================
   3. KARRUSEL — anmeldelseskarrusel med pile og prikker
   ============================================================ */

/**
 * Bygger HTML-streng for ét anmeldelseskort.
 * @param {object}  r        - review-object fra reviews-arrayet
 * @param {boolean} isActive - true = fremhævet midterkort
 * @returns {string} HTML
 */
function buildReviewCard(r, isActive) {
  const stars = "★".repeat(r.stars);
  return '<article class="review' + (isActive ? " review--featured" : "") + '">' +
    '<div class="review__stars">' + stars + "</div>" +
    '<p class="review__text">' + r.text + "</p>" +
    '<div class="review__author">' +
      '<div class="review__avatar">' + r.initials + "</div>" +
      "<div>" +
        '<div class="review__name">' + r.name + "</div>" +
        '<div class="review__label">' + r.label + "</div>" +
      "</div>" +
    "</div>" +
  "</article>";
}

/**
 * Renderer karrusellen — viser altid 3 kort: forrige, aktiv, næste.
 * Bruger wrap-around så man kan bladre rundt i alle anmeldelser.
 */
function renderCarousel() {
  const track = document.getElementById("carouselTrack");
  const dots  = document.getElementById("carouselDots");
  if (!track) return;

  const total = reviews.length;
  const prev  = (carouselActive - 1 + total) % total;
  const next  = (carouselActive + 1) % total;

  // Indsæt de tre kort med innerHTML
  track.innerHTML =
    buildReviewCard(reviews[prev],          false) +
    buildReviewCard(reviews[carouselActive], true)  +
    buildReviewCard(reviews[next],          false);

  // Byg prik-navigation (én prik per anmeldelse)
  if (dots) {
    dots.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.className = "carousel__dot" + (i === carouselActive ? " carousel__dot--active" : "");
      dot.setAttribute("aria-label", "Anmeldelse " + (i + 1));
      dot.setAttribute("type", "button");

      // Closure: gem i så click-handleren bruger den rigtige værdi
      (function (index) {
        dot.addEventListener("click", function () {
          carouselActive = index;
          renderCarousel();
        });
      })(i);

      dots.appendChild(dot);
    }
  }
}

/**
 * Starter karrusel — kører kun hvis karrusel-HTML er på siden.
 */
function initCarousel() {
  if (!document.getElementById("carouselTrack")) return;

  renderCarousel();

  // Forrige-knap
  const prevBtn = document.getElementById("carouselPrev");
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      carouselActive = (carouselActive - 1 + reviews.length) % reviews.length;
      renderCarousel();
    });
  }

  // Næste-knap
  const nextBtn = document.getElementById("carouselNext");
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      carouselActive = (carouselActive + 1) % reviews.length;
      renderCarousel();
    });
  }

  // Swipe-support til mobil — virker på .carousel wrapperen (index + about)
  let touchStartX = 0;
  const section = document.querySelector(".carousel") || document.getElementById("reviewsCarousel");
  if (section) {
    section.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    section.addEventListener("touchend", function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        carouselActive = diff > 0
          ? (carouselActive + 1) % reviews.length
          : (carouselActive - 1 + reviews.length) % reviews.length;
        renderCarousel();
      }
    }, { passive: true });
  }
}


/* ============================================================
   4. MODAL — behandlings-popup
   ============================================================ */

/**
 * Åbner modal med detaljer om den valgte behandling.
 * @param {string} colorId - data-c attributten fra behandlingskortet ("1"–"6")
 */
function openModal(colorId) {
  const treatment = treatments.find(function (t) { return t.id === "c" + colorId; });
  if (!treatment) return;

  const overlay   = document.getElementById("treatModal");
  if (!overlay) return;

  const titleEl   = overlay.querySelector(".modal__title");
  const contentEl = overlay.querySelector(".modal__content");

  if (titleEl)   titleEl.textContent = treatment.name;
  if (contentEl) contentEl.innerHTML = '<p class="modal__short">' + treatment.short + "</p>" + treatment.body;

  // Vis modal og lås scroll på baggrunden
  overlay.classList.add("modal--open");
  document.body.classList.add("modal-open");

  // Sæt fokus på luk-knap
  const closeBtn = overlay.querySelector(".modal__close");
  if (closeBtn) closeBtn.focus();
}

/**
 * Lukker modalen og frigiver scroll på baggrunden.
 */
function closeModal() {
  const overlay = document.getElementById("treatModal");
  if (overlay) overlay.classList.remove("modal--open");
  document.body.classList.remove("modal-open");
}

/**
 * Starter modal — kører kun hvis .treat-kort findes på siden.
 */
function initModal() {
  const treats = document.querySelectorAll(".treat");
  if (!treats.length) return;

  treats.forEach(function (card) {
    card.style.cursor = "pointer";

    // Tilføj "Læs mere →" hint til kortet
    const hint = document.createElement("div");
    hint.className   = "treat__hint";
    hint.textContent = "Læs mere →";
    card.appendChild(hint);

    // Klik på kortet → find data-c og åbn modal
    card.addEventListener("click", function () {
      const iconEl  = card.querySelector("[data-c]");
      const colorId = iconEl ? iconEl.getAttribute("data-c") : null;
      if (colorId) openModal(colorId);
    });
  });

  // Luk via X-knap og Luk-knap
  document.querySelectorAll("#modalClose, #modalClose2").forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  // Klik på det mørke overlay lukker modalen
  const overlay = document.getElementById("treatModal");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  // Escape-tast lukker modalen
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
}


/* ============================================================
   5. KONTAKT — kontaktformular på contact.html
   ============================================================ */

/**
 * Behandler indsendelse af kontaktformularen.
 * Validerer navn, e-mail og besked.
 * Eksponeres til window da den kaldes fra onclick="sendMessage()" i HTML.
 */
function sendMessage() {
  const nameEl     = document.getElementById("cName");
  const emailEl    = document.getElementById("cEmail");
  const msgEl      = document.getElementById("cMsg");
  const feedbackEl = document.getElementById("formFeedback");
  const successEl  = document.getElementById("formSuccess");
  const sendBtn    = document.getElementById("sendBtn");

  // Ikke på kontaktsiden — stop her
  if (!nameEl || !emailEl || !msgEl) return;

  // Validér obligatoriske felter
  if (!nameEl.value.trim() || !emailEl.value.trim() || !msgEl.value.trim()) {
    feedbackEl.textContent   = "Udfyld venligst navn, e-mail og besked.";
    feedbackEl.style.display = "inline";
    feedbackEl.style.color   = "#c0392b";
    return;
  }

  // Alt udfyldt — vis succes-besked
  feedbackEl.style.display = "none";
  document.getElementById("contactForm").style.opacity = ".4";
  sendBtn.disabled    = true;
  sendBtn.textContent = "Sendt ✓";
  successEl.style.display = "block";
  successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}


/* ============================================================
   6. INIT — starter alle funktioner når DOM er klar
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initNavScroll();  // Navigation: tilføj skygge ved scroll
  initMenuClose();  // Navigation: luk menu ved link-klik
  initCarousel();   // Karrusel: kun aktiv hvis HTML er til stede
  initModal();      // Modal: kun aktiv hvis .treat-kort er til stede
  window.sendMessage = sendMessage;  // Kontakt: eksponér til onclick i HTML
  window.toggleMenu  = toggleMenu;   // Nav: eksponér til onclick i HTML
});
