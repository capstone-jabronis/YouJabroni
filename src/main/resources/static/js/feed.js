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
                    console.log(post);
                    const loggedInUserId = document.querySelector('meta[name="userId"]').getAttribute('data-user-id');
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
                        <span> Like </span>`;

                    postFeedCard.appendChild(likeBtnDiv);

                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    };

                    const handleRocketIconClick = async function (e) {
                        const likePostId = post.id;
                        console.log(likePostId);
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

            forwardBTN.addEventListener("click", () => {
                if (currentPage < Math.ceil(posts.length / itemsPerPage)) {
                    currentPage++;
                    renderPage(currentPage);
                }
            });

            backBTN.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage(currentPage);
                }
            });
        } catch (e) {
            console.log(e);
        }


    }
)();
