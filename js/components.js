/**
 * Filnavn: components.js
 * Beskrivelse: Håndterer "popup" (modal) ved behandlinger og anmeldelses-karrusel.
 */
document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initCarousel();
});

function initModals() {
  const treatCards = document.querySelectorAll('.treat-card');
  if (treatCards.length === 0) return;

  const treatmentDetails = {
      "Hovedpine": "Hovedpine kan have mange årsager. Vi undersøger nakke, skuldre og kæbe for at finde kilden til spændingerne.",
      "Nakke & skulder": "Smerter i nakke og skulder hænger ofte sammen med arbejdsstillinger.",
      "Rygsmerter": "Vi kigger på hele din bevægekæde – fra fødder til nakke – for at aflaste ryggen.",
      "Kæbegener": "Problemer med kæbeleddet (TMJ) kan forårsage hovedpine.",
      "Knæ & hofter": "Vi tilpasser behandlingen og kombinerer ledmobilisering med specifik styrketræning.",
      "Fod & ankel": "Fødderne er kroppens fundament. Vi behandler tilstande som hælspore."
  };

  const style = document.createElement('style');
  style.innerHTML = `
      .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.3s ease; padding: 20px; backdrop-filter: blur(4px); }
      .modal-overlay.active { opacity: 1; visibility: visible; }
      .modal-content { background: #fff; padding: 32px; border-radius: 16px; max-width: 500px; width: 100%; position: relative; transform: translateY(20px); transition: all 0.3s ease; }
      .modal-overlay.active .modal-content { transform: translateY(0); }
      .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 24px; cursor: pointer; color: #8896aa; }
      .treat-card { cursor: pointer; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
      <div class="modal-content">
          <button class="modal-close">&times;</button>
          <h2 id="modalTitle" style="font-family: 'DM Serif Display', serif; margin-bottom: 12px; font-size: 24px;"></h2>
          <p id="modalText" style="color: #4a5568; line-height: 1.7;"></p>
      </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.modal-close');
  closeBtn.onclick = () => overlay.classList.remove('active');
  overlay.onclick = (e) => { if(e.target === overlay) overlay.classList.remove('active'); };

  treatCards.forEach(card => {
      card.addEventListener('click', () => {
          const title = card.querySelector('.treat-card__name').innerText;
          document.getElementById('modalTitle').innerText = title;
          document.getElementById('modalText').innerText = treatmentDetails[title] || card.querySelector('.treat-card__desc').innerText;
          overlay.classList.add('active');
      });
  });
}

function initCarousel() {
  const grid = document.querySelector('.reviews-grid');
  if (!grid) return;

  if (window.innerWidth < 860) {
      const cards = Array.from(grid.querySelectorAll('.review-card'));
      let currentIndex = 0;
      
      grid.style.position = 'relative';
      grid.style.minHeight = '250px';
      grid.style.display = 'block';

      cards.forEach((card, i) => {
          card.style.position = 'absolute';
          card.style.top = '0';
          card.style.left = '0';
          card.style.width = '100%';
          card.style.opacity = i === 0 ? '1' : '0';
          card.style.transition = 'opacity 0.6s ease';
          card.style.zIndex = i === 0 ? '2' : '1';
      });

      setInterval(() => {
          cards[currentIndex].style.opacity = '0';
          cards[currentIndex].style.zIndex = '1';
          
          currentIndex = (currentIndex + 1) % cards.length;
          
          cards[currentIndex].style.opacity = '1';
          cards[currentIndex].style.zIndex = '2';
      }, 5000);
  }
}