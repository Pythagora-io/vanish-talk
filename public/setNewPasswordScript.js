document.getElementById('setNewPasswordForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        console.log('Passwords do not match.'); // Logging for mismatched passwords
        alert('The passwords do not match. Please try again.');
        return;
    }
    
    console.log('Passwords match - Proceeding with password change.'); // Logging for matched passwords

    try {
        const response = await fetch('/api/user/set-new-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message); // Logging success message
            alert(data.message);
            window.location.href = data.redirectTo;
        } else {
            // Improved error handling for non-OK responses
            const errorText = await response.text(); // Attempting to read the raw text of the response
            try {
                const errorData = JSON.parse(errorText);
                console.error('Failed to set a new password with parsed error:', errorData.message); // Logging parsed error message
                alert(errorData.message || 'Failed to set a new password.');
            } catch (parseError) {
                // If parsing fails, use the raw text
                console.error('Failed to set a new password with non-JSON response:', errorText); // Logging the raw error response
                alert('An error occurred. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error setting a new password:', error.message, error.stack); // Logging the complete error with stack trace
        alert('Failed to communicate with the server. Please check your connection and try again.');
    }
});