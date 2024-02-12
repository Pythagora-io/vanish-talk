document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Attempting registration with email:', email); // gpt_pilot_debugging_log
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log('Registration response received:', data); // gpt_pilot_debugging_log
        if (response.ok) {
            console.log('Registration successful for email:', email); // gpt_pilot_debugging_log
            alert('Registration successful. Please check your email to verify your account before logging in.');
            window.location.href = '/login';
        } else {
            console.error('Failed to register:', data.message); // gpt_pilot_debugging_log
            alert(`Failed to register: ${data.message}`);
        }
    } catch (error) {
        console.error('Registration script error:', error.message, error.stack); // gpt_pilot_debugging_log
        alert('Failed to register');
    }
});