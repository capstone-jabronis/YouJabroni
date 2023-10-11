const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
let URL = "https://api.imgflip.com/get_memes";
let imageContainer = document.querySelector(".memeAPIImage");

(async () =>{
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const memes = data.data.memes;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        const imageUrl = randomMeme.url;

        imageContainer.src= imageUrl;
    } catch (error) {
        console.error('Error fetching meme:', error);
    }
})();