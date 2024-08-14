import { Toast } from "../utils/toast.js";
const tableBody = document.querySelector("#tbody-table");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class='card-empty-list'>
            <span class="loader"></span>
          </div>
        </td>
      </tr>
    `;
    const response = await fetch(
      "http://localhost:3000/api/estudiante/all-students"
    );
    const res = await response.json();
    const students = res.data;
    // console.log(res);
    if (students.length > 0) {
      tableBody.innerHTML = "";
      students.forEach((student) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${student.Id_estudiante}</td>
        <td>${student.Nombres}</td>
        <td>${student.Cedula}</td>
        <td>${student.Carrera}</td>
        <td>${student.Email}</td>
        <td>${student.Nombre_semestre}</td>
        <td>${student.Nombre_periodo}</td>
        <td>${student.CodigoMatricula}</td>
        <td>
        <div class=flex-box>
          <button class="report-button" data-id="${student.Id_estudiante}">
            Reportes e informes
          </button>
          <button class="certificates-button btn" data-id="${student.Id_estudiante}">
            Certificados
          </button>
        </div>
        </td>
      `;
        tableBody.appendChild(tr);
      });
      document.querySelectorAll(".certificates-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          handleCertifications(event.target.dataset.id);
        });
      });
      document.querySelectorAll(".report-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          handleCredentials(event.target.dataset.id);
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

    //cargar los periodos al select
    const periodoSelect = document.getElementById("periodo");
    const periodoFetch = await fetch(
      "http://localhost:3000/api/periodo/get-periodos"
    );
    const responsePeriodo = await periodoFetch.json();
    const periodos = responsePeriodo.data;
    periodos.forEach((periodo) => {
      const option = document.createElement("option");
      option.value = periodo.Id_periodo;
      option.text = periodo.Nombre_periodo;
      periodoSelect.appendChild(option);
    });
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
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Error al cargar datos",
    });
  }
});

document.getElementById("periodo").addEventListener("change", async (event) => {
  try {
    const periodoSelect = document.getElementById("periodo").value;
  console.log(periodoSelect);
  const tableBody = document.querySelector("#tbody-table");
  tableBody.textContent = "Cargando...";
  const response = await fetch(
    `http://localhost:3000/api/estudiante/students-by-periodo?periodo=${periodoSelect}`
  );
  const res = await response.json();
  const students = res.data;
  console.log(res);
  tableBody.innerHTML = "";
  if (students.length > 0) {
    students.forEach((student) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${student.Id_estudiante}</td>
        <td>${student.Nombres}</td>
        <td>${student.Cedula}</td>
        <td>${student.Carrera}</td>
        <td>${student.Email}</td>
        <td>${student.Nombre_semestre}</td>
        <td>${student.Nombre_periodo}</td>
        <td>${student.CodigoMatricula}</td>
        <td>
         <div class=flex-box>
          <button class="report-button" data-id="${student.Id_estudiante}">
            Reportes e informes
          </button>
          <button class="certificates-button btn" data-id="${student.Id_estudiante}">
            Certificados
          </button>
        </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll(".certificates-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        handleCertifications(event.target.dataset.id);
      });
    });
    document.querySelectorAll(".report-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        handleCredentials(event.target.dataset.id);
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
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Error al cargar datos",
    });
    
  }
});

// Filter students
document.getElementById("filter-button").addEventListener("click", async () => {
  let inputFilter = document.getElementById("filter-input").value;
  const tableBody = document.querySelector("#tbody-table");
  const filterSelect = document.getElementById("filter-select").value;
  // console.log(inputFilter);
  if (inputFilter === "" && filterSelect === "cedula") {
    inputFilter = "all";
  }
  console.log(inputFilter);
  // console.log(filterSelect);
  const searchFetch = await fetch(
    `http://localhost:3000/api/estudiante/search?filter=${filterSelect}&value=${inputFilter}`
  );
  const responseSearch = await searchFetch.json();
  console.log(responseSearch);
  const students = responseSearch.data;
  tableBody.innerHTML = "";
  if (students.length > 0) {
    students.forEach((student) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${student.Id_estudiante}</td>
        <td>${student.Nombres}</td>
        <td>${student.Cedula}</td>
        <td>${student.Carrera}</td>
        <td>${student.Email}</td>
        <td>${student.Nombre_semestre}</td>
        <td>${student.Nombre_periodo}</td>
        <td>${student.CodigoMatricula}</td>
        <td>
         <div class=flex-box>
          <button class="report-button" data-id="${student.Id_estudiante}">
            Reportes e informes
          </button>
          <button class="certificates-button btn" data-id="${student.Id_estudiante}">
            Certificados
          </button>
        </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll(".certificates-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        handleCertifications(event.target.dataset.id);
      });
    });
    document.querySelectorAll(".report-button").forEach((button) => {
      button.addEventListener("click", (event) => {
        handleCredentials(event.target.dataset.id);
      });
    });
  } else {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class='card-empty-list'>
            <p>No hay coincidencias para <span class='danger-text bold-text'>${inputFilter}</span> buscando por ${
      filterSelect === "name" ? "nombres" : "cedula"
    }</p>
          </div>
        </td>
      </tr>
    `;
  }
});

function handleCertifications (id) {
 window.location.href = `http://localhost:5173/src/certificates/certificates.html?id=${id}`;
}
function createStudent() {
  window.location.href = "http://localhost:5173/src/createForm/createForm.html";
}

function handleCredentials(id) {
  window.location.href = `http://localhost:5173/src/credentials/credentials.html?id=${id}`;
}

document.getElementById("close-session-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "http://localhost:5173/src/index.html";
});

/* 
document.getElementById("loader-btn").addEventListener("click", () => {
  const button = document.getElementById("loader-btn");
  const tableBody = document.querySelector("#tbody-table");
  console.log(button);
  button.setAttribute("disabled", "disabled");
  tableBody.innerHTML = `
  <tr>
    <td colspan="9">
      <div class='card-empty-list'>
        <span class="loader"></span>
      </div>
    </td>
  </tr>
`;
  setTimeout(() => {
    tableBody.innerHTML = "";
    button.removeAttribute("disabled");
  }, 3000);
});
 */
