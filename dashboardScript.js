document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const avatarURL = document.getElementById('avatarURL').value;

    console.log('Attempting to update profile...'); // gpt_pilot_debugging_log

    try {
        const response = await fetch('/dashboard/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, avatarURL }),
        });

        console.log('Fetch request to update profile sent.'); // gpt_pilot_debugging_log

        if (!response.ok) {
            console.error('Failed to update profile, server responded with non-OK status.'); // gpt_pilot_debugging_log
            throw new Error('Failed to update profile');
        }

        const data = await response.text();
        alert(data);
        window.location.reload();
    } catch (error) {
        console.error('Dashboard script error:', error.message, error.stack); // gpt_pilot_debugging_log
        alert(error.message);
    }
});