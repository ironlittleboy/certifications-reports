import { Toast } from "../utils/toast";

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
  
    const modalOverlay = document.getElementById('modal-overlay');
    const modalInformeOverlay = document.getElementById('modal-informe-overlay');
  
    const openModalReporteBtn = document.getElementById('open-modal-reporte-btn');
    const closeModalReportBtn = document.getElementById('close-modal-repote-btn');
  
    const openModalInformeBtn = document.getElementById('open-modal-informe-btn');
    const closeModalInformeBtn = document.getElementById('close-modal-informe-btn');
  
  
  
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
  } finally {
    window.location.reload();
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
  } finally {
    window.location.reload();
  }
});


