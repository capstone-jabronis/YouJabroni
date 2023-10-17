const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const url = "/users";
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
    }
}
const inputElement = document.querySelector(".input-field");

    const results = await fetch(url, options);
    const usersData = await results.json();


(async () =>{
    const results = await fetch(url, options);
    const usersData = await results.json();
}) ();