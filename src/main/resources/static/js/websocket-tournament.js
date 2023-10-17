// window.onload = async () => {
//   try{
//       const url = "/tournaments/api";
//
//
//       let results = await fetch(url, {
//           method: 'GET',
//           headers: {
//               'Content-Type': 'application/json',
//               'X-CSRF-TOKEN': csrfToken
//           }
//       });
//
//       if (!results.ok) {
//           throw new Error(`HTTP error! Status: ${results.status}`);
//       }
//
//       let data = await results.json();
//       console.log(data);
//
//   } catch(error){
//       console.error("Error retrieving tournament", error);
//   }
// }
// For WebSocket/Sock/StompJS Server Connection with frontend
// Trying to find path variable with tournament id instead of targeting the span.
// console.log((location.pathname+location.search).substring(3))

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
    startGameButton.textContent = "Start Game!";
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
        tieBreakerFunction() {
            //random method here to vote during a tie
            return Math.floor(Math.random());
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
            console.log('Connected to Socket! ' + Tournament.tournamentId);
            const header = {'X-CSRF-TOKEN': Tournament.csrfToken};
            let socket = new SockJS("/secured/memespace-sock");
            Tournament.stompClient = Stomp.over(socket);
            Tournament.stompClient.connect(header, this.onConnected, this.onError)
        },
        onConnected() {
            console.log("inside onConnected");
            Socket.enterRoom(Tournament.tournamentId);
        },
        onError(error) {
            console.log("Error connecting to stream. Error:");
            console.log(error);
        },
        enterRoom(tournamentId) {
            console.log("Inside enterRoom");
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
            console.log("Inside sendMessage");
            console.log(message);
            Tournament.topic = `/secured/app/tournament/lobby/${Tournament.tournamentId}`;

            if (Tournament.stompClient) {
                if (message.messageType === 'DATA') {
                    Tournament.stompClient.send(`${Tournament.topic}/meme`, {}, JSON.stringify(message));
                } else if (message.messageType === 'FINISH') {
                    Tournament.stompClient.send(`${Tournament.topic}/finish`, {}, JSON.stringify(message));
                } else if (message.messageType === 'LEAVE') {
                    Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(message));
                    console.log('REDIRECT');
                    window.location.replace("/tournament/lobby/leave");
                } else {
                    Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(message));
                }
            }

            // if (memeContent && Tournament.stompClient) {
            //     let memeSub = {
            //         text: memeContent,
            //         messageType: 'CHAT'
            //     };
            //     console.log(memeSub);
            //     Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(memeSub));
            // }
            // Tournament.memeSubmission.val("");
            // Tournament.usersInRoom = "";
        },
        async onMessageReceived(payload) {
            console.log("Inside onMessageReceived!");
            let message = JSON.parse(payload.body);
            console.log("Message received:");
            if (message.messageType === 'JOIN') {
                await Render.reloadTournamentMembers('');
                let players = await Fetch.Get.playerCount();
                console.log(players);
            } else if (message.messageType === 'LEAVE') {
                    await Render.reloadTournamentMembers(message.user);
            } else if (message.messageType === 'START') {
                //Get userSet of Tournament from server
                gameController.activePlayers = await Fetch.Get.tournamentMembers();

                gameController.activePlayers.sort(function (a, b) {
                    return (a.id - b.id);
                });
                //check if a winner has been decided
                if (gameController.activePlayers.length - gameController.eliminatedPlayers.length === 1) {
                    for (let i = 0; i < gameController.activePlayers.length; i++) {
                        if (!gameController.eliminatedPlayers.includes(gameController.activePlayers[i].username)) {
                            console.log("WINNER!: " + gameController.activePlayers[i].username)
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
                        console.log("NEXT ROUND ---- CLEARING skipPlayers");
                        gameController.playersToSkip = [];
                        skipPlayers = [];
                        gameController.round++;
                    }

                    while (gameController.currentRoundPlayers.length < 2) {
                        if (eliminated.includes(active[indexTracker].username) || skipPlayers[0] === active[indexTracker].username || skipPlayers[1] === active[indexTracker].username) {
                            console.log(`skipping ${gameController.activePlayers[indexTracker].username}, index Tracker at ${indexTracker}`);
                            indexTracker++;
                        } else {
                            gameController.currentRoundPlayers.push(gameController.activePlayers[indexTracker].username)
                            console.log(`added ${gameController.activePlayers[indexTracker].username}, index Tracker at ${indexTracker}`);
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
                console.log('meme submitted!');
                console.log(message);
                // gameController.currentRoundPlayers.push(message.user);
                gameController.submittedMemes += 1;
                if (gameController.submittedMemes === 2) {
                    console.log("Both players have submitted memes, rendering vote page!")
                    gameController.submittedMemes = 0;
                    let user1 = gameController.currentRoundPlayers[0];
                    let user2 = gameController.currentRoundPlayers[1];
                    Render.renderVotePage(user1, user2);
                }
            } else if (message.messageType === 'VOTE') {
                if (message.text === "1") {
                    gameController.meme1votes += 1;
                    console.log(gameController.meme1votes);
                } else if (message.text === "2") {
                    gameController.meme2votes += 1;
                    console.log(gameController.meme2votes);
                }
                //check if all users voted
                if ((gameController.meme1votes + gameController.meme2votes) === gameController.votingPlayers.length) {
                    //Render results page
                    await Render.renderResultsPage();
                }
            } else if (message.messageType === 'RESULT') {
                console.log("======IN RESULT MESSGE========");
                if (gameController.activePlayers.length - gameController.eliminatedPlayers.length === 1) {
                    console.log("======GETTING WINNER======");
                    for (let i = 0; i < gameController.activePlayers.length; i++) {
                        if (!gameController.eliminatedPlayers.includes(gameController.activePlayers[i].username)) {
                            console.log("WINNER!: " + gameController.activePlayers[i].username)
                            gameController.winner = gameController.activePlayers[i].username;
                        }
                    }
                    await Render.renderCompletePage();
                } else {
                    gameController.meme1votes = 0;
                    gameController.meme2votes = 0;
                    gameController.eliminatedPlayers.push(message.text);
                    await Render.renderNextPage();
                }
            } else if (message.messageType === 'FINISH') {
                console.log(gameController.winner);
                // let winner = await Fetch.Get.getWinner();
                // console.log(winner);
                location.replace('/home');
            } else {
                if(gameController.currentMemeSubmissions.length ===2){
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
            console.log("Calling Render.reloadTournamentMembers");
            let tournamentMembers = await Fetch.Get.tournamentMembers();
            let tournamentHost = await Fetch.Get.tournamentHost();

            tournamentMembers.sort(function (a, b) {
                return (a.id - b.id);
            });
            //JOSES TRYING SOMETHING

            UserWaitingRoom.innerHTML = "";
            for (let i = 0; i < tournamentMembers.length; i++) {
                console.log('Profile URL:', tournamentMembers[i].profileURL); // Log the profileURL for debugging

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

                console.log(tournamentMembers[i].profileURL === null);
                if (tournamentMembers[i].profileURL === null) {
                    playerProfilePic.src = '/img/memespace.gif';
                } else if(tournamentMembers[i].profileURL === "") {
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
            //JOSE DONT FORGET TO CMD Z THIS

            let playerCount = await Fetch.Get.playerCount();
            console.log(playerCount);
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
            console.log("Render page for tourny");


            //JOSES TRYING SOMETHING
            startBtn.style.visibility = "hidden";


            // startGameButton.style.display = "none";

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

                console.log('submit btn 1 clicked');
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
            console.log(gameController.currentMemeSubmissions);
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

            function voterBtns() {
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
            }

            function playerHideBtns() {
                voteStatusH3.innerHTML = "VOTING IN PROGRESS";
                voteMeme1btn.style.visibility = "hidden";
                voteMeme2btn.style.visibility = "hidden";
            }

            if (gameController.votingPlayers[0].username === currentUser.username) {
                voteStatusH3.innerHTML = "PLACE YOUR VOTES";
                voterBtns();
            } else if (gameController.votingPlayers[1].username === currentUser.username) {
                voteStatusH3.innerHTML = "PLACE YOUR VOTES";
                voterBtns();
            } else {
                playerHideBtns();
            }

            console.log(gameController.currentMemeSubmissions[0]);
        },

        renderWaitingPage() {
            lobbyContainer.innerHTML = `<h1>Waiting for Meme Submissions...</h1>
                                        <canvas id="snakeGame"></canvas>
                                        `;
        },

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
                         <h3 id="meme1-votes">${gameController.meme1votes} votes</h3>
                         <img class="memeAPIImage" src="${gameController.currentMemeSubmissions[0].memeURL}" alt="${gameController.currentMemeSubmissions[0].caption}">
                         <h2>${gameController.currentMemeSubmissions[0].caption}</h2>
                    </div>
                    <div class="column align-center result-second-meme">
                         <h3 id="player2-result"></h3>
                         <h3 id="meme2-votes">${gameController.meme2votes} votes</h3>
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
            let loser;
            if (gameController.meme1votes > gameController.meme2votes) {
                loser = gameController.currentRoundPlayers[1];
                document.querySelector('#player1-result').innerHTML = 'WINNER';
                document.querySelector('#player2-result').innerHTML = 'LOSER';
            } else if (gameController.meme1votes < gameController.meme2votes) {
                loser = gameController.currentRoundPlayers[0];
                document.querySelector('#player1-result').innerHTML = 'LOSER';
                document.querySelector('#player2-result').innerHTML = 'WINNER';
            } else if (gameController.meme1votes === gameController.meme2votes) {
                //TIE BREAKER
                if (gameController.tieBreakerFunction() === 0) {
                    loser = gameController.currentRoundPlayers[1];
                    document.querySelector('#meme1-votes').innerHTML += ' (+1)'
                    document.querySelector('#player1-result').innerHTML = '*WINNER BY COIN FLIP*';
                    document.querySelector('#player2-result').innerHTML = 'LOSER';
                } else if (gameController.tieBreakerFunction() === 1) {
                    loser = gameController.currentRoundPlayers[0];
                    document.querySelector('#meme2-votes').innerHTML += ' (+1)'
                    document.querySelector('#player2-result').innerHTML = '*WINNER BY COIN FLIP*';
                    document.querySelector('#player1-result').innerHTML = 'LOSER';
                }
            }

            if(gameController.meme1votes === 1 || gameController.meme2votes === 1) {
                document.querySelector('#meme1-votes').innerHTML += 'vote';
            } else {
                document.querySelector('#meme1-votes').innerHTML += 'votes';
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
        },

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
        },

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
                console.log("Getting Meme");
                let imageContainers = document.querySelectorAll(".memeAPIImage");
                try {
                    const response = await fetch(memeApiURL);
                    const data = await response.json();
                    console.log(data)
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
    //only lets users leave the game from the lobby
    // leaveBtn.addEventListener('click', () => {
    //     console.log('leave button clicked');
    //     for (let i = 0; i < gameController.activePlayers.length; i++) {
    //         if (gameController.activePlayers[i].username === currentUser.username) {
    //             console.log('removing ' + gameController.activePlayers[i]);
    //             gameController.activePlayers.splice(i, 1);
    //         }
    //     }
    //     console.log(gameController.activePlayers);
    //     let message = {
    //         user: currentUser.username,
    //         text: 'USER HAS LEFT LOBBY',
    //         memeURL: '',
    //         messageType: 'LEAVE'
    //     };
    //     Socket.sendMessage(message);
    // })
//event to remove a user that left the page and reload the page for all other users
    window.onbeforeunload = (event) => {
        gameController.disconnectMessage = true;
        for (let i = 0; i < gameController.activePlayers.length; i++) {
            if (gameController.activePlayers[i].username === currentUser.username) {
                console.log('removing ' + gameController.activePlayers[i]);
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
        console.log('Start button clicked')
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
    leaveBtn.addEventListener('click', ()=>{
        location.replace('/home');
    })
    Tournament.initialize();

})();