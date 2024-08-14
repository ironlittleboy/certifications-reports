import { Toast } from "../utils/toast";

document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("tbody-table");
  try {
    tableBody.innerHTML = `
     <tr>
      <td colspan="10">
        <div class='card-empty-list'>

          <span class='loader'></span>
        </div>
      </td>
      </tr>
    `;
    const userReq = await fetch("http://localhost:3000/auth/users");
    const userRes = await userReq.json();
    const users = userRes.data;
    console.log(users);
    if (users.length > 0) {
      tableBody.innerHTML = "";
      users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.Id_login}</td>
          <td>${user.usuario}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            <div class='flex-box'>
              <button class="btn btn-to-admin" data-id=${user.Id_login}>Hacer administrador</button>
              <button class="btn-danger btn-to-revoke-admin" data-id=${user.Id_login}>Revocar adminitrador</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
        document.querySelectorAll(".btn-to-admin").forEach((button) => {
          button.addEventListener("click", (event) => {
            makeAdmin(event.target.dataset.id);
          });
        });
        document.querySelectorAll(".btn-to-revoke-admin").forEach((button) => {
          button.addEventListener("click", (event) => {
            revokeAdmin(event.target.dataset.id);
          });
        });
      });
    } else {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class='card-empty-list'>
              <span class='loader'></span>
            </div>
          </td>
        </tr>
      `;
    }
  } catch (error) {
    console.log(error);
  }
});

async function makeAdmin(id) {
  try {
    const req = await fetch(`http://localhost:3000/auth/make-admin/${id}`, {
      method: "PUT",
    });
    const res = await req.json();
    // console.log(res);
    if (res.status) {
      Toast.fire({
        icon: "success",
        title: "Usuario ahora es administrador",
      }).then(() => {
        location.reload();
      });
    }
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Error al hacer administrador",
    });
  }
}

async function revokeAdmin(id) {
  try {
    const req = await fetch(`http://localhost:3000/auth/revoke-admin/${id}`,{
      method: "PUT"
    });
    const res = await req.json();
    // console.log(res);
    if (res.status) {
      Toast.fire({
        icon: "success",
        title: "Administrador revocado",
      }).then(() => {
        location.reload();
      });
    }
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Error al revocar administrador",
    });
  }
}


document.getElementById("close-session-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "http://localhost:5173/src/index.html";
});