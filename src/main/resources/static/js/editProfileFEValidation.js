(async () => {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const url = "/users";
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    }
    let results = await fetch(url, options);
    let data = await results.json();
    let usernameInput = document.querySelector(".edit-username-field");
    let emailInput = document.querySelector(".edit-email-field");
    let registrationButton = document.querySelector(".submit-mods-btn");
    let messageElement = null;


    ///// ============================= JD USERNAME CHECK HERE ============================= \\\\

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
            usernameInput.after(messageElement)
            // registrationButton.after(messageElement);
            return;
        } else if (enteredUsername.includes(" ")) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Can't have spaces in username";
            messageElement.style.color = 'red';
            usernameInput.after(messageElement)
            // registrationButton.after(messageElement);
            return;
        } else {
            for (let user of data) {
                if (enteredUsername.toLowerCase() === user.username.toLowerCase()) {
                    registrationButton.style.display = 'none';
                    if (!messageElement) {
                        messageElement = document.createElement('p');
                        messageElement.innerText = "Username is taken, please choose another.";
                        messageElement.style.color = 'red';
                    }
                    usernameInput.after(messageElement)
                    return;
                } else if (enteredUsername.toLowerCase() === usernameInput.value.toLowerCase()) {
                    registrationButton.style.display = 'block';
                    return;
                }
            }
        }
        registrationButton.style.display = 'block';
    });


    ///// ============================= JD EMAIL CHECK HERE ============================= \\\\
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    emailInput.addEventListener('keyup', (e) => {
        const enteredEmail = e.target.value;
        if (messageElement) {
            messageElement.remove();
            messageElement = null;
        }
        if (enteredEmail === "") {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Need a email!";
            messageElement.style.color = 'red';
            emailInput.after(messageElement)
            return;
        } else if (enteredEmail.includes(" ")) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Can't have spaces in email";
            messageElement.style.color = 'red';
            emailInput.after(messageElement)
            return;
        } else if (!emailPattern.test(enteredEmail)) {
            registrationButton.style.display = 'none';
            messageElement = document.createElement('p');
            messageElement.innerText = "Invalid email format. Please enter a valid email.";
            messageElement.style.color = 'red';
            emailInput.after(messageElement)
            return;
        } else {
            for (let user of data) {
                if (enteredEmail === user.email) {
                    registrationButton.style.display = 'none';
                    if (!messageElement) {
                        messageElement = document.createElement('p');
                        messageElement.innerText = "Email is taken, please choose another.";
                        messageElement.style.color = 'red';
                    }
                    emailInput.after(messageElement)
                    return;
                    }
                    else if (enteredEmail === emailInput.value) {
                        registrationButton.style.display = 'block';
                        return;
                }
            };
        }
        registrationButton.style.display = 'block';
    });

})();