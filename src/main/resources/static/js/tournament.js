(function() {
    console.log("in tournament.js");
    const tournamentId = document.querySelector('#tournamentID').text();
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    const Tournament = {
        stompClient: null,
        tournamentId: tournamentId,
        topic: null,
        currentSubscription: null,
    }
    const Socket = {
        connect() {
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
            Tournament.stompClient.send(`${Tournament.topic}`, {}, "Hewwo");
        },
        onMessageReceived(payload) {
            console.log("Inside onMessageReceived!");
        }
    }
})();