const likedPostElement = document.querySelector("#likedPost");
const userIDElement3 = document.querySelector("#results");
let userID3 = userIDElement3.getAttribute("dataId");
let url3 = `/${userID3}/liked`;
let USER_LIKED_POSTS_ID = [];
const loggedInElement2 = document.querySelector('meta[name="userId"]');
let loggedInUserId2;
if (loggedInElement2 != null) {
    loggedInUserId2 = loggedInElement2.getAttribute('data-user-id');
    console.log(loggedInUserId2);
}

console.log(likedPostElement);

likedPostElement.addEventListener('click', async(e)=>{
    console.log("likedPostElement clicked");
    e.preventDefault();
    console.log(`url: ${url3}`);
    let results = await fetch(url3, {
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
        userIDElement3.innerHTML='';
        userIDElement3.classList.add('liked-posts-container');
        // console.log(data);
        for(const likedPost of data){
            USER_LIKED_POSTS_ID.push(likedPost);
            console.log(likedPost)
        }
    }
    renderPage();
});