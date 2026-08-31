/*
 * Reservation configuration
 *
 * Customize the reservation experience here for each restaurant prospect.
 * Keep the available days, service hours, party-size limits and time slots
 * accurate to information verified with the restaurant.
 */
const RESERVATION_CONFIG = {
    heading: {
        eyebrow: 'Your table is waiting',
        title: 'Make an evening<br><em>of it.</em>',
        copy: 'For parties of up to 8, reserve online below. For larger groups, give us a call and we\'ll look after you.'
    },
    availability: {
        days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        openingTime: '18:00',
        closingTime: '23:00',
        kitchenClosingTime: '22:00'
    },
    guests: {
        min: 1,
        max: 8,
        default: 2
    },
    timeSlots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'],
    labels: {
        date: 'Date',
        guests: 'Guests',
        time: 'Time',
        submit: 'Find a table',
        confirmation: 'Thanks — your table request has been received for {guests} on {date} at {time}. This demo does not process live bookings.'
    }
};
