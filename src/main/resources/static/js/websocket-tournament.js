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
const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const tournamentJoinBtns = document.querySelectorAll('button');
let tournamentIdClick;
for (let tournamentJoinBtn of tournamentJoinBtns) {
    tournamentJoinBtn.addEventListener('click', (e) => {
        tournamentIdClick = e.target.getAttribute('tournament')
        console.log(tournamentIdClick);
    })
}


const Tournament = {
    stompClient: null,
    tournamentId: tournamentIdClick,
    topic: null,
    currentSubscription: null,
    memeSubmission: document.querySelector('#memeCaption')
}
const Socket = {
    connect() {
        console.log('Connected to Socket!' + Tournament.tournamentId);
        let socket = new SockJS("/secured/sock");
        Tournament.stompClient = Stomp.over(socket);
        Tournament.stompClient.connect({'X-CSRF-TOKEN': csrfToken}, this.onConnected, this.onError);
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
        Tournament.topic = `/secured/tournament/waiting-room/${Tournament.tournamentId}`;
        Tournament.currentSubscription = Tournament.stompClient.subscribe(`/secured/tournament/${Tournament.tournamentId}`, this.onMessageReceived);
        Tournament.stompClient.send(`${Tournament.topic}`, {}, JSON.stringify({messageType: 'JOIN'}));
    },
    sendMessage(meme) {
        console.log("Inside sendMessage");
        let memeContent = Tournament.memeSubmission.val();
        console.log(memeContent);
        Tournament.topic = `/secured/tournament/create-meme/${Tournament.tournamentId}`;
        console.log(Tournament.stompClient);
        if (memeContent && Tournament.stompClient) {
            let memeSub = {
                text: memeContent,
                messageType: 'CHAT'
            };
            console.log(memeSub);
            Tournament.stompClient.send(`${Tournament.topic}/send`, {}, JSON.stringify(memeSub));
        }
        Tournament.memeSubmission.val("");
    },
    onMessageReceived(payload) {
        console.log("Inside onMessageReceived!");
        let message = JSON.parse(payload.body);
        console.log("Message received:");
        console.log(message);
        if (message.messageType === 'JOIN') {
            Print.joinMessage(message);
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
        await Socket.connect();
        document.querySelector('#submitMemeCaptionBtn').addEventListener('click', () => {
            Socket.sendMessage()
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
        Events.initialize()
    }
)

