const csrfToken2 = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const historyContainer = document.querySelector("#history");
const userIDElement2 = document.querySelector("#results");
let userID = userIDElement2.getAttribute("dataId");
let url = `/${userID}/memeSubmission`
const itemsPerPage = 10; // Change this number according to your requirements
let currentPage = 1;

historyContainer.addEventListener('click', async (e) => {
    e.preventDefault();

    let results = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken2
        }
    });
    const data2 = await results.json();
    if (!results.ok) {
        throw new Error(`HTTP error! Status: ${results.status}`);
    }

    // Function to render items for the current page
    function renderPage(page) {
        // Clear the existing content in userIDElement
        userIDElement2.innerHTML = '';
        userIDElement2.classList.add('history-container');
        // Calculate the start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Loop through the data and create divs for each item
        for (let i = startIndex; i < endIndex && i < data2.length; i++) {
            const item = data2[i];
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('history-card');

            // Create a div for the heading of the card
            const historyHead = document.createElement('div');
            historyHead.classList.add('history-head');

            // Create a div for the caption
            const captionDiv = document.createElement('div');
            const caption = document.createElement('h2');
            caption.textContent = `${item.caption}`;
            caption.classList.add('caption');
            captionDiv.classList.add("caption-div");

            // Create a button to add to the posts
            const addPostButton = document.createElement('button');
            addPostButton.textContent = 'add';
            addPostButton.classList.add('add-post-btn', 'btn', 'btn-open');
            console.log("these are memesubmissions id", item.id)
            for (let postID of USER_POST_ID){
                console.log("these are post ids", postID)
                if (item.id === postID){
                    addPostButton.style.display = "none"
                }
            }

            // Create an image element for the meme_pic
            const imageElement = document.createElement('img');
            imageElement.src = item.round.meme_pic;
            imageElement.width = 300;
            imageElement.height = 180;
            imageElement.classList.add("jdImgCSS");

            // Create the modal
            const modalOverlay = document.createElement('div');
            modalOverlay.classList.add('hidden', 'overlay');
            const modalSection = document.createElement('section');
            modalSection.classList.add('hidden', 'post-modal');

            // Create the exit button
            const closeButtonContainer = document.createElement('div');
            closeButtonContainer.classList.add('close-btn-container');
            const closeButton = document.createElement('button');
            closeButton.classList.add('btn-close');
            closeButton.textContent = 'x';

            // Create the img for the post
            const addImgContainer = document.createElement('div');
            addImgContainer.classList.add('add-img-container');
            const addImg = document.createElement('img');
            addImg.src = item.round.meme_pic;
            addImg.classList.add('add-img');

            // Create a container for the caption
            const addCaptionDiv = document.createElement('div');
            const addCaption = document.createElement('h2');
            addCaption.textContent = `${item.caption}`;
            addCaption.classList.add('add-caption');
            addCaptionDiv.classList.add("add-caption-div");

            // Create an input for the description
            const descriptionInput = document.createElement('input');
            descriptionInput.setAttribute('type', 'text');
            descriptionInput.setAttribute('name', 'description');
            descriptionInput.id = 'description';

            // Create a button to submit the add form
            const submitAddButton = document.createElement('button');
            submitAddButton.setAttribute('type', 'submit');
            submitAddButton.classList.add('add-btn');
            submitAddButton.textContent = 'save';


            // Functions
            const openModal = function (event) {
                event.stopPropagation();
                modalSection.classList.remove("hidden");
                modalOverlay.classList.remove("hidden");
                const addForm = document.querySelector("#add-post-form");
                const memeId = document.querySelector("#meme-id");
                memeId.value = item.id;
                addForm.appendChild(descriptionInput);
                addForm.appendChild(submitAddButton);
                addCaptionDiv.appendChild(addForm);
                addForm.classList.remove("hidden");
            };
            const closeModal = function () {
                modalSection.classList.add("hidden");
                modalOverlay.classList.add("hidden");
            };

            addPostButton.addEventListener("click", function(event) {
                event.stopPropagation();
                openModal(event);
            });

            // const description = document.querySelector("#description");
            descriptionInput.addEventListener("click", function(event) {
                event.stopPropagation();
            });

            modalOverlay.addEventListener("click", closeModal);
            closeButton.addEventListener("click", closeModal);

            closeButtonContainer.appendChild(closeButton);
            modalSection.appendChild(closeButtonContainer);
            addImgContainer.appendChild(addImg);
            modalSection.appendChild(addImgContainer);
            addCaptionDiv.appendChild(addCaption);
            modalSection.appendChild(addCaptionDiv);
            modalOverlay.appendChild(modalSection)
            itemDiv.appendChild(historyHead);
            itemDiv.appendChild(imageElement);
            captionDiv.appendChild(caption);
            captionDiv.appendChild(addPostButton);
            captionDiv.appendChild(modalOverlay);
            itemDiv.appendChild(captionDiv);

            // Append the itemDiv to userIDElement
            userIDElement2.appendChild(itemDiv);
        }
    }

    // Render the current page
    renderPage(currentPage);
});
