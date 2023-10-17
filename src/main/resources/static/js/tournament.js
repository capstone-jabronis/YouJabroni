// window.addEventListener("load", (event) => {
//     if(tournamentFull){
//         alert("Tournament Full, please try another!");
//         tournamentFull = false;
//     }
// });
// ( async () => {
//     try {
// //       For Jose's Tournament card code
//         const resultsPage = document.querySelector("#jdtournamentResults");
//         const url = "/tournaments/api";
//         const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
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
//             let tournamentId = tournaments.id.toString();
//             const tournamentDiv = document.createElement('form');
//             tournamentDiv.classList.add("row");
//             tournamentDiv.classList.add("player");
//             tournamentDiv.classList.add("name");
//             tournamentDiv.classList.add("jdTournamentCSS");
//             tournamentDiv.setAttribute("th:action", `@{|/tournament/waiting-room/${tournamentId}|}`);
//             tournamentDiv.setAttribute("th:method", "POST");
//             tournamentDiv.style.whiteSpace = "pre";
//             tournamentDiv.innerHTML = `
//                 TOURNAMENT # ${tournaments.id}
//                 Players:
//                 0/8
//             `;
//             const formElement = document.createElement('form');
//             const tournamentID = tournaments.id;
//             formElement.setAttribute('action', `/tournament/waiting-room/${tournamentId}`);
//             formElement.method = 'POST';
//             const joinBTN = document.createElement("button");
//             formElement.appendChild(joinBTN);
//             joinBTN.innerHTML = 'JOIN NOW';
//             joinBTN.setAttribute('data-th-tournament', `${tournamentID}`);
//             joinBTN.setAttribute('type', 'submit');
//             // HERE WE WOULD PUT THE TOURNAMENT! \(^.^)/ /\\/\/\//\/\/\/\/\/\/\/ 🏴‍☠️
//             joinBTN.setAttribute("type", "submit");
//             joinBTN.setAttribute("data-id", `${tournaments.id}`);
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
// }) ();
const hostTournamentModal = document.querySelector('#host-tournament-modal');
const hostTournamentBtn = document.querySelector('.tournament-create-btn');
const cancelHostBtn = document.querySelector('#cancel-host-btn');
const radioFour = document.querySelector('#four');
const radioEight = document.querySelector('#eight');
const radioTwelve = document.querySelector('#twelve');
const radioDiv4 = document.querySelector('#radio-div-4');
const radioDiv8 = document.querySelector('#radio-div-8');
const radioDiv12 = document.querySelector('#radio-div-12');

hostTournamentBtn.addEventListener('click', ()=>{
    hostTournamentModal.style.display = "flex";
})

cancelHostBtn.addEventListener('click', ()=>{
    hostTournamentModal.style.display = "none";
})

radioDiv4.addEventListener('click', ()=>{
    radioFour.checked = true;
    radioDiv4.style.border = "solid 3px white"
    radioDiv8.style.border = "none";
    radioDiv12.style.border = "none";
})

radioDiv8.addEventListener('click', ()=>{
    radioEight.checked = true;
    radioDiv8.style.border = "solid 3px white"
    radioDiv4.style.border = "none";
    radioDiv12.style.border = "none";
})

radioDiv12.addEventListener('click', ()=>{
    radioTwelve.checked = true;
    radioDiv12.style.border = "solid 3px white"
    radioDiv4.style.border = "none";
    radioDiv8.style.border = "none";
})