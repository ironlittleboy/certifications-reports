import Swal from "sweetalert2";
import { Toast } from "../utils/toast";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const periodoFetch = await fetch(
      "http://localhost:3000/api/periodo/get-periodos"
    );
    const responsePeriodo = await periodoFetch.json();
    const periodos = responsePeriodo.data;
    // console.log(periodos);

    const periodoSelect = document.getElementById("periodo");
    periodos.forEach((periodo) => {
      const option = document.createElement("option");
      option.value = periodo.Id_periodo;
      option.text = periodo.Nombre_periodo;
      periodoSelect.appendChild(option);
    });

    const semestreFetch = await fetch(
      "http://localhost:3000/api/semestre/get-semestres"
    );
    const responseSemestre = await semestreFetch.json();
    const semestres = responseSemestre.data;
    // console.log(semestres);

    const semestreSelect = document.getElementById("semestre");
    semestres.forEach((semestre) => {
      const option = document.createElement("option");
      option.value = semestre.Id_semestre;
      option.text = semestre.Nombre_semestre;
      semestreSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Error al cargar los periodos y semestres",
    });
  } finally {
    Toast.fire({
      icon: "success",
      title: "Periodos y semestres cargados correctamente",
    });
  }
});

document
  .getElementById("student-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    // console.log(e.target);
    const formData = new FormData(e.target);
    const student = Object.fromEntries(formData);
    console.log(student);
    fetch("http://localhost:3000/api/estudiante/save-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(student),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          Toast.fire({
            icon: "success",
            title: response.message,
          }).then(() => {
            window.location.href =
              "http://localhost:5173/src/dashboard/dashboard.html";
          });
        } else {
          Toast.fire({
            icon: "error",
            title: response.message,
          });
        }
      });
  });

document.getElementById("charge-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  const file = document.getElementById("file").files[0];
  const dataType = document.getElementById("data").value;
  formData.append("file", file);
  if (dataType === "") {
    Toast.fire({
      icon: "error",
      title: "Debes definir que datos subiras, estudiantes o practricas",
    });
    return;
  }
  console.log(formData);
  Toast.fire({
    icon: "info",
    title: "Cargando archivo...",
  }).then(() => {
    try {
      fetch(
        `http://localhost:3000/api/estudiante/save-charge?data=${dataType}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            Toast.fire({
              icon: "success",
              title: response.message,
            }).then(() => {
              e.target.reset();
            });
          } else {
            Toast.fire({
              icon: "warning",
              title: response.message,
            });
          }
        });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Error al cargar el archivo",
      });
    } finally {
      Toast.fire({
        icon: "success",
        title: "Datos cargados correctamente",
      });
    }
  });
});

document.getElementById("period-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const period = Object.fromEntries(formData);
  fetch("http://localhost:3000/api/periodo/save-period", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(period),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (response.status) {
        Toast.fire({
          icon: "success",
          title: response.message,
        }).then(() => {
          e.target.reset();
        });
      } else {
        Toast.fire({
          icon: "error",
          title: response.message,
        });
      }
    });
});
