"use strict";
(function () {
    function validateLogin() {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let incorrectUsername = document.getElementById('incorrectUsername');
        let incorrectPassword = document.getElementById('incorrectPassword');
        let isValid = true;
        if (username === "") {
            incorrectUsername.style.color = 'red';
            incorrectUsername.innerHTML = "Please enter your username."
            isValid = false;
        }
        if(password === ""){
            incorrectPassword.style.color = 'red';
            incorrectPassword.innerHTML = "Please enter a valid password."
            isValid = false;
        }

    }
})();