/**
 * Filnavn: navigation.js
 * Beskrivelse: Håndterer sidens mobilmenu (hamburger) og faste navigation.
 * Kilder / Referencer: 
 * - MDN Web Docs: addEventListener https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * - MDN Web Docs: classList https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initMenuClose();
});

function initNavScroll() {
  const nav = document.getElementById("siteNav");
  if (!nav) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      nav.classList.add("scrolled", "nav--scrolled");
    } else {
      nav.classList.remove("scrolled", "nav--scrolled");
    }
  });
}

window.toggleMenu = function() {
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");
  
  if (navLinks) navLinks.classList.toggle("open");
  if (hamburger) hamburger.classList.toggle("is-active");
};

function initMenuClose() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;

  const links = navLinks.querySelectorAll("a, button");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      const hamburger = document.getElementById("hamburger");
      if (hamburger) hamburger.classList.remove("is-active");
    });
  });
}