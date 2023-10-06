const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const postElement = document.querySelector(".post");
const userIDElement = document.querySelector("#results");
let userID2 = userIDElement.getAttribute("dataId");
let url2 = `/${userID2}/posts`;
const isAuthenticated = document.querySelector("[data-authenticated]");

postElement.addEventListener('click', async(e) => {
    e.preventDefault();
    let results = await fetch(url2, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    });
    let data = await results.json();
    console.log(data);
    if(!results.ok) {
        throw new Error(`HTTP error! Status: ${results.status}`);
    }

    function renderPage() {
        // Create the container for the posts
        userIDElement.innerHTML = '';
        userIDElement.classList.add('posts-container');

        for (const post of data) {
            // Create the div for the post card
            const postDiv = document.createElement('div');
            postDiv.classList.add('post-card');

            // Create a div for the heading of the card
            const postHead = document.createElement('div');
            postHead.classList.add('post-head');

            // Create an image element for the meme_pic
            const postImg = document.createElement('img');
            postImg.src = post.memeSubmission.round.meme_pic;
            postImg.width = 300;
            postImg.height = 180;
            postImg.classList.add('post-img');

            // Create the div for the caption
            const postCaptionDiv = document.createElement('div')
            const postCaption = document.createElement('h2');
            postCaption.textContent = `${post.memeSubmission.caption}`;
            postCaption.classList.add('post-caption');
            postCaptionDiv.classList.add('post-caption-div');

            // Create the h3 for the description
            const postDescription = document.createElement('p');
            postDescription.textContent = `${post.description}`;
            postDescription.classList.add('post-description');

            // Create a button to edit the posts
            const editPostButton = document.createElement('button');
            editPostButton.textContent = 'edit';
            editPostButton.classList.add('edit-post-btn', 'btn', 'btn-open');

            postDiv.appendChild(postHead);
            postDiv.appendChild(postImg);
            postDiv.appendChild(postCaptionDiv);
            postCaptionDiv.appendChild(postCaption);
            postCaptionDiv.appendChild(postDescription);
            // console.log("this is the user's id: " + userID2);
            // console.log("this is the user id associated with the post: " + post.user.id);
            if(userID2 == post.user.id && isAuthenticated) {
                postCaptionDiv.appendChild(editPostButton);
            }
            userIDElement.appendChild(postDiv);
        }
    }
    renderPage();
});