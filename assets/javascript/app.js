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
let username;
let searching = false;
let online = false;
let onlinePlayers = [];
let user2name;
let usernameArr = [];
let passwordArr = [];


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
    if(newPassword === confirmPassword) {
        database.ref('/userdata').push({
            username: newUsername,
            password: newPassword
        });
        document.getElementById('invalid-text').remove();
    } else {
        let invalidText = document.createElement('p');
        invalidText.textContent = 'The passwords are not the same. Please type again.';
        invalidText.style.color = 'red';
        invalidText.id = 'invalid-text';
        document.getElementById('new-acc').append(invalidText);
    }
}

function gettingData(usernameArr, passwordArr) {
    let numberOfUser;
    database.ref('/userdata').on("value", (snapshot) => {
        numberOfUser = Object.keys(snapshot.val()).length;
        console.log(numberOfUser);
    });
    database.ref('/userdata').on("child_added", (snapshot) => {
        let {username, password} = snapshot.val();   
        usernameArr.push(username);
        passwordArr.push(password);
    });
}

function signInValidation(usernameArr, passwordArr) {
    let signInUsername = usernameInput.value;
    if(usernameArr.includes(signInUsername)) {
        let index = usernameArr.indexOf(signInUsername);
        if(passwordInput.value = passwordArr[index]){
            username = signInUsername;
            online = true;
            database.ref('/gamechannel/'+username).set({
                online,
                searching
            });
            document.getElementById('invalid-text').remove();
        } else {
            let passwordInvalid = document.createElement('p');
            passwordInvalid.textContent = 'The password is invalid';
            passwordInvalid.style.color = 'red';
            passwordInvalid.id = 'invalid-text';
            passwordInputDiv.appendChild(passwordInvalid);
        };
    } else {
        let usernameInvalid = document.createElement('p');
        usernameInvalid.textContent = 'The username is invalid';
        usernameInvalid.style.color = 'red';
        usernameInvalid.id = 'invalid-text';
        usernameInputDiv.appendChild(usernameInvalid);
    };
    console.log(usernameArr);
    usernameArr = [];
    console.log(usernameArr);
    passwordArr = [];
}

function signIn() {
    gettingData(usernameArr, passwordArr);
    signInValidation(usernameArr, passwordArr);
    // showUser1Div();
}

function logOut() {
    online = false;
    searching = false;
    console.log(username, password);
    database.ref('/gamechannel/'+username).set({
        searching,
        online
    });
}

function searchingOtherPlayer(username) {
    searching = true;
    database.ref('/gamechannel/'+username).set({
        online,
        searching
    });
}

function findingUser2(onlinePlayers) {
    console.log(username);
    if(onlinePlayers.filter(name => name !== username).length !== 0){
        user2name = onlinePlayers.filter(name => name !== username)[0];
        console.log("user2name",user2name);
        document.getElementById('player2-name').textContent = user2name;
        searching = false;
        database.ref('/gamechannel/'+username).set({
            online,
            searching
        });
    } else {
        document.getElementById('player2-name').textContent = 'Waiting for other players';
    }
}


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
            console.log(key, snapshot.val()[key].searching);
            if(snapshot.val()[key].searching === true && !onlinePlayers.includes(key)) {
                onlinePlayers.push(key);
                console.log(onlinePlayers);
                findingUser2(onlinePlayers);
            };
        } ;
    });
});



function resultFunc(result) {
    switch(result) {
        case 'win':
            console.log('You win!!!');
            database.ref('/gamechannel/'+username).set({
                online,
                searching
            });
            break;
        case 'draw':
            console.log('It is a draw!!!');
            database.ref('/gamechannel/'+username).set({
                online,
                searching
            });
            break;
        case 'lost':
            console.log('You lost!!!');
            database.ref('/gamechannel/'+username).set({
                online,
                searching
            });
            break;                        
    }
    database.ref('/gamechannel/' + username).set({
        online,
        searching,
        pick: ''
    })
    
}

database.ref('/gamechannel/').on("value", (snapshot) => {
    if(user2name && snapshot.val()[user2name].hasOwnProperty("pick") && snapshot.val()[username].hasOwnProperty("pick")){
        let pick1 = snapshot.val()[username].pick;
        let pick2 = snapshot.val()[user2name].pick;
        console.log(pick1, pick2)
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

logOutBtn.addEventListener('click',logOut);
let selection = document.querySelectorAll('.rps-selection');
selection.forEach(select => select.addEventListener('click', function() {
    database.ref('/gamechannel/'+username).set({
        online,
        searching,
        pick: this.id
    });;
}));




