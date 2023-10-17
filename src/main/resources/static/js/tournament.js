const hostTournamentModal = document.querySelector('#host-tournament-modal');
const hostTournamentBtn = document.querySelector('.tournament-create-btn');
const cancelHostBtn = document.querySelector('#cancel-host-btn');
const radioFour = document.querySelector('#four');
const radioEight = document.querySelector('#eight');
const radioTwelve = document.querySelector('#twelve');
const radioDiv4 = document.querySelector('#radio-div-4');
const radioDiv8 = document.querySelector('#radio-div-8');
const radioDiv12 = document.querySelector('#radio-div-12');
const tournamentModalOverlay = document.querySelector('.tournament-modal');

hostTournamentBtn.addEventListener('click', ()=>{
    console.log('Inside tournament modal')
    hostTournamentModal.classList.remove('hidden');
    tournamentModalOverlay.classList.remove('hidden');

})

cancelHostBtn.addEventListener('click', ()=>{
    hostTournamentModal.classList.add('hidden');
    tournamentModalOverlay.classList.add('hidden');
})

tournamentModalOverlay.addEventListener('click', () => {
    hostTournamentModal.classList.add('hidden');
    tournamentModalOverlay.classList.add('hidden');
})

hostTournamentModal.addEventListener('click', (e) => {
    e.stopPropagation();
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