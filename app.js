// ================== APP.JS (NO MODAL) ==================

// Ripple cho các ô .nav-chip
function addRipple(e){
  const chip = e.currentTarget;
  const rect = chip.getBoundingClientRect();
  const span = document.createElement('span');
  span.className = 'ripple';
  span.style.left = (e.clientX - rect.left) + 'px';
  span.style.top  = (e.clientY - rect.top)  + 'px';
  chip.appendChild(span);
  span.addEventListener('animationend', () => span.remove());
}
document.querySelectorAll('.nav-chip').forEach(chip => {
  chip.addEventListener('click', addRipple);
});

// Hiệu ứng "page wipe" trước khi điều hướng link trong thanh đáy
document.addEventListener('click', (e) => {
  const a = e.target.closest('.bottom-bar a');   // chỉ bắt link ở thanh đáy
  if (!a) return;
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || a.target === '_blank') return;

  const href = a.getAttribute('href');
  if (!href) return;

  e.preventDefault();
  document.body.classList.add('is-transitioning');
  setTimeout(() => { window.location.href = href; }, 550); // khớp CSS .55s
});
// ====== Snap Scroller: cuộn có độ trễ giữa các slide ======
(function initSnapScroller() {
  // Tắt nếu người dùng prefer-reduced-motion
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mqReduce.matches) return;

  const containers = document.querySelectorAll('.snap-y');
  if (!containers.length) return;

  containers.forEach(container => attachSnapScroll(container, {
    delay: 700,           // ms: độ trễ giữa 2 lần cuộn
    threshold: 0.35       // phần trăm chiều cao slide cần vượt qua để coi là "đang ở slide đó"
  }));
})();

function attachSnapScroll(container, opts) {
  const delay = Math.max(200, Number(opts?.delay) || 700);
  const threshold = Math.min(0.9, Math.max(0.1, Number(opts?.threshold) || 0.35));
  let locked = false;     // chặn spam cuộn trong khi đang animate

  // Giúp tính toạ độ tương đối so với container
  const getTopWithin = el => {
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    return (eRect.top - cRect.top) + container.scrollTop;
  };

  const slides = () => Array.from(container.querySelectorAll('.snap-slide'));

  // Tìm index slide hiện tại (gần mép trên container nhất)
  function currentIndex() {
    const list = slides();
    const cRect = container.getBoundingClientRect();
    let idx = 0, best = Infinity;
    list.forEach((el, i) => {
      const dist = Math.abs(el.getBoundingClientRect().top - cRect.top);
      if (dist < best) { best = dist; idx = i; }
    });
    return idx;
  }

  // Cuộn đến index chỉ định
  function goTo(i) {
    const list = slides();
    if (i < 0 || i >= list.length) return;
    const targetTop = getTopWithin(list[i]);
    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  }

  // Wheel: cuộn theo từng slide, có độ trễ
  container.addEventListener('wheel', (e) => {
    // Cho phép giữ Ctrl/Meta để zoom / override của trình duyệt
    if (e.ctrlKey || e.metaKey) return;

    if (locked) { e.preventDefault(); return; }
    const dir = e.deltaY > 0 ? 1 : -1;
    const list = slides();
    if (!list.length) return;

    // Nếu người dùng đang đứng giữa 2 slide, xác định slide gần nhất theo threshold
    const i = currentIndex();
    let target = i + dir;

    // Ràng buộc biên
    target = Math.max(0, Math.min(list.length - 1, target));

    // Khoá và cuộn
    locked = true;
    goTo(target);
    e.preventDefault();

    // Mở khoá sau delay
    setTimeout(() => { locked = false; }, delay);
  }, {
(() => {
  // Chặn menu chuột phải toàn trang
  document.addEventListener('contextmenu', e => e.preventDefault(), { capture: true });

  // Chặn kéo-thả (đặc biệt là ảnh)
  document.addEventListener('dragstart', e => e.preventDefault(), { capture: true });

  // Chặn copy/cut/paste
  const block = e => e.preventDefault();
  document.addEventListener('copy',  block, { capture: true });
  document.addEventListener('cut',   block, { capture: true });
  document.addEventListener('paste', block, { capture: true });

  // Chặn một số phím tắt phổ biến: Ctrl+S, Ctrl+U, Ctrl+P, Ctrl+Shift+I/C/J, F12
  document.addEventListener('keydown', e => {
    const k = e.key?.toLowerCase();
    const isCtrl = e.ctrlKey || e.metaKey;

    const blocked =
      (isCtrl && (k === 's' || k === 'u' || k === 'p')) ||           // Ctrl+S/U/P
      (isCtrl && e.shiftKey && (k === 'i' || k === 'c' || k === 'j')) || // Ctrl+Shift+I/C/J
      (e.key === 'F12');

    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });

  // Tuỳ chọn: vô hiệu hoá pointer-events với <img> để khó click/lưu ảnh
  // (nếu bạn có ảnh cần click, đừng bật dòng dưới)
  // document.querySelectorAll('img').forEach(img => img.style.pointerEvents = 'none');
})();
<script>
  (function(){
    const spot = document.querySelector('.wj-hotspot');
    const warp = document.getElementById('warpBW');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if(spot){
      spot.addEventListener('click', function(e){
        e.preventDefault();
        const target = this.getAttribute('href') || 'work.html';
        if(!prefersReduced){
          warp.classList.add('on');
          setTimeout(()=>{ window.location.href = target; }, 900);
        }else{
          window.location.href = target;
        }
      });
    }

    // Nút lên đầu trang (nếu dùng)
    const toTop = document.getElementById('toTop');
    if(toTop){
      toTop.addEventListener('click', function(e){
        e.preventDefault();
        toTop.classList.remove('fly'); void toTop.offsetWidth; toTop.classList.add('fly');
        window.scrollTo({ top:0, behavior:'smooth' });
        setTimeout(()=> toTop.classList.remove('fly'), 900);
      });
    }
  })();
</script>
