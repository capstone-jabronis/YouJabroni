const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const historyContainer = document.querySelector("#history");
const userIDElement = document.querySelector("#results");
let userID = userIDElement.getAttribute("dataId");
console.log(userID);
let url = `/${userID}/memeSubmission`
const itemsPerPage = 10; // Change this number according to your requirements
let currentPage = 1;

historyContainer.addEventListener('click', async (e) => {
    e.preventDefault();

    let results = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    });
    const data = await results.json();
    if (!results.ok) {
        throw new Error(`HTTP error! Status: ${results.status}`);
    }


    // Function to render items for the current page
    function renderPage(page) {
        // Clear the existing content in userIDElement
        userIDElement.innerHTML = '';
        userIDElement.classList.add('history-container');
        // Calculate the start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Loop through the data and create divs for each item
        for (let i = startIndex; i < endIndex && i < data.length; i++) {
            const item = data[i];
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
            const modalOverlay = document.createElement('div');
            modalOverlay.classList.add('hidden', 'overlay');
            const addPostButton = document.createElement('button');
            addPostButton.textContent = 'add';
            addPostButton.classList.add('add-post-btn', 'btn', 'btn-open');

            // Create an image element for the meme_pic
            const imageElement = document.createElement('img');
            imageElement.src = item.round.meme_pic;
            imageElement.width = 300;
            imageElement.height = 200;
            imageElement.classList.add("jdImgCSS");

            // addPostButton.addEventListener('click', addModal());


            // Append the caption and image to the itemDiv
            itemDiv.appendChild(historyHead);
            itemDiv.appendChild(imageElement);
            captionDiv.appendChild(caption);
            captionDiv.appendChild(addPostButton);
            captionDiv.appendChild(addModal());
            captionDiv.appendChild(modalOverlay);
            itemDiv.appendChild(captionDiv);

            // Append the itemDiv to userIDElement
            userIDElement.appendChild(itemDiv);
        }
    }

    // Render the current page
    renderPage(currentPage);
});

const postModal = document.querySelector(".post-modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

function addModal() {
    const modalSection = document.createElement('section');
    modalSection.classList.add('hidden', 'post-modal');
    // Create the exit button
    const closeButtonContainer = document.createElement('div');
    closeButtonContainer.classList.add('flex');
    const closeButton = document.createElement('button');
    closeButton.classList.add('btn-close');
    closeButton.textContent = 'x';

    // Create the form
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    const form = document.createElement('form');
    form.setAttribute("th:method", "post");
    form.setAttribute("th:action", "@{|/" + userID + "/profile/posts|}");

    // Create the input for description
    const description = document.createElement('input');
    description.setAttribute('type', 'text');
    description.setAttribute('name', 'description');

    // Create a submit button
    const submit = document.createElement('button');
    submit.classList.add('post-btn');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', 'submit');


    closeButtonContainer.appendChild(closeButton);
    form.appendChild(description);
    form.appendChild(submit);
    formContainer.appendChild(form);
    modalSection.appendChild(closeButtonContainer);
    modalSection.appendChild(formContainer);

    return modalSection;
}

// function to open the modal
const openModal = function () {
    postModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

openModalBtn.addEventListener("click", openModal);

// function to close the modal
const closeModal = function () {
    postModal.classList.add("hidden");
    overlay.classList.add("hidden");
};

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

