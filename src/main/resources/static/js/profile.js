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
            const addPostButton = document.createElement('button');
            addPostButton.textContent = 'add';
            addPostButton.classList.add('add-post-btn');

            // Create an image element for the meme_pic
            const imageElement = document.createElement('img');
            imageElement.src = item.round.meme_pic;
            imageElement.width = 300;
            imageElement.height = 200;
            imageElement.classList.add("jdImgCSS");


            // Append the caption and image to the itemDiv
            itemDiv.appendChild(historyHead);
            itemDiv.appendChild(imageElement);
            captionDiv.appendChild(caption);
            captionDiv.appendChild(addPostButton);
            itemDiv.appendChild(captionDiv);

            // Append the itemDiv to userIDElement
            userIDElement.appendChild(itemDiv);
        }
    }

    // Function to handle "Next" button click
    function nextPage() {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            renderPage(currentPage);
        }
    }

    // Function to handle "Previous" button click
    function previousPage() {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }


    // Render the current page
    renderPage(currentPage);
});
// Create "Previous" and "Next" buttons
const previousButton = document.createElement('button');
previousButton.textContent = 'Previous';
previousButton.addEventListener('click', previousPage);

const nextButton = document.createElement('button');
nextButton.textContent = 'Next';
nextButton.addEventListener('click', nextPage);

// Append the buttons to userIDElement
userIDElement.appendChild(previousButton);
userIDElement.appendChild(nextButton);
