document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed'); // gpt_pilot_debugging_log
    loadFooter();
    loadHeader(); // Added call to loadHeader function
});

function loadFooter() {
    console.log('Attempting to load footer...'); // gpt_pilot_debugging_log
    fetch('/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch footer.html');
            console.log('Footer fetch successful.'); // gpt_pilot_debugging_log
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            console.log('Footer appended successfully.'); // gpt_pilot_debugging_log
        })
        .catch(error => {
            console.error('Error loading the footer:', error.message, error.stack); // gpt_pilot_debugging_log
        });
}

function loadHeader() { // Added function to load the header
    console.log('Attempting to load header...'); // gpt_pilot_debugging_log
    fetch('/header.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch header.html');
            console.log('Header fetch successful.'); // gpt_pilot_debugging_log
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data); // Inserts the header at the beginning of the body
            console.log('Header appended successfully.'); // gpt_pilot_debugging_log
        })
        .catch(error => {
            console.error('Error loading the header:', error.message, error.stack); // gpt_pilot_debugging_log
        });
}