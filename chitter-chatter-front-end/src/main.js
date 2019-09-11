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

//User-Container-Vars
const userContainer = document.querySelector("#user-container-js")

//RegisterForm
const registerForm = document.querySelector(".register-form")
const registerFormName = document.querySelector("#register-username-input")
const registerFormImage = document.querySelector("#register-icon-input")

//chatbox vars
const chattingWith = document.querySelector("#chatting-with-js");
const chatBoxMessages = document.querySelector("#chat-messages-js");
const chatBox = document.querySelector(".chat-box-js");

//message form vars
const usernameDisplay = document.querySelector(".username-message-form");
const currentUserImage = document.querySelector("#current-user-image");
const messageForm = document.querySelector("#message-form-js");
const messageInput = document.querySelector("#message-input-js");


//Other Vars
const usersUrl = "http://localhost:3000/users";
const messagesUrl = "http://localhost:3000/messages";
const defaultUrl = "https://www.writeups.org/wp-content/uploads/Harry-Potter-Philosopher-Stone-era.jpg"

//Event Listeners
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
userContainer.addEventListener("click", createChat);
messageForm.addEventListener('submit', handleMessage);
editUserBtn.addEventListener('click', handleEdit);
editForm.addEventListener('submit', editUser);


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
            sender_id: chattingWith.dataset.userId,
            reciever_id: usernameDisplay.dataset.currentUserId
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
        const chattingUser = event.target.dataset.userId
        addIconToChat(event);
        getMessages(chattingUser);
    }
}

function addIconToChat(event){
    if (event.target.classList.contains("user-card-div")){
        let copy = event.target.outerHTML;
        chattingWith.innerHTML = copy;
        chattingWith.dataset.userId = event.target.dataset.userId
    }
    else {
        let copy = event.target.parentElement.outerHTML;
        chattingWith.innerHTML = copy;
        chattingWith.dataset.userId = event.target.dataset.userId
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
    return msgArray.sort((a, b) => a.created_at - b.created_at);
}

function handleMessages(chattingUserId, sentMessages, recievedMessages){
    const sent = filterSentMessages(chattingUserId, sentMessages);
    const recieved = filterRecievedMessages(chattingUserId, recievedMessages);
    const msgArray = [...sent, ...recieved];
    const sorted = sortMessages(msgArray);
    return sorted; 
}


function addAllMessagesToChat(data, currentUserId){
    chatBoxMessages.innerHTML = "";
    data.forEach(function(message){
        if (message.sender_id === currentUserId){
            addSentMessageToChat(message)
        }
        else{
            addRecievedMessageToChat(message)
        }
    });

}

function addSentMessageToChat(message) {
    chatBoxMessages.innerHTML += `<div class="message-card message-card-sent">
    <p data-message-id=${message.id} class="message">${message.content}</p>
    <button data-message-id=${message.id} class="replay-message-button">Replay</button>
    </div>` 
}

function addRecievedMessageToChat(message) {
    chatBoxMessages.innerHTML += `<div class="message-card message-card-recieved">
    <p data-message-id=${message.id} class="message">${message.content}</p>
    <button data-message-id=${message.id} class="replay-message-button">Replay</button>
    </div>` 
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
        else {postUserToDatabase(usernameEntered, registerFormImage.value)} 
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
    chattingWith.innerHTML = "";
    chatBoxMessages.innerHTML = "";
    form.classList.remove("form-none");
    form.classList.add("display-modal");
}

function hideForm(form){
    form.classList.remove("display-modal");
    form.classList.add("form-none");
}

function handleEdit(event){
    const currUser = usernameDisplay.dataset.currentUserId
    displayForm(editFormDiv);
    fillEditForm();
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

displayForm(loginFormDiv);
