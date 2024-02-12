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
        } else {
            alert('Profile updated successfully.');
            window.location.reload();
        }

    } catch (error) {
        console.error('Dashboard script error:', error.message, error.stack); // gpt_pilot_debugging_log
        alert('Failed to update user profile.');
    }
});