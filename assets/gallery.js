/* ============================================================
   GALLERY · Día del Maestro
   Renderiza la cuadrícula con lazy-rendering por IntersectionObserver.
   Muestra el badge de la materia principal sobre cada thumbnail.
   ============================================================ */

(function () {
  const grid = document.getElementById('grid');
  if (!grid || !window.teachers) return;

  const fragment = document.createDocumentFragment();

  window.teachers.forEach((t, i) => {
    const palette = (window.PALETTES && window.PALETTES[t.paletteKey]) || null;
    const card = document.createElement('a');
    card.href = `card.html?id=${i}`;
    card.className = 'thumb';
    card.dataset.idx = String(i);

    const bg0 = palette ? palette.bg[0] : '#1a1825';
    const bg1 = palette ? palette.bg[1] : '#2a2838';
    const bg2 = palette ? palette.bg[2] : '#3a3848';
    const accent = palette ? palette.accent : '#d6b67a';

    const mainSubject = t.mainSubject || t.subject;

    card.innerHTML = `
      <div class="thumb-art" style="
        --bg-0:${bg0}; --bg-1:${bg1}; --bg-2:${bg2}; --accent:${accent};
        background:
          radial-gradient(60% 60% at 20% 20%, var(--bg-1), transparent 70%),
          radial-gradient(60% 60% at 80% 30%, var(--bg-2), transparent 70%),
          radial-gradient(60% 60% at 30% 90%, var(--bg-2), transparent 70%),
          radial-gradient(60% 60% at 85% 85%, var(--bg-1), transparent 70%),
          var(--bg-0);
      ">
        <div class="thumb-badge">${mainSubject}</div>
      </div>
      <div class="thumb-info">
        <div class="thumb-name">${t.name}</div>
        <div class="thumb-subject">${t.subject}</div>
      </div>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  function renderThumb(el) {
    if (el.dataset.rendered === '1') return;
    const i = parseInt(el.dataset.idx, 10);
    const t = window.teachers[i];
    if (!t) return;
    const art = el.querySelector('.thumb-art');
    // Inserta el SVG sin tocar el badge
    const badge = art.querySelector('.thumb-badge');
    art.innerHTML = t.svg();
    if (badge) art.appendChild(badge);
    el.dataset.rendered = '1';
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          renderThumb(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '400px 0px', threshold: 0.01 });

    grid.querySelectorAll('.thumb').forEach((el) => io.observe(el));
  } else {
    const all = Array.from(grid.querySelectorAll('.thumb'));
    let idx = 0;
    const tick = () => {
      const end = Math.min(idx + 4, all.length);
      for (; idx < end; idx++) renderThumb(all[idx]);
      if (idx < all.length) (window.requestIdleCallback || setTimeout)(tick, 60);
    };
    tick();
  }

  /* Animaciones (si GSAP está disponible) */
  if (typeof gsap !== 'undefined') {
    const thumbs = grid.querySelectorAll('.thumb');
    gsap.to(thumbs, {
      opacity: 1, y: 0,
      duration: 0.9, ease: 'power3.out',
      stagger: { amount: 0.7, from: 'start' }
    });

    thumbs.forEach((thumb) => {
      let frame = null;
      thumb.addEventListener('mousemove', (e) => {
        const svg = thumb.querySelector('.thumb-art svg');
        if (!svg) return;
        const rect = thumb.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          gsap.to(svg, { x: x * 10, y: y * 6, duration: 0.5, ease: 'power2.out' });
        });
      });
      thumb.addEventListener('mouseleave', () => {
        const svg = thumb.querySelector('.thumb-art svg');
        if (svg) gsap.to(svg, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' });
      });
    });
  } else {
    grid.querySelectorAll('.thumb').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
})();
