/* ============================================================
   COMPOSICIÓN · Día del Maestro
   ViewBox 1600x900 (cinematográfico 16:9) para soportar
   collages ricos a pantalla completa.
   ============================================================ */

/* Constantes de canvas */
window.CANVAS = { W: 1600, H: 900, CX: 800, CY: 450 };

window.SVG_FILTERS = function () {
  return `
    <filter id="ds-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
    <filter id="ds-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
    <filter id="ds-mesh" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
    <filter id="ds-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="8"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.32"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="ds-vignette" cx="50%" cy="50%" r="80%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
    </radialGradient>
  `;
};

/* Mesh background para 1600x900 */
window.meshBg = function (p, opts = {}) {
  const [c1, c2, c3] = p.bg;
  const acc = opts.accent || p.accent;
  return `
    <rect width="1600" height="900" fill="${c1}"/>
    <g filter="url(#ds-mesh)" opacity="0.95">
      <ellipse cx="280" cy="180" rx="640" ry="420" fill="${c2}"/>
      <ellipse cx="1380" cy="240" rx="600" ry="420" fill="${c3}"/>
      <ellipse cx="420" cy="780" rx="620" ry="420" fill="${c3}" opacity="0.85"/>
      <ellipse cx="1240" cy="720" rx="640" ry="420" fill="${c2}" opacity="0.85"/>
      <ellipse cx="800" cy="450" rx="460" ry="320" fill="${acc}" opacity="0.18"/>
    </g>
    <rect width="1600" height="900" fill="url(#ds-vignette)"/>
  `;
};

/* SVG root: viewBox 1600x900 */
window.buildCard = function (content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
    <defs>${SVG_FILTERS()}</defs>
    ${content}
  </svg>`;
};

/* Helper para colocar un motivo con transformación */
window.place = function (x, y, scale, rotation, motifContent) {
  const transforms = [];
  if (x !== 0 || y !== 0) transforms.push(`translate(${x} ${y})`);
  if (scale !== 1) transforms.push(`scale(${scale})`);
  if (rotation) transforms.push(`rotate(${rotation})`);
  return `<g transform="${transforms.join(' ')}">${motifContent}</g>`;
};

/* ============================================================
   LAYOUTS · Composiciones orgánicas con SEPARACIÓN VERIFICADA
   Reglas: focal ≤ scale 1.0 (radio efectivo ≤ ~200px),
           satélites scale 0.55-0.85,
           focal-satélite ≥ 380px, satélite-satélite ≥ 280px.
   Cada layout es un arreglo de posiciones {x, y, s, r}.
   ============================================================ */
window.LAYOUTS = [
  // 0: Halo (focal en centro, 8 satélites alrededor, NO alineados)
  [
    {x: 800, y: 460, s: 1.0, r: -2},
    {x: 230, y: 220, s: 0.78, r: -10},
    {x: 1370, y: 210, s: 0.78, r: 12},
    {x: 130, y: 500, s: 0.7, r: 5},
    {x: 1470, y: 540, s: 0.7, r: -6},
    {x: 1290, y: 780, s: 0.7, r: -11},
    {x: 220, y: 780, s: 0.7, r: 8},
    {x: 560, y: 780, s: 0.6, r: -4},
    {x: 800, y: 120, s: 0.55, r: 14}
  ],
  // 1: Anclaje izquierdo + dispersión derecha
  [
    {x: 510, y: 460, s: 0.95, r: -3},
    {x: 1180, y: 280, s: 0.82, r: 8},
    {x: 200, y: 200, s: 0.68, r: -10},
    {x: 1460, y: 180, s: 0.6, r: 14},
    {x: 1340, y: 580, s: 0.74, r: -7},
    {x: 1450, y: 780, s: 0.62, r: -12},
    {x: 820, y: 780, s: 0.68, r: 4},
    {x: 170, y: 750, s: 0.68, r: 9},
    {x: 180, y: 480, s: 0.58, r: -8}
  ],
  // 2: Anclaje derecho + dispersión izquierda
  [
    {x: 1090, y: 460, s: 0.95, r: 3},
    {x: 420, y: 280, s: 0.82, r: -8},
    {x: 1400, y: 200, s: 0.68, r: 10},
    {x: 140, y: 180, s: 0.6, r: -14},
    {x: 260, y: 580, s: 0.74, r: 7},
    {x: 150, y: 780, s: 0.62, r: 12},
    {x: 780, y: 780, s: 0.68, r: -4},
    {x: 1430, y: 750, s: 0.68, r: -9},
    {x: 1420, y: 480, s: 0.58, r: 8}
  ],
  // 3: Cascada diagonal TL → BR
  [
    {x: 800, y: 460, s: 0.95, r: -3},
    {x: 240, y: 220, s: 0.8, r: -10},
    {x: 1230, y: 250, s: 0.68, r: 8},
    {x: 140, y: 530, s: 0.7, r: 5},
    {x: 1370, y: 570, s: 0.74, r: -7},
    {x: 400, y: 770, s: 0.7, r: 11},
    {x: 1180, y: 790, s: 0.72, r: -11},
    {x: 1460, y: 220, s: 0.5, r: 15},
    {x: 760, y: 120, s: 0.5, r: -8}
  ],
  // 4: Dos focos (twin focus)
  [
    {x: 520, y: 430, s: 0.85, r: -3},
    {x: 1140, y: 490, s: 0.85, r: 4},
    {x: 180, y: 220, s: 0.65, r: -10},
    {x: 1450, y: 200, s: 0.62, r: 12},
    {x: 830, y: 160, s: 0.55, r: 2},
    {x: 160, y: 740, s: 0.68, r: 6},
    {x: 1450, y: 770, s: 0.68, r: -11},
    {x: 800, y: 780, s: 0.62, r: 4},
    {x: 1200, y: 200, s: 0.55, r: -8}
  ],
  // 5: Panorama superior
  [
    {x: 800, y: 360, s: 0.95, r: 0},
    {x: 200, y: 230, s: 0.7, r: -10},
    {x: 1400, y: 220, s: 0.7, r: 9},
    {x: 130, y: 620, s: 0.68, r: 5},
    {x: 1470, y: 600, s: 0.68, r: -6},
    {x: 380, y: 780, s: 0.66, r: 11},
    {x: 1220, y: 790, s: 0.66, r: -9},
    {x: 780, y: 780, s: 0.6, r: 0},
    {x: 500, y: 130, s: 0.5, r: 16}
  ],
  // 6: Densidad inferior (focal abajo)
  [
    {x: 800, y: 560, s: 0.95, r: 0},
    {x: 240, y: 290, s: 0.78, r: -11},
    {x: 1360, y: 270, s: 0.78, r: 11},
    {x: 600, y: 140, s: 0.6, r: -6},
    {x: 1020, y: 140, s: 0.6, r: 8},
    {x: 140, y: 600, s: 0.66, r: -4},
    {x: 1470, y: 600, s: 0.66, r: 5},
    {x: 360, y: 790, s: 0.58, r: -13},
    {x: 1250, y: 800, s: 0.58, r: 10}
  ],
  // 7: Espiral áurea
  [
    {x: 760, y: 460, s: 0.9, r: 4},
    {x: 1200, y: 250, s: 0.75, r: -8},
    {x: 1370, y: 690, s: 0.72, r: 12},
    {x: 380, y: 760, s: 0.72, r: -5},
    {x: 140, y: 470, s: 0.7, r: 9},
    {x: 380, y: 170, s: 0.72, r: -12},
    {x: 880, y: 120, s: 0.5, r: 6},
    {x: 1460, y: 450, s: 0.5, r: -10},
    {x: 150, y: 760, s: 0.5, r: 15}
  ],
  // 8: Cielo sobre cordillera (todo y ≤ 430, separación verificada)
  [
    {x: 800, y: 290, s: 0.8, r: 0},
    {x: 220, y: 180, s: 0.7, r: -8},
    {x: 1380, y: 180, s: 0.7, r: 8},
    {x: 180, y: 420, s: 0.5, r: 10},
    {x: 1420, y: 420, s: 0.5, r: -10},
    {x: 450, y: 400, s: 0.5, r: 8},
    {x: 1150, y: 400, s: 0.5, r: -8},
    {x: 560, y: 130, s: 0.5, r: -5},
    {x: 1040, y: 130, s: 0.5, r: 5}
  ]
];

/* Factor global de escala para las figuras (no afecta posiciones).
   Por defecto = 1.4 — figuras más presentes tanto en galería como en
   card view. card-view.js lo sube un poco más para fullscreen. */
window.FIGURE_SCALE = 1.4;

/* Aplica un layout orgánico a una lista de motivos pre-renderizados.
   items: array de strings SVG (cada uno es un motivo ya generado).
   idx: índice del layout a usar (0..LAYOUTS.length-1).
   Variaciones opcionales por motivo con overrides[i] = {dx, dy, ds, dr}. */
window.compose = function (items, idx, overrides = []) {
  const layout = LAYOUTS[idx % LAYOUTS.length];
  const gScale = window.FIGURE_SCALE || 1;
  return items.slice(0, layout.length).map((m, i) => {
    if (!m) return '';
    const p = layout[i];
    const o = overrides[i] || {};
    const x = p.x + (o.dx || 0);
    const y = p.y + (o.dy || 0);
    const s = p.s * (o.ds || 1) * gScale;
    const r = p.r + (o.dr || 0);
    return place(x, y, s, r, m);
  }).join('');
};

/* Stub deprecado */
window.grainOverlay = function () { return ''; };
