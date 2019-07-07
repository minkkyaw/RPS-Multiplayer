let signInBtn = document.getElementById("sign-in-btn");
let signInLink = document.getElementById('sign-in-link');
let createNewAccountBtn = document.getElementById('create-new-acc-btn');
let createNewAccountLink = document.getElementById('create-new-acc-link');
let signInDiv = document.getElementById('sign-in');
let createnewAccountDiv = document.getElementById('create-new-acc');
let rockPick = document.getElementById('rock-pick');
let paperPick = document.getElementById('paper-pick');
let scissorsPick = document.getElementById('scissors-pick');
let usernameInputDiv = document.getElementById('username-input-div');
let passwordInputDiv = document.getElementById('password-input-div');
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let newUsernameInput = document.getElementById('new-username');
let newPasswordInput = document.getElementById('new-password');
let confirmPasswordInput = document.getElementById('confirm-new-password');
let searchBtn = document.getElementById('search-btn');
let logOutBtn = document.getElementById('log-out-btn');
let player1name = document.getElementById('player1-name');
let player2name = document.getElementById('player2-name');
let pick1H4 = document.getElementById('player1-pick');
let pick2H4 = document.getElementById('player2-pick');
let signInInvalidText = document.getElementById('sign-in-invalid-text');
let newAccInvalidText = document.getElementById('new-acc-invalid-text');
let currentWinData = document.getElementById('current-win-data');
let currentDrawData = document.getElementById('current-draw-data');
let currentLostData = document.getElementById('current-lost-data');
let username;
let searching = false;
let online;
let onlinePlayers = [];
let user2name;
let winCount = 0;
let drawCount = 0;
let lostCount = 0;
let totalCount = 0;
let currentWinCount = 0;
let currentDrawCount = 0;
let currentLostCount = 0;
let pick1;
let pick2;


// Your web app's Firebase configuration
var firebaseConfig = {
        apiKey: "AIzaSyDs-rUpadv-5w_AzmdDUb5e8PDYws8osjQ",
        authDomain: "test-6444f.firebaseapp.com",
        databaseURL: "https://test-6444f.firebaseio.com",
        projectId: "test-6444f",
        storageBucket: "",
        messagingSenderId: "642414957945",
        appId: "1:642414957945:web:bc8ebd51cfca3b66"
    };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let database = firebase.database();


function newAccount() {
    let newUsername = newUsernameInput.value;
    let newPassword = newPasswordInput.value;
    let confirmPassword = confirmPasswordInput.value;
    let signedInUsernames = [];
    database.ref('/userdata').on('child_added', (snapshot) => {
        signedInUsernames.push(snapshot.val().username);
    });
    setTimeout(function() {
        if(newPassword === confirmPassword && !signedInUsernames.includes(newUsername)) {
            database.ref('/userdata').push({
                username: newUsername,
                password: newPassword
            });
            database.ref('/gamechannel/'+newUsername).set({
                online: false,
                searching: false,
                totalCount: 0,
                winCount: 0,
                lostCount: 0
            });
            createnewAccountDiv.style.display = "none";
            signInDiv.style.display = "block";
            signInInvalidText.textContent = 'Already registered. Sign in now!';
        } else if(signedInUsernames.includes(newUsername)){
            newAccInvalidText.textContent = 'The username is not available.';
            newAccInvalidText.style.color = 'red';
        } else {
            newAccInvalidText.textContent = 'The passwords are not the same. Please type again.';
            newAccInvalidText.style.color = 'red';
        }
    },2000)
    
}

function signInValidation() {
    let signInUsername = usernameInput.value;
    database.ref('/userdata').on("child_added", (snapshot) => {
        if(signInUsername === snapshot.val().username) {
            if(passwordInput.value === snapshot.val().password) {
                currentWinCount = 0;
                currentDrawCount = 0;
                currentLostCount = 0;
                username = signInUsername;
                online = true;
                usernameInput.value = '';
                passwordInput.value = '';
                if(usernameInput.value !== snapshot.val().username) {
                    winCount = 0;
                    drawCount = 0;
                    lostCount = 0;
                    totalCount = 0;
                }
                database.ref('/gamechannel/'+username).on("value", function(snapshot) {
                    if(snapshot.val().hasOwnProperty("drawCount")) {
                        winCount = snapshot.val().winCount;
                        drawCount = snapshot.val().drawCount;
                        lostCount = snapshot.val().lostCount;
                        totalCount = snapshot.val().totalCount;
                    }
                    if(totalCount === 0){
                        document.getElementById('player1-win-percentage').textContent = "0%";
                        document.getElementById('player1-draw-percentage').textContent = "0%";
                        document.getElementById('player1-lost-percentage').textContent = "0%";    
                    } else {
                        document.getElementById('player1-win-percentage').textContent = (winCount / totalCount * 100).toFixed(2) + "%";
                        document.getElementById('player1-draw-percentage').textContent = (drawCount / totalCount * 100).toFixed(2) + "%";
                        document.getElementById('player1-lost-percentage').textContent = (lostCount / totalCount * 100).toFixed(2) + "%";    
                    };
                });
                document.querySelectorAll('.sign-in').forEach(element => element.style.display = "none");
                setTimeout(function() {
                    database.ref('/gamechannel/'+username).set({
                        online,
                        searching,
                        totalCount,
                        winCount,
                        drawCount,
                        lostCount
                    });
                    document.querySelectorAll('.user-container').forEach(element => element.style.display = "block");
                    document.getElementById('user1-name').textContent = username;
                    searchBtn.style.display = 'block';
                },2000);
            let selection = document.querySelectorAll('.rps-selection');
            selection.forEach(select => select.addEventListener('click', function() {
                database.ref('/gamechannel/'+username).set({
                    online,
                    searching,
                    pick: this.id,
                    totalCount,
                    winCount,
                    lostCount,
                    drawCount
                });
                pick2 = '';
                pick1H4.textContent = this.id;
                pick1H4.style.display = "block";
                document.querySelectorAll('.selection').forEach(x => x.style.display = 'none');
            }));
            }
        } else {
            signInInvalidText.textContent = 'The username or the password is invalid';
            signInInvalidText.style.color = 'red';
        };
    });
}

function signIn() {
    signInValidation();
};

function logOut() {
    signInInvalidText.textContent = '';
    newAccInvalidText.textContent = '';
    online = false;
    searching = false;
    onlinePlayers = [];
    currentWinCount = 0;
    currentDrawCount = 0;
    currentLostCount = 0;
    database.ref('/gamechannel/'+username).set({
        searching,
        online,
        totalCount,
        winCount,
        lostCount,
        drawCount
    });
    document.querySelectorAll('.sign-in').forEach(element => element.style.display = "block");
    document.querySelectorAll('.result-container').forEach(element => element.style.display = "none");
    document.querySelectorAll('.search-btn').forEach(element => element.style.display = "none");
    document.querySelectorAll('.user-container').forEach(element => element.style.display = "none");
};

function searchingOtherPlayer(username) {
    searching = true;
    database.ref('/gamechannel/'+username).set({
        online,
        searching,
        totalCount,
        winCount,
        lostCount,
        drawCount
    });
    player1name.textContent = username;
    document.querySelectorAll('.result-container').forEach(element => element.style.display = "flex");
    currentWinData.textContent = currentWinCount;
    currentDrawData.textContent = currentDrawCount;
    currentLostData.textContent = currentLostCount;
}

function findingUser2(onlinePlayers) {
    if(onlinePlayers.filter(name => name !== username).length !== 0){
        user2name = onlinePlayers.filter(name => name !== username)[0];
        console.log("user2name",user2name);
        player2name.textContent = user2name;
        searching = false;
        database.ref('/gamechannel/'+username).set({
            online,
            searching,
            totalCount,
            winCount,
            lostCount,
            drawCount
        });
        database.ref('/gamechannel/'+user2name).once("value", function(snapshot) {
            if(!snapshot.val().online) {
                player2name.textContent = 'Player-2 logged out';
            };
        })
    } else {
        player2name.textContent = 'Waiting for other players';
    }
}






function resultFunc(result) {
    switch(result) {
        case 'win':
            document.getElementById('result').textContent = 'You Win!!!';
            document.getElementById('result').style.color = 'rgb(20, 44, 25)';
            winCount++;
            totalCount++;
            currentWinCount++;
            database.ref('/gamechannel/'+username).set({
                online,
                searching,
                totalCount,
                winCount,
                lostCount,
                drawCount
            });
            break;
        case 'draw':
            document.getElementById('result').textContent = 'It is a draw!!!';
            document.getElementById('result').style.color = 'rgb(26, 48, 54)';
            drawCount++;
            totalCount++;
            currentDrawCount++;
            database.ref('/gamechannel/'+username).set({
                online,
                searching,
                totalCount,
                winCount,
                lostCount,
                drawCount
            });
            break;
        case 'lost':
            document.getElementById('result').textContent = 'You Lost!!!';
            document.getElementById('result').style.color = 'rgb(59, 31, 31)';
            lostCount++;
            totalCount++;
            currentLostCount++;
            database.ref('/gamechannel/'+username).set({
                online,
                searching,
                totalCount,
                winCount,
                lostCount,
                drawCount
            });
            break;                        
    }

    currentWinData.textContent = currentWinCount;
    currentDrawData.textContent = currentDrawCount;
    currentLostData.textContent = currentLostCount;

    setTimeout(function() {
        document.getElementById('result').textContent = '';
        database.ref('/gamechannel/' + username).set({
            online,
            searching,
            pick: '',
            totalCount,
            winCount,
            lostCount,
            drawCount
    });
        pick1H4.textContent = '';
        pick2H4.textContent = '';
        document.querySelectorAll('.selection').forEach(x => x.style.display = 'flex');
    },5000);
}

database.ref('/gamechannel/').on("value", (snapshot) => {
    if(user2name && snapshot.val()[user2name].hasOwnProperty("pick") && snapshot.val()[username].hasOwnProperty("pick")){
        pick1 = snapshot.val()[username].pick;
        pick2 = snapshot.val()[user2name].pick;
        if(pick1 && pick2) {
            pick2H4.textContent = pick2;
            pick2H4.style.display = "block";
            if(pick1 === 'rock') {
            console.log(1);
            console.log("pick2  " + pick2)
            switch(pick2) {
                case 'rock':
                    resultFunc('draw');
                    break;
                case 'paper':
                    resultFunc('lost');
                    break;
                case 'scissors':
                    resultFunc('win');
                    break;
            }
        } else if(pick1 === 'paper') {
            console.log(1);
            switch(pick2) {
                case 'rock':
                    resultFunc('win');
                    break;
                case 'paper':
                    resultFunc('draw');
                    break;
                case 'scissors':
                    resultFunc('lost');
                    break;
            }
        } else if(pick1 === 'scissors') {
            console.log(1);
            switch(pick2) {
                case 'rock':
                    resultFunc('lost');
                    break;
                case 'paper':
                    resultFunc('win');
                    break;
                case 'scissors':
                    resultFunc('draw');
                    break;
            }
        }
    }
        
        
    }
    
});

signInBtn.addEventListener("click", function(e) {
    e.preventDefault();
    this.blur();
    signIn();
});

createNewAccountBtn.addEventListener('click', function(e) {
    e.preventDefault();
    newAccount();
});

signInLink.addEventListener("click", function(e) {
    e.preventDefault();
    createnewAccountDiv.style.display = "none";
    signInDiv.style.display = "block";
});

createNewAccountLink.addEventListener('click', function(e) {
    e.preventDefault();
    signInDiv.style.display = "none";
    createnewAccountDiv.style.display = "block";
});

searchBtn.addEventListener('click',() => {
    this.blur();
    searchingOtherPlayer(username);
    database.ref('/gamechannel/').on("value", (snapshot) => {
        for(var key in snapshot.val()) {
            // console.log(key, snapshot.val()[key].searching);
            if(snapshot.val()[key].searching === true && !onlinePlayers.includes(key)) {
                onlinePlayers.push(key);
                // console.log(onlinePlayers);
                findingUser2(onlinePlayers);
            };
        } ;
    });
    searchBtn.style.display = 'none';
});

logOutBtn.addEventListener('click',function() {
    this.blur();
    logOut();
});





