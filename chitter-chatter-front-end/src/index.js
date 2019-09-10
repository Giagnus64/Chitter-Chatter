// DOM vars
const loginFormDiv = document.querySelector(".user-login-form-div-css");
const editFormDiv = document.querySelector(".user-edit-form-div-css");
const usernameDisplay = document.querySelector(".username-message-form");
const currentUserImage = document.querySelector("#current-user-image");
const loginFormName = document.querySelector("#login-username-input")
const loginForm = document.querySelector(".login-form-js");
// Event Listeners
const registerForm = document.querySelector(".register-form")
const registerFormName = document.querySelector("#register-username-input")
const registerFormImage = document.querySelector("#register-icon-input")

loginForm.addEventListener('submit', handleLogin)
registerForm.addEventListener('submit', handleRegister)

// Functions

function handleLogin(event){
    event.preventDefault();
    const usernameEntered = loginFormName.value 
    if (usernameEntered === ""){
        alert("Username cannot be empty")
        return true 
    }
    fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(data => {
        const userObj = data.find(e=>{return e.username === usernameEntered})
        if (userObj){assignUsername(userObj)}
        else {alert("Username does not exist")}
    })
    .then(e => hideForm(loginFormDiv))
}

function handleRegister(event){
    event.preventDefault();
    const usernameEntered = registerFormName.value
    if (usernameEntered === "") {
        alert("Username cannot be empty")
        return true
    }
    fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(data=>{
        const userObj = data.find(e => { return e.username === usernameEntered })
        if (userObj){alert("Username already taken")}
        else {PostUserToDatabase(usernameEntered, registerFormImage.value)} 
    })   
}

function postUserToDatabase(username, image){
    let defaultUrl = "https://www.writeups.org/wp-content/uploads/Harry-Potter-Philosopher-Stone-era.jpg"
    let imageUrl = (image === "") ? defaultUrl : image
    fetch("http://localhost:3000/users", {
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

function displayForm(){
    loginFormDiv.classList.add("display-modal");
    loginFormDiv.classList.remove("form-hidden");
    //editForm.classList.add("display-modal");
}

function hideForm(form){
    form.classList.add("form-none")
}

displayForm();