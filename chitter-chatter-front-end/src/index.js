// DOM vars
//Login/Edit/Register Vars
const loginFormDiv = document.querySelector(".user-login-form-div-css");
const editFormDiv = document.querySelector(".user-edit-form-div-css");
const loginFormName = document.querySelector("#login-username-input")
const loginForm = document.querySelector(".login-form-js");

//User-Container-Vars
const userContainer = document.querySelector("#user-container-js")

//RegisterForm
const registerForm = document.querySelector(".register-form")
const registerFormName = document.querySelector("#register-username-input")
const registerFormImage = document.querySelector("#register-icon-input")

//chatbox vars
const chattingWith = document.querySelector("#chatting-with-js")
const chatBoxMessages = document.querySelector("#chat-messages-js")

//message form vars
const usernameDisplay = document.querySelector(".username-message-form");
const currentUserImage = document.querySelector("#current-user-image");
const messageForm = document.querySelector("#message-form-js");
const messageInput = document.querySelector("#message-input-js")
let currentInterval


//Other Vars
const usersUrl = "http://localhost:3000/users";
const messagesUrl = "http://localhost:3000/messages"

//Event Listeners
loginForm.addEventListener('submit', handleLogin)
registerForm.addEventListener('submit', handleRegister)
userContainer.addEventListener("click", createChat)
messageForm.addEventListener('submit', handleMessage)

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
        addSentMessageToChat(data)
      });
}

//chat functions
function createChat(event){
    if (event.target.classList.contains("user-card-js")){
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
      chattingWith.innerHTML = `<div data-user-id=${userId} class="user-card user-card-js user-card-div">
      <img data-user-id=${userId} class="user-card-icon user-card-js" src="${icon}">
      <p data-user-id=${userId} class="user-card-username user-card-js">${name}</p>
      </div>`
    }
    else {
      const icon = event.target.parentElement.children[0].src
      const name = event.target.parentElement.children[1].innerText
      const userId = event.target.dataset.userId
      chattingWith.dataset.userId = userId
      chattingWith.innerHTML = `<div data-user-id=${userId} class="user-card user-card-js user-card-div">
      <img data-user-id=${userId} class="user-card-icon user-card-js" src="${icon}">
      <p data-user-id=${userId} class="user-card-username user-card-js">${name}</p>
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
        if (message.sender_id === currentUserId){
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
        if (userObj){assignUsername(userObj)}
        else {alert("Username does not exist")}
    })
    .then(e => {
        hideForm(loginFormDiv)
        getUsers();
    })
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
}

function postUserToDatabase(username, image){
    let defaultUrl = "https://www.writeups.org/wp-content/uploads/Harry-Potter-Philosopher-Stone-era.jpg"
    let imageUrl = (image === "") ? defaultUrl : image
    fetch(usersUrl, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({username: username, icon_url: imageUrl})
    })
    .then(resp => resp.json())
    .then(data => assignUsername(data))
    .then(e => hideForm(loginFormDiv))
}

function assignUsername(userObj){
  usernameDisplay.dataset.currentUserId = userObj.id
  currentUserImage.src = userObj.icon_url
  usernameDisplay.innerText = userObj.username
}

function displayForm(form){
    form.classList.remove("form-none");
    form.classList.add("display-modal");
}

function hideForm(form){
    form.classList.add("form-none");
    form.classList.remove("display-modal");
}

displayForm(loginFormDiv);

// ## bottom two functions should be called every second

function countMessagesAndAlert(){
    let chattingUserId = parseInt(document.querySelector("#chatting-with-js").dataset.userId)
    const currentUserId = usernameDisplay.dataset.currentUserId
    fetch(usersUrl + `/${currentUserId}`)
    .then(res => res.json())
    .then(data => {
        const sorted = handleMessages(chattingUserId, data.sent_messages, data.recieved_messages)
        let updatedCount = sorted.length
        let pageCount = document.querySelector(".chat-messages-css").children.length
        if (updatedCount>pageCount){
          let icon = document.querySelector("#user-container-js").querySelector(`[data-user-id='${chattingUserId}']`)
          icon.classList.add("animated", "infinite", "bounce");
        }
    })
}

document.querySelector("#alert").addEventListener("click", e => {
  countMessagesAndAlert()
})
