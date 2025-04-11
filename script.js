// Hamburger menu - pro mobilní zobrazení
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
});

// Lightbox logika pro galerii
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox .close');

// Při kliknutí na obrázek
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
  });
});

// Zavření lightboxu
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Zavření lightboxu při kliknutí mimo obrázek
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});
