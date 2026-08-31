const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

const categories = document.querySelectorAll('.category');
const cards = document.querySelectorAll('.catalog-card');
categories.forEach(btn => btn.addEventListener('click', () => {
  categories.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  cards.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));

const modal = document.getElementById('enquiryModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalWhatsapp = document.getElementById('modalWhatsapp');
function openModal(cardName) {
  const message = `Hello Virendra Cards, I am interested in the ${cardName} card. Please share the price and details.`;
  modalTitle.textContent = cardName;
  modalText.textContent = 'Price on enquiry. Tap below to continue to WhatsApp with the card name included.';
  modalWhatsapp.href = `https://wa.me/918826076950?text=${encodeURIComponent(message)}`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
document.querySelectorAll('.enquire-card').forEach(btn => btn.addEventListener('click', e => openModal(e.currentTarget.closest('.catalog-card').dataset.name)));
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const form = document.getElementById('enquiryForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const occasion = String(data.get('occasion') || '').trim();
  const message = String(data.get('message') || '').trim();
  const text = `Hello Virendra Cards,\n\nName: ${name}\nPhone: ${phone}\nLooking for: ${occasion}\nMessage: ${message || 'Please share available designs, prices and details.'}`;
  window.open(`https://wa.me/918826076950?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();

function updateStoreStatus(){
  const status = document.getElementById('storeStatus');
  const dot = document.querySelector('.status-dot');
  const now = new Date();
  const day = now.getDay(); // 0 Sun, 2 Tue
  const mins = now.getHours()*60 + now.getMinutes();
  const open = mins >= 11*60 && mins < (19*60+30) && day !== 2;
  if (day === 2) {
    status.textContent = 'Closed today — Tuesday';
    dot.style.background = '#9b7770';
  } else if (open) {
    status.textContent = 'Open today';
    dot.style.background = '#2e9b5d';
  } else {
    status.textContent = 'Closed now';
    dot.style.background = '#b18a55';
  }
}
updateStoreStatus();
