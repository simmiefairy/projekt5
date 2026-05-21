/**
 * carousel.js — Anmeldelses-karrusel
 *
 * Kilder:
 * MDN addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * MDN createElement: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * MDN classList: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * MDN innerHTML: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 */

import { $, $$ } from './dom.js';

// Alle anmeldelser som et array af objects
// Data adskilt fra UI — pensum: Data → UI
const REVIEWS = [
  {
    stars: 5,
    text: '"Allerede efter én behandling mærkede jeg en tydelig forskel og nu har jeg ikke længere daglig hovedpine. Det er dejligt at lægge pillerne på hylden."',
    initials: 'JA',
    name: 'Jacob Asmussen',
    label: 'Svært ramt af hovedpine',
    featured: false,
  },
  {
    stars: 5,
    text: '"Nicolai har en anden tilgang end jeg har prøvet andre steder. En stor AHA-oplevelse – hvor meget jeg selv kan gøre for at afhjælpe mine smerter."',
    initials: 'HK',
    name: 'Heidi Malin Kristens',
    label: 'Nakke og spændingshovedpine',
    featured: true,
  },
  {
    stars: 5,
    text: '"Jeg har altid følt mig mødt, hørt og forstået. Vigtigst af alt har jeg opnået en større viden om mine muligheder og begrænsninger."',
    initials: 'JL',
    name: 'June Høybye Lindholm',
    label: 'Frossen skulder og hofte dysplasi',
    featured: false,
  },
  {
    stars: 5,
    text: '"Til forskel fra andre steder jeg har været, giver Nicolai en grundig forklaring på hvad problemet er og hvad vi gør for at løse det. Meget professionelt."',
    initials: 'MR',
    name: 'Mette Ravn',
    label: 'Skulder og lændesmerter',
    featured: false,
  },
  {
    stars: 5,
    text: '"Nicolai er utrolig dygtig til at lytte og finde årsagen til problemet. Mine smerter er væk efter kun to behandlinger. Kan klart anbefales!"',
    initials: 'TB',
    name: 'Thomas Berg',
    label: 'Kroniske nakkesmerter',
    featured: false,
  },
  {
    stars: 5,
    text: '"Super god behandling. Nicolai er rolig, kompetent og forklarer alt undervejs. Jeg følte mig i de bedste hænder."',
    initials: 'AK',
    name: 'Anne Kjær',
    label: 'Rygsmerter og iskias',
    featured: false,
  },
];

// State: hvilket kort er aktivt (vises i midten)
const state = {
  active: 1, // start med det midterste (featured) kort
};

/**
 * Renderer ét review-kort som en HTML-streng
 * @param {object} r - review object
 * @param {boolean} isActive - om kortet er aktivt (stort/fremhævet)
 * @returns {string} HTML-streng
 */
function renderCard(r, isActive) {
  const stars = '★'.repeat(r.stars);
  return `
    <article class="review${isActive ? ' review--featured' : ''}">
      <div class="review__stars">${stars}</div>
      <p class="review__text">${r.text}</p>
      <div class="review__author">
        <div class="review__avatar">${r.initials}</div>
        <div>
          <div class="review__name">${r.name}</div>
          <div class="review__label">${r.label}</div>
        </div>
      </div>
    </article>`;
}

/**
 * Renderer karrusel-UI baseret på state.active
 * Viser altid 3 kort: forrige, aktive og næste
 */
function renderCarousel() {
  const track = $('#carouselTrack');
  const dots = $('#carouselDots');
  if (!track) return;

  // Beregn de tre synlige indeks med wrap-around
  const total = REVIEWS.length;
  const prev  = (state.active - 1 + total) % total;
  const next  = (state.active + 1) % total;

  // Byg de tre kort med innerHTML
  track.innerHTML =
    renderCard(REVIEWS[prev],  false) +
    renderCard(REVIEWS[state.active], true) +
    renderCard(REVIEWS[next],  false);

  // Opdater prikker (dot-navigation)
  if (dots) {
    dots.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === state.active ? ' carousel__dot--active' : '');
      dot.setAttribute('aria-label', 'Anmeldelse ' + (i + 1));
      dot.setAttribute('type', 'button');

      // Klik på prik → gå til det specifikke kort
      dot.addEventListener('click', function () {
        state.active = i;
        renderCarousel();
      });

      dots.appendChild(dot);
    }
  }
}

/**
 * Initialiserer karrusel — kaldes fra main.js
 */
export function initCarousel() {
  const section = $('#reviewsCarousel');
  if (!section) return;

  renderCarousel();

  // Forrige knap
  $('#carouselPrev')?.addEventListener('click', function () {
    state.active = (state.active - 1 + REVIEWS.length) % REVIEWS.length;
    renderCarousel();
  });

  // Næste knap
  $('#carouselNext')?.addEventListener('click', function () {
    state.active = (state.active + 1) % REVIEWS.length;
    renderCarousel();
  });

  // Swipe-support til mobil (touch events)
  let touchStartX = 0;
  section.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  section.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      // Swipe venstre → næste, swipe højre → forrige
      if (diff > 0) {
        state.active = (state.active + 1) % REVIEWS.length;
      } else {
        state.active = (state.active - 1 + REVIEWS.length) % REVIEWS.length;
      }
      renderCarousel();
    }
  }, { passive: true });
}
