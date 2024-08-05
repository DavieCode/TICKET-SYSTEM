document.addEventListener("DOMContentLoaded", function () {
    // Sample events data (replace this with your actual events data)
    const eventsData = [
        { id: 1, name: "Concert 1", price: { VIP: 50, Regular: 30 }, maxAttendees: 100 },
        { id: 2, name: "Conference 1", price: { VIP: 100, Regular: 50 }, maxAttendees: 50 },
        // Add more events as needed
    ];

    // Function to populate events section
    function populateEvents() {
        const eventsSection = document.getElementById("events");

        eventsData.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-card");
            eventDiv.innerHTML = `
                <h3>${event.name}</h3>
                <p>Price: VIP $${event.price.VIP}, Regular $${event.price.Regular}</p>
                <p>Max Attendees: ${event.maxAttendees}</p>
                <button onclick="reserveTickets(${event.id})">Reserve Tickets</button>
            `;
            eventsSection.appendChild(eventDiv);
        });
    }

    // Initial call to populate events
    populateEvents();

    // Function to handle reservation form submission
    const reservationForm = document.getElementById("reservation-form");
    reservationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const eventId = parseInt(document.getElementById("event").value);
        const ticketType = document.getElementById("ticket-type").value;
        const quantity = parseInt(document.getElementById("quantity").value);

        const event = eventsData.find(e => e.id === eventId);

        if (!event) {
            console.error("Event not found!");
            return;
        }

        if (quantity <= 0 || quantity > 5) {
            console.error("Invalid quantity!");
            return;
        }

        // Handle reservation logic (you can customize this part based on your needs)
        console.log(`Reserved ${quantity} ${ticketType} tickets for ${event.name}`);

        // Reset form and hide it
        reservationForm.reset();
        reservationForm.style.display = "none";
    });
});

// Function to handle reserving tickets for an event
function reserveTickets(eventId) {
    const eventSelect = document.getElementById("event");
    const ticketTypeSelect = document.getElementById("ticket-type");
    const quantityInput = document.getElementById("quantity");

    // Set the selected event in the reservation form
    eventSelect.value = eventId;

    // Set default values for ticket type and quantity
    ticketTypeSelect.value = "VIP";
    quantityInput.value = 1;

    // Show reservation form
    const reservationForm = document.getElementById("reservation-form");
    reservationForm.style.display = "block";
}
