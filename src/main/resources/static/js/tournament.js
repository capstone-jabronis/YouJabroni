// window.onload = async () => {
//     try {
// //       For Jose's Tournament card code
//         const resultsPage = document.querySelector("#jdtournamentResults");
//         const url = "/tournaments/api";
//         const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
//
// //       For WebSocket/Sock/StompJS Server Connection with frontend
// //         const tournamentId = document.querySelector('#tournamentID').getAttribute('text');
// //         const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
// //
// //         const Tournament = {
// //             stompClient: null,
// //             tournamentId: tournamentId,
// //             topic: null,
// //             currentSubscription: null,
// //         }
// //         const Socket = {
// //             connect() {
// //                 console.log('Connected to Socket!' + tournamentId);
// //                 let socket = new SockJS("/secured/sock");
// //                 Tournament.stompClient = Stomp.over(socket);
// //                 Tournament.stompClient.connect({'X-CSRF-TOKEN': csrfToken}, this.onConnected, this.onError);
// //             },
// //             onConnected() {
// //                 console.log("inside onConnected");
// //                 Socket.enterRoom(Tournament.tournamentId);
// //             },
// //             onError(error) {
// //                 console.log("Error connecting to stream. Error:");
// //                 console.log(error);
// //             },
// //             enterRoom(tournamentId) {
// //                 console.log("Inside enterRoom");
// //                 Tournament.topic = `/secured/tournament/waiting-room/${Tournament.tournamentId}`;
// //                 Tournament.currentSubscription = Tournament.stompClient.subscribe(`/secured/tournament/${Tournament.tournamentId}`, this.onMessageReceived);
// //                 Tournament.stompClient.send(`${Tournament.topic}`, {}, "Hewwo");
// //             },
// //             onMessageReceived(payload) {
// //                 console.log("Inside onMessageReceived!");
// //             }
// //         }
// //     End of WebSocket/Sock/StompJS Code
//
// //     Start of Jose's tournament card code
//
//         let results = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRF-TOKEN': csrfToken
//             }
//         });
//
//         if (!results.ok) {
//             throw new Error(`HTTP error! Status: ${results.status}`);
//         }
//
//         let data = await results.json();
//         console.log(data);
//
//         resultsPage.innerHTML = '';
//         const itemDiv = document.createElement('div');
//         itemDiv.classList.add("leader-cards")
//         const detailsDiv = document.createElement('div');
//         detailsDiv.classList.add("leader-title")
//         detailsDiv.classList.add("row")
//         const h1Title = document.createElement("h1");
//         detailsDiv.appendChild(h1Title);
//         h1Title.innerText = "TOURNAMENTS"
//         itemDiv.appendChild(detailsDiv);
//
//         for (let tournaments of data) {
//             const tournamentDiv = document.createElement('form');
//             tournamentDiv.classList.add("row");
//             tournamentDiv.classList.add("player");
//             tournamentDiv.classList.add("name");
//             tournamentDiv.classList.add("jdTournamentCSS");
//             let waitingRoomUrlString = `@{|/tournament/waiting-room/${tournaments.id}|}`;
//             tournamentDiv.setAttribute("th:action", waitingRoomUrlString);
//             tournamentDiv.setAttribute("method", "POST");
//             tournamentDiv.style.whiteSpace = "pre";
//             tournamentDiv.innerHTML = `
//                 TOURNAMENT # ${tournaments.id}
//                 Players:
//                 0/8
//             `;
//             const joinBTN = document.createElement("button");
//             joinBTN.innerHTML = 'JOIN NOW';
//             // HERE WE WOULD PUT THE TOURNAMENT! \(^.^)/ /\\/\/\//\/\/\/\/\/\/\/ 🏴‍☠️
//             joinBTN.setAttribute("type", "submit");
//             // joinBTN.setAttribute("data-id", `${tournaments.id}`);
//             tournamentDiv.appendChild(joinBTN)
//             const line = document.createElement("hr");
//             itemDiv.appendChild(tournamentDiv);
//         }
//
//
//         // WILL HAVE TO COME BACK FOR TOP USERS
//         resultsPage.appendChild(itemDiv);
//     } catch (error) {
//         console.error("Error retrieving listed tournaments", error);
//     }
// };
//
//
