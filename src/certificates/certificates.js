import { Toast } from "../utils/toast";

document.addEventListener('DOMContentLoaded', async () => {
  //get params from url
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  // console.log(id);
  const response = await fetch(`http://localhost:3000/api/estudiante/get-student/${id}`);
  const res = await response.json();
  const student = res.data;
  console.log(student);
  // document.getElementById('student').textContent = student.Nombres;


  // mensaje de error si el estudiante no ha cursado los semestres necesarios para generar un certificado de practicas preprofesionales, y carga de los certificados a generar
 const messageBox  = document.getElementById('message-error');
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
  }
});

document.getElementById('certificado-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  // <span class="loader"></span>
  try {
    //colocar el loader en el boton
    /* const loader = document.createElement('span');
    loader.classList.add('loader');
    event.target.appendChild(loader); */

    const messageBox = document.getElementById('message-certificado-box');
    messageBox.innerHTML = `
      <span class="loader"></span> Caragando...
    `; 
    const certificadoType = document.getElementById('certificado-type').value;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(certificadoType, id);
    
    const response = await fetch(`http://localhost:3000/api/certificado/generate-certificado/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificadoType }),
    });
  
    const res = await response.blob();
    console.log(res);
    const url = window.URL.createObjectURL(res);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certificadoType}_${id}.pdf`;
    a.textContent = `Descargar certificado`;
    messageBox.innerHTML = '';
    messageBox.appendChild(a);
    messageBox.style.display = 'block';

    Toast.fire({
      icon: 'success',
      title: 'Certificado generado correctamente',
    });
  } catch(error) {
    console.log(error);
    Toast.fire({
      icon: 'error',
      title: 'Error al generar el certificado',
    });
  }finally {
    // document.getElementById('certificado-btn').removeChild(loader);
    document.getElementById('certificado-btn').setAttribute('disabled', 'disabled');
  }

});