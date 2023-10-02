const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const historyContainer = document.querySelector("#History");
const userIDElement = document.querySelector("#results");
let userID = userIDElement.getAttribute("dataId");
let url = `/${userID}/memeSubmission`;
let currentPage = 1;
const itemsPerPage = 5;
let data = []; // Store the fetched data

historyContainer.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(csrfToken);

    // Fetch the data only if it hasn't been fetched before
    if (data.length === 0) {
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
        data = await results.json();
    }

    // Function to render items for the current page
    function renderPage(page) {
        // Clear the existing content in userIDElement
        userIDElement.innerHTML = '';

        // Calculate the start and end indices for the current page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Loop through the data and create divs for each item
        for (let i = startIndex; i < endIndex && i < data.length; i++) {
            const item = data[i];
            const itemDiv = document.createElement('div');

            // Create a div for the caption
            const captionDiv = document.createElement('div');
            captionDiv.textContent = `Caption: ${item.caption}`;
            captionDiv.classList.add("jdH1CSS");

            // Create an image element for the meme_pic
            const imageElement = document.createElement('img');
            imageElement.src = item.round.meme_pic;
            imageElement.width = 300;
            imageElement.height = 300;
            imageElement.classList.add("jdImgCSS");


            // Append the caption and image to the itemDiv
            itemDiv.appendChild(captionDiv);
            itemDiv.appendChild(imageElement);

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

    // Render the current page
    renderPage(currentPage);
});
