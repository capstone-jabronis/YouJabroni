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
        console.log(data);
        data.reverse();
        let rank = data.length;
        for (let user of data) {
            let playerDiv = document.createElement('div');
            playerDiv.classList.add('row');
            playerDiv.classList.add('player')
            if (rank == 1) {
                playerDiv.classList.add('first');
            }
            let profileURL = user.user.profileURL;
            console.log("this is the url ", profileURL);
            if (profileURL == null) {
                profileURL = "/img/memespace.gif"
            }
            playerDiv.innerHTML = `
                <h1 class="rank">${rank--}</h1>
                <img class="not-10 user-pic" src="${profileURL}">
                <div class="leader-info column">
                <div class="name">${user.user.username}</div>
                <div class="wins">Wins: ${user.wins}</div>
                </div>
            `;
            LeaderTitleElement.after(playerDiv);
        }

    } catch (e) {
        console.log(e);
    }

}

window.onload = leaderboard();