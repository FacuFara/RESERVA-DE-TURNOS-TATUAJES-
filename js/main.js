// Referencias al DOM
const form = document.getElementById("form-turno");
const listaTurnos = document.getElementById("lista-turnos");
const estiloSelect = document.getElementById("estilo");
const tamañoSelect = document.getElementById("tamaño");
const horaSelect = document.getElementById("hora");
const fechaInput = document.getElementById("fecha");

// Activar Flatpickr para la fecha
flatpickr("#fecha", {
  dateFormat: "Y‑m‑d",
  minDate: "today",
  disableMobile: true
});

// Array de turnos
let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

// Cargar los estilos desde el JSON
function cargarServicios() {
  fetch('data/services.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(servicio => {
        const option = document.createElement("option");
        option.value = servicio.id;
        option.textContent = servicio.estilo;
        estiloSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Error cargando servicios:", error));
}

// Cuando se selecciona un estilo, cargar tamaños/precios correspondientes
estiloSelect.addEventListener("change", (e) => {
  const idSeleccionado = parseInt(e.target.value);
  if (!idSeleccionado) {
    tamañoSelect.innerHTML = '<option value="">Seleccioná un tamaño</option>';
    return;
  }
  fetch('data/services.json')
    .then(response => response.json())
    .then(data => {
      const servicio = data.find(s => s.id === idSeleccionado);
      if (servicio) {
        tamañoSelect.innerHTML = '<option value="">Seleccioná un tamaño</option>';
        servicio.opciones.forEach(opt => {
          const option = document.createElement("option");
          option.value = `${opt.tamaño}|${opt.precio}`;
          option.textContent = `${opt.tamaño} – $${opt.precio}`;
          tamañoSelect.appendChild(option);
        });
      }
    })
    .catch(error => console.error("Error cargando tamaños:", error));
});

// Función para generar horarios disponibles según la fecha
function generarHorariosDisponibles(fechaSeleccionada) {
  const horarios = [];
  for (let h = 10; h <= 20; h++) {
    const hora = h.toString().padStart(2, '0') + ":00";
    horarios.push(hora);
  }

  const ocupados = turnos
    .filter(t => t.fecha === fechaSeleccionada)
    .map(t => t.hora);

  const disponibles = horarios.filter(h => !ocupados.includes(h));

  horaSelect.innerHTML = '<option value="">Seleccioná un horario</option>';
  disponibles.forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    horaSelect.appendChild(option);
  });
}

// Escuchar cambio de fecha para actualizar horarios
fechaInput.addEventListener("change", (e) => {
  const fechaSeleccionada = e.target.value;
  if (fechaSeleccionada) {
    generarHorariosDisponibles(fechaSeleccionada);
  }
});

// Renderizar los turnos en pantalla
function renderTurnos() {
  listaTurnos.innerHTML = "";

  // Ordenar por fecha y hora
  turnos.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

  turnos.forEach((turno, index) => {
    const div = document.createElement("div");
    div.classList.add("turno", "col-12", "bg-secondary", "p-3", "rounded");

    const nombreP = document.createElement("p");
    nombreP.innerHTML = `<strong>Cliente:</strong> ${turno.nombre}`;

    const servicioP = document.createElement("p");
    servicioP.innerHTML = `<strong>Servicio:</strong> ${turno.servicioTexto}`;

    const tamañoP = document.createElement("p");
    tamañoP.innerHTML = `<strong>Tamaño:</strong> ${turno.tamaño}`;

    const precioP = document.createElement("p");
    precioP.innerHTML = `<strong>Precio:</strong> $${turno.precio}`;

    const fechaP = document.createElement("p");
    fechaP.innerHTML = `<strong>Fecha:</strong> ${turno.fecha}`;

    const horaP = document.createElement("p");
    horaP.innerHTML = `<strong>Hora:</strong> ${turno.hora}`;

    const comentarioP = document.createElement("p");
    comentarioP.innerHTML = turno.comentario
      ? `<strong>Diseño:</strong> ${turno.comentario}`
      : "";

    const boton = document.createElement("button");
    boton.classList.add("btn", "btn-danger", "mt-2");
    boton.textContent = "Eliminar turno";
    boton.addEventListener("click", () => eliminarTurno(index));

    div.append(nombreP, servicioP, tamañoP, precioP, fechaP, horaP, comentarioP, boton);
    listaTurnos.appendChild(div);
  });
}

// Guardar en localStorage
function guardarEnStorage() {
  localStorage.setItem("turnos", JSON.stringify(turnos));
}

// Manejador de formulario: reserva de turno
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const estiloId = estiloSelect.value;
  const servicioTexto = estiloSelect.selectedOptions[0].textContent;
  const tamañoPrecio = tamañoSelect.value;
  if (!tamañoPrecio) {
    mostrarMensaje("Por favor, elegí un tamaño de tatuaje.", "error");
    return;
  }
  const [tamañoSeleccionado, precioSeleccionado] = tamañoPrecio.split("|");
  const precio = parseFloat(precioSeleccionado);
  const fecha = fechaInput.value;
  const hora = horaSelect.value;
  const comentario = document.getElementById("comentario").value.trim();

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!regexNombre.test(nombre)) {
    mostrarMensaje("El nombre solo debe contener letras.", "error");
    return;
  }

  const fechaHoraIngresada = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  if (fechaHoraIngresada <= ahora) {
    mostrarMensaje("No se puede reservar en una fecha u hora pasada.", "error");
    return;
  }

  const horaNum = parseInt(hora.split(":")[0]);
  if (horaNum < 10 || horaNum > 20) {
    mostrarMensaje("Los turnos deben ser entre las 10:00 y las 20:00.", "error");
    return;
  }

  if (turnos.some(t => t.fecha === fecha && t.hora === hora)) {
    mostrarMensaje("Ya hay un turno reservado en ese horario.", "error");
    return;
  }

  const nuevoTurno = {
    nombre,
    estiloId,
    servicioTexto,
    tamaño: tamañoSeleccionado,
    precio,
    fecha,
    hora,
    comentario
  };

  turnos.push(nuevoTurno);
  guardarEnStorage();
  renderTurnos();
  form.reset();
  mostrarMensaje("Turno reservado con éxito", "success");
});

// Mostrar mensajes con SweetAlert2
function mostrarMensaje(mensaje, tipo = "success") {
  Swal.fire({
    text: mensaje,
    icon: tipo,
    confirmButtonText: "OK"
  });
}

// Eliminar turno con confirmación
function eliminarTurno(index) {
  Swal.fire({
    title: "¿Eliminar turno?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      turnos.splice(index, 1);
      guardarEnStorage();
      renderTurnos();
      mostrarMensaje("Turno eliminado", "success");
    }
  });
}

// Iniciar: cargar servicios y mostrar turnos
cargarServicios();
renderTurnos();
