async function fetchUserData() {
    try {
        const response = await fetch('/api/user/data'); // API endpoint to be implemented or adjusted
        if (!response.ok) {
            console.error('Failed to fetch user data, server responded with non-OK status.'); // gpt_pilot_debugging_log
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        document.getElementById('username').value = userData.username;
        document.getElementById('avatarURL').value = userData.avatarURL;
    } catch (error) {
        console.error('Failed to fetch or assign user data:', error.message, error.stack); // gpt_pilot_debugging_log
        alert('Failed to load user profile data.');
    }
}

document.addEventListener('DOMContentLoaded', fetchUserData);

document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const avatarURL = document.getElementById('avatarURL').value;

    console.log('Sending profile update request with data:', { username, password, avatarURL }); // gpt_pilot_debugging_log

    try {
        const response = await fetch('/api/user/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, avatarURL }),
        });

        console.log('Fetch request to update profile sent.'); // gpt_pilot_debugging_log

        if (!response.ok) {
            console.error(`Failed to update profile, server responded with status: ${response.status}`); // gpt_pilot_debugging_log
            throw new Error(`Failed to update profile - Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received response:', data); // gpt_pilot_debugging_log
        console.log(`Server response: ${data.message}`); // gpt_pilot_debugging_log
        alert(data.message);
        window.location.reload();
    } catch (error) {
        console.error(`Dashboard script error: ${error.message}`, error.stack); // gpt_pilot_debugging_log
        alert('Failed to update profile. Error: ' + error.message);
    }
});