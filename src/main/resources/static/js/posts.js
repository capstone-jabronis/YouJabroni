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

            // Create a button to delete the posts
            const deletePostButton = document.createElement('button');
            deletePostButton.textContent = 'delete';
            deletePostButton.classList.add('delete-post-btn');

            // Create a div to hold the edit and delete buttons
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            // Create the modal
            const editModalOverlay = document.createElement('div');
            editModalOverlay.classList.add('hidden', 'overlay');
            const editModalSection = document.createElement('section');
            editModalSection.classList.add('hidden', 'post-modal');

            // Create the exit button
            const editCloseButtonContainer = document.createElement('div');
            editCloseButtonContainer.classList.add('close-btn-container');
            const editCloseButton = document.createElement('button');
            editCloseButton.classList.add('btn-close');
            editCloseButton.textContent = 'x';

            // Create the input for the edit form
            const editDescription = document.createElement('input');
            editDescription.value = post.description;
            editDescription.id = 'edit-description';
            editDescription.name = 'edit-description';
            editDescription.setAttribute('type', 'text');

            // Create the submit button for the edit form
            const editFormSubmitBtn = document.createElement('button');
            editFormSubmitBtn.setAttribute('type', 'submit');
            editFormSubmitBtn.classList.add('submit-edit-post');
            editFormSubmitBtn.textContent = 'save';

            // Function to close the modal
            const closeEditModal = function () {
                editModalSection.classList.add("hidden");
                editModalOverlay.classList.add("hidden");
            };

            // let description = document.querySelector("#edit-description");
            // description.value = post.description;
            editDescription.addEventListener("click", function(event) {
                event.stopPropagation();
            });

            // Function to open the modal
            // document.addEventListener("DOMContentLoaded", function() {
                const openEditModal = function (event) {
                    event.stopPropagation();
                    editModalSection.classList.remove('hidden');
                    editModalOverlay.classList.remove('hidden');
                    const editPostForm = document.querySelector('#edit-post-form');
                    editPostForm.appendChild(editDescription);
                    editPostForm.appendChild(editFormSubmitBtn);
                    const postId = document.querySelector("#post-id");
                    postId.value = post.id;
                    editModalSection.appendChild(editPostForm);
                    editPostForm.classList.remove('hidden');
                }

            // });
            // Stop the modal from closing
            editPostButton.addEventListener("click", function(event) {
                event.stopPropagation();
                openEditModal(event);
            });

            // Event Listeners to close the modal
            editModalOverlay.addEventListener("click", closeEditModal);
            editCloseButton.addEventListener("click", closeEditModal);

            postDiv.appendChild(postHead);
            postDiv.appendChild(postImg);
            postDiv.appendChild(postCaptionDiv);
            postCaptionDiv.appendChild(postCaption);
            postCaptionDiv.appendChild(postDescription);
            editModalOverlay.appendChild(editModalSection);
            postCaptionDiv.appendChild(editModalOverlay);
            if(userID2 == post.user.id && isAuthenticated) {
                buttonsContainer.appendChild(editPostButton);
                buttonsContainer.appendChild(deletePostButton);
                postCaptionDiv.appendChild(buttonsContainer);
            }
            userIDElement.appendChild(postDiv);
        }
    }
    renderPage();
});