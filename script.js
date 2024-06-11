// script.js

document.addEventListener('DOMContentLoaded', function() {
    var readMoreLinks = document.querySelectorAll('.read-more');

    readMoreLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Read More functionality will be added soon!');
        });
    });

    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});
