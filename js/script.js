(() => {
  'use strict';

  const body   = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Side Menu
const sections = document.querySelectorAll("#highlight, #value, #summary");
const sideItems = document.querySelectorAll(".side-item");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            sideItems.forEach(item => {
                item.classList.remove("active");
            });

            const activeItem = document.querySelector(
                `.side-item[href="#${entry.target.id}"]`
            );

            if (activeItem) {
                activeItem.classList.add("active");
            }
        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => {
    observer.observe(section);
});

  /* ========== 2) Scroll Reveal ========== */
  const revealSelectors = [
    'section h2',
    '#highlight p',
    '#value .row > div',
    'footer .container > div > *',
    'hr'
  ];
  const items = document.querySelectorAll(revealSelectors.join(','));

  // ทยอยขึ้นทีละใบ (การ์ด 4 ใบ / ส่วนท้ายเว็บ)
  document.querySelectorAll('#value .row > div').forEach((el, i) => {
    el.style.setProperty('--delay', (i % 4) * 0.12 + 's');
  });
  document.querySelectorAll('footer .container > div > *').forEach((el, i) => {
    el.style.setProperty('--delay', i * 0.15 + 's');
  });

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);          // เล่นครั้งเดียว
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => io.observe(el));
  }


  /* ========== 3) แถบความคืบหน้าการเลื่อนหน้า ========== */
  const bar = document.createElement('div');
  bar.id = 'progress';
  body.append(bar);

  let ticking = false;
  const updateProgress = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
     const max = document.documentElement.scrollHeight - innerHeight;
const p = max > 0 ? scrollY / max : 0;
bar.style.setProperty('--p', p);
document.documentElement.style.setProperty('--sp', p);   // เพิ่มบรรทัดนี้
      ticking = false;
    });
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  /* ========== 4) ปกหนังสือขยับตามเมาส์ (เฉพาะอุปกรณ์ที่มีเมาส์) ========== */
const cover = document.querySelector('#hero .hero-carousel');
  if (cover && !reduce && matchMedia('(hover: hover)').matches) {
    addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth  - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      cover.style.setProperty('--px', (x * 14) + 'px');
      cover.style.setProperty('--py', (y * 10) + 'px');
    });
  }


  /* ========== 5) แสงตามเมาส์ในการ์ด ========== */
  document.querySelectorAll('#value .row > div > div').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });
  });


  /* ========== 6) พื้นหลังดาว (canvas) ========== */
  const canvas = document.createElement('canvas');
  canvas.id = 'stars';
  body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, stars = [], shooting = null;

  const makeStars = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth;
    h = innerHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      r:  Math.random() * 1.4 + 0.3,
      z:  Math.random() * 0.8 + 0.2,            // ความลึก: ยิ่งมาก ยิ่งขยับตามการเลื่อนมาก
      tw: Math.random() * Math.PI * 2,           // เฟสการกะพริบ
      sp: Math.random() * 0.02 + 0.005,          // ความเร็วกะพริบ
      c:  Math.random() < 0.2 ? '#9fe8ff' : '#ffffff'
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      s.tw += s.sp;
      let y = (s.y - scrollY * s.z * 0.15) % h;   // parallax ตามการเลื่อน
      if (y < 0) y += h;
      ctx.globalAlpha = 0.35 + 0.65 * (Math.sin(s.tw) * 0.5 + 0.5);
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // ดาวตก
   boost = Math.min(boost * 0.95 + Math.abs(scrollY - lastY) * 0.0004, 0.02);
lastY = scrollY;
if (!shooting && Math.random() < 0.006 + boost) {
  shooting = {
    x: Math.random() * w * 0.8, y: Math.random() * h * 0.4,
    vx: 9, vy: 4, life: 1,
    rgb: Math.random() < 0.35 ? '159,110,255' : '255,255,255'
  };
}
    if (shooting) {
      const s = shooting;
      const tx = s.x - s.vx * 8, ty = s.y - s.vy * 8;
      const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
      g.addColorStop(0, `rgba(${s.rgb},${s.life})`);
g.addColorStop(1, `rgba(${s.rgb},0)`);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= 0.012;
      if (s.life <= 0) shooting = null;
    }

    if (!reduce) requestAnimationFrame(draw);
  };

  let lastW = innerWidth;
  makeStars();
  draw();
  addEventListener('resize', () => {
    // บนมือถือ แถบเบราว์เซอร์ซ่อน/โผล่ทำให้ความสูงเปลี่ยน — สร้างใหม่เฉพาะตอนความกว้างเปลี่ยน
    if (innerWidth === lastW) return;
    lastW = innerWidth;
    makeStars();
    if (reduce) draw();
  });
})();