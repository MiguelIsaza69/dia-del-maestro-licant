/* ============================================================
   PALETAS · Día del Maestro
   Tokens de color por tema. Edita aquí para cambiar la estética
   de todas las cartas que usen una paleta dada.

   Estructura:
     bg:      3 tonos para el mesh gradient (base → medio → claro)
     ink:     trazo/motivo principal sobre el fondo
     accent:  acento principal (focos, halos)
     accent2: acento secundario (detalles, sparkles)
     mute:    color desaturado para profundidad / sombras
   ============================================================ */

window.PALETTES = {
  /* — Cielos y noches — */
  cosmicNavy:      { bg:['#070b22','#11173f','#1c2456'], ink:'#f5ede0', accent:'#d6b67a', accent2:'#f0d49a', mute:'#3a4470' },
  midnightStudy:   { bg:['#080d22','#152254','#2a3a78'], ink:'#e8efff', accent:'#7eb2ff', accent2:'#b8d4ff', mute:'#3a4870' },
  lavenderMandala: { bg:['#140821','#2a1748','#4a2d6d'], ink:'#f4ebff', accent:'#d6b67a', accent2:'#c9a8e8', mute:'#5d4072' },
  philosopherDusk: { bg:['#070a1c','#10183d','#2a3565'], ink:'#f0e3c0', accent:'#d6b67a', accent2:'#f5c842', mute:'#3a4470' },
  ravenSky:        { bg:['#060709','#171821','#2e2f3c'], ink:'#f0e3c0', accent:'#d6b67a', accent2:'#a89878', mute:'#3a3a4a' },
  starlitSilver:   { bg:['#040614','#0c1238','#1f2358'], ink:'#fff8d0', accent:'#fff8d0', accent2:'#c8c4e8', mute:'#3a4070' },
  pianoIndigo:     { bg:['#080a28','#1a1858','#3d3a8a'], ink:'#f5e8c0', accent:'#c89f4a', accent2:'#f5e8c0', mute:'#2a2a6a' },
  mountainNavy:    { bg:['#0a142e','#1a2a5a','#3a4a7a'], ink:'#f0d49a', accent:'#d6b67a', accent2:'#f5e8a8', mute:'#2a3a5d' },

  /* — Cálidos / tierra — */
  goldenOrbit:     { bg:['#fff5e0','#f0d49a','#a87a3a'], ink:'#3d2814', accent:'#6b4f1e', accent2:'#c89a48', mute:'#8a7a5a' },
  parchment:       { bg:['#f5e8d0','#dfc6a0','#8a5c3a'], ink:'#3d2814', accent:'#8a5c1f', accent2:'#c89a48', mute:'#a8896f' },
  scriptoriumSepia:{ bg:['#f5ecd5','#d4b896','#7a5230'], ink:'#3d2814', accent:'#5a3d1f', accent2:'#c8a872', mute:'#a08868' },
  daVinciVellum:   { bg:['#f7e8c6','#d8b582','#8a5c1f'], ink:'#3d2814', accent:'#8a4a14', accent2:'#c89a48', mute:'#a08866' },
  laurelOlive:     { bg:['#f5ede0','#c8b890','#7a6a3a'], ink:'#3d4a1a', accent:'#5a6a2a', accent2:'#c89a48', mute:'#8a7a4d' },
  terracottaSun:   { bg:['#f7d8a8','#d49a5a','#7a3a14'], ink:'#3d1408', accent:'#a85020', accent2:'#f5c842', mute:'#a07058' },

  /* — Naturaleza — */
  sageGarden:      { bg:['#eef5dc','#a8c478','#5a7a3a'], ink:'#1f3015', accent:'#3d5a2d', accent2:'#c89a48', mute:'#8aa86f' },
  oliveVillage:    { bg:['#e8efd6','#9aa84a','#5a6a2a'], ink:'#2a3a14', accent:'#3d4a1a', accent2:'#c89a48', mute:'#7a8a4d' },
  alpineMorning:   { bg:['#cce4f5','#7fa3c4','#3d5a7a'], ink:'#1a2a3d', accent:'#d6b67a', accent2:'#f5e8c0', mute:'#4a6a8a' },

  /* — Florales / suaves — */
  roseGarden:      { bg:['#ffe8ec','#d4889a','#7a1e3d'], ink:'#3d0d1a', accent:'#a8456f', accent2:'#f0c4d0', mute:'#a06a78' },
  lilyBloom:       { bg:['#fff0f5','#e8b8c8','#a06a78'], ink:'#4a1f3d', accent:'#d4a868', accent2:'#fff8f5', mute:'#a89098' },
  butterflyMeadow: { bg:['#e6efce','#8aa86a','#3d5a2d'], ink:'#1a2a14', accent:'#3d5a2d', accent2:'#d4a868', mute:'#7a8a5a' },

  /* — Tecnología / químico — */
  arcticCircuit:   { bg:['#03101a','#0e3038','#1f5560'], ink:'#e8f8fb', accent:'#5da3ad', accent2:'#b5e3eb', mute:'#3a6a72' },
  chemAmethyst:    { bg:['#1a0a28','#3d1448','#5d2a6f'], ink:'#ffd6e5', accent:'#e399c1', accent2:'#9b4dac', mute:'#4a2a5a' },
  edisonGold:      { bg:['#0a0703','#1a1408','#3a2810'], ink:'#fff3c4', accent:'#f5c842', accent2:'#f0a830', mute:'#5a4020' },
  steelLily:       { bg:['#e0e6ec','#a8b4c2','#5a6a82'], ink:'#1a2030', accent:'#3a4a6a', accent2:'#f0f2f5', mute:'#8090a0' },

  /* — Británico — */
  britishCream:    { bg:['#f5e8df','#e4ccbe','#b8968a'], ink:'#1a2347', accent:'#b3354c', accent2:'#1a2347', mute:'#7a6a64' },

  /* — Pastel — */
  painterPastel:   { bg:['#fff8f0','#f8e4d0','#e0c4b0'], ink:'#4a2d14', accent:'#a85070', accent2:'#5a8aaa', mute:'#c8a890' },

  /* — Música — */
  wineMusic:       { bg:['#fff5ec','#d49db8','#4a1f2e'], ink:'#1a0d14', accent:'#8a3a5d', accent2:'#c89a48', mute:'#a0667a' },

  /* — Religioso / espiritual — */
  doveSerenity:    { bg:['#fff8e8','#e8d8b8','#a89878'], ink:'#3a2a14', accent:'#d4a868', accent2:'#fff8e8', mute:'#a89070' }
};
