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

            const loggedInUserId = document.querySelector('meta[name="userId"]').getAttribute('data-user-id');
            let userHasLiked = false;
            for (let user of likedPost.userLikes) {
                if (loggedInUserId == user.id) {
                    userHasLiked = true;
                }
            }
            const profileLikeBtnDiv = document.createElement('div');
            profileLikeBtnDiv.classList.add('like-box');
            profileLikeBtnDiv.innerHTML =
                `<img class="like-rocket" src="${userHasLiked ? '../img/filled-rocket-btn.png' : '../img/unfilled-rocket-btn.png'}">
                        <span> Like </span>`;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            };
            const handleRocketIconClick = async function (e) {
                const likePostId = likedPost.id;
                // console.log(likePostId);
                let results = await fetch(`/${likePostId}/liked`, options);
                const data = await results.json();
                console.log(data);
                console.log(e.target);
                if (e.target.src.endsWith('/img/unfilled-rocket-btn.png')) {
                    console.log("Inside if statement")
                    e.target.src = '../img/filled-rocket-btn.png';
                } else {
                    e.target.src = '../img/unfilled-rocket-btn.png';
                }

            };

            likedPostDiv.appendChild(likedPostHead);
            likedPostDiv.appendChild(likedPostImage);
            likedPostCaptionDiv.appendChild(likedPostCaption);
            likedPostCaptionDiv.appendChild(likedPostDescription);
            likedPostDiv.appendChild(likedPostCaptionDiv);
            likedPostDiv.appendChild(profileLikeBtnDiv);
            userIDElement3.appendChild(likedPostDiv);

            profileLikeBtnDiv.addEventListener('click', handleRocketIconClick);
        }
    }
    renderPage();
});