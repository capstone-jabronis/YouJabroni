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
        const data = await results.json();
        console.log(data);

        const itemsPerPage = 5;
        let currentPage = 1;
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        function renderPage(page) {
            resultsPage.innerHTML = ''; // Clear existing content
            for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage && i < totalItems; i++) {
                const user = data[i];
                for (let meme of user.memeSubmissions) {
                    const itemDiv = document.createElement('div');
                    const imageElement = document.createElement('img');
                    imageElement.src = meme.round.meme_pic;
                    imageElement.width = 300; // Replace with your desired width
                    imageElement.height = 300;
                    const captionDiv = document.createElement('div');
                    captionDiv.textContent = `Caption: ${meme.caption}`;
                    captionDiv.classList.add("jdH1CSS");
                    const usernameDiv = document.createElement('div');
                    usernameDiv.textContent = `Username: ${user.username}`;
                    usernameDiv.classList.add("jdH1CSS");
                    const profilePicElement = document.createElement('img');
                    profilePicElement.classList.add("jdImgCSS");
                    profilePicElement.src = user.profileURL;
                    profilePicElement.width = 50;
                    profilePicElement.height = 50;

                    if (profilePicElement.src.includes("null")) {
                        profilePicElement.src = "/img/memespace.gif";
                    }

                    itemDiv.appendChild(imageElement);
                    itemDiv.appendChild(captionDiv);
                    itemDiv.appendChild(usernameDiv);
                    itemDiv.appendChild(profilePicElement);
                    resultsPage.appendChild(itemDiv);
                }
            }
        }

        // Initial rendering
        renderPage(currentPage);

        function generatePaginationLinks() {
            const paginationDiv = document.createElement('div');

            if (currentPage > 1) {
                const previousButton = document.createElement('button');
                previousButton.textContent = 'Previous';

                previousButton.addEventListener('click', () => {
                    // Go back to the previous page
                    if (currentPage > 1) {
                        currentPage--;
                        renderPage(currentPage);
                    }
                });

                paginationDiv.appendChild(previousButton);
            }

            for (let i = 1; i <= totalPages; i++) {
                const pageNumberButton = document.createElement('button');
                pageNumberButton.textContent = i;

                pageNumberButton.addEventListener('click', () => {
                    // Update the current page when a page number is clicked
                    currentPage = i;
                    // Re-render the page based on the new current page
                    renderPage(currentPage);
                });

                paginationDiv.appendChild(pageNumberButton);
            }

            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';

                nextButton.addEventListener('click', () => {
                    // Go to the next page
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderPage(currentPage);
                    }
                });

                paginationDiv.appendChild(nextButton);
            }

            return paginationDiv;
        }

        const paginationLinks = generatePaginationLinks();
        resultsPage.appendChild(paginationLinks);
    } catch (error) {
        console.log("error retrieving data for feed", error);
    }
})();
