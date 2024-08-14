import { Toast } from "../utils/toast.js";

document.addEventListener('DOMContentLoaded', async () => {
  //get the id from the url
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  // console.log(id);  
  try {
    const response = await fetch(`http://localhost:3000/api/estudiante/get-student/${id}`);
    const res = await response.json();
    const student = res.data;
    console.log(student);
    document.getElementById('report-student').textContent = student.Nombres;
    document.getElementById('informe-student').textContent = student.Nombres;
    document.getElementById('student-name').textContent = student.Nombres;
    const modalOverlay = document.getElementById('modal-overlay');
    const modalInformeOverlay = document.getElementById('modal-informe-overlay');
  
    const openModalReporteBtn = document.getElementById('open-modal-reporte-btn');
    const closeModalReportBtn = document.getElementById('close-modal-repote-btn');
  
    const openModalInformeBtn = document.getElementById('open-modal-informe-btn');
    const closeModalInformeBtn = document.getElementById('close-modal-informe-btn');
  
  
    // get reportes from student
    const reporteQuery = await fetch(`http://localhost:3000/api/report/get-reports/${id}`);
    const responseReporte = await reporteQuery.json();
    console.log(responseReporte);
    if (responseReporte.status) {
      /* if (responseReporte.data.length === 0) {
        const listReportes = document.getElementById('list-reporte-container');
        return listReportes.innerHTML = `
          <div class="card-empty-list">
            <h3> No hay reportes</h3>
          </div>
        `;
      } */
      const listReportes = document.getElementById('list-reporte-container');
      listReportes.innerHTML = '';
      responseReporte.data.forEach((reporte) => {
        /* const reporteItem = document.createElement('li');
        reporteItem.classList.add('list-group-item');
        reporteItem.textContent = reporte.asunto;
        listReportes.appendChild(reporteItem); */
        listReportes.innerHTML += `
          <div class="card-report">
            <h3>${reporte.tipo_reporte == 'reporte-conducta' ? "Reporte de conducta" : "Reporte general"}</h3>
            <p>
              <span class="bold-text">Asunto:</span> <span class='gray-text'>${reporte.Descripcion_reporte}</span>
            </p>
            <p>
              <span class="bold-text">Fecha:</span> <span class='gray-text'>${new Date(reporte.Fecha_reporte).toLocaleDateString()}</span>
            </p>
            <div class="btn-container">
              <button class="btn download-btn" data-id=${reporte.Id_estudiante} data-fileName=${reporte.fileNameReporte}>Descargar</button>
            </div>
          </div> 
        `;
      });
      document.querySelectorAll('.download-btn').forEach((button) => {
        button.addEventListener('click', async (event) => {
          const id = event.target.dataset.id;
          const fileName = event.target.dataset.filename;
          // console.log(id, fileName);
         const response = await fetch(`http://localhost:3000/api/report/download-pdf/${id}/${fileName}`);
          const res = await response.blob();
          console.log(res);
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          a.remove();
        });
      });
    } else {
      const listReportes = document.getElementById('list-reporte-container');
      listReportes.innerHTML = `
        <div class="card-empty-list">
          <h3> No hay reportes</h3>
        </div>
      `;
    }


    //get informes from student
    const informeQuery = await fetch(`http://localhost:3000/api/informe/get-informes/${id}`);
    const responseInforme = await informeQuery.json();
    console.log(responseInforme);
    if (responseInforme.status) {
      const listInformes = document.getElementById('list-informes-container');
      listInformes.innerHTML = '';
      responseInforme.data.forEach((informe) => {
        var tipoInformePrev = informe.Tipo_de_informe;
        var tipoInforme = '';
      
        if (tipoInformePrev === 'merito-investigativo') {
          tipoInforme = 'Mérito investigativo';
        } else if (tipoInformePrev === 'alto-rendimiento-academico') {
          tipoInforme = 'Altos rendimientos académicos';
        } else if (tipoInformePrev === 'alto-rendimiento-deportivo') {
          tipoInforme = 'Altos rendimientos deportivos';
        } else if (tipoInformePrev === 'merito-cultural') { 
          tipoInforme = 'Mérito cultural';
        }
      
        // console.log(tipoInforme);
        listInformes.innerHTML += `
          <div class="card-informe">
            <h3>${tipoInforme}</h3>
            <p>
              <span class="bold-text">Titulo:</span> <span class='gray-text'>${tipoInforme}</span>
            </p>
            <p>
              <span class="bold-text">Fecha:</span> <span class='gray-text'>${new Date(informe.Fecha_informe).toLocaleDateString()}</span>
            </p>
            <div class="btn-container">
              <button class="btn download-informe-btn" data-id=${informe.Id_estudiante} data-fileName=${informe.fileNameInforme}>Descargar</button>
            </div>
          </div> 
        `;
      });
      document.querySelectorAll('.download-informe-btn').forEach((button) => {
        button.addEventListener('click', async (event) => {
          const id = event.target.dataset.id;
          const fileName = event.target.dataset.filename;
          // console.log(id, fileName);
          const response = await fetch(`http://localhost:3000/api/informe/download-pdf/${id}/${fileName}`);
          const res = await response.blob();
          console.log(res);
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          a.remove();
        });
      });
    } else {
      const listInformes = document.getElementById('list-informes-container');
      listInformes.innerHTML = `
        <div class="card-empty-list">
          <h3> No hay informes</h3>
        </div>
      `;
    }


  
    openModalReporteBtn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
    });
  
    closeModalReportBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.getElementById('report-btn').removeAttribute('disabled');
      document.getElementById('message-report-box').textContent = '';
      document.getElementById('message-report-box').style.display = 'none';
      window.location.reload();
  
    });
  
    openModalInformeBtn.addEventListener('click', () => {
      modalInformeOverlay.classList.add('active');
    });
  
    closeModalInformeBtn.addEventListener('click', () => {
      modalInformeOverlay.classList.remove('active');
      document.getElementById('report-btn').removeAttribute('disabled');
      document.getElementById('message-report-box').textContent = '';
      document.getElementById('message-report-box').style.display = 'none';
      window.location.reload();

    }); // Cerrar el modal cuando se hace clic en el botón de cerrar
  
    // Cerrar el modal cuando se hace clic fuera del formulario
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
  
      }
    });
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: 'error',
      title: 'Error al cargar la información del estudiante',
    });
  }


  // mensaje de error si el estudiante no ha cursado los semestres necesarios para generar un certificado de practicas preprofesionales, y carga de los certificados a generar
 /*  const messageBox  = document.getElementById('message-error');
  const certificadoType = document.getElementById('certificado-type');
  if (student.Id_semestre < 7 ) {
    messageBox.style.display = 'block';
    messageBox.textContent = 'El estudiante no ha cursado los semestres necesarios para generar un certificado de  practicas preprofesionales.';
    certificadoType.innerHTML = `
      <option value="certificado-matricula">Matricula</option>
      <option value="certificado-conducta">Conducta</option>
    `;
  } else {
    messageBox.style.display = 'none';
    certificadoType.innerHTML = `
      <option value="certificado-matricula">Matricula</option>
      <option value="certificado-conducta">Conducta</option>
      <option value="certificado-practicas">Practicas preprofesionales</option>
    `;
  } */
});
/* 
document.getElementById('certificado-form').addEventListener('submit', async (event) => {
  event.preventDefault();    

  const certificadoType = document.getElementById('certificado-type').value;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log(certificadoType, id);
  try {
    const certificadoFetch = await fetch(`http://localhost:3000/api/account/generate-certificado/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificadoType }),
    });
    const certificadoRes = await certificadoFetch.blob();
    console.log(certificadoRes);  


    const url = window.URL.createObjectURL(certificadoRes);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificadoType}_${id}.pdf`;
    a.textContent = `Descargar certificado`;


    const messageBox = document.getElementById('message-certificate-box');
    messageBox.append(a);
    messageBox.style.display = 'block';
    Toast.fire({
      icon: 'success',
      title: 'Certificado generado, asegurese de descargarlo y recargar la página para generar otro certificado',
    });
    document.getElementById('certificado-btn').setAttribute('disabled', 'disabled');
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: 'error',
      title: 'Error al generar certificado',
    });
  }
  
});
 */


document.getElementById('report-form').addEventListener('submit', async (event) => {
  event.preventDefault();    
  const reportType = document.getElementById('report-type').value;
  const asunto = document.getElementById('asunto').value;
  const causaReporte = document.getElementById('causa-reporte').value;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log({
    reportType,
    asunto,
    id,
  });
  try {
    // http://localhost:3000/api/report/generar-report/reporte-general/3
    const reportFetch = await fetch(`http://localhost:3000/api/report/generate-report/${reportType}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Autorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ asunto, causaReporte }),
    });
    const reportRes = await reportFetch.json();
    console.log(reportRes);
    /* const messageReportBox = document.getElementById('message-report-box');
    const url = window.URL.createObjectURL(reportRes);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_${id}.pdf`;
    a.textContent = `Descargar reporte`;
    messageReportBox.append(a);
    messageReportBox.style.display = 'block'; */
    Toast.fire({
      icon: 'success',
      title: 'Reporte generado, asegurese de descargarlo y recargar la página para generar otro reporte',
    });
    document.getElementById('report-btn').setAttribute('disabled', 'disabled');

  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: 'error',
      title: 'Error al generar reporte',
    });
  }
});

document.getElementById('informe-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const tituloInforme = document.getElementById('titulo-informe').value;
  const contenidoInforme = document.getElementById('contenido-informe').value;
  const tipoInforme = document.getElementById('tipo-informe').value;
  console.log(tituloInforme, contenidoInforme, tipoInforme);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  try {
    const response = await fetch(`http://localhost:3000/api/informe/generate-informe/${tipoInforme}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tituloInforme, contenidoInforme }),
    });
    const resInforme = await response.json();
    console.log(resInforme);

    const messageInformeBox = document.getElementById('message-informe-box');
    // const url = window.URL.createObjectURL(resInforme);
    /* const link = document.createElement('a');
    link.href = resInforme.data.filePath;
    link.download = resInforme.data.filePath.split('/').pop(); // Obtiene el nombre del archivo de la URL
    // link.download = resInforme.data.fileName;
    link.textContent = `Descargar informe`;
    messageInformeBox.append(link);
    messageInformeBox.style.display = 'block'; */
    Toast.fire({
      icon: 'success',
      title: 'Informe generado correctamente',
    });

  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: 'error',
      title: 'Error al generar informe',
    });
  }
});



document.getElementById("close-session-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "http://localhost:5173/src/index.html";
});