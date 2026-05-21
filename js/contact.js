/**
 * Filnavn: contact.js
 * Beskrivelse: Håndterer validering af formularen på kontaktsiden og bookingsiden.
 * Kilder / Referencer: MDN Web Docs: getElementById
 */

function checkContact() {
  const name  = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const email = document.getElementById("fEmail").value.trim();

  const btn = document.getElementById("contactNext");
  if(btn) {
    btn.disabled = !(name !== "" && phone !== "" && email !== "");
  }
}

window.sendMessage = function() {
  const name    = document.getElementById("cName");
  const email   = document.getElementById("cEmail");
  const msg     = document.getElementById("cMsg");
  const feedback = document.getElementById("formFeedback");
  const success  = document.getElementById("formSuccess");
  const sendBtn  = document.getElementById("sendBtn");

  if (!name || !email || !msg) return;

  if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
    feedback.textContent = "Udfyld venligst navn, e-mail og besked.";
    feedback.style.display = "inline";
    feedback.style.color   = "#c0392b";
    return;
  }

  feedback.style.display = "none";
  document.getElementById("contactForm").style.opacity = ".4";
  sendBtn.disabled   = true;
  sendBtn.textContent = "Sendt ✓";
  success.style.display = "block";
  success.scrollIntoView({ behavior: "smooth", block: "nearest" });
}