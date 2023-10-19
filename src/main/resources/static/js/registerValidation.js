"use strict";

(async () => {
    const registrationButton = document.querySelector('.reg-button');

    function validate() {
        let username = document.getElementById('username').value.toLowerCase();
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPassword').value;
        let incorrectUsernameInput = document.getElementById('incorrectUsernameInput');
        let incorrectEmailInput = document.getElementById('incorrectEmailInput');
        let confirmPasswordAlert = document.getElementById('incorrectConfirmPass');
        let isValid = true;

        incorrectUsernameInput.innerHTML = '';
        incorrectEmailInput.innerHTML = '';
        confirmPasswordAlert.innerHTML = '';

        if (username.length < 1) {
            incorrectUsernameInput.style.color = 'red';
            incorrectUsernameInput.innerHTML = "Username needs more than 1 character.";
            isValid = false;
        } else if (username.length > 20) {
            incorrectUsernameInput.style.color = 'red';
            incorrectUsernameInput.innerHTML = "Username can't be longer than 20 characters.";
            isValid = false;
        }

        if (email.length < 1) {
            incorrectEmailInput.style.color = 'red';
            incorrectEmailInput.innerHTML = "Email cannot be empty.";
            isValid = false;
        } else if (email.includes(" ")) {
            incorrectEmailInput.style.color = 'red';
            incorrectEmailInput.innerHTML = "Email can't have spaces.";
            isValid = false;
        }

        if (password.length < 1) {
            confirmPasswordAlert.style.color = 'red';
            confirmPasswordAlert.innerHTML = "Password has to be longer than 1 character.";
            isValid = false;
        } else if (password.length > 20) {
            confirmPasswordAlert.style.color = 'red';
            confirmPasswordAlert.innerHTML = "Password cannot be longer than 20 characters.";
            isValid = false;
        }

        if (password !== confirmPassword) {
            confirmPasswordAlert.style.color = 'red';
            confirmPasswordAlert.innerHTML = 'Passwords do not match.';
            isValid = false;
        }

        return isValid;
    }

    function stickyForm() {
        let username = document.getElementById('username');
        let email = document.getElementById('email');
        sessionStorage.setItem('username', username.value);
        sessionStorage.setItem('email', email.value);
    }

    let form = document.getElementById('registerForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (validate()) {
            stickyForm();
            form.submit();
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
    };

    const results = await fetch(url, options);
    const usersData = await results.json();
    const usernameInput = document.getElementById('username');
    let messageElement = null;

    usernameInput.addEventListener('keyup', (e) => {
        const enteredUsername = e.target.value.toLowerCase();

        if (messageElement) {
            messageElement.remove();
            messageElement = null;
        }

        if (enteredUsername === "") {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Need a username!";
            messageElement.style.color = 'red';
            usernameInput.after(messageElement);
            return;
        } else if (enteredUsername.includes(" ")) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Can't have spaces in username";
            messageElement.style.color = 'red';
            usernameInput.after(messageElement);
            return;
        } else {
            for (const user of usersData) {
                if (enteredUsername.toLowerCase() === user.username.toLowerCase()) {
                    registrationButton.style.display = 'none';
                    if (!messageElement) {
                        messageElement = document.createElement('p');
                        messageElement.innerText = "Username is taken, please choose another.";
                        messageElement.style.color = 'red';
                    }
                    usernameInput.after(messageElement);
                    return;
                }
            }
        }
        registrationButton.style.display = 'block';
    });

    ///// ============================= JD EMAIL CHECK HERE ============================= \\\\
    const emailInput = document.getElementById('email');
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    emailInput.addEventListener('keyup', (e) => {
        const enteredEmail = e.target.value.toLowerCase();

        if (messageElement) {
            messageElement.remove();
            messageElement = null;
        }

        if (enteredEmail === "") {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Need an email!";
            messageElement.style.color = 'red';
            emailInput.after(messageElement);
            return;
        } else if (enteredEmail.includes(" ")) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Can't have spaces in email";
            messageElement.style.color = 'red';
            emailInput.after(messageElement);
            return;
        } else if (!emailPattern.test(enteredEmail)) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Invalid email format. Please enter a valid email.";
            messageElement.style.color = 'red';
            emailInput.after(messageElement);
            return;
        } else {
            for (const user of usersData) {
                if (enteredEmail.toLowerCase() === user.email.toLowerCase()) {
                    registrationButton.style.display = 'none';
                    if (!messageElement) {
                        messageElement = document.createElement('p');
                        messageElement.innerText = "Email is taken, please choose another.";
                        messageElement.style.color = 'red';
                    }
                    emailInput.after(messageElement);
                    return;
                }
            }
        }
        registrationButton.style.display = 'block';
    });

    ///// ============================= JD EMAIL PASSWORD HERE ============================= \\\\
    let passwordInput = document.querySelector(".password");
    passwordInput.addEventListener('keyup', (e) => {
        let typedPassword = e.target.value;
        if (messageElement) {
            messageElement.remove();
            messageElement = null;
        }

        if (typedPassword.length > 20 || typedPassword.length < 5) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Password must be 5-20 characters in length.";
            messageElement.style.color = 'red';
            passwordInput.after(messageElement);
            return;
        } else if (typedPassword.includes(" ")) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Password can't contain spaces.";
            messageElement.style.color = 'red';
            passwordInput.after(messageElement);
            return;
        } else {
            const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '|', '\\', ';', ':', '<', '>', ',', '.', '?', '/', '~', '`'];
            const capitalLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
            let hasSymbol = false;
            let hasCapitalLetter = false;

            for (let i = 0; i < typedPassword.length; i++) {
                if (symbols.includes(typedPassword[i])) {
                    hasSymbol = true;
                } else if (capitalLetters.includes(typedPassword[i])) {
                    hasCapitalLetter = true;
                }
            }

            if (!hasSymbol || !hasCapitalLetter) {
                registrationButton.style.display = 'none';
                messageElement = document.createElement('p');
                messageElement.innerText = "Password must include a symbol and a capital letter.";
                messageElement.style.color = 'red';
                passwordInput.after(messageElement);
                return;
            }
        }
        registrationButton.style.display = 'block';
    });
})();


