const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const postsContainer = document.querySelector("#posts");
const userIDElement = document.querySelector("#results");
let userID2 = userIDElement.getAttribute("dataId");
let url2 = `/${userID2}/posts`

postsContainer.addEventListener('click', async(e) => {
    e.preventDefault();

    let results = await fetch(url2, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    });
    const data = await results.json();
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
            postImg.src = post.meme.round.mem_pic;
            postImg.width = 300;
            postImg.height = 200;
            postImg.classList.add('post-img');

            // Create the div for the caption
            const postCaptionDiv = document.createElement('div')
            const postCaption = document.createElement('h2');
            postCaption.textContent = `${post.caption}`;
            postCaption.classList.add('post-caption');
            postCaptionDiv.classList.add('post-caption-div');

            // Create the div for the description
            const postDescriptionDiv = document.createElement('div');
            const postDescription = document.createElement('h3');
            postDescription.textContent = `${post.description}`;
            postDescription.classList.add('post-description');
            postDescriptionDiv.classList.add('post-description-div');

            postDescription.appendChild(postDescriptionDiv);
            postCaption.appendChild(postCaptionDiv);
            postDiv.appendChild(postHead);
            postDiv.appendChild(postImg);
            postDiv.appendChild(postCaptionDiv);
            postDiv.appendChild(postDescriptionDiv);
            userIDElement.appendChild(postDiv);
        }
    }
    renderPage();
});