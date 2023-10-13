const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const likedPostElement = document.querySelector("#likedPost");
const userIDElement = document.querySelector("#results");
let userID2 = userIDElement.getAttribute("dataId");
let url2 = `/${userID2}/liked`;
const isAuthenticated = document.querySelector("[data-authenticated]");
let USER_POST_ID = [];
likedPostElement.addEventListener('click', async(e)=>{
    e.preventDefault();
    let results = await fetch(url2, {
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    });
    let data = await results.json();
    console.log(data);
    if (!results.ok) {
        throw new Error(`HTTP error! Status: ${results.status}`);
    }
    function renderPage(){
        // Creates container for liked posts
        userIDElement.innerHTML='';
        userIDElement.classList.add('liked-posts-container');

        for(const likedPost of data){
            // USER_POST_ID.push(likedPost);
            console.log(likedPost)
        }
    }
    renderPage();
});