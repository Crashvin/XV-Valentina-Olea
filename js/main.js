// Animación del splash con GSAP
window.addEventListener('DOMContentLoaded', () => {
  gsap.to('.titulo', {
    duration: 1.2,
    opacity: 1,
    y: 0,
    ease: "power3.out"
  });

  gsap.to('#entrarBtn', {
    delay: 1.5,
    duration: 1,
    opacity: 1,
    y: 0,
    ease: "power2.out"
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('entrarBtn');
  const splash = document.getElementById('splash');
  const contenido = document.getElementById('contenido');
  const overlay = document.getElementById('overlay-brillo');

  btn.addEventListener('click', () => {
    // Mostrar overlay de brillo dorado
    overlay.classList.add('activo');

    // Después del brillo, ocultar splash y mostrar contenido principal
    setTimeout(() => {
      gsap.to(splash, {
        duration: 0.8,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => {
          splash.style.display = 'none';
          contenido.classList.remove('oculto');

          // Animación de inmersión (zoom in)
          gsap.fromTo('.mensaje-contenedor',
            { scale: 1.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
          );
        }
      });
    }, 1200); // duración del overlay-brillo
  });
});

//Confirmacion de Invitados

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyBwxFCwSB_NuzwnqstWm3AHUmK8a8lb2P7DB_vNmLjxL7YZnkx79ubawOR37UbV53E/exec'; // Reemplaza TU_ID con el real

const select = document.getElementById('invitadoSelect');
const confirmBtn = document.getElementById('confirmarBtn');
const qrDiv = document.getElementById('resultadoQR');
const mensajeQR = document.getElementById('mensajeQR');
const qrCanvas = document.getElementById('qrCanvas');

let invitados = [];

// 1. Obtener invitados desde la hoja de Google
fetch(SHEET_API_URL)
  .then(res => res.json())
  .then(data => {
    invitados = data.filter(i => i.Confirmado !== 'Sí'); // Solo los que no han confirmado
    invitados.forEach(i => {
      const option = document.createElement('option');
      option.value = i.Nombre;
      option.textContent = i.Nombre;
      select.appendChild(option);
    });
  });

// 2. Confirmar y generar QR
confirmBtn.addEventListener('click', () => {
  const nombre = select.value;
  const invitado = invitados.find(i => i.Nombre === nombre);

  if (!invitado) return alert("Selecciona un nombre válido.");

  // Enviar confirmación a Google Sheets
  fetch(SHEET_API_URL, {
    method: 'POST',
    body: new URLSearchParams({ Nombre: nombre }),
  });

  // Mostrar sección de QR
const resultadoQR = document.getElementById('resultadoQR');
resultadoQR.classList.add('mostrar');


  // Mostrar datos
  document.getElementById('mensajeQR').textContent = invitado.Mensaje;
  document.getElementById('pasesQR').textContent = invitado.Pases;

  // Limpiar QR anterior
  qrCanvas.innerHTML = '';

  // Generar QR con nivel bajo de corrección
 const textoQR = `${invitado.Nombre} - ${invitado.Pases} pases`;
new QRCode(qrCanvas, {
  text: textoQR,
  width: 200,
  height: 200,
  correctLevel: QRCode.CorrectLevel.L,
  version: 20 // Puedes ajustar esto
});


  // Quitar del select
  select.querySelector(`option[value="${nombre}"]`).remove();
  select.selectedIndex = 0;

  // Descargar QR después de un delay (para asegurar que esté renderizado)
  setTimeout(() => {
    const img = qrCanvas.querySelector('img') || qrCanvas.querySelector('canvas');
    const downloadBtn = document.getElementById('descargarQR');

    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = img.src || img.toDataURL();
      link.download = `QR_${invitado.Nombre.replace(/\s+/g, '_')}.png`;
      link.click();
    };
  }, 500);
});

//Save the Day

document.getElementById('saveDateBtn').addEventListener('click', () => {
  // Detalles del evento
  const titulo = 'Mis XV Años Valentina Olea';
  const descripcion = '¡Acompáñame en este día tan especial!';
  const ubicacion = 'Villafontana, Tehuacán,Puebla';
  const fechaInicio = '20250816T153000'; // YYYYMMDDTHHMMSS
  const fechaFin = '20250816T193000';

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TuInvitacionWeb//ES
BEGIN:VEVENT
SUMMARY:${titulo}
DESCRIPTION:${descripcion}
LOCATION:${ubicacion}
DTSTART:${fechaInicio}
DTEND:${fechaFin}
END:VEVENT
END:VCALENDAR`.trim();

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'invitacion-evento.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
