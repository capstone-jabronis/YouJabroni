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
    const leaveBtn = document.querySelector('#leave-lobby-btn');
    const lobbyContainer = document.querySelector('.jdWaitContainer');
    const startBtn = document.querySelector('#start-btn');
    //MEME API VARIABLES//////////////////////////////////
    let memeApiURL = "https://api.imgflip.com/get_memes";
    //Object to control various game statuses to update the page accordingly
    let gameController = {
        gameStart: false
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
                user: 'nic',
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
                } else {
                    Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(message));
                }


                if (message.messageType === 'LEAVE') {
                    console.log('REDIRECT');
                    window.location.replace("/tournament/lobby/leave");
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
            console.log(message);

            if (message.messageType === 'JOIN') {
                await Render.reloadTournamentMembers('');
            } else if (message.messageType === 'LEAVE') {
                await Render.reloadTournamentMembers(message.user);
            } else if (message.messageType === 'START') {
                Render.renderTournamentPage();
            } else if (message.messageType === 'DATA') {
                console.log('meme submitted!');
                console.log(message);
            }
        }
    }

    const Events = {
        async initialize() {
            //waits for socket to connect before moving on
            await Socket.connect();
            // await Render.reloadTournamentMembers();
        }
    }

    const Render = {
        async reloadTournamentMembers(userToRemove) {
            console.log("Calling Render.reloadTournamentMembers");
            let tournamentMembers = await Fetch.Get.tournamentMembers();
            let tournamentHost = await Fetch.Get.tournamentHost();

            UserWaitingRoom.innerHTML = "";
            for (let i = 0; i < tournamentMembers.length; i++) {
                if (tournamentMembers[i].username === tournamentHost.username) {
                    UserWaitingRoom.innerHTML += '<p>' + tournamentMembers[i].username + '  HOST<p>'
                } else if (tournamentMembers[i].username !== userToRemove.username) {
                    console.log(userToRemove);
                    UserWaitingRoom.innerHTML += '<p>' + tournamentMembers[i].username + '<p>'
                }
            }
            //to render start button when members reach required amount for game
            if (tournamentMembers.length !== 2) {
                startBtn.style.visibility = "hidden";
            } else if (tournamentMembers.length === 2 && currentUser.username === tournamentHost.username) {
                startBtn.style.visibility = "visible";
            }
        },
        async renderTournamentPage() {
            console.log("Render page for tourny");
            startBtn.style.visibility = "hidden";
            lobbyContainer.innerHTML = `
            <div class="jdCreateContainer">
        <div class="jdCreateRow">
            <div class="jdCreateCol">
                <h1 class="jdrounds">
                    ROUND # <span>10000000</span>
                </h1>
                <h1 class="jdtime">
                    :TIME
                </h1>
            </div>
        </div>
    </div>
    <div class="jdCreateImgContainer">
        <div class="jdCreateImgRow">
            <div class="jdCreateImgCol">
                <img class="memeAPIImage" src="" alt="WRITE SOMETHING FUNNY JABRONI">
            </div>
        </div>
    </div>

    <div class="jdCreateInputContainer">
        <div class="jdCreateInputRow">
            <div class="jdCreateInputCol">
                    <input type="text" id="memeCaption" placeholder="Enter Your Meme Submission">
                    <button id="submitMemeCaptionBtn" type="submit">Submit Caption</button>
            </div>
        </div>
    </div>
`;
           await Fetch.Get.getMeme();
            let submitMemeBtn = document.querySelector('#submitMemeCaptionBtn');

            submitMemeBtn.addEventListener('click', () => {
                let memeCaption = document.querySelector('#memeCaption').value
                console.log("meme caption: " +memeCaption);
                let memeUrl = document.querySelector('.memeAPIImage').getAttribute("src")
                console.log("meme URL: " + memeUrl);
                console.log('submit btn clicked');
                let message = {
                    user: currentUser.username,
                    text: memeCaption,
                    memeURL: memeUrl,
                    messageType: 'DATA'
                };
                Socket.sendMessage(message);
            })
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

            async getMeme() {
                console.log("Getting Meme");
                let imageContainer = document.querySelector(".memeAPIImage");
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

                    imageContainer.src = imageUrl;
                } catch (error) {
                    console.error('Error fetching meme:', error);
                }
            }
        }
    }
    //OG EVENT FOR BUTTON TO SUBMIT MEME CAPTION
// const Events = {
//     async initialize() {
//         await Socket.connect();
//         document.querySelector('#submitMemeCaptionBtn').addEventListener('click', () => {
//             Socket.sendMessage()
//         });
//     }
// }
// document.addEventListener('DOMContentLoaded', async () => {
//        await Events.initialize()
//     }
// )


    //EVENT LISTENERS
    leaveBtn.addEventListener('click', () => {
        console.log('leave button clicked');
        let message = {
            user: currentUser.username,
            text: 'USER HAS LEFT LOBBY',
            memeURL: '',
            messageType: 'LEAVE'
        };
        Socket.sendMessage(message);
    })

    startBtn.addEventListener('click', async () => {
        console.log('Start button clicked')
        let host = await Fetch.Get.tournamentHost();
        let message;
        if (currentUser.username == host.username) {
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
    })

    Tournament.initialize();

})();