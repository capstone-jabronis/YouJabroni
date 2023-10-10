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
    const UserWaitingRoom = document.querySelector('#users-in-room');
    //Object to control various game statuses to update the page accordingly
    let gameController = {
        gameStart: false
    }

    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

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

            // Tournament.stompClient = new StompJs.Client({
            //     brokerURL: 'wss://localhost:8080/secured/memespace-sock',
            //     connectHeaders: header,
            //     debug(err) {
            //         console.log(err);
            //     }
            // });
            // console.log("right before connect with the csrf token");
            // Tournament.stompClient.connect({'X-CSRF-TOKEN': csrfToken}, this.onConnected, this.onError);
            // Tournament.stompClient.onConnect = this.onConnected;
            // Tournament.stompClient.onStompError = this.onError;
            // console.log("about to activate stomp client");
            // Tournament.stompClient.activate();
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
            Tournament.topic = `/secured/app/tournament/waiting-room/${Tournament.tournamentId}`;
            Tournament.currentSubscription = Tournament.stompClient.subscribe(`/secured/tournament/waiting-room/${Tournament.tournamentId}`, this.onMessageReceived);
            let message = {
                user: 'nic',
                text: "User Joined Tournament!",
                messageType: 'JOIN'
            }
            Tournament.stompClient.send(`${Tournament.topic}/userjoin`, {}, JSON.stringify(message));
            // this.sendMessage();
        },
        sendMessage() {
            console.log("Inside sendMessage");
            Tournament.topic = `/secured/app/tournament/waiting-room/${Tournament.tournamentId}`;
            if (gameController.gameStart) {
                console.log("Game has started, sending MemeSubmssion");
                let memeContent = Tournament.memeSubmission.val();
                console.log(memeContent);
                console.log("Tournament Stomp client: " + Tournament.stompClient);

                if (memeContent && Tournament.stompClient) {
                    let memeSub = {
                        text: memeContent,
                        messageType: 'CHAT'
                    };

                    Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(memeSub));
                }

            } else if (!gameController.gameStart) {
                console.log("In sendMessage function: Game has not started, tracking users in room...");
                if (Tournament.stompClient) {
                    let websocketMessage = {
                        text: "User Joined Room!",
                        messageType: 'JOIN'
                    }
                    Tournament.stompClient.send(`${Tournament.topic}/userjoin`, {}, JSON.stringify(websocketMessage));
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
            await Render.reloadTournamentMembers();
            if (message.messageType === 'JOIN') {
                Print.joinMessage("in conditional of recieve" + message);
            } else if (message.messageType === 'LEAVE') {
                Print.leaveMessage(message);
            } else {
                Print.chatMessage(message);
            }
        }
    }

    const Print = {
        joinMessage(message) {
            console.log(`${message.sender.username} has joined the chat!`);
        },
        chatMessage(message) {
            console.log(`${message.sender.username}: ${message.text}`);
        },
        leaveMessage(message) {
            console.log(`${message.sender.username} left :(`);
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
        async reloadTournamentMembers() {
            console.log("Calling Render.reloadTournamentMembers");
            let tournamentMembers = await Fetch.Get.tournamentMembers();
            console.log(tournamentMembers);
            UserWaitingRoom.innerHTML = "";
            for (let i = 0; i < tournamentMembers.length; i++) {
                UserWaitingRoom.innerHTML += '<p>' + tournamentMembers[i].username + '<p>'
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

    Tournament.initialize();


})();