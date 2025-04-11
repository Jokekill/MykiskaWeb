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
              // Připojíme lightbox funkci k načteným fotkám
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
  
    /* ----- Lightbox pro zvětšení fotek ----- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox .close');
  
    function attachLightboxEvents(){
      const galleryItems = document.querySelectorAll('.gallery-item');
      galleryItems.forEach(item => {
        item.addEventListener('click', () => {
          lightbox.style.display = 'flex';
          lightboxImg.src = item.src;
          lightboxImg.alt = item.alt;
        });
      });
    }
  
    if(closeBtn){
      closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
      });
    }
  
    if(lightbox){
      lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox){
          lightbox.style.display = 'none';
        }
      });
    }
  });
  