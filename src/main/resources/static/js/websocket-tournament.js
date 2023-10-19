(() => {
        //GLOBAL VARIABLES////////////////////////////////
        //area to display users entering and leaving the room
        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

        const UserWaitingRoom = document.querySelector('#users-in-room');
        // const leaveBtn = document.querySelector('#leave-lobby-btn');
        const lobbyContainer = document.querySelector('.jdWaitContainer');
        const lobbyReset = lobbyContainer.innerHTML;
        const startBtn = document.querySelector('#start-btn');
        const leaveBtn = document.querySelector('#leave-lobby-btn');
        const waitingTitle = document.querySelector('#waiting-title');
        // JOSES TRYING SOMETHING
        const startGameButton = document.createElement("button");
        startGameButton.textContent = "start game!";
        startGameButton.classList.add('start-game-btn');
        // const leaveLobbyButton = document.querySelector("#leave-lobby-btn");
        // leaveLobbyButton.after(startGameButton)
        startGameButton.style.display = "none";


        //MEME API VARIABLES//////////////////////////////////
        let memeApiURL = "https://api.imgflip.com/get_memes";
        //Object to control various game statuses to update the page accordingly
        let gameController = {
            submittedMemes: 0,
            currentMemeSubmissions: [],
            currentRoundPlayers: [],
            playersToSkip: [],
            votingPlayers: [],
            activePlayers: [],
            eliminatedPlayers: [],
            winner: "",
            meme1votes: 0,
            meme2votes: 0,
            round: 1,
            tieBreaker1: 0,
            tieBreaker2: 0,
            snakeGame() {
                const snakeGameContainer = document.querySelector("#snakeGameWaiting");
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

            }
        }


        const Tournament = {
            csrfToken: document.querySelector('meta[name="_csrf"]').getAttribute('content'),
            stompClient: null,
            tournamentId: tournamentId,
            topic: null,
            currentSubscription: null,
            memeSubmission: document.querySelector('#memeCaption'),
            usersInRoom: document.querySelectorAll('.user-info'),
            initialize() {
                Events.initialize();
            }
        }

        const Socket = {
            connect() {
                const header = {'X-CSRF-TOKEN': Tournament.csrfToken};
                let socket = new SockJS("/secured/memespace-sock");
                Tournament.stompClient = Stomp.over(socket);
                Tournament.stompClient.connect(header, this.onConnected, this.onError)
            },
            onConnected() {
                Socket.enterRoom(Tournament.tournamentId);
            },
            onError(error) {
                console.log("Error connecting to stream. Error:");
                console.log(error);
            },
            enterRoom(tournamentId) {
                Tournament.topic = `/secured/app/tournament/lobby/${Tournament.tournamentId}`;
                Tournament.currentSubscription = Tournament.stompClient.subscribe(`/secured/tournament/lobby/${Tournament.tournamentId}`, this.onMessageReceived);
                let message = {
                    user: currentUser.username,
                    text: "User Joined Tournament!",
                    memeURL: '',
                    messageType: 'JOIN'
                }
                Tournament.stompClient.send(`${Tournament.topic}/userjoin`, {}, JSON.stringify(message));
            },
            sendMessage(message) {
                Tournament.topic = `/secured/app/tournament/lobby/${Tournament.tournamentId}`;

                if (Tournament.stompClient) {
                    if (message.messageType === 'DATA') {
                        Tournament.stompClient.send(`${Tournament.topic}/meme`, {}, JSON.stringify(message));
                    } else if (message.messageType === 'FINISH') {
                        Tournament.stompClient.send(`${Tournament.topic}/finish`, {}, JSON.stringify(message));
                    } else if (message.messageType === 'LEAVE') {
                        Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(message));
                        window.location.replace("/tournament/lobby/leave");
                    } else {
                        Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(message));
                    }
                }
            },
            async onMessageReceived(payload) {
                let message = JSON.parse(payload.body);
                if (message.messageType === 'JOIN') {
                    console.log('-----JOIN MESSAGE------')
                    await Render.reloadTournamentMembers('');
                    let players = await Fetch.Get.playerCount();
                } else if (message.messageType === 'LEAVE') {
                    console.log('------LEAVE MESSAGE------')
                    console.log(gameController);
                    await Render.reloadTournamentMembers(message.user);
                } else if (message.messageType === 'START') {
                    //Get userSet of Tournament from server
                    console.log('------START MESSAGE-------')
                    console.log(gameController);
                    gameController.activePlayers = await Fetch.Get.tournamentMembers();

                    gameController.activePlayers.sort(function (a, b) {
                        return (a.id - b.id);
                    });
                    //check if a winner has been decided
                    if (gameController.activePlayers.length - gameController.eliminatedPlayers.length === 1) {
                        for (let i = 0; i < gameController.activePlayers.length; i++) {
                            if (!gameController.eliminatedPlayers.includes(gameController.activePlayers[i].username)) {
                                gameController.winner = gameController.activePlayers[i].username;
                            }
                        }
                        await Render.renderCompletePage();
                    } else {
                        //Empty the current round player array before pushing the next players
                        gameController.playersToSkip = gameController.currentRoundPlayers;
                        gameController.currentRoundPlayers = [];

                        let indexTracker = 0
                        let eliminated = gameController.eliminatedPlayers;
                        let active = gameController.activePlayers;
                        let skipPlayers = gameController.playersToSkip;

                        //Round advancement scalability to support more players, works for 4 players, need to test for more (multiples of 4)
                        if ((gameController.activePlayers.length / gameController.round) / gameController.eliminatedPlayers.length === 2) {
                            gameController.playersToSkip = [];
                            skipPlayers = [];
                            gameController.round++;
                        }

                        while (gameController.currentRoundPlayers.length < 2) {
                            if (eliminated.includes(active[indexTracker].username) || skipPlayers[0] === active[indexTracker].username || skipPlayers[1] === active[indexTracker].username) {
                                indexTracker++;
                            } else {
                                gameController.currentRoundPlayers.push(gameController.activePlayers[indexTracker].username)
                                indexTracker++;
                            }
                        }
                        indexTracker = 0;
                        // gameController.playersToSkip = [];

                        //adds remaining players to votingPlayers
                        gameController.votingPlayers = [];

                        //Loop to add the remaining players to the voting group
                        let n = 0;
                        for (let i = 0; i < gameController.activePlayers.length; i++) {
                            if (gameController.currentRoundPlayers[n] === gameController.activePlayers[i].username) {
                                n++;
                            } else {
                                gameController.votingPlayers.push(gameController.activePlayers[i]);
                            }
                        }

                        if (gameController.currentRoundPlayers.includes(currentUser.username)) {
                            await Render.renderTournamentPage();
                        } else if (!gameController.currentRoundPlayers.includes(currentUser.username)) {
                            Render.renderWaitingPage();
                        }
                    }

                } else if (message.messageType === 'DATA') {
                    console.log('-----DATA MEME MESSAGE-----')
                    console.log(gameController);
                    gameController.submittedMemes += 1;
                    console.log(gameController.submittedMemes)
                    if (gameController.submittedMemes === 2) {
                        gameController.submittedMemes = 0;
                        let user1 = gameController.currentRoundPlayers[0];
                        let user2 = gameController.currentRoundPlayers[1];
                        Render.renderVotePage(user1, user2);
                    }
                } else if (message.messageType === 'VOTE' || message.messageType === 'TIE') {
                    console.log('-----VOTE MESSAGE-----')
                    console.log(gameController);
                    let host = await Fetch.Get.tournamentHost();
                    if (message.text === "1") {
                        gameController.meme1votes += 1;
                    } else if (message.text === "2") {
                        gameController.meme2votes += 1;
                    } else if (message.text === "3"){
                        gameController.tieBreaker1 = 1;
                    } else if (message.text === "4"){
                        gameController.tieBreaker2 = 1;
                    }
                    //check if all users voted
                    if ((gameController.meme1votes + gameController.meme2votes) === gameController.votingPlayers.length) {
                        if ((gameController.meme1votes + gameController.tieBreaker1) === (gameController.meme2votes + gameController.tieBreaker2)) {
                            if (host.username === currentUser.username) {
                               await Render.tieBreaker();
                            }
                        }
                        //Render results page
                        await Render.renderResultsPage();
                    }
                } else if (message.messageType === 'RESULT') {
                    console.log('-------RESULT MESSAGE-----')
                    console.log(gameController);
                    //Winner check
                    if (gameController.activePlayers.length - gameController.eliminatedPlayers.length === 1) {
                        for (let i = 0; i < gameController.activePlayers.length; i++) {
                            if (!gameController.eliminatedPlayers.includes(gameController.activePlayers[i].username)) {
                                gameController.winner = gameController.activePlayers[i].username;
                            }
                        }
                        await Render.renderCompletePage();
                    } else {
                        gameController.meme1votes = 0;
                        gameController.meme2votes = 0;
                        gameController.tieBreaker1 = 0;
                        gameController.tieBreaker2 = 0;
                        gameController.eliminatedPlayers.push(message.text);
                        await Render.renderNextPage();
                    }
                } else if (message.messageType === 'FINISH') {
                    location.replace('/home');
                } else {
                    if (gameController.currentMemeSubmissions.length === 2) {
                        gameController.currentMemeSubmissions = [];
                    }
                    gameController.currentMemeSubmissions.push(message);
                }
            }
        }

        const Events = {
            async initialize() {
                //waits for socket to connect before moving on
                await Socket.connect();

            }
        }

        const Render = {
            async reloadTournamentMembers(userToRemove) {
                let tournamentMembers = await Fetch.Get.tournamentMembers();
                let tournamentHost = await Fetch.Get.tournamentHost();

                tournamentMembers.sort(function (a, b) {
                    return (a.id - b.id);
                });
                //JOSES TRYING SOMETHING

                UserWaitingRoom.innerHTML = "";
                for (let i = 0; i < tournamentMembers.length; i++) {
                    let playerContainer = document.createElement('div');
                    playerContainer.classList.add('player-container');

                    let playerInfo = document.createElement('div');
                    playerInfo.classList.add('player-info');

                    let playerProfilePic = document.createElement('img');
                    playerProfilePic.classList.add('player-profile-pic');
                    playerProfilePic.src = '';
                    playerProfilePic.alt = 'user profile picture';

                    let playerUsername = document.createElement('p');
                    playerUsername.classList.add('player-username');
                    playerUsername.textContent = tournamentMembers[i].username;
                    if (tournamentMembers[i].profileURL === null) {
                        playerProfilePic.src = '/img/memespace.gif';
                    } else if (tournamentMembers[i].profileURL === "") {
                        playerProfilePic.src = '/img/memespace.gif';
                    } else {
                        playerProfilePic.src = tournamentMembers[i].profileURL;
                    }

                    playerInfo.appendChild(playerProfilePic);
                    playerInfo.appendChild(playerUsername);
                    playerContainer.appendChild(playerInfo);

                    if (tournamentMembers[i].username === tournamentHost.username) {
                        playerContainer.innerHTML += `<p class="role">HOST</p>`;
                    }

                    UserWaitingRoom.appendChild(playerContainer);
                }
                //to render start button when members reach required amount for game
                let playerCount = await Fetch.Get.playerCount();
                if (tournamentMembers.length !== playerCount) {
                    // startGameButton.style.display = "none";
                    waitingTitle.classList.remove('hidden');
                    startBtn.style.visibility = "hidden";
                } else if (tournamentMembers.length === playerCount && currentUser.username === tournamentHost.username) {
                    // startGameButton.style.display = "block";
                    waitingTitle.classList.add('hidden');
                    startBtn.style.visibility = "visible";
                }
            },

            async renderTournamentPage() {
                startBtn.style.visibility = "hidden";
                lobbyContainer.innerHTML = `
    <div class="container full-width">
        <div class="row vs-title">
            <h1 class="create-meme-title">Create your Meme Submission</h1>
            <h2 class="vs-usernames">${gameController.currentRoundPlayers[0]}  VS  ${gameController.currentRoundPlayers[1]}</h2>
        </div>
        <div class="row memePicture justify-center">
            <img class="memeAPIImage" src="" alt="WRITE SOMETHING FUNNY JABRONI">
        </div>
        <div class="row meme-input">
            <div class="column align-center">
                <input class="input-field input" type="text" id="memeCaption" placeholder="Enter a short caption">
                <button class="submit-meme-btn" id="submitMemeCaptionBtn" type="submit">submit caption</button>
            </div>
        </div>
    </div>
`;

                //Calls function to get random meme
                await Fetch.Get.getMeme();
                let submitMemeBtn = document.querySelector('#submitMemeCaptionBtn');

                //Events for submitting memes
                submitMemeBtn.addEventListener('click', () => {
                    let memeCaption = document.querySelector('#memeCaption').value
                    let memeUrl = document.querySelector('.memeAPIImage').getAttribute("src")
                    let message = {
                        user: currentUser.username,
                        text: memeCaption,
                        memeURL: memeUrl,
                        messageType: 'DATA'
                    };
                    Socket.sendMessage(message);
                    submitMemeBtn.disabled = true;
                    submitMemeBtn.innerHTML = 'caption submitted!';
                    submitMemeBtn.classList.add('btn-hover');
                })
            },

            renderVotePage(user1, user2) {
                lobbyContainer.innerHTML = `
             <div class="container voting-container">
                <div class="row justify-space-between align-center full-width voting-row">
                    <h1 class="middle-element">Vote for the Best Meme</h1>
                    <h3 class="right-element" id="vote-status"></h3>
                </div>
                <div class="row justify-space-between">
                    <div class="column vote-first-meme align-center">
                        <img class="memeAPIImage" src="${gameController.currentMemeSubmissions[0].memeURL}" alt="ERROR LOADING IMAGE">
                        <h2>${gameController.currentMemeSubmissions[0].caption}</h2>
                        <button class="vote-button" id="vote-meme1">vote</button>
                        <div id="meme1-votes"></div>
                    </div>
                    
                    <div class="column vote-second-meme align-center">
                        <img class="memeAPIImage" src="${gameController.currentMemeSubmissions[1].memeURL}" alt="ERROR LOADING IMAGE">
                        <h2>${gameController.currentMemeSubmissions[1].caption}</h2>
                        <button class="vote-button" id="vote-meme2">vote</button>
                        <div id="meme1-votes"></div>
                    <div>
                </div>
             </div>
            `;

                let voteMeme1btn = document.querySelector('#vote-meme1');
                let voteMeme2btn = document.querySelector('#vote-meme2');
                let meme1votes = document.querySelector('#meme1-votes');
                let meme2votes = document.querySelector('#meme2-votes');
                let voteStatusH3 = document.querySelector('#vote-status');

                voteStatusH3.innerHTML = "VOTING IN PROGRESS";
                voteMeme1btn.style.visibility = "hidden";
                voteMeme2btn.style.visibility = "hidden";
                voteMeme1btn.disabled = true;
                voteMeme2btn.disabled = true;

                voteMeme1btn.addEventListener('click', () => {
                    // gameController.meme1votes += 1;
                    voteMeme1btn.style.visibility = "hidden";
                    voteMeme2btn.style.visibility = "hidden";
                    voteMeme1btn.disabled = true;
                    // meme1votes.innerHTML = gameController.meme1votes;
                    let message = {
                        user: currentUser.username,
                        text: '1',
                        memeURL: '',
                        messageType: 'VOTE'
                    };
                    Socket.sendMessage(message);
                })

                voteMeme2btn.addEventListener('click', () => {
                    // gameController.meme2votes += 1;
                    voteMeme1btn.style.visibility = "hidden";
                    voteMeme2btn.style.visibility = "hidden";
                    voteMeme2btn.disabled = true;
                    // meme2votes.innerHTML = gameController.meme2votes;
                    let message = {
                        user: currentUser.username,
                        text: '2',
                        memeURL: '',
                        messageType: 'VOTE'
                    };
                    Socket.sendMessage(message);
                })

                console.log(gameController.votingPlayers);
                let voterNameArr = [];

                for (let i = 0; i < gameController.votingPlayers.length; i++) {
                    voterNameArr.push(gameController.votingPlayers[i].username);
                }
                if (voterNameArr.includes(currentUser.username)) {
                    console.log("VOTER")
                    voteStatusH3.innerHTML = "PLACE YOUR VOTES";
                    voteMeme1btn.style.visibility = "visible";
                    voteMeme2btn.style.visibility = "visible";
                    voteMeme1btn.disabled = false;
                    voteMeme2btn.disabled = false;
                }
            },

        renderWaitingPage() {
            lobbyContainer.innerHTML = `
                <h1>Waiting for Meme Submissions...</h1>
                <h2>In the memetime sit back, relax, and wait for both users to submit</h2>
                <img class="jdCatGifImgCSS" src="/img/catOnLaptop.gif">

                                        `;
                gameController.snakeGame();
            }
            ,

            async renderResultsPage() {
                let host = await Fetch.Get.tournamentHost();
                lobbyContainer.innerHTML = `
           <div class="container results-container">
                <div class="row justify-center align-center results-title-row">
                    <h1>Results</h1> 
                    <h2 class="left-element">${gameController.currentRoundPlayers[0]} VS ${gameController.currentRoundPlayers[1]}</h2>
                </div>
                <div class="row">
                    <div class="column align-center result-first-meme">
                         <h3 id="player1-result"></h3>
                         <h3 id="meme1-votes">${gameController.meme1votes}</h3>
                         <img class="memeAPIImage" src="${gameController.currentMemeSubmissions[0].memeURL}" alt="${gameController.currentMemeSubmissions[0].caption}">
                         <h2>${gameController.currentMemeSubmissions[0].caption}</h2>
                    </div>
                    <div class="column align-center result-second-meme">
                         <h3 id="player2-result"></h3>
                         <h3 id="meme2-votes">${gameController.meme2votes}</h3>
                         <img class="memeAPIImage" src="${gameController.currentMemeSubmissions[1].memeURL}" alt="${gameController.currentMemeSubmissions[1].caption}">
                         <h2>${gameController.currentMemeSubmissions[1].caption}</h2>
                    </div>
                </div>
                <button id="submit-results-btn">continue</button>
           </div>`;

                let nextRoundBtn = document.querySelector('#submit-results-btn');
                if (host.username !== currentUser.username) {
                    nextRoundBtn.disabled = true;
                    nextRoundBtn.style.visibility = 'hidden';
                }

                //DECIDE WINNER AND ELIMINATE LOSER
                function renderWinnerPlayer1() {
                    loser = gameController.currentRoundPlayers[1];
                    document.querySelector('#player1-result').innerHTML = 'WINNER';
                    document.querySelector('#player2-result').innerHTML = 'LOSER';
                }

                function renderWinnerPlayer2() {
                    loser = gameController.currentRoundPlayers[0];
                    document.querySelector('#player1-result').innerHTML = 'LOSER';
                    document.querySelector('#player2-result').innerHTML = 'WINNER';
                }

                function renderWinnerPlayer1Tie() {
                    loser = gameController.currentRoundPlayers[1];
                    document.querySelector('#player1-result').innerHTML = '*WINNER BY COIN FLIP*';
                    document.querySelector('#meme1-votes').innerHTML += ' (+1)';
                }

                function renderWinnerPlayer2Tie() {
                    loser = gameController.currentRoundPlayers[0];
                    document.querySelector('#player2-result').innerHTML = '*WINNER BY COIN FLIP*';
                    document.querySelector('#meme2-votes').innerHTML += ' (+1)';
                }

                let loser;
                if (gameController.meme1votes > gameController.meme2votes) {
                    renderWinnerPlayer1()
                } else if (gameController.meme1votes < gameController.meme2votes) {
                    renderWinnerPlayer2()
                } else if (gameController.meme1votes === gameController.meme2votes) {
                    if (gameController.tieBreaker1 === 1) {
                        renderWinnerPlayer1Tie()
                    } else if (gameController.tieBreaker2 === 1) {
                        renderWinnerPlayer2Tie()
                    }
                }

                if (gameController.meme1votes === 1 || gameController.meme2votes === 1) {
                    document.querySelector('#meme1-votes').innerHTML += ' vote';
                    document.querySelector('#meme2-votes').innerHTML += ' vote';
                } else {
                    document.querySelector('#meme1-votes').innerHTML += ' votes';
                    document.querySelector('#meme2-votes').innerHTML += ' votes';
                }

                const player1Result = lobbyContainer.querySelector('#player1-result');
                const player2Result = lobbyContainer.querySelector('#player2-result');

                if (player1Result.innerText === 'WINNER' || player1Result.innerText === '*WINNER BY COIN FLIP*') {
                    const meme1Image = lobbyContainer.querySelector('.result-first-meme .memeAPIImage');
                    meme1Image.style.border = '1rem solid #9F8BFF';
                    meme1Image.style.borderRadius = '16px';
                }

                if (player2Result.innerText === 'WINNER' || player2Result.innerText === '*WINNER BY COIN FLIP*') {
                    const meme2Image = lobbyContainer.querySelector('.result-second-meme .memeAPIImage');
                    meme2Image.style.border = '1rem solid #9F8BFF';
                    meme2Image.style.borderRadius = '16px';
                }

                nextRoundBtn.addEventListener('click', () => {
                    let message = {
                        user: currentUser.username,
                        text: loser,
                        memeURL: '',
                        messageType: 'RESULT'
                    }
                    Socket.sendMessage(message);
                })
            }
            ,

            async renderCompletePage() {
                let host = await Fetch.Get.tournamentHost();
                if (gameController.eliminatedPlayers.includes(currentUser.username)) {
                    lobbyContainer.style.backgroundColor = '#0D0149';
                    lobbyContainer.innerHTML = `<img src="/img/lose.gif">
                <button id="complete-btn">finish</button>`
                } else {
                    lobbyContainer.style.backgroundColor = '#0D0149';
                    lobbyContainer.innerHTML = `<img src="/img/win.gif">
                <button id="complete-btn">finish</button>`
                    winner = currentUser.username;
                }

                let completeBtn = document.querySelector('#complete-btn');
                if (host.username !== currentUser.username) {
                    completeBtn.disabled = true;
                    completeBtn.style.visibility = 'hidden';
                }

                completeBtn.addEventListener('click', () => {
                    let message = {
                        user: gameController.winner,
                        text: "",
                        memeURL: '',
                        messageType: 'FINISH'
                    }
                    Socket.sendMessage(message);
                })
            }
            ,

            async renderNextPage() {
                let host = await Fetch.Get.tournamentHost();

                //AUTOMATIC
                if (host.username === currentUser.username) {
                    (function () {
                        let nextMessage = {
                            user: host.username,
                            text: "",
                            memeURL: '',
                            messageType: 'START'
                        }
                        Socket.sendMessage(nextMessage);
                    })();
                }
            },
            async tieBreaker() {
                let host = await Fetch.Get.tournamentHost();

                //AUTOMATIC
                if (host.username === currentUser.username) {
                    (function () {
                        let nextMessage = {
                            user: host.username,
                            text: "",
                            memeURL: '',
                            messageType: 'TIE'
                        }
                        Socket.sendMessage(nextMessage);
                    })();
                }
            }
        }

        const Fetch = {
            Get: {
                // gets array of all users who are currently in the tournament userSet
                async tournamentMembers() {
                    let members = await fetch(`/tournament/${Tournament.tournamentId}/members`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    });
                    if (!members.ok) {
                        throw new Error(`Error retrieving User Set for Tournament`);
                    }
                    return await members.json();
                },
                //Get current host of the tournament
                async tournamentHost() {
                    let host = await fetch(`/tournament/${Tournament.tournamentId}/host`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    });
                    if (!host.ok) {
                        throw new Error(`Error retrieving User Set for Tournament`);
                    }
                    return await host.json();
                },
                async playerCount() {
                    let players = await fetch(`/tournament/${Tournament.tournamentId}/players`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    });
                    if (!players.ok) {
                        throw new Error(`Error retrieving amount of players for tournament`);
                    }
                    return await players.json();
                },
                async getMeme() {
                    let imageContainers = document.querySelectorAll(".memeAPIImage");
                    try {
                        const response = await fetch(memeApiURL);
                        const data = await response.json();
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }

                        const memes = data.data.memes;
                        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
                        const imageUrl = randomMeme.url;
                        imageContainers.forEach((container) => {
                            container.src = imageUrl;
                        })
                        // imageContainer.src = imageUrl;
                    } catch (error) {
                        console.error('Error fetching meme:', error);
                    }
                },
                async getWinner() {
                    let winner = await fetch(`/tournament/${Tournament.tournamentId}/getWinner`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken
                        }
                    });
                    if (!winner.ok) {
                        throw new Error(`Error retrieving winner`);
                    }
                    return await winner.json();
                }

            }
        }

        //EVENT LISTENERS
//event to remove a user that left the page and reload the page for all other users
        window.onbeforeunload = (event) => {
            gameController.disconnectMessage = true;
            for (let i = 0; i < gameController.activePlayers.length; i++) {
                if (gameController.activePlayers[i].username === currentUser.username) {
                    gameController.activePlayers.splice(i, 1);
                }
            }
            let message = {
                user: currentUser.username,
                text: 'DISCONNECTED',
                memeURL: '',
                messageType: 'LEAVE'
            };
            Socket.sendMessage(message);
        };

        startBtn.addEventListener('click', async () => {
            let host = await Fetch.Get.tournamentHost();
            let message;
            if (currentUser.username === host.username) {
                message = {
                    user: currentUser.username,
                    text: 'GAME START',
                    memeURL: '',
                    messageType: 'START'
                };
            } else {
                console.log('Error: current user is not host');
                message = {
                    user: currentUser.username,
                    text: 'Host check failed, rendering page again',
                    memeURL: '',
                    messageType: 'JOIN'
                }
            }
            Socket.sendMessage(message);
        });
        leaveBtn.addEventListener('click', () => {
            location.replace('/home');
        })
        Tournament.initialize();

    }
)
();