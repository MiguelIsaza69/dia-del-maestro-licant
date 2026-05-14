/* ============================================================
   CARTAS DE PROFESORES · Día del Maestro · Collage v6
   - Tamaños base limitados: focal ~150-170, sat ~80-120, accent ~60-90
   - Layouts orgánicos (composition.js) con separaciones verificadas
   - Cada profesor usa un layout distinto para evitar la cuadrícula
   ============================================================ */

window.teachers = [

  /* 1 · Gerlin A Scarpeta Rivas — MATEMÁTICAS */
  {
    name: "Gerlin A Scarpeta Rivas",
    subject: "Matemáticas · Física · Ética",
    mainSubject: "Matemáticas",
    paletteKey: "cosmicNavy",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.starfield(40, p.ink, 1.4, 11)}
        ${compose([
          M.cartesian(160, p) + M.functionCurve(160, p.accent2, 'parabola'),
          M.compass(120, p),
          M.calculator(95, p),
          M.piSymbol(80, p.accent2),
          M.abacus(110, p),
          M.pythagoras(95, p),
          M.infinitySymbol(75, p.accent),
          M.polygon(6, 55, 'none', 2.5, p.accent),
          M.operationSymbols(75, p.accent2)
        ], 0)}
      `);
    }
  },

  /* 2 · Fernan Diego Velásquez — MATEMÁTICAS */
  {
    name: "Fernan Diego Velásquez",
    subject: "Matemáticas · Ética",
    mainSubject: "Matemáticas",
    paletteKey: "midnightStudy",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(48, p.accent2, 1.3, 5)}
        ${compose([
          M.cartesian(160, p) + M.functionCurve(160, p.accent2, 'sine'),
          M.compass(115, p),
          M.calculator(95, p),
          M.piSymbol(75, p.accent),
          M.infinitySymbol(75, p.accent2),
          M.operationSymbols(75, p.accent2),
          M.pythagoras(90, p),
          M.abacus(95, p),
          M.polygon(6, 48, 'none', 2.5, p.accent)
        ], 1)}
      `);
    }
  },

  /* 3 · Yomira Purello — MATEMÁTICAS (mandala) */
  {
    name: "Yomira Purello",
    subject: "Matemáticas · Ética",
    mainSubject: "Matemáticas",
    paletteKey: "lavenderMandala",
    svg() {
      const p = PALETTES[this.paletteKey];
      const mandala = M.flowerPetals(12, 260, 40, p.accent2, 0.18) +
                      M.flowerPetals(8, 180, 30, p.ink, 0.25) +
                      `<g fill="none" stroke="${p.accent}" stroke-width="1.4" opacity="0.9">${M.polygon(6, 75, 'none', 1.4, p.accent)}${M.polygon(6, 115, 'none', 1.4, p.accent)}</g>` +
                      M.polygon(6, 25, p.accent, 0, 'none') +
                      `<circle r="5" fill="${p.ink}"/>`;
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(36, p.accent2, 1.2, 9)}
        ${compose([
          mandala,
          M.compass(110, p),
          M.piSymbol(80, p.accent),
          M.pythagoras(90, p),
          M.infinitySymbol(78, p.accent2),
          M.polygon(8, 48, 'none', 2.5, p.accent),
          M.calculator(90, p),
          M.abacus(90, p),
          M.operationSymbols(72, p.accent)
        ], 2)}
      `);
    }
  },

  /* 4 · Olga Bedoya — MATEMÁTICAS */
  {
    name: "Olga Bedoya",
    subject: "Matemáticas · Emprendimiento",
    mainSubject: "Matemáticas",
    paletteKey: "goldenOrbit",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(34, p.accent2, 1.1, 23)}
        ${compose([
          M.abacus(140, p),
          M.compass(120, p),
          M.calculator(110, p),
          M.piSymbol(75, p.accent),
          M.infinitySymbol(72, p.accent),
          M.pythagoras(95, p),
          M.polygon(6, 48, 'none', 2.5, p.accent),
          M.polygon(8, 48, 'none', 2.5, p.accent),
          M.operationSymbols(75, p.accent2)
        ], 3)}
      `);
    }
  },

  /* 5 · Yuliana Gonzáles Pulgarín — FÍSICA */
  {
    name: "Yuliana Gonzáles Pulgarín",
    subject: "Física",
    mainSubject: "Física",
    paletteKey: "chemAmethyst",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.starfield(30, p.ink, 1.5, 19)}
        ${compose([
          M.atom(155, p),
          M.pendulum(105, p),
          M.prism(90, p),
          M.bolt(100, p.accent2),
          M.magnet(90, p),
          M.spring(100, p),
          M.gear(60, p),
          M.wave(110, p.accent, 22),
          M.apple(60, p)
        ], 4)}
      `);
    }
  },

  /* 6 · Vanessa Sucerquia — NATURALES */
  {
    name: "Vanessa Sucerquia",
    subject: "Naturales · Química · Ética",
    mainSubject: "Ciencias Naturales",
    paletteKey: "butterflyMeadow",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(40, '#fff8e8', 1.2, 13)}
        ${compose([
          M.tree(170, p),
          M.butterfly(85, p.ink, p.accent),
          M.sun(55, p.accent2, true),
          M.cloud(130, '#fff8e8', 0.9),
          M.flower(60, p),
          M.cell(65, p),
          M.leaf(75, p.ink, p.bg[2]),
          M.leaf(70, p.bg[2], p.ink),
          M.molecule(40, p)
        ], 5)}
      `);
    }
  },

  /* 7 · Adriana P Duque Henao — QUÍMICA */
  {
    name: "Adriana P Duque Henao",
    subject: "Química",
    mainSubject: "Química",
    paletteKey: "chemAmethyst",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(40, p.accent2, 1.3, 29)}
        ${compose([
          M.flask(150, p),
          M.beaker(115, p),
          M.roundFlask(100, p),
          M.testTube(95, p),
          M.dna(90, p),
          M.molecule(48, p),
          M.flame(65, p),
          M.droplet(28, p.accent2),
          M.molecule(38, p)
        ], 0)}
      `);
    }
  },

  /* 8 · Edison Jaramillo — EDU-FÍSICA */
  {
    name: "Edison Jaramillo",
    subject: "Educación Física",
    mainSubject: "Educación Física",
    paletteKey: "edisonGold",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(28, p.accent2, 1, 41)}
        ${compose([
          M.soccerBall(120),
          M.trophy(110, p),
          M.bicycle(115, p),
          M.basketball(72),
          M.whistle(65, p),
          M.medal(55, p),
          M.stopwatch(70, p),
          M.tennisBall(48),
          M.dumbbell(80, p)
        ], 7)}
      `);
    }
  },

  /* 9 · Julio Cesar Correa — EDU-FÍSICA */
  {
    name: "Julio Cesar Correa",
    subject: "Educación Física",
    mainSubject: "Educación Física",
    paletteKey: "laurelOlive",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.trophy(120, p),
          M.runner(140, p.ink),
          M.dumbbell(80, p),
          M.basketball(68),
          M.soccerBall(72),
          M.medal(55, p),
          M.stopwatch(65, p),
          M.whistle(60, p),
          M.tennisBall(45)
        ], 1)}
      `);
    }
  },

  /* 10 · Profesor Castellano */
  {
    name: "Profesor de Castellano",
    subject: "Castellano · Ética",
    mainSubject: "Castellano",
    paletteKey: "scriptoriumSepia",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(30, p.ink, 1, 9)}
        ${compose([
          M.openBook(p, 0.55),
          M.feather(140, p.ink),
          M.bookStack(p, 0.35),
          M.scroll(110, p),
          M.envelope(78, p),
          M.glasses(85, p),
          M.inkwell(65, p),
          M.closedBook(p, 0.32, p.accent),
          M.closedBook(p, 0.32, p.mute)
        ], 6)}
      `);
    }
  },

  /* 11 · Maria Eugenia — CASTELLANO */
  {
    name: "Maria Eugenia",
    subject: "Castellano · Ética",
    mainSubject: "Castellano",
    paletteKey: "roseGarden",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(24, p.accent2, 1, 33)}
        ${compose([
          M.bookStack(p, 0.6),
          M.openBook(p, 0.42),
          M.rose(55, p),
          M.feather(130, p.ink),
          M.glasses(85, p),
          M.scroll(100, p),
          M.inkwell(60, p),
          M.closedBook(p, 0.32, p.accent),
          M.rose(42, p)
        ], 3)}
      `);
    }
  },

  /* 12 · Oscar Rúa — CASTELLANO · Filosofía */
  {
    name: "Oscar Rúa",
    subject: "Castellano · Filosofía",
    mainSubject: "Castellano",
    paletteKey: "philosopherDusk",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.starfield(28, p.ink, 1.4, 23)}
        ${compose([
          M.openBook(p, 0.55),
          M.owl(75, p),
          M.moon(60, p.accent2),
          M.feather(125, p.ink),
          M.scroll(100, p),
          M.glasses(85, p),
          M.inkwell(58, p),
          M.closedBook(p, 0.3, p.accent),
          M.closedBook(p, 0.3, p.mute)
        ], 0)}
      `);
    }
  },

  /* 13 · Karen Presiga — INGLÉS */
  {
    name: "Karen Presiga",
    subject: "Inglés · Ética",
    mainSubject: "Inglés",
    paletteKey: "britishCream",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.bigBen(165, p),
          M.londonBus(130, p),
          M.phoneBooth(85, p),
          M.teaCup(80, p),
          M.crown(72, p),
          M.cloud(120, p.bg[0], 0.85),
          M.openBook(p, 0.42),
          M.cloud(100, p.bg[0], 0.7),
          M.glasses(65, p)
        ], 6)}
      `);
    }
  },

  /* 14 · Luz Stella Guerrero — INGLÉS */
  {
    name: "Luz Stella Guerrero",
    subject: "Inglés",
    mainSubject: "Inglés",
    paletteKey: "starlitSilver",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.starfield(40, p.ink, 1.7, 41)}
        ${compose([
          M.openBook(p, 0.55),
          M.bigBen(140, p),
          M.phoneBooth(82, p),
          M.teaCup(78, p),
          M.londonBus(115, p),
          M.crown(65, p),
          M.glasses(75, p),
          M.star4(32, p.accent, 0.95),
          M.star4(20, p.accent2, 0.85)
        ], 4)}
      `);
    }
  },

  /* 15 · Maile Margarita Nieto Muñoz — TEC-INFORMÁTICA */
  {
    name: "Maile Margarita Nieto Muñoz",
    subject: "Tec-Informática · Visuales · Religión",
    mainSubject: "Tec-Informática",
    paletteKey: "arcticCircuit",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.monitor(150, p),
          M.keyboard(140, p),
          M.codeBrackets(110, p),
          M.gearTech(60, p),
          M.wifi(65, p.accent2),
          M.mouseCursor(48, p.accent2),
          M.circuit(p, 0.55, 90),
          M.brush(110, p, p.accent),
          M.dove(58, p.accent2)
        ], 7)}
      `);
    }
  },

  /* 16 · Leonardo F Sánchez — TEC-INFORMÁTICA + HISTORIA */
  {
    name: "Leonardo F Sánchez",
    subject: "Tec-Informática",
    mainSubject: "Tec-Informática",
    paletteKey: "daVinciVellum",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.dust(28, p.ink, 1, 17)}
        ${compose([
          M.laptop(160, p),
          M.vintageComputer(125, p),
          M.astrolabe(95, p),
          M.oldClock(85, p),
          M.cdDisc(75, p),
          M.punchCard(130, p),
          M.floppyDisk(70, p),
          M.scrollWithBinary(115, p),
          M.gearTech(60, p)
        ], 0)}
      `);
    }
  },

  /* 17 · Laura Angel — VISUALES */
  {
    name: "Laura Angel",
    subject: "Visuales",
    mainSubject: "Artes Visuales",
    paletteKey: "painterPastel",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.paintPalette(150, p),
          M.easel(130, p),
          M.pictureFrame(120, 85, p),
          M.pencil(130, p),
          M.colorWheel(65, p),
          M.brush(140, p, '#b3354c'),
          M.camera(70, p),
          M.brush(110, p, '#4d6b2e'),
          M.brush(105, p, '#5b9aff')
        ], 2)}
      `);
    }
  },

  /* 18 · Susana Aceros — INGLÉS */
  {
    name: "Susana Aceros",
    subject: "Inglés",
    mainSubject: "Inglés",
    paletteKey: "steelLily",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.openBook(p, 0.5),
          M.bigBen(140, p),
          M.londonBus(120, p),
          M.phoneBooth(85, p),
          M.teaCup(75, p),
          M.crown(65, p),
          M.lily(62, '#fff8f5'),
          M.glasses(72, p),
          M.cloud(105, p.bg[0], 0.85)
        ], 1)}
      `);
    }
  },

  /* 19 · Héctor F Quintana Agudelo — MÚSICA */
  {
    name: "Héctor F Quintana Agudelo",
    subject: "Música",
    mainSubject: "Música",
    paletteKey: "wineMusic",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        <g opacity="0.4">${M.staff(p, [
          {x: 380, y: 480, flag: true},
          {x: 620, y: 430, flag: false},
          {x: 1020, y: 410, flag: true},
          {x: 1280, y: 460, flag: false}
        ], 380)}</g>
        ${compose([
          M.trebleClef(170, p.ink),
          M.bassClef(90, p.ink),
          M.vinylRecord(70, p),
          M.headphones(72, p),
          M.microphone(65, p),
          M.musicNote(50, p.accent),
          M.beamedNotes(42, p.ink),
          M.musicNote(38, p.accent2),
          M.beamedNotes(34, p.accent)
        ], 7)}
      `);
    }
  },

  /* 20 · Cesar F Uribe Sánchez — MÚSICA (piano) */
  {
    name: "Cesar F Uribe Sánchez",
    subject: "Música",
    mainSubject: "Música",
    paletteKey: "pianoIndigo",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        <g stroke="${p.accent}" stroke-width="2" fill="none" opacity="0.4">
          <path d="M -50 280 Q 200 200, 400 280 T 800 280 T 1200 280 T 1650 280"/>
        </g>
        ${place(0, 680, 1, 0, M.pianoKeyboard(1600, p))}
        ${compose([
          M.trebleClef(150, p.accent),
          M.bassClef(85, p.accent),
          M.musicNote(45, p.accent2),
          M.vinylRecord(58, p),
          M.headphones(65, p),
          M.beamedNotes(45, p.accent2),
          M.musicNote(40, p.accent),
          M.microphone(55, p),
          M.beamedNotes(35, p.accent2)
        ], 5, [
          {dy: -60}, {dy: -60}, {dy: -60}, {dy: -60}, {dy: -60},
          {dy: -60}, {dy: -60}, {dy: -60}, {dy: -60}
        ])}
      `);
    }
  },

  /* 21 · Gloria R Cuervo Giraldo — SOCIALES */
  {
    name: "Gloria R Cuervo Giraldo",
    subject: "Sociales",
    mainSubject: "Ciencias Sociales",
    paletteKey: "ravenSky",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.starfield(28, p.accent2, 1.4, 31)}
        ${compose([
          M.globe(155, p),
          M.column(150, p),
          M.monument(105, p),
          M.raven(85),
          M.compassRose(72, p),
          M.pyramid(85, p),
          M.scroll(100, p),
          M.raven(60),
          M.crown(58, p)
        ], 0)}
      `);
    }
  },

  /* 22 · Osvaldo Restrepo González — SOCIALES */
  {
    name: "Osvaldo Restrepo González",
    subject: "Sociales · Eco-Política",
    mainSubject: "Ciencias Sociales",
    paletteKey: "terracottaSun",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.globe(155, p),
          M.monument(95, p),
          M.column(130, p),
          M.balanceScale(90, p),
          M.compassRose(70, p),
          M.scroll(110, p),
          M.pyramid(80, p),
          M.coinStack(48, p),
          M.crown(52, p)
        ], 3)}
      `);
    }
  },

  /* 23 · Jorge Andrés Villa Jiménez — ECO-POLÍTICA */
  {
    name: "Jorge Andrés Villa Jiménez",
    subject: "Eco-Política · Sociales",
    mainSubject: "Eco-Política",
    paletteKey: "oliveVillage",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.growthChart(p, 280, 170),
          M.governmentBuilding(110, p),
          M.balanceScale(90, p),
          M.handshake(90, p),
          M.briefcase(72, p),
          M.coinStack(48, p),
          M.pieChart(58, p),
          M.cottage(p, 0.55),
          M.cottage(p, 0.5)
        ], 5)}
      `);
    }
  },

  /* 24 · Cristian Suaza — FILOSOFÍA */
  {
    name: "Cristian Suaza",
    subject: "Filosofía",
    mainSubject: "Filosofía",
    paletteKey: "terracottaSun",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${compose([
          M.column(220, p),
          M.owl(72, p),
          M.brain(72, p),
          M.hourglass(75, p),
          M.sun(58, p.accent2, true),
          M.scroll(105, p),
          M.feather(115, p.ink),
          M.candle(68, p),
          M.glasses(70, p)
        ], 6)}
      `);
    }
  },

  /* 25 · Marcela Ramírez — RELIGIÓN */
  {
    name: "Marcela Ramírez",
    subject: "Religión · Eco-Política",
    mainSubject: "Religión",
    paletteKey: "doveSerenity",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${place(800, 180, 1, 0, M.lightRays('#fff8e8', 18, 420, 0.22))}
        ${place(800, 180, 0.85, 0, M.glow(90, p.accent2, 0.35))}
        ${compose([
          M.dove(115, p.bg[0]),
          M.church(92, p),
          M.prayingHands(78, p),
          M.candle(78, p),
          M.cross(58, p.bg[0]),
          M.openBook(p, 0.4),
          M.branch(100, p.bg[2], p.ink, 5),
          M.branch(92, p.bg[2], p.ink, 4),
          M.star4(24, p.accent, 0.85)
        ], 4)}
      `);
    }
  },

  /* 26 · Liliana Alarcón — EMPRENDIMIENTO */
  {
    name: "Liliana Alarcón",
    subject: "Emprendimiento · Ética",
    mainSubject: "Emprendimiento",
    paletteKey: "lilyBloom",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${place(800, 460, 1, 0, M.lightRays(p.accent, 14, 320, 0.16))}
        ${compose([
          M.edisonBulb(120, p),
          M.growthChart(p, 195, 130),
          M.rocket(90, p),
          M.target(68, p),
          M.handshake(82, p),
          M.briefcase(68, p),
          M.gearTech(55, p),
          M.lily(60, '#fff8f5'),
          M.lily(52, '#fff8f5')
        ], 0)}
      `);
    }
  },

  /* 27 · Diana Monsalve — EMPRENDIMIENTO (cielo sobre cordillera) */
  {
    name: "Diana Monsalve",
    subject: "Emprendimiento",
    mainSubject: "Emprendimiento",
    paletteKey: "mountainNavy",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.starfield(40, p.ink, 1.4, 71)}
        ${M.mountainsLayered(p)}
        ${compose([
          M.rocket(105, p),
          M.edisonBulb(80, p),
          M.target(78, p),
          M.handshake(85, p),
          M.gearTech(62, p),
          M.briefcase(72, p),
          M.growthChart(p, 160, 105),
          M.star4(26, p.accent2, 0.9),
          M.star4(22, p.accent, 0.85)
        ], 8)}
      `);
    }
  },

  /* 28 · Alvaro Montoya — EDU-FÍSICA (cielo sobre cordillera) */
  {
    name: "Alvaro Montoya",
    subject: "Educación Física",
    mainSubject: "Educación Física",
    paletteKey: "alpineMorning",
    svg() {
      const p = PALETTES[this.paletteKey];
      return buildCard(`
        ${meshBg(p)}
        ${M.mountainsLayered(p)}
        ${compose([
          M.sun(75, '#fff8e8', true),
          M.bicycle(115, p),
          M.runner(110, p.ink),
          M.soccerBall(70),
          M.basketball(62),
          M.stopwatch(70, p),
          M.medal(55, p),
          M.whistle(60, p),
          M.dumbbell(68, p)
        ], 8)}
      `);
    }
  }

];
