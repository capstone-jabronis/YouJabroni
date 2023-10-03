const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const historyContainer = document.querySelector("#History");
let userIDElement = document.querySelector("#results");
let userID = userIDElement.getAttribute("dataId");
console.log(userID);
let url = `/${userID}/memeSubmission`

historyContainer.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log(csrfToken);
    let results = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        }
    });
    const data = await results.json();
    console.log(data);
    // Clear the existing content in userIDElement
    userIDElement.innerHTML = '';

    // Loop through the data and create divs for each item
    for (let item of data) {
        const itemDiv = document.createElement('div');

        // Create a div for the caption
        const captionDiv = document.createElement('div');
        captionDiv.textContent = `Caption: ${item.caption}`;

        // Create an image element for the meme_pic
        const imageElement = document.createElement('img');
        imageElement.src = item.round.meme_pic;

        // Append the caption and image to the itemDiv
        itemDiv.appendChild(captionDiv);
        itemDiv.appendChild(imageElement);

        // Append the itemDiv to userIDElement
        userIDElement.appendChild(itemDiv);
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
