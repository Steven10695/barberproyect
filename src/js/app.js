let pagina = 1;

const cita = {
     nombre: '',
     fecha: '',
     hora: '',
     servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
     iniciarApp();
});

function iniciarApp(){
     mostrarServicios();

     // Resalta el Div actual segun el tab al que se presiona
     mostrarSeccion();

     // Ocuta o muestra una seccion segun el tab al que se presiona
     cambiarSeccion();

     //Paginacion sgte y anterior
     paginaSiguiente();

     paginaAnterior();

     // Comprueba la pagina actual para ocultar o mostrar la paginacion
     botonesPaginador();

     //Muestra el resumen de la cita ( o mensaje de error en caso de no pasar la validacion)
     mostrarResumen();

     // almacena el nombre de la cita en el objeto
     nombreCita();
}

function mostrarSeccion(){

     const seccionAnterior = document.querySelector('.mostrar-seccion');
     if( seccionAnterior){
          seccionAnterior.classList.remove('mostrar-seccion');
     }

     const seccionActual = document.querySelector(`#paso-${pagina}`);
     seccionActual.classList.add('mostrar-seccion');

     const tabAnterior = document.querySelector('.tabs .actual');
     if(tabAnterior){
          // eliminar la clase actual en el tab anterior
          tabAnterior.classList.remove('actual');
     }
     
     // Reslta el Tab Actual
     const tab = document.querySelector(`[data-paso="${pagina}"]`);
     tab.classList.add('actual');
}

function cambiarSeccion(){
     const enlaces = document.querySelectorAll('.tabs button'); 

     enlaces.forEach( enlace =>{
          enlace.addEventListener('click', e => {
               e.preventDefault();
               pagina = parseInt(e.target.dataset.paso);

               // Llamar la funcion de mostrar sección
               mostrarSeccion();

               botonesPaginador();
          })
     })
}

async function mostrarServicios(){
     try{
          const resultado = await fetch('./servicios.json');
          const db = await resultado.json();

          const {servicios} = db;

          //Generar el HTML
          servicios.forEach( servicio =>{
               const { id, nombre, precio } = servicio;

          // DOM Scripting
          const nombreServicio = document.createElement('P');
          nombreServicio.textContent = nombre;
          nombreServicio.classList.add('nombre-servicio');

          // Generar el precio del servicio

          const precioServicio = document.createElement('P');
          precioServicio.textContent = `$ ${precio}`;
          precioServicio.classList.add('precio-servicio');

          // Generar div contenedor de servicio
          const servicioDiv = document.createElement('DIV')
          servicioDiv.classList.add('servicio');
          servicioDiv.dataset.idServicio = id;

          // Selecciona un servicio para la cita
          servicioDiv.onclick = seleccionarServicio;


          // Inyectar precio y nombre al div de servicio
          servicioDiv.appendChild(nombreServicio);
          servicioDiv.appendChild(precioServicio);

          // Inyecttarlo en el HTML
          document.querySelector('#servicios').appendChild(servicioDiv);
          })



     } catch (error){
          console.log(error);
     }
}

function seleccionarServicio(e){

     let elemento;
     // Forzar que el elemento al cual le damos click sea DIV
     if(e.target.tagName === 'P'){
          elemento = e.target.parentElement;
     } else{
          elemento = e.target;
     }

     if(elemento.classList.contains('selecccionado')){
          elemento.classList.remove('selecccionado');

          const id = parseInt(elemento.dataset.idServicio);

          eliminarServicio(id);
     } else{
          elemento.classList.add('selecccionado');

          const servicioObj = {
               id: parseInt(elemento.dataset.idServicio),
               nombre: elemento.firstElementChild.textContent,
               precio: elemento.firstElementChild.nextElementSibling.textContent
          }
          //console.log(servicioObj);
          agregarServicio(servicioObj);
     }
     
}

function eliminarServicio(id){
     const { servicios } = cita;
     cita.servicios = servicios.filter( servicio => servicio.id !== id);
}

function agregarServicio(servicioObj){
     const { servicios } = cita;
     cita.servicios = [...servicios, servicioObj];

}

function paginaSiguiente(){
     const paginaSiguiente = document.querySelector('#siguiente');
     paginaSiguiente.addEventListener('click', () =>{
          pagina++;

          botonesPaginador();

     });
}

function paginaAnterior(){
     const paginaAnterior = document.querySelector('#anterior');
     paginaAnterior.addEventListener('click', () =>{
          pagina--;

          botonesPaginador();
     });
}

function botonesPaginador(){
     const paginaSiguiente = document.querySelector('#siguiente');
     const paginaAnterior = document.querySelector('#anterior');

     if(pagina === 1) {
          paginaAnterior.classList.add('ocultar');
     }  else if (pagina === 3){
          paginaSiguiente.classList.add('ocultar');
          paginaAnterior.classList.remove('ocultar');
     } else{
          paginaAnterior.classList.remove('ocultar');
          paginaSiguiente.classList.remove('ocultar');
     }

     mostrarSeccion(); // Cambia la seccion que se muestra por la de la pagina
}

function mostrarResumen(){
     // Destructuring
     const { nombre, fecha, hora, servicios } = cita;

     // Seleccionar el resumen
     const resumenDiv = document.querySelector('.contenido-resumen');

     //Validacion de objeto
     if(Object.values(cita).includes('')){
          const noServicios = document.createElement('P');
          noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

          noServicios.classList.add('invalidar-cita');

          //agregar a resumen Div
          resumenDiv.appendChild(noServicios);
     }
}

function nombreCita(){
     const nombreInput = document.querySelector('#nombre');

     nombreInput.addEventListener('input', e =>{
          const nombreTexto = e.target.value.trim();

          // Validadcion que nombreTexto debe tener algo
          if ( nombreTexto === '' || nombreTexto.length < 3){
               mostrarAlerta('Nombre no valido', 'error')
          } else {
               const alerta = document.querySelector('.alerta');
               if(alerta){
                    alerta.remove();
               }
               cita.nombre = nombreTexto;
          }
     });
}

function mostrarAlerta(mensaje, tipo){

     // Si hay una alerta previa, entonces no crear otra
     const alertaPrevia = document.querySelector('.alerta');
     if(alertaPrevia){
          return;
     }
     
     const alerta = document.createElement('DIV');
     alerta.textContent = mensaje;
     alerta.classList.add('alerta');

     if(tipo === 'error'){
          alerta.classList.add('error');
     }

     // Insertar en el HTML
     const formulario = document.querySelector('.formulario');
     formulario.appendChild( alerta );

     // Eliminar la alerta despues de 3 segundos
     setTimeout(() =>{
        alerta.remove();  
     }, 3000);

}