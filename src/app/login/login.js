document.addEventListener('DOMContentLoaded', function () {

    const form = document.querySelector('form');
    const errorMessage = document.getElementById('error-message'); 

    form.addEventListener('submit', function (e) {
        e.preventDefault(); 

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        fetch('your-backend-endpoint', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            window.location.href = '/home'; 
        })
        .catch((error) => {
            console.error('Error:', error);
            errorMessage.textContent = 'Login failed. Please try again.'; 
            errorMessage.style.display = 'block'; 
        });
    });
});
