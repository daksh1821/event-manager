document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');

    if (eventForm) {
        eventForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: e.target.name.value,
                date: e.target.date.value,
                location: e.target.location.value,
                description: e.target.description.value,
                attendees: []
            };

            try {
                const response = await fetch('http://localhost:3006/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                alert('Event created successfully!');
                addEventToList(result);
                eventForm.reset();
            } catch (err) {
                console.error('Error:', err);
                alert('Failed to create event');
            }
        });
    }

    async function loadEvents() {
        try {
            const response = await fetch('http://localhost:3006/api/events');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const events = await response.json();

            const eventList = document.getElementById('event-list');
            eventList.innerHTML = '';

            events.forEach(event => {
                addEventToList(event);
            });
        } catch (err) {
            console.error('Error:', err);
        }
    }

    function addEventToList(event) {
        const eventList = document.getElementById('event-list');
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';

        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p>${new Date(event.date).toLocaleDateString()}</p>
            <p>${event.location}</p>
            <p>${event.description}</p>
        `;

        eventList.appendChild(eventCard);
    }

    if (document.getElementById('event-list')) {
        loadEvents();
    }
});
// JavaScript to toggle the visibility of the contact form

document.getElementById('contact-us').addEventListener('click', function() {
    document.getElementById('contact-form').classList.toggle('hidden');
});


