document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Attempting login with email:', email); // gpt_pilot_debugging_log
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log('Login successful for email:', email); // gpt_pilot_debugging_log
            console.log('Storing username in session storage for username:', data.user.username); // gpt_pilot_debugging_log
            sessionStorage.setItem('username', data.user.username);
            window.location.href = '/chat-room-select'; // Changed to direct users to the chat room selection page instead of the dashboard after login
        } else {
            console.error('Login failed for email:', email, 'Response:', data.message); // gpt_pilot_debugging_log
            alert(data.message);
        }
    } catch (error) {
        console.error('Login script error:', error.message, error.stack); // gpt_pilot_debugging_log
        alert('Failed to process login. Error: ' + error.message);
    }
});