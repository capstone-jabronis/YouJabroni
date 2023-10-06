"use strict";
(function () {
    function validate() {
        let username = document.getElementById('username').value;
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
})();
