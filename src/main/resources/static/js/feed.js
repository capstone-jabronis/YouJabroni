(async () => {

        try {
            const resultsPage = document.querySelector("#results");
            const url = "/feed/api";
            const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
            let results = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (!results.ok) {
                throw new Error(`HTTP error! Status: ${results.status}`);
            }
            let posts = await results.json();
            const postsFeedContainer = document.createElement('div');
            postsFeedContainer.classList.add('posts-feed-container');

            const itemsPerPage = 18;
            let currentPage = 1;

            function renderPage(page) {
                postsFeedContainer.innerHTML = '';
                for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage && i < posts.length; i++) {
                    const post = posts[i];
                    // Create a div for each card
                    const postFeedCard = document.createElement('div');
                    postFeedCard.classList.add('post-feed-card');
                    postFeedCard.dataset.postId = `${post.id}`;


                    // Create a div for the heading of the card
                    const postFeedHead = document.createElement('div');
                    postFeedHead.classList.add('post-feed-head');
                    postFeedCard.appendChild(postFeedHead);

                    // Create the profile image and username that will be added to the head
                    let userProfilePicture = document.createElement('img');
                    const userUsername = document.createElement('p');
                    userUsername.classList.add('user-post-username');
                    userProfilePicture.classList.add('user-profile-picture');
                    if (post.user.profileURL) {
                        userProfilePicture.src = post.user.profileURL;
                    } else {
                        userProfilePicture.src = "/img/memespace.gif";
                    }
                    userProfilePicture.width = 50;
                    userProfilePicture.height = 50;
                    userUsername.textContent = `${post.user.username}`;
                    postFeedHead.appendChild(userProfilePicture);
                    postFeedHead.appendChild(userUsername);

                    // Create the event listener so a user can click on the username or profile pic and be redirected to that user's profile page
                    userProfilePicture.addEventListener("click", function () {
                        window.location.href = `/${post.user.id}/profile`;
                    })
                    userUsername.addEventListener("click", function () {
                        window.location.href = `/${post.user.id}/profile`;
                    })

                    // Create the post image
                    const postFeedImage = document.createElement('img');
                    postFeedImage.classList.add('post-feed-image');
                    postFeedImage.src = post.memeSubmission.memeURL;
                    postFeedImage.width = 300;
                    postFeedImage.height = 180;
                    postFeedCard.appendChild(postFeedImage);

                    // Create the div for the like count
                    const likeCountRow = document.createElement('div');
                    likeCountRow.classList.add('like-count-row');
                    const likeCountContainer = document.createElement('div');
                    likeCountContainer.classList.add('like-count-container');
                    const likeCount = document.createElement('span');
                    likeCount.classList.add('like-count', 'like-count-element');
                    let count = 0;
                    for(let user of post.userLikes){
                        count++;
                    }
                    likeCount.textContent = count;
                    const like = document.createElement('span');
                    like.classList.add('like-span', 'like-count-element');
                    if(count === 1) {
                        like.textContent = 'like';
                    } else {
                        like.textContent = 'likes';
                    }
                    likeCountContainer.appendChild(likeCount);
                    likeCountContainer.appendChild(like);
                    likeCountRow.appendChild(likeCountContainer);
                    postFeedCard.appendChild(likeCountRow);

                    // Create the div for the caption
                    const postFeedCaptionDiv = document.createElement('div');
                    const caption = document.createElement('h2');
                    caption.classList.add('post-feed-caption');
                    postFeedCaptionDiv.classList.add('post-feed-caption-div');
                    caption.innerText = post.memeSubmission.caption;
                    postFeedCaptionDiv.appendChild(caption);

                    // Create the h3 for the description
                    const postFeedDescription = document.createElement('p');
                    postFeedDescription.textContent = `${post.description}`;
                    postFeedDescription.classList.add('post-feed-description');
                    postFeedCaptionDiv.appendChild(postFeedDescription);
                    postFeedCard.appendChild(postFeedCaptionDiv);

                    // logic to dictate which rocket image to use
                    const loggedInElement = document.querySelector('meta[name="userId"]');
                    let loggedInUserId;
                    if (loggedInElement != null) {
                        loggedInUserId = loggedInElement.getAttribute('data-user-id');
                    }
                    let userHasLiked = false;
                    for (let user of post.userLikes) {
                        if (loggedInUserId == user.id) {
                             userHasLiked = true;
                        }
                    }

                    // Adding like button to the post card
                    const likeBtnDiv = document.createElement('div');
                    likeBtnDiv.classList.add('like-box');
                    likeBtnDiv.innerHTML =
                        `<img class="like-rocket" src="${userHasLiked ? '../img/filled-rocket-btn.png' : '../img/unfilled-rocket-btn.png'}">
`;
                    const likeBtnCaption = document.createElement('span');
                    likeBtnCaption.classList.add('like-span');
                    likeBtnCaption.innerText = userHasLiked ? 'Unlike' : 'Like'; // Set initial text based on user's like status
                    likeBtnDiv.appendChild(likeBtnCaption);


                    if(loggedInUserId != null) {
                        postFeedCard.appendChild(likeBtnDiv);
                    }

                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    };
                    //  Toggles the rocket icon by checking if user is in user likes list on post
                    const handleRocketIconClick = async function (e) {
                        const likePostId = post.id;
                        let results = await fetch(`/${likePostId}/liked`, options);
                        const data = await results.json();

                        if (e.target.src.endsWith('/img/unfilled-rocket-btn.png')) {
                            e.target.src = '../img/filled-rocket-btn.png';
                            userHasLiked = true;
                            count++;
                        } else {
                            e.target.src = '../img/unfilled-rocket-btn.png';
                            userHasLiked = false;
                            count--;
                        }

                        likeCount.textContent = count;
                        likeBtnCaption.innerText = userHasLiked ? 'Unlike' : 'Like';
                        if (count === 1) {
                            like.textContent = 'like';
                        } else {
                            like.textContent = 'likes';
                        }
                    };
                    likeBtnDiv.addEventListener('click', handleRocketIconClick);


                    //  Display like count in span
                    const postLikeCount = document.createElement('span');
                    postLikeCount.textContent = `${post.userLikes.length}`;
                    postsFeedContainer.appendChild(postFeedCard);
                }
            }

            renderPage(currentPage);
            resultsPage.appendChild(postsFeedContainer);

            let forwardBTN = document.querySelector("#forward");
            let backBTN = document.querySelector("#back");

            backBTN.style.display = "none";

            forwardBTN.addEventListener("click", () => {
                if (currentPage < Math.ceil(posts.length / itemsPerPage)) {
                    currentPage++;
                    renderPage(currentPage);
                    backBTN.style.display = "block";
                }
                if (currentPage === Math.ceil(posts.length / itemsPerPage)) {
                    forwardBTN.style.display = "none";
                }
            });

            backBTN.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage(currentPage);
                    forwardBTN.style.display = "block";
                }
                if (currentPage === 1) {
                    backBTN.style.display = "none";
                }
            });
        } catch (e) {
            console.log(e);
        }


    }
)();
