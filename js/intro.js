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
    introText: 'SPLReader',

    // เฟส 2: ชื่อเรื่องตัวใหญ่กลางจอ / บรรทัดที่สองใต้ชื่อ (ตัวอักษรจีน) / คำบรรยายเล็กด้านบน
    introTitle:    'มหาสงครามข้ามดวงดาว',
    introSubtitle: '大英雄时代',             // ใส่ '' ถ้าไม่ต้องการบรรทัดที่สอง
    introCaption:  'SPLReader  ·  Book Recommended Site',

    // แถวโค้ดเรืองแสงในแถบ 3 มิติ (ใส่ไทย/อังกฤษ/สัญลักษณ์ได้)
    codeLines: [
      'ผู้ใดใจคิดคด ไพร่ฟ้าหมดศรัทธา แม้นมีทัพแกร่งกล้า ก็หมดท่าไร้เดโช',
      'มิอวดอ้างนามตน จึงมีชื่อระบือไกล มิอวดโอ้ทะนงตน จึงรู้แยกแยะผิดชอบ',
      'มิฝักใฝ่ยศถาบรรดาศักดิ์ตน จึงมีผลสำเร็จได้ มิอวดโอ้ยกตน จึงยืนหยัดยืนยง',
      
    ],

    // ข้อความภาษาไทยในแถบ 3 มิติ (ตัวอักษรล้วน ไม่มีแถบไฮไลท์)
    bandLines: [
      'ขอพลีกายสลายสิ้นสู่ธุลี ขจรทั่วสายนทีแห่งดารา',
      'มาตรแม้นมีถ้อยคำนับพันหมื่น มิอาจฝืนต้องสูญสิ้นเมื่ออาสัญ',
      'ธุลีดาราสลายสิ้นแล้ว ราตรีคลาแคล้วอรุณฉายฉาน'
    ],

    bandRows: 10,           // จำนวนแถวในแถบ 3 มิติ
    textOpacity: 0.12,      // ความจางของตัวอักษรในแถบ (0 = มองไม่เห็น, 1 = ชัดเต็มที่)

    // ความเร็ว (ms)
    introHold:  600,        // หยุดค้างหลังเส้นลากเสร็จ ก่อนเข้าเฟส 2
    phase2Hold: 3000        // เฟส 2 แสดงนานเท่าไร ก่อนจางเข้าสู่ hero
  };


  const root   = document.documentElement;
  const body   = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // แยกตัวอักษรแบบ grapheme เพื่อไม่ให้สระ/วรรณยุกต์ไทยหลุดจากพยัญชนะ
  const splitChars = (str) => {
    if ('Segmenter' in Intl) {
      return Array.from(new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(str), s => s.segment);
    }
    return Array.from(str);
  };

  let intro    = null;
  let finished = false;
  let leaving  = false;

  const finishIntro = () => {
    if (finished) return;
    finished = true;
    root.classList.add('intro-done');          // ปลดล็อกเลื่อนหน้า + เริ่มแอนิเมชัน hero เดิม
    if (intro) setTimeout(() => intro.remove(), 1800);
  };

  const leave = () => {
    if (leaving) return;
    leaving = true;
    if (intro) intro.classList.add('is-leaving');   // อินโทรจางออก
    setTimeout(finishIntro, 400);                   // hero เริ่มขึ้นระหว่างอินโทรกำลังจาง
  };

  const goPhase2 = () => {
    if (leaving || !intro) return;
    intro.classList.add('phase-2');
    setTimeout(leave, CONFIG.phase2Hold);
  };


  /* ---------- แถบ 3 มิติ (อยู่ในอินโทรเท่านั้น) ---------- */
  const buildBands = (stage) => {
    const SEP = '    ✦    ';
    const N   = CONFIG.bandRows;
    const FAINT = CONFIG.textOpacity;
    let codeIdx = 0, barIdx = 0;

    for (let r = 0; r < N; r++) {
      const isBar = CONFIG.bandLines.length && r % 3 === 1;
      const src   = isBar ? CONFIG.bandLines : CONFIG.codeLines;
      if (!src.length) continue;
      const idx   = isBar ? barIdx++ : codeIdx++;
      const text  = src[idx % src.length];

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
      bar.style.left  = (Math.random() * 80) + '%';
      bar.style.top   = (Math.random() * 90) + '%';
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
    intro.setAttribute('aria-hidden', 'true');
    intro.innerHTML = `
      <div class="intro-mesh">
        <i class="intro-blob b1"></i><i class="intro-blob b2"></i>
        <i class="intro-blob b3"></i><i class="intro-blob b4"></i>
      </div>

      <div class="intro-bands"><div class="bands-stage"></div></div>

      <div class="intro-stage">
        <p class="intro-text"></p>
        <i class="intro-line"></i>
      </div>

      <div class="intro-p2">
        <p class="intro-caption"></p>
        <div class="intro-titlebox">
          <div class="intro-title"></div>
          <div class="intro-subtitle"></div>
        </div>
      </div>`;
    body.prepend(intro);
    root.classList.add('intro-ready');

    // เฟส 1: ข้อความทยอยขึ้นทีละตัว
    const textEl = intro.querySelector('.intro-text');
    const chars  = splitChars(CONFIG.introText);
    const step   = Math.min(0.07, 1.5 / Math.max(chars.length, 1));
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
    intro.querySelector('.intro-title').textContent   = CONFIG.introTitle;
    intro.querySelector('.intro-caption').textContent = CONFIG.introCaption;
    intro.querySelector('.intro-subtitle').textContent = CONFIG.introSubtitle;
    buildBands(intro.querySelector('.bands-stage'));

    // เวลา: เฟส 1 จบ (ข้อความ + เส้นลาก + หยุดค้าง) → เฟส 2 → จางเข้า hero
    setTimeout(goPhase2, (lineDelay + 1) * 1000 + CONFIG.introHold);

    // คลิก/แตะ = ข้ามไปที่ hero ทันที
    intro.addEventListener('click', leave);
  };


  if (reduce) {
    // ผู้ใช้ปิดแอนิเมชันในระบบ (เช่น Windows: Show animations = Off) → ข้ามอินโทร
    root.classList.add('intro-done');
    finished = true;
  } else {
    buildIntro();
    // กันพลาด: ถ้ามีอะไรค้าง ปลดล็อกหน้าเว็บภายใน 16 วินาที
    setTimeout(() => { leave(); finishIntro(); }, 16000);
  }
})();