import { Toast } from "./src/utils/toast.js";
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const usuario = document.getElementById("username").value;
  const password = document.getElementById("password").value;


  await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario, password }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status) {
        // do something
        Toast.fire({
          icon: "success",
          title: response.message,
        }).then(() => {
          localStorage.setItem("token", response.data.token);
          // console.log(response);
          window.location.href = "http://localhost:5173/src/dashboard/dashboard.html";
        });
      } else {
        Toast.fire({
          icon: "error",
          title: response.message,
        });
      }
    }).catch((error) => {
      console.error("Error:", error);
      Toast.fire({
        icon: "error",
        title: "Error interno del servidor",
      });
    });
});
