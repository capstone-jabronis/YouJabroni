let leaderboard = async () => {
    try {
        let LeaderTitleElement = document.querySelector(".leader-title");
        let url = "/leaderboard";
        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
        let results = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });
        if (!results.ok) {
            throw new Error(`HTTP error! Status: ${results.status}`);
        }
        const data = await results.json();
        data.reverse();
        console.log(data);
        let betterData = [];
        //remove null users
        for(let i = 0; i < data.length; i++){
            if(data[i].user != null){
                betterData.push(data[i]);
            }
        }
        console.log(betterData);
        let rank = betterData.length;
        for (let user of betterData) {
            let playerDiv = document.createElement('div');
            playerDiv.classList.add('row');
            playerDiv.classList.add('player')
            if (rank == 1) {
                playerDiv.classList.add('first');
            }
            playerDiv.innerHTML = `
                <h1 class="rank">${rank--}</h1>
                <img class="not-10 user-pic" src="">
                <div class="leader-info column">
                <div class="name">${user.user.username}</div>
                <div class="wins">wins: ${user.wins}</div>
                </div>
            `;

            let userProfilePic = playerDiv.querySelector('.user-pic');

            if (user.user.profileURL === null || user.user.profileURL === '') {
                userProfilePic.src = "/img/memespace.gif";
            } else {
                userProfilePic.src = user.user.profileURL;
            }

            const userPic = playerDiv.querySelector('.user-pic');
            userPic.addEventListener('click', function () {
                window.location.href = `/${user.user.id}/profile`;
            });

            const username = playerDiv.querySelector('.name');
            username.addEventListener('click', function () {
                window.location.href = `/${user.user.id}/profile`;
            });

            LeaderTitleElement.after(playerDiv);
        }

    } catch (e) {
        console.log(e);
    }

}

window.onload = leaderboard;
