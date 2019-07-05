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
let player1name = document.getElementById('user1-name');
let player2name = document.getElementById('user2-name');
let username;
let searching = false;
let online;
let onlinePlayers = [];
let user2name;
let winCount = 0;
let drawCount = 0;
let lostCount = 0;
let totalCount = 0;


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
    let invalidText = document.getElementById('new-acc-invalid-text');
    if(newPassword === confirmPassword) {
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
        invalidText.textContent = '';
    } else {
        invalidText.textContent = 'The passwords are not the same. Please type again.';
        invalidText.style.color = 'red';
    }
}

function signInValidation() {
    let signInUsername = usernameInput.value;
    let invalidText = document.getElementById('sign-in-invalid-text');
    database.ref('/userdata').on("child_added", (snapshot) => {
        if(signInUsername === snapshot.val().username) {
            if(passwordInput.value === snapshot.val().password) {
                username = signInUsername;
                online = true;
                invalidText.textContent = '';
                database.ref('/gamechannel/'+username).on("value", function(snapshot) {
                    if(snapshot.val().hasOwnProperty("drawCount")) {
                        winCount = snapshot.val().winCount;
                        drawCount = snapshot.val().drawCount;
                        lostCount = snapshot.val().lostCount;
                        totalCount = snapshot.val().totalCount;
                    }
                });
                setTimeout(function() {
                    database.ref('/gamechannel/'+username).set({
                        online,
                        searching,
                        totalCount,
                        winCount,
                        drawCount,
                        lostCount
                    });
                    searchBtn.style.display = 'block';
                },2000);
            document.getElementById('player1-name').textContent = username;
            let rockLink = document.createElement('a');
            rockLink.textContent = "Rock";
            rockLink.className = 'rps-selection';
            rockLink.id = 'rock';
            rockLink.setAttribute('href', 'javascript:;');

            let paperLink = document.createElement('a');
            paperLink.textContent = "Paper";
            paperLink.className = 'rps-selection';
            paperLink.id = 'paper';
            paperLink.setAttribute('href', 'javascript:;');

            let scissorsLink = document.createElement('a');
            scissorsLink.textContent = "Scissors";
            scissorsLink.className = 'rps-selection';
            scissorsLink.id = 'scissors';
            scissorsLink.setAttribute('href', 'javascript:;');

            let newDiv = document.getElementById('selection');
            newDiv.appendChild(rockLink);
            newDiv.appendChild(paperLink);
            newDiv.appendChild(scissorsLink);
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
                document.getElementById('player1-pick').textContent = this.id;
            }));
            } else {
                invalidText.textContent = 'The password is invalid';
                invalidText.style.color = 'red';
            };
            
        } else {
                invalidText.textContent = 'The username is invalid';
                invalidText.style.color = 'red';
        };
        
        
    });
}

function signIn() {
    signInValidation();
}

function logOut() {
    online = false;
    searching = false;
    console.log(username, password);
    database.ref('/gamechannel/'+username).set({
        searching,
        online,
        totalCount,
        winCount,
        lostCount,
        drawCount
    });
    document.getElementsByClassName('sign-in').forEach(element => element.style.display = "block");
    document.getElementsByClassName('result').forEach(element => element.style.display = "none");
    document.getElementsByClassName('user-container').forEach(element => element.style.display = "none");
}

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
    document.querySelectorAll('.sign-in').forEach(element => element.style.display = "none");
    document.querySelectorAll('.sign-in').forEach(element => element.style.display = "none");
    document.querySelectorAll('.result').forEach(element => element.style.display = "block");
    document.querySelectorAll('.user-container').forEach(element => element.style.display = "block");

}

function findingUser2(onlinePlayers) {
    if(onlinePlayers.filter(name => name !== username).length !== 0){
        user2name = onlinePlayers.filter(name => name !== username)[0];
        console.log("user2name",user2name);
        document.getElementById('player2-name').textContent = user2name;
        searching = false;
        database.ref('/gamechannel/'+username).set({
            online,
            searching,
            totalCount,
            winCount,
            lostCount,
            drawCount
        });
    } else {
        document.getElementById('player2-name').textContent = 'Waiting for other players';
    }
}






function resultFunc(result) {
    switch(result) {
        case 'win':
            document.getElementById('result').textContent = 'You Win';
            winCount++;
            totalCount++;
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
            document.getElementById('result').textContent = 'You draw';
            drawCount++;
            totalCount++;
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
            document.getElementById('result').textContent = 'You Lost';
            lostCount++;
            totalCount++;
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
        document.getElementById('player1-pick').textContent = '';
        document.getElementById('player2-pick').textContent = '';
    },5000);
}

database.ref('/gamechannel/').on("value", (snapshot) => {
    if(user2name && snapshot.val()[user2name].hasOwnProperty("pick") && snapshot.val()[username].hasOwnProperty("pick")){
        let pick1 = snapshot.val()[username].pick;
        let pick2 = snapshot.val()[user2name].pick;
        if(pick1 && pick2) {
            document.getElementById('player1-pick').textContent = pick1;
            document.getElementById('player2-pick').textContent = pick2;
        }
        
        if(pick1 === 'rock') {
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
    
});

signInBtn.addEventListener("click", function(e) {
    e.preventDefault();
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
});

logOutBtn.addEventListener('click',logOut);





