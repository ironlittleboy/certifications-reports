import { Toast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", async () => {
  //get params from url
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  // console.log(id);
  const response = await fetch(
    `http://localhost:3000/api/estudiante/get-student/${id}`
  );
  const res = await response.json();
  const student = res.data;
  console.log(student);
  // document.getElementById('student').textContent = student.Nombres;

  // mensaje de error si el estudiante no ha cursado los semestres necesarios para generar un certificado de practicas preprofesionales, y carga de los certificados a generar
  const messageBox = document.getElementById("message-error");
  const certificadoType = document.getElementById("certificado-type");
  if (student.Id_semestre < 7) {
    messageBox.style.display = "block";
    messageBox.textContent =
      "El estudiante no ha cursado los semestres necesarios para generar un certificado de  practicas preprofesionales.";
    certificadoType.innerHTML = `
      <option value="certificado-matricula">Matricula</option>
      <option value="certificado-conducta">Conducta</option>
      <option value="certificado-beca">Beca</option>
    `;
  } else {
    messageBox.style.display = "none";
    certificadoType.innerHTML = `
      <option value="certificado-matricula">Matricula</option>
      <option value="certificado-conducta">Conducta</option>
      <option value="certificado-practicas">Practicas preprofesionales</option>
      <option value="certificado-beca">Beca</option>
    `;
  }
});

// capture the value of type of certificate, and generate the form to load the data of the student practices, or becas if this is selected
document
  .getElementById("certificado-type")
  .addEventListener("change", async (event) => {
    const container = document.getElementById("form-or-data-show");
    const certificadoType = event.target.value;
    //get params from url
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    try {
      const stundentReq = await fetch(
        `http://localhost:3000/api/estudiante/get-student/${id}`
      );
      const studentRes = await stundentReq.json();
      console.log(studentRes);
      const student = studentRes.data;

      if (certificadoType === "certificado-practicas") {
        if (student.certificado_practicas === 0 && student.Id_semestre >= 7) {
          console.log("cargar formulario de practicas");

          container.innerHTML = `
          <form id="practica-form">
          <h2>Cargar datos de practicas del estudiante</h2>
          <p>
            <span class="danger-text bold-text">Importante</span>
            Carga los datos de las practicas del estudiante, para generar el certificado de practicas.
          </p>
          <div class="input-field">
            <label for="fecha-practica">Fecha de inicio de practica</label>
            <input type="date" name="fecha-practica" id="fecha-practica" title="seleccionar la fecha de inicio de la practica">
          </div>
          <div class="input-field">
            <label for="fecha-final">Fecha de finalizacion de practica</label>
            <input type="date" name="fecha-final" id="fecha-final" title="seleccionar la fecha de finalizacion de la practica">
          </div>
          <div class="input-field">
            <label for="estado-practica">Estado de las practicas</label>
            <select name="estado-practica" id="estado-practica" title="seleccionar el estado de las practicas">
              <option value="finish">Terminadas</option>
              <option value="in-progress">En progreso</option>
            </select>
          </div>
          <div class="input-field">
            <label for="docente-practicas">Docente Tutor</label>
            <input type="text" id="docente-practicas" name="docente-practicas" placeholder="Docente tutor">
          </div>
          <div class="input-field">
            <label for="tipo-practica">Tipo de practica</label>
            <select name="tipo-practica" id="tipo-practica" title="seleccionar el tipo de practica">
              <option value="profesional">Profesional</option>
              <option value="tecnica">Tecnica</option>
            </select>
          </div>
          <div class="input-field">
            <label for="lugar-practicas">Lugar de practicas</label>
            <input type="text" id="lugar-practicas" name="lugar-practicas" placeholder="Lugar de practicas">
          </div>
          <div>
            <button type="submit" class="btn" id="practica-btn">Cargar datos de practicas</button>
          </div>
        </form>
        `;

          document
            .getElementById("practica-form")
            .addEventListener("submit", async (e) => {
              e.preventDefault();
              const formData = new FormData();
              const fechaInicioPracticas =
                document.getElementById("fecha-practica").value;
              const fechaFinalPracticas =
                document.getElementById("fecha-final").value;
              const estadoPracticas =
                document.getElementById("estado-practica").value;
              const docentePracticas =
                document.getElementById("docente-practicas").value;
              const tipoPracticas =
                document.getElementById("tipo-practica").value;
              const lugarPracticas =
                document.getElementById("lugar-practicas").value;
              formData.append("fechaInicioPracticas", fechaInicioPracticas);
              formData.append("fechaFinalPracticas", fechaFinalPracticas);
              formData.append("estadoPracticas", estadoPracticas);
              formData.append("docentePracticas", docentePracticas);
              formData.append("tipoPracticas", tipoPracticas);
              formData.append("lugarPracticas", lugarPracticas);
              formData.append("idEstudiante", parseInt(id));
              formData.append("idPeriodo", parseInt(student.Id_periodo));
              const data = Object.fromEntries(formData);
              console.log(data);
              try {
                const practicaReq = await fetch(
                  `http://localhost:3000/api/practice/save-practice/${student.Id_estudiante}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  }
                );
                const response = await practicaReq.json();
                console.log(response);
                if (response.status) {
                  Toast.fire({
                    icon: "success",
                    title: "Datos de practicas cargados correctamente",
                  });
                  container.innerHTML = `
                <div>datos del estudiante</div>
              `;
                }
              } catch (error) {
                console.log(error);
                Toast.fire({
                  icon: "error",
                  title: "Error al cargar los datos de practicas",
                });
              }
            });
        } else {
          try {
            container.innerHTML = ``;
            const practicaByStudentReq = await fetch(
              `http://localhost:3000/api/practice/practices/${id}`
            );
            const response = await practicaByStudentReq.json();
            const practicas = response.data[0];
            console.log(response);
            console.log(practicas.Fecha_practicas);
            const fechaInicio = new Date(
              practicas.Fecha_practicas
            ).toLocaleDateString();
            container.innerHTML = `
              <div class="data-card">
                <h2>Datos de practicas de estudiante <span class="color-primary bold-text">${
                  student.Nombres
                }</span></h2>
                <div class="card-body"> 
                  <div>
                    <span class="bold-text color-primary"> Lugar de pracicas: </span>${
                      practicas.Lugar_de_practicas
                    }         
                  </div>
                  <div>
                    <span class="bold-text color-primary">Fecha de inicio: </span> ${fechaInicio}
                  </div>
                  <div>
                    <span class="bold-text color-primary">Fecha de finalizacion: </span> [fecha final]
                  </div>
                  <div>
                    <span class="bold-text color-primary">Horas realizadas: </span> 48
                  </div>
                  <div>
                    <span class="bold-text color-primary">Docente Tutor: </span> ${
                      practicas.Tutor_practicas
                    }
                  </div>
                  <div>
                    <span class="bold-text color-primary">Tipo de practicas: </span> ${
                      practicas.Tipo_de_practicas
                    }
                  </div>
                  <div>
                    <span class="bold-text color-primary">Estado: </span> ${
                      practicas.Estado_practicas === "finish"
                        ? "Terminadas"
                        : "En progreso"
                    }
                  </div>
                </div>
              </div>`;
          } catch (error) {
            console.log(error);
            Toast.fire({
              icon: "error",
              title: "Error al cargar datos de practicas",
            });
          }
        }
      } else if (certificadoType === "certificado-beca") {
        //form to load the data of the student becas
        try {
          //consult if the student have a beca
          const becaReq = await fetch(
            `http://localhost:3000/api/beca/comprobate-beca/${student.Id_estudiante}`
          );
          const becaRes = await becaReq.json();

          console.log(becaRes);
          if (becaRes.status && becaRes.becaExist) {
            try {
              const dataBecaReq = await fetch(
                `http://localhost:3000/api/beca/beca-data/${student.Id_estudiante}`
              );
              const dataBecaRes = await dataBecaReq.json();
              console.log(dataBecaRes);
              const becaData = dataBecaRes.data;
              let tipoBeca = "";
              if (becaData.Tipo_certificado_beca === "socio-economico-beca") {
                tipoBeca = "Beca Socio Economica";
              } else if (
                becaData.Tipo_certificado_beca ===
                "alto-rendimiento-academico-beca"
              ) {
                tipoBeca = "Beca de alto rendimiento academico";
              } else if (
                becaData.Tipo_certificado_beca === "merito-investigativo-beca"
              ) {
                tipoBeca = "Beca de merito investigativo";
              } else if (becaData.Tipo_certificado_beca === "deportiva-beca") {
                tipoBeca = "Beca deportiva";
              } else if (
                becaData.Tipo_certificado_beca === "discapacidad-beca"
              ) {
                tipoBeca = "Beca por discapacidad";
              }
              const fecha = new Date(becaData.Fecha_certificado_beca).toLocaleDateString()
              // console.log(tipoBeca)
              container.innerHTML = `
                <div class="data-card">
                  <h2>Datos de beca de estudiante <span class="color-primary bold-text">${becaData.Nombres}</span></h2>
                  <div class="card-body">
                    <div>
                      <span class="bold-text color-primary">Tipo de certificado: </span> ${becaData.Tipo_certificado}
                    </div>
                    <div>
                      <span class="bold-text color-primary">Tipo de beca: </span> ${tipoBeca}
                    </div>
                    <div>
                      <span class="bold-text color-primary">Descripcion del certificado (Asunto): </span> ${becaData.descripcion_certificado}
                    </div>
                    <div>
                      <span class="bold-text color-primary">Ayuda monetaria (USD): </span> ${becaData.monto_beca}
                    </div>
                    <div>
                      <span class="bold-text color-primary">Fecha de beca: </span> ${fecha}
                    </div>
                  </div>
                  
                </div>
              `;
            } catch (error) {
              console.log(error);
              Toast.fire({
                icon: "error",
                title: "Error al consultar datos de la beca",
              });
            }
          } else {
            container.innerHTML = `
              <form id="beca-form">
                <h2>Cargar datos de beca del estudiante</h2>
                <p>
                  <span class="danger-text bold-text">Importante</span>
                  Carga los datos de la beca del estudiante, para generar el certificado de beca.
                </p>
                <br>
                <div class="input-field">
                  <label for="tipo-beca">Tipo de beca</label>
                  <select name="tipo-beca" id="tipo-beca" title="seleccionar el tipo de beca">
                    <option value="alto-rendimiento-academico-beca">Alto rendimiento academico</option>
                    <option value="merito-investigativo-beca">Merito investigativo</option>
                    <option value="deportiva-beca">Deportiva</option>
                    <option value="socio-economico-beca">Socio Economica</option>
                    <option value="discapacidad-beca">Discapacidad</option>
                  </select>
                </div>
                <div class="input-field">
                  <label for="descripcion-beca">Descripcion de la razon</label>
                  <textarea name="descripcion-beca" id="descripcion-beca" cols="30" rows="10" placeholder="Descripcion de la razon de la beca"></textarea>
                </div>
                <div class="input-field">
                  <label for="monto-beca">Monto monetario de la ayuda</label>
                  <input type="text" name="monto-beca" id="monto-beca" placeholder="Monto monetario de la ayuda en dolares USD">
                </div>
                <div>
                  <button type="submit" class="btn" id="beca-btn">Cargar datos de beca</button>
                </div>
              </form>
            `;
            document
              .getElementById("beca-form")
              .addEventListener("submit", async (e) => {
                e.preventDefault();
                //get the data of the form
                const formData = new FormData();
                const tipoBeca = document.getElementById("tipo-beca").value;
                const descripcionBeca =
                  document.getElementById("descripcion-beca").value;
                const montoBeca = document.getElementById("monto-beca").value;
                formData.append("tipoBeca", tipoBeca);
                formData.append("descripcionBeca", descripcionBeca);
                formData.append("montoBeca", parseFloat(montoBeca));
                formData.append("idPeriodo", parseInt(student.Id_periodo));
                //add the current date to the data
                formData.append("fecha", new Date().toLocaleDateString());
                const data = Object.fromEntries(formData);
                console.log(data);
                // send data to the server
                try {
                  const becaReq = await fetch(
                    `http://localhost:3000/api/beca/save-beca/${student.Id_estudiante}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    }
                  );
                  const response = await becaReq.json();
                  console.log(response);
                  if (response.status) {
                    Toast.fire({
                      icon: "success",
                      title: "Datos de beca cargados correctamente",
                    }).then(() => {
                      window.location.reload();
                    })
                  }
                } catch (error) {
                  console.log(error);
                  Toast.fire({
                    icon: "error",
                    title: "Error al cargar los datos de beca",
                  });
                }
              });
          }
        } catch (error) {
          console.log(error);
          Toast.fire({
            icon: "error",
            title: "Error al comprobar beca",
          });
        }
      } else {
        container.innerHTML = ``;
      }
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Error al cargar datos",
      });
    }
  });

document
  .getElementById("certificado-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const randomNumerByDate = new Date().valueOf();

    // <span class="loader"></span>
    try {
      //colocar el loader en el boton
      /* const loader = document.createElement('span');
    loader.classList.add('loader');
    event.target.appendChild(loader); */

      const messageBox = document.getElementById("message-certificado-box");
      messageBox.innerHTML = `
      <span class="loader"></span> Caragando...
    `;
      const certificadoType = document.getElementById("certificado-type").value;
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      //  console.log(certificadoType, id);

      const response = await fetch(
        `http://localhost:3000/api/certificado/generate-certificado/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ certificadoType }),
        }
      );

      const res = await response.blob();
      console.log(res);
      const url = window.URL.createObjectURL(res);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certificadoType}_${randomNumerByDate}_${id}.pdf`;
      a.textContent = `Descargar certificado`;
      messageBox.innerHTML = "";
      messageBox.appendChild(a);
      messageBox.style.display = "block";

      Toast.fire({
        icon: "success",
        title: "Certificado generado correctamente",
      });
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Error al generar el certificado",
      });
    } finally {
      // document.getElementById('certificado-btn').removeChild(loader);
      document
        .getElementById("certificado-btn")
        .setAttribute("disabled", "disabled");
    }
  });

document.getElementById("close-session-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "http://localhost:5173/src/index.html";
});
