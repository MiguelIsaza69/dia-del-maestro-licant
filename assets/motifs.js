/* ============================================================
   MOTIVOS · Día del Maestro · v3 (Collage)
   Biblioteca extensa de íconos editoriales por materia,
   diseñados para reconocerse en thumbnails y a pantalla completa.

   Convención: motivos centrados en (0,0). Posicionar con
   <g transform="translate(x y) scale(s) rotate(r)">.
   ViewBox del canvas: 1600x900.
   ============================================================ */

/* Helpers internos para realismo: UIDs y gradientes inline */
let _uidCounter = 1000;
function _uid(prefix) { return `${prefix}-${++_uidCounter}`; }

/* Mezclador rápido de colores: hex+hex → mezcla en proporción t (0..1) */
function _mix(a, b, t) {
  const pa = a.replace('#',''); const pb = b.replace('#','');
  const ra = parseInt(pa.substring(0,2),16), ga = parseInt(pa.substring(2,4),16), ba = parseInt(pa.substring(4,6),16);
  const rb = parseInt(pb.substring(0,2),16), gb = parseInt(pb.substring(2,4),16), bb = parseInt(pb.substring(4,6),16);
  const r = Math.round(ra + (rb-ra)*t), g = Math.round(ga + (gb-ga)*t), bC = Math.round(ba + (bb-ba)*t);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${bC.toString(16).padStart(2,'0')}`;
}

/* Mancha de luz especular reutilizable: un highlight blanco suave */
function _shine(cx, cy, rx, ry, op = 0.45, rot = 0) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ffffff" opacity="${op}" transform="rotate(${rot} ${cx} ${cy})"/>`;
}

/* Sombra de contacto debajo de un objeto */
function _contactShadow(y, rx, ry, op = 0.25) {
  return `<ellipse cx="0" cy="${y}" rx="${rx}" ry="${ry}" fill="#000" opacity="${op}" filter="url(#ds-glow-sm)"/>`;
}

window.M = {

  /* =====================================================
     ATMÓSFERA · 1600x900
     ===================================================== */

  dust: (count = 40, color = '#ffffff', maxR = 1.6, seed = 7) => {
    let s = ''; let n = seed;
    const r = () => { n = (n * 9301 + 49297) % 233280; return n / 233280; };
    for (let i = 0; i < count; i++) {
      const x = r() * 1600, y = r() * 900;
      const rad = r() * maxR + 0.4;
      const o = r() * 0.4 + 0.15;
      s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(2)}" fill="${color}" opacity="${o.toFixed(2)}"/>`;
    }
    return s;
  },

  starfield: (count = 36, color = '#f5ede0', maxR = 2.2, seed = 42) => {
    let s = ''; let n = seed;
    const r = () => { n = (n * 9301 + 49297) % 233280; return n / 233280; };
    for (let i = 0; i < count; i++) {
      const x = r() * 1600, y = r() * 900;
      const rad = r() * maxR + 0.6;
      const o = r() * 0.6 + 0.4;
      s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rad.toFixed(2)}" fill="${color}" opacity="${o.toFixed(2)}"/>`;
    }
    return s;
  },

  lightRays: (color = '#fff', count = 16, length = 280, opacity = 0.2) => {
    let s = '';
    for (let i = 0; i < count; i++) {
      const a = (i * 360 / count) * Math.PI / 180;
      const x2 = Math.cos(a) * length, y2 = Math.sin(a) * length;
      s += `<line x1="0" y1="0" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="1.2" opacity="${opacity}" stroke-linecap="round"/>`;
    }
    return `<g>${s}</g>`;
  },

  glow: (r = 120, color = '#fff', op = 0.25) =>
    `<circle r="${r}" fill="${color}" opacity="${op}" filter="url(#ds-glow)"/>`,

  /* =====================================================
     FORMAS BÁSICAS
     ===================================================== */

  star4: (size = 20, fill = '#fff', opacity = 1) => `
    <g opacity="${opacity}">
      <path d="M0 ${-size} C ${size*0.1} ${-size*0.2}, ${size*0.2} ${-size*0.1}, ${size} 0
               C ${size*0.2} ${size*0.1}, ${size*0.1} ${size*0.2}, 0 ${size}
               C ${-size*0.1} ${size*0.2}, ${-size*0.2} ${size*0.1}, ${-size} 0
               C ${-size*0.2} ${-size*0.1}, ${-size*0.1} ${-size*0.2}, 0 ${-size} Z" fill="${fill}"/>
    </g>`,

  star5: (size = 30, fill = '#fff') => {
    let pts = '';
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? size : size * 0.4;
      const a = (i * 36 - 90) * Math.PI / 180;
      pts += `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
    }
    return `<polygon points="${pts}" fill="${fill}"/>`;
  },

  polygon: (sides = 6, size = 50, fill = '#fff', strokeWidth = 0, stroke = 'none') => {
    let pts = '';
    for (let i = 0; i < sides; i++) {
      const a = (i * 360 / sides - 90) * Math.PI / 180;
      pts += `${(Math.cos(a) * size).toFixed(2)},${(Math.sin(a) * size).toFixed(2)} `;
    }
    return `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
  },

  /* =====================================================
     SOL / LUNA / NUBES
     ===================================================== */

  sun: (radius = 80, fill = '#f5e8a8', rays = true) => `
    <g>
      ${rays ? (() => {
        let s = '';
        for (let i = 0; i < 12; i++) {
          const a = (i * 30) * Math.PI / 180;
          const x1 = Math.cos(a) * radius * 1.35, y1 = Math.sin(a) * radius * 1.35;
          const x2 = Math.cos(a) * radius * 1.75, y2 = Math.sin(a) * radius * 1.75;
          s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${fill}" stroke-width="2.5" stroke-linecap="round" opacity="0.65"/>`;
        }
        return `<g>${s}</g>`;
      })() : ''}
      <circle r="${radius * 1.9}" fill="${fill}" opacity="0.15" filter="url(#ds-glow)"/>
      <circle r="${radius}" fill="${fill}"/>
    </g>`,

  moon: (radius = 80, fill = '#fff0c5', shadow = '#3a3a4a') => `
    <g>
      <circle r="${radius * 1.7}" fill="${fill}" opacity="0.12" filter="url(#ds-glow)"/>
      <circle r="${radius}" fill="${fill}"/>
      <circle cx="${-radius*0.25}" cy="${-radius*0.18}" r="${radius*0.12}" fill="${shadow}" opacity="0.2"/>
      <circle cx="${radius*0.32}" cy="${radius*0.22}" r="${radius*0.08}" fill="${shadow}" opacity="0.18"/>
    </g>`,

  cloud: (size = 100, fill = '#fff8f0', opacity = 0.85) => `
    <g opacity="${opacity}">
      <ellipse cx="${-size*0.4}" cy="0" rx="${size*0.32}" ry="${size*0.28}" fill="${fill}"/>
      <ellipse cx="${-size*0.1}" cy="${-size*0.12}" rx="${size*0.4}" ry="${size*0.34}" fill="${fill}"/>
      <ellipse cx="${size*0.22}" cy="${-size*0.02}" rx="${size*0.34}" ry="${size*0.3}" fill="${fill}"/>
      <ellipse cx="${size*0.48}" cy="${size*0.08}" rx="${size*0.26}" ry="${size*0.22}" fill="${fill}"/>
      <ellipse cx="0" cy="${size*0.12}" rx="${size*0.65}" ry="${size*0.15}" fill="${fill}"/>
    </g>`,

  /* =====================================================
     ████████  MATEMÁTICAS  ████████
     ===================================================== */

  // Plano cartesiano
  cartesian: (size = 180, palette) => {
    let grid = '';
    const step = size / 5;
    for (let i = -5; i <= 5; i++) {
      grid += `<line x1="${i*step}" y1="${-size}" x2="${i*step}" y2="${size}" stroke="${palette.ink}" stroke-width="0.8" opacity="0.18"/>`;
      grid += `<line x1="${-size}" y1="${i*step}" x2="${size}" y2="${i*step}" stroke="${palette.ink}" stroke-width="0.8" opacity="0.18"/>`;
    }
    return `<g>
      <rect x="${-size}" y="${-size}" width="${size*2}" height="${size*2}" fill="${palette.ink}" opacity="0.04"/>
      ${grid}
      <line x1="${-size}" y1="0" x2="${size}" y2="0" stroke="${palette.accent}" stroke-width="2.2" opacity="0.9"/>
      <line x1="0" y1="${-size}" x2="0" y2="${size}" stroke="${palette.accent}" stroke-width="2.2" opacity="0.9"/>
      <polygon points="${size},0 ${size-14},-8 ${size-14},8" fill="${palette.accent}"/>
      <polygon points="0,${-size} -8,${-size+14} 8,${-size+14}" fill="${palette.accent}"/>
    </g>`;
  },

  // Curva de función
  functionCurve: (size = 200, color = '#fff', type = 'parabola') => {
    let d;
    if (type === 'sine') d = `M ${-size} 0 Q ${-size*0.5} ${-size*0.75}, 0 0 T ${size} 0`;
    else d = `M ${-size} ${size*0.65} Q 0 ${-size*0.85}, ${size} ${size*0.65}`;
    return `<path d="${d}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  },

  // Compás
  compass: (size = 160, palette) => `
    <g>
      <line x1="0" y1="${-size}" x2="${-size*0.42}" y2="${size*0.55}" stroke="${palette.ink}" stroke-width="${size*0.05}" stroke-linecap="round"/>
      <line x1="0" y1="${-size}" x2="${size*0.42}" y2="${size*0.55}" stroke="${palette.ink}" stroke-width="${size*0.05}" stroke-linecap="round"/>
      <circle cx="0" cy="${-size}" r="${size*0.1}" fill="${palette.accent}"/>
      <circle cx="${-size*0.42}" cy="${size*0.55}" r="${size*0.05}" fill="${palette.accent}"/>
      <polygon points="${size*0.32},${size*0.5} ${size*0.5},${size*0.5} ${size*0.42},${size*0.7}" fill="${palette.accent}"/>
      <path d="M ${-size*0.55} ${size*0.7} Q 0 ${size*0.95}, ${size*0.55} ${size*0.7}" stroke="${palette.accent2}" stroke-width="2" fill="none" stroke-dasharray="3 5" opacity="0.7"/>
    </g>`,

  // Símbolo π (geométrico)
  piSymbol: (size = 100, color = '#fff') => `
    <g fill="${color}">
      <rect x="${-size*0.55}" y="${-size*0.5}" width="${size*1.1}" height="${size*0.18}" rx="2"/>
      <rect x="${-size*0.35}" y="${-size*0.4}" width="${size*0.16}" height="${size*0.9}" rx="2"/>
      <rect x="${size*0.2}" y="${-size*0.4}" width="${size*0.16}" height="${size*0.85}"/>
      <path d="M ${size*0.36} ${size*0.4} Q ${size*0.5} ${size*0.5}, ${size*0.55} ${size*0.35}" stroke="${color}" stroke-width="${size*0.14}" fill="none" stroke-linecap="round"/>
    </g>`,

  // Símbolo infinito ∞
  infinitySymbol: (size = 100, color = '#fff') => `
    <path d="M ${-size*0.55} 0
             C ${-size*0.55} ${-size*0.45}, ${-size*0.15} ${-size*0.45}, 0 0
             C ${size*0.15} ${size*0.45}, ${size*0.55} ${size*0.45}, ${size*0.55} 0
             C ${size*0.55} ${-size*0.45}, ${size*0.15} ${-size*0.45}, 0 0
             C ${-size*0.15} ${size*0.45}, ${-size*0.55} ${size*0.45}, ${-size*0.55} 0 Z"
          fill="none" stroke="${color}" stroke-width="${size*0.15}" stroke-linecap="round" stroke-linejoin="round"/>`,

  // Triángulo de Pitágoras (con cuadrado del ángulo recto)
  pythagoras: (size = 120, palette) => `
    <g>
      <polygon points="${-size*0.6},${size*0.45} ${size*0.6},${size*0.45} ${-size*0.6},${-size*0.55}" fill="${palette.accent}" opacity="0.85"/>
      <path d="M${-size*0.6},${size*0.45} L${size*0.6},${size*0.45} L${-size*0.6},${-size*0.55} Z" fill="none" stroke="${palette.ink}" stroke-width="2.5"/>
      <rect x="${-size*0.6}" y="${size*0.3}" width="${size*0.15}" height="${size*0.15}" fill="none" stroke="${palette.ink}" stroke-width="1.8"/>
      <!-- letras de catetos a, b, c representadas como puntos -->
      <circle cx="${-size*0.6}" cy="${-size*0.05}" r="3" fill="${palette.accent2}"/>
      <circle cx="0" cy="${size*0.45}" r="3" fill="${palette.accent2}"/>
      <circle cx="0" cy="${-size*0.05}" r="3" fill="${palette.accent2}"/>
    </g>`,

  // Ábaco (marco de madera, varillas metálicas, bolitas pulidas agrupadas)
  abacus: (size = 140, palette) => {
    const uw = _uid('ab-w');
    let s = `<defs>
      <linearGradient id="${uw}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#7a5028"/>
        <stop offset="50%" stop-color="#4d2c10"/>
        <stop offset="100%" stop-color="#2a1808"/>
      </linearGradient>
    </defs>`;
    s += `<ellipse cx="0" cy="${size*0.58}" rx="${size*0.74}" ry="${size*0.04}" fill="#000" opacity="0.35"/>`;
    // marco de madera exterior
    s += `<rect x="${-size*0.72}" y="${-size*0.52}" width="${size*1.44}" height="${size*1.04}" rx="${size*0.04}" fill="url(#${uw})"/>`;
    // highlight superior
    s += `<rect x="${-size*0.72}" y="${-size*0.52}" width="${size*1.44}" height="${size*0.04}" rx="${size*0.04}" fill="#ffffff" opacity="0.2"/>`;
    // panel interior
    s += `<rect x="${-size*0.64}" y="${-size*0.44}" width="${size*1.28}" height="${size*0.88}" rx="${size*0.015}" fill="${_mix('#4d2c10', '#000', 0.4)}"/>`;
    // travesaño vertical central (separador)
    s += `<rect x="${-size*0.025}" y="${-size*0.5}" width="${size*0.05}" height="${size*1.0}" fill="url(#${uw})"/>`;
    s += `<line x1="${-size*0.015}" y1="${-size*0.48}" x2="${-size*0.015}" y2="${size*0.48}" stroke="#ffffff" stroke-width="${size*0.004}" opacity="0.35"/>`;
    // 4 varillas con bolitas
    const beadColors = ['#b3354c', '#f5c842', '#5b9aff', '#4d6b2e'];
    const beadR = size * 0.055;
    const beadGap = size * 0.13;
    const rodStart = -size * 0.58;
    const rodEnd = size * 0.58;
    for (let row = 0; row < 4; row++) {
      const y = -size*0.3 + row * size*0.2;
      // varilla metálica
      s += `<line x1="${rodStart}" y1="${y}" x2="${rodEnd}" y2="${y}" stroke="#c0a070" stroke-width="${size*0.012}" stroke-linecap="round"/>`;
      s += `<line x1="${rodStart}" y1="${y - size*0.003}" x2="${rodEnd}" y2="${y - size*0.003}" stroke="#fff" stroke-width="${size*0.003}" opacity="0.55"/>`;
      const color = beadColors[row % beadColors.length];
      const dark = _mix(color, '#000', 0.45);
      // bolitas a la izquierda del separador (cantidad varía por fila)
      const leftCount = 2 + (row % 3);
      for (let b = 0; b < leftCount; b++) {
        const x = rodStart + beadR + b * beadGap;
        s += `<circle cx="${x.toFixed(2)}" cy="${y}" r="${beadR}" fill="${dark}"/>`;
        s += `<circle cx="${x.toFixed(2)}" cy="${y}" r="${(beadR*0.85).toFixed(2)}" fill="${color}"/>`;
        s += `<ellipse cx="${(x - beadR*0.3).toFixed(2)}" cy="${(y - beadR*0.3).toFixed(2)}" rx="${(beadR*0.32).toFixed(2)}" ry="${(beadR*0.18).toFixed(2)}" fill="#ffffff" opacity="0.6"/>`;
      }
      // bolitas a la derecha del separador
      const rightCount = 5 - (row % 3);
      for (let b = 0; b < rightCount; b++) {
        const x = rodEnd - beadR - b * beadGap;
        s += `<circle cx="${x.toFixed(2)}" cy="${y}" r="${beadR}" fill="${dark}"/>`;
        s += `<circle cx="${x.toFixed(2)}" cy="${y}" r="${(beadR*0.85).toFixed(2)}" fill="${color}"/>`;
        s += `<ellipse cx="${(x - beadR*0.3).toFixed(2)}" cy="${(y - beadR*0.3).toFixed(2)}" rx="${(beadR*0.32).toFixed(2)}" ry="${(beadR*0.18).toFixed(2)}" fill="#ffffff" opacity="0.6"/>`;
      }
    }
    return `<g>${s}</g>`;
  },

  // Calculadora
  calculator: (size = 120, palette) => `
    <g>
      <rect x="${-size*0.6}" y="${-size*0.8}" width="${size*1.2}" height="${size*1.6}" rx="${size*0.06}" fill="${palette.bg[0]}" opacity="0.9"/>
      <rect x="${-size*0.5}" y="${-size*0.7}" width="${size}" height="${size*0.3}" rx="${size*0.02}" fill="${palette.accent2}" opacity="0.85"/>
      ${(() => {
        let g = '';
        for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
          const x = -size*0.42 + c * size*0.32;
          const y = -size*0.32 + r * size*0.28;
          g += `<rect x="${x}" y="${y}" width="${size*0.22}" height="${size*0.18}" rx="${size*0.03}" fill="${palette.accent}" opacity="0.85"/>`;
        }
        return g;
      })()}
    </g>`,

  // Suma/Resta/Mult/Div como icono
  operationSymbols: (size = 100, color = '#fff') => `
    <g fill="${color}" opacity="0.9">
      <g transform="translate(${-size*0.4} ${-size*0.4})">
        <rect x="${-size*0.06}" y="${-size*0.18}" width="${size*0.12}" height="${size*0.36}" rx="2"/>
        <rect x="${-size*0.18}" y="${-size*0.06}" width="${size*0.36}" height="${size*0.12}" rx="2"/>
      </g>
      <g transform="translate(${size*0.4} ${-size*0.4})">
        <rect x="${-size*0.18}" y="${-size*0.06}" width="${size*0.36}" height="${size*0.12}" rx="2"/>
      </g>
      <g transform="translate(${-size*0.4} ${size*0.4})">
        <circle cx="0" cy="${-size*0.16}" r="${size*0.04}"/>
        <rect x="${-size*0.18}" y="${-size*0.03}" width="${size*0.36}" height="${size*0.06}" rx="1"/>
        <circle cx="0" cy="${size*0.16}" r="${size*0.04}"/>
      </g>
      <g transform="translate(${size*0.4} ${size*0.4}) rotate(45)">
        <rect x="${-size*0.16}" y="${-size*0.05}" width="${size*0.32}" height="${size*0.1}" rx="1"/>
        <rect x="${-size*0.05}" y="${-size*0.16}" width="${size*0.1}" height="${size*0.32}" rx="1"/>
      </g>
    </g>`,

  // Mandala de pétalos
  flowerPetals: (count = 12, length = 180, width = 32, fill = '#fff', opacity = 0.18) => {
    let g = '';
    for (let i = 0; i < count; i++) {
      g += `<ellipse cx="0" cy="${-length*0.55}" rx="${width}" ry="${length*0.5}" transform="rotate(${i*360/count})"/>`;
    }
    return `<g fill="${fill}" opacity="${opacity}">${g}</g>`;
  },

  /* =====================================================
     ████████  FÍSICA  ████████
     ===================================================== */

  // Modelo de Bohr (núcleo brillante, electrones pulidos con halo y estela)
  atom: (radius = 180, palette) => {
    const ucore = _uid('atm-c'); const ue = _uid('atm-e');
    return `<g>
      <defs>
        <radialGradient id="${ucore}" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="40%" stop-color="${palette.accent2}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${_mix(palette.accent2, palette.ink, 0.5)}" stop-opacity="1"/>
        </radialGradient>
        <radialGradient id="${ue}" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="60%" stop-color="${palette.accent}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${_mix(palette.accent, '#000', 0.4)}" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <!-- nuclear glow -->
      <circle r="${radius*0.8}" fill="${palette.accent2}" opacity="0.12" filter="url(#ds-glow)"/>
      <!-- orbits with subtle stroke shadow then bright stroke -->
      <ellipse rx="${radius}" ry="${radius*0.36}" fill="none" stroke="${palette.ink}" stroke-width="4" opacity="0.35"/>
      <ellipse rx="${radius}" ry="${radius*0.36}" fill="none" stroke="${palette.accent}" stroke-width="2.4" opacity="0.95"/>
      <ellipse rx="${radius}" ry="${radius*0.36}" fill="none" stroke="${palette.ink}" stroke-width="4" opacity="0.35" transform="rotate(60)"/>
      <ellipse rx="${radius}" ry="${radius*0.36}" fill="none" stroke="${palette.accent}" stroke-width="2.4" opacity="0.95" transform="rotate(60)"/>
      <ellipse rx="${radius}" ry="${radius*0.36}" fill="none" stroke="${palette.ink}" stroke-width="4" opacity="0.35" transform="rotate(120)"/>
      <ellipse rx="${radius}" ry="${radius*0.36}" fill="none" stroke="${palette.accent}" stroke-width="2.4" opacity="0.95" transform="rotate(120)"/>
      <!-- nucleus: cluster of protons/neutrons -->
      <g>
        <circle cx="${-radius*0.04}" cy="${-radius*0.04}" r="${radius*0.08}" fill="url(#${ucore})"/>
        <circle cx="${radius*0.05}" cy="${-radius*0.03}" r="${radius*0.07}" fill="${_mix(palette.accent2, palette.ink, 0.3)}"/>
        <circle cx="${-radius*0.02}" cy="${radius*0.05}" r="${radius*0.07}" fill="url(#${ucore})"/>
        <circle cx="${radius*0.04}" cy="${radius*0.05}" r="${radius*0.065}" fill="${_mix(palette.accent2, palette.ink, 0.3)}"/>
        <circle cx="${-radius*0.06}" cy="${-radius*0.02}" r="${radius*0.022}" fill="#ffffff" opacity="0.7"/>
      </g>
      <!-- electrons with motion trails -->
      <g>
        <path d="M ${radius*0.7} ${radius*0.26} A ${radius} ${radius*0.36} 0 0 1 ${radius*0.95} ${radius*0.13}" stroke="${palette.accent}" stroke-width="${radius*0.04}" fill="none" opacity="0.35" stroke-linecap="round"/>
        <circle cx="${radius*0.92}" cy="${radius*0.17}" r="${radius*0.07}" fill="url(#${ue})"/>
        <circle cx="${radius*0.9}" cy="${radius*0.15}" r="${radius*0.02}" fill="#ffffff" opacity="0.85"/>
      </g>
      <g transform="rotate(120)">
        <path d="M ${radius*0.7} ${radius*0.26} A ${radius} ${radius*0.36} 0 0 1 ${radius*0.95} ${radius*0.13}" stroke="${palette.accent}" stroke-width="${radius*0.04}" fill="none" opacity="0.35" stroke-linecap="round"/>
        <circle cx="${radius*0.92}" cy="${radius*0.17}" r="${radius*0.065}" fill="url(#${ue})"/>
        <circle cx="${radius*0.9}" cy="${radius*0.15}" r="${radius*0.018}" fill="#ffffff" opacity="0.85"/>
      </g>
      <g transform="rotate(240)">
        <path d="M ${radius*0.7} ${radius*0.26} A ${radius} ${radius*0.36} 0 0 1 ${radius*0.95} ${radius*0.13}" stroke="${palette.accent}" stroke-width="${radius*0.04}" fill="none" opacity="0.35" stroke-linecap="round"/>
        <circle cx="${radius*0.92}" cy="${radius*0.17}" r="${radius*0.065}" fill="url(#${ue})"/>
        <circle cx="${radius*0.9}" cy="${radius*0.15}" r="${radius*0.018}" fill="#ffffff" opacity="0.85"/>
      </g>
    </g>`;
  },

  // Rayo
  bolt: (height = 100, fill = '#06d8e8') => `
    <g>
      <path d="M0 0 L ${-height*0.4} ${height*0.45} L ${-height*0.1} ${height*0.5} L ${-height*0.3} ${height} L ${height*0.4} ${height*0.5} L ${height*0.1} ${height*0.45} L ${height*0.3} 0 Z"
            fill="${fill}" opacity="0.4" filter="url(#ds-glow-sm)"/>
      <path d="M0 0 L ${-height*0.4} ${height*0.45} L ${-height*0.1} ${height*0.5} L ${-height*0.3} ${height} L ${height*0.4} ${height*0.5} L ${height*0.1} ${height*0.45} L ${height*0.3} 0 Z" fill="${fill}"/>
    </g>`,

  // Prisma con arcoíris (cristal 3D con caras y dispersión)
  prism: (size = 120, palette) => {
    const ug = _uid('pr-g');
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
          <stop offset="50%" stop-color="${palette.accent2}" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="${palette.ink}" stop-opacity="0.55"/>
        </linearGradient>
      </defs>
      <!-- incident white light beam -->
      <line x1="${-size*1.7}" y1="${-size*0.1}" x2="${-size*0.35}" y2="${size*0.02}" stroke="#ffffff" stroke-width="${size*0.05}" opacity="0.35" stroke-linecap="round"/>
      <line x1="${-size*1.7}" y1="${-size*0.1}" x2="${-size*0.35}" y2="${size*0.02}" stroke="#ffffff" stroke-width="${size*0.015}" opacity="0.95" stroke-linecap="round"/>
      <!-- prism body (front face) -->
      <polygon points="0,${-size} ${size*0.85},${size*0.5} ${-size*0.85},${size*0.5}" fill="url(#${ug})" stroke="${palette.accent2}" stroke-width="2"/>
      <!-- inner reflection -->
      <polygon points="${-size*0.6},${size*0.35} 0,${-size*0.78} ${size*0.55},${size*0.32}" fill="#ffffff" opacity="0.15"/>
      <line x1="${-size*0.55}" y1="${size*0.4}" x2="${-size*0.05}" y2="${-size*0.85}" stroke="#ffffff" stroke-width="${size*0.01}" opacity="0.85"/>
      <line x1="${size*0.55}" y1="${size*0.4}" x2="${size*0.05}" y2="${-size*0.85}" stroke="${palette.ink}" stroke-width="${size*0.01}" opacity="0.45"/>
      <!-- edge highlights -->
      <line x1="${-size*0.85}" y1="${size*0.5}" x2="0" y2="${-size}" stroke="#ffffff" stroke-width="${size*0.015}" opacity="0.5"/>
      <!-- rainbow dispersion -->
      <g stroke-linecap="round">
        <line x1="${size*0.42}" y1="${size*0.05}" x2="${size*1.8}" y2="${-size*0.25}" stroke="#ff5a5a" stroke-width="${size*0.025}" opacity="0.9"/>
        <line x1="${size*0.42}" y1="${size*0.08}" x2="${size*1.8}" y2="${-size*0.13}" stroke="#ff9a3a" stroke-width="${size*0.025}" opacity="0.9"/>
        <line x1="${size*0.42}" y1="${size*0.11}" x2="${size*1.8}" y2="${-size*0.02}" stroke="#ffd93d" stroke-width="${size*0.025}" opacity="0.9"/>
        <line x1="${size*0.42}" y1="${size*0.14}" x2="${size*1.8}" y2="${size*0.09}" stroke="#6bdb6b" stroke-width="${size*0.025}" opacity="0.9"/>
        <line x1="${size*0.42}" y1="${size*0.17}" x2="${size*1.8}" y2="${size*0.2}" stroke="#5bb8ff" stroke-width="${size*0.025}" opacity="0.9"/>
        <line x1="${size*0.42}" y1="${size*0.2}" x2="${size*1.8}" y2="${size*0.31}" stroke="#7a5aff" stroke-width="${size*0.025}" opacity="0.9"/>
        <line x1="${size*0.42}" y1="${size*0.23}" x2="${size*1.8}" y2="${size*0.42}" stroke="#b66dff" stroke-width="${size*0.025}" opacity="0.9"/>
      </g>
      <!-- glow at refraction point -->
      <circle cx="${size*0.42}" cy="${size*0.13}" r="${size*0.12}" fill="#ffffff" opacity="0.3" filter="url(#ds-glow-sm)"/>
    </g>`;
  },

  // Péndulo de Newton (estructura metálica, bolas pulidas, cuerdas en V)
  pendulum: (size = 130, palette) => {
    const ub = _uid('pd-b'); const uf = _uid('pd-f');
    return `<g>
      <defs>
        <radialGradient id="${ub}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="40%" stop-color="${_mix(palette.accent, '#ffffff', 0.2)}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${_mix(palette.accent, '#000', 0.55)}" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="${uf}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.ink, '#ffffff', 0.4)}"/>
          <stop offset="50%" stop-color="${palette.ink}"/>
          <stop offset="100%" stop-color="${_mix(palette.ink, '#000', 0.3)}"/>
        </linearGradient>
      </defs>
      <!-- top crossbar with bevel -->
      <rect x="${-size*0.72}" y="${-size*0.88}" width="${size*1.44}" height="${size*0.1}" rx="${size*0.015}" fill="url(#${uf})"/>
      <rect x="${-size*0.72}" y="${-size*0.88}" width="${size*1.44}" height="${size*0.025}" fill="#ffffff" opacity="0.25"/>
      <!-- side posts -->
      <rect x="${-size*0.78}" y="${size*0.6}" width="${size*0.08}" height="${size*0.18}" rx="${size*0.015}" fill="url(#${uf})"/>
      <rect x="${size*0.7}" y="${size*0.6}" width="${size*0.08}" height="${size*0.18}" rx="${size*0.015}" fill="url(#${uf})"/>
      <line x1="${-size*0.74}" y1="${-size*0.85}" x2="${-size*0.74}" y2="${size*0.65}" stroke="url(#${uf})" stroke-width="${size*0.06}" stroke-linecap="round"/>
      <line x1="${size*0.74}" y1="${-size*0.85}" x2="${size*0.74}" y2="${size*0.65}" stroke="url(#${uf})" stroke-width="${size*0.06}" stroke-linecap="round"/>
      <!-- base -->
      <rect x="${-size*0.85}" y="${size*0.74}" width="${size*1.7}" height="${size*0.07}" rx="${size*0.015}" fill="url(#${uf})"/>
      <ellipse cx="0" cy="${size*0.86}" rx="${size*0.7}" ry="${size*0.04}" fill="#000" opacity="0.3"/>
      ${(() => {
        let s = '';
        for (let i = -2; i <= 2; i++) {
          const x = i * size * 0.22;
          // V-shaped strings
          s += `<line x1="${x - size*0.04}" y1="${-size*0.78}" x2="${x}" y2="${size*0.3}" stroke="${palette.ink}" stroke-width="1.2" opacity="0.75"/>`;
          s += `<line x1="${x + size*0.04}" y1="${-size*0.78}" x2="${x}" y2="${size*0.3}" stroke="${palette.ink}" stroke-width="1.2" opacity="0.75"/>`;
          // ball with metallic shine
          s += `<circle cx="${x}" cy="${size*0.45}" r="${size*0.13}" fill="url(#${ub})"/>`;
          s += `<ellipse cx="${x - size*0.04}" cy="${size*0.4}" rx="${size*0.04}" ry="${size*0.025}" fill="#ffffff" opacity="0.7"/>`;
          s += `<circle cx="${x + size*0.05}" cy="${size*0.5}" r="${size*0.012}" fill="#ffffff" opacity="0.6"/>`;
          // contact shadow on base
          s += `<ellipse cx="${x}" cy="${size*0.62}" rx="${size*0.12}" ry="${size*0.02}" fill="#000" opacity="0.3"/>`;
        }
        return s;
      })()}
    </g>`;
  },

  // Engranaje
  gear: (radius = 80, palette, teeth = 10) => {
    let pts = '';
    for (let i = 0; i < teeth * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.78;
      const a = (i * 180 / teeth - 90) * Math.PI / 180;
      pts += `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
    }
    return `<g>
      <polygon points="${pts}" fill="${palette.accent}"/>
      <circle r="${radius*0.55}" fill="${palette.bg[0]}" opacity="0.9"/>
      <circle r="${radius*0.55}" fill="none" stroke="${palette.accent}" stroke-width="${radius*0.05}"/>
      <circle r="${radius*0.18}" fill="${palette.accent}"/>
    </g>`;
  },

  // Resorte (espiral)
  spring: (size = 120, palette) => {
    let d = `M ${-size*0.5} ${-size*0.8}`;
    for (let i = 0; i < 6; i++) {
      const y = -size*0.8 + i * size*0.27;
      d += ` Q ${-size*0.5} ${y - size*0.05}, ${size*0.5} ${y + size*0.05} Q ${size*0.5} ${y + size*0.18}, ${-size*0.5} ${y + size*0.28}`;
    }
    return `<g>
      <path d="${d}" fill="none" stroke="${palette.accent}" stroke-width="${size*0.06}" stroke-linecap="round"/>
      <rect x="${-size*0.55}" y="${-size*0.92}" width="${size*1.1}" height="${size*0.1}" rx="2" fill="${palette.ink}"/>
      <rect x="${-size*0.55}" y="${size*0.82}" width="${size*1.1}" height="${size*0.1}" rx="2" fill="${palette.ink}"/>
    </g>`;
  },

  // Onda electromagnética
  wave: (size = 200, color = '#fff', amplitude = 30) => `
    <path d="M ${-size} 0 Q ${-size*0.5} ${-amplitude*2}, 0 0 T ${size} 0"
          fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M ${-size} 0 Q ${-size*0.5} ${amplitude*2}, 0 0 T ${size} 0"
          fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>`,

  // Imán de herradura
  magnet: (size = 100, palette) => `
    <g>
      <path d="M ${-size*0.7} ${size*0.5}
               L ${-size*0.7} ${-size*0.2}
               Q ${-size*0.7} ${-size*0.7}, 0 ${-size*0.7}
               Q ${size*0.7} ${-size*0.7}, ${size*0.7} ${-size*0.2}
               L ${size*0.7} ${size*0.5}
               L ${size*0.35} ${size*0.5}
               L ${size*0.35} ${-size*0.2}
               Q ${size*0.35} ${-size*0.35}, 0 ${-size*0.35}
               Q ${-size*0.35} ${-size*0.35}, ${-size*0.35} ${-size*0.2}
               L ${-size*0.35} ${size*0.5} Z" fill="${palette.accent}"/>
      <rect x="${-size*0.7}" y="${size*0.3}" width="${size*0.35}" height="${size*0.22}" fill="#b3354c"/>
      <rect x="${size*0.35}" y="${size*0.3}" width="${size*0.35}" height="${size*0.22}" fill="${palette.ink}" opacity="0.85"/>
    </g>`,

  // Flecha vectorial (para representar fuerza/vector)
  vectorArrow: (length = 100, color = '#fff') => `
    <g>
      <line x1="0" y1="0" x2="${length}" y2="0" stroke="${color}" stroke-width="${length*0.05}" stroke-linecap="round"/>
      <polygon points="${length},0 ${length-length*0.2},${-length*0.12} ${length-length*0.2},${length*0.12}" fill="${color}"/>
    </g>`,

  // Manzana (Newton)
  apple: (size = 50, palette) => `
    <g>
      <path d="M ${-size*0.4} ${size*0.55} Q ${-size*0.8} ${size*0.1}, ${-size*0.5} ${-size*0.3}
               Q ${-size*0.15} ${-size*0.55}, 0 ${-size*0.35}
               Q ${size*0.15} ${-size*0.55}, ${size*0.5} ${-size*0.3}
               Q ${size*0.8} ${size*0.1}, ${size*0.4} ${size*0.55}
               Q 0 ${size*0.75}, ${-size*0.4} ${size*0.55} Z" fill="#b3354c"/>
      <path d="M 0 ${-size*0.45} Q ${size*0.15} ${-size*0.7}, ${size*0.3} ${-size*0.6}" stroke="#3a2a14" stroke-width="${size*0.05}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${size*0.4}" cy="${-size*0.65}" rx="${size*0.15}" ry="${size*0.08}" fill="#4d6b2e" transform="rotate(30 ${size*0.4} ${-size*0.65})"/>
    </g>`,

  /* =====================================================
     ████████  QUÍMICA  ████████
     ===================================================== */

  // Matraz Erlenmeyer (vidrio realista con menisco, burbujas y especulares)
  flask: (size = 180, palette, liquidColor = null) => {
    const lc = liquidColor || palette.accent;
    const ug = _uid('flask-g'); const ul = _uid('flask-l'); const us = _uid('flask-s');
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
          <stop offset="55%" stop-color="${palette.bg[0]}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="${palette.ink}" stop-opacity="0.2"/>
        </linearGradient>
        <linearGradient id="${ul}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(lc, '#ffffff', 0.45)}" stop-opacity="0.95"/>
          <stop offset="55%" stop-color="${lc}" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="${_mix(lc, '#000000', 0.35)}" stop-opacity="0.92"/>
        </linearGradient>
        <radialGradient id="${us}" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.96, size*0.55, size*0.06, 0.35)}
      <!-- glass body -->
      <path d="M ${-size*0.16} ${-size*0.95}
               L ${-size*0.16} ${-size*0.45}
               L ${-size*0.6} ${size*0.65}
               Q ${-size*0.65} ${size*0.9}, ${-size*0.4} ${size*0.92}
               L ${size*0.4} ${size*0.92}
               Q ${size*0.65} ${size*0.9}, ${size*0.6} ${size*0.65}
               L ${size*0.16} ${-size*0.45}
               L ${size*0.16} ${-size*0.95} Z"
            fill="url(#${ug})" stroke="${palette.ink}" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- liquid -->
      <path d="M ${-size*0.36} ${size*0.05}
               L ${-size*0.6} ${size*0.65}
               Q ${-size*0.65} ${size*0.9}, ${-size*0.4} ${size*0.92}
               L ${size*0.4} ${size*0.92}
               Q ${size*0.65} ${size*0.9}, ${size*0.6} ${size*0.65}
               L ${size*0.36} ${size*0.05} Z"
            fill="url(#${ul})"/>
      <!-- meniscus -->
      <path d="M ${-size*0.36} ${size*0.06} Q 0 ${size*0.12}, ${size*0.36} ${size*0.06} L ${size*0.36} ${size*0.02} Q 0 ${size*0.08}, ${-size*0.36} ${size*0.02} Z" fill="#ffffff" opacity="0.35"/>
      <!-- glass shine left edge -->
      <path d="M ${-size*0.12} ${-size*0.4} L ${-size*0.38} ${size*0.5}" stroke="#ffffff" stroke-width="${size*0.04}" opacity="0.55" stroke-linecap="round"/>
      <path d="M ${-size*0.08} ${-size*0.3} L ${-size*0.32} ${size*0.4}" stroke="#ffffff" stroke-width="${size*0.012}" opacity="0.7" stroke-linecap="round"/>
      <!-- specular highlight on body -->
      <ellipse cx="${-size*0.22}" cy="${size*0.25}" rx="${size*0.05}" ry="${size*0.45}" fill="url(#${us})" transform="rotate(-15 ${-size*0.22} ${size*0.25})"/>
      <!-- bubbles in liquid -->
      <circle cx="${-size*0.15}" cy="${size*0.45}" r="${size*0.05}" fill="#ffffff" opacity="0.65"/>
      <circle cx="${-size*0.13}" cy="${size*0.43}" r="${size*0.018}" fill="#ffffff" opacity="0.95"/>
      <circle cx="${size*0.12}" cy="${size*0.6}" r="${size*0.04}" fill="#ffffff" opacity="0.55"/>
      <circle cx="${size*0.1}" cy="${size*0.58}" r="${size*0.014}" fill="#ffffff" opacity="0.9"/>
      <circle cx="${-size*0.02}" cy="${size*0.75}" r="${size*0.025}" fill="#ffffff" opacity="0.5"/>
      <!-- rim -->
      <ellipse cx="0" cy="${-size*0.95}" rx="${size*0.18}" ry="${size*0.04}" fill="${palette.ink}" opacity="0.55"/>
      <ellipse cx="0" cy="${-size*0.97}" rx="${size*0.18}" ry="${size*0.04}" fill="none" stroke="${palette.ink}" stroke-width="2"/>
      <rect x="${-size*0.19}" y="${-size*0.99}" width="${size*0.38}" height="${size*0.05}" rx="${size*0.02}" fill="${palette.bg[1]}" stroke="${palette.ink}" stroke-width="1.4"/>
      <!-- vapor wisps -->
      <path d="M ${-size*0.06} ${-size*1.05} Q ${-size*0.14} ${-size*1.2}, ${-size*0.04} ${-size*1.35} Q ${size*0.04} ${-size*1.5}, ${-size*0.02} ${-size*1.65}" stroke="#ffffff" stroke-width="${size*0.018}" fill="none" opacity="0.45" stroke-linecap="round"/>
      <path d="M ${size*0.07} ${-size*1.05} Q ${size*0.15} ${-size*1.2}, ${size*0.05} ${-size*1.35} Q ${-size*0.03} ${-size*1.5}, ${size*0.03} ${-size*1.65}" stroke="#ffffff" stroke-width="${size*0.015}" fill="none" opacity="0.35" stroke-linecap="round"/>
    </g>`;
  },

  // Vaso de precipitados (beaker) con vidrio realista
  beaker: (size = 140, palette, liquidColor = null) => {
    const lc = liquidColor || palette.accent;
    const ug = _uid('bk-g'); const ul = _uid('bk-l');
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
          <stop offset="60%" stop-color="${palette.bg[0]}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="${palette.ink}" stop-opacity="0.18"/>
        </linearGradient>
        <linearGradient id="${ul}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(lc, '#ffffff', 0.4)}" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="${_mix(lc, '#000000', 0.3)}" stop-opacity="0.94"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.82, size*0.45, size*0.05, 0.35)}
      <!-- glass body -->
      <path d="M ${-size*0.5} ${-size*0.7}
               L ${-size*0.45} ${size*0.7}
               Q ${-size*0.45} ${size*0.78}, ${-size*0.35} ${size*0.78}
               L ${size*0.35} ${size*0.78}
               Q ${size*0.45} ${size*0.78}, ${size*0.45} ${size*0.7}
               L ${size*0.5} ${-size*0.7}
               L ${size*0.55} ${-size*0.75}
               L ${-size*0.55} ${-size*0.75} Z"
            fill="url(#${ug})" stroke="${palette.ink}" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- liquid -->
      <path d="M ${-size*0.47} 0
               L ${-size*0.45} ${size*0.7}
               Q ${-size*0.45} ${size*0.78}, ${-size*0.35} ${size*0.78}
               L ${size*0.35} ${size*0.78}
               Q ${size*0.45} ${size*0.78}, ${size*0.45} ${size*0.7}
               L ${size*0.47} 0 Z" fill="url(#${ul})"/>
      <!-- meniscus -->
      <path d="M ${-size*0.47} 0 Q 0 ${size*0.06}, ${size*0.47} 0 L ${size*0.47} ${-size*0.04} Q 0 ${size*0.02}, ${-size*0.47} ${-size*0.04} Z" fill="#ffffff" opacity="0.4"/>
      <!-- glass shine -->
      <path d="M ${-size*0.4} ${-size*0.6} L ${-size*0.36} ${size*0.55}" stroke="#ffffff" stroke-width="${size*0.04}" opacity="0.5" stroke-linecap="round"/>
      <path d="M ${-size*0.36} ${-size*0.5} L ${-size*0.32} ${size*0.45}" stroke="#ffffff" stroke-width="${size*0.012}" opacity="0.8" stroke-linecap="round"/>
      <!-- pouring spout shine -->
      <path d="M ${size*0.45} ${-size*0.72} L ${size*0.5} ${-size*0.74}" stroke="#ffffff" stroke-width="${size*0.018}" opacity="0.7" stroke-linecap="round"/>
      <!-- bubbles -->
      <circle cx="${-size*0.15}" cy="${size*0.5}" r="${size*0.04}" fill="#ffffff" opacity="0.6"/>
      <circle cx="${-size*0.13}" cy="${size*0.48}" r="${size*0.015}" fill="#ffffff" opacity="0.95"/>
      <circle cx="${size*0.2}" cy="${size*0.65}" r="${size*0.03}" fill="#ffffff" opacity="0.5"/>
      <circle cx="${size*0.02}" cy="${size*0.55}" r="${size*0.02}" fill="#ffffff" opacity="0.55"/>
      <!-- marks with numbers feel -->
      <line x1="${-size*0.45}" y1="${size*0.2}" x2="${-size*0.32}" y2="${size*0.2}" stroke="${palette.ink}" stroke-width="1.6" opacity="0.75"/>
      <line x1="${-size*0.43}" y1="${size*0.35}" x2="${-size*0.36}" y2="${size*0.35}" stroke="${palette.ink}" stroke-width="1" opacity="0.5"/>
      <line x1="${-size*0.45}" y1="${size*0.4}" x2="${-size*0.32}" y2="${size*0.4}" stroke="${palette.ink}" stroke-width="1.6" opacity="0.75"/>
      <line x1="${-size*0.43}" y1="${size*0.55}" x2="${-size*0.36}" y2="${size*0.55}" stroke="${palette.ink}" stroke-width="1" opacity="0.5"/>
      <line x1="${-size*0.45}" y1="${size*0.6}" x2="${-size*0.32}" y2="${size*0.6}" stroke="${palette.ink}" stroke-width="1.6" opacity="0.75"/>
    </g>`;
  },

  // Tubo de ensayo (cristal con tapón y burbujas)
  testTube: (size = 100, palette, liquidColor = null) => {
    const lc = liquidColor || palette.accent;
    const ug = _uid('tt-g'); const ul = _uid('tt-l');
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
          <stop offset="60%" stop-color="${palette.bg[0]}" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="${palette.ink}" stop-opacity="0.2"/>
        </linearGradient>
        <linearGradient id="${ul}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(lc, '#ffffff', 0.4)}" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${_mix(lc, '#000000', 0.3)}" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*1.05, size*0.25, size*0.04, 0.3)}
      <!-- cork stopper -->
      <rect x="${-size*0.26}" y="${-size*0.95}" width="${size*0.52}" height="${size*0.16}" rx="${size*0.04}" fill="${_mix('#7a5028', palette.ink, 0.2)}"/>
      <rect x="${-size*0.26}" y="${-size*0.95}" width="${size*0.52}" height="${size*0.04}" fill="#ffffff" opacity="0.18"/>
      <rect x="${-size*0.26}" y="${-size*0.83}" width="${size*0.52}" height="${size*0.04}" fill="${palette.ink}" opacity="0.4"/>
      <!-- glass tube -->
      <path d="M ${-size*0.22} ${-size*0.8}
               L ${-size*0.22} ${size*0.65}
               Q ${-size*0.22} ${size*0.95}, 0 ${size*0.95}
               Q ${size*0.22} ${size*0.95}, ${size*0.22} ${size*0.65}
               L ${size*0.22} ${-size*0.8} Z"
            fill="url(#${ug})" stroke="${palette.ink}" stroke-width="2.2"/>
      <!-- liquid -->
      <path d="M ${-size*0.2} ${size*0.05}
               L ${-size*0.22} ${size*0.65}
               Q ${-size*0.22} ${size*0.93}, 0 ${size*0.93}
               Q ${size*0.22} ${size*0.93}, ${size*0.22} ${size*0.65}
               L ${size*0.2} ${size*0.05} Z"
            fill="url(#${ul})"/>
      <!-- meniscus -->
      <path d="M ${-size*0.2} ${size*0.06} Q 0 ${size*0.12}, ${size*0.2} ${size*0.06} L ${size*0.2} ${size*0.02} Q 0 ${size*0.08}, ${-size*0.2} ${size*0.02} Z" fill="#ffffff" opacity="0.4"/>
      <!-- glass shine -->
      <path d="M ${-size*0.18} ${-size*0.6} L ${-size*0.17} ${size*0.6}" stroke="#ffffff" stroke-width="${size*0.025}" opacity="0.55" stroke-linecap="round"/>
      <path d="M ${-size*0.15} ${-size*0.5} L ${-size*0.14} ${size*0.5}" stroke="#ffffff" stroke-width="${size*0.008}" opacity="0.85"/>
      <!-- bubbles -->
      <circle cx="${-size*0.07}" cy="${size*0.55}" r="${size*0.035}" fill="#ffffff" opacity="0.6"/>
      <circle cx="${-size*0.06}" cy="${size*0.53}" r="${size*0.012}" fill="#ffffff" opacity="0.95"/>
      <circle cx="${size*0.08}" cy="${size*0.7}" r="${size*0.025}" fill="#ffffff" opacity="0.55"/>
    </g>`;
  },

  // Frasco redondo (esfera cristalina con reflejo y burbujas)
  roundFlask: (size = 140, palette, liquidColor = null) => {
    const lc = liquidColor || palette.accent;
    const ug = _uid('rf-g'); const ul = _uid('rf-l');
    return `<g>
      <defs>
        <radialGradient id="${ug}" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="50%" stop-color="${palette.bg[0]}" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="${palette.ink}" stop-opacity="0.22"/>
        </radialGradient>
        <radialGradient id="${ul}" cx="35%" cy="40%" r="65%">
          <stop offset="0%" stop-color="${_mix(lc, '#ffffff', 0.45)}" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="${_mix(lc, '#000000', 0.4)}" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.78, size*0.55, size*0.05, 0.32)}
      <!-- neck -->
      <rect x="${-size*0.18}" y="${-size*0.95}" width="${size*0.36}" height="${size*0.45}" fill="url(#${ug})" stroke="${palette.ink}" stroke-width="2.2"/>
      <!-- spherical body -->
      <circle cy="${size*0.15}" r="${size*0.6}" fill="url(#${ug})" stroke="${palette.ink}" stroke-width="2.2"/>
      <!-- liquid -->
      <path d="M ${-size*0.55} ${size*0.4} A ${size*0.6} ${size*0.6} 0 0 0 ${size*0.55} ${size*0.4}
               A ${size*0.6} ${size*0.6} 0 0 1 ${-size*0.55} ${size*0.4} Z" fill="url(#${ul})"/>
      <!-- meniscus -->
      <ellipse cx="0" cy="${size*0.4}" rx="${size*0.55}" ry="${size*0.06}" fill="#ffffff" opacity="0.45"/>
      <!-- specular highlight on sphere -->
      <ellipse cx="${-size*0.22}" cy="${-size*0.15}" rx="${size*0.12}" ry="${size*0.2}" fill="#ffffff" opacity="0.55" transform="rotate(-20 ${-size*0.22} ${-size*0.15})"/>
      <ellipse cx="${-size*0.3}" cy="${size*0.05}" rx="${size*0.04}" ry="${size*0.1}" fill="#ffffff" opacity="0.7"/>
      <!-- neck shine -->
      <line x1="${-size*0.14}" y1="${-size*0.9}" x2="${-size*0.14}" y2="${-size*0.55}" stroke="#ffffff" stroke-width="${size*0.015}" opacity="0.7"/>
      <!-- bubbles -->
      <circle cx="${-size*0.18}" cy="${size*0.55}" r="${size*0.04}" fill="#ffffff" opacity="0.6"/>
      <circle cx="${-size*0.16}" cy="${size*0.53}" r="${size*0.014}" fill="#ffffff" opacity="0.95"/>
      <circle cx="${size*0.15}" cy="${size*0.65}" r="${size*0.03}" fill="#ffffff" opacity="0.5"/>
      <!-- cork -->
      <rect x="${-size*0.21}" y="${-size*1.05}" width="${size*0.42}" height="${size*0.12}" rx="${size*0.03}" fill="${_mix('#7a5028', palette.ink, 0.2)}"/>
      <rect x="${-size*0.21}" y="${-size*1.05}" width="${size*0.42}" height="${size*0.03}" fill="#ffffff" opacity="0.2"/>
    </g>`;
  },

  // Molécula hexagonal
  molecule: (size = 40, palette) => {
    const positions = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 - 90) * Math.PI / 180;
      positions.push([Math.cos(a) * size, Math.sin(a) * size]);
    }
    let bonds = '', atoms = '';
    positions.forEach((p, i) => {
      const next = positions[(i + 1) % 6];
      bonds += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${next[0].toFixed(1)}" y2="${next[1].toFixed(1)}" stroke="${palette.accent}" stroke-width="1.8" opacity="0.85"/>`;
      atoms += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${size*0.14}" fill="${palette.accent2}"/>`;
    });
    return `<g>${bonds}${atoms}<circle r="${size*0.1}" fill="${palette.accent}"/></g>`;
  },

  // DNA helix simplificado
  dna: (size = 140, palette) => {
    let s = '';
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const y = -size + t * size * 2;
      const x1 = Math.sin(t * Math.PI * 2) * size * 0.4;
      const x2 = -x1;
      s += `<circle cx="${x1.toFixed(1)}" cy="${y.toFixed(1)}" r="${size*0.07}" fill="${palette.accent}"/>`;
      s += `<circle cx="${x2.toFixed(1)}" cy="${y.toFixed(1)}" r="${size*0.07}" fill="${palette.accent2}"/>`;
      if (i % 2 === 0) {
        s += `<line x1="${x1.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${palette.ink}" stroke-width="1.4" opacity="0.65"/>`;
      }
    }
    // helices
    let d1 = `M ${Math.sin(0) * size * 0.4} ${-size}`;
    let d2 = `M ${-Math.sin(0) * size * 0.4} ${-size}`;
    for (let i = 1; i <= 60; i++) {
      const t = i / 60;
      const y = -size + t * size * 2;
      const x1 = Math.sin(t * Math.PI * 2) * size * 0.4;
      const x2 = -x1;
      d1 += ` L ${x1.toFixed(1)} ${y.toFixed(1)}`;
      d2 += ` L ${x2.toFixed(1)} ${y.toFixed(1)}`;
    }
    return `<g>
      <path d="${d1}" fill="none" stroke="${palette.accent}" stroke-width="2.5" opacity="0.85"/>
      <path d="${d2}" fill="none" stroke="${palette.accent2}" stroke-width="2.5" opacity="0.85"/>
      ${s}
    </g>`;
  },

  // Gota
  droplet: (size = 30, fill = '#5cb8ff') => `
    <path d="M0 ${-size} Q ${size*0.6} ${-size*0.3}, ${size*0.7} ${size*0.3}
             Q ${size*0.7} ${size*0.9}, 0 ${size*0.9}
             Q ${-size*0.7} ${size*0.9}, ${-size*0.7} ${size*0.3}
             Q ${-size*0.6} ${-size*0.3}, 0 ${-size} Z" fill="${fill}"/>`,

  // Llama de mechero
  flame: (size = 80, palette) => `
    <g>
      <path d="M 0 ${size*0.6}
               Q ${-size*0.4} ${size*0.4}, ${-size*0.35} 0
               Q ${-size*0.3} ${-size*0.5}, 0 ${-size*0.9}
               Q ${size*0.3} ${-size*0.5}, ${size*0.35} 0
               Q ${size*0.4} ${size*0.4}, 0 ${size*0.6} Z" fill="#f5a838"/>
      <path d="M 0 ${size*0.5}
               Q ${-size*0.22} ${size*0.3}, ${-size*0.2} 0
               Q ${-size*0.18} ${-size*0.3}, 0 ${-size*0.6}
               Q ${size*0.18} ${-size*0.3}, ${size*0.2} 0
               Q ${size*0.22} ${size*0.3}, 0 ${size*0.5} Z" fill="#f5e8a8"/>
      <path d="M 0 ${size*0.4}
               Q ${-size*0.1} ${size*0.2}, ${-size*0.08} 0
               Q 0 ${-size*0.3}, ${size*0.08} 0
               Q ${size*0.1} ${size*0.2}, 0 ${size*0.4} Z" fill="#fff"/>
    </g>`,

  /* =====================================================
     ████████  CIENCIAS NATURALES  ████████
     ===================================================== */

  // Árbol (tronco con corteza, copa con capas de follaje y luz cenital)
  tree: (size = 200, palette) => {
    const utr = _uid('tr-t'); const ufol = _uid('tr-f');
    const dark = _mix(palette.ink, '#000', 0.25);
    const mid = palette.ink;
    const light = _mix(palette.ink, '#ffffff', 0.18);
    return `<g>
      <defs>
        <linearGradient id="${utr}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix('#3a2a14', '#000', 0.2)}"/>
          <stop offset="50%" stop-color="#5a4028"/>
          <stop offset="100%" stop-color="${_mix('#3a2a14', '#000', 0.3)}"/>
        </linearGradient>
        <radialGradient id="${ufol}" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="60%" stop-color="${mid}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.92, size*0.55, size*0.04, 0.4)}
      <!-- trunk with bark texture -->
      <path d="M ${-size*0.09} ${size*0.9} Q ${-size*0.07} ${size*0.5}, ${-size*0.06} ${size*0.1} L ${size*0.06} ${size*0.1} Q ${size*0.07} ${size*0.5}, ${size*0.09} ${size*0.9} Z" fill="url(#${utr})"/>
      <line x1="${-size*0.04}" y1="${size*0.2}" x2="${-size*0.03}" y2="${size*0.85}" stroke="#000" opacity="0.4" stroke-width="${size*0.008}"/>
      <line x1="${size*0.02}" y1="${size*0.25}" x2="${size*0.03}" y2="${size*0.85}" stroke="#000" opacity="0.3" stroke-width="${size*0.008}"/>
      <line x1="${-size*0.04}" y1="${size*0.2}" x2="${-size*0.03}" y2="${size*0.85}" stroke="#ffffff" opacity="0.15" stroke-width="${size*0.005}" transform="translate(${size*0.012} 0)"/>
      <!-- foliage layers (back to front, dark to light) -->
      <g>
        <!-- back darker -->
        <ellipse cx="${-size*0.3}" cy="${-size*0.15}" rx="${size*0.45}" ry="${size*0.4}" fill="${dark}"/>
        <ellipse cx="${size*0.3}" cy="${-size*0.15}" rx="${size*0.45}" ry="${size*0.4}" fill="${dark}"/>
        <ellipse cx="0" cy="${-size*0.45}" rx="${size*0.7}" ry="${size*0.55}" fill="${dark}"/>
        <!-- middle layer -->
        <ellipse cx="${-size*0.25}" cy="${-size*0.25}" rx="${size*0.4}" ry="${size*0.36}" fill="${mid}"/>
        <ellipse cx="${size*0.25}" cy="${-size*0.25}" rx="${size*0.4}" ry="${size*0.36}" fill="${mid}"/>
        <ellipse cx="0" cy="${-size*0.5}" rx="${size*0.6}" ry="${size*0.48}" fill="${mid}"/>
        <ellipse cx="0" cy="${-size*0.05}" rx="${size*0.55}" ry="${size*0.32}" fill="url(#${ufol})"/>
        <!-- top light layer (sunlight) -->
        <ellipse cx="${-size*0.12}" cy="${-size*0.65}" rx="${size*0.25}" ry="${size*0.18}" fill="${light}" opacity="0.95"/>
        <ellipse cx="${size*0.18}" cy="${-size*0.6}" rx="${size*0.2}" ry="${size*0.15}" fill="${light}" opacity="0.85"/>
        <ellipse cx="${-size*0.18}" cy="${-size*0.55}" rx="${size*0.13}" ry="${size*0.1}" fill="${palette.accent2}" opacity="0.45"/>
        <!-- texture leaves (random dots) -->
        <circle cx="${size*0.35}" cy="${-size*0.5}" r="${size*0.04}" fill="${light}" opacity="0.55"/>
        <circle cx="${-size*0.4}" cy="${-size*0.35}" r="${size*0.035}" fill="${light}" opacity="0.5"/>
        <circle cx="${size*0.5}" cy="${-size*0.05}" r="${size*0.03}" fill="${mid}" opacity="0.8"/>
        <circle cx="${-size*0.5}" cy="${-size*0.05}" r="${size*0.03}" fill="${mid}" opacity="0.8"/>
        <circle cx="${size*0.15}" cy="${-size*0.7}" r="${size*0.025}" fill="${light}" opacity="0.7"/>
      </g>
    </g>`;
  },

  // Hoja con nervaduras y degradado de luz
  leaf: (size = 60, fill = '#3d5a2d', vein = '#1f3015') => {
    const ug = _uid('lf-g');
    const light = _mix(fill, '#ffffff', 0.25);
    const dark = _mix(fill, '#000', 0.35);
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${light}"/>
          <stop offset="55%" stop-color="${fill}"/>
          <stop offset="100%" stop-color="${dark}"/>
        </linearGradient>
      </defs>
      <path d="M0 0 C ${-size*0.6} ${-size*0.2}, ${-size*0.7} ${-size*0.9}, 0 ${-size}
               C ${size*0.7} ${-size*0.9}, ${size*0.6} ${-size*0.2}, 0 0 Z" fill="url(#${ug})"/>
      <path d="M0 0 L 0 ${-size*0.95}" stroke="${vein}" stroke-width="${size*0.025}" opacity="0.7"/>
      <path d="M0 ${-size*0.2} Q ${-size*0.15} ${-size*0.15}, ${-size*0.3} ${-size*0.05}" stroke="${vein}" stroke-width="${size*0.012}" opacity="0.55" fill="none"/>
      <path d="M0 ${-size*0.2} Q ${size*0.15} ${-size*0.15}, ${size*0.3} ${-size*0.05}" stroke="${vein}" stroke-width="${size*0.012}" opacity="0.55" fill="none"/>
      <path d="M0 ${-size*0.4} Q ${-size*0.2} ${-size*0.4}, ${-size*0.4} ${-size*0.3}" stroke="${vein}" stroke-width="${size*0.012}" opacity="0.5" fill="none"/>
      <path d="M0 ${-size*0.4} Q ${size*0.2} ${-size*0.4}, ${size*0.4} ${-size*0.3}" stroke="${vein}" stroke-width="${size*0.012}" opacity="0.5" fill="none"/>
      <path d="M0 ${-size*0.6} Q ${-size*0.18} ${-size*0.62}, ${-size*0.32} ${-size*0.55}" stroke="${vein}" stroke-width="${size*0.012}" opacity="0.45" fill="none"/>
      <path d="M0 ${-size*0.6} Q ${size*0.18} ${-size*0.62}, ${size*0.32} ${-size*0.55}" stroke="${vein}" stroke-width="${size*0.012}" opacity="0.45" fill="none"/>
      <!-- specular highlight -->
      <path d="M ${-size*0.15} ${-size*0.7} Q ${-size*0.25} ${-size*0.45}, ${-size*0.18} ${-size*0.2}" stroke="#ffffff" stroke-width="${size*0.015}" opacity="0.45" fill="none"/>
    </g>`;
  },

  // Flor (margarita con pétalos en capas, centro con textura y tallo curvo)
  flower: (size = 60, palette) => {
    const petalColor = palette.accent2 || '#fff8f0';
    const upe = _uid('fl-p'); const uce = _uid('fl-c');
    return `<g>
      <defs>
        <radialGradient id="${upe}" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="${petalColor}"/>
          <stop offset="100%" stop-color="${_mix(petalColor, '#000', 0.18)}"/>
        </radialGradient>
        <radialGradient id="${uce}" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stop-color="${_mix(palette.accent || '#f5c842', '#ffffff', 0.4)}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent || '#f5c842', '#000', 0.25)}"/>
        </radialGradient>
      </defs>
      <!-- stem -->
      <path d="M 0 ${size*0.2} Q ${size*0.04} ${size*0.5}, 0 ${size*0.7}" stroke="${_mix(palette.ink || '#3d5a2d', '#000', 0.15)}" stroke-width="${size*0.055}" fill="none" stroke-linecap="round"/>
      <path d="M 0 ${size*0.2} Q ${size*0.04} ${size*0.5}, 0 ${size*0.7}" stroke="${_mix(palette.ink || '#3d5a2d', '#ffffff', 0.25)}" stroke-width="${size*0.02}" fill="none" stroke-linecap="round" opacity="0.7"/>
      <!-- leaf on stem -->
      <ellipse cx="${size*0.18}" cy="${size*0.5}" rx="${size*0.2}" ry="${size*0.08}" fill="${_mix(palette.ink || '#3d5a2d', '#000', 0.15)}" transform="rotate(25 ${size*0.18} ${size*0.5})"/>
      <ellipse cx="${size*0.16}" cy="${size*0.48}" rx="${size*0.15}" ry="${size*0.045}" fill="${_mix(palette.ink || '#3d5a2d', '#ffffff', 0.3)}" transform="rotate(25 ${size*0.16} ${size*0.48})" opacity="0.6"/>
      <!-- back petals -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 8; i++) {
          s += `<g transform="rotate(${i*45 + 22.5})"><path d="M 0 ${-size*0.25} Q ${-size*0.15} ${-size*0.55}, 0 ${-size*0.9} Q ${size*0.15} ${-size*0.55}, 0 ${-size*0.25} Z" fill="${_mix(petalColor, '#000', 0.15)}" opacity="0.85"/></g>`;
        }
        return s;
      })()}
      <!-- front petals with subtle shadow -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 8; i++) {
          s += `<g transform="rotate(${i*45})"><path d="M 0 ${-size*0.22} Q ${-size*0.16} ${-size*0.55}, 0 ${-size*0.92} Q ${size*0.16} ${-size*0.55}, 0 ${-size*0.22} Z" fill="url(#${upe})"/><path d="M 0 ${-size*0.3} Q ${-size*0.04} ${-size*0.6}, 0 ${-size*0.88}" stroke="${_mix(petalColor, palette.ink || '#3d5a2d', 0.3)}" stroke-width="${size*0.008}" fill="none" opacity="0.5"/></g>`;
        }
        return s;
      })()}
      <!-- center with seed texture -->
      <circle r="${size*0.22}" fill="url(#${uce})"/>
      <circle r="${size*0.22}" fill="none" stroke="${_mix(palette.accent || '#f5c842', '#000', 0.35)}" stroke-width="${size*0.012}"/>
      <!-- stippled seeds -->
      <g fill="${_mix(palette.accent || '#f5c842', '#000', 0.45)}" opacity="0.7">
        <circle cx="${size*0.04}" cy="${-size*0.06}" r="${size*0.015}"/>
        <circle cx="${-size*0.06}" cy="${-size*0.02}" r="${size*0.015}"/>
        <circle cx="${size*0.08}" cy="${size*0.06}" r="${size*0.015}"/>
        <circle cx="${-size*0.04}" cy="${size*0.08}" r="${size*0.015}"/>
        <circle cx="${-size*0.1}" cy="${-size*0.1}" r="${size*0.013}"/>
        <circle cx="${size*0.1}" cy="${-size*0.08}" r="${size*0.013}"/>
        <circle cx="0" cy="${-size*0.12}" r="${size*0.012}"/>
        <circle cx="${size*0.12}" cy="${size*0.02}" r="${size*0.013}"/>
      </g>
      <!-- highlight on center -->
      <ellipse cx="${-size*0.07}" cy="${-size*0.08}" rx="${size*0.05}" ry="${size*0.03}" fill="#ffffff" opacity="0.45"/>
    </g>`;
  },

  // Mariposa (alas con manchas iridiscentes, cuerpo segmentado y antenas curvas)
  butterfly: (size = 100, fill = '#3d5a2d', wing2 = null) => {
    const w2 = wing2 || fill;
    const uw1 = _uid('bf-w1'); const uw2 = _uid('bf-w2');
    const accent = _mix(fill, '#ffffff', 0.5);
    return `<g>
      <defs>
        <radialGradient id="${uw1}" cx="30%" cy="40%" r="80%">
          <stop offset="0%" stop-color="${_mix(fill, '#ffffff', 0.4)}"/>
          <stop offset="60%" stop-color="${fill}"/>
          <stop offset="100%" stop-color="${_mix(fill, '#000', 0.3)}"/>
        </radialGradient>
        <radialGradient id="${uw2}" cx="30%" cy="50%" r="80%">
          <stop offset="0%" stop-color="${_mix(w2, '#ffffff', 0.3)}"/>
          <stop offset="60%" stop-color="${w2}"/>
          <stop offset="100%" stop-color="${_mix(w2, '#000', 0.3)}"/>
        </radialGradient>
      </defs>
      <!-- back upper wings (shadow layer) -->
      <path d="M0 0 C ${-size*0.4} ${-size*0.6}, ${-size*1.1} ${-size*0.5}, ${-size*1.05} ${size*0.1}
               C ${-size*1} ${size*0.5}, ${-size*0.3} ${size*0.5}, 0 ${size*0.25} Z" fill="${_mix(fill, '#000', 0.25)}" transform="translate(${size*0.02} ${size*0.04})"/>
      <path d="M0 0 C ${size*0.4} ${-size*0.6}, ${size*1.1} ${-size*0.5}, ${size*1.05} ${size*0.1}
               C ${size*1} ${size*0.5}, ${size*0.3} ${size*0.5}, 0 ${size*0.25} Z" fill="${_mix(fill, '#000', 0.25)}" transform="translate(${-size*0.02} ${size*0.04})"/>
      <!-- upper wings with gradient -->
      <path d="M0 0 C ${-size*0.4} ${-size*0.6}, ${-size*1.1} ${-size*0.5}, ${-size*1.05} ${size*0.1}
               C ${-size*1} ${size*0.5}, ${-size*0.3} ${size*0.5}, 0 ${size*0.25} Z" fill="url(#${uw1})"/>
      <path d="M0 0 C ${size*0.4} ${-size*0.6}, ${size*1.1} ${-size*0.5}, ${size*1.05} ${size*0.1}
               C ${size*1} ${size*0.5}, ${size*0.3} ${size*0.5}, 0 ${size*0.25} Z" fill="url(#${uw1})"/>
      <!-- lower wings -->
      <path d="M0 ${size*0.15} C ${-size*0.3} ${size*0.3}, ${-size*0.7} ${size*0.5}, ${-size*0.8} ${size*0.85}
               C ${-size*0.85} ${size*1.05}, ${-size*0.35} ${size*1}, ${-size*0.1} ${size*0.7} Z" fill="url(#${uw2})"/>
      <path d="M0 ${size*0.15} C ${size*0.3} ${size*0.3}, ${size*0.7} ${size*0.5}, ${size*0.8} ${size*0.85}
               C ${size*0.85} ${size*1.05}, ${size*0.35} ${size*1}, ${size*0.1} ${size*0.7} Z" fill="url(#${uw2})"/>
      <!-- wing edge dark border -->
      <path d="M0 0 C ${-size*0.4} ${-size*0.6}, ${-size*1.1} ${-size*0.5}, ${-size*1.05} ${size*0.1} C ${-size*1} ${size*0.5}, ${-size*0.3} ${size*0.5}, 0 ${size*0.25}" stroke="${_mix(fill, '#000', 0.5)}" stroke-width="${size*0.018}" fill="none" opacity="0.65"/>
      <path d="M0 0 C ${size*0.4} ${-size*0.6}, ${size*1.1} ${-size*0.5}, ${size*1.05} ${size*0.1} C ${size*1} ${size*0.5}, ${size*0.3} ${size*0.5}, 0 ${size*0.25}" stroke="${_mix(fill, '#000', 0.5)}" stroke-width="${size*0.018}" fill="none" opacity="0.65"/>
      <!-- wing patterns: eyespots and bands -->
      <circle cx="${-size*0.6}" cy="${-size*0.15}" r="${size*0.13}" fill="${_mix(fill, '#000', 0.5)}" opacity="0.55"/>
      <circle cx="${-size*0.6}" cy="${-size*0.15}" r="${size*0.08}" fill="${accent}" opacity="0.9"/>
      <circle cx="${-size*0.6}" cy="${-size*0.15}" r="${size*0.025}" fill="#ffffff"/>
      <circle cx="${size*0.6}" cy="${-size*0.15}" r="${size*0.13}" fill="${_mix(fill, '#000', 0.5)}" opacity="0.55"/>
      <circle cx="${size*0.6}" cy="${-size*0.15}" r="${size*0.08}" fill="${accent}" opacity="0.9"/>
      <circle cx="${size*0.6}" cy="${-size*0.15}" r="${size*0.025}" fill="#ffffff"/>
      <!-- spots -->
      <circle cx="${-size*0.85}" cy="${size*0.05}" r="${size*0.04}" fill="${accent}" opacity="0.8"/>
      <circle cx="${size*0.85}" cy="${size*0.05}" r="${size*0.04}" fill="${accent}" opacity="0.8"/>
      <circle cx="${-size*0.5}" cy="${size*0.8}" r="${size*0.05}" fill="${accent}" opacity="0.75"/>
      <circle cx="${size*0.5}" cy="${size*0.8}" r="${size*0.05}" fill="${accent}" opacity="0.75"/>
      <circle cx="${-size*0.3}" cy="${size*0.85}" r="${size*0.03}" fill="${accent}" opacity="0.6"/>
      <circle cx="${size*0.3}" cy="${size*0.85}" r="${size*0.03}" fill="${accent}" opacity="0.6"/>
      <!-- body segmented -->
      <ellipse cx="0" cy="${size*0.2}" rx="${size*0.06}" ry="${size*0.45}" fill="#0a0a0a"/>
      <ellipse cx="0" cy="${size*0.05}" rx="${size*0.045}" ry="${size*0.06}" fill="${_mix('#0a0a0a', fill, 0.3)}"/>
      <ellipse cx="0" cy="${size*0.2}" rx="${size*0.04}" ry="${size*0.05}" fill="${_mix('#0a0a0a', fill, 0.3)}"/>
      <ellipse cx="0" cy="${size*0.35}" rx="${size*0.04}" ry="${size*0.05}" fill="${_mix('#0a0a0a', fill, 0.3)}"/>
      <ellipse cx="0" cy="${size*0.5}" rx="${size*0.035}" ry="${size*0.04}" fill="${_mix('#0a0a0a', fill, 0.3)}"/>
      <ellipse cx="${-size*0.012}" cy="${size*0.1}" rx="${size*0.012}" ry="${size*0.25}" fill="#ffffff" opacity="0.25"/>
      <!-- head -->
      <circle cx="0" cy="${-size*0.22}" r="${size*0.06}" fill="#0a0a0a"/>
      <circle cx="${-size*0.025}" cy="${-size*0.235}" r="${size*0.015}" fill="#ffffff" opacity="0.7"/>
      <!-- antennae with little balls at tips -->
      <path d="M0 ${-size*0.26} C ${-size*0.06} ${-size*0.45}, ${-size*0.15} ${-size*0.55}, ${-size*0.22} ${-size*0.6}" stroke="#0a0a0a" stroke-width="${size*0.018}" fill="none" stroke-linecap="round"/>
      <path d="M0 ${-size*0.26} C ${size*0.06} ${-size*0.45}, ${size*0.15} ${-size*0.55}, ${size*0.22} ${-size*0.6}" stroke="#0a0a0a" stroke-width="${size*0.018}" fill="none" stroke-linecap="round"/>
      <circle cx="${-size*0.22}" cy="${-size*0.6}" r="${size*0.022}" fill="#0a0a0a"/>
      <circle cx="${size*0.22}" cy="${-size*0.6}" r="${size*0.022}" fill="#0a0a0a"/>
    </g>`;
  },

  // Célula con núcleo
  cell: (size = 100, palette) => `
    <g>
      <circle r="${size}" fill="${palette.accent2}" opacity="0.6"/>
      <circle r="${size}" fill="none" stroke="${palette.accent}" stroke-width="2.5"/>
      <circle r="${size*0.4}" fill="${palette.accent}" opacity="0.85"/>
      <circle r="${size*0.4}" fill="none" stroke="${palette.ink}" stroke-width="1.5"/>
      <circle r="${size*0.18}" fill="${palette.ink}" opacity="0.7"/>
      <!-- organelos -->
      <ellipse cx="${size*0.6}" cy="${-size*0.3}" rx="${size*0.12}" ry="${size*0.06}" fill="${palette.ink}" opacity="0.55" transform="rotate(30 ${size*0.6} ${-size*0.3})"/>
      <ellipse cx="${-size*0.5}" cy="${size*0.4}" rx="${size*0.1}" ry="${size*0.05}" fill="${palette.ink}" opacity="0.5"/>
      <circle cx="${-size*0.6}" cy="${-size*0.2}" r="${size*0.06}" fill="${palette.ink}" opacity="0.6"/>
    </g>`,

  // Rama con hojas (olivo)
  branch: (length = 200, fill = '#5a7a3a', stem = '#3a2a14', leaves = 5) => {
    let parts = `<path d="M0 0 L ${length} ${-length*0.3}" stroke="${stem}" stroke-width="3"/>`;
    for (let i = 0; i < leaves; i++) {
      const t = (i + 1) / (leaves + 1);
      const x = length * t;
      const y = -length * 0.3 * t;
      parts += `<ellipse cx="${x.toFixed(1)}" cy="${(y - 6).toFixed(1)}" rx="${(length*0.07).toFixed(1)}" ry="${(length*0.03).toFixed(1)}" transform="rotate(-15 ${x.toFixed(1)} ${(y - 6).toFixed(1)})" fill="${fill}" opacity="0.95"/>`;
      parts += `<ellipse cx="${x.toFixed(1)}" cy="${(y + 6).toFixed(1)}" rx="${(length*0.06).toFixed(1)}" ry="${(length*0.025).toFixed(1)}" transform="rotate(15 ${x.toFixed(1)} ${(y + 6).toFixed(1)})" fill="${fill}" opacity="0.85"/>`;
    }
    return `<g>${parts}</g>`;
  },

  /* =====================================================
     ████████  CASTELLANO  ████████
     ===================================================== */

  openBook: (palette, scale = 1) => {
    const ul = _uid('ob-l'); const ur = _uid('ob-r'); const ucv = _uid('ob-c');
    const paper = palette.accent2 || '#fff8f0';
    return `<g transform="scale(${scale})">
      <defs>
        <linearGradient id="${ul}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix(paper, '#000', 0.18)}"/>
          <stop offset="60%" stop-color="${paper}"/>
          <stop offset="100%" stop-color="${_mix(paper, '#000', 0.05)}"/>
        </linearGradient>
        <linearGradient id="${ur}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix(paper, '#000', 0.05)}"/>
          <stop offset="40%" stop-color="${paper}"/>
          <stop offset="100%" stop-color="${_mix(paper, '#000', 0.18)}"/>
        </linearGradient>
        <linearGradient id="${ucv}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.accent || palette.ink, '#000', 0.25)}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent || palette.ink, '#000', 0.55)}"/>
        </linearGradient>
      </defs>
      <!-- shadow under book -->
      <ellipse cx="0" cy="90" rx="310" ry="18" fill="#000" opacity="0.32" filter="url(#ds-glow-sm)"/>
      <!-- back cover (slightly larger, sticking out) -->
      <path d="M -300 -6 L 0 -42 L 300 -6 L 300 86 L 0 56 L -300 86 Z" fill="url(#${ucv})"/>
      <!-- side pages stacked - left -->
      <path d="M -290 -8 L -8 -42 L -8 54 L -290 84 Z" fill="${_mix(paper, '#000', 0.1)}"/>
      <path d="M -284 -7 L -10 -40 L -10 52 L -284 80 Z" fill="${paper}"/>
      <!-- side pages stacked - right -->
      <path d="M 290 -8 L 8 -42 L 8 54 L 290 84 Z" fill="${_mix(paper, '#000', 0.1)}"/>
      <path d="M 284 -7 L 10 -40 L 10 52 L 284 80 Z" fill="${paper}"/>
      <!-- top pages (curving) - left page -->
      <path d="M -280 -10 L -2 -38 L -2 50 L -280 76 Z" fill="url(#${ul})"/>
      <!-- top pages - right page -->
      <path d="M 280 -10 L 2 -38 L 2 50 L 280 76 Z" fill="url(#${ur})"/>
      <!-- spine shadow at center -->
      <path d="M -8 -38 L -2 -38 L -2 50 L -8 54 Z" fill="${_mix(palette.ink, '#000', 0.4)}" opacity="0.5"/>
      <path d="M 2 -38 L 8 -38 L 8 54 L 2 50 Z" fill="${_mix(palette.ink, '#000', 0.4)}" opacity="0.5"/>
      <!-- text lines with realistic perspective -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 8; i++) {
          const y = -28 + i * 10;
          const lw = 0.75 - i * 0.03;
          const len = i % 3 === 2 ? 0.6 : 1;
          s += `<line x1="${-260*len}" y1="${y+18}" x2="-20" y2="${y - 14}" stroke="${palette.ink}" stroke-width="1.1" opacity="${lw.toFixed(2)}"/>`;
          s += `<line x1="20" y1="${y - 14}" x2="${260*len}" y2="${y+18}" stroke="${palette.ink}" stroke-width="1.1" opacity="${lw.toFixed(2)}"/>`;
        }
        return s;
      })()}
      <!-- decorative initial capital on left page -->
      <rect x="-262" y="-30" width="34" height="34" fill="${palette.accent}" opacity="0.9" rx="2"/>
      <path d="M -255 -25 L -255 2 M -255 -25 L -240 -25 M -255 -12 L -242 -12" stroke="${paper}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- bookmark ribbon -->
      <path d="M -120 -20 L -120 75 L -110 62 L -100 75 L -100 -16 Z" fill="${palette.accent}"/>
      <path d="M -120 -20 L -100 -16 L -100 -8 L -120 -12 Z" fill="${_mix(palette.accent, '#000', 0.25)}"/>
      <path d="M -118 -18 L -118 60" stroke="#ffffff" stroke-width="1" opacity="0.45"/>
      <!-- subtle page edges -->
      <line x1="-280" y1="-10" x2="-2" y2="-38" stroke="${_mix(paper, '#000', 0.25)}" stroke-width="0.8" opacity="0.6"/>
      <line x1="2" y1="-38" x2="280" y2="-10" stroke="${_mix(paper, '#000', 0.25)}" stroke-width="0.8" opacity="0.6"/>
    </g>`;
  },

  closedBook: (palette, scale = 1, color = null) => {
    const c = color || palette.accent;
    const ug = _uid('cb-g'); const us = _uid('cb-s');
    const accent = palette.accent2 || '#fff8f0';
    return `<g transform="scale(${scale})">
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix(c, '#000', 0.3)}"/>
          <stop offset="25%" stop-color="${c}"/>
          <stop offset="75%" stop-color="${c}"/>
          <stop offset="100%" stop-color="${_mix(c, '#000', 0.4)}"/>
        </linearGradient>
        <linearGradient id="${us}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(accent, '#000', 0.15)}"/>
          <stop offset="50%" stop-color="${accent}"/>
          <stop offset="100%" stop-color="${_mix(accent, '#000', 0.2)}"/>
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="75" rx="92" ry="8" fill="#000" opacity="0.35"/>
      <!-- pages (visible on right side) -->
      <rect x="78" y="-105" width="10" height="170" fill="url(#${us})"/>
      <line x1="80" y1="-100" x2="80" y2="60" stroke="${_mix(accent, '#000', 0.3)}" stroke-width="0.6"/>
      <line x1="84" y1="-100" x2="84" y2="60" stroke="${_mix(accent, '#000', 0.3)}" stroke-width="0.6"/>
      <!-- main cover -->
      <rect x="-80" y="-110" width="160" height="180" rx="4" fill="url(#${ug})"/>
      <!-- spine band -->
      <rect x="-80" y="-110" width="160" height="18" fill="${_mix(c, '#000', 0.4)}"/>
      <rect x="-80" y="62" width="160" height="8" fill="${_mix(c, '#000', 0.4)}"/>
      <!-- decorative gold lines -->
      <rect x="-72" y="-100" width="144" height="2" fill="${accent}" opacity="0.85"/>
      <rect x="-72" y="-94" width="144" height="1" fill="${accent}" opacity="0.55"/>
      <!-- title plaque -->
      <rect x="-50" y="-50" width="100" height="50" rx="2" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>
      <line x1="-40" y1="-35" x2="40" y2="-35" stroke="${accent}" stroke-width="2" opacity="0.85"/>
      <line x1="-30" y1="-20" x2="30" y2="-20" stroke="${accent}" stroke-width="1.5" opacity="0.7"/>
      <!-- decorative diamond -->
      <path d="M 0 20 L 12 32 L 0 44 L -12 32 Z" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
      <circle cx="0" cy="32" r="3" fill="${accent}" opacity="0.85"/>
      <!-- spine highlight (left edge of cover) -->
      <rect x="-80" y="-110" width="3" height="180" fill="#ffffff" opacity="0.2"/>
      <!-- raised band on spine area -->
      <rect x="78" y="-110" width="2" height="180" fill="${_mix(c, '#000', 0.5)}"/>
    </g>`;
  },

  bookStack: (palette, scale = 1) => {
    const accent = palette.accent2 || '#fff8f0';
    const book = (x, y, w, h, fill, rot, label) => {
      const ug = _uid('bs-g');
      return `<g transform="translate(${x} ${y}) rotate(${rot})">
        <defs>
          <linearGradient id="${ug}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${_mix(fill, '#ffffff', 0.15)}"/>
            <stop offset="100%" stop-color="${_mix(fill, '#000', 0.25)}"/>
          </linearGradient>
        </defs>
        <rect x="${-w/2}" y="0" width="${w}" height="${h}" rx="2" fill="url(#${ug})"/>
        <rect x="${-w/2 + 3}" y="3" width="${w-6}" height="2" fill="${accent}" opacity="0.65"/>
        <rect x="${-w/2 + 3}" y="${h-5}" width="${w-6}" height="2" fill="${accent}" opacity="0.55"/>
        <!-- pages on right -->
        <rect x="${w/2 - 2}" y="0" width="3" height="${h}" fill="${accent}" opacity="0.85"/>
        <line x1="${w/2 - 2}" y1="${h*0.3}" x2="${w/2 + 1}" y2="${h*0.3}" stroke="${_mix(accent, '#000', 0.3)}" stroke-width="0.5"/>
        <line x1="${w/2 - 2}" y1="${h*0.6}" x2="${w/2 + 1}" y2="${h*0.6}" stroke="${_mix(accent, '#000', 0.3)}" stroke-width="0.5"/>
        ${label ? `<rect x="${-w*0.3}" y="${h*0.35}" width="${w*0.6}" height="${h*0.3}" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.7" rx="1"/>` : ''}
        <rect x="${-w/2}" y="0" width="${w}" height="3" fill="${_mix(fill, '#000', 0.4)}"/>
      </g>`;
    };
    return `<g transform="scale(${scale})">
      <ellipse cx="0" cy="190" rx="180" ry="16" fill="#000" opacity="0.4" filter="url(#ds-glow-sm)"/>
      ${book(0, 125, 340, 55, palette.accent, 0, true)}
      ${book(8, 65, 310, 55, palette.mute, -3, true)}
      ${book(-6, 5, 280, 55, palette.bg[2] || palette.accent2, 2, false)}
      ${book(4, -55, 250, 52, palette.ink, -1, true)}
    </g>`;
  },

  feather: (size = 160, fill = '#3d2814') => `
    <g>
      <path d="M0 0 C ${size*0.1} ${-size*0.5}, ${size*0.4} ${-size*0.85}, ${size*0.65} ${-size}
               C ${size*0.5} ${-size*0.6}, ${size*0.3} ${-size*0.25}, ${size*0.08} ${size*0.1} Z" fill="${fill}"/>
      <path d="M0 0 L ${size*0.6} ${-size*0.95}" stroke="${fill}" stroke-width="${size*0.012}" opacity="0.5"/>
      ${(() => {
        let s = '';
        for (let i = 1; i < 9; i++) {
          const t = i / 9;
          const x1 = size * 0.6 * t, y1 = -size * 0.95 * t;
          const x2 = x1 + size * 0.06, y2 = y1 + size * 0.04;
          s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${fill}" stroke-width="${size*0.008}" opacity="0.45"/>`;
        }
        return s;
      })()}
    </g>`,

  inkwell: (size = 80, palette) => `
    <g>
      <ellipse cx="0" cy="${size*0.05}" rx="${size*0.55}" ry="${size*0.13}" fill="${palette.bg[0]}" opacity="0.85"/>
      <path d="M ${-size*0.4} ${-size*0.05} L ${-size*0.4} ${-size*0.55} C ${-size*0.4} ${-size*0.7}, ${-size*0.28} ${-size*0.78}, 0 ${-size*0.78} C ${size*0.28} ${-size*0.78}, ${size*0.4} ${-size*0.7}, ${size*0.4} ${-size*0.55} L ${size*0.4} ${-size*0.05} Z" fill="${palette.ink}"/>
      <ellipse cx="0" cy="${-size*0.55}" rx="${size*0.4}" ry="${size*0.1}" fill="${palette.accent}"/>
      <ellipse cx="0" cy="${-size*0.55}" rx="${size*0.22}" ry="${size*0.05}" fill="${palette.bg[2]}" opacity="0.6"/>
    </g>`,

  // Pergamino / scroll
  scroll: (size = 140, palette) => `
    <g>
      <rect x="${-size*0.8}" y="${-size*0.18}" width="${size*1.6}" height="${size*0.36}" fill="${palette.accent2 || '#f5e8d0'}" stroke="${palette.ink}" stroke-width="1.5"/>
      <ellipse cx="${-size*0.8}" cy="0" rx="${size*0.1}" ry="${size*0.18}" fill="${palette.accent}"/>
      <ellipse cx="${size*0.8}" cy="0" rx="${size*0.1}" ry="${size*0.18}" fill="${palette.accent}"/>
      <line x1="${-size*0.6}" y1="${-size*0.08}" x2="${size*0.6}" y2="${-size*0.08}" stroke="${palette.ink}" stroke-width="1" opacity="0.55"/>
      <line x1="${-size*0.6}" y1="0" x2="${size*0.5}" y2="0" stroke="${palette.ink}" stroke-width="1" opacity="0.55"/>
      <line x1="${-size*0.6}" y1="${size*0.08}" x2="${size*0.55}" y2="${size*0.08}" stroke="${palette.ink}" stroke-width="1" opacity="0.55"/>
    </g>`,

  // Sobre / envelope
  envelope: (size = 100, palette) => `
    <g>
      <rect x="${-size*0.7}" y="${-size*0.45}" width="${size*1.4}" height="${size*0.9}" rx="${size*0.03}" fill="${palette.accent2 || '#f5e8d0'}" stroke="${palette.ink}" stroke-width="1.8"/>
      <path d="M ${-size*0.7} ${-size*0.45} L 0 ${size*0.15} L ${size*0.7} ${-size*0.45}" fill="none" stroke="${palette.ink}" stroke-width="1.8"/>
      <circle r="${size*0.13}" fill="${palette.accent}"/>
      <circle r="${size*0.08}" fill="none" stroke="${palette.accent2 || '#fff'}" stroke-width="1.2" opacity="0.6"/>
    </g>`,

  // Gafas de leer
  glasses: (size = 100, palette) => `
    <g fill="none" stroke="${palette.ink}" stroke-width="${size*0.06}">
      <circle cx="${-size*0.45}" cy="0" r="${size*0.3}"/>
      <circle cx="${size*0.45}" cy="0" r="${size*0.3}"/>
      <line x1="${-size*0.18}" y1="${-size*0.08}" x2="${size*0.18}" y2="${-size*0.08}"/>
      <path d="M ${-size*0.74} ${-size*0.1} Q ${-size*0.85} ${-size*0.18}, ${-size*0.9} ${-size*0.05}"/>
      <path d="M ${size*0.74} ${-size*0.1} Q ${size*0.85} ${-size*0.18}, ${size*0.9} ${-size*0.05}"/>
    </g>`,

  /* =====================================================
     ████████  INGLÉS  ████████
     ===================================================== */

  bigBen: (size = 180, palette) => {
    const ug = _uid('bb-g'); const ud = _uid('bb-d');
    const stone = palette.accent;
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix(stone, '#000', 0.3)}"/>
          <stop offset="40%" stop-color="${stone}"/>
          <stop offset="60%" stop-color="${stone}"/>
          <stop offset="100%" stop-color="${_mix(stone, '#000', 0.35)}"/>
        </linearGradient>
        <radialGradient id="${ud}" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="${_mix(palette.accent2 || '#fff', '#000', 0.1)}"/>
          <stop offset="80%" stop-color="${palette.accent2 || '#fff'}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent2 || '#fff', '#000', 0.3)}"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.42, size*0.28, size*0.03, 0.35)}
      <!-- main tower shaft -->
      <rect x="${-size*0.17}" y="${-size*0.4}" width="${size*0.34}" height="${size*0.8}" fill="url(#${ug})"/>
      <!-- vertical detail lines on shaft -->
      <line x1="${-size*0.12}" y1="${-size*0.35}" x2="${-size*0.12}" y2="${size*0.36}" stroke="${_mix(stone, '#000', 0.4)}" stroke-width="${size*0.005}" opacity="0.7"/>
      <line x1="${size*0.12}" y1="${-size*0.35}" x2="${size*0.12}" y2="${size*0.36}" stroke="${_mix(stone, '#000', 0.4)}" stroke-width="${size*0.005}" opacity="0.7"/>
      <line x1="${-size*0.16}" y1="${-size*0.4}" x2="${-size*0.16}" y2="${size*0.4}" stroke="#ffffff" stroke-width="${size*0.005}" opacity="0.25"/>
      <!-- windows on shaft -->
      <rect x="${-size*0.04}" y="${-size*0.25}" width="${size*0.08}" height="${size*0.1}" rx="1" fill="${palette.bg[0]}" opacity="0.55"/>
      <rect x="${-size*0.04}" y="${-size*0.05}" width="${size*0.08}" height="${size*0.1}" rx="1" fill="${palette.bg[0]}" opacity="0.55"/>
      <rect x="${-size*0.04}" y="${size*0.15}" width="${size*0.08}" height="${size*0.1}" rx="1" fill="${palette.bg[0]}" opacity="0.55"/>
      <!-- clock face section base -->
      <rect x="${-size*0.21}" y="${-size*0.58}" width="${size*0.42}" height="${size*0.22}" fill="url(#${ug})"/>
      <!-- clock face circle -->
      <circle cx="0" cy="${-size*0.47}" r="${size*0.092}" fill="url(#${ud})"/>
      <circle cx="0" cy="${-size*0.47}" r="${size*0.092}" fill="none" stroke="${_mix(stone, '#000', 0.4)}" stroke-width="${size*0.012}"/>
      <!-- clock numerals (tick marks) -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 12; i++) {
          const a = (i * 30 - 90) * Math.PI / 180;
          const x1 = Math.cos(a) * size * 0.078, y1 = -size*0.47 + Math.sin(a) * size * 0.078;
          const x2 = Math.cos(a) * size * 0.088, y2 = -size*0.47 + Math.sin(a) * size * 0.088;
          s += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${palette.ink}" stroke-width="${(size*0.006).toFixed(2)}"/>`;
        }
        return s;
      })()}
      <line x1="0" y1="${-size*0.47}" x2="0" y2="${-size*0.53}" stroke="${palette.ink}" stroke-width="${size*0.008}" stroke-linecap="round"/>
      <line x1="0" y1="${-size*0.47}" x2="${size*0.05}" y2="${-size*0.44}" stroke="${palette.ink}" stroke-width="${size*0.006}" stroke-linecap="round"/>
      <circle cx="0" cy="${-size*0.47}" r="${size*0.01}" fill="${palette.ink}"/>
      <!-- belfry section -->
      <rect x="${-size*0.15}" y="${-size*0.75}" width="${size*0.3}" height="${size*0.17}" fill="url(#${ug})"/>
      <rect x="${-size*0.12}" y="${-size*0.72}" width="${size*0.04}" height="${size*0.1}" fill="${palette.bg[0]}" opacity="0.55"/>
      <rect x="${-size*0.02}" y="${-size*0.72}" width="${size*0.04}" height="${size*0.1}" fill="${palette.bg[0]}" opacity="0.55"/>
      <rect x="${size*0.08}" y="${-size*0.72}" width="${size*0.04}" height="${size*0.1}" fill="${palette.bg[0]}" opacity="0.55"/>
      <!-- top crown -->
      <rect x="${-size*0.18}" y="${-size*0.78}" width="${size*0.36}" height="${size*0.04}" fill="${_mix(stone, '#000', 0.2)}"/>
      <rect x="${-size*0.11}" y="${-size*0.85}" width="${size*0.22}" height="${size*0.07}" fill="url(#${ug})"/>
      <!-- spire -->
      <polygon points="${-size*0.11},${-size*0.85} ${size*0.11},${-size*0.85} 0,${-size*1.08}" fill="${_mix(stone, '#ffffff', 0.15)}"/>
      <polygon points="${-size*0.06},${-size*0.85} ${size*0.06},${-size*0.85} 0,${-size*1.08}" fill="${stone}"/>
      <line x1="0" y1="${-size*0.85}" x2="0" y2="${-size*1.08}" stroke="#ffffff" stroke-width="${size*0.004}" opacity="0.45"/>
      <!-- finial ball -->
      <circle cx="0" cy="${-size*1.08}" r="${size*0.025}" fill="${palette.accent2 || '#fff'}"/>
      <circle cx="${-size*0.005}" cy="${-size*1.085}" r="${size*0.008}" fill="#ffffff" opacity="0.85"/>
      <!-- base step -->
      <rect x="${-size*0.24}" y="${size*0.36}" width="${size*0.48}" height="${size*0.05}" fill="${_mix(stone, '#000', 0.3)}"/>
      <rect x="${-size*0.26}" y="${size*0.41}" width="${size*0.52}" height="${size*0.04}" fill="${_mix(stone, '#000', 0.45)}"/>
    </g>`;
  },

  londonBus: (size = 180, palette) => {
    const ug = _uid('lb-g'); const uw = _uid('lb-w'); const ut = _uid('lb-t');
    const red = palette.accent;
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(red, '#ffffff', 0.25)}"/>
          <stop offset="40%" stop-color="${red}"/>
          <stop offset="100%" stop-color="${_mix(red, '#000', 0.35)}"/>
        </linearGradient>
        <linearGradient id="${uw}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.bg[0], '#ffffff', 0.3)}"/>
          <stop offset="100%" stop-color="${_mix(palette.bg[0], '#000', 0.2)}"/>
        </linearGradient>
        <radialGradient id="${ut}" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#444"/>
          <stop offset="80%" stop-color="#1a1a1a"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.4, size*0.5, size*0.04, 0.4)}
      <!-- second deck (top) -->
      <rect x="${-size*0.48}" y="${-size*0.55}" width="${size*0.96}" height="${size*0.25}" rx="${size*0.04}" fill="url(#${ug})"/>
      <!-- main body -->
      <rect x="${-size*0.5}" y="${-size*0.55}" width="${size}" height="${size*0.85}" rx="${size*0.04}" fill="url(#${ug})"/>
      <!-- top deck divider -->
      <rect x="${-size*0.5}" y="${-size*0.3}" width="${size}" height="${size*0.025}" fill="${_mix(red, '#000', 0.5)}"/>
      <!-- bottom strip with route info -->
      <rect x="${-size*0.5}" y="${-size*0.05}" width="${size}" height="${size*0.04}" fill="${_mix(red, '#ffffff', 0.4)}" opacity="0.85"/>
      <!-- upper deck windows -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const x = -size*0.44 + i * size*0.18;
          s += `<rect x="${x.toFixed(1)}" y="${-size*0.5}" width="${(size*0.14).toFixed(1)}" height="${(size*0.16).toFixed(1)}" rx="2" fill="url(#${uw})" stroke="${_mix(red, '#000', 0.5)}" stroke-width="1"/>`;
          s += `<rect x="${(x+2).toFixed(1)}" y="${-size*0.495}" width="${(size*0.05).toFixed(1)}" height="${(size*0.05).toFixed(1)}" rx="1" fill="#ffffff" opacity="0.45"/>`;
        }
        return s;
      })()}
      <!-- lower deck windows -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const x = -size*0.44 + i * size*0.18;
          s += `<rect x="${x.toFixed(1)}" y="${-size*0.24}" width="${(size*0.14).toFixed(1)}" height="${(size*0.16).toFixed(1)}" rx="2" fill="url(#${uw})" stroke="${_mix(red, '#000', 0.5)}" stroke-width="1"/>`;
          s += `<rect x="${(x+2).toFixed(1)}" y="${-size*0.235}" width="${(size*0.05).toFixed(1)}" height="${(size*0.05).toFixed(1)}" rx="1" fill="#ffffff" opacity="0.4"/>`;
        }
        return s;
      })()}
      <!-- destination signage at top -->
      <rect x="${-size*0.32}" y="${-size*0.66}" width="${size*0.64}" height="${size*0.1}" rx="${size*0.015}" fill="${palette.bg[0]}"/>
      <text x="0" y="${-size*0.6}" text-anchor="middle" font-family="Inter, sans-serif" font-size="${size*0.06}" font-weight="700" fill="${palette.accent2 || '#fff'}">LONDON</text>
      <!-- route number badge -->
      <rect x="${-size*0.06}" y="${-size*0.78}" width="${size*0.12}" height="${size*0.1}" rx="${size*0.015}" fill="${palette.accent2 || '#fff'}"/>
      <text x="0" y="${-size*0.7}" text-anchor="middle" font-family="Inter, sans-serif" font-size="${size*0.07}" font-weight="800" fill="${red}">9</text>
      <!-- door (front) -->
      <rect x="${size*0.4}" y="${-size*0.24}" width="${size*0.09}" height="${size*0.32}" rx="${size*0.012}" fill="url(#${uw})" stroke="${_mix(red, '#000', 0.5)}" stroke-width="1"/>
      <line x1="${size*0.445}" y1="${-size*0.22}" x2="${size*0.445}" y2="${size*0.06}" stroke="${_mix(red, '#000', 0.5)}" stroke-width="1"/>
      <!-- wheels with hubs -->
      <circle cx="${-size*0.3}" cy="${size*0.3}" r="${size*0.1}" fill="url(#${ut})"/>
      <circle cx="${-size*0.3}" cy="${size*0.3}" r="${size*0.07}" fill="${_mix(red, '#000', 0.6)}"/>
      <circle cx="${-size*0.3}" cy="${size*0.3}" r="${size*0.04}" fill="${_mix('#888', '#ddd', 0.5)}"/>
      <circle cx="${-size*0.3}" cy="${size*0.3}" r="${size*0.015}" fill="#222"/>
      <line x1="${-size*0.34}" y1="${size*0.3}" x2="${-size*0.26}" y2="${size*0.3}" stroke="#222" stroke-width="${size*0.008}"/>
      <line x1="${-size*0.3}" y1="${size*0.26}" x2="${-size*0.3}" y2="${size*0.34}" stroke="#222" stroke-width="${size*0.008}"/>
      <circle cx="${size*0.3}" cy="${size*0.3}" r="${size*0.1}" fill="url(#${ut})"/>
      <circle cx="${size*0.3}" cy="${size*0.3}" r="${size*0.07}" fill="${_mix(red, '#000', 0.6)}"/>
      <circle cx="${size*0.3}" cy="${size*0.3}" r="${size*0.04}" fill="${_mix('#888', '#ddd', 0.5)}"/>
      <circle cx="${size*0.3}" cy="${size*0.3}" r="${size*0.015}" fill="#222"/>
      <line x1="${size*0.26}" y1="${size*0.3}" x2="${size*0.34}" y2="${size*0.3}" stroke="#222" stroke-width="${size*0.008}"/>
      <line x1="${size*0.3}" y1="${size*0.26}" x2="${size*0.3}" y2="${size*0.34}" stroke="#222" stroke-width="${size*0.008}"/>
      <!-- headlight -->
      <circle cx="${size*0.48}" cy="${size*0.1}" r="${size*0.022}" fill="${palette.accent2 || '#fff'}" opacity="0.85"/>
      <!-- shine highlight -->
      <rect x="${-size*0.48}" y="${-size*0.53}" width="${size*0.96}" height="${size*0.04}" fill="#ffffff" opacity="0.25" rx="${size*0.04}"/>
    </g>`;
  },

  // Cabina telefónica roja (clásica K6 británica con corona y vidrios)
  phoneBooth: (size = 130, palette) => {
    const ug = _uid('pb-g'); const uw = _uid('pb-w');
    const red = palette.accent;
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix(red, '#000', 0.3)}"/>
          <stop offset="40%" stop-color="${red}"/>
          <stop offset="100%" stop-color="${_mix(red, '#000', 0.4)}"/>
        </linearGradient>
        <linearGradient id="${uw}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.bg[0], '#ffffff', 0.5)}" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="${_mix(palette.bg[0], '#000', 0.2)}" stop-opacity="0.65"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.95, size*0.45, size*0.03, 0.35)}
      <!-- top crown -->
      <rect x="${-size*0.42}" y="${-size*1.1}" width="${size*0.84}" height="${size*0.05}" rx="${size*0.01}" fill="url(#${ug})"/>
      <rect x="${-size*0.38}" y="${-size*1.05}" width="${size*0.76}" height="${size*0.05}" fill="url(#${ug})"/>
      <!-- TELEPHONE band -->
      <rect x="${-size*0.38}" y="${-size*1.0}" width="${size*0.76}" height="${size*0.08}" fill="${_mix(red, '#ffffff', 0.15)}"/>
      <text x="0" y="${-size*0.945}" text-anchor="middle" font-family="Inter, sans-serif" font-size="${size*0.05}" font-weight="800" letter-spacing="2" fill="${palette.accent2 || '#fff'}">TELEPHONE</text>
      <!-- main body -->
      <rect x="${-size*0.4}" y="${-size*0.92}" width="${size*0.8}" height="${size*1.82}" rx="${size*0.03}" fill="url(#${ug})"/>
      <!-- window frame top -->
      <rect x="${-size*0.34}" y="${-size*0.88}" width="${size*0.68}" height="${size*0.5}" rx="${size*0.01}" fill="${_mix(red, '#000', 0.5)}"/>
      <rect x="${-size*0.32}" y="${-size*0.86}" width="${size*0.64}" height="${size*0.46}" rx="${size*0.005}" fill="url(#${uw})"/>
      <!-- window grid (small panes) -->
      <line x1="${-size*0.32}" y1="${-size*0.73}" x2="${size*0.32}" y2="${-size*0.73}" stroke="${red}" stroke-width="${size*0.02}"/>
      <line x1="${-size*0.32}" y1="${-size*0.58}" x2="${size*0.32}" y2="${-size*0.58}" stroke="${red}" stroke-width="${size*0.02}"/>
      <line x1="0" y1="${-size*0.86}" x2="0" y2="${-size*0.4}" stroke="${red}" stroke-width="${size*0.02}"/>
      <!-- panel below window -->
      <rect x="${-size*0.34}" y="${-size*0.35}" width="${size*0.68}" height="${size*0.42}" rx="${size*0.01}" fill="${_mix(red, '#000', 0.45)}"/>
      <!-- crown logo on panel -->
      <g transform="translate(0 ${-size*0.18})">
        <path d="M ${-size*0.06} ${size*0.02} L ${-size*0.06} ${-size*0.02} L ${-size*0.03} ${size*0.01} L ${-size*0.02} ${-size*0.03} L 0 ${size*0.01} L ${size*0.02} ${-size*0.03} L ${size*0.03} ${size*0.01} L ${size*0.06} ${-size*0.02} L ${size*0.06} ${size*0.02} Z" fill="${palette.accent2 || '#fff'}"/>
      </g>
      <!-- door handle -->
      <circle cx="${size*0.28}" cy="${-size*0.05}" r="${size*0.025}" fill="${_mix(palette.accent2 || '#fff', '#000', 0.3)}"/>
      <!-- lower windows -->
      <rect x="${-size*0.34}" y="${size*0.1}" width="${size*0.68}" height="${size*0.42}" rx="${size*0.01}" fill="${_mix(red, '#000', 0.45)}"/>
      <rect x="${-size*0.32}" y="${size*0.12}" width="${size*0.64}" height="${size*0.38}" rx="${size*0.005}" fill="url(#${uw})"/>
      <line x1="0" y1="${size*0.12}" x2="0" y2="${size*0.5}" stroke="${red}" stroke-width="${size*0.02}"/>
      <line x1="${-size*0.32}" y1="${size*0.3}" x2="${size*0.32}" y2="${size*0.3}" stroke="${red}" stroke-width="${size*0.02}"/>
      <!-- base / step -->
      <rect x="${-size*0.42}" y="${size*0.78}" width="${size*0.84}" height="${size*0.1}" rx="${size*0.01}" fill="${_mix(red, '#000', 0.5)}"/>
      <rect x="${-size*0.44}" y="${size*0.86}" width="${size*0.88}" height="${size*0.06}" fill="${_mix(red, '#000', 0.6)}"/>
      <!-- left edge highlight -->
      <rect x="${-size*0.4}" y="${-size*0.92}" width="${size*0.03}" height="${size*1.82}" fill="#ffffff" opacity="0.2"/>
      <!-- top window reflection -->
      <path d="M ${-size*0.3} ${-size*0.84} L ${-size*0.18} ${-size*0.45}" stroke="#ffffff" stroke-width="${size*0.015}" opacity="0.5"/>
    </g>`;
  },

  // Corona
  crown: (size = 100, palette) => `
    <g>
      <path d="M ${-size*0.55} ${size*0.3}
               L ${-size*0.55} ${-size*0.2}
               L ${-size*0.32} ${size*0.1}
               L ${-size*0.18} ${-size*0.4}
               L 0 ${size*0.1}
               L ${size*0.18} ${-size*0.4}
               L ${size*0.32} ${size*0.1}
               L ${size*0.55} ${-size*0.2}
               L ${size*0.55} ${size*0.3} Z" fill="${palette.accent || '#f5c842'}"/>
      <rect x="${-size*0.55}" y="${size*0.3}" width="${size*1.1}" height="${size*0.13}" rx="${size*0.02}" fill="${palette.accent}"/>
      <circle cx="${-size*0.55}" cy="${-size*0.2}" r="${size*0.07}" fill="${palette.accent2 || '#fff'}"/>
      <circle cx="${size*0.55}" cy="${-size*0.2}" r="${size*0.07}" fill="${palette.accent2 || '#fff'}"/>
      <circle cx="0" cy="${-size*0.42}" r="${size*0.08}" fill="#b3354c"/>
      <circle cx="${-size*0.18}" cy="${-size*0.4}" r="${size*0.05}" fill="#5b9aff"/>
      <circle cx="${size*0.18}" cy="${-size*0.4}" r="${size*0.05}" fill="#4d6b2e"/>
    </g>`,

  // Taza de té con platillo, asa, té oscuro y vapor
  teaCup: (size = 100, palette) => {
    const ug = _uid('tc-g'); const ul = _uid('tc-l');
    const porcelain = palette.accent2 || '#fff8f0';
    return `<g>
      <defs>
        <linearGradient id="${ug}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${_mix(porcelain, '#000', 0.2)}"/>
          <stop offset="40%" stop-color="${porcelain}"/>
          <stop offset="100%" stop-color="${_mix(porcelain, '#000', 0.25)}"/>
        </linearGradient>
        <radialGradient id="${ul}" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${_mix('#5a3614', '#000', 0.0)}"/>
          <stop offset="100%" stop-color="${_mix('#5a3614', '#000', 0.5)}"/>
        </radialGradient>
      </defs>
      <!-- saucer shadow -->
      <ellipse cx="0" cy="${size*0.7}" rx="${size*0.7}" ry="${size*0.06}" fill="#000" opacity="0.35"/>
      <!-- saucer -->
      <ellipse cx="0" cy="${size*0.65}" rx="${size*0.7}" ry="${size*0.1}" fill="${_mix(porcelain, '#000', 0.2)}"/>
      <ellipse cx="0" cy="${size*0.6}" rx="${size*0.7}" ry="${size*0.1}" fill="url(#${ug})"/>
      <ellipse cx="0" cy="${size*0.59}" rx="${size*0.45}" ry="${size*0.05}" fill="${_mix(porcelain, '#000', 0.18)}"/>
      <!-- cup body -->
      <path d="M ${-size*0.45} 0 L ${-size*0.38} ${size*0.5} Q ${-size*0.36} ${size*0.58}, ${-size*0.28} ${size*0.58} L ${size*0.28} ${size*0.58} Q ${size*0.36} ${size*0.58}, ${size*0.38} ${size*0.5} L ${size*0.45} 0 Z" fill="url(#${ug})" stroke="${palette.ink}" stroke-width="1.5"/>
      <!-- decorative band -->
      <path d="M ${-size*0.44} ${size*0.06} L ${-size*0.4} ${size*0.46}" stroke="${palette.accent}" stroke-width="${size*0.012}" fill="none" opacity="0.85"/>
      <path d="M ${size*0.44} ${size*0.06} L ${size*0.4} ${size*0.46}" stroke="${palette.accent}" stroke-width="${size*0.012}" fill="none" opacity="0.85"/>
      <line x1="${-size*0.43}" y1="${size*0.12}" x2="${size*0.43}" y2="${size*0.12}" stroke="${palette.accent}" stroke-width="${size*0.018}" opacity="0.85"/>
      <line x1="${-size*0.42}" y1="${size*0.2}" x2="${size*0.42}" y2="${size*0.2}" stroke="${palette.accent}" stroke-width="${size*0.008}" opacity="0.6"/>
      <!-- handle (outer + inner) -->
      <path d="M ${size*0.42} ${size*0.1} Q ${size*0.75} ${size*0.12}, ${size*0.72} ${size*0.32} Q ${size*0.68} ${size*0.48}, ${size*0.38} ${size*0.42}" stroke="${_mix(porcelain, '#000', 0.2)}" stroke-width="${size*0.075}" fill="none" stroke-linecap="round"/>
      <path d="M ${size*0.42} ${size*0.13} Q ${size*0.7} ${size*0.15}, ${size*0.67} ${size*0.32} Q ${size*0.63} ${size*0.44}, ${size*0.38} ${size*0.38}" stroke="${porcelain}" stroke-width="${size*0.04}" fill="none" stroke-linecap="round"/>
      <!-- tea inside (top ellipse) -->
      <ellipse cx="0" cy="0" rx="${size*0.43}" ry="${size*0.07}" fill="${_mix(palette.ink, '#3a1810', 0.5)}"/>
      <ellipse cx="0" cy="${-size*0.005}" rx="${size*0.4}" ry="${size*0.055}" fill="url(#${ul})"/>
      <ellipse cx="${-size*0.12}" cy="${-size*0.018}" rx="${size*0.08}" ry="${size*0.012}" fill="#ffffff" opacity="0.4"/>
      <ellipse cx="${size*0.18}" cy="0" rx="${size*0.05}" ry="${size*0.008}" fill="#ffffff" opacity="0.25"/>
      <!-- cup body shine -->
      <path d="M ${-size*0.4} ${size*0.05} L ${-size*0.34} ${size*0.45}" stroke="#ffffff" stroke-width="${size*0.025}" opacity="0.4" stroke-linecap="round"/>
      <!-- steam -->
      <path d="M ${-size*0.15} ${-size*0.1} Q ${-size*0.22} ${-size*0.3}, ${-size*0.1} ${-size*0.5} Q 0 ${-size*0.7}, ${-size*0.06} ${-size*0.9}" stroke="${porcelain}" stroke-width="${size*0.025}" fill="none" opacity="0.6" stroke-linecap="round"/>
      <path d="M 0 ${-size*0.1} Q ${size*0.06} ${-size*0.3}, ${-size*0.04} ${-size*0.55} Q ${-size*0.12} ${-size*0.78}, 0 ${-size*1}" stroke="${porcelain}" stroke-width="${size*0.022}" fill="none" opacity="0.5" stroke-linecap="round"/>
      <path d="M ${size*0.12} ${-size*0.1} Q ${size*0.2} ${-size*0.3}, ${size*0.08} ${-size*0.5} Q 0 ${-size*0.7}, ${size*0.04} ${-size*0.85}" stroke="${porcelain}" stroke-width="${size*0.025}" fill="none" opacity="0.45" stroke-linecap="round"/>
    </g>`;
  },

  /* =====================================================
     ████████  MÚSICA  ████████
     ===================================================== */

  trebleClef: (size = 200, color = '#1a0d14') => `
    <g stroke="${color}" stroke-width="${size*0.085}" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 0 ${size*0.65}
               Q ${-size*0.4} ${size*0.65}, ${-size*0.4} ${size*0.4}
               Q ${-size*0.4} ${size*0.15}, ${-size*0.08} ${size*0.1}
               Q ${size*0.24} ${size*0.05}, ${size*0.24} ${-size*0.2}
               Q ${size*0.24} ${-size*0.55}, ${-size*0.05} ${-size*0.55}
               Q ${-size*0.36} ${-size*0.55}, ${-size*0.36} ${-size*0.2}
               Q ${-size*0.36} ${size*0.05}, ${-size*0.05} ${size*0.32}
               Q ${size*0.22} ${size*0.55}, ${size*0.22} ${size*0.8}
               Q ${size*0.22} ${size*0.96}, ${size*0.04} ${size*0.96}
               Q ${-size*0.08} ${size*0.96}, ${-size*0.08} ${size*0.85}"/>
      <circle cx="${size*0.04}" cy="${size*0.85}" r="${size*0.05}" fill="${color}"/>
    </g>`,

  bassClef: (size = 140, color = '#1a0d14') => `
    <g fill="${color}">
      <path d="M ${-size*0.3} ${-size*0.4}
               Q ${-size*0.3} ${-size*0.55}, ${-size*0.1} ${-size*0.55}
               Q ${size*0.4} ${-size*0.55}, ${size*0.4} 0
               Q ${size*0.4} ${size*0.4}, ${-size*0.05} ${size*0.55}
               L ${-size*0.05} ${size*0.4}
               Q ${size*0.18} ${size*0.3}, ${size*0.18} 0
               Q ${size*0.18} ${-size*0.3}, ${-size*0.05} ${-size*0.3}
               Q ${-size*0.12} ${-size*0.3}, ${-size*0.12} ${-size*0.2}
               Q ${-size*0.12} ${-size*0.1}, ${-size*0.05} ${-size*0.1}
               Q ${-size*0.3} ${-size*0.25}, ${-size*0.3} ${-size*0.4} Z"/>
      <circle cx="${size*0.5}" cy="${-size*0.3}" r="${size*0.07}"/>
      <circle cx="${size*0.5}" cy="${-size*0.05}" r="${size*0.07}"/>
    </g>`,

  musicNote: (size = 60, color = '#1a0d14', flagged = true) => `
    <g fill="${color}">
      <ellipse cx="0" cy="0" rx="${size*0.35}" ry="${size*0.25}" transform="rotate(-22)"/>
      <rect x="${size*0.3}" y="${-size*2}" width="${size*0.06}" height="${size*2}"/>
      ${flagged ? `<path d="M${size*0.36} ${-size*2} Q ${size*0.85} ${-size*1.85}, ${size*0.85} ${-size*1.55} Q ${size*0.85} ${-size*1.3}, ${size*0.36} ${-size*1.4} Z"/>` : ''}
    </g>`,

  // Notas con barra (corcheas)
  beamedNotes: (size = 60, color = '#1a0d14') => `
    <g fill="${color}">
      <ellipse cx="${-size*0.6}" cy="0" rx="${size*0.32}" ry="${size*0.23}" transform="rotate(-22 ${-size*0.6} 0)"/>
      <rect x="${-size*0.32}" y="${-size*1.9}" width="${size*0.06}" height="${size*1.9}"/>
      <ellipse cx="${size*0.6}" cy="0" rx="${size*0.32}" ry="${size*0.23}" transform="rotate(-22 ${size*0.6} 0)"/>
      <rect x="${size*0.88}" y="${-size*1.9}" width="${size*0.06}" height="${size*1.9}"/>
      <rect x="${-size*0.32}" y="${-size*1.9}" width="${size*1.26}" height="${size*0.14}"/>
      <rect x="${-size*0.32}" y="${-size*1.65}" width="${size*1.26}" height="${size*0.1}"/>
    </g>`,

  // Vinilo
  vinylRecord: (size = 100, palette) => `
    <g>
      <circle r="${size}" fill="${palette.ink || '#1a0d14'}"/>
      <circle r="${size}" fill="none" stroke="${palette.bg[0]}" stroke-width="1" opacity="0.4"/>
      <circle r="${size*0.85}" fill="none" stroke="${palette.bg[0]}" stroke-width="0.6" opacity="0.3"/>
      <circle r="${size*0.7}" fill="none" stroke="${palette.bg[0]}" stroke-width="0.6" opacity="0.3"/>
      <circle r="${size*0.55}" fill="none" stroke="${palette.bg[0]}" stroke-width="0.6" opacity="0.3"/>
      <circle r="${size*0.35}" fill="${palette.accent}"/>
      <circle r="${size*0.08}" fill="${palette.bg[0]}"/>
      <!-- highlight -->
      <path d="M ${-size*0.7} ${-size*0.5} A ${size} ${size} 0 0 1 ${size*0.6} ${-size*0.6}" stroke="#fff" stroke-width="1" fill="none" opacity="0.3"/>
    </g>`,

  // Audífonos
  headphones: (size = 100, palette) => `
    <g>
      <path d="M ${-size*0.7} 0 Q ${-size*0.7} ${-size*0.8}, 0 ${-size*0.8} Q ${size*0.7} ${-size*0.8}, ${size*0.7} 0" stroke="${palette.accent}" stroke-width="${size*0.1}" fill="none" stroke-linecap="round"/>
      <rect x="${-size*0.82}" y="${-size*0.1}" width="${size*0.24}" height="${size*0.5}" rx="${size*0.06}" fill="${palette.ink}"/>
      <rect x="${size*0.58}" y="${-size*0.1}" width="${size*0.24}" height="${size*0.5}" rx="${size*0.06}" fill="${palette.ink}"/>
      <rect x="${-size*0.78}" y="${-size*0.04}" width="${size*0.16}" height="${size*0.36}" rx="${size*0.04}" fill="${palette.accent2}"/>
      <rect x="${size*0.62}" y="${-size*0.04}" width="${size*0.16}" height="${size*0.36}" rx="${size*0.04}" fill="${palette.accent2}"/>
    </g>`,

  // Micrófono
  microphone: (size = 100, palette) => `
    <g>
      <rect x="${-size*0.25}" y="${-size*0.7}" width="${size*0.5}" height="${size*0.8}" rx="${size*0.25}" fill="${palette.accent}"/>
      <rect x="${-size*0.18}" y="${-size*0.55}" width="${size*0.36}" height="${size*0.5}" rx="${size*0.04}" fill="${palette.ink}" opacity="0.6"/>
      <line x1="${-size*0.18}" y1="${-size*0.45}" x2="${size*0.18}" y2="${-size*0.45}" stroke="${palette.accent2}" stroke-width="1"/>
      <line x1="${-size*0.18}" y1="${-size*0.3}" x2="${size*0.18}" y2="${-size*0.3}" stroke="${palette.accent2}" stroke-width="1"/>
      <line x1="${-size*0.18}" y1="${-size*0.15}" x2="${size*0.18}" y2="${-size*0.15}" stroke="${palette.accent2}" stroke-width="1"/>
      <path d="M ${-size*0.42} ${-size*0.1} Q ${-size*0.42} ${size*0.35}, 0 ${size*0.35} Q ${size*0.42} ${size*0.35}, ${size*0.42} ${-size*0.1}" stroke="${palette.ink}" stroke-width="${size*0.06}" fill="none"/>
      <rect x="${-size*0.04}" y="${size*0.35}" width="${size*0.08}" height="${size*0.25}" fill="${palette.ink}"/>
      <rect x="${-size*0.18}" y="${size*0.6}" width="${size*0.36}" height="${size*0.07}" rx="${size*0.02}" fill="${palette.ink}"/>
    </g>`,

  staff: (palette, notes = [], y0 = 380) => {
    const lines = [y0, y0 + 50, y0 + 100, y0 + 150, y0 + 200];
    let s = '';
    lines.forEach(y => {
      s += `<line x1="100" y1="${y}" x2="1500" y2="${y}" stroke="${palette.ink}" stroke-width="2" opacity="0.75"/>`;
    });
    notes.forEach(n => {
      s += `<g><ellipse cx="${n.x}" cy="${n.y}" rx="22" ry="16" transform="rotate(-18 ${n.x} ${n.y})" fill="${palette.ink}"/>
        <rect x="${n.x+19}" y="${n.y-140}" width="3.5" height="140" fill="${palette.ink}"/>
        ${n.flag ? `<path d="M${n.x+22.5} ${n.y-140} Q ${n.x+50} ${n.y-128}, ${n.x+50} ${n.y-104} Q ${n.x+50} ${n.y-84}, ${n.x+22.5} ${n.y-94} Z" fill="${palette.ink}"/>` : ''}
      </g>`;
    });
    return s;
  },

  pianoKeyboard: (width = 1000, palette) => {
    const h = width * 0.22;
    const w = width / 14;
    let keys = '';
    for (let i = 1; i < 14; i++) keys += `<line x1="${i*w}" y1="0" x2="${i*w}" y2="${h}" stroke="${palette.bg[0]}" stroke-width="2.4"/>`;
    for (let i = 0; i < 14; i++) {
      const mod = i % 7;
      if (mod === 1 || mod === 2 || mod === 4 || mod === 5 || mod === 6) {
        const x = i * w - w * 0.18;
        keys += `<rect x="${x.toFixed(1)}" y="0" width="${(w*0.36).toFixed(1)}" height="${(h*0.6).toFixed(1)}" fill="${palette.bg[0]}" rx="3"/>`;
      }
    }
    return `<g>
      <rect x="0" y="0" width="${width}" height="${h}" fill="${palette.ink}"/>
      ${keys}
      <rect x="0" y="${h}" width="${width}" height="6" fill="${palette.bg[0]}" opacity="0.6"/>
    </g>`;
  },

  /* =====================================================
     ████████  SOCIALES  ████████
     ===================================================== */

  // Planeta Tierra estilizado con continentes reconocibles
  // (América, África, Eurasia, Oceanía, Antártida) — vista clásica de globo.
  globe: (radius = 180, palette) => {
    const uo = _uid('gl-o'); const ul = _uid('gl-l'); const us = _uid('gl-s'); const ua = _uid('gl-a');
    // Colores: océano azul + continentes verdes (independientes de la paleta para mantener identidad terrestre)
    const ocean1 = '#1e6db8';
    const ocean2 = '#0e3a78';
    const land1 = '#3a9a4a';
    const land2 = '#1c5a2c';
    const r = radius;
    return `<g>
      <defs>
        <radialGradient id="${uo}" cx="35%" cy="28%" r="78%">
          <stop offset="0%" stop-color="#6cb8ff"/>
          <stop offset="55%" stop-color="${ocean1}"/>
          <stop offset="100%" stop-color="${ocean2}"/>
        </radialGradient>
        <linearGradient id="${ul}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${land1}"/>
          <stop offset="100%" stop-color="${land2}"/>
        </linearGradient>
        <radialGradient id="${us}" cx="30%" cy="20%" r="45%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${ua}" cx="50%" cy="50%" r="52%">
          <stop offset="92%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
        </radialGradient>
        <clipPath id="${uo}-clip"><circle r="${r}"/></clipPath>
      </defs>
      <!-- halo atmosférico exterior -->
      <circle r="${r*1.04}" fill="#7ac8ff" opacity="0.2" filter="url(#ds-glow-sm)"/>
      <!-- océano -->
      <circle r="${r}" fill="url(#${uo})"/>
      <!-- continentes (clip al círculo) -->
      <g clip-path="url(#${uo}-clip)" fill="url(#${ul})">
        <!-- AMÉRICA DEL NORTE: bloque ancho arriba-izquierda con península de Florida y Centroamérica -->
        <path d="M ${-r*0.85} ${-r*0.55}
                 C ${-r*0.65} ${-r*0.68}, ${-r*0.35} ${-r*0.62}, ${-r*0.22} ${-r*0.48}
                 L ${-r*0.18} ${-r*0.3}
                 L ${-r*0.32} ${-r*0.18}
                 L ${-r*0.4} ${-r*0.05}
                 L ${-r*0.5} ${-r*0.02}
                 L ${-r*0.55} ${r*0.05}
                 L ${-r*0.46} ${r*0.12}
                 L ${-r*0.6} ${r*0.08}
                 L ${-r*0.78} ${-r*0.05}
                 L ${-r*0.88} ${-r*0.18}
                 L ${-r*0.92} ${-r*0.35}
                 L ${-r*0.85} ${-r*0.55} Z"/>
        <!-- AMÉRICA DEL SUR: cono inclinado abajo-izquierda -->
        <path d="M ${-r*0.5} ${r*0.05}
                 L ${-r*0.36} ${r*0.18}
                 L ${-r*0.3} ${r*0.38}
                 L ${-r*0.36} ${r*0.58}
                 L ${-r*0.48} ${r*0.7}
                 L ${-r*0.5} ${r*0.55}
                 L ${-r*0.58} ${r*0.45}
                 L ${-r*0.55} ${r*0.25}
                 L ${-r*0.5} ${r*0.05} Z"/>
        <!-- GROENLANDIA -->
        <ellipse cx="${-r*0.18}" cy="${-r*0.62}" rx="${r*0.1}" ry="${r*0.08}" transform="rotate(-15 ${-r*0.18} ${-r*0.62})"/>
        <!-- ÁFRICA: silueta característica que se estrecha hacia el sur -->
        <path d="M ${r*0.02} ${-r*0.32}
                 L ${r*0.22} ${-r*0.32}
                 L ${r*0.3} ${-r*0.18}
                 L ${r*0.32} ${r*0.0}
                 L ${r*0.28} ${r*0.2}
                 L ${r*0.18} ${r*0.42}
                 L ${r*0.08} ${r*0.52}
                 L ${r*0.0} ${r*0.42}
                 L ${-r*0.05} ${r*0.22}
                 L ${-r*0.08} ${r*0.0}
                 L ${-r*0.05} ${-r*0.15}
                 L ${r*0.02} ${-r*0.32} Z"/>
        <!-- EUROPA + ASIA: gran masa al norte/este -->
        <path d="M ${-r*0.05} ${-r*0.62}
                 L ${r*0.15} ${-r*0.7}
                 L ${r*0.45} ${-r*0.68}
                 L ${r*0.7} ${-r*0.55}
                 L ${r*0.88} ${-r*0.35}
                 L ${r*0.85} ${-r*0.15}
                 L ${r*0.7} ${-r*0.1}
                 L ${r*0.6} ${-r*0.22}
                 L ${r*0.5} ${-r*0.15}
                 L ${r*0.45} ${-r*0.22}
                 L ${r*0.35} ${-r*0.3}
                 L ${r*0.25} ${-r*0.32}
                 L ${r*0.05} ${-r*0.35}
                 L ${-r*0.02} ${-r*0.4}
                 L ${-r*0.05} ${-r*0.55}
                 L ${-r*0.05} ${-r*0.62} Z"/>
        <!-- INDIA (península) -->
        <path d="M ${r*0.45} ${-r*0.1} L ${r*0.55} ${-r*0.05} L ${r*0.52} ${r*0.05} L ${r*0.48} ${r*0.02} L ${r*0.45} ${-r*0.1} Z"/>
        <!-- ARABIA -->
        <path d="M ${r*0.3} ${-r*0.22} L ${r*0.4} ${-r*0.18} L ${r*0.42} ${-r*0.05} L ${r*0.35} ${-r*0.05} L ${r*0.32} ${-r*0.15} L ${r*0.3} ${-r*0.22} Z"/>
        <!-- AUSTRALIA -->
        <ellipse cx="${r*0.72}" cy="${r*0.3}" rx="${r*0.16}" ry="${r*0.1}" transform="rotate(-8 ${r*0.72} ${r*0.3})"/>
        <!-- ISLANDIA + ISLAS UK pequeñas -->
        <ellipse cx="${r*0.02}" cy="${-r*0.58}" rx="${r*0.035}" ry="${r*0.022}"/>
        <ellipse cx="${r*0.12}" cy="${-r*0.5}" rx="${r*0.025}" ry="${r*0.04}"/>
        <!-- MADAGASCAR -->
        <ellipse cx="${r*0.3}" cy="${r*0.32}" rx="${r*0.025}" ry="${r*0.06}" transform="rotate(-15 ${r*0.3} ${r*0.32})"/>
        <!-- JAPÓN -->
        <ellipse cx="${r*0.78}" cy="${-r*0.32}" rx="${r*0.025}" ry="${r*0.05}" transform="rotate(25 ${r*0.78} ${-r*0.32})"/>
        <!-- INDONESIA (cadena de islas pequeñas) -->
        <ellipse cx="${r*0.62}" cy="${r*0.12}" rx="${r*0.06}" ry="${r*0.02}"/>
        <ellipse cx="${r*0.72}" cy="${r*0.14}" rx="${r*0.04}" ry="${r*0.018}"/>
        <!-- ANTÁRTIDA al sur (banda blanco/verde claro) -->
        <path d="M ${-r*0.95} ${r*0.78} L ${-r*0.4} ${r*0.85} L ${r*0.0} ${r*0.92} L ${r*0.4} ${r*0.85} L ${r*0.85} ${r*0.78} L ${r*0.85} ${r}  L ${-r*0.95} ${r} Z" fill="#d4e8f0"/>
      </g>
      <!-- nubes blancas suaves -->
      <g clip-path="url(#${uo}-clip)" fill="#ffffff" opacity="0.32">
        <ellipse cx="${-r*0.3}" cy="${-r*0.15}" rx="${r*0.25}" ry="${r*0.04}" transform="rotate(-12 ${-r*0.3} ${-r*0.15})"/>
        <ellipse cx="${r*0.45}" cy="${r*0.15}" rx="${r*0.2}" ry="${r*0.035}" transform="rotate(8 ${r*0.45} ${r*0.15})"/>
        <ellipse cx="${r*0.6}" cy="${-r*0.45}" rx="${r*0.18}" ry="${r*0.03}" transform="rotate(-15 ${r*0.6} ${-r*0.45})"/>
        <ellipse cx="${-r*0.55}" cy="${r*0.5}" rx="${r*0.16}" ry="${r*0.025}"/>
      </g>
      <!-- meridiano y ecuador sutiles -->
      <g fill="none" stroke="#0a3060" stroke-width="${r*0.005}" opacity="0.35">
        <ellipse rx="${r}" ry="${r*0.18}"/>
        <ellipse rx="${r*0.35}" ry="${r}"/>
      </g>
      <!-- sombra de profundidad en el borde -->
      <circle r="${r}" fill="url(#${ua})"/>
      <!-- specular highlight -->
      <ellipse cx="${-r*0.28}" cy="${-r*0.38}" rx="${r*0.25}" ry="${r*0.15}" fill="url(#${us})" transform="rotate(-22 ${-r*0.28} ${-r*0.38})"/>
      <ellipse cx="${-r*0.36}" cy="${-r*0.5}" rx="${r*0.08}" ry="${r*0.04}" fill="#ffffff" opacity="0.7"/>
      <!-- contorno del planeta -->
      <circle r="${r}" fill="none" stroke="#0a2050" stroke-width="${r*0.012}" opacity="0.4"/>
    </g>`;
  },

  // Rosa de los vientos
  compassRose: (size = 100, palette) => `
    <g>
      <circle r="${size}" fill="none" stroke="${palette.ink}" stroke-width="2" opacity="0.7"/>
      <circle r="${size*0.7}" fill="none" stroke="${palette.ink}" stroke-width="1" opacity="0.4"/>
      <polygon points="0,${-size} ${size*0.12},0 0,${size} ${-size*0.12},0" fill="${palette.accent}"/>
      <polygon points="${size},0 0,${-size*0.12} ${-size},0 0,${size*0.12}" fill="${palette.accent2}" opacity="0.85"/>
      <polygon points="0,${-size} ${size*0.12},0 -${size*0.12},0" fill="${palette.accent}" opacity="0.85"/>
      <polygon points="${size},0 0,${size*0.12} 0,${-size*0.12}" fill="${palette.accent}" opacity="0.7"/>
      <circle r="${size*0.08}" fill="${palette.ink}"/>
      <!-- compass marks -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 16; i++) {
          const a = (i * 22.5) * Math.PI / 180;
          const x1 = Math.cos(a) * size * 0.85, y1 = Math.sin(a) * size * 0.85;
          const x2 = Math.cos(a) * size, y2 = Math.sin(a) * size;
          s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${palette.ink}" stroke-width="1.2" opacity="0.5"/>`;
        }
        return s;
      })()}
    </g>`,

  // Pirámide
  pyramid: (size = 120, palette) => `
    <g>
      <polygon points="0,${-size} ${size*0.85},${size*0.4} ${-size*0.85},${size*0.4}" fill="${palette.accent}"/>
      <polygon points="0,${-size} 0,${size*0.4} ${-size*0.85},${size*0.4}" fill="${palette.ink}" opacity="0.4"/>
      <line x1="0" y1="${-size}" x2="0" y2="${size*0.4}" stroke="${palette.ink}" stroke-width="1" opacity="0.4"/>
      <ellipse cx="0" cy="${size*0.45}" rx="${size*0.85}" ry="${size*0.05}" fill="${palette.bg[0]}" opacity="0.3"/>
    </g>`,

  // Monumento / coliseo
  monument: (size = 140, palette) => `
    <g>
      <rect x="${-size*0.55}" y="${size*0.3}" width="${size*1.1}" height="${size*0.1}" rx="${size*0.02}" fill="${palette.ink}" opacity="0.85"/>
      ${(() => {
        let s = '';
        for (let i = 0; i < 6; i++) {
          const x = -size*0.45 + i * size*0.18;
          s += `<rect x="${x}" y="${-size*0.5}" width="${size*0.08}" height="${size*0.8}" fill="${palette.accent}"/>`;
        }
        return s;
      })()}
      <rect x="${-size*0.6}" y="${-size*0.5}" width="${size*1.2}" height="${size*0.08}" fill="${palette.accent}"/>
      <polygon points="${-size*0.6},${-size*0.5} ${size*0.6},${-size*0.5} ${size*0.55},${-size*0.62} ${-size*0.55},${-size*0.62}" fill="${palette.accent2}"/>
      <polygon points="${-size*0.55},${-size*0.62} ${size*0.55},${-size*0.62} 0,${-size*0.85}" fill="${palette.accent}"/>
    </g>`,

  /* =====================================================
     ████████  ECO-POLÍTICA  ████████
     ===================================================== */

  balanceScale: (size = 160, palette) => `
    <g>
      <rect x="${-size*0.025}" y="${-size}" width="${size*0.05}" height="${size*1.5}" fill="${palette.ink}"/>
      <circle cx="0" cy="${-size}" r="${size*0.06}" fill="${palette.accent}"/>
      <rect x="${-size*0.7}" y="${-size*0.82}" width="${size*1.4}" height="${size*0.04}" rx="${size*0.02}" fill="${palette.ink}"/>
      <line x1="${-size*0.55}" y1="${-size*0.8}" x2="${-size*0.55}" y2="${-size*0.45}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${size*0.55}" y1="${-size*0.8}" x2="${size*0.55}" y2="${-size*0.45}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${-size*0.7}" y1="${-size*0.4}" x2="${-size*0.4}" y2="${-size*0.4}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${size*0.4}" y1="${-size*0.4}" x2="${size*0.7}" y2="${-size*0.4}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${-size*0.7}" y1="${-size*0.4}" x2="${-size*0.55}" y2="${-size*0.45}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${-size*0.4}" y1="${-size*0.4}" x2="${-size*0.55}" y2="${-size*0.45}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${size*0.7}" y1="${-size*0.4}" x2="${size*0.55}" y2="${-size*0.45}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <line x1="${size*0.4}" y1="${-size*0.4}" x2="${size*0.55}" y2="${-size*0.45}" stroke="${palette.ink}" stroke-width="${size*0.012}"/>
      <path d="M ${-size*0.78} ${-size*0.4} Q ${-size*0.55} ${-size*0.25}, ${-size*0.32} ${-size*0.4} Z" fill="${palette.accent}"/>
      <path d="M ${size*0.32} ${-size*0.4} Q ${size*0.55} ${-size*0.25}, ${size*0.78} ${-size*0.4} Z" fill="${palette.accent}"/>
      <path d="M ${-size*0.35} ${size*0.5} L ${size*0.35} ${size*0.5} L ${size*0.25} ${size*0.4} L ${-size*0.25} ${size*0.4} Z" fill="${palette.ink}"/>
    </g>`,

  // Pila de monedas
  coinStack: (size = 60, palette) => `
    <g>
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const y = -i * size*0.18;
          s += `<ellipse cx="0" cy="${y + size*0.06}" rx="${size}" ry="${size*0.18}" fill="${palette.bg[0]}" opacity="0.3"/>`;
          s += `<rect x="${-size}" y="${y}" width="${size*2}" height="${size*0.16}" fill="${palette.accent}"/>`;
          s += `<ellipse cx="0" cy="${y}" rx="${size}" ry="${size*0.16}" fill="${palette.accent2}"/>`;
          s += `<ellipse cx="0" cy="${y}" rx="${size*0.6}" ry="${size*0.1}" fill="none" stroke="${palette.accent}" stroke-width="1.5"/>`;
        }
        return s;
      })()}
    </g>`,

  // Maletín
  briefcase: (size = 100, palette) => `
    <g>
      <rect x="${-size*0.3}" y="${-size*0.7}" width="${size*0.6}" height="${size*0.18}" rx="${size*0.04}" fill="none" stroke="${palette.ink}" stroke-width="${size*0.04}"/>
      <rect x="${-size*0.7}" y="${-size*0.55}" width="${size*1.4}" height="${size}" rx="${size*0.04}" fill="${palette.accent}"/>
      <line x1="${-size*0.7}" y1="${-size*0.1}" x2="${size*0.7}" y2="${-size*0.1}" stroke="${palette.ink}" stroke-width="${size*0.02}" opacity="0.4"/>
      <rect x="${-size*0.1}" y="${-size*0.18}" width="${size*0.2}" height="${size*0.12}" rx="${size*0.02}" fill="${palette.ink}" opacity="0.6"/>
    </g>`,

  // Gráfico de crecimiento
  growthChart: (palette, w = 320, h = 220) => `
    <g>
      <line x1="${-w/2}" y1="${h/2}" x2="${w/2}" y2="${h/2}" stroke="${palette.ink}" stroke-width="2"/>
      <line x1="${-w/2}" y1="${-h/2}" x2="${-w/2}" y2="${h/2}" stroke="${palette.ink}" stroke-width="2"/>
      ${(() => {
        const heights = [0.25, 0.4, 0.32, 0.55, 0.7, 0.85];
        let s = '';
        for (let i = 0; i < heights.length; i++) {
          const bw = w / (heights.length * 1.5);
          const x = -w/2 + bw * 0.5 + i * bw * 1.4;
          const bh = h * heights[i];
          s += `<rect x="${x.toFixed(1)}" y="${(h/2 - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${palette.accent}" opacity="${(0.5 + i * 0.08).toFixed(2)}" rx="2"/>`;
        }
        return s;
      })()}
      <path d="M ${-w/2} ${h*0.3} L ${-w*0.27} ${h*0.15} L ${-w*0.1} ${h*0.2} L ${w*0.08} ${-h*0.05} L ${w*0.25} ${-h*0.18} L ${w*0.42} ${-h*0.35}"
            stroke="${palette.accent2}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="${w*0.42},${-h*0.35} ${w*0.36},${-h*0.27} ${w*0.32},${-h*0.32} ${w*0.36},${-h*0.36} ${w*0.32},${-h*0.4} ${w*0.36},${-h*0.43}" fill="${palette.accent2}"/>
    </g>`,

  // Gráfico de torta
  pieChart: (size = 100, palette) => `
    <g>
      <circle r="${size}" fill="${palette.accent2}"/>
      <path d="M 0 0 L 0 ${-size} A ${size} ${size} 0 0 1 ${size} 0 Z" fill="${palette.accent}"/>
      <path d="M 0 0 L ${size} 0 A ${size} ${size} 0 0 1 ${size*0.3} ${size*0.95} Z" fill="${palette.ink}" opacity="0.85"/>
      <circle r="${size}" fill="none" stroke="${palette.ink}" stroke-width="2"/>
    </g>`,

  // Edificio gubernamental
  governmentBuilding: (size = 140, palette) => `
    <g>
      <rect x="${-size*0.55}" y="${size*0.4}" width="${size*1.1}" height="${size*0.1}" fill="${palette.ink}"/>
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const x = -size*0.45 + i * size*0.22;
          s += `<rect x="${x}" y="${-size*0.4}" width="${size*0.1}" height="${size*0.8}" fill="${palette.accent}"/>`;
        }
        return s;
      })()}
      <rect x="${-size*0.6}" y="${-size*0.45}" width="${size*1.2}" height="${size*0.1}" fill="${palette.accent}"/>
      <polygon points="${-size*0.6},${-size*0.45} ${size*0.6},${-size*0.45} ${size*0.55},${-size*0.6} ${-size*0.55},${-size*0.6}" fill="${palette.accent2}"/>
      <polygon points="${-size*0.55},${-size*0.6} ${size*0.55},${-size*0.6} 0,${-size*0.85}" fill="${palette.accent}"/>
      <circle cx="0" cy="${-size*0.72}" r="${size*0.04}" fill="${palette.accent2}"/>
    </g>`,

  /* =====================================================
     ████████  FILOSOFÍA  ████████
     ===================================================== */

  column: (height = 280, palette) => `
    <g>
      <rect x="-32" y="0" width="64" height="${height}" fill="${palette.bg[0]}" opacity="0.85"/>
      <rect x="-44" y="-12" width="88" height="14" fill="${palette.bg[0]}" opacity="0.95"/>
      <rect x="-44" y="${height-2}" width="88" height="14" fill="${palette.bg[0]}" opacity="0.95"/>
      ${(() => {
        let s = '';
        for (let i = -3; i <= 3; i++) {
          s += `<line x1="${i*9}" y1="6" x2="${i*9}" y2="${height-4}" stroke="${palette.mute}" stroke-width="1.2" opacity="0.55"/>`;
        }
        return s;
      })()}
      <rect x="-48" y="-22" width="96" height="10" fill="${palette.ink}" opacity="0.35"/>
    </g>`,

  owl: (size = 100, palette) => `
    <g>
      <ellipse cx="0" cy="${size*0.2}" rx="${size}" ry="${size*1.2}" fill="${palette.bg[1]}"/>
      <path d="M${-size} ${-size*0.6} C ${-size*0.9} ${-size}, ${-size*0.6} ${-size*1.1}, ${-size*0.5} ${-size*0.8} L ${-size*0.4} ${-size*0.5} Z" fill="${palette.bg[1]}"/>
      <path d="M${size} ${-size*0.6} C ${size*0.9} ${-size}, ${size*0.6} ${-size*1.1}, ${size*0.5} ${-size*0.8} L ${size*0.4} ${-size*0.5} Z" fill="${palette.bg[1]}"/>
      <ellipse cx="${-size*0.32}" cy="${-size*0.2}" rx="${size*0.28}" ry="${size*0.3}" fill="${palette.bg[0]}" opacity="0.6"/>
      <ellipse cx="${size*0.32}" cy="${-size*0.2}" rx="${size*0.28}" ry="${size*0.3}" fill="${palette.bg[0]}" opacity="0.6"/>
      <circle cx="${-size*0.32}" cy="${-size*0.2}" r="${size*0.26}" fill="${palette.accent2}"/>
      <circle cx="${size*0.32}" cy="${-size*0.2}" r="${size*0.26}" fill="${palette.accent2}"/>
      <circle cx="${-size*0.32}" cy="${-size*0.2}" r="${size*0.13}" fill="${palette.bg[0]}"/>
      <circle cx="${size*0.32}" cy="${-size*0.2}" r="${size*0.13}" fill="${palette.bg[0]}"/>
      <circle cx="${-size*0.3}" cy="${-size*0.22}" r="${size*0.03}" fill="#fff"/>
      <circle cx="${size*0.34}" cy="${-size*0.22}" r="${size*0.03}" fill="#fff"/>
      <path d="M${-size*0.08} ${size*0.12} L 0 ${size*0.3} L ${size*0.08} ${size*0.12} Z" fill="${palette.accent}"/>
      <path d="M${-size*0.8} ${size*0.6} Q ${-size*0.5} ${size*0.8}, ${-size*0.2} ${size*0.7}" stroke="${palette.bg[0]}" stroke-width="${size*0.03}" fill="none"/>
      <path d="M${size*0.2} ${size*0.7} Q ${size*0.5} ${size*0.8}, ${size*0.8} ${size*0.6}" stroke="${palette.bg[0]}" stroke-width="${size*0.03}" fill="none"/>
    </g>`,

  // Reloj de arena
  hourglass: (size = 100, palette) => `
    <g>
      <rect x="${-size*0.55}" y="${-size}" width="${size*1.1}" height="${size*0.08}" rx="${size*0.02}" fill="${palette.ink}"/>
      <rect x="${-size*0.55}" y="${size*0.92}" width="${size*1.1}" height="${size*0.08}" rx="${size*0.02}" fill="${palette.ink}"/>
      <path d="M ${-size*0.5} ${-size*0.92}
               L ${size*0.5} ${-size*0.92}
               L ${size*0.1} 0
               L ${size*0.5} ${size*0.92}
               L ${-size*0.5} ${size*0.92}
               L ${-size*0.1} 0 Z"
            fill="${palette.accent2}" opacity="0.4" stroke="${palette.ink}" stroke-width="2.2"/>
      <path d="M ${-size*0.42} ${-size*0.85} L ${size*0.42} ${-size*0.85} L ${size*0.08} ${-size*0.05} L ${-size*0.08} ${-size*0.05} Z" fill="${palette.accent}"/>
      <path d="M ${-size*0.04} 0 L ${size*0.04} 0 L ${size*0.04} ${size*0.3} L ${-size*0.04} ${size*0.3} Z" fill="${palette.accent}"/>
      <path d="M ${-size*0.3} ${size*0.85} L ${size*0.3} ${size*0.85} L ${size*0.18} ${size*0.5} L ${-size*0.18} ${size*0.5} Z" fill="${palette.accent}"/>
    </g>`,

  // Vela
  candle: (size = 100, palette) => `
    <g>
      <ellipse cx="0" cy="${size*0.95}" rx="${size*0.3}" ry="${size*0.05}" fill="${palette.bg[0]}" opacity="0.3"/>
      <rect x="${-size*0.2}" y="${-size*0.4}" width="${size*0.4}" height="${size*1.3}" fill="${palette.accent2 || '#f5e8d0'}"/>
      <ellipse cx="0" cy="${-size*0.4}" rx="${size*0.2}" ry="${size*0.05}" fill="${palette.accent}"/>
      <rect x="${-size*0.01}" y="${-size*0.55}" width="${size*0.02}" height="${size*0.15}" fill="${palette.ink}"/>
      <!-- flame -->
      <path d="M 0 ${-size*0.55} Q ${-size*0.12} ${-size*0.7}, ${-size*0.08} ${-size*0.85} Q 0 ${-size*1.05}, ${size*0.08} ${-size*0.85} Q ${size*0.12} ${-size*0.7}, 0 ${-size*0.55} Z" fill="#f5a838"/>
      <path d="M 0 ${-size*0.6} Q ${-size*0.06} ${-size*0.72}, ${-size*0.04} ${-size*0.85} Q 0 ${-size*0.98}, ${size*0.04} ${-size*0.85} Q ${size*0.06} ${-size*0.72}, 0 ${-size*0.6} Z" fill="#f5e8a8"/>
    </g>`,

  // Cerebro (estilizado)
  brain: (size = 100, palette) => `
    <g fill="${palette.accent2 || '#f5c0c0'}" stroke="${palette.ink}" stroke-width="2">
      <path d="M 0 ${-size*0.8}
               Q ${-size*0.3} ${-size*0.8}, ${-size*0.5} ${-size*0.55}
               Q ${-size*0.8} ${-size*0.45}, ${-size*0.85} ${-size*0.15}
               Q ${-size*0.95} ${size*0.15}, ${-size*0.7} ${size*0.4}
               Q ${-size*0.6} ${size*0.7}, ${-size*0.3} ${size*0.7}
               Q 0 ${size*0.85}, ${size*0.3} ${size*0.7}
               Q ${size*0.6} ${size*0.7}, ${size*0.7} ${size*0.4}
               Q ${size*0.95} ${size*0.15}, ${size*0.85} ${-size*0.15}
               Q ${size*0.8} ${-size*0.45}, ${size*0.5} ${-size*0.55}
               Q ${size*0.3} ${-size*0.8}, 0 ${-size*0.8} Z"/>
      <path d="M 0 ${-size*0.6} L 0 ${size*0.7}" stroke="${palette.ink}" stroke-width="2" fill="none"/>
      <path d="M ${-size*0.4} ${-size*0.3} Q ${-size*0.2} ${-size*0.2}, ${-size*0.3} 0 Q ${-size*0.45} ${size*0.2}, ${-size*0.2} ${size*0.35}" stroke="${palette.ink}" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M ${size*0.4} ${-size*0.3} Q ${size*0.2} ${-size*0.2}, ${size*0.3} 0 Q ${size*0.45} ${size*0.2}, ${size*0.2} ${size*0.35}" stroke="${palette.ink}" stroke-width="1.5" fill="none" opacity="0.6"/>
    </g>`,

  /* =====================================================
     ████████  RELIGIÓN  ████████
     ===================================================== */

  dove: (size = 100, fill = '#fff8e8') => `
    <g fill="${fill}">
      <ellipse cx="0" cy="0" rx="${size*0.8}" ry="${size*0.34}" transform="rotate(-10)"/>
      <ellipse cx="${-size*0.58}" cy="${-size*0.22}" rx="${size*0.28}" ry="${size*0.24}" transform="rotate(-25)"/>
      <path d="M${-size*0.72} ${-size*0.38} L ${-size*0.95} ${-size*0.45} L ${-size*0.78} ${-size*0.28} Z"/>
      <circle cx="${-size*0.76}" cy="${-size*0.34}" r="${size*0.025}" fill="#3a2a14"/>
      <path d="M${size*0.35} ${-size*0.18} C ${size*0.7} ${-size*0.5}, ${size*1.3} ${-size*0.4}, ${size*1.5} ${-size*0.12}
               C ${size*1.2} ${size*0.06}, ${size*0.7} ${-size*0.02}, ${size*0.35} ${size*0.08} Z" opacity="0.88"/>
      <path d="M${size*0.35} ${-size*0.05} C ${size*0.65} ${-size*0.32}, ${size*1.1} ${-size*0.25}, ${size*1.25} ${-size*0.05}
               C ${size*1.05} ${size*0.1}, ${size*0.65} ${size*0.05}, ${size*0.35} ${size*0.14} Z" opacity="0.78"/>
      <path d="M${-size*0.18} ${size*0.18} L ${-size*0.08} ${size*0.65} L ${size*0.3} ${size*0.3} Z" opacity="0.85"/>
    </g>`,

  raven: (size = 120) => `
    <g fill="#070708">
      <ellipse cx="0" cy="0" rx="${size}" ry="${size*0.45}" transform="rotate(-12)"/>
      <ellipse cx="${-size*0.7}" cy="${-size*0.3}" rx="${size*0.42}" ry="${size*0.3}" transform="rotate(-25)"/>
      <path d="M${-size*0.85} ${-size*0.45} L ${-size*1.15} ${-size*0.55} L ${-size*0.95} ${-size*0.35} Z"/>
      <path d="M${size*0.2} ${-size*0.06} C ${size*0.75} ${-size*0.42}, ${size*1.35} ${-size*0.35}, ${size*1.65} ${-size*0.06}
               C ${size*1.3} ${size*0.12}, ${size*0.75} ${size*0.02}, ${size*0.2} ${size*0.12} Z"/>
      <path d="M${size*0.18} ${size*0.1} C ${size*0.7} ${size*0.02}, ${size*1.3} ${size*0.18}, ${size*1.5} ${size*0.4}
               C ${size*1.2} ${size*0.5}, ${size*0.7} ${size*0.42}, ${size*0.18} ${size*0.26} Z" opacity="0.85"/>
      <path d="M${-size*0.35} ${-size*0.18} C ${-size*0.18} ${-size*0.42}, ${size*0.15} ${-size*0.45}, ${size*0.3} ${-size*0.22} Z"/>
    </g>`,

  // Manos en oración
  prayingHands: (size = 100, palette) => `
    <g fill="${palette.bg[2] || '#d4a868'}" stroke="${palette.ink}" stroke-width="${size*0.025}">
      <path d="M ${-size*0.05} ${-size*0.85}
               Q ${-size*0.5} ${-size*0.6}, ${-size*0.45} ${-size*0.2}
               L ${-size*0.4} ${size*0.4}
               Q ${-size*0.3} ${size*0.7}, ${-size*0.05} ${size*0.7}
               L ${-size*0.05} ${-size*0.85} Z"/>
      <path d="M ${size*0.05} ${-size*0.85}
               Q ${size*0.5} ${-size*0.6}, ${size*0.45} ${-size*0.2}
               L ${size*0.4} ${size*0.4}
               Q ${size*0.3} ${size*0.7}, ${size*0.05} ${size*0.7}
               L ${size*0.05} ${-size*0.85} Z"/>
    </g>`,

  // Iglesia silueta
  church: (size = 130, palette) => `
    <g>
      <rect x="${-size*0.5}" y="${-size*0.1}" width="${size}" height="${size*0.7}" fill="${palette.accent}"/>
      <polygon points="${-size*0.5},${-size*0.1} ${size*0.5},${-size*0.1} 0,${-size*0.5}" fill="${palette.accent}"/>
      <rect x="${-size*0.08}" y="${-size*0.85}" width="${size*0.16}" height="${size*0.4}" fill="${palette.accent}"/>
      <polygon points="${-size*0.08},${-size*0.85} ${size*0.08},${-size*0.85} 0,${-size}" fill="${palette.accent}"/>
      <!-- cross on top (no religious symbol concern - it's an architectural element) -->
      <rect x="${-size*0.02}" y="${-size*1.1}" width="${size*0.04}" height="${size*0.12}" fill="${palette.accent}"/>
      <rect x="${-size*0.06}" y="${-size*1.06}" width="${size*0.12}" height="${size*0.04}" fill="${palette.accent}"/>
      <rect x="${-size*0.1}" y="${size*0.3}" width="${size*0.2}" height="${size*0.3}" fill="${palette.ink}"/>
      <ellipse cx="0" cy="${size*0.3}" rx="${size*0.1}" ry="${size*0.1}" fill="${palette.ink}"/>
      <rect x="${-size*0.35}" y="${size*0.05}" width="${size*0.12}" height="${size*0.18}" rx="${size*0.06}" fill="${palette.bg[0]}" opacity="0.7"/>
      <rect x="${size*0.23}" y="${size*0.05}" width="${size*0.12}" height="${size*0.18}" rx="${size*0.06}" fill="${palette.bg[0]}" opacity="0.7"/>
    </g>`,

  // Cruz
  cross: (size = 80, color = '#fff') => `
    <g fill="${color}">
      <rect x="${-size*0.1}" y="${-size*0.7}" width="${size*0.2}" height="${size*1.4}" rx="${size*0.02}"/>
      <rect x="${-size*0.5}" y="${-size*0.25}" width="${size}" height="${size*0.2}" rx="${size*0.02}"/>
    </g>`,

  /* =====================================================
     ████████  EDU-FÍSICA  ████████
     ===================================================== */

  // Balón de fútbol con gradiente esférico y brillos
  soccerBall: (radius = 90) => {
    const ug = _uid('sb-g');
    return `<g>
      <defs>
        <radialGradient id="${ug}" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="55%" stop-color="#f0ebde"/>
          <stop offset="100%" stop-color="#8a8478"/>
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="${radius*1.03}" rx="${radius*0.85}" ry="${radius*0.09}" fill="#000" opacity="0.32"/>
      <circle r="${radius}" fill="url(#${ug})"/>
      <circle r="${radius}" fill="none" stroke="#0a0a0a" stroke-width="${radius*0.022}"/>
      <!-- pentágono central -->
      ${(() => {
        let pts = '';
        for (let i = 0; i < 5; i++) {
          const a = (i * 72 - 90) * Math.PI / 180;
          pts += `${(Math.cos(a) * radius*0.28).toFixed(2)},${(Math.sin(a) * radius*0.28).toFixed(2)} `;
        }
        return `<polygon points="${pts}" fill="#1a1a1a"/>` +
               `<polygon points="${pts}" fill="none" stroke="#000" stroke-width="${radius*0.012}"/>`;
      })()}
      <!-- líneas conectoras desde el pentágono central a los exteriores -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const a = (i * 72 - 90 + 36) * Math.PI / 180;
          const x1 = Math.cos(a) * radius*0.28;
          const y1 = Math.sin(a) * radius*0.28;
          const x2 = Math.cos(a) * radius*0.62;
          const y2 = Math.sin(a) * radius*0.62;
          s += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#1a1a1a" stroke-width="${radius*0.022}"/>`;
        }
        return s;
      })()}
      <!-- pentágonos exteriores (parciales hacia el borde) -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const a = (i * 72 - 54) * Math.PI / 180;
          const cx = Math.cos(a) * radius * 0.82;
          const cy = Math.sin(a) * radius * 0.82;
          let pts = '';
          for (let j = 0; j < 5; j++) {
            const a2 = (j * 72 - 90) * Math.PI / 180;
            pts += `${(cx + Math.cos(a2) * radius*0.2).toFixed(2)},${(cy + Math.sin(a2) * radius*0.2).toFixed(2)} `;
          }
          s += `<polygon points="${pts}" fill="#1a1a1a" opacity="0.85" transform="rotate(${(i*72 + 90).toFixed(1)} ${cx.toFixed(2)} ${cy.toFixed(2)})"/>`;
        }
        return s;
      })()}
      <!-- specular highlight -->
      <ellipse cx="${-radius*0.32}" cy="${-radius*0.4}" rx="${radius*0.22}" ry="${radius*0.13}" fill="#ffffff" opacity="0.55" transform="rotate(-28 ${-radius*0.32} ${-radius*0.4})"/>
      <ellipse cx="${-radius*0.38}" cy="${-radius*0.5}" rx="${radius*0.07}" ry="${radius*0.04}" fill="#ffffff" opacity="0.85"/>
    </g>`;
  },

  // Balón de baloncesto con gradiente naranja y costuras
  basketball: (radius = 80) => {
    const ug = _uid('bk-g');
    return `<g>
      <defs>
        <radialGradient id="${ug}" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#f5b070"/>
          <stop offset="55%" stop-color="#e07a3a"/>
          <stop offset="100%" stop-color="#7a3a14"/>
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="${radius*1.05}" rx="${radius*0.85}" ry="${radius*0.09}" fill="#000" opacity="0.32"/>
      <circle r="${radius}" fill="url(#${ug})"/>
      <!-- pebble dots para textura -->
      <g fill="#3a1a08" opacity="0.18">
        <circle cx="${-radius*0.3}" cy="${-radius*0.15}" r="${radius*0.012}"/>
        <circle cx="${-radius*0.15}" cy="${-radius*0.45}" r="${radius*0.01}"/>
        <circle cx="${radius*0.4}" cy="${-radius*0.3}" r="${radius*0.012}"/>
        <circle cx="${radius*0.55}" cy="${-radius*0.1}" r="${radius*0.01}"/>
        <circle cx="${radius*0.25}" cy="${radius*0.2}" r="${radius*0.012}"/>
        <circle cx="${-radius*0.4}" cy="${radius*0.3}" r="${radius*0.011}"/>
        <circle cx="${-radius*0.55}" cy="${-radius*0.05}" r="${radius*0.012}"/>
        <circle cx="${radius*0.05}" cy="${radius*0.4}" r="${radius*0.01}"/>
        <circle cx="${-radius*0.1}" cy="${radius*0.55}" r="${radius*0.011}"/>
      </g>
      <!-- costuras -->
      <circle r="${radius}" fill="none" stroke="#1a0a04" stroke-width="${radius*0.025}"/>
      <path d="M ${-radius} 0 Q 0 ${-radius*0.4}, ${radius} 0" stroke="#1a0a04" stroke-width="${radius*0.032}" fill="none"/>
      <path d="M ${-radius} 0 Q 0 ${radius*0.4}, ${radius} 0" stroke="#1a0a04" stroke-width="${radius*0.032}" fill="none"/>
      <line x1="0" y1="${-radius}" x2="0" y2="${radius}" stroke="#1a0a04" stroke-width="${radius*0.032}"/>
      <!-- brillo -->
      <ellipse cx="${-radius*0.3}" cy="${-radius*0.4}" rx="${radius*0.2}" ry="${radius*0.12}" fill="#ffffff" opacity="0.42" transform="rotate(-25 ${-radius*0.3} ${-radius*0.4})"/>
      <ellipse cx="${-radius*0.36}" cy="${-radius*0.48}" rx="${radius*0.06}" ry="${radius*0.035}" fill="#ffffff" opacity="0.75"/>
    </g>`;
  },

  // Pelota de tenis con costuras curvas y textura de fieltro
  tennisBall: (radius = 60) => {
    const ug = _uid('tn-g');
    return `<g>
      <defs>
        <radialGradient id="${ug}" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#eef27a"/>
          <stop offset="55%" stop-color="#c8d834"/>
          <stop offset="100%" stop-color="#6a781a"/>
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="${radius*1.08}" rx="${radius*0.85}" ry="${radius*0.09}" fill="#000" opacity="0.3"/>
      <circle r="${radius}" fill="url(#${ug})"/>
      <!-- fieltro: puntitos sutiles -->
      <g fill="#3a4a08" opacity="0.25">
        <circle cx="${-radius*0.3}" cy="${-radius*0.15}" r="${radius*0.012}"/>
        <circle cx="${radius*0.25}" cy="${-radius*0.25}" r="${radius*0.01}"/>
        <circle cx="${radius*0.5}" cy="${radius*0.05}" r="${radius*0.012}"/>
        <circle cx="${-radius*0.45}" cy="${radius*0.2}" r="${radius*0.01}"/>
        <circle cx="${radius*0.05}" cy="${radius*0.35}" r="${radius*0.012}"/>
        <circle cx="${-radius*0.15}" cy="${-radius*0.5}" r="${radius*0.011}"/>
      </g>
      <!-- costuras blancas curvas -->
      <path d="M ${-radius*0.95} ${-radius*0.35} Q 0 ${-radius*0.75}, ${radius*0.95} ${-radius*0.35}" stroke="#ffffff" stroke-width="${radius*0.06}" fill="none" opacity="0.95" stroke-linecap="round"/>
      <path d="M ${-radius*0.95} ${radius*0.35} Q 0 ${radius*0.75}, ${radius*0.95} ${radius*0.35}" stroke="#ffffff" stroke-width="${radius*0.06}" fill="none" opacity="0.95" stroke-linecap="round"/>
      <!-- contorno suave -->
      <circle r="${radius}" fill="none" stroke="#5a6a14" stroke-width="${radius*0.015}" opacity="0.45"/>
      <!-- brillo -->
      <ellipse cx="${-radius*0.3}" cy="${-radius*0.4}" rx="${radius*0.18}" ry="${radius*0.1}" fill="#ffffff" opacity="0.5" transform="rotate(-25 ${-radius*0.3} ${-radius*0.4})"/>
      <ellipse cx="${-radius*0.36}" cy="${-radius*0.48}" rx="${radius*0.055}" ry="${radius*0.03}" fill="#ffffff" opacity="0.85"/>
    </g>`;
  },

  // Silbato
  whistle: (size = 70, palette) => `
    <g>
      <rect x="${-size*0.4}" y="${-size*0.3}" width="${size*0.7}" height="${size*0.6}" rx="${size*0.15}" fill="${palette.accent}"/>
      <circle cx="${-size*0.05}" cy="0" r="${size*0.13}" fill="${palette.bg[0]}"/>
      <rect x="${size*0.28}" y="${-size*0.1}" width="${size*0.12}" height="${size*0.2}" rx="${size*0.04}" fill="${palette.accent}"/>
      <path d="M ${size*0.4} 0 Q ${size*0.7} ${-size*0.25}, ${size*1.05} ${-size*0.05}" stroke="${palette.ink}" stroke-width="2" fill="none" opacity="0.6"/>
    </g>`,

  // Trofeo metálico con dorado, especular y mango pulido
  trophy: (size = 140, palette) => {
    const um = _uid('tp-m'); const uh = _uid('tp-h'); const ub = _uid('tp-b');
    return `<g>
      <defs>
        <linearGradient id="${um}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8a6322"/>
          <stop offset="20%" stop-color="#f5d76e"/>
          <stop offset="40%" stop-color="#fff4c4"/>
          <stop offset="60%" stop-color="#f5c842"/>
          <stop offset="100%" stop-color="#8a6322"/>
        </linearGradient>
        <linearGradient id="${uh}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7a5a1a"/>
          <stop offset="50%" stop-color="#f5d76e"/>
          <stop offset="100%" stop-color="#7a5a1a"/>
        </linearGradient>
        <linearGradient id="${ub}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix('#3a2814', '#000', 0.1)}"/>
          <stop offset="50%" stop-color="${_mix('#5a3a1c', '#ffffff', 0.05)}"/>
          <stop offset="100%" stop-color="${_mix('#2a1a0a', '#000', 0.2)}"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.78, size*0.55, size*0.05, 0.45)}
      <!-- handles -->
      <path d="M ${-size*0.5} ${-size*0.55} Q ${-size*0.92} ${-size*0.5}, ${-size*0.92} ${-size*0.15} Q ${-size*0.92} ${size*0.1}, ${-size*0.5} ${size*0.1}" stroke="url(#${uh})" stroke-width="${size*0.075}" fill="none" stroke-linecap="round"/>
      <path d="M ${size*0.5} ${-size*0.55} Q ${size*0.92} ${-size*0.5}, ${size*0.92} ${-size*0.15} Q ${size*0.92} ${size*0.1}, ${size*0.5} ${size*0.1}" stroke="url(#${uh})" stroke-width="${size*0.075}" fill="none" stroke-linecap="round"/>
      <!-- cup body -->
      <path d="M ${-size*0.5} ${-size*0.7} L ${size*0.5} ${-size*0.7}
               L ${size*0.45} ${size*0.15}
               Q ${size*0.4} ${size*0.32}, 0 ${size*0.32}
               Q ${-size*0.4} ${size*0.32}, ${-size*0.45} ${size*0.15} Z"
            fill="url(#${um})"/>
      <!-- rim ring -->
      <rect x="${-size*0.52}" y="${-size*0.72}" width="${size*1.04}" height="${size*0.06}" rx="${size*0.01}" fill="url(#${uh})"/>
      <ellipse cx="0" cy="${-size*0.7}" rx="${size*0.5}" ry="${size*0.08}" fill="${_mix('#f5c842', '#000', 0.4)}"/>
      <ellipse cx="0" cy="${-size*0.72}" rx="${size*0.5}" ry="${size*0.06}" fill="${_mix('#f5c842', '#ffffff', 0.4)}"/>
      <!-- main specular highlights -->
      <path d="M ${-size*0.38} ${-size*0.55} L ${-size*0.32} ${size*0.1}" stroke="#ffffff" stroke-width="${size*0.055}" opacity="0.6" stroke-linecap="round"/>
      <path d="M ${-size*0.36} ${-size*0.55} L ${-size*0.3} ${size*0.1}" stroke="#ffffff" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <path d="M ${size*0.35} ${-size*0.55} L ${size*0.3} ${size*0.05}" stroke="${_mix('#f5c842', '#000', 0.35)}" stroke-width="${size*0.025}" opacity="0.7" stroke-linecap="round"/>
      <!-- star on cup -->
      <g transform="translate(0 ${-size*0.25})">
        ${(() => {
          let pts = '';
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? size*0.18 : size*0.07;
            const a = (i * 36 - 90) * Math.PI / 180;
            pts += `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
          }
          return `<polygon points="${pts}" fill="${_mix('#f5c842', '#000', 0.55)}"/>` +
                 `<polygon points="${pts}" fill="none" stroke="${_mix('#f5c842', '#000', 0.7)}" stroke-width="${size*0.008}"/>`;
        })()}
        <circle r="${size*0.06}" fill="${palette.accent2 || '#fff'}" opacity="0.85"/>
      </g>
      <!-- column/stem -->
      <rect x="${-size*0.06}" y="${size*0.3}" width="${size*0.12}" height="${size*0.22}" fill="url(#${uh})"/>
      <ellipse cx="0" cy="${size*0.32}" rx="${size*0.08}" ry="${size*0.025}" fill="${_mix('#f5c842', '#000', 0.5)}"/>
      <!-- base layers (wooden pedestal feel) -->
      <rect x="${-size*0.36}" y="${size*0.52}" width="${size*0.72}" height="${size*0.13}" rx="${size*0.015}" fill="url(#${uh})"/>
      <rect x="${-size*0.45}" y="${size*0.63}" width="${size*0.9}" height="${size*0.12}" rx="${size*0.02}" fill="url(#${ub})"/>
      <rect x="${-size*0.43}" y="${size*0.63}" width="${size*0.86}" height="${size*0.02}" fill="#ffffff" opacity="0.25"/>
      <!-- engraved plaque on base -->
      <rect x="${-size*0.22}" y="${size*0.67}" width="${size*0.44}" height="${size*0.06}" rx="${size*0.005}" fill="url(#${um})"/>
      <line x1="${-size*0.18}" y1="${size*0.7}" x2="${size*0.18}" y2="${size*0.7}" stroke="${_mix('#f5c842', '#000', 0.6)}" stroke-width="${size*0.006}"/>
    </g>`;
  },

  medal: (size = 70, palette) => {
    const ur = _uid('md-r'); const ug = _uid('md-g'); const us = _uid('md-s');
    return `<g>
      <defs>
        <linearGradient id="${ur}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#c43a3a"/>
          <stop offset="50%" stop-color="#e85050"/>
          <stop offset="100%" stop-color="#a32626"/>
        </linearGradient>
        <radialGradient id="${ug}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff4c4"/>
          <stop offset="50%" stop-color="#f5c842"/>
          <stop offset="100%" stop-color="#8a6322"/>
        </radialGradient>
        <radialGradient id="${us}" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- ribbon -->
      <path d="M ${-size*0.32} ${-size*0.95} L ${-size*0.17} ${-size*0.28} L ${-size*0.05} ${-size*0.35} L ${-size*0.18} ${-size*0.95} Z" fill="url(#${ur})"/>
      <path d="M ${size*0.32} ${-size*0.95} L ${size*0.17} ${-size*0.28} L ${size*0.05} ${-size*0.35} L ${size*0.18} ${-size*0.95} Z" fill="url(#${ur})"/>
      <path d="M ${-size*0.32} ${-size*0.95} L ${-size*0.18} ${-size*0.95} L ${-size*0.05} ${-size*0.35} L ${-size*0.13} ${-size*0.32}" fill="${_mix('#a32626', '#000', 0.4)}" opacity="0.8"/>
      <!-- ribbon notch at top -->
      <polygon points="${-size*0.32},${-size*0.95} ${-size*0.18},${-size*0.95} ${-size*0.25},${-size*0.82}" fill="${_mix('#a32626', '#000', 0.5)}"/>
      <polygon points="${size*0.32},${-size*0.95} ${size*0.18},${-size*0.95} ${size*0.25},${-size*0.82}" fill="${_mix('#a32626', '#000', 0.5)}"/>
      <!-- ribbon ring -->
      <circle cx="0" cy="${-size*0.33}" r="${size*0.06}" fill="none" stroke="#888" stroke-width="${size*0.015}"/>
      <circle cx="0" cy="${-size*0.33}" r="${size*0.06}" fill="none" stroke="#ddd" stroke-width="${size*0.005}"/>
      ${_contactShadow(size*0.55, size*0.4, size*0.04, 0.4)}
      <!-- medal body with metallic gradient -->
      <circle r="${size*0.5}" fill="url(#${ug})"/>
      <circle r="${size*0.5}" fill="none" stroke="${_mix('#f5c842', '#000', 0.4)}" stroke-width="${size*0.015}"/>
      <!-- inner ridge -->
      <circle r="${size*0.42}" fill="none" stroke="${_mix('#f5c842', '#000', 0.45)}" stroke-width="${size*0.012}"/>
      <circle r="${size*0.42}" fill="none" stroke="#ffffff" stroke-width="${size*0.004}" opacity="0.55"/>
      <!-- center star -->
      <g transform="translate(0 0)">
        ${(() => {
          let pts = '';
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? size*0.24 : size*0.1;
            const a = (i * 36 - 90) * Math.PI / 180;
            pts += `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
          }
          return `<polygon points="${pts}" fill="${_mix('#f5c842', '#000', 0.5)}"/>` +
                 `<polygon points="${pts}" fill="none" stroke="${_mix('#f5c842', '#000', 0.7)}" stroke-width="${size*0.01}"/>`;
        })()}
      </g>
      <!-- specular highlight -->
      <ellipse cx="${-size*0.18}" cy="${-size*0.18}" rx="${size*0.18}" ry="${size*0.12}" fill="url(#${us})" transform="rotate(-30 ${-size*0.18} ${-size*0.18})"/>
      <circle cx="${-size*0.25}" cy="${-size*0.25}" r="${size*0.03}" fill="#ffffff" opacity="0.85"/>
    </g>`;
  },

  // Cronómetro
  stopwatch: (size = 100, palette) => `
    <g>
      <rect x="${-size*0.1}" y="${-size*1.05}" width="${size*0.2}" height="${size*0.12}" rx="${size*0.02}" fill="${palette.ink}"/>
      <rect x="${-size*0.04}" y="${-size*0.95}" width="${size*0.08}" height="${size*0.08}" fill="${palette.ink}"/>
      <circle r="${size}" fill="${palette.accent2 || '#fff'}" stroke="${palette.ink}" stroke-width="${size*0.06}"/>
      <circle r="${size*0.05}" fill="${palette.ink}"/>
      <line x1="0" y1="0" x2="0" y2="${-size*0.6}" stroke="${palette.ink}" stroke-width="${size*0.04}" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="${size*0.45}" y2="${-size*0.35}" stroke="${palette.accent}" stroke-width="${size*0.025}" stroke-linecap="round"/>
      ${(() => {
        let s = '';
        for (let i = 0; i < 12; i++) {
          const a = (i * 30) * Math.PI / 180;
          const x1 = Math.cos(a) * size * 0.85, y1 = Math.sin(a) * size * 0.85;
          const x2 = Math.cos(a) * size * 0.95, y2 = Math.sin(a) * size * 0.95;
          s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${palette.ink}" stroke-width="${size*0.025}" opacity="0.8"/>`;
        }
        return s;
      })()}
    </g>`,

  // Bicicleta silueta
  bicycle: (size = 120, palette) => `
    <g stroke="${palette.ink}" stroke-width="${size*0.04}" fill="none" stroke-linecap="round">
      <circle cx="${-size*0.6}" cy="${size*0.15}" r="${size*0.35}"/>
      <circle cx="${size*0.6}" cy="${size*0.15}" r="${size*0.35}"/>
      <line x1="${-size*0.6}" y1="${size*0.15}" x2="${-size*0.1}" y2="${-size*0.4}"/>
      <line x1="${-size*0.6}" y1="${size*0.15}" x2="${size*0.1}" y2="${size*0.15}"/>
      <line x1="${size*0.6}" y1="${size*0.15}" x2="${size*0.1}" y2="${size*0.15}"/>
      <line x1="${size*0.6}" y1="${size*0.15}" x2="${-size*0.1}" y2="${-size*0.4}"/>
      <line x1="${size*0.1}" y1="${size*0.15}" x2="${size*0.4}" y2="${-size*0.4}"/>
      <line x1="${size*0.3}" y1="${-size*0.45}" x2="${size*0.5}" y2="${-size*0.45}"/>
      <line x1="${-size*0.1}" y1="${-size*0.4}" x2="${-size*0.2}" y2="${-size*0.5}"/>
    </g>`,

  // Corredor
  runner: (size = 200, fill = '#1a1a1a') => `
    <g fill="${fill}">
      <circle cx="${size*0.18}" cy="${-size*0.85}" r="${size*0.085}"/>
      <path d="M ${size*0.1} ${-size*0.78} Q ${size*0.05} ${-size*0.55}, ${-size*0.05} ${-size*0.3} L ${size*0.04} ${-size*0.25} Q ${size*0.18} ${-size*0.55}, ${size*0.22} ${-size*0.75} Z"/>
      <path d="M ${size*0.05} ${-size*0.7} L ${size*0.35} ${-size*0.5} L ${size*0.4} ${-size*0.42} L ${size*0.1} ${-size*0.6} Z"/>
      <path d="M ${size*0.03} ${-size*0.65} L ${-size*0.28} ${-size*0.45} L ${-size*0.25} ${-size*0.38} L ${size*0.08} ${-size*0.55} Z"/>
      <path d="M 0 ${-size*0.3} L ${size*0.18} 0 L ${size*0.32} ${size*0.04} L ${size*0.34} ${-size*0.02} L ${size*0.24} ${-size*0.08} L ${size*0.08} ${-size*0.3} Z"/>
      <path d="M ${-size*0.04} ${-size*0.3} L ${-size*0.24} ${-size*0.05} L ${-size*0.4} ${-size*0.08} L ${-size*0.4} ${-size*0.15} L ${-size*0.28} ${-size*0.15} L ${-size*0.12} ${-size*0.32} Z"/>
      <line x1="${-size*0.45}" y1="${-size*0.6}" x2="${-size*0.2}" y2="${-size*0.6}" stroke="${fill}" stroke-width="${size*0.012}" opacity="0.5" stroke-linecap="round"/>
      <line x1="${-size*0.5}" y1="${-size*0.45}" x2="${-size*0.25}" y2="${-size*0.45}" stroke="${fill}" stroke-width="${size*0.012}" opacity="0.4" stroke-linecap="round"/>
      <line x1="${-size*0.55}" y1="${-size*0.3}" x2="${-size*0.3}" y2="${-size*0.3}" stroke="${fill}" stroke-width="${size*0.012}" opacity="0.3" stroke-linecap="round"/>
    </g>`,

  // Mancuerna
  dumbbell: (size = 80, palette) => `
    <g fill="${palette.ink}">
      <rect x="${-size*0.7}" y="${-size*0.4}" width="${size*0.18}" height="${size*0.8}" rx="${size*0.04}"/>
      <rect x="${-size*0.55}" y="${-size*0.25}" width="${size*0.12}" height="${size*0.5}" rx="${size*0.03}"/>
      <rect x="${-size*0.43}" y="${-size*0.08}" width="${size*0.86}" height="${size*0.16}" fill="${palette.accent || '#1a1a1a'}"/>
      <rect x="${size*0.43}" y="${-size*0.25}" width="${size*0.12}" height="${size*0.5}" rx="${size*0.03}"/>
      <rect x="${size*0.52}" y="${-size*0.4}" width="${size*0.18}" height="${size*0.8}" rx="${size*0.04}"/>
    </g>`,

  /* =====================================================
     ████████  TECNOLOGÍA  ████████
     ===================================================== */

  // Patrón de circuito
  circuit: (palette, opacity = 0.65, size = 200) => `
    <g stroke="${palette.accent}" stroke-width="2" fill="none" opacity="${opacity}" stroke-linecap="square">
      <line x1="${-size}" y1="${-size*0.9}" x2="${-size*0.5}" y2="${-size*0.9}"/>
      <line x1="${-size*0.5}" y1="${-size*0.9}" x2="${-size*0.5}" y2="${-size*0.5}"/>
      <line x1="${-size*0.5}" y1="${-size*0.5}" x2="${size*0.3}" y2="${-size*0.5}"/>
      <line x1="${size*0.3}" y1="${-size*0.5}" x2="${size*0.3}" y2="0"/>
      <line x1="${size*0.3}" y1="0" x2="${size*0.9}" y2="0"/>
      <line x1="${-size}" y1="${size*0.3}" x2="${-size*0.3}" y2="${size*0.3}"/>
      <line x1="${-size*0.3}" y1="${size*0.3}" x2="${-size*0.3}" y2="${size*0.8}"/>
      <line x1="${-size*0.3}" y1="${size*0.8}" x2="${size*0.6}" y2="${size*0.8}"/>
      <line x1="${size*0.6}" y1="${size*0.8}" x2="${size*0.6}" y2="${size*0.5}"/>
      <line x1="${size*0.6}" y1="${size*0.5}" x2="${size}" y2="${size*0.5}"/>
      <line x1="${size}" y1="${-size*0.9}" x2="${size}" y2="${-size*0.3}"/>
    </g>
    <g fill="${palette.accent2}" opacity="${opacity}">
      <circle cx="${-size}" cy="${-size*0.9}" r="6"/>
      <circle cx="${-size*0.5}" cy="${-size*0.5}" r="5"/>
      <circle cx="${size*0.3}" cy="${-size*0.5}" r="5"/>
      <circle cx="${size*0.3}" cy="0" r="5"/>
      <circle cx="${size*0.9}" cy="0" r="6"/>
      <circle cx="${-size}" cy="${size*0.3}" r="6"/>
      <circle cx="${-size*0.3}" cy="${size*0.8}" r="5"/>
      <circle cx="${size*0.6}" cy="${size*0.5}" r="5"/>
      <circle cx="${size}" cy="${size*0.5}" r="6"/>
      <circle cx="${size}" cy="${-size*0.3}" r="5"/>
    </g>
    <g stroke="${palette.accent2}" stroke-width="1.5" fill="none" opacity="${opacity * 0.8}">
      <rect x="-30" y="-30" width="60" height="60" rx="4"/>
      <rect x="-22" y="-22" width="44" height="44" rx="2"/>
      <line x1="-22" y1="-10" x2="22" y2="-10"/>
      <line x1="-22" y1="0" x2="22" y2="0"/>
      <line x1="-22" y1="10" x2="22" y2="10"/>
    </g>`,

  codeBrackets: (size = 140, palette) => `
    <g stroke="${palette.accent2}" stroke-width="${size*0.06}" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M ${-size*0.3} ${-size*0.8} Q ${-size*0.6} ${-size*0.8}, ${-size*0.6} ${-size*0.4}
               L ${-size*0.6} ${-size*0.1} Q ${-size*0.6} 0, ${-size*0.8} 0
               Q ${-size*0.6} 0, ${-size*0.6} ${size*0.1}
               L ${-size*0.6} ${size*0.4} Q ${-size*0.6} ${size*0.8}, ${-size*0.3} ${size*0.8}"/>
      <path d="M ${size*0.3} ${-size*0.8} Q ${size*0.6} ${-size*0.8}, ${size*0.6} ${-size*0.4}
               L ${size*0.6} ${-size*0.1} Q ${size*0.6} 0, ${size*0.8} 0
               Q ${size*0.6} 0, ${size*0.6} ${size*0.1}
               L ${size*0.6} ${size*0.4} Q ${size*0.6} ${size*0.8}, ${size*0.3} ${size*0.8}"/>
    </g>
    <g fill="${palette.accent}" opacity="0.85">
      <rect x="${-size*0.18}" y="${-size*0.06}" width="${size*0.06}" height="${size*0.12}" rx="1"/>
      <rect x="${-size*0.03}" y="${-size*0.06}" width="${size*0.06}" height="${size*0.12}" rx="1"/>
      <rect x="${size*0.12}" y="${-size*0.06}" width="${size*0.06}" height="${size*0.12}" rx="1"/>
    </g>`,

  // Monitor de computadora (bisel premium, pantalla con código y reflejo)
  monitor: (size = 180, palette) => {
    const ubz = _uid('mon-bz'); const usc = _uid('mon-s');
    return `<g>
      <defs>
        <linearGradient id="${ubz}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3a3a3e"/>
          <stop offset="50%" stop-color="#1a1a1e"/>
          <stop offset="100%" stop-color="#0a0a0e"/>
        </linearGradient>
        <linearGradient id="${usc}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.bg[0], '#000', 0.5)}"/>
          <stop offset="100%" stop-color="${_mix(palette.bg[0], '#000', 0.3)}"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.6, size*0.55, size*0.04, 0.45)}
      <!-- outer bezel with bevel -->
      <rect x="${-size*0.66}" y="${-size*0.52}" width="${size*1.32}" height="${size*0.92}" rx="${size*0.025}" fill="url(#${ubz})"/>
      <rect x="${-size*0.66}" y="${-size*0.52}" width="${size*1.32}" height="${size*0.03}" fill="#ffffff" opacity="0.18"/>
      <!-- screen -->
      <rect x="${-size*0.6}" y="${-size*0.46}" width="${size*1.2}" height="${size*0.78}" rx="${size*0.005}" fill="url(#${usc})"/>
      <!-- title bar -->
      <rect x="${-size*0.6}" y="${-size*0.46}" width="${size*1.2}" height="${size*0.06}" fill="${_mix(palette.ink, '#000', 0.3)}"/>
      <circle cx="${-size*0.56}" cy="${-size*0.43}" r="${size*0.012}" fill="#ff5a5a"/>
      <circle cx="${-size*0.52}" cy="${-size*0.43}" r="${size*0.012}" fill="#f5c842"/>
      <circle cx="${-size*0.48}" cy="${-size*0.43}" r="${size*0.012}" fill="#5ad88a"/>
      <!-- line numbers -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 8; i++) {
          s += `<text x="${-size*0.55}" y="${-size*0.3 + i*size*0.058}" font-family="monospace" font-size="${size*0.025}" fill="${palette.mute || '#888'}" opacity="0.65">${i+1}</text>`;
        }
        return s;
      })()}
      <!-- code lines with realistic syntax coloring -->
      <line x1="${-size*0.5}" y1="${-size*0.31}" x2="${-size*0.38}" y2="${-size*0.31}" stroke="#c678dd" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.35}" y1="${-size*0.31}" x2="${-size*0.15}" y2="${-size*0.31}" stroke="${palette.accent2}" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.12}" y1="${-size*0.31}" x2="${size*0.02}" y2="${-size*0.31}" stroke="#98c379" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.4}" y1="${-size*0.25}" x2="${-size*0.05}" y2="${-size*0.25}" stroke="${palette.accent}" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.02}" y1="${-size*0.25}" x2="${size*0.2}" y2="${-size*0.25}" stroke="#e5c07b" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.4}" y1="${-size*0.19}" x2="${-size*0.2}" y2="${-size*0.19}" stroke="#56b6c2" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.17}" y1="${-size*0.19}" x2="${size*0.1}" y2="${-size*0.19}" stroke="${palette.accent}" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.5}" y1="${-size*0.13}" x2="${-size*0.3}" y2="${-size*0.13}" stroke="#c678dd" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.27}" y1="${-size*0.13}" x2="${-size*0.05}" y2="${-size*0.13}" stroke="${palette.accent2}" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.4}" y1="${-size*0.07}" x2="${-size*0.18}" y2="${-size*0.07}" stroke="#98c379" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.45}" y1="${-size*0.01}" x2="${-size*0.05}" y2="${-size*0.01}" stroke="${palette.accent}" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.5}" y1="${size*0.05}" x2="${-size*0.32}" y2="${size*0.05}" stroke="#e5c07b" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.4}" y1="${size*0.11}" x2="${-size*0.1}" y2="${size*0.11}" stroke="#56b6c2" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <line x1="${-size*0.5}" y1="${size*0.17}" x2="${-size*0.4}" y2="${size*0.17}" stroke="#c678dd" stroke-width="${size*0.018}" opacity="0.95" stroke-linecap="round"/>
      <!-- cursor block (blinking) -->
      <rect x="${-size*0.38}" y="${size*0.16}" width="${size*0.018}" height="${size*0.04}" fill="${palette.accent2}" opacity="0.95"/>
      <!-- screen reflection -->
      <path d="M ${-size*0.6} ${-size*0.46} L ${-size*0.3} ${-size*0.46} L ${-size*0.55} ${size*0.32} L ${-size*0.6} ${size*0.32} Z" fill="#ffffff" opacity="0.06"/>
      <!-- LED -->
      <circle cx="${size*0.6}" cy="${size*0.36}" r="${size*0.012}" fill="#5ad88a"/>
      <circle cx="${size*0.6}" cy="${size*0.36}" r="${size*0.025}" fill="#5ad88a" opacity="0.3" filter="url(#ds-glow-sm)"/>
      <!-- stand neck and base -->
      <rect x="${-size*0.04}" y="${size*0.4}" width="${size*0.08}" height="${size*0.14}" fill="url(#${ubz})"/>
      <ellipse cx="0" cy="${size*0.55}" rx="${size*0.3}" ry="${size*0.05}" fill="url(#${ubz})"/>
      <ellipse cx="0" cy="${size*0.55}" rx="${size*0.3}" ry="${size*0.05}" fill="none" stroke="#000" stroke-width="${size*0.005}" opacity="0.4"/>
      <ellipse cx="0" cy="${size*0.54}" rx="${size*0.27}" ry="${size*0.012}" fill="#ffffff" opacity="0.15"/>
    </g>`;
  },

  // Teclado mecánico con teclas tridimensionales
  keyboard: (size = 200, palette) => {
    const ub = _uid('kb-b'); const uk = _uid('kb-k');
    return `<g>
      <defs>
        <linearGradient id="${ub}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3a3a3e"/>
          <stop offset="100%" stop-color="#0e0e12"/>
        </linearGradient>
        <linearGradient id="${uk}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.bg[0], '#ffffff', 0.25)}"/>
          <stop offset="100%" stop-color="${_mix(palette.bg[0], '#000', 0.15)}"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.22, size*0.6, size*0.03, 0.4)}
      <!-- base with bevel -->
      <rect x="${-size*0.62}" y="${-size*0.2}" width="${size*1.24}" height="${size*0.4}" rx="${size*0.025}" fill="url(#${ub})"/>
      <rect x="${-size*0.62}" y="${-size*0.2}" width="${size*1.24}" height="${size*0.02}" fill="#ffffff" opacity="0.15"/>
      <rect x="${-size*0.62}" y="${size*0.18}" width="${size*1.24}" height="${size*0.02}" fill="#000" opacity="0.4"/>
      <!-- 3D keys (back shadow + key cap) -->
      ${(() => {
        let s = '';
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 10; c++) {
            const x = -size*0.56 + c * size*0.112;
            const y = -size*0.15 + r * size*0.105;
            const w = size*0.095, h = size*0.078;
            // shadow under key
            s += `<rect x="${x.toFixed(2)}" y="${(y+size*0.012).toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${(size*0.008).toFixed(2)}" fill="#000" opacity="0.55"/>`;
            // key body
            s += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${(size*0.008).toFixed(2)}" fill="url(#${uk})"/>`;
            // top highlight
            s += `<rect x="${(x+size*0.005).toFixed(2)}" y="${(y+size*0.003).toFixed(2)}" width="${(w-size*0.01).toFixed(2)}" height="${(size*0.012).toFixed(2)}" rx="${(size*0.003).toFixed(2)}" fill="#ffffff" opacity="0.35"/>`;
            // tiny label dot
            s += `<circle cx="${(x+w/2).toFixed(2)}" cy="${(y+h/2+size*0.008).toFixed(2)}" r="${(size*0.005).toFixed(2)}" fill="${palette.ink}" opacity="0.4"/>`;
          }
        }
        // space bar
        s += `<rect x="${-size*0.3}" y="${size*0.06}" width="${size*0.6}" height="${size*0.06}" rx="${size*0.008}" fill="#000" opacity="0.55" transform="translate(0 ${size*0.012})"/>`;
        s += `<rect x="${-size*0.3}" y="${size*0.06}" width="${size*0.6}" height="${size*0.06}" rx="${size*0.008}" fill="url(#${uk})"/>`;
        s += `<rect x="${-size*0.29}" y="${size*0.064}" width="${size*0.58}" height="${size*0.012}" rx="${size*0.003}" fill="#ffffff" opacity="0.3"/>`;
        return s;
      })()}
    </g>`;
  },

  // Cursor de ratón
  mouseCursor: (size = 60, color = '#fff') => `
    <g>
      <path d="M 0 0 L 0 ${size} L ${size*0.25} ${size*0.65} L ${size*0.55} ${size*1.1} L ${size*0.75} ${size*0.95} L ${size*0.45} ${size*0.5} L ${size*0.85} ${size*0.4} Z"
            fill="${color}" stroke="#000" stroke-width="2" stroke-linejoin="round"/>
    </g>`,

  // Símbolo wifi
  wifi: (size = 80, color = '#fff') => `
    <g fill="none" stroke="${color}" stroke-width="${size*0.06}" stroke-linecap="round">
      <path d="M ${-size} ${-size*0.1} Q 0 ${-size*0.7}, ${size} ${-size*0.1}"/>
      <path d="M ${-size*0.7} ${size*0.1} Q 0 ${-size*0.3}, ${size*0.7} ${size*0.1}"/>
      <path d="M ${-size*0.4} ${size*0.3} Q 0 ${size*0.1}, ${size*0.4} ${size*0.3}"/>
      <circle cx="0" cy="${size*0.55}" r="${size*0.1}" fill="${color}"/>
    </g>`,

  // Hombre de Vitruvio
  vitruvianFigure: (size = 200, color = '#3d2814') => `
    <g fill="${color}" opacity="0.78">
      <circle cy="${-size*0.78}" r="${size*0.12}"/>
      <path d="M ${-size*0.08} ${-size*0.65} L ${-size*0.12} ${-size*0.2} L ${-size*0.08} ${size*0.1} L ${-size*0.06} ${size*0.5} L ${-size*0.04} ${size*0.7} L ${size*0.04} ${size*0.7} L ${size*0.06} ${size*0.5} L ${size*0.08} ${size*0.1} L ${size*0.12} ${-size*0.2} L ${size*0.08} ${-size*0.65} Z"/>
      <path d="M ${-size*0.12} ${-size*0.55} L ${-size*0.9} ${-size*0.45} L ${-size*0.92} ${-size*0.38} L ${-size*0.12} ${-size*0.5} Z"/>
      <path d="M ${size*0.12} ${-size*0.55} L ${size*0.9} ${-size*0.45} L ${size*0.92} ${-size*0.38} L ${size*0.12} ${-size*0.5} Z"/>
      <path d="M ${-size*0.06} ${size*0.65} L ${-size*0.4} ${size*0.9} L ${-size*0.38} ${size*0.95} L 0 ${size*0.7} Z"/>
      <path d="M ${size*0.06} ${size*0.65} L ${size*0.4} ${size*0.9} L ${size*0.38} ${size*0.95} L 0 ${size*0.7} Z"/>
    </g>`,

  /* =====================================================
     ████████  VISUALES (ARTE)  ████████
     ===================================================== */

  // Paleta de pintor con madera, hueco para pulgar y manchas de óleo brillantes
  paintPalette: (size = 180, palette) => {
    const uw = _uid('pp-w');
    const blob = (cx, cy, r, color) => `
      <ellipse cx="${cx}" cy="${(cy + r*0.05).toFixed(2)}" rx="${r}" ry="${r*0.9}" fill="${_mix(color, '#000', 0.35)}" opacity="0.55"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>
      <ellipse cx="${(cx - r*0.3).toFixed(2)}" cy="${(cy - r*0.35).toFixed(2)}" rx="${(r*0.32).toFixed(2)}" ry="${(r*0.18).toFixed(2)}" fill="#ffffff" opacity="0.7"/>
      <circle cx="${(cx + r*0.4).toFixed(2)}" cy="${(cy + r*0.2).toFixed(2)}" r="${(r*0.12).toFixed(2)}" fill="${_mix(color, '#ffffff', 0.4)}" opacity="0.6"/>
    `;
    return `<g>
      <defs>
        <radialGradient id="${uw}" cx="40%" cy="30%" r="85%">
          <stop offset="0%" stop-color="#eed5a0"/>
          <stop offset="55%" stop-color="#c48848"/>
          <stop offset="100%" stop-color="#6a4218"/>
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="${size*0.5}" rx="${size*0.78}" ry="${size*0.07}" fill="#000" opacity="0.32"/>
      <!-- forma de paleta con hueco para el pulgar (fill-rule evenodd) -->
      <path fill-rule="evenodd" d="
        M ${-size*0.85} ${-size*0.05}
        C ${-size*0.85} ${-size*0.42}, ${-size*0.5} ${-size*0.58}, 0 ${-size*0.55}
        C ${size*0.48} ${-size*0.55}, ${size*0.82} ${-size*0.32}, ${size*0.86} 0
        C ${size*0.88} ${size*0.32}, ${size*0.55} ${size*0.45}, ${size*0.2} ${size*0.42}
        C ${-size*0.18} ${size*0.46}, ${-size*0.55} ${size*0.42}, ${-size*0.78} ${size*0.3}
        C ${-size*0.9} ${size*0.18}, ${-size*0.88} ${size*0.08}, ${-size*0.85} ${-size*0.05} Z
        M ${size*0.34} ${-size*0.06}
        C ${size*0.36} ${-size*0.18}, ${size*0.5} ${-size*0.2}, ${size*0.56} ${-size*0.1}
        C ${size*0.58} ${size*0.02}, ${size*0.5} ${size*0.12}, ${size*0.4} ${size*0.1}
        C ${size*0.32} ${size*0.06}, ${size*0.32} ${-size*0.02}, ${size*0.34} ${-size*0.06} Z
      " fill="url(#${uw})" stroke="#4a2c10" stroke-width="${size*0.012}"/>
      <!-- vetas de madera -->
      <path d="M ${-size*0.7} ${-size*0.3} Q ${-size*0.2} ${-size*0.42}, ${size*0.25} ${-size*0.5}" stroke="#3a200a" stroke-width="${size*0.005}" fill="none" opacity="0.3"/>
      <path d="M ${-size*0.75} ${-size*0.05} Q ${-size*0.3} ${-size*0.15}, ${size*0.2} ${-size*0.12}" stroke="#3a200a" stroke-width="${size*0.005}" fill="none" opacity="0.25"/>
      <path d="M ${-size*0.7} ${size*0.2} Q ${-size*0.25} ${size*0.25}, ${size*0.05} ${size*0.3}" stroke="#3a200a" stroke-width="${size*0.005}" fill="none" opacity="0.25"/>
      <!-- borde interior del hueco con sombra -->
      <path d="M ${size*0.34} ${-size*0.06}
               C ${size*0.36} ${-size*0.18}, ${size*0.5} ${-size*0.2}, ${size*0.56} ${-size*0.1}" stroke="#000" stroke-width="${size*0.008}" fill="none" opacity="0.35"/>
      <!-- highlight superior del borde -->
      <path d="M ${-size*0.82} ${-size*0.18} Q ${-size*0.55} ${-size*0.55}, ${-size*0.15} ${-size*0.56}" stroke="#ffffff" stroke-width="${size*0.012}" fill="none" opacity="0.5"/>
      <!-- 7 manchas de óleo organizadas en arco superior + 1 abajo -->
      ${blob(-size*0.6, -size*0.34, size*0.085, '#b3354c')}
      ${blob(-size*0.35, -size*0.47, size*0.075, '#e8732a')}
      ${blob(-size*0.05, -size*0.5, size*0.08, '#f5c842')}
      ${blob(size*0.25, -size*0.48, size*0.075, '#5a9c3a')}
      ${blob(-size*0.62, -size*0.05, size*0.08, '#5b9aff')}
      ${blob(-size*0.4, size*0.15, size*0.075, '#7a3a9a')}
      ${blob(-size*0.05, size*0.22, size*0.075, '#1a4a6e')}
      <!-- pincel apoyado en la paleta (asomando por la esquina) -->
      <g transform="translate(${size*0.55} ${size*0.2}) rotate(35)">
        <rect x="${-size*0.32}" y="${-size*0.022}" width="${size*0.5}" height="${size*0.045}" rx="${size*0.01}" fill="#5a3018"/>
        <rect x="${-size*0.32}" y="${-size*0.022}" width="${size*0.5}" height="${size*0.012}" fill="#ffffff" opacity="0.25"/>
        <rect x="${size*0.18}" y="${-size*0.024}" width="${size*0.08}" height="${size*0.048}" fill="#c0a070"/>
        <path d="M ${size*0.26} ${-size*0.022} L ${size*0.4} ${-size*0.04} L ${size*0.4} ${size*0.04} L ${size*0.26} ${size*0.022} Z" fill="#3a1a04"/>
      </g>
    </g>`;
  },

  brush: (length = 200, palette, color = null) => {
    const c = color || palette.accent;
    return `<g>
      <rect x="${-length*0.04}" y="${-length*0.5}" width="${length*0.08}" height="${length*0.7}" rx="${length*0.01}" fill="${palette.bg[2] || palette.ink}"/>
      <rect x="${-length*0.05}" y="${length*0.2}" width="${length*0.1}" height="${length*0.1}" fill="${palette.accent}"/>
      <path d="M ${-length*0.07} ${length*0.3} L ${-length*0.05} ${length*0.5} Q 0 ${length*0.52}, ${length*0.05} ${length*0.5} L ${length*0.07} ${length*0.3} Z" fill="${c}"/>
    </g>`;
  },

  // Lápiz
  pencil: (length = 180, palette) => `
    <g>
      <path d="M ${-length*0.45} ${-length*0.05} L ${length*0.4} ${-length*0.05} L ${length*0.4} ${length*0.05} L ${-length*0.45} ${length*0.05} Z" fill="${palette.accent || '#f5c842'}"/>
      <path d="M ${length*0.4} ${-length*0.05} L ${length*0.48} ${-length*0.03} L ${length*0.48} ${length*0.03} L ${length*0.4} ${length*0.05} Z" fill="${palette.bg[2] || palette.mute}"/>
      <path d="M ${length*0.48} 0 L ${length*0.55} ${-length*0.05} L ${length*0.55} ${length*0.05} Z" fill="#1a1a1a"/>
      <rect x="${-length*0.5}" y="${-length*0.05}" width="${length*0.06}" height="${length*0.1}" fill="${palette.ink || '#b3354c'}"/>
      <rect x="${-length*0.46}" y="${-length*0.05}" width="${length*0.02}" height="${length*0.1}" fill="${palette.bg[0]}" opacity="0.4"/>
    </g>`,

  // Rueda de color
  colorWheel: (size = 100, palette) => `
    <g>
      ${(() => {
        const colors = ['#b3354c', '#f5a838', '#f5c842', '#4d6b2e', '#5b9aff', '#8a3a7a'];
        let s = '';
        for (let i = 0; i < 6; i++) {
          const a1 = (i * 60 - 90) * Math.PI / 180;
          const a2 = ((i + 1) * 60 - 90) * Math.PI / 180;
          const x1 = Math.cos(a1) * size, y1 = Math.sin(a1) * size;
          const x2 = Math.cos(a2) * size, y2 = Math.sin(a2) * size;
          s += `<path d="M 0 0 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${size} ${size} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${colors[i]}"/>`;
        }
        return s;
      })()}
      <circle r="${size*0.25}" fill="${palette.bg[0]}" opacity="0.9"/>
      <circle r="${size*0.25}" fill="none" stroke="${palette.ink}" stroke-width="1.5"/>
    </g>`,

  // Caballete con lienzo
  easel: (size = 180, palette) => `
    <g>
      <line x1="${-size*0.55}" y1="${-size*0.85}" x2="${-size*0.25}" y2="${size*0.85}" stroke="${palette.bg[2] || palette.ink}" stroke-width="${size*0.04}" stroke-linecap="round"/>
      <line x1="${size*0.55}" y1="${-size*0.85}" x2="${size*0.25}" y2="${size*0.85}" stroke="${palette.bg[2] || palette.ink}" stroke-width="${size*0.04}" stroke-linecap="round"/>
      <line x1="0" y1="${-size*0.85}" x2="0" y2="${size*0.95}" stroke="${palette.bg[2] || palette.ink}" stroke-width="${size*0.035}" stroke-linecap="round"/>
      <rect x="${-size*0.45}" y="${-size*0.55}" width="${size*0.9}" height="${size*0.75}" fill="${palette.accent2 || '#fff8f0'}" stroke="${palette.ink}" stroke-width="2"/>
      <!-- painting on canvas -->
      <circle cx="${-size*0.05}" cy="${-size*0.32}" r="${size*0.1}" fill="#f5c842" opacity="0.8"/>
      <path d="M ${-size*0.4} ${size*0.12} Q ${-size*0.15} ${-size*0.05}, 0 ${size*0.05} Q ${size*0.15} ${size*0.18}, ${size*0.4} ${size*0.12} L ${size*0.4} ${size*0.2} L ${-size*0.4} ${size*0.2} Z" fill="#4d6b2e" opacity="0.85"/>
      <rect x="${-size*0.5}" y="${size*0.2}" width="${size}" height="${size*0.04}" fill="${palette.bg[2] || palette.ink}"/>
    </g>`,

  // Marco
  pictureFrame: (w = 280, h = 200, palette) => `
    <g>
      <rect x="${-w/2 - 20}" y="${-h/2 - 20}" width="${w + 40}" height="${h + 40}" fill="${palette.accent}" rx="4"/>
      <rect x="${-w/2 - 10}" y="${-h/2 - 10}" width="${w + 20}" height="${h + 20}" fill="${palette.bg[2] || palette.ink}" rx="2"/>
      <rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" fill="${palette.bg[0]}"/>
    </g>`,

  // Cámara
  camera: (size = 100, palette) => `
    <g>
      <rect x="${-size*0.7}" y="${-size*0.4}" width="${size*1.4}" height="${size*0.9}" rx="${size*0.05}" fill="${palette.ink}"/>
      <rect x="${-size*0.25}" y="${-size*0.55}" width="${size*0.5}" height="${size*0.18}" rx="${size*0.02}" fill="${palette.ink}"/>
      <circle r="${size*0.3}" fill="${palette.bg[0]}" opacity="0.9"/>
      <circle r="${size*0.3}" fill="none" stroke="${palette.accent}" stroke-width="2.5"/>
      <circle r="${size*0.18}" fill="${palette.accent}"/>
      <circle cx="${size*0.5}" cy="${-size*0.25}" r="${size*0.05}" fill="${palette.accent2}"/>
    </g>`,

  /* =====================================================
     ████████  EMPRENDIMIENTO  ████████
     ===================================================== */

  edisonBulb: (size = 180, palette) => `
    <g>
      <ellipse cx="0" cy="${-size*0.05}" rx="${size*0.9}" ry="${size*1.05}" fill="${palette.accent}" opacity="0.2" filter="url(#ds-glow)"/>
      <path d="M0 ${-size} C ${-size*0.6} ${-size}, ${-size} ${-size*0.6}, ${-size} ${-size*0.15}
               C ${-size} ${size*0.2}, ${-size*0.85} ${size*0.4}, ${-size*0.6} ${size*0.55}
               L ${-size*0.6} ${size*0.85} C ${-size*0.6} ${size*0.92}, ${-size*0.55} ${size*0.96}, ${-size*0.48} ${size*0.96}
               L ${size*0.48} ${size*0.96} C ${size*0.55} ${size*0.96}, ${size*0.6} ${size*0.92}, ${size*0.6} ${size*0.85}
               L ${size*0.6} ${size*0.55} C ${size*0.85} ${size*0.4}, ${size} ${size*0.2}, ${size} ${-size*0.15}
               C ${size} ${-size*0.6}, ${size*0.6} ${-size}, 0 ${-size} Z" fill="${palette.accent2}" opacity="0.95"/>
      <path d="${(() => {
        let d = `M${-size*0.35} ${-size*0.2}`;
        for (let i = 0; i < 6; i++) {
          const x1 = -size*0.35 + (size*0.7) * (i + 0.5) / 6;
          const y1 = i % 2 === 0 ? -size*0.05 : -size*0.35;
          d += ` Q ${x1.toFixed(1)} ${y1.toFixed(1)}, ${(-size*0.35 + (size*0.7) * (i+1)/6).toFixed(1)} ${-size*0.2}`;
        }
        return d;
      })()}" stroke="${palette.accent}" stroke-width="${size*0.018}" fill="none" opacity="0.85"/>
      <rect x="${-size*0.55}" y="${size*0.96}" width="${size*1.1}" height="${size*0.12}" rx="${size*0.02}" fill="${palette.mute}"/>
      <rect x="${-size*0.5}" y="${size*1.08}" width="${size}" height="${size*0.1}" rx="${size*0.02}" fill="${palette.bg[1]}"/>
      <rect x="${-size*0.35}" y="${size*1.18}" width="${size*0.7}" height="${size*0.1}" rx="${size*0.04}" fill="${palette.bg[0]}"/>
    </g>`,

  // Cohete
  rocket: (size = 140, palette) => `
    <g>
      <path d="M 0 ${-size}
               Q ${size*0.3} ${-size*0.6}, ${size*0.3} 0
               L ${size*0.3} ${size*0.5}
               L ${-size*0.3} ${size*0.5}
               L ${-size*0.3} 0
               Q ${-size*0.3} ${-size*0.6}, 0 ${-size} Z"
            fill="${palette.accent2 || '#fff'}" stroke="${palette.ink}" stroke-width="2.5"/>
      <circle cy="${-size*0.35}" r="${size*0.15}" fill="${palette.accent}"/>
      <circle cy="${-size*0.35}" r="${size*0.15}" fill="none" stroke="${palette.ink}" stroke-width="1.8"/>
      <path d="M ${-size*0.3} ${size*0.2} L ${-size*0.55} ${size*0.65} L ${-size*0.3} ${size*0.5} Z" fill="${palette.accent}"/>
      <path d="M ${size*0.3} ${size*0.2} L ${size*0.55} ${size*0.65} L ${size*0.3} ${size*0.5} Z" fill="${palette.accent}"/>
      <!-- flame -->
      <path d="M ${-size*0.18} ${size*0.5} Q ${-size*0.1} ${size*0.7}, 0 ${size*0.85} Q ${size*0.1} ${size*0.7}, ${size*0.18} ${size*0.5} Z" fill="#f5a838"/>
      <path d="M ${-size*0.1} ${size*0.5} Q 0 ${size*0.65}, ${size*0.1} ${size*0.5} Z" fill="#f5e8a8"/>
    </g>`,

  // Diana (target)
  target: (size = 100, palette) => `
    <g>
      <circle r="${size}" fill="${palette.accent2 || '#fff'}"/>
      <circle r="${size*0.78}" fill="#b3354c"/>
      <circle r="${size*0.56}" fill="${palette.accent2 || '#fff'}"/>
      <circle r="${size*0.34}" fill="#b3354c"/>
      <circle r="${size*0.15}" fill="${palette.accent2 || '#fff'}"/>
      <circle r="${size*0.05}" fill="#1a1a1a"/>
      <!-- arrow -->
      <g transform="translate(${size*0.6} ${-size*0.6}) rotate(45)">
        <line x1="${-size*0.9}" y1="0" x2="0" y2="0" stroke="${palette.ink}" stroke-width="3"/>
        <polygon points="0,0 ${-size*0.15},${-size*0.08} ${-size*0.15},${size*0.08}" fill="${palette.ink}"/>
        <path d="M ${-size*0.85} ${-size*0.07} L ${-size*0.95} 0 L ${-size*0.85} ${size*0.07}" fill="#b3354c"/>
      </g>
    </g>`,

  // Apretón de manos (silueta)
  handshake: (size = 120, palette) => `
    <g fill="${palette.accent}">
      <path d="M ${-size*0.9} 0
               L ${-size*0.35} ${-size*0.2}
               L ${-size*0.1} ${-size*0.05}
               L ${-size*0.05} ${size*0.1}
               L ${-size*0.4} ${size*0.3}
               L ${-size*0.9} ${size*0.2} Z"/>
      <path d="M ${size*0.9} 0
               L ${size*0.35} ${-size*0.2}
               L ${size*0.1} ${-size*0.05}
               L ${size*0.05} ${size*0.1}
               L ${size*0.4} ${size*0.3}
               L ${size*0.9} ${size*0.2} Z"/>
      <path d="M ${-size*0.1} ${-size*0.05} L ${size*0.1} ${-size*0.05} L ${size*0.05} ${size*0.1} L ${-size*0.05} ${size*0.1} Z" fill="${palette.ink}"/>
    </g>`,

  // Cordillera con capas degradadas, sombras laterales y nieve en los picos
  mountainsLayered: (palette) => {
    const u1 = _uid('mt-1'); const u2 = _uid('mt-2'); const u3 = _uid('mt-3'); const u4 = _uid('mt-4');
    const shadowTone = _mix(palette.bg[1] || '#1a1825', '#000', 0.5);
    const snowShadow = _mix('#ffffff', palette.bg[1] || '#3a4a5a', 0.45);
    // Casquete de nieve: lado iluminado (izq, blanco) y lado en sombra (der, gris azulado).
    const snow = (px, py, halfW, h, op = 0.9) => `
      <polygon points="${px-halfW},${py+h} ${px},${py} ${px+halfW},${py+h}" fill="#ffffff" opacity="${op}"/>
      <polygon points="${px},${py} ${px+halfW},${py+h} ${px},${py+h}" fill="${snowShadow}" opacity="${(op*0.85).toFixed(2)}"/>
    `;
    return `<g>
      <defs>
        <linearGradient id="${u1}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.mute || palette.bg[2], '#ffffff', 0.35)}"/>
          <stop offset="100%" stop-color="${palette.mute || palette.bg[2]}"/>
        </linearGradient>
        <linearGradient id="${u2}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.bg[2], '#ffffff', 0.25)}"/>
          <stop offset="100%" stop-color="${palette.bg[2]}"/>
        </linearGradient>
        <linearGradient id="${u3}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.bg[1], '#ffffff', 0.18)}"/>
          <stop offset="100%" stop-color="${palette.bg[1]}"/>
        </linearGradient>
        <linearGradient id="${u4}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${palette.bg[0]}"/>
          <stop offset="100%" stop-color="${_mix(palette.bg[0], '#000', 0.25)}"/>
        </linearGradient>
      </defs>
      <!-- Capa 1 (lejana, neblina atmosférica) -->
      <polygon points="-50,900 200,580 360,680 540,540 720,640 900,520 1080,620 1260,540 1480,620 1650,900" fill="url(#${u1})" opacity="0.55"/>
      <!-- Capa 2 -->
      <polygon points="-50,900 260,540 440,680 620,460 820,600 980,440 1180,580 1360,460 1650,580 1650,900" fill="url(#${u2})" opacity="0.8"/>
      <g fill="${shadowTone}" opacity="0.22">
        <polygon points="260,540 440,680 350,540"/>
        <polygon points="620,460 820,600 720,460"/>
        <polygon points="980,440 1180,580 1080,440"/>
        <polygon points="1360,460 1500,560 1430,460"/>
      </g>
      <!-- Capa 3 -->
      <polygon points="-50,900 320,500 520,680 720,420 920,600 1100,420 1300,580 1480,460 1650,560 1650,900" fill="url(#${u3})" opacity="0.9"/>
      <g fill="${shadowTone}" opacity="0.25">
        <polygon points="320,500 520,680 420,500"/>
        <polygon points="720,420 920,600 820,420"/>
        <polygon points="1100,420 1300,580 1200,420"/>
        <polygon points="1480,460 1650,560 1560,460"/>
      </g>
      <!-- Capa 4 (frontal, más oscura) -->
      <polygon points="-50,900 400,560 620,720 820,500 1020,640 1240,520 1480,640 1650,560 1650,900" fill="url(#${u4})" opacity="0.94"/>
      <g fill="${_mix(palette.bg[0], '#000', 0.4)}" opacity="0.28">
        <polygon points="400,560 620,720 510,560"/>
        <polygon points="820,500 1020,640 920,500"/>
        <polygon points="1240,520 1480,640 1360,520"/>
      </g>
    </g>`;
  },

  /* =====================================================
     FLORA (Rosa, Lirio)
     ===================================================== */

  rose: (size = 60, palette) => `
    <g fill="${palette.accent}">
      <path d="M 0 0 C ${-size*0.4} ${-size*0.18}, ${-size*0.65} ${-size*0.55}, ${-size*0.3} ${-size*0.85} C 0 ${-size}, ${size*0.35} ${-size*0.85}, ${size*0.3} ${-size*0.4} Z"/>
      <path d="M 0 0 C ${size*0.4} ${-size*0.18}, ${size*0.65} ${-size*0.55}, ${size*0.3} ${-size*0.85} C 0 ${-size}, ${-size*0.35} ${-size*0.85}, ${-size*0.3} ${-size*0.4} Z" opacity="0.92"/>
      <path d="M 0 0 C ${-size*0.55} ${size*0.18}, ${-size*0.85} ${size*0.55}, ${-size*0.4} ${size*0.95} C ${-size*0.08} ${size*1.15}, ${size*0.28} ${size*0.95}, ${size*0.18} ${size*0.55} Z" fill="${palette.ink}" opacity="0.78"/>
      <path d="M 0 0 C ${size*0.55} ${size*0.18}, ${size*0.85} ${size*0.55}, ${size*0.4} ${size*0.95} C ${size*0.08} ${size*1.15}, ${-size*0.28} ${size*0.95}, ${-size*0.18} ${size*0.55} Z" fill="${palette.ink}" opacity="0.78"/>
      <circle r="${size*0.18}" fill="${palette.bg[0]}" opacity="0.35"/>
    </g>`,

  lily: (size = 100, fill = '#fff8f5') => `
    <g fill="${fill}">
      <path d="M0 ${size*0.6} C ${-size*0.4} ${size*0.3}, ${-size*0.9} ${-size*0.1}, ${-size*0.8} ${-size*0.8}
               C ${-size*0.6} ${-size*0.5}, ${-size*0.3} ${-size*0.3}, ${-size*0.1} ${-size*0.2}
               C 0 ${-size*0.1}, 0 0, 0 ${size*0.6} Z"/>
      <path d="M0 ${size*0.6} C ${size*0.4} ${size*0.3}, ${size*0.9} ${-size*0.1}, ${size*0.8} ${-size*0.8}
               C ${size*0.6} ${-size*0.5}, ${size*0.3} ${-size*0.3}, ${size*0.1} ${-size*0.2}
               C 0 ${-size*0.1}, 0 0, 0 ${size*0.6} Z"/>
      <path d="M0 ${size*0.5} C ${-size*0.2} ${size*0.2}, ${-size*0.4} ${-size*0.4}, 0 ${-size*0.9}
               C ${size*0.4} ${-size*0.4}, ${size*0.2} ${size*0.2}, 0 ${size*0.5} Z" opacity="0.92"/>
      <ellipse cx="${-size*0.06}" cy="${-size*0.45}" rx="${size*0.025}" ry="${size*0.1}" fill="#c89a48"/>
      <ellipse cx="${size*0.06}" cy="${-size*0.45}" rx="${size*0.025}" ry="${size*0.1}" fill="#c89a48"/>
      <ellipse cx="0" cy="${-size*0.5}" rx="${size*0.018}" ry="${size*0.08}" fill="#c89a48"/>
    </g>`,

  // Casa de pueblo (Villa)
  cottage: (palette, scale = 1) => `
    <g transform="scale(${scale})">
      <rect x="-50" y="0" width="100" height="80" fill="${palette.bg[0]}"/>
      <polygon points="-58,0 0,-50 58,0" fill="${palette.accent}"/>
      <rect x="-14" y="30" width="28" height="50" fill="${palette.ink}"/>
      <rect x="-40" y="14" width="20" height="20" fill="${palette.accent2}"/>
      <rect x="20" y="14" width="20" height="20" fill="${palette.accent2}"/>
      <rect x="20" y="-30" width="8" height="20" fill="${palette.ink}" opacity="0.65"/>
    </g>`,

  /* =====================================================
     ████████  INFORMÁTICA + HISTORIA (para Leo)  ████████
     ===================================================== */

  // Laptop moderna con pantalla organizada (código indentado limpio)
  laptop: (size = 200, palette) => {
    const ub = _uid('lp-b'); const us = _uid('lp-s'); const usc = _uid('lp-sc');
    // Paleta de sintaxis
    const C = {
      kw: '#c678dd',          // keywords (purple)
      fn: palette.accent2,    // function names
      str: '#98c379',         // strings (green)
      num: '#e5c07b',         // numbers (orange)
      var: '#56b6c2',         // variables (cyan)
      pun: '#abb2bf',         // punctuation (gray)
      com: '#7a8a6a'          // comments (muted green)
    };
    // Estructura de líneas de código (indent en niveles 0-2; segs = [color, width])
    const lines = [
      { ind: 0, segs: [[C.kw, 0.06], [C.fn, 0.1], [C.pun, 0.02], [C.var, 0.05], [C.pun, 0.02]] },
      { ind: 1, segs: [[C.com, 0.22]] },
      { ind: 1, segs: [[C.kw, 0.05], [C.var, 0.07], [C.pun, 0.02], [C.num, 0.04]] },
      { ind: 1, segs: [[C.kw, 0.06], [C.fn, 0.07], [C.pun, 0.02], [C.str, 0.13]] },
      { ind: 2, segs: [[C.var, 0.06], [C.pun, 0.02], [C.fn, 0.08], [C.pun, 0.02]] },
      { ind: 1, segs: [[C.kw, 0.05], [C.var, 0.06]] },
      { ind: 0, segs: [[C.pun, 0.02]] }
    ];
    return `<g>
      <defs>
        <linearGradient id="${ub}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#5a5a5e"/>
          <stop offset="50%" stop-color="#3a3a3e"/>
          <stop offset="100%" stop-color="#1a1a1e"/>
        </linearGradient>
        <linearGradient id="${us}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#7a7a7e"/>
          <stop offset="100%" stop-color="#2a2a2e"/>
        </linearGradient>
        <linearGradient id="${usc}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e2230"/>
          <stop offset="100%" stop-color="#161821"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.42, size*0.65, size*0.04, 0.5)}
      <!-- screen lid -->
      <path d="M ${-size*0.62} ${-size*0.5} L ${size*0.62} ${-size*0.5} L ${size*0.58} ${size*0.18} L ${-size*0.58} ${size*0.18} Z" fill="url(#${us})"/>
      <!-- inner screen frame -->
      <path d="M ${-size*0.58} ${-size*0.46} L ${size*0.58} ${-size*0.46} L ${size*0.55} ${size*0.14} L ${-size*0.55} ${size*0.14} Z" fill="#0a0a0e"/>
      <!-- screen content -->
      <path d="M ${-size*0.55} ${-size*0.43} L ${size*0.55} ${-size*0.43} L ${size*0.52} ${size*0.11} L ${-size*0.52} ${size*0.11} Z" fill="url(#${usc})"/>
      <!-- title bar -->
      <path d="M ${-size*0.55} ${-size*0.43} L ${size*0.55} ${-size*0.43} L ${size*0.546} ${-size*0.39} L ${-size*0.546} ${-size*0.39} Z" fill="#0a0e16"/>
      <circle cx="${-size*0.5}" cy="${-size*0.41}" r="${size*0.011}" fill="#ff5a5a"/>
      <circle cx="${-size*0.46}" cy="${-size*0.41}" r="${size*0.011}" fill="#f5c842"/>
      <circle cx="${-size*0.42}" cy="${-size*0.41}" r="${size*0.011}" fill="#5ad88a"/>
      <text x="0" y="${-size*0.4}" text-anchor="middle" font-family="monospace" font-size="${size*0.022}" fill="#8a92a8">app.js</text>
      <!-- columna de números de línea -->
      <rect x="${-size*0.55}" y="${-size*0.38}" width="${size*0.045}" height="${size*0.48}" fill="#11141d" opacity="0.85"/>
      <!-- líneas de código organizadas con indentación -->
      ${(() => {
        let s = '';
        const left0 = -size*0.5;
        const indentW = size*0.025;
        const gap = size*0.012;
        const lineH = size*0.062;
        for (let i = 0; i < lines.length; i++) {
          const y = -size*0.34 + i * lineH;
          // número de línea
          s += `<text x="${(-size*0.535).toFixed(2)}" y="${(y + size*0.016).toFixed(2)}" font-family="monospace" font-size="${(size*0.022).toFixed(2)}" fill="#4a5266" opacity="0.85">${i+1}</text>`;
          let x = left0 + lines[i].ind * indentW;
          for (const [col, w] of lines[i].segs) {
            s += `<rect x="${x.toFixed(2)}" y="${(y + size*0.008).toFixed(2)}" width="${(size*w).toFixed(2)}" height="${(size*0.022).toFixed(2)}" rx="${(size*0.004).toFixed(2)}" fill="${col}" opacity="0.92"/>`;
            x += size*w + gap;
          }
        }
        // cursor parpadeante al final del último renglón visible
        s += `<rect x="${(left0).toFixed(2)}" y="${(-size*0.34 + lines.length * lineH + size*0.008).toFixed(2)}" width="${(size*0.011).toFixed(2)}" height="${(size*0.022).toFixed(2)}" fill="${palette.accent2}" opacity="0.95"/>`;
        return s;
      })()}
      <!-- screen reflection -->
      <path d="M ${-size*0.55} ${-size*0.43} L ${-size*0.18} ${-size*0.43} L ${-size*0.48} ${size*0.05} L ${-size*0.55} ${size*0.05} Z" fill="#ffffff" opacity="0.05"/>
      <!-- camera notch -->
      <circle cx="0" cy="${-size*0.475}" r="${size*0.008}" fill="#000"/>
      <!-- hinge -->
      <rect x="${-size*0.6}" y="${size*0.18}" width="${size*1.2}" height="${size*0.025}" fill="${_mix('#3a3a3e', '#000', 0.3)}"/>
      <!-- bottom chassis -->
      <path d="M ${-size*0.7} ${size*0.205} L ${size*0.7} ${size*0.205} L ${size*0.78} ${size*0.5} L ${-size*0.78} ${size*0.5} Z" fill="url(#${ub})"/>
      <path d="M ${-size*0.7} ${size*0.205} L ${size*0.7} ${size*0.205} L ${size*0.69} ${size*0.22} L ${-size*0.69} ${size*0.22} Z" fill="#ffffff" opacity="0.25"/>
      <path d="M ${-size*0.78} ${size*0.5} L ${size*0.78} ${size*0.5} L ${size*0.8} ${size*0.54} L ${-size*0.8} ${size*0.54} Z" fill="#000" opacity="0.55"/>
      <!-- keyboard well -->
      <path d="M ${-size*0.58} ${size*0.25} L ${size*0.58} ${size*0.25} L ${size*0.63} ${size*0.43} L ${-size*0.63} ${size*0.43} Z" fill="#0e0e12"/>
      ${(() => {
        let s = '';
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 12; c++) {
            const x = -size*0.55 + c * size*0.092 + r * size*0.008;
            const y = size*0.265 + r * size*0.05;
            s += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(size*0.078).toFixed(2)}" height="${(size*0.038).toFixed(2)}" rx="${(size*0.006).toFixed(2)}" fill="${_mix(palette.bg[0], '#000', 0.45)}"/>`;
            s += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(size*0.078).toFixed(2)}" height="${(size*0.01).toFixed(2)}" rx="${(size*0.003).toFixed(2)}" fill="#ffffff" opacity="0.18"/>`;
          }
        }
        s += `<rect x="${-size*0.16}" y="${size*0.43}" width="${size*0.32}" height="${size*0.045}" rx="${size*0.006}" fill="${_mix(palette.bg[0], '#000', 0.55)}"/>`;
        s += `<rect x="${-size*0.16}" y="${size*0.43}" width="${size*0.32}" height="${size*0.008}" fill="#ffffff" opacity="0.15"/>`;
        return s;
      })()}
    </g>`;
  },

  // Computador antiguo CRT (Apple II / IBM PC style — historia de la informática)
  vintageComputer: (size = 180, palette) => {
    const ucase = _uid('vc-c'); const ucrt = _uid('vc-s');
    const cream = '#d8c8a8';
    return `<g>
      <defs>
        <linearGradient id="${ucase}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(cream, '#ffffff', 0.2)}"/>
          <stop offset="50%" stop-color="${cream}"/>
          <stop offset="100%" stop-color="${_mix(cream, '#000', 0.3)}"/>
        </linearGradient>
        <radialGradient id="${ucrt}" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="#1a3a1a"/>
          <stop offset="70%" stop-color="#0a1a0a"/>
          <stop offset="100%" stop-color="#000"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.62, size*0.55, size*0.04, 0.45)}
      <!-- monitor case (chunky CRT) -->
      <rect x="${-size*0.55}" y="${-size*0.55}" width="${size*1.1}" height="${size*0.85}" rx="${size*0.04}" fill="url(#${ucase})"/>
      <rect x="${-size*0.55}" y="${-size*0.55}" width="${size*1.1}" height="${size*0.04}" fill="#ffffff" opacity="0.3"/>
      <!-- CRT screen (curved rectangle) -->
      <path d="M ${-size*0.42} ${-size*0.42}
               Q ${-size*0.42} ${-size*0.48}, ${-size*0.35} ${-size*0.48}
               L ${size*0.35} ${-size*0.48}
               Q ${size*0.42} ${-size*0.48}, ${size*0.42} ${-size*0.42}
               L ${size*0.42} ${size*0.08}
               Q ${size*0.42} ${size*0.14}, ${size*0.35} ${size*0.14}
               L ${-size*0.35} ${size*0.14}
               Q ${-size*0.42} ${size*0.14}, ${-size*0.42} ${size*0.08} Z" fill="#0a0a0a"/>
      <path d="M ${-size*0.38} ${-size*0.38}
               Q ${-size*0.38} ${-size*0.44}, ${-size*0.32} ${-size*0.44}
               L ${size*0.32} ${-size*0.44}
               Q ${size*0.38} ${-size*0.44}, ${size*0.38} ${-size*0.38}
               L ${size*0.38} ${size*0.04}
               Q ${size*0.38} ${size*0.1}, ${size*0.32} ${size*0.1}
               L ${-size*0.32} ${size*0.1}
               Q ${-size*0.38} ${size*0.1}, ${-size*0.38} ${size*0.04} Z" fill="url(#${ucrt})"/>
      <!-- green phosphor text lines -->
      <text x="${-size*0.34}" y="${-size*0.33}" font-family="monospace" font-size="${size*0.04}" fill="#5ad88a" opacity="0.9">&gt; RUN</text>
      <text x="${-size*0.34}" y="${-size*0.23}" font-family="monospace" font-size="${size*0.04}" fill="#5ad88a" opacity="0.9">READY.</text>
      <text x="${-size*0.34}" y="${-size*0.13}" font-family="monospace" font-size="${size*0.04}" fill="#5ad88a" opacity="0.9">10 PRINT</text>
      <text x="${-size*0.34}" y="${-size*0.03}" font-family="monospace" font-size="${size*0.04}" fill="#5ad88a" opacity="0.8">20 GOTO 10</text>
      <rect x="${-size*0.34}" y="${size*0.02}" width="${size*0.04}" height="${size*0.04}" fill="#5ad88a"/>
      <!-- CRT scanlines -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 14; i++) {
          const y = -size*0.42 + i * size*0.04;
          s += `<line x1="${-size*0.38}" y1="${y.toFixed(2)}" x2="${size*0.38}" y2="${y.toFixed(2)}" stroke="#000" stroke-width="${size*0.003}" opacity="0.35"/>`;
        }
        return s;
      })()}
      <!-- screen reflection -->
      <path d="M ${-size*0.38} ${-size*0.44} L ${-size*0.1} ${-size*0.44} L ${-size*0.32} ${size*0.05} L ${-size*0.38} ${size*0.05} Z" fill="#ffffff" opacity="0.08"/>
      <!-- monitor brand badge -->
      <rect x="${-size*0.18}" y="${size*0.18}" width="${size*0.36}" height="${size*0.04}" rx="${size*0.005}" fill="${_mix(cream, '#000', 0.4)}"/>
      <text x="0" y="${size*0.21}" text-anchor="middle" font-family="Inter, sans-serif" font-size="${size*0.025}" font-weight="700" fill="${cream}" letter-spacing="2">RETRO</text>
      <!-- LEDs -->
      <circle cx="${size*0.36}" cy="${size*0.2}" r="${size*0.008}" fill="#5ad88a"/>
      <circle cx="${size*0.36}" cy="${size*0.2}" r="${size*0.018}" fill="#5ad88a" opacity="0.3" filter="url(#ds-glow-sm)"/>
      <!-- vent slots -->
      <g fill="${_mix(cream, '#000', 0.5)}">
        ${(() => { let s=''; for (let i=0;i<5;i++) s += `<rect x="${(size*0.42 + i*size*0.025).toFixed(2)}" y="${-size*0.3}" width="${size*0.012}" height="${size*0.45}" rx="${size*0.003}"/>`; return s; })()}
      </g>
      <!-- base / floppy drive -->
      <rect x="${-size*0.45}" y="${size*0.3}" width="${size*0.9}" height="${size*0.22}" rx="${size*0.02}" fill="${_mix(cream, '#000', 0.15)}"/>
      <rect x="${-size*0.45}" y="${size*0.3}" width="${size*0.9}" height="${size*0.025}" fill="#ffffff" opacity="0.2"/>
      <!-- floppy slot -->
      <rect x="${-size*0.32}" y="${size*0.36}" width="${size*0.3}" height="${size*0.04}" rx="${size*0.005}" fill="#1a1a1e"/>
      <rect x="${-size*0.3}" y="${size*0.37}" width="${size*0.05}" height="${size*0.022}" fill="${_mix(cream, '#000', 0.3)}"/>
      <!-- power button -->
      <circle cx="${size*0.25}" cy="${size*0.41}" r="${size*0.018}" fill="${_mix(cream, '#000', 0.4)}"/>
      <circle cx="${size*0.25}" cy="${size*0.41}" r="${size*0.012}" fill="${_mix(cream, '#ffffff', 0.3)}"/>
    </g>`;
  },

  // Diskette 3.5"
  floppyDisk: (size = 100, palette) => {
    const uf = _uid('fp-f');
    return `<g>
      <defs>
        <linearGradient id="${uf}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.accent, '#ffffff', 0.15)}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent, '#000', 0.35)}"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.82, size*0.5, size*0.04, 0.4)}
      <!-- body -->
      <rect x="${-size*0.8}" y="${-size*0.8}" width="${size*1.6}" height="${size*1.6}" rx="${size*0.04}" fill="url(#${uf})"/>
      <rect x="${-size*0.8}" y="${-size*0.8}" width="${size*1.6}" height="${size*0.06}" fill="#ffffff" opacity="0.2"/>
      <!-- metal slider -->
      <rect x="${-size*0.45}" y="${-size*0.76}" width="${size*0.9}" height="${size*0.5}" rx="${size*0.015}" fill="#c8c8d2"/>
      <rect x="${-size*0.45}" y="${-size*0.76}" width="${size*0.9}" height="${size*0.06}" fill="#ffffff" opacity="0.55"/>
      <rect x="${-size*0.45}" y="${-size*0.32}" width="${size*0.9}" height="${size*0.06}" fill="#666"/>
      <!-- slider notch (window) -->
      <rect x="${-size*0.15}" y="${-size*0.65}" width="${size*0.4}" height="${size*0.3}" rx="${size*0.01}" fill="${_mix('#c8c8d2','#000',0.5)}"/>
      <rect x="${size*0.15}" y="${-size*0.6}" width="${size*0.1}" height="${size*0.2}" fill="${_mix('#c8c8d2','#ffffff',0.1)}"/>
      <!-- label area -->
      <rect x="${-size*0.62}" y="${-size*0.1}" width="${size*1.24}" height="${size*0.6}" rx="${size*0.015}" fill="${palette.accent2 || '#fff8f0'}"/>
      <rect x="${-size*0.62}" y="${-size*0.1}" width="${size*1.24}" height="${size*0.08}" fill="${_mix(palette.accent2 || '#fff', '#000', 0.1)}"/>
      <line x1="${-size*0.55}" y1="${size*0.08}" x2="${size*0.4}" y2="${size*0.08}" stroke="${palette.ink}" stroke-width="${size*0.025}" opacity="0.6"/>
      <line x1="${-size*0.55}" y1="${size*0.18}" x2="${size*0.55}" y2="${size*0.18}" stroke="${palette.ink}" stroke-width="${size*0.025}" opacity="0.45"/>
      <line x1="${-size*0.55}" y1="${size*0.28}" x2="${size*0.25}" y2="${size*0.28}" stroke="${palette.ink}" stroke-width="${size*0.025}" opacity="0.45"/>
      <line x1="${-size*0.55}" y1="${size*0.38}" x2="${size*0.45}" y2="${size*0.38}" stroke="${palette.ink}" stroke-width="${size*0.025}" opacity="0.3"/>
      <!-- write-protect tab -->
      <rect x="${size*0.65}" y="${-size*0.55}" width="${size*0.12}" height="${size*0.15}" rx="${size*0.012}" fill="${_mix(palette.accent, '#000', 0.5)}"/>
      <rect x="${size*0.67}" y="${-size*0.52}" width="${size*0.06}" height="${size*0.07}" rx="${size*0.005}" fill="${_mix(palette.accent, '#000', 0.7)}"/>
      <!-- corner notch -->
      <path d="M ${size*0.8} ${size*0.55} L ${size*0.55} ${size*0.55} L ${size*0.55} ${size*0.8} Z" fill="${_mix(palette.accent, '#000', 0.55)}"/>
    </g>`;
  },

  // CD / DVD con reflejos iridiscentes
  cdDisc: (size = 100, palette) => {
    const ucd = _uid('cd-c');
    return `<g>
      <defs>
        <radialGradient id="${ucd}" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stop-color="#e8e8f0"/>
          <stop offset="50%" stop-color="#a8b8d8"/>
          <stop offset="100%" stop-color="#5a6a8a"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*0.05, size*0.5, size*0.04, 0.4)}
      <circle r="${size}" fill="url(#${ucd})"/>
      <!-- iridescent ring -->
      <g opacity="0.55">
        <path d="M ${-size*0.85} ${-size*0.45} A ${size} ${size} 0 0 1 ${size*0.85} ${-size*0.45}" stroke="#ff6a6a" stroke-width="${size*0.08}" fill="none"/>
        <path d="M ${-size*0.9} ${-size*0.38} A ${size} ${size} 0 0 1 ${size*0.9} ${-size*0.38}" stroke="#f5c842" stroke-width="${size*0.06}" fill="none" opacity="0.7"/>
        <path d="M ${-size*0.92} ${-size*0.3} A ${size} ${size} 0 0 1 ${size*0.92} ${-size*0.3}" stroke="#5ad8a8" stroke-width="${size*0.05}" fill="none" opacity="0.7"/>
        <path d="M ${size*0.9} ${size*0.4} A ${size} ${size} 0 0 1 ${-size*0.9} ${size*0.4}" stroke="#7a8aff" stroke-width="${size*0.07}" fill="none" opacity="0.7"/>
        <path d="M ${size*0.86} ${size*0.45} A ${size} ${size} 0 0 1 ${-size*0.86} ${size*0.45}" stroke="#c678dd" stroke-width="${size*0.05}" fill="none" opacity="0.65"/>
      </g>
      <!-- tracks (faint concentric rings) -->
      <circle r="${size*0.85}" fill="none" stroke="#ffffff" stroke-width="${size*0.003}" opacity="0.3"/>
      <circle r="${size*0.7}" fill="none" stroke="#ffffff" stroke-width="${size*0.003}" opacity="0.25"/>
      <circle r="${size*0.55}" fill="none" stroke="#ffffff" stroke-width="${size*0.003}" opacity="0.25"/>
      <circle r="${size*0.4}" fill="none" stroke="#ffffff" stroke-width="${size*0.003}" opacity="0.25"/>
      <!-- inner clear area -->
      <circle r="${size*0.25}" fill="${palette.bg[0]}" opacity="0.85"/>
      <circle r="${size*0.25}" fill="none" stroke="${palette.ink}" stroke-width="${size*0.01}" opacity="0.55"/>
      <!-- hub hole -->
      <circle r="${size*0.1}" fill="${palette.bg[1]}"/>
      <circle r="${size*0.1}" fill="none" stroke="${palette.ink}" stroke-width="${size*0.01}"/>
      <!-- specular highlight arc -->
      <path d="M ${-size*0.65} ${-size*0.55} A ${size} ${size} 0 0 1 ${size*0.55} ${-size*0.65}" stroke="#ffffff" stroke-width="${size*0.025}" fill="none" opacity="0.85" stroke-linecap="round"/>
    </g>`;
  },

  // Astrolabio (instrumento histórico de navegación)
  astrolabe: (size = 130, palette) => {
    const ub = _uid('as-b');
    return `<g>
      <defs>
        <radialGradient id="${ub}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#f5d76e"/>
          <stop offset="60%" stop-color="#b08628"/>
          <stop offset="100%" stop-color="#5a3a14"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*1.1, size*0.4, size*0.04, 0.4)}
      <!-- suspension ring -->
      <circle cx="0" cy="${-size*1.08}" r="${size*0.06}" fill="none" stroke="url(#${ub})" stroke-width="${size*0.025}"/>
      <line x1="0" y1="${-size*1.02}" x2="0" y2="${-size}" stroke="${_mix('#b08628', '#000', 0.3)}" stroke-width="${size*0.015}"/>
      <!-- outer rim -->
      <circle r="${size}" fill="url(#${ub})"/>
      <circle r="${size}" fill="none" stroke="${_mix('#b08628', '#000', 0.4)}" stroke-width="${size*0.018}"/>
      <!-- engraved scale ring -->
      <circle r="${size*0.92}" fill="${_mix('#5a3a14', '#000', 0.25)}"/>
      ${(() => {
        let s = '';
        for (let i = 0; i < 36; i++) {
          const a = (i * 10) * Math.PI / 180;
          const long = i % 3 === 0;
          const r1 = long ? size*0.84 : size*0.88;
          const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1;
          const x2 = Math.cos(a) * size*0.92, y2 = Math.sin(a) * size*0.92;
          s += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${_mix('#f5d76e', '#000', 0.5)}" stroke-width="${(size*0.008).toFixed(2)}"/>`;
        }
        return s;
      })()}
      <!-- inner plate -->
      <circle r="${size*0.8}" fill="${_mix('#b08628', '#000', 0.15)}"/>
      <circle r="${size*0.8}" fill="none" stroke="${_mix('#b08628', '#000', 0.4)}" stroke-width="${size*0.01}"/>
      <!-- celestial circles -->
      <circle r="${size*0.65}" fill="none" stroke="${_mix('#f5d76e', '#000', 0.5)}" stroke-width="${size*0.008}"/>
      <circle r="${size*0.45}" fill="none" stroke="${_mix('#f5d76e', '#000', 0.5)}" stroke-width="${size*0.008}"/>
      <circle r="${size*0.25}" fill="none" stroke="${_mix('#f5d76e', '#000', 0.5)}" stroke-width="${size*0.008}"/>
      <!-- horizon lines -->
      <line x1="${-size*0.78}" y1="0" x2="${size*0.78}" y2="0" stroke="${_mix('#f5d76e', '#000', 0.5)}" stroke-width="${size*0.008}"/>
      <line x1="0" y1="${-size*0.78}" x2="0" y2="${size*0.78}" stroke="${_mix('#f5d76e', '#000', 0.5)}" stroke-width="${size*0.008}"/>
      <!-- ecliptic (rotated) -->
      <ellipse rx="${size*0.55}" ry="${size*0.25}" fill="none" stroke="${_mix('#f5d76e', '#000', 0.4)}" stroke-width="${size*0.012}" transform="rotate(-20)"/>
      <!-- rule (alidade) -->
      <rect x="${-size*0.92}" y="${-size*0.02}" width="${size*1.84}" height="${size*0.04}" rx="${size*0.008}" fill="url(#${ub})" transform="rotate(25)"/>
      <rect x="${-size*0.92}" y="${-size*0.012}" width="${size*1.84}" height="${size*0.01}" fill="#ffffff" opacity="0.5" transform="rotate(25)"/>
      <polygon points="${-size*0.92},0 ${-size*0.85},-${size*0.05} ${-size*0.85},${size*0.05}" fill="${_mix('#b08628', '#000', 0.3)}" transform="rotate(25)"/>
      <polygon points="${size*0.92},0 ${size*0.85},-${size*0.05} ${size*0.85},${size*0.05}" fill="${_mix('#b08628', '#000', 0.3)}" transform="rotate(25)"/>
      <!-- central rivet -->
      <circle r="${size*0.05}" fill="${_mix('#b08628', '#000', 0.5)}"/>
      <circle r="${size*0.025}" fill="${_mix('#f5d76e', '#ffffff', 0.4)}"/>
      <!-- stars on plate -->
      <circle cx="${size*0.35}" cy="${-size*0.3}" r="${size*0.018}" fill="#fff"/>
      <circle cx="${-size*0.25}" cy="${-size*0.4}" r="${size*0.014}" fill="#fff"/>
      <circle cx="${-size*0.4}" cy="${size*0.2}" r="${size*0.012}" fill="#fff"/>
      <!-- specular highlight on body -->
      <path d="M ${-size*0.7} ${-size*0.7} A ${size} ${size} 0 0 1 ${size*0.5} ${-size*0.85}" stroke="#ffffff" stroke-width="${size*0.025}" fill="none" opacity="0.5" stroke-linecap="round"/>
    </g>`;
  },

  // Reloj de bolsillo antiguo (historia + tiempo)
  oldClock: (size = 100, palette) => {
    const uc = _uid('ck-c'); const ud = _uid('ck-d');
    return `<g>
      <defs>
        <radialGradient id="${uc}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff4c4"/>
          <stop offset="60%" stop-color="#f5c842"/>
          <stop offset="100%" stop-color="#8a6322"/>
        </radialGradient>
        <radialGradient id="${ud}" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="${_mix(palette.accent2 || '#fff8e8', '#000', 0.02)}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent2 || '#fff8e8', '#000', 0.2)}"/>
        </radialGradient>
      </defs>
      ${_contactShadow(size*1.1, size*0.4, size*0.04, 0.4)}
      <!-- chain -->
      <path d="M 0 ${-size*1.05} Q ${-size*0.15} ${-size*1.25}, ${-size*0.3} ${-size*1.1} Q ${-size*0.45} ${-size*0.95}, ${-size*0.55} ${-size*1.2}" stroke="${_mix('#f5c842', '#000', 0.3)}" stroke-width="${size*0.04}" fill="none" stroke-linecap="round"/>
      <path d="M 0 ${-size*1.05} Q ${-size*0.15} ${-size*1.25}, ${-size*0.3} ${-size*1.1} Q ${-size*0.45} ${-size*0.95}, ${-size*0.55} ${-size*1.2}" stroke="#ffffff" stroke-width="${size*0.012}" fill="none" opacity="0.5" stroke-linecap="round"/>
      <!-- crown / winding stem -->
      <rect x="${-size*0.05}" y="${-size*1.1}" width="${size*0.1}" height="${size*0.12}" rx="${size*0.015}" fill="url(#${uc})"/>
      <rect x="${-size*0.05}" y="${-size*1.1}" width="${size*0.1}" height="${size*0.03}" fill="#ffffff" opacity="0.4"/>
      <circle cx="0" cy="${-size*1.05}" r="${size*0.07}" fill="url(#${uc})"/>
      <circle cx="0" cy="${-size*1.05}" r="${size*0.03}" fill="${_mix('#8a6322', '#000', 0.2)}"/>
      <!-- case -->
      <circle r="${size}" fill="url(#${uc})"/>
      <circle r="${size}" fill="none" stroke="${_mix('#8a6322', '#000', 0.3)}" stroke-width="${size*0.025}"/>
      <circle r="${size*0.94}" fill="none" stroke="${_mix('#f5c842', '#000', 0.5)}" stroke-width="${size*0.008}"/>
      <!-- dial -->
      <circle r="${size*0.85}" fill="url(#${ud})"/>
      <circle r="${size*0.85}" fill="none" stroke="${_mix('#8a6322', '#000', 0.4)}" stroke-width="${size*0.012}"/>
      <!-- Roman numerals (rendered as actual roman numerals positioned around dial) -->
      ${(() => {
        const numerals = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
        let s = '';
        for (let i = 0; i < 12; i++) {
          const a = (i * 30 - 90) * Math.PI / 180;
          const x = Math.cos(a) * size * 0.7;
          const y = Math.sin(a) * size * 0.7;
          s += `<text x="${x.toFixed(2)}" y="${(y + size*0.04).toFixed(2)}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="${(size*0.12).toFixed(2)}" font-weight="600" fill="${_mix('#3a2814', '#000', 0.3)}">${numerals[i]}</text>`;
        }
        return s;
      })()}
      <!-- minute marks -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 60; i++) {
          if (i % 5 === 0) continue;
          const a = (i * 6 - 90) * Math.PI / 180;
          const x1 = Math.cos(a) * size * 0.82, y1 = Math.sin(a) * size * 0.82;
          const x2 = Math.cos(a) * size * 0.86, y2 = Math.sin(a) * size * 0.86;
          s += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${_mix('#3a2814', '#000', 0.3)}" stroke-width="${(size*0.005).toFixed(2)}"/>`;
        }
        return s;
      })()}
      <!-- hour hand (at 10:10 classic showcase position) -->
      <g transform="rotate(-60)">
        <path d="M 0 ${size*0.08} L ${size*0.025} ${size*0.04} L ${size*0.025} ${-size*0.45} L 0 ${-size*0.5} L ${-size*0.025} ${-size*0.45} L ${-size*0.025} ${size*0.04} Z" fill="${_mix('#3a2814', '#000', 0.4)}"/>
        <line x1="0" y1="0" x2="0" y2="${-size*0.45}" stroke="#ffffff" stroke-width="${size*0.006}" opacity="0.45"/>
      </g>
      <!-- minute hand -->
      <g transform="rotate(60)">
        <path d="M 0 ${size*0.08} L ${size*0.02} ${size*0.04} L ${size*0.02} ${-size*0.68} L 0 ${-size*0.72} L ${-size*0.02} ${-size*0.68} L ${-size*0.02} ${size*0.04} Z" fill="${_mix('#3a2814', '#000', 0.4)}"/>
      </g>
      <!-- second hand -->
      <line x1="0" y1="${size*0.18}" x2="0" y2="${-size*0.65}" stroke="${_mix('#b3354c', '#000', 0.1)}" stroke-width="${size*0.012}" stroke-linecap="round" transform="rotate(20)"/>
      <!-- center cap -->
      <circle r="${size*0.05}" fill="${_mix('#8a6322', '#000', 0.4)}"/>
      <circle r="${size*0.025}" fill="${_mix('#f5c842', '#ffffff', 0.3)}"/>
      <!-- shine -->
      <path d="M ${-size*0.7} ${-size*0.6} A ${size*0.85} ${size*0.85} 0 0 1 ${size*0.4} ${-size*0.75}" stroke="#ffffff" stroke-width="${size*0.04}" fill="none" opacity="0.4" stroke-linecap="round"/>
      <path d="M ${-size*0.65} ${-size*0.5} A ${size*0.85} ${size*0.85} 0 0 1 ${size*0.3} ${-size*0.78}" stroke="#ffffff" stroke-width="${size*0.012}" fill="none" opacity="0.85" stroke-linecap="round"/>
    </g>`;
  },

  // Tarjeta perforada (Hollerith — historia de la informática)
  punchCard: (size = 180, palette) => {
    const uc = _uid('pc-c');
    return `<g>
      <defs>
        <linearGradient id="${uc}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${_mix(palette.accent2 || '#f5e8c8', '#ffffff', 0.1)}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent2 || '#f5e8c8', '#000', 0.15)}"/>
        </linearGradient>
      </defs>
      ${_contactShadow(size*0.4, size*0.45, size*0.04, 0.3)}
      <!-- card body -->
      <path d="M ${-size*0.65} ${-size*0.35} L ${size*0.55} ${-size*0.35} L ${size*0.65} ${-size*0.25} L ${size*0.65} ${size*0.35} L ${-size*0.65} ${size*0.35} Z" fill="url(#${uc})" stroke="${_mix(palette.ink, '#000', 0.2)}" stroke-width="${size*0.005}"/>
      <!-- cut corner highlight -->
      <line x1="${size*0.55}" y1="${-size*0.35}" x2="${size*0.65}" y2="${-size*0.25}" stroke="${_mix(palette.ink, '#000', 0.3)}" stroke-width="${size*0.008}"/>
      <!-- column numbers row -->
      ${(() => {
        let s = '';
        for (let c = 0; c < 20; c++) {
          const x = -size*0.6 + c * size*0.062;
          s += `<text x="${x.toFixed(2)}" y="${-size*0.26}" font-family="monospace" font-size="${size*0.04}" fill="${palette.ink}" opacity="0.55">${c+1}</text>`;
        }
        return s;
      })()}
      <!-- punch holes pattern -->
      ${(() => {
        let s = '';
        const holes = [
          [0,2],[1,5],[2,1],[3,8],[4,3],[5,6],[6,0],[7,4],[8,7],[9,2],
          [10,5],[11,1],[12,8],[13,3],[14,6],[15,0],[16,4],[17,7],[18,2],[19,5],
          [2,7],[5,3],[8,1],[11,6],[14,4],[17,8]
        ];
        for (const [c, r] of holes) {
          const x = -size*0.59 + c * size*0.062;
          const y = -size*0.18 + r * size*0.058;
          s += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(size*0.04).toFixed(2)}" height="${(size*0.03).toFixed(2)}" rx="${(size*0.005).toFixed(2)}" fill="#0a0a0a" opacity="0.85"/>`;
        }
        return s;
      })()}
      <!-- printed text at top -->
      <text x="${-size*0.6}" y="${-size*0.3}" font-family="monospace" font-size="${size*0.035}" fill="${palette.ink}" opacity="0.6">PROGRAM CARD</text>
    </g>`;
  },

  // Pluma y tintero estilizado (historia de la escritura → informática)
  scrollWithBinary: (size = 140, palette) => {
    return `<g>
      <!-- scroll body with binary pattern hint -->
      <rect x="${-size*0.85}" y="${-size*0.2}" width="${size*1.7}" height="${size*0.4}" fill="${palette.accent2 || '#f5e8c8'}" stroke="${_mix(palette.ink, '#000', 0.2)}" stroke-width="${size*0.008}"/>
      <ellipse cx="${-size*0.85}" cy="0" rx="${size*0.1}" ry="${size*0.2}" fill="${_mix(palette.accent, '#000', 0.2)}"/>
      <ellipse cx="${-size*0.85}" cy="0" rx="${size*0.05}" ry="${size*0.15}" fill="none" stroke="${_mix(palette.accent, '#000', 0.4)}" stroke-width="${size*0.01}"/>
      <ellipse cx="${size*0.85}" cy="0" rx="${size*0.1}" ry="${size*0.2}" fill="${_mix(palette.accent, '#000', 0.2)}"/>
      <ellipse cx="${size*0.85}" cy="0" rx="${size*0.05}" ry="${size*0.15}" fill="none" stroke="${_mix(palette.accent, '#000', 0.4)}" stroke-width="${size*0.01}"/>
      <!-- 1s and 0s pattern lines -->
      <text x="${-size*0.7}" y="${-size*0.05}" font-family="monospace" font-size="${size*0.08}" fill="${palette.ink}" opacity="0.7">01001000 01101001</text>
      <text x="${-size*0.7}" y="${size*0.08}" font-family="monospace" font-size="${size*0.08}" fill="${palette.ink}" opacity="0.55">01010100 01100101</text>
    </g>`;
  },

  // Engranaje informático (estilizado, alternativa al gear)
  gearTech: (radius = 80, palette, teeth = 12) => {
    const ug = _uid('gt-g');
    let pts = '';
    for (let i = 0; i < teeth * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.82;
      const a = (i * 180 / teeth - 90) * Math.PI / 180;
      pts += `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
    }
    return `<g>
      <defs>
        <radialGradient id="${ug}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${_mix(palette.accent, '#ffffff', 0.35)}"/>
          <stop offset="60%" stop-color="${palette.accent}"/>
          <stop offset="100%" stop-color="${_mix(palette.accent, '#000', 0.4)}"/>
        </radialGradient>
      </defs>
      <polygon points="${pts}" fill="url(#${ug})"/>
      <polygon points="${pts}" fill="none" stroke="${_mix(palette.accent, '#000', 0.4)}" stroke-width="${radius*0.015}"/>
      <circle r="${radius*0.58}" fill="${_mix(palette.bg[0], '#000', 0.1)}"/>
      <circle r="${radius*0.58}" fill="none" stroke="${_mix(palette.accent, '#000', 0.4)}" stroke-width="${radius*0.025}"/>
      <circle r="${radius*0.52}" fill="none" stroke="#ffffff" stroke-width="${radius*0.008}" opacity="0.3"/>
      <!-- spokes -->
      ${(() => {
        let s = '';
        for (let i = 0; i < 5; i++) {
          const a = (i * 72) * Math.PI / 180;
          const x = Math.cos(a) * radius * 0.4, y = Math.sin(a) * radius * 0.4;
          s += `<rect x="${(x-radius*0.06).toFixed(2)}" y="${(y-radius*0.06).toFixed(2)}" width="${(radius*0.12).toFixed(2)}" height="${(radius*0.12).toFixed(2)}" rx="${radius*0.02}" fill="${_mix(palette.accent, '#000', 0.3)}"/>`;
        }
        return s;
      })()}
      <circle r="${radius*0.18}" fill="${palette.accent2 || palette.bg[1]}"/>
      <circle r="${radius*0.08}" fill="${_mix(palette.accent, '#000', 0.5)}"/>
    </g>`;
  }
};
