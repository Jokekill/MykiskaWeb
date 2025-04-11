document.addEventListener("DOMContentLoaded", function() {
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
  