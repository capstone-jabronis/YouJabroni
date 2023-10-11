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
    const leaveBtn = document.querySelector('#leave-lobby-btn');
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
                messageType: 'JOIN'
            }
            Tournament.stompClient.send(`${Tournament.topic}/userjoin`, {}, JSON.stringify(message));
        },
        sendMessage(message) {
            console.log("Inside sendMessage");
            console.log(message);
            Tournament.topic = `/secured/app/tournament/lobby/${Tournament.tournamentId}`;

            if (Tournament.stompClient) {
                Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(message));

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
                console.log("in JOIN conditional");
                await Render.reloadTournamentMembers('');
            } else if (message.messageType === 'LEAVE') {
                // Print.leaveMessage(message);
                console.log("in LEAVE conditional")
                await Render.reloadTournamentMembers(message.user);
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
        async reloadTournamentMembers(userToRemove) {
            console.log("Calling Render.reloadTournamentMembers");
            let tournamentMembers = await Fetch.Get.tournamentMembers();
            let tournamentHost = await Fetch.Get.tournamentHost();
            console.log(tournamentMembers);
            console.log('HOST-----')
            console.log(tournamentHost);
            UserWaitingRoom.innerHTML = "";
            for (let i = 0; i < tournamentMembers.length; i++) {
                if (tournamentMembers[i].username === tournamentHost.username) {
                    UserWaitingRoom.innerHTML += '<p>' + tournamentMembers[i].username + '  HOST<p>'
                } else if (tournamentMembers[i].username !== userToRemove){
                    UserWaitingRoom.innerHTML += '<p>' + tournamentMembers[i].username + '<p>'
                }
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

    //EVENT LISTENERS
    leaveBtn.addEventListener('click', () => {
        console.log('leave button clicked');
        let message = {
            user: currentUser.username,
            text: 'USER HAS LEFT LOBBY',
            messageType: 'LEAVE'
        };
        Socket.sendMessage(message);
    })

})();