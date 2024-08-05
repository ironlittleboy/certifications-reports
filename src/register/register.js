import { Toast } from "../utils/toast";
import { emailValidation, passwordValidation, usernameValidation } from "../utils/validations";

document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const usuario = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (confirmPassword !== password) {
    Toast.fire({
      icon: "error",
      title: "Passwords do not match",
    });
    return;
  }
  // validate email and password just for register
  if (emailValidation(email)) {
    Toast.fire({
      icon: "error",
      title: "Invalid email",
    });
    return;
  }

  if (passwordValidation(password)) {
    e.preventDefault();
    Toast.fire({
      icon: "error",
      title: "Invalid password",
    });
    return;
  }

  if (usernameValidation(username)) {
    e.preventDefault();
    Toast.fire({
      icon: "error",
      title: "Invalid username",
    });
    return;
  }

  fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, password, email })
  })
    .then(response => response.json())
    .then(response => {
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: response.message,
        });
      } else {
        Toast.fire({
          icon: "error",
          title: response.message,
        });
      }
    });
});