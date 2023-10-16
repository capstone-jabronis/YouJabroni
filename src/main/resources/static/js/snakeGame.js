const snakeGameContainer = document.querySelector("#snakeGame");
snakeGameContainer.style.display = "none";
let colForSnake = document.querySelector(".jdWaitColCanvas")
let blockSize = 25;
let total_row = 30; // total row number
let total_col = 30; // total column number
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

// Set the total number of rows and columns
let speedX = 0; // speed of snake in x coordinate.
let speedY = 0; // speed of snake in Y coordinate.

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;

let foodColorHue = 0; // Initial hue value

let h2Element = document.createElement("h2");
h2Element.innerText = "While you wait play a snake game!";
colForSnake.appendChild(h2Element);

let gameButton = document.createElement('button');
gameButton.textContent = 'play snake';
gameButton.classList.add('snake-start-btn');
colForSnake.appendChild(gameButton)
gameButton.addEventListener("click", function () {
    snakeGameContainer.style.display = "block";
    h2Element.style.display = 'none';
    gameButton.style.display = 'none';
    startGame();
    snakeGame();
}, {once: true});

const snakeGame = () => {
    // Set board height and width
    snakeGameContainer.height = total_row * blockSize;
    snakeGameContainer.width = total_col * blockSize;
    context = snakeGameContainer.getContext("2d");

    // Create an Image object for the food image
    const foodImage = new Image();
    foodImage.src = "/img/memespace.gif"; // Replace with the correct path to your image

    foodImage.onload = function () {
        // Call your game loop here after the food image is loaded
        setInterval(update, 1000 / 10);
    };

    placeFood();
    document.addEventListener("keyup", changeDirection); // for movements
}

function update() {
    if (gameOver) {
        return;
    }

    // Background of a Game
    context.fillStyle = "#0D0149";
    context.fillRect(0, 0, snakeGameContainer.width, snakeGameContainer.height);

    // Update food color with a rainbow effect
    foodColorHue = (foodColorHue + 1) % 360; // Increment the hue value

    // Set food color using HSL color model
    context.fillStyle = `hsl(${foodColorHue}, 100%, 50%)`;
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    // body of snake will grow
    for (let i = snakeBody.length - 1; i > 0; i--) {
        // it will store the previous part of the snake to the current part
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "white";
    snakeX += speedX * blockSize; // updating Snake position in X coordinate.
    snakeY += speedY * blockSize; // updating Snake position in Y coordinate.
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    if (snakeX < 0
        || snakeX > total_col * blockSize
        || snakeY < 0
        || snakeY > total_row * blockSize) {

        // Out of bound condition
        gameOver = true;
        startGame(); // Restart the game
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {

            // Snake eats its own body
            gameOver = true;
            startGame(); // Restart the game
        }
    }
}

// Movement of the Snake - We are using addEventListener
window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }

    changeDirection(e); // Call your changeDirection function here
});

function changeDirection(e) {
    if (e.code === "ArrowUp" && speedY !== 1) {
        // If up arrow key pressed with this condition...
        // snake will not move in the opposite direction
        speedX = 0;
        speedY = -1;
    } else if (e.code === "ArrowDown" && speedY !== -1) {
        // If down arrow key pressed
        speedX = 0;
        speedY = 1;
    } else if (e.code === "ArrowLeft" && speedX !== 1) {
        // If left arrow key pressed
        speedX = -1;
        speedY = 0;
    } else if (e.code === "ArrowRight" && speedX !== -1) {
        // If Right arrow key pressed
        speedX = 1;
        speedY = 0;
    }
}

// Randomly place food
function placeFood() {
    // in x coordinates.
    foodX = Math.floor(Math.random() * total_col) * blockSize;

    // in y coordinates.
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

function startGame() {
    // Reset game variables and initialize the game state here
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    snakeBody = [];
    speedX = 0;
    speedY = 0;
    gameOver = false;
    placeFood();

    foodColorHue = 0;
}
