# Proyecto Final - Simulador de Turnos para Estudio de Tatuajes  
Alumno: Facundo Faraci  
Comisión: 80805  
Curso: JavaScript

## Descripción

Este proyecto simula un sistema de turnos para un estudio de tatuajes. Permite a los usuarios reservar un turno completando un formulario con su nombre, el estilo de tatuaje, tamaño aproximado, fecha, horario y una descripción opcional del diseño. El sistema valida los datos ingresados, impide reservas duplicadas y bloquea horarios ya ocupados.

## Tecnologías utilizadas

- HTML5  
- CSS3 + Bootstrap 5  
- JavaScript (DOM, eventos, arrays, objetos, validaciones, localStorage)  
- Librerías externas: SweetAlert2 para mensajes y Flatpickr para selección de fechas

## Funcionalidades principales

- Formulario dinámico para ingresar turnos
- Selección de estilo y tamaño de tatuaje, con opciones cargadas desde un archivo JSON
- Calendario interactivo para elegir fechas válidas
- Horarios disponibles actualizados en función de los turnos ya tomados
- Validaciones para evitar nombres inválidos, fechas pasadas u horarios incorrectos
- Turnos ordenados automáticamente por fecha y hora
- Opción para eliminar turnos con confirmación
- Almacenamiento en localStorage para mantener los datos aunque se cierre o recargue la página
- Exportación de los turnos a un archivo JSON descargable
- Diseño adaptable a diferentes tamaños de pantalla

## Estructura del proyecto

- `index.html`: página principal
- `css/style.css`: hoja de estilos
- `js/main.js`: lógica principal del simulador
- `data/services.json`: listado de estilos y tamaños de tatuajes disponibles
