//alert("I changed this!!");

// fetch("http://localhost:3000/users")
// .then(res => res.json())
// .then(alert);

const loginForm = document.querySelector(".user-login-form");
const editForm = document.querySelector(".user-edit-form");
loginForm.classList.add("display-modal");
loginForm.classList.remove("form-hidden");
//editForm.classList.add("display-modal");