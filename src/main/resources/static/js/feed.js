( async () => {
    const resultsPage = document.querySelector("#results");
    const url = "/feed";
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

    let results = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    });
    const data = await results.json();
    resultsPage.innerHTML ='';
    for(let meme of data){

    }


})();
