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
            let memes = await results.json();
            const memesContainer = document.createElement('div');
            memesContainer.classList.add('jdMemesContainer');

            const itemsPerPage = 18;
            let currentPage = 1;

            function renderPage(page) {
                memesContainer.innerHTML = '';
                for (let i = (page - 1) * itemsPerPage; i < page * itemsPerPage && i < memes.length; i++) {
                    const meme = memes[i];
                    const memeContainer = document.createElement('div');
                    memeContainer.classList.add('jdMemeContainer');
                    const memeImage = document.createElement('img');
                    memeImage.classList.add('jdMemeImage');
                    memeImage.src = meme.round.meme_pic;
                    memeImage.width = 250;
                    memeImage.height = 250;
                    memeContainer.appendChild(memeImage);

                    const caption = document.createElement('p');
                    caption.classList.add('jdMemeCaption');
                    caption.innerText = meme.caption;
                    memeContainer.appendChild(caption);

                    memesContainer.appendChild(memeContainer);
                }
            }

            renderPage(currentPage);
            resultsPage.appendChild(memesContainer);

            let forwardBTN = document.querySelector("#forward");
            let backBTN = document.querySelector("#back");

            forwardBTN.addEventListener("click", () => {
                if (currentPage < Math.ceil(memes.length / itemsPerPage)) {
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
