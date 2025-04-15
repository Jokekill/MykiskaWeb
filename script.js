document.addEventListener("DOMContentLoaded", function() {
    // Slideshow functionality
    const slides = document.querySelectorAll('.hero-bg');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 10000); // Change slide every 10 seconds

    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    function prevSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    // Reset interval when manually changing slides
    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 10000);
    }

    if(prevButton && nextButton) {
      prevButton.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });

      nextButton.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });
    }

    // Hamburger menu pro mobilní navigaci
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
      });
    }
  
    /* ----- Na index.html: načtení galerií (kategorií) ----- */
    const galleryCategoriesContainer = document.getElementById('gallery-categories');
    if(galleryCategoriesContainer) {
      fetch('gallery.json')
        .then(response => response.json())
        .then(data => {
          // data má strukturu: { "Bolivie": ["bolivie1.jpg", ...], "Antarktida": ["antarktida1.jpg", ...], ... }
          for (const category in data) {
            if (data.hasOwnProperty(category)) {
              const card = document.createElement('div');
              card.classList.add('gallery-category-card');
              // Použijeme první fotku jako miniaturu, pokud existuje
              let previewImgUrl = '';
              if(data[category].length > 0){
                previewImgUrl = `fotogalery/${category}/${data[category][0]}`;
              }
              card.innerHTML = `
                <a href="category.html?folder=${encodeURIComponent(category)}">
                  <div class="card-image">
                    <img src="${previewImgUrl}" alt="${category}" onerror="this.style.display='none'">
                  </div>
                  <div class="card-title">
                    <h3>${category}</h3>
                  </div>
                </a>
              `;
              galleryCategoriesContainer.appendChild(card);
            }
          }
        })
        .catch(error => {
          console.error("Chyba při načítání gallery.json:", error);
        });
    }
  
    /* ----- Na category.html: zobrazení fotek z vybrané kategorie ----- */
    const categoryGalleryContainer = document.getElementById('category-gallery');
    if(categoryGalleryContainer) {
      // Získáme parametr "folder" z URL
      const urlParams = new URLSearchParams(window.location.search);
      const folder = urlParams.get('folder');
      if(folder) {
        const categoryTitle = document.getElementById('category-title');
        if(categoryTitle) {
          categoryTitle.textContent = folder;
        }
        fetch('gallery.json')
          .then(response => response.json())
          .then(data => {
            if(data[folder]) {
              const images = data[folder];
              images.forEach(imgName => {
                const imgElement = document.createElement('img');
                imgElement.src = `fotogalery/${folder}/${imgName}`;
                imgElement.alt = `${folder} - ${imgName}`;
                imgElement.classList.add('gallery-item');
                categoryGalleryContainer.appendChild(imgElement);
              });
              // Nastavení lightboxu po načtení fotek
              attachLightboxEvents();
            } else {
              categoryGalleryContainer.innerHTML = `<p>Žádné fotky v této kategorii.</p>`;
            }
          })
          .catch(error => {
            console.error("Chyba při načítání gallery.json:", error);
          });
      } else {
        categoryGalleryContainer.innerHTML = `<p>Žádná kategorie nebyla vybrána.</p>`;
      }
    }
  
    /* ----- Lightbox s navigací ----- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox .close');
    const prevBtn = document.querySelector('.lightbox .prev');
    const nextBtn = document.querySelector('.lightbox .next');
  
    // Globální proměnné pro uchování aktuální galerie a indexu
    let currentGalleryItems = [];
    let currentIndex = 0;
  
    function attachLightboxEvents(){
      currentGalleryItems = document.querySelectorAll('.gallery-item');
      currentGalleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          currentIndex = index;
          openLightbox(item.src, item.alt);
        });
      });
    }
  

    function openLightbox(src, alt) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
      
        lightbox.style.display = 'flex';  // Zásadní – aby se lightbox stal flex kontejnerem
        lightboxImg.src = src;
        lightboxImg.alt = alt;
      }
      
  
    function showImageAtIndex(index) {
      // Zajistíme správné přetečení indexu
      if(index < 0) {
        currentIndex = currentGalleryItems.length - 1;
      } else if (index >= currentGalleryItems.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      // Aktualizace obrázku v lightboxu
      const selectedItem = currentGalleryItems[currentIndex];
      lightboxImg.src = selectedItem.src;
      lightboxImg.alt = selectedItem.alt;
    }
  
    if(closeBtn){
      closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
      });
    }
  
    if(prevBtn){
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // zamezí zavření lightboxu při kliknutí na šipku
        showImageAtIndex(currentIndex - 1);
      });
    }
  
    if(nextBtn){
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImageAtIndex(currentIndex + 1);
      });
    }
  
    // Zavření lightboxu při kliknutí mimo obrázek
    if(lightbox){
      lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox){
          lightbox.style.display = 'none';
        }
      });
    }
  
    // Navigace pomocí klávesnice (šipky vlevo/vpravo)
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if(e.key === 'ArrowLeft'){
          showImageAtIndex(currentIndex - 1);
        } else if(e.key === 'ArrowRight'){
          showImageAtIndex(currentIndex + 1);
        } else if(e.key === 'Escape'){
          lightbox.style.display = 'none';
        }
      }
    });
  });

// Facebook SDK Integration
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/cs_CZ/sdk.js#xfbml=1&version=v12.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Reviews System
document.addEventListener('DOMContentLoaded', function() {
  const reviewForm = document.getElementById('review-form');
  const reviewsDisplay = document.getElementById('reviews-display');
  const tabButtons = document.querySelectorAll('.tab-btn');

  // Load reviews from localStorage
  function loadReviews(category) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const filteredReviews = reviews.filter(review => review.category === category);
    
    reviewsDisplay.innerHTML = filteredReviews.map(review => `
      <div class="review">
        <h4>${review.name}</h4>
        <p>Hodnocení: ${review.rating}/5</p>
        <p>${review.review}</p>
      </div>
    `).join('');
  }

  // Handle tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadReviews(button.dataset.tab);
    });
  });

  // Handle review submission
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(reviewForm);
    const review = {
      category: formData.get('category'),
      name: formData.get('name'),
      rating: formData.get('rating'),
      review: formData.get('review'),
      date: new Date().toISOString()
    };

    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    loadReviews(review.category);
    reviewForm.reset();
  });

  // Contact Form
  const contactForm = document.getElementById('contact');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch('https://formspree.io/f/xourgbpw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        alert('Děkujeme za vaši zprávu! Budeme vás kontaktovat.');
        contactForm.reset();
      } else {
        throw new Error('Odeslání se nezdařilo');
      }
    } catch (error) {
      alert('Došlo k chybě při odesílání zprávy. Prosím zkuste to později.');
    }
  });

  // Load initial reviews
  loadReviews('books');
});
