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

                    // Create a div for the heading of the card
                    const postFeedHead = document.createElement('div');
                    postFeedHead.classList.add('post-feed-head');
                    postFeedCard.appendChild(postFeedHead);

                    // Create the profile image and username that will be added to the head
                    let userProfilePicture = document.createElement('img');
                    const userUsername = document.createElement('p');
                    userUsername.classList.add('user-username');
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
                    userProfilePicture.addEventListener("click", function() {
                        window.location.href = `/${post.user.id}/profile`;
                    })
                    userUsername.addEventListener("click", function () {
                        window.location.href = `/${post.user.id}/profile`;
                    })

                    // Create the post image
                    const postFeedImage = document.createElement('img');
                    postFeedImage.classList.add('post-feed-image');
                    postFeedImage.src = post.memeSubmission.round.meme_pic;
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
