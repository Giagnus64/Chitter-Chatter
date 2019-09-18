import { Howl, Howler } from 'howler';

// DOM vars
//Login/Edit/Register Vars
const loginFormDiv = document.querySelector(".user-login-form-div-css");
const editFormDiv = document.querySelector(".user-edit-form-div-css");
const editFormUsername = document.querySelector("#edit-form-username");
const editFormIcon = document.querySelector("#edit-form-icon");
const loginFormName = document.querySelector("#login-username-input")
const loginForm = document.querySelector(".login-form-js");
const editForm = document.querySelector("#edit-form-js");

//User Button Vars
const editUserBtn = document.querySelector(".edit-user-button");
const deleteUserBtn = document.querySelector(".delete-user-button");
const logoutBtn = document.querySelector(".logout-button");
const silenceBtn = document.querySelector("#stop-all");

//User-Container-Vars
const userContainer = document.querySelector("#user-container-js")

//RegisterForm
const registerForm = document.querySelector(".register-form")
const registerFormIconDiv = document.querySelector(".icon-form-register")
const registerFormName = document.querySelector("#register-username-input")

//chatbox vars
const chattingWith = document.querySelector("#chatting-with-js");
const chatBoxMessages = document.querySelector("#chat-messages-js");
const chatBox = document.querySelector(".chat-box-js");

//message form vars
const usernameDisplay = document.querySelector(".username-message-form");
const currentUserImage = document.querySelector("#current-user-image");
const messageForm = document.querySelector("#message-form-js");
const messageInput = document.querySelector("#message-input-js")
// other vars
let currentInterval
let animFunc
let codePosition1 = 0;
let codePosition2 = 0;
let muted = false;


//URLVars
const usersUrl = "https://chitter-chatter-api.herokuapp.com/users";
const messagesUrl = "https://chitter-chatter-api.herokuapp.com/messages";
const defaultUrl = "https://www.writeups.org/wp-content/uploads/Harry-Potter-Philosopher-Stone-era.jpg"

//Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
userContainer.addEventListener("click", createChat);
messageForm.addEventListener('submit', handleMessage);
editUserBtn.addEventListener('click', handleEdit);
editForm.addEventListener('submit', editUser);
deleteUserBtn.addEventListener('click', deleteUser);
logoutBtn.addEventListener('click', logoutUser);
chatBoxMessages.addEventListener('click', handleReplay);
silenceBtn.addEventListener('click', silenceSounds);

// Functions
//message form functions
function handleMessage(event){
    event.preventDefault();
    // check if the user is chatting with someone
    if(chattingWith.textContent !== "" && messageInput.value !== ""){
       sendMessage();
    }
    else{
        alert("Please select a user first!")
    }

}

function sendMessage(){
    fetch(messagesUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            content: messageInput.value,
            sender_id: usernameDisplay.dataset.currentUserId,
            reciever_id: chattingWith.dataset.userId
        })
    })
    .then(res => res.json())
    .then(data => {
        messageForm.reset();
        addSentMessageToChat(data)})
    .catch(err => alert(err));
}

//chat functions
function createChat(event){
    if (event.target.classList.contains("user-card-js")){
        hideForm(editFormDiv);
        const chattingUser = event.target.dataset.userId
        addIconToChat(event);
        getMessages(chattingUser);
    }
    if (event.target.classList.contains("animated")){
      document.querySelector("#user-container-js").querySelector(`[data-user-id='${event.target.dataset.userId}']`).classList.remove("animated", "infinite", "bounce")
    }
}

function addIconToChat(event){
    if (event.target.classList.contains("user-card-div")){
      const icon = event.target.children[0].src
      const name = event.target.children[1].innerText
      const userId = event.target.dataset.userId
      chattingWith.dataset.userId = userId
      chattingWith.innerHTML = `<div data-user-id=${userId} class="user-card user-card-js user-card-div" id="user-card-chatting-with">
      <img data-user-id=${userId} class="user-card-icon user-card-js" src="${icon}">
      <p data-user-id=${userId} class="user-card-username user-card-js">${name}</p>
      </div>`
    }
    else {
      const icon = event.target.parentElement.children[0].src
      const name = event.target.parentElement.children[1].innerText
      const userId = event.target.dataset.userId
      chattingWith.dataset.userId = userId
      chattingWith.innerHTML = `<div data-user-id=${userId} class="user-card user-card-js user-card-div" id="user-card-chatting-with">
      <img data-user-id=${userId} class="user-card-icon user-card-js" src="${icon}">
      <p data-user-id=${userId} class="user-card-username user-card-js animated infinite pulse">${name}</p>
      </div>`
    }
}

function getMessages(chattingUserId){
    const currentUserId = usernameDisplay.dataset.currentUserId
    console.log(chattingUserId)
    fetch(usersUrl + `/${currentUserId}`)
    .then(res => res.json())
    .then(data => {
        const sorted = handleMessages(chattingUserId, data.sent_messages, data.recieved_messages)
        addAllMessagesToChat(sorted, currentUserId);
    })
    .catch(err => alert(err));
}

function filterSentMessages(chattingUserId, msgArray){
    return msgArray.filter(function(message){
        return message.reciever_id === parseInt(chattingUserId)
    })
}

function filterRecievedMessages(chattingUserId, msgArray){
    return msgArray.filter(function(message){
        return message.sender_id === parseInt(chattingUserId)
    })
}

function sortMessages(msgArray){
    function convertToUnix(x){
	     return parseInt((new Date(x).getTime() / 1000).toFixed(0))
    }
    return msgArray.sort((a, b) => convertToUnix(a.created_at) - convertToUnix(b.created_at));
}

function handleMessages(chattingUserId, sentMessages, recievedMessages){
    const sent = filterSentMessages(chattingUserId, sentMessages);
    const recieved = filterRecievedMessages(chattingUserId, recievedMessages);
    const msgArray = [...sent, ...recieved];
    const sorted = sortMessages(msgArray);
    return sorted;
}


function addAllMessagesToChat(data, currentUserId){
    if (currentInterval){clearInterval(currentInterval)}
    chatBoxMessages.innerHTML = "";
    data.forEach(function(message){
        
        if (message.sender_id === parseInt(currentUserId)){
            addSentMessageToChat(message)
        }
        else{
            addRecievedMessageToChat(message)
        }
    });
    // Set Interval
    currentInterval = setInterval(countMessagesAndAlert, 1000);
}

function addSentMessageToChat(message) {
    chatBoxMessages.innerHTML += `<div class="message-card message-card-sent-css">
    <p data-message-id=${message.id} class="message">${message.content}</p>
    <button data-message-id=${message.id} class="replay-message-button replay-message-button-js">Replay</button>
    </div>`
}

function addRecievedMessageToChat(message) {
    chatBoxMessages.innerHTML += `<div class="message-card message-card-recieved-css">
    <p data-message-id=${message.id} class="message">${message.content}</p>
    <button data-message-id=${message.id} class="replay-message-button replay-message-button-js">Replay</button>
    </div>`
}

function handleReplay(event){
    if(event.target.classList.contains('replay-message-button-js')){
        const msg = event.target.previousElementSibling.textContent;
        const msgArr = msg.split("");
        msgArr.forEach(function(letter, index){
        setTimeout(function(){
        triggerKey(letter)}, 250*index);
        })
    }
}

// Generate User Icons

function generateUserIcons(data){
    userContainer.innerHTML = "";
    data.forEach(user =>{
        userContainer.innerHTML += `<div data-user-id=${user.id} class="user-card user-card-js user-card-div">
    <img data-user-id=${user.id} class="user-card-icon user-card-js" src="${user.icon_url}">
    <p data-user-id=${user.id} class="user-card-username user-card-js">${user.username}</p>
        </div>`
    })

}

function getUsers(){
    fetch(usersUrl)
    .then(res => res.json())
    .then(data => generateUserIcons(data))
    .catch(err => alert(err));
}



//Login/Register Users & Forms
function addSelectToRegister(){
    const select = document.createElement("select")
    select.id = "register-icon-input"
    const arrayOfIcons = {
        "harry": defaultUrl,
        "hermione":"https://data.junkee.com/wp-content/uploads/2018/03/hermione.jpg",
        "ron":"https://media.thetab.com/blogs.dir/27/files/2013/03/Ron-weasley.jpg"
    }
    for (let name in arrayOfIcons){
        document.createElement("option")
        select.innerHTML += `<option value=${arrayOfIcons[name]}>${name}</option>`
    }
    registerFormIconDiv.appendChild(select)
}

addSelectToRegister()

function handleLogin(event){
    event.preventDefault();
    const usernameEntered = loginFormName.value
    if (usernameEntered === ""){
        alert("Username cannot be empty")
        return true
    }
    fetch(usersUrl)
    .then(res => res.json())
    .then(data => {
        const userObj = data.find(e=>{return e.username === usernameEntered})
        if (userObj){
            assignUsername(userObj);
            afterLogin();
        }
        else {
            alert("Username does not exist");
        }
    })
    .catch(err => alert(err));
}

function handleRegister(event){
    event.preventDefault();
    const usernameEntered = registerFormName.value
    if (usernameEntered === "") {
        alert("Username cannot be empty")
        return true
    }
    fetch(usersUrl)
    .then(res => res.json())
    .then(data=>{
        const userObj = data.find(e => { return e.username === usernameEntered })
        if (userObj){alert("Username already taken")}
        else {
            const registerFormImage = document.querySelector("#register-icon-input")
            postUserToDatabase(usernameEntered, registerFormImage.value)} 
    })   
    .catch(err => alert(err));
}

function postUserToDatabase(username, image){
    let imageUrl = (image === "") ? defaultUrl : image
    fetch(usersUrl, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({username: username, icon_url: imageUrl})
    })
    .then(resp => resp.json())
    .then(data => assignUsername(data))
    .then(e => {afterLogin()})
    .catch(err => alert(err));
}

function afterLogin(){
    hideForm(loginFormDiv);
    getUsers();  
}

function assignUsername(userObj){
  usernameDisplay.dataset.currentUserId = userObj.id
  currentUserImage.src = userObj.icon_url
  usernameDisplay.innerText = userObj.username + ":"
}

function displayForm(form){
    resetForms();
    chattingWith.innerHTML = "";
    chatBoxMessages.innerHTML = "";
    form.classList.remove("form-none");
    setTimeout( e => form.classList.add("display-modal"), 200);
}

function hideForm(form){
    resetForms();
    form.classList.remove("display-modal");
    setTimeout((e) => form.classList.add("form-none"), 1500);
}

function handleEdit(event){
    const currUser = usernameDisplay.dataset.currentUserId
    if(currUser){
        displayForm(editFormDiv);
        fillEditForm();
    }
}

function fillEditForm(){
    const usernameColon = usernameDisplay.textContent;
    editFormUsername.value = usernameColon.substring(0, usernameColon.length - 1);
    editFormIcon.value = currentUserImage.src;
}

function editUser(e){
    e.preventDefault();
    const newUsername = editFormUsername.value
    const currUser = usernameDisplay.dataset.currentUserId
    const newIcon = editFormIcon.value
    let imageUrl = (newIcon === "") ? defaultUrl : newIcon
     if(newUsername === ""){
        alert("Username cannot be blank!");
        return true;
     } else{
         sendEditToDb(currUser, newUsername, newIcon);
    }
}

function sendEditToDb(currUser, newUsername, newIcon){
    fetch(usersUrl + `/${currUser}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            username: newUsername,
            icon_url: newIcon
        })
    })
        .then(res => res.json())
        .then(data => {
            assignUsername(data);
            hideForm(editFormDiv);
            getUsers();
        })
        .catch(err => alert(err));
}

function deleteUser(){
    const currUser = usernameDisplay.dataset.currentUserId
    if(currUser){
        fetch(usersUrl + `/${currUser}`, {
            method: "DELETE"   
        })
        .then(res => res.json())
        .then(data =>{
            logoutUser();
        })
        .catch(err => alert(err));
    }
}
function logoutUser(){
    usernameDisplay.dataset.currentUserId = null;
    currentUserImage.src = defaultUrl
    usernameDisplay.innerText = "USER" + ":"
    userContainer.innerHTML = `<h1 class="title-heading animated infinite tada">Chitter-Chatter</h1>`;
    displayForm(loginFormDiv);
}
function resetForms(){
    loginForm.reset();
    editForm.reset();
    registerForm.reset();
}

// ## bottom two functions should be called every second

function countMessagesAndAlert() {
    let chattingUserId = parseInt(document.querySelector("#chatting-with-js").dataset.userId)
    const currentUserId = usernameDisplay.dataset.currentUserId
    fetch(usersUrl + `/${currentUserId}`)
        .then(res => res.json())
        .then(data => {
            const sorted = handleMessages(chattingUserId, data.sent_messages, data.recieved_messages)
            let updatedCount = sorted.length
            let pageCount = document.querySelector(".chat-messages-css").children.length
            if (updatedCount > pageCount) {
                let icon = document.querySelector("#user-container-js").querySelector(`[data-user-id='${chattingUserId}']`)
                icon.classList.add("animated", "infinite", "bounce");
            }
        })
}

//Sound and Animation functions

document.addEventListener('keydown', checkKey);

function checkKey(event) {
    checkLumosCode(event);
    checkPirateCode(event);
    if (keyData[event.key.toLowerCase()]) {
        keyData[event.key].sound.play();
        animFunc.makeCircle();
    }
}
function checkLumosCode(event){
    const code = ['l','u','m','o','s'];
    const keyPressed = event.key;
    const required = code[codePosition1]; 
    if(keyPressed == required){
        codePosition1++;
        if(codePosition1 == code.length){
            secretPirateCodeFunc();
            codePosition1 = 0;
        }
    } else{
        codePosition1 = 0;
    }
}
function checkPirateCode(event) {
    const code = ['a', 'v', 'a', 's', 't'];
    const keyPressed = event.key;
    const required = code[codePosition2];
    if (keyPressed == required) {
        codePosition2++;
        if (codePosition2 == code.length) {
            secretWizardCodeFunc();
            codePosition2 = 0;
        }
    } else {
        codePosition2 = 0;
    }
}

function secretWizardCodeFunc(){
   const wizardSound = new Howl({
       src: [require('./sounds/wizard.mp3')]
   })
   wizardSound.play();
}
function secretPirateCodeFunc(){
   const pirateSound = new Howl({
       src: [require('./sounds/pirate.mp3')]
   })
   pirateSound.play();
}


const keyData = {
    q: {
        sound: new Howl({
            src: [require('./sounds/bubbles.mp3')]
        })

    },
    w: {
        sound: new Howl({
            src: [require('./sounds/clay.mp3')]
        })

    },
    e: {
        sound: new Howl({
            src: [require('./sounds/confetti.mp3')]
        })

    },
    r: {
        sound: new Howl({
            src: [require('./sounds/corona.mp3')]
        })

    },
    t: {
        sound: new Howl({
            src: [require('./sounds/dotted-spiral.mp3')]
        })

    },
    y: {
        sound: new Howl({
            src: [require('./sounds/flash-1.mp3')]
        })

    },
    u: {
        sound: new Howl({
            src: [require('./sounds/flash-2.mp3')]
        })

    },
    i: {
        sound: new Howl({
            src: [require('./sounds/flash-3.mp3')]
        })

    },
    o: {
        sound: new Howl({
            src: [require('./sounds/glimmer.mp3')]
        })

    },
    p: {
        sound: new Howl({
            src: [require('./sounds/moon.mp3')]
        })

    },
    a: {
        sound: new Howl({
            src: [require('./sounds/pinwheel.mp3')]
        })

    },
    s: {
        sound: new Howl({
            src: [require('./sounds/piston-1.mp3')]
        })

    },
    d: {
        sound: new Howl({
            src: [require('./sounds/piston-2.mp3')]
        })

    },
    f: {
        sound: new Howl({
            src: [require('./sounds/prism-1.mp3')]
        })

    },
    g: {
        sound: new Howl({
            src: [require('./sounds/prism-2.mp3')]
        })

    },
    h: {
        sound: new Howl({
            src: [require('./sounds/prism-3.mp3')]
        })

    },
    j: {
        sound: new Howl({
            src: [require('./sounds/splits.mp3')]
        })

    },
    k: {
        sound: new Howl({
            src: [require('./sounds/squiggle.mp3')]
        })
    },
    l: {
        sound: new Howl({
            src: [require('./sounds/strike.mp3')]
        })

    },
    z: {
        sound: new Howl({
            src: [require('./sounds/suspension.mp3')]
        })

    },
    x: {
        sound: new Howl({
            src: [require('./sounds/timer.mp3')]
        })

    },
    c: {
        sound: new Howl({
            src: [require('./sounds/ufo.mp3')]
        })

    },
    v: {
        sound: new Howl({
            src: [require('./sounds/veil.mp3')]
        })

    },
    b: {
        sound: new Howl({
            src: [require('./sounds/wipe.mp3')]
        })

    },
    n: {
        sound: new Howl({
            src: [require('./sounds/zig-zag.mp3')]
        })

    },
    m: {
        sound: new Howl({
            src: [require('./sounds/moon.mp3')]
        })

    }
}
function triggerKey(key) {
    let event = new KeyboardEvent('keydown', {
        'key': key
    });
    document.dispatchEvent(event);
}
function silenceSounds(e){
    Howler._howls.forEach(howl => howl.stop())

    if(muted){
        Howler.mute(false);
        muted = false;
        e.target.innerText = "Silence"
    }else{
        Howler.mute(true);
        muted = true;
        e.target.innerText = "Unsilence"
    }
    
}
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function () {
        animFunc = window.myLib
    }, 500)
});

displayForm(loginFormDiv);