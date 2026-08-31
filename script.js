const config = window.SITE_CONFIG || {};
const menuData = window.MENU_DATA || {};

const getValue = (source, path) => path.split('.').reduce((value, key) => value?.[key], source);

document.querySelectorAll('[data-config]').forEach(element => {
    const value = getValue(config, element.dataset.config);
    if (value !== undefined) element.innerHTML = value;
});

document.querySelectorAll('[data-config-href]').forEach(element => {
    const value = getValue(config, element.dataset.configHref);
    if (value) element.href = `mailto:${value}`;
});

if (config.seo) {
    document.title = config.seo.title || document.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && config.seo.description) description.content = config.seo.description;
}

if (config.theme) {
    document.documentElement.style.setProperty('--accent', config.theme.accent || '#d2c196');
    document.documentElement.style.setProperty('--dark', config.theme.dark || '#24251f');
    document.documentElement.style.setProperty('--paper', config.theme.paper || '#f4f0e8');
}

if (config.hero?.image) {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) heroImage.style.backgroundImage = `url("${config.hero.image}")`;
}

function renderMenu() {
    const grid = document.querySelector('.menu-grid');
    if (!grid || !Array.isArray(menuData.dishes)) return;

    const title = document.querySelector('#menu-title');
    const intro = document.querySelector('.menu-section .section-heading > p');
    if (title && menuData.intro?.title) title.innerHTML = menuData.intro.title;
    if (intro && menuData.intro?.copy) intro.textContent = menuData.intro.copy;

    grid.innerHTML = menuData.dishes.map((dish, index) => `
        <article class="dish-card ${index === 0 ? 'featured-dish' : ''}">
            <div class="dish-image" style="background-image:url('${dish.image}')" role="img" aria-label="${dish.name}"></div>
            <div class="dish-info">
                <span>${dish.category}</span>
                <h3>${dish.name}</h3>
                <p>${dish.description}</p>
                <strong>${dish.price}</strong>
            </div>
        </article>
    `).join('');
}

function renderStoryAndGallery() {
    if (menuData.story) {
        const story = document.querySelector('.story-content');
        if (story) {
            const eyebrow = story.querySelector('.eyebrow');
            const heading = story.querySelector('h2');
            const copy = story.querySelector('p:not(.eyebrow)');
            if (eyebrow) eyebrow.textContent = menuData.story.eyebrow || '';
            if (heading) heading.innerHTML = menuData.story.title || '';
            if (copy) copy.textContent = menuData.story.copy || '';
        }
    }

    if (Array.isArray(menuData.gallery)) {
        document.querySelectorAll('.gallery-image').forEach((element, index) => {
            const item = menuData.gallery[index];
            if (!item) return;
            element.style.backgroundImage = `url('${item.image}')`;
            element.setAttribute('aria-label', item.alt || 'Restaurant image');
        });
    }
}

renderMenu();
renderStoryAndGallery();

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        const open = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!open));
        menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
        mobileNav.classList.toggle('open', !open);
    });

    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
        mobileNav.classList.remove('open');
    }));
}

const reservationForm = document.querySelector('#reservation-form');
const formNote = document.querySelector('#form-note');
if (reservationForm && formNote) {
    const dateInput = reservationForm.querySelector('input[type="date"]');
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

    reservationForm.addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(reservationForm);
        const date = new Date(`${data.get('date')}T12:00:00`);
        const formatted = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        formNote.textContent = `Thanks — we're checking ${data.get('guests')} for ${formatted} at ${data.get('time')}. This demo does not process live bookings.`;
    });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.dish-card,.gallery-image,.story-content,.visit-grid').forEach(item => {
        item.classList.add('reveal');
        observer.observe(item);
    });
}
