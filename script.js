const config = window.SITE_CONFIG || {};
const menuData = window.MENU_DATA || {};
const reservationConfig = window.RESERVATION_CONFIG || {};

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
            <div class="dish-info"><span>${dish.category}</span><h3>${dish.name}</h3><p>${dish.description}</p><strong>${dish.price}</strong></div>
        </article>`).join('');
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

function renderReservation() {
    if (!reservationForm || !reservationConfig) return;
    const heading = reservationConfig.heading || {};
    const eyebrow = document.querySelector('#reserve .eyebrow');
    const title = document.querySelector('#reserve-title');
    const copy = document.querySelector('#reserve .reserve-content > p:not(.eyebrow):not(.form-note)');
    if (eyebrow && heading.eyebrow) eyebrow.textContent = heading.eyebrow;
    if (title && heading.title) title.innerHTML = heading.title;
    if (copy && heading.copy) copy.textContent = heading.copy;

    const dateInput = reservationForm.querySelector('input[type="date"]');
    const guestsSelect = reservationForm.querySelector('select[name="guests"]');
    const timeSelect = reservationForm.querySelector('select[name="time"]');
    const labels = reservationConfig.labels || {};
    const dateLabel = dateInput?.closest('label');
    const guestsLabel = guestsSelect?.closest('label');
    const timeLabel = timeSelect?.closest('label');
    if (dateLabel && labels.date) dateLabel.firstChild.textContent = labels.date;
    if (guestsLabel && labels.guests) guestsLabel.firstChild.textContent = labels.guests;
    if (timeLabel && labels.time) timeLabel.firstChild.textContent = labels.time;

    const submit = reservationForm.querySelector('button[type="submit"]');
    if (submit && labels.submit) submit.textContent = labels.submit;

    if (guestsSelect && reservationConfig.guests) {
        const min = Number(reservationConfig.guests.min || 1);
        const max = Number(reservationConfig.guests.max || 8);
        const defaultGuests = Number(reservationConfig.guests.default || min);
        guestsSelect.innerHTML = '';
        for (let count = min; count <= max; count += 1) {
            const option = document.createElement('option');
            option.value = `${count} guest${count === 1 ? '' : 's'}`;
            option.textContent = option.value;
            option.selected = count === defaultGuests;
            guestsSelect.appendChild(option);
        }
    }

    if (timeSelect && Array.isArray(reservationConfig.timeSlots)) {
        timeSelect.innerHTML = reservationConfig.timeSlots.map(time => `<option value="${time}">${time}</option>`).join('');
    }

    if (dateInput && Array.isArray(reservationConfig.availability?.days)) {
        const allowedDays = new Set(reservationConfig.availability.days.map(day => day.toLowerCase()));
        dateInput.addEventListener('input', () => {
            if (!dateInput.value) return;
            const chosen = new Date(`${dateInput.value}T12:00:00`);
            const day = chosen.toLocaleDateString('en-GB', { weekday: 'long' }).toLowerCase();
            dateInput.setCustomValidity(allowedDays.has(day) ? '' : `Reservations are available on ${reservationConfig.availability.days.join(', ')}.`);
        });
    }
}

renderMenu();
renderStoryAndGallery();
renderReservation();

if (reservationForm && formNote) {
    const dateInput = reservationForm.querySelector('input[type="date"]');
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    reservationForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!reservationForm.checkValidity()) {
            reservationForm.reportValidity();
            return;
        }
        const data = new FormData(reservationForm);
        const date = new Date(`${data.get('date')}T12:00:00`);
        const formatted = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
        const template = reservationConfig.labels?.confirmation || 'Thanks — your table request has been received for {guests} on {date} at {time}. This demo does not process live bookings.';
        formNote.textContent = template.replace('{guests}', data.get('guests')).replace('{date}', formatted).replace('{time}', data.get('time'));
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
