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
    console.log(usersData);
    // for (const user of usersData){
    //     if (user.username == inputElement.value){
    //         const p = document.createElement('p');
    //         p.innerText = `${user.username} is already taken please make another username`
    //         inputElement.after(p);
    //     }
    // }


(async () =>{
    const results = await fetch(url, options);
    const usersData = await results.json();
    console.log(usersData);
}) ();