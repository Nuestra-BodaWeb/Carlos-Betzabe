// ======================
// CONFIGURA AQUÍ
// ======================
const DATA = {
  novios: { a: "Carlos", b: "Betzabe" },
  // Usa tu fecha y hora reales en formato ISO con zona horaria de Perú (-05:00)
  fechaISO: "2026-01-10T17:00:00-05:00",
  fechaLegible: "Sábado 10 de enero — 5:00 pm",
  lugar: "Hacienda Los Sueños",
  direccion: "Av. Siempre Viva 123, Surco — Lima",
  googleMapsUrl: "https://maps.google.com/?q=Hacienda+Los+Sue%C3%B1os+Lima",
  whatsappNum: "51999999999", // sin +, con código de país (51 Perú)
  whatsappMsg: "Hola, confirmo mi asistencia a la boda 😊",
};

// ======================
// APLICAR DATOS EN LA UI
// ======================
const $ = (s) => document.querySelector(s);

$("#novios").textContent = `${DATA.novios.a} & ${DATA.novios.b}`;
$("#subtitulo").textContent = "¡Nos casamos!";


// ======================
/* CONTADOR */
// ======================
const root = document.getElementById("contador");

function updateCountdown() {
  const t = new Date(DATA.fechaISO).getTime() - Date.now();
  if (t <= 0) {
    root.innerHTML =
      '<div class="time"><span class="num">🎉</span><span class="lab">¡HOY!</span></div>';
    return;
  }
  const d = Math.floor(t / 86400000);
  const h = Math.floor((t % 86400000) / 3600000);
  const m = Math.floor((t % 3600000) / 60000);
  const s = Math.floor((t % 60000) / 1000);

  const blocks = [
    { n: d, l: "DÍAS" },
    { n: h, l: "HORAS" },
    { n: m, l: "MINUTOS" },
    { n: s, l: "SEGUNDOS" },
  ];
  root.innerHTML = blocks
    .map(
      (b) => `
    <div class="time">
      <span class="num">${String(b.n).padStart(2, "0")}</span>
      <span class="lab">${b.l}</span>
    </div>`
    )
    .join("");
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ======================
// ===== Calendario (genera el mes de la fecha de DATA.fechaISO) =====
function buildCalendar(containerId, dateISO){
  const el = document.getElementById(containerId);
  if (!el) return;

  const d = new Date(dateISO);
  const year = d.getFullYear();
  const month = d.getMonth();      // 0=enero
  const eventDay = d.getDate();

  const first = new Date(year, month, 1);
  const start = first.getDay();    // 0=Dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = `
    <div class="cal-head">
      <span class="cal-month">${d.toLocaleDateString('es-ES', {month:'long'}).toUpperCase()}</span>
      <span class="cal-year">${year}</span>
    </div>
    <div class="cal-grid">
  `;

  const DOW = ['DOM','LUN','MAR','MIE','JUE','VIE','SAB'];
  for (const w of DOW) html += `<div class="cell head">${w}</div>`;

  // huecos antes del 1
  for (let i=0;i<start;i++) html += `<div class="cell empty"></div>`;

  // días del mes
  for (let day=1; day<=daysInMonth; day++){
    const cls = day === eventDay ? 'cell day highlight' : 'cell day';
    html += `<div class="${cls}">${day}</div>`;
  }

  // huecos finales para completar la última fila
  const bodyCells = start + daysInMonth;
  const trailing = (7 - (bodyCells % 7)) % 7;
  for (let i=0;i<trailing;i++) html += `<div class="cell empty"></div>`;

  html += `</div>`;
  el.innerHTML = html;
}

// Llama al generador con la fecha de tu evento
buildCalendar('calendario', DATA.fechaISO);







  const audio   = document.getElementById('bgAudio');
  const btn     = document.getElementById('audioToggle');
  const track   = document.getElementById('audioTrack');
  const progress= document.getElementById('audioProgress');
  const timeEl  = document.getElementById('audioTime');

  function fmt(t){ const m=Math.floor(t/60); const s=Math.floor(t%60).toString().padStart(2,'0'); return `${m}:${s}`; }

  btn.addEventListener('click', () => {
    if (audio.paused){ audio.play(); btn.dataset.state='pause'; btn.ariaLabel='Pausar'; }
    else             { audio.pause(); btn.dataset.state='play';  btn.ariaLabel='Reproducir'; }
  });

  audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    progress.style.width = pct + '%';
    timeEl.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => { timeEl.textContent = '0:00'; });
  audio.addEventListener('ended', () => { btn.dataset.state='play'; });

  track.addEventListener('click', (e) => {
    const r = track.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - r.left), r.width);
    audio.currentTime = (x / r.width) * (audio.duration || 0);
  });
