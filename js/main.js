// Referencias al DOM
const form = document.getElementById("form-turno");
const listaTurnos = document.getElementById("lista-turnos");

// Array de turnos
let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

// Función para mostrar los turnos en el DOM
function renderTurnos() {
  listaTurnos.innerHTML = "";

  turnos.forEach((turno, index) => {
    const div = document.createElement("div");
    div.classList.add("turno");
    div.innerHTML = `
      <p><strong>Cliente:</strong> ${turno.nombre}</p>
      <p><strong>Zona:</strong> ${turno.zona}</p>
      <p><strong>Fecha:</strong> ${turno.fecha}</p>
      <p><strong>Hora:</strong> ${turno.hora}</p>
      ${turno.comentario ? `<p><strong>Diseño:</strong> ${turno.comentario}</p>` : ""}
      <button onclick="eliminarTurno(${index})">Eliminar</button>
    `;
    listaTurnos.appendChild(div);
  });
}

// Función para guardar turnos en localStorage
function guardarEnStorage() {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

// Manejador del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const zona = document.getElementById("zona").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const comentario = document.getElementById("comentario").value.trim();

  if (!nombre || !zona || !fecha || !hora) {
    alert("Por favor, completá todos los campos obligatorios.");
    return;
  }

  const nuevoTurno = { nombre, zona, fecha, hora, comentario };
  turnos.push(nuevoTurno);

  guardarEnStorage();
  renderTurnos();
  form.reset();
});

// Eliminar turno
function eliminarTurno(index) {
  turnos.splice(index, 1);
  guardarEnStorage();
  renderTurnos();
}

// Cargar turnos al iniciar
renderTurnos();
