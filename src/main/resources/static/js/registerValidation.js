"use strict";
(async () => {
    function validate() {
        let username = document.getElementById('username').value.toLowerCase();
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPassword').value;
        let incorrectUsernameInput = document.getElementById('incorrectUsernameInput');
        let incorrectEmailInput = document.getElementById('incorrectEmailInput');
        let confirmPasswordAlert = document.getElementById('incorrectConfirmPass');
        let isValid = true;
        if (username.length < 1) {
            incorrectUsernameInput.style.color = 'red';
            incorrectUsernameInput.innerHTML = "Username needs more than 1 character."
            isValid = false;
        }
        if (username.length > 20) {
            incorrectUsernameInput.style.color = 'red';
            incorrectUsernameInput.innerHTML = "Username can't be longer than 20 characters."
            isValid = false;
        }
        if (email.length < 1) {
            incorrectEmailInput.style.color = 'red';
            incorrectEmailInput.innerHTML = "Email cannot be empty."
            isValid = false;
        }
        if (password.length < 1) {
            confirmPasswordAlert.style.color = 'red';
            confirmPasswordAlert.innerHTML = "Password has to be longer than 1 character."
            isValid = false;
        }
        if (password.length > 20) {
            confirmPasswordAlert.style.color = 'red';
            confirmPasswordAlert.innerHTML = "Password cannot be longer than 20 characters."
            isValid = false;
        }
        if (password !== confirmPassword) {
            confirmPasswordAlert.style.color = 'red';
            confirmPasswordAlert.innerHTML = 'Passwords do not match.'
            isValid = false;
        }
        if (isValid) {
            return isValid;
        }
    }

    function stickyForm() {
        let username = document.getElementById('username');
        let email = document.getElementById('email');
        sessionStorage.setItem('username', username.value);
        sessionStorage.setItem('email', email.value);
    }

    let form = document.getElementById('registerForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validate() === true) {
            stickyForm();
            form.submit();
        }
        if (validate() === false) {
            e.preventDefault();
        }
    });
    let userField = document.getElementById('username');
    userField.value = sessionStorage.getItem('username');
    let emailField = document.getElementById('email');
    emailField.value = sessionStorage.getItem('email');

    ///// ============================= JD USERNAME CHECK HERE ============================= \\\\


    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const url = "/users";
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    }

    const results = await fetch(url, options);
    const usersData = await results.json();
    const usernameInput = document.getElementById('username');
    const registrationButton = document.querySelector('.reg-button');
    let messageElement = null;


    usernameInput.addEventListener('keyup', (e) => {
        const enteredUsername = e.target.value.toLowerCase();

        if (messageElement) {
            messageElement.remove();
            messageElement = null;
        }
        if (enteredUsername == "") {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('h3');
            messageElement.innerText = "Need a username!";
            messageElement.style.color = 'red';
            registrationButton.after(messageElement);
            return;
        } else if (enteredUsername.includes(" ")) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('h3');
            messageElement.innerText = "Can't have spaces in username";
            messageElement.style.color = 'red';
            registrationButton.after(messageElement);
            return;
        } else {
            for (const username of usersData) {
                if (enteredUsername === username.toLowerCase()) {
                    registrationButton.style.display = 'none';
                    if (!messageElement) {
                        messageElement = document.createElement('h3');
                        messageElement.innerText = "Username is taken, please choose another.";
                        messageElement.style.color = 'red';
                    }
                    registrationButton.after(messageElement);
                    return;
                }
            }
        }
        registrationButton.style.display = 'block';
    });


})();
