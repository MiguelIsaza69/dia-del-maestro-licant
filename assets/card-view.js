/* ============================================================
   CARD VIEW · Día del Maestro
   Fondo difuminado + panel central con mensaje hermoso
   Navegación con botones, teclado y Esc.
   ============================================================ */

/* Frase de apertura personalizada por materia */
const SUBJECT_POEMS = {
  "Matemáticas":
    "En tus números no hay frío: hay belleza, hay orden, hay una verdad que sólo tú sabes contar.",
  "Física":
    "Enseñas a leer las leyes del universo en los gestos más pequeños de la materia.",
  "Química":
    "Mostraste que toda transformación empieza con un ingrediente: la curiosidad.",
  "Ciencias Naturales":
    "Hiciste de cada hoja, cada célula, cada estrella, una invitación al asombro.",
  "Castellano":
    "Pusiste palabras donde no las había, y diste voz a quienes apenas empezaban a pensar.",
  "Inglés":
    "Abriste una puerta, y detrás había un mundo entero por descubrir.",
  "Música":
    "En tus notas, cada estudiante encontró su propio compás.",
  "Ciencias Sociales":
    "Enseñaste que la historia no se memoriza: se hereda, se cuestiona y se transforma.",
  "Eco-Política":
    "Mostraste que entender el mundo es el primer paso valiente para empezar a cambiarlo.",
  "Filosofía":
    "Nos enseñaste lo más raro y lo más valioso: el arte de preguntar.",
  "Religión":
    "Diste paz donde había ruido, sentido donde había prisa, y refugio donde faltaban respuestas.",
  "Educación Física":
    "En cada salto, en cada carrera, sembraste disciplina y fuerza para toda la vida.",
  "Tec-Informática":
    "Tradujiste el lenguaje del futuro y nos enseñaste —con paciencia— a hablarlo.",
  "Artes Visuales":
    "Demostraste que toda mirada se convierte en arte cuando se la mira con paciencia.",
  "Emprendimiento":
    "Encendiste la chispa de quienes hoy se atreven a soñar en grande."
};

/* Cuerpo poético común — universal y emotivo */
const COMMON_POEM =
`Hay manos que escriben en pizarras,
y otras que escriben en personas.

En cada mente que tocaste
queda una huella que el tiempo no borra.

Tu vocación es semilla,
tu pasión, raíz,
tu sabiduría, refugio.

Hoy, todos los que aprendieron a tu lado
te devuelven —en un solo aplauso—
el orgullo que siempre sembraste en ellos.`;

function getPoemFor(subject) {
  return SUBJECT_POEMS[subject] ||
    "Tu vocación dejó huella en cada estudiante que tuvo la fortuna de pasar por tu aula.";
}

(function () {
  const stage = document.querySelector('.card-stage-full');
  if (!stage || !window.teachers) return;

  // En la card view fullscreen las figuras se renderizan un poco más grandes que en galería
  window.FIGURE_SCALE = 1.6;

  const params = new URLSearchParams(location.search);
  let id = parseInt(params.get('id'));
  if (isNaN(id) || id < 0 || id >= window.teachers.length) id = 0;

  const els = {
    art: document.getElementById('card-art'),
    name: document.getElementById('card-name'),
    subject: document.getElementById('card-subject'),
    poemSpecial: document.getElementById('card-poem-special'),
    poemBody: document.getElementById('card-poem'),
    cur: document.getElementById('cur'),
    total: document.getElementById('total'),
    panel: document.querySelector('.card-message-inner'),
    prev: document.getElementById('prev'),
    next: document.getElementById('next')
  };

  if (els.total) els.total.textContent = String(window.teachers.length).padStart(2, '0');

  // Cache de URLs blob de cada SVG. Al usarlo como <img src>, el navegador
  // rasteriza una sola vez y aplica filtros sobre el bitmap (mucho más rápido
  // que filtrar un SVG inline con muchos sub-filtros).
  const urlCache = new Array(window.teachers.length);
  const getUrl = (i) => {
    if (!urlCache[i]) {
      // Asegura width/height en el <svg> para que el <img> lo dimensione bien
      const svgStr = window.teachers[i].svg()
        .replace('<svg ', '<svg width="1600" height="900" ');
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      urlCache[i] = URL.createObjectURL(blob);
    }
    return urlCache[i];
  };

  // Una sola <img> que cambia de src — evita reparsing y reconstrucción del DOM
  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  img.loading = 'eager';
  els.art.innerHTML = '';
  els.art.appendChild(img);

  // Pre-rasterizado en background del resto de cartas
  const warmCache = () => {
    let i = 0;
    const step = () => {
      while (i < window.teachers.length && urlCache[i]) i++;
      if (i >= window.teachers.length) return;
      // Genera el blob URL y pide al navegador que lo decodifique a bitmap
      const url = getUrl(i++);
      const probe = new Image();
      probe.src = url;
      (window.requestIdleCallback || setTimeout)(step, 30);
    };
    step();
  };

  function paint(i) {
    const t = window.teachers[i];
    img.src = getUrl(i);
    els.name.textContent = t.name;
    const mainSubject = t.mainSubject || t.subject;
    els.subject.textContent = mainSubject;
    if (els.poemSpecial) els.poemSpecial.textContent = getPoemFor(mainSubject);
    if (els.poemBody) els.poemBody.textContent = COMMON_POEM;
    if (els.cur) els.cur.textContent = String(i + 1).padStart(2, '0');
    document.title = `Carta · ${t.name}`;
    const url = new URL(location.href);
    url.searchParams.set('id', i);
    history.replaceState(null, '', url);
    id = i;
  }

  function animateIn() {
    if (typeof gsap === 'undefined') return;
    // Solo opacidad (no scale) — más barato y evita re-pintar el filter blur
    gsap.fromTo(els.art, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    gsap.fromTo(els.panel,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, delay: 0.1, ease: 'power3.out' }
    );
  }

  function navigate(nextId) {
    if (typeof gsap === 'undefined') { paint(nextId); return; }
    gsap.to([els.art, els.panel], {
      opacity: 0, duration: 0.18, ease: 'power2.in',
      onComplete: () => { paint(nextId); animateIn(); }
    });
  }

  els.prev && (els.prev.onclick = () => navigate((id - 1 + window.teachers.length) % window.teachers.length));
  els.next && (els.next.onclick = () => navigate((id + 1) % window.teachers.length));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate((id - 1 + window.teachers.length) % window.teachers.length);
    if (e.key === 'ArrowRight') navigate((id + 1) % window.teachers.length);
    if (e.key === 'Escape') location.href = 'index.html';
  });

  paint(id);
  animateIn();
  // Pre-calentar el cache una vez que la primera carta está visible
  (window.requestIdleCallback || setTimeout)(warmCache, 400);
})();
