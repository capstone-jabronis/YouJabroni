const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const postElement = document.querySelector(".post");
const userIDElement = document.querySelector("#results");
let userID2 = userIDElement.getAttribute("dataId");
let url2 = `/${userID2}/posts`;
let USER_POST_ID = [];
const loggedInElement = document.querySelector('meta[name="userId"]');
let loggedInUserId;
if (loggedInElement != null) {
    loggedInUserId = loggedInElement.getAttribute('data-user-id');
    console.log(loggedInUserId);
}

postElement.addEventListener('click', async (e) => {
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
    if (!results.ok) {
        throw new Error(`HTTP error! Status: ${results.status}`);
    }

    function renderPage() {
        // Create the container for the posts
        userIDElement.innerHTML = '';
        userIDElement.classList.add('posts-container');

        for (const post of data) {
            USER_POST_ID.push(post.memeSubmission.id);
            // Create the div for the post card
            const postDiv = document.createElement('div');
            postDiv.classList.add('post-card');

            // Create a div for the heading of the card
            const postHead = document.createElement('div');
            postHead.classList.add('post-head');
            const postLikesContainer = document.createElement('div');
            postLikesContainer.classList.add('post-likes-container');
            const postLikes = document.createElement('span');
            postLikes.classList.add('post-likes', 'like-count-element');
            const rocketImg = document.createElement('img');
            rocketImg.classList.add('rocket-img');
            rocketImg.src = '/img/filled-rocket-btn.png';
            let count = 0;
            for(let user of post.userLikes){
                count++;
            }
            postLikes.textContent = count;
            const likeNote = document.createElement('span');
            if(count === 1) {
                likeNote.textContent = 'like';
            } else {
                likeNote.textContent = 'likes';
            }
            likeNote.classList.add('post-like-note', 'like-count-element');


            postLikesContainer.appendChild(rocketImg);
            postLikesContainer.appendChild(postLikes);
            postLikesContainer.appendChild(likeNote);
            postHead.appendChild(postLikesContainer);


            // Create an image element for the meme_pic
            const postImg = document.createElement('img');
            postImg.src = post.memeSubmission.memeURL;
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

            // Create the modal for edit
            const editModalOverlay = document.createElement('div');
            editModalOverlay.classList.add('hidden', 'overlay');
            const editModalSection = document.createElement('section');
            editModalSection.classList.add('hidden', 'edit-modal');

            // Create the modal for delete
            const deleteModalOverlay = document.createElement('div');
            deleteModalOverlay.classList.add('hidden', 'overlay');
            const deleteModalSection = document.createElement('section');
            deleteModalSection.classList.add('hidden', 'delete-modal');

            // Create the exit button for edit
            const editCloseButtonContainer = document.createElement('div');
            editCloseButtonContainer.classList.add('close-btn-container');
            const editCloseButton = document.createElement('button');
            editCloseButton.classList.add('btn-close');
            editCloseButton.textContent = 'x';

            // Create the container for the buttons in the delete modal
            const deleteModalButtonsContainer = document.createElement('div');
            deleteModalButtonsContainer.classList.add('delete-modal-btns-container');

            // Create the cancel button for delete
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'cancel';
            cancelButton.classList.add('cancel-btn');

            // Create the submit button for delete
            const submitDeleteButton = document.createElement('button');
            submitDeleteButton.setAttribute('type', 'submit');
            submitDeleteButton.classList.add('submit-delete-post');
            submitDeleteButton.textContent = 'yes';

            // Create the input for the edit form
            const editDescription = document.createElement('input');
            editDescription.id = 'edit-description';
            editDescription.setAttribute('name', 'editDescription');
            editDescription.classList.add('edit-description-input', 'input', 'input-field');
            editDescription.setAttribute('type', 'text');

            // Create the submit button for the edit form
            const editFormSubmitBtn = document.createElement('button');
            editFormSubmitBtn.setAttribute('type', 'submit');
            editFormSubmitBtn.classList.add('submit-edit-post');
            editFormSubmitBtn.textContent = 'save';

            // Create the cancel button for the edit form
            const cancelEditForm = document.createElement('button');
            cancelEditForm.textContent = 'cancel';
            cancelEditForm.classList.add('cancel-edit-form');

            // Function to close the edit modal
            const closeEditModal = function () {
                editModalSection.classList.add("hidden");
                editModalOverlay.classList.add("hidden");
                const editPostFormTitle = document.querySelector('.edit-post-form-title');
                editPostFormTitle.classList.add('hidden');
            };

            // Function to close the delete modal
            const closeDeleteModal = function () {
                deleteModalSection.classList.add('hidden');
                deleteModalOverlay.classList.add('hidden');
                const deletePostTitle = document.querySelector('.delete-post-title');
                deletePostTitle.classList.add('hidden');
            }

            // Event listener so the modal will not close when the user clicks on the input field
            editDescription.addEventListener("click", function (event) {
                event.stopPropagation();
            });

            // Function to open the edit modal
            const openEditModal = function (event) {
                event.stopPropagation();
                editModalSection.classList.remove('hidden');
                editModalOverlay.classList.remove('hidden');
                const editPostForm = document.querySelector('#edit-post-form');
                const editPostFormTitle = document.querySelector('.edit-post-form-title');

                if (!document.querySelector('.edit-description-input')) {
                    editPostForm.appendChild(editDescription);
                }

                if (!document.querySelector('.submit-edit-post')) {
                    editPostForm.appendChild(editFormSubmitBtn);
                }

                // set the hidden input's value to the current post id
                const postId = document.querySelector("#post-id");
                postId.value = post.id;

                // set the edit description input's value to the current post description
                const editDescriptionInput = document.getElementById('edit-description');
                editDescriptionInput.value = post.description;

                editModalSection.appendChild(editPostForm);
                editModalSection.appendChild(cancelEditForm);
                editPostForm.classList.remove('hidden');
                editPostFormTitle.classList.remove('hidden');
            }

            // Function to open the delete modal
            const openDeleteModal = function (event) {
                event.stopPropagation();
                deleteModalSection.classList.remove('hidden');
                deleteModalOverlay.classList.remove('hidden');
                const deletePostForm = document.querySelector('#delete-post-form');
                const deletePostTitle = document.querySelector('.delete-post-title');

                // if the button is not there already, append it
                if (!document.querySelector('.submit-delete-post')) {
                    deletePostForm.appendChild(submitDeleteButton);
                }

                const deletePostId = document.querySelector('#post-delete-id');
                deletePostId.value = post.id;
                deleteModalSection.appendChild(deletePostForm);
                deleteModalSection.appendChild(cancelButton);
                deletePostForm.classList.remove('hidden');
                deletePostTitle.classList.remove('hidden');
            }

            // Stop the modal from closing
            editPostButton.addEventListener("click", function (event) {
                event.stopPropagation();
                openEditModal(event);
            });

            deletePostButton.addEventListener('click', function (event) {
                event.stopPropagation();
                openDeleteModal(event);
            });

            editModalSection.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            deleteModalSection.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            // Event Listeners to close the modal
            editModalOverlay.addEventListener('click', closeEditModal);
            cancelEditForm.addEventListener('click', closeEditModal);

            deleteModalOverlay.addEventListener('click', closeDeleteModal);
            cancelButton.addEventListener('click', closeDeleteModal);

            postDiv.appendChild(postHead);
            postDiv.appendChild(postImg);
            postDiv.appendChild(postCaptionDiv);
            postCaptionDiv.appendChild(postCaption);
            postCaptionDiv.appendChild(postDescription);
            editModalOverlay.appendChild(editModalSection);
            deleteModalOverlay.appendChild(deleteModalSection);
            document.body.appendChild(deleteModalOverlay);
            document.body.appendChild(editModalOverlay);
            if (loggedInElement != null && userID2 == loggedInUserId) {
                buttonsContainer.appendChild(editPostButton);
                buttonsContainer.appendChild(deletePostButton);
                postCaptionDiv.appendChild(buttonsContainer);
            } else {

            }
            userIDElement.appendChild(postDiv);
        }
    }

    if (data.length === 0 && loggedInElement != null && userID2 == loggedInUserId) {
        userIDElement.innerHTML = '';
        const callToActionContainer = document.createElement('div');
        callToActionContainer.classList.add('call-to-action-container');
        const postCallToAction = document.createElement('img');
        postCallToAction.src = '../img/post-call-to-action.png';
        postCallToAction.height = 200;
        postCallToAction.classList.add('post-call-to-action');
        callToActionContainer.appendChild(postCallToAction);
        userIDElement.appendChild(callToActionContainer);
    } else {
        renderPage();
    }
});