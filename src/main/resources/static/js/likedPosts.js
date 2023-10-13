const likedPostElement = document.querySelector("#likedPost");
const userIDElement3 = document.querySelector("#results");
let userID3 = userIDElement3.getAttribute("dataId");
let url3 = `/${userID3}/liked`;
let USER_LIKED_POSTS_ID = [];
const loggedInElement2 = document.querySelector('meta[name="userId"]');
let loggedInUserId2;
if (loggedInElement2 != null) {
    loggedInUserId2 = loggedInElement2.getAttribute('data-user-id');
}



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
    // console.log(data);
    if (!results.ok) {
        throw new Error(`HTTP error! Status: ${results.status}`);
    }
    function renderPage(){
        // Creates container for liked posts
        userIDElement3.innerHTML='';
        userIDElement3.classList.add('liked-posts-container');

        for(const likedPost of data){
            console.log(likedPost);
            USER_LIKED_POSTS_ID.push(likedPost);
            const likedPostDiv = document.createElement('div');
            likedPostDiv.classList.add('post-card');

            const likedPostHead = document.createElement('div');
            likedPostHead.classList.add('post-head');

            const likedPostImage = document.createElement('img');
            likedPostImage.src = likedPost.memeSubmission.memeURL;
            likedPostImage.width = 300;
            likedPostImage.height = 200;
            likedPostImage.classList.add('post-img');

            const likedPostCaptionDiv = document.createElement('div');
            const likedPostCaption = document.createElement('h2');
            likedPostCaption.textContent = `${likedPost.memeSubmission.caption}`;
            likedPostCaption.classList.add('post-caption');
            likedPostCaptionDiv.classList.add('post-caption-div');

            const likedPostDescription = document.createElement('p');
            likedPostDescription.textContent = `${likedPost.description}`;
            likedPostDescription.classList.add('post-description');

            likedPostDiv.appendChild(likedPostHead);
            likedPostDiv.appendChild(likedPostImage);
            likedPostCaptionDiv.appendChild(likedPostCaption);
            likedPostCaptionDiv.appendChild(likedPostDescription);
            likedPostDiv.appendChild(likedPostCaptionDiv);
            userIDElement3.appendChild(likedPostDiv);

        }
    }
    renderPage();
});