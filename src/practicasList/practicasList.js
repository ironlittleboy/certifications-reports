import { Toast } from "../utils/toast.js";

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
    const studentsReq = await fetch(
      "http://localhost:3000/api/estudiante/all-students"
    );
    const studentsRes = await studentsReq.json();
    const students = studentsRes.data;
    // console.log(students);
    if (students.length > 0) {
      tableBody.innerHTML = "";
      students.forEach((student) => {
        const tr = document.createElement("tr");
        if (student.certificado_practicas === 1) {
          tr.className = "completed";
        }
        if (student.certificado_practicas === 0) {
          tr.className = "incomplete";
        }
        tr.innerHTML = `
          <td>${student.Id_estudiante}</td>
          <td>${student.Nombres}</td>
          <td>${student.Cedula}</td>
          <td>${student.Carrera}</td>
          <td>${student.Email}</td>
          <td>${student.Nombre_semestre}</td>
          <td>${student.Nombre_periodo}</td>
          <td>${student.CodigoMatricula}</td>
          <td>${
            student.certificado_practicas === 1 ? "Terminado" : "No terminado"
          }</td>
          <td>
            <div class='flex-box'>
              <button class="btn btn-to-certificates" data-id=${student.Id_estudiante}>Certificados</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
        document.querySelectorAll(".btn-to-certificates").forEach((button) => {
          button.addEventListener("click", (event) => {
            handleCertifications(event.target.dataset.id);
          });
        });
      });
    } else {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class='card-empty-list'>
              <h2>No hay estudiantes registrados</h2>
              <p>Registra estudiantes para que aparezcan aquí</p>
              <button id="create-student-button" class='btn'>Registrar estudiante</button>
            </div>
          </td>
        </tr>
      `;
      document
        .getElementById("create-student-button")
        .addEventListener("click", createStudent);
    }
  } catch (error) {
    tableBody.innerHTML = `
    <tr>
      <td colspan='9'>
        <div class='card-empty-list'>
          <h2>Error al cargar datos</h2>
          <p>Intente recargar la página</p>
        </div>
      </td>
    </tr>
  `;
    console.error(error);
    Toast.fire({
      icon: "error",
      title: "Error al cargar datos",
    });
  }
});


document.getElementById("practica-filter").addEventListener("change", async (event) => {
  const tableBody = document.getElementById("tbody-table");
  const filter = event.target.value;
  // console.log(filter);
  try {
    const studentsReqByFilter = await fetch(
      `http://localhost:3000/api/estudiante/student-by-practica/${filter}`
    );
    const studentsResByFilter = await studentsReqByFilter.json();
    // console.log(studentsResByFilter);
    tableBody.innerHTML = "";
    const students = studentsResByFilter.data;
    students.forEach((student) => {
      const tr = document.createElement("tr");
      if (student.certificado_practicas === 1) {
        tr.className = "completed";
      }
      if (student.certificado_practicas === 0) {
        tr.className = "incomplete";
      }
      tr.innerHTML = `
        <td>${student.Id_estudiante}</td>
        <td>${student.Nombres}</td>
        <td>${student.Cedula}</td>
        <td>${student.Carrera}</td>
        <td>${student.Email}</td>
        <td>${student.Nombre_semestre}</td>
        <td>${student.Nombre_periodo}</td>
        <td>${student.CodigoMatricula}</td>
        <td>${
          student.certificado_practicas === 1 ? "Terminado" : "No terminado"
        }</td>
        <td>
          <div class='flex-box'>
            <button class="btn btn-to-certificates" data-id=${student.Id_estudiante}>Certificados</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
      document.querySelectorAll(".btn-to-certificates").forEach((button) => {
        button.addEventListener("click", (event) => {
          handleCertifications(event.target.dataset.id);
        });
      });

    });
  } catch (error) {
    console.error(error);
    Toast.fire({
      icon: "error",
      title: "Error al cargar datos",
    });
  }
});


function createStudent() {
  window.location.href = "http://localhost:5173/src/createForm/createForm.html";
}

function handleCertifications (id) {
  window.location.href = `http://localhost:5173/src/certificates/certificates.html?id=${id}`;
}

document.getElementById("close-session-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "http://localhost:5173/src/index.html";
});
