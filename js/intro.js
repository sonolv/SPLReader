/* =====================================================================
   INTRO 2 เฟส → hero เดิม
   โหลดไฟล์นี้ "ก่อน" script.js
   ไฟล์นี้สร้าง HTML ของอินโทรเองทั้งหมด ไม่ต้องวางโค้ดอะไรใน HTML (ยกเว้นลิงก์ CSS/JS)
   ไม่มีพื้นหลังหรือแถบข้อความค้างอยู่บนหน้าเว็บหลักอีกแล้ว
   ===================================================================== */
(() => {
  'use strict';

  /* ===================================================================
     ★ ตั้งค่า / เลือกข้อความเองได้ที่นี่ ★
     =================================================================== */
  const CONFIG = {

    // เฟส 1: ข้อความกลางจอที่ขึ้นทีละตัวอักษร
    introText: 'SPLReader present',

    // เฟส 2: ชื่อเรื่องตัวใหญ่กลางจอ / บรรทัดที่สองใต้ชื่อ (ตัวอักษรจีน) / คำบรรยายเล็กด้านบน
    introTitle: 'มหาสงครามข้ามดวงดาว',
    introSubtitle: '大英雄时代',             // ใส่ '' ถ้าไม่ต้องการบรรทัดที่สอง
    introCaption: 'SPLReader  ·  Book Special Site',
    scrollText: 'SCROLL',                // ข้อความปุ่มด้านล่างของหน้าปก ('' = ไม่แสดง)

    // เมนูด้านบน (ซ้าย | ข้อความกลาง | ขวา)  href ใส่ id ของส่วนในหน้าเว็บคุณ
    navLeft: [
      { label: 'Book', href: '#hero' },
      { label: 'Highlight', href: '#highlight' }
    ],
    navRight: [{ label: 'Value', href: '#value' },
    { label: 'Summary', href: '#summary' }
    ],

    // แถวโค้ดเรืองแสงในแถบ 3 มิติ (ใส่ไทย/อังกฤษ/สัญลักษณ์ได้)
    codeLines: [
      'ผู้ใดใจคิดคด ไพร่ฟ้าหมดศรัทธา แม้นมีทัพแกร่งกล้า ก็หมดท่าไร้เดโช',
      'มิอวดอ้างนามตน จึงมีชื่อระบือไกล มิอวดโอ้ทะนงตน จึงรู้แยกแยะผิดชอบ',
      'มิฝักใฝ่ยศถาบรรดาศักดิ์ตน จึงมีผลสำเร็จได้ มิอวดโอ้ยกตน จึงยืนหยัดยืนยง',
      'ความฉาบฉวยและหลงละเลิงในวัตถุของมวลมนุษยชาติ หากย้อนไปถึงรากเหง้าที่แท้จริง ก็เป็นแค่สัญชาตญาณดิบในการเอาชีวิตรอดและสืบสกุลเท่านั้น',
      'คนคนหนึ่งได้ลาโลกไปในยามรุ่งอรุณ ต่อให้ชีวิตที่ผ่านมาจะเต็มไปด้วยความทุกข์แสนสาหัสเพียงใด ยามนี้ก็คงจากไปได้โดยไม่คิดหวงห่าสิ่งใดอีก',
      'ขึ้นชื่อว่ามนุษย์ ความต้องการมีมากล้น มากพอที่จะทำลายโลกใบหนึ่งให้เป็นเถ้าธุลี โดยไม่สนสิ่งใดแม้แต่พื้นฐานความเป็นมนุษย์ที่ควรมี',
      'ข้าซูซานขอลาโลกในภพนี้ หากภพหน้ามี ขอเป็นศวาอาชารับใช้แทนคุณ'
    ],

    // ข้อความภาษาไทยในแถบ 3 มิติ (ตัวอักษรล้วน ไม่มีแถบไฮไลท์)
    bandLines: [
      'ขอพลีกายสลายสิ้นสู่ธุลี ขจรทั่วสายนทีแห่งดารา',

        'เสี้ยวแสงอัสนีบาต คลาดคลาสิ้นดินธุลี',
      'มาตรแม้นมีถ้อยคำนับพันหมื่น มิอาจฝืนต้องสูญสิ้นเมื่ออาสัญ',
      'ธุลีดาราสลายสิ้นแล้ว ราตรีคลาแคล้วอรุณฉายฉาน'
    ],

    bandRows: 15,           // จำนวนแถวในแถบ 3 มิติ
    textOpacity: 0.22,      // ความจางของตัวอักษรในแถบ (0 = มองไม่เห็น, 1 = ชัดเต็มที่)

    // ความเร็ว (ms)
    introHold: 1000,        // หยุดค้างหลังเส้นลากเสร็จ ก่อนเข้าเฟส 2
    autoLeaveMs: 0          // 0 = หน้าปกค้างไว้จนผู้ใช้เลื่อน/กดเอง, ใส่เลข (ms) = จางหายเองหลังเวลานั้น
  };


  const root = document.documentElement;
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // แยกตัวอักษรแบบ grapheme เพื่อไม่ให้สระ/วรรณยุกต์ไทยหลุดจากพยัญชนะ
  const splitChars = (str) => {
    if ('Segmenter' in Intl) {
      return Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(str), s => s.segment);
    }
    return Array.from(str);
  };

  let intro = null;
  let finished = false;
  let leaving = false;

  const finishIntro = () => {
    if (finished) return;
    finished = true;
    root.classList.add('intro-done');          // ปลดล็อกเลื่อนหน้า + เริ่มแอนิเมชัน hero เดิม
  };

  const leave = () => {
    if (leaving) return;
    leaving = true;
    if (intro) intro.classList.add('is-leaving');   // อินโทรจางออก
   setTimeout(() => { finishIntro(); root.classList.remove('intro-lock'); }, 400);               // hero เริ่มขึ้นระหว่างอินโทรกำลังจาง
  };

  let phase2At = 0;

  const goPhase2 = () => {
    if (leaving || !intro || phase2At) return;
    phase2At = performance.now();
    intro.classList.add('phase-2');
    if (CONFIG.autoLeaveMs > 0) setTimeout(leave, CONFIG.autoLeaveMs);
  };

  // ผู้ใช้เลื่อน/แตะ/กดปุ่ม: เฟส 1 → ข้ามไปเฟส 2, เฟส 2 → ออกจากหน้าปกไปที่ hero
  const advance = () => {
    if (leaving || !intro) return;
    if (!phase2At) { goPhase2(); return; }
    if (performance.now() - phase2At < 900) return;   // กันเผลอเลื่อนทันทีที่หน้าปกขึ้น
    leave();
  };

  // คลิกเมนู: ออกจากหน้าปกแล้วเลื่อนไปยังส่วนนั้น
  const goTo = (href) => {
    leave();
    setTimeout(() => {
      const target = href && href.length > 1 ? document.querySelector(href) : null;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  /* ---------- เลื่อนขึ้นสุดหน้าแล้ว กลับมาหน้าอินโทร ---------- */
  let reopening = false;
  let topSince  = scrollY <= 2 ? performance.now() : 0;

  const reopen = () => {
    if (!intro || !leaving || reopening) return;                   // ใช้ได้หลังออกจากอินโทรแล้วเท่านั้น
    if (!topSince || performance.now() - topSince < 600) return;   // ต้องอยู่บนสุดนิ่งๆ ก่อน กันแรงเฉื่อยตอนเลื่อนขึ้นมา
    reopening = true;
    leaving   = false;
    phase2At  = performance.now();
    root.classList.add('intro-lock');                              // ล็อกการเลื่อนอีกครั้ง
    intro.classList.remove('is-leaving');                          // อินโทรไหลลงมาแทนที่
    setTimeout(() => { reopening = false; }, 1000);
  };

  addEventListener('scroll', () => {
    if (scrollY <= 2) { if (!topSince) topSince = performance.now(); }
    else topSince = 0;
  }, { passive: true });

  addEventListener('wheel', (e) => { if (e.deltaY < 0) reopen(); }, { passive: true });

  let pullY = null;
  addEventListener('touchstart', (e) => { pullY = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', (e) => {
    if (pullY !== null && e.touches[0].clientY - pullY > 40) { pullY = null; reopen(); }
  }, { passive: true });

  addEventListener('keydown', (e) => {
    if (['ArrowUp', 'PageUp'].includes(e.key)) reopen();
  });
  /* ---------- แถบ 3 มิติ (อยู่ในอินโทรเท่านั้น) ---------- */
  const buildBands = (stage) => {
    const SEP = '    ✦    ';
    const N = CONFIG.bandRows;
    const FAINT = CONFIG.textOpacity;
    let codeIdx = 0, barIdx = 0;

    for (let r = 0; r < N; r++) {
      const isBar = CONFIG.bandLines.length && r % 3 === 1;
      const src = isBar ? CONFIG.bandLines : CONFIG.codeLines;
      if (!src.length) continue;
      const idx = isBar ? barIdx++ : codeIdx++;
      const text = src[idx % src.length];

      const row = document.createElement('div');
      row.className = 'band ' + (isBar ? 'band--thai' : 'band--code');

      const track = document.createElement('span');
      track.className = 'band-track';
      const half = (text + SEP).repeat(8);
      track.textContent = half + half;              // ซ้ำ 2 ชุดให้วนต่อเนื่อง
      row.append(track);

      row.style.setProperty('--i', r);
      row.style.setProperty('--dx', r % 2 ? 1 : -1);
      row.style.setProperty('--dir', r % 2 ? 'reverse' : 'normal');
      row.style.setProperty('--dur', (55 + (r * 11) % 40) + 's');
      row.style.setProperty('--bo', FAINT);   // ความจางของตัวอักษรทุกแถว (ปรับที่ CONFIG.textOpacity)
      row.style.setProperty('--blur', (r < 2 || r >= N - 2) ? '2px' : '0px');   // แถวไกลเบลอเล็กน้อย
      stage.append(row);
    }

    // แท่งกลิตช์สุ่มตำแหน่ง
    for (let g = 0; g < 7; g++) {
      const bar = document.createElement('i');
      bar.className = 'gbar';
      bar.style.left = (Math.random() * 80) + '%';
      bar.style.top = (Math.random() * 90) + '%';
      bar.style.width = (8 + Math.random() * 14) + '%';
      bar.style.setProperty('--gd', (3 + Math.random() * 3).toFixed(1) + 's');
      bar.style.setProperty('--gdelay', (1 + Math.random() * 3).toFixed(1) + 's');
      stage.append(bar);
    }
  };


  /* ---------- สร้างอินโทร ---------- */
  const buildIntro = () => {
    // ถ้าเคยวางบล็อก <div id="intro"> ใน HTML จากเวอร์ชันก่อน ให้ลบทิ้ง ใช้ตัวที่สร้างจาก JS แทน
    const old = document.getElementById('intro');
    if (old) old.remove();

    intro = document.createElement('div');
    intro.id = 'intro';
    intro.innerHTML = `
      <div class="intro-mesh" aria-hidden="true">
        <i class="intro-blob b1"></i><i class="intro-blob b2"></i>
        <i class="intro-blob b3"></i><i class="intro-blob b4"></i>
      </div>

      <div class="intro-bands" aria-hidden="true"><div class="bands-stage"></div></div>

      <div class="intro-stage">
        <p class="intro-text"></p>
        <i class="intro-line"></i>
      </div>

      <div class="intro-p2">
        <nav class="intro-nav" aria-label="เมนูหลัก">
          <ul class="nav-l"></ul>
          <p class="intro-caption"></p>
          <ul class="nav-r"></ul>
        </nav>
        <div class="intro-titlebox">
          <div class="intro-title"></div>
          <div class="intro-subtitle"></div>
        </div>
        <button type="button" class="intro-scrollcue"></button>
      </div>`;
    body.prepend(intro);
    root.classList.add('intro-ready');

    // เฟส 1: ข้อความทยอยขึ้นทีละตัว
    const textEl = intro.querySelector('.intro-text');
    const chars = splitChars(CONFIG.introText);
    const step = Math.min(0.07, 1.5 / Math.max(chars.length, 1));
    textEl.style.setProperty('--step', step + 's');
    chars.forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c === ' ' ? '\u00A0' : c;
      s.style.setProperty('--i', i);
      textEl.append(s);
    });
    const lineDelay = 0.9 + chars.length * step + 0.35;
    intro.style.setProperty('--line-delay', lineDelay + 's');

    // เฟส 2: ชื่อเรื่อง / บรรทัดที่สอง / คำบรรยาย / แถบ
    intro.querySelector('.intro-title').textContent = CONFIG.introTitle;
    intro.querySelector('.intro-caption').textContent = CONFIG.introCaption;
    intro.querySelector('.intro-subtitle').textContent = CONFIG.introSubtitle;
    buildBands(intro.querySelector('.bands-stage'));

    // เมนูด้านบน
    let n = 0;
    [['.nav-l', CONFIG.navLeft], ['.nav-r', CONFIG.navRight]].forEach(([sel, items]) => {
      const ul = intro.querySelector(sel);
      (items || []).forEach(item => {
        const li = document.createElement('li');
        li.style.setProperty('--n', n++);
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        a.addEventListener('click', (e) => { e.preventDefault(); goTo(item.href); });
        li.append(a);
        ul.append(li);
      });
    });

    // ปุ่ม SCROLL
    const cue = intro.querySelector('.intro-scrollcue');
    if (CONFIG.scrollText) {
      cue.textContent = CONFIG.scrollText;
      cue.addEventListener('click', (e) => { e.stopPropagation(); leave(); });
    } else {
      cue.remove();
    }

    // เวลา: เฟส 1 จบ (ข้อความ + เส้นลาก + หยุดค้าง) → เฟส 2 → จางเข้า hero
    setTimeout(goPhase2, (lineDelay + 1) * 1000 + CONFIG.introHold);

    // ผู้ใช้เลื่อนเมาส์ลง / ปัดนิ้วขึ้น / กดปุ่มลูกศรลง-Space-PageDown / คลิกเฟส 1 = ไปต่อ
    addEventListener('wheel', (e) => { if (e.deltaY > 0) advance(); }, { passive: true });

    let touchY = null;
    addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchmove', (e) => {
      if (touchY !== null && touchY - e.touches[0].clientY > 30) { touchY = null; advance(); }
    }, { passive: true });

    addEventListener('keydown', (e) => {
      if (['ArrowDown', 'PageDown', ' ', 'End', 'Enter'].includes(e.key) && e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') advance();
      if (e.key === 'Escape') { goPhase2(); leave(); }
    });

    intro.addEventListener('click', () => { if (!phase2At) goPhase2(); });   // คลิกระหว่างเฟส 1 = ข้ามไปเฟส 2
  };


  if (reduce) {
    // ผู้ใช้ปิดแอนิเมชันในระบบ (เช่น Windows: Show animations = Off) → ข้ามอินโทร
    root.classList.add('intro-done');
    finished = true;
  } else {
    buildIntro();
  }
})();