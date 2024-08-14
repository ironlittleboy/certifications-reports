import { Toast } from "../utils/toast.js";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "../utils/validations.js";

document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const usuario = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    if (confirmPassword !== password) {
      Toast.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
      });
      return;
    }
    // validate email and password just for register
    if (emailValidation(email)) {
      Toast.fire({
        icon: "error",
        title: "Correo inválido",
      });
      return;
    }

    if (passwordValidation(password)) {
      e.preventDefault();
      Toast.fire({
        icon: "error",
        title: "Contraseña inválida, debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un caracter especial",
      });
      return;
    }

    if (usernameValidation(username)) {
      e.preventDefault();
      Toast.fire({
        icon: "error",
        title: "Nombre de usuario inválido, debe tener al menos 6 caracteres",
      });
      return;
    }

    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, password, email, role: "user" }),
    })
      .then((response) => response.json())
      .then((response) => {
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
