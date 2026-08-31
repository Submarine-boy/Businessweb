const config=window.SITE_CONFIG||{};const menuData=window.MENU_DATA||{};const reservationConfig=window.RESERVATION_CONFIG||{};
const getValue=(source,path)=>path.split('.').reduce((value,key)=>value?.[key],source);
document.querySelectorAll('[data-config]').forEach(e=>{const v=getValue(config,e.dataset.config);if(v!==undefined)e.innerHTML=v});
document.querySelectorAll('[data-config-href]').forEach(e=>{const v=getValue(config,e.dataset.configHref);if(v)e.href=`mailto:${v}`});
if(config.seo){document.title=config.seo.title||document.title;const d=document.querySelector('meta[name="description"]');if(d&&config.seo.description)d.content=config.seo.description}
if(config.theme){const m={accent:'--accent',accentHover:'--accent-hover',dark:'--dark',darkSoft:'--dark-soft',textOnDark:'--text-on-dark',mutedOnDark:'--muted-on-dark',paper:'--paper',paperSoft:'--paper-soft',text:'--text',mutedText:'--muted-text',card:'--card',border:'--border',borderStrong:'--border-strong',buttonText:'--button-text',overlay:'--overlay',selection:'--selection',accentSoft:'--accent-soft',input:'--input',map:'--map',footer:'--footer',borderDark:'--border-dark',focus:'--focus'};Object.entries(m).forEach(([k,v])=>{if(config.theme[k])document.documentElement.style.setProperty(v,config.theme[k])});if(config.theme.headingFont)document.documentElement.style.setProperty('--font-heading',`'${config.theme.headingFont}',serif`);if(config.theme.bodyFont)document.documentElement.style.setProperty('--font-body',`'${config.theme.bodyFont}',sans-serif`)}
if(config.hero?.image){const e=document.querySelector('.hero-image');if(e)e.style.backgroundImage=`url("${config.hero.image}")`}
function renderMenu(){const grid=document.querySelector('.menu-grid');if(!grid||!Array.isArray(menuData.dishes))return;grid.innerHTML=menuData.dishes.map((d,i)=>`<article class="dish-card ${i===0?'featured-dish':''}"><div class="dish-image" style="background-image:url('${d.image}')" role="img" aria-label="${d.name}"></div><div class="dish-info"><span>${d.category}</span><h3>${d.name}</h3><p>${d.description}</p><strong>${d.price}</strong></div></article>`).join('')}
function renderGallery() {
  const items = Array.isArray(menuData.gallery)
    ? menuData.gallery
    : [];

  const gallery = document.querySelector(".gallery-grid");

  if (!gallery || !items.length) return;

  gallery.innerHTML = `
    ${items.map((item, index) => `
      <div
        class="gallery-image ${index === 0 ? "active" : ""}"
        data-gallery-index="${index}"
      >
        <img
          src="${item.image}"
          alt="${item.alt || "Restaurant image"}"
          loading="${index === 0 ? "eager" : "lazy"}"
          decoding="async"
        >
      </div>
    `).join("")}

    <button
      class="gallery-prev"
      type="button"
      aria-label="Previous image"
    >
      &#8592;
    </button>

    <button
      class="gallery-next"
      type="button"
      aria-label="Next image"
    >
      &#8594;
    </button>

    <div class="gallery-dots" aria-label="Gallery navigation">
      ${items.map((_, index) => `
        <button
          class="gallery-dot ${index === 0 ? "active" : ""}"
          type="button"
          data-gallery-dot="${index}"
          aria-label="Show image ${index + 1}"
        ></button>
      `).join("")}
    </div>
  `;

  const slides = gallery.querySelectorAll(".gallery-image");
  const dots = gallery.querySelectorAll(".gallery-dot");
  const previous = gallery.querySelector(".gallery-prev");
  const next = gallery.querySelector(".gallery-next");

  let current = 0;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  previous.addEventListener("click", () => {
    showSlide(current - 1);
  });

  next.addEventListener("click", () => {
    showSlide(current + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  /* Mobile swipe support */

  let touchStartX = 0;
  let touchEndX = 0;

  gallery.addEventListener(
    "touchstart",
    event => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true }
  );

  gallery.addEventListener(
    "touchend",
    event => {
      touchEndX = event.changedTouches[0].screenX;

      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) < 50) return;

      if (difference > 0) {
        showSlide(current + 1);
      } else {
        showSlide(current - 1);
      }
    },
    { passive: true }
  );

  /* Keyboard navigation */

  gallery.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      showSlide(current - 1);
    }

    if (event.key === "ArrowRight") {
      showSlide(current + 1);
    }
  });

  gallery.setAttribute("tabindex", "0");
}
function renderStory(){if(!menuData.story)return;const s=document.querySelector('.story-content');if(!s)return;const e=s.querySelector('.eyebrow'),h=s.querySelector('h2'),p=s.querySelector('p:not(.eyebrow)');if(e)e.textContent=menuData.story.eyebrow||'';if(h)h.innerHTML=menuData.story.title||'';if(p)p.textContent=menuData.story.copy||''}
const menuToggle=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('.mobile-nav');if(menuToggle&&mobileNav){menuToggle.addEventListener('click',()=>{const o=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!o));mobileNav.classList.toggle('open',!o)});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')))}
function renderReservation(){const f=document.querySelector('#reservation-form');if(!f)return;const g=f.querySelector('select[name="guests"]'),t=f.querySelector('select[name="time"]');if(g&&reservationConfig.guests){g.innerHTML='';for(let i=Number(reservationConfig.guests.min||1);i<=Number(reservationConfig.guests.max||8);i++){const o=document.createElement('option');o.value=`${i} guest${i===1?'':'s'}`;o.textContent=o.value;g.appendChild(o)}}if(t&&Array.isArray(reservationConfig.timeSlots))t.innerHTML=reservationConfig.timeSlots.map(x=>`<option>${x}</option>`).join('')}
renderMenu();renderStory();renderGallery();renderReservation();
