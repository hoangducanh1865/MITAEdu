/* ================================================
   MoonEdu — app.js
   ================================================ */

// ── CAROUSEL ──────────────────────────────────
let currentSlide = 0;
const totalSlides = 3;
let autoTimer;

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
  resetTimer();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
  resetTimer();
}

function goToSlide(n) {
  currentSlide = n;
  updateCarousel();
  resetTimer();
}

function resetTimer() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 4500);
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCarousel();
  resetTimer();

  // Highlight active nav icon based on current page
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-icon').forEach(el => {
    el.classList.remove('active');
    if (el.getAttribute('href') === page) el.classList.add('active');
  });

  // Access code button modal placeholder
  document.querySelectorAll('.access-code-btn, .access-code-big').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showAccessModal();
    });
  });
});

// ── ACCESS CODE MODAL ─────────────────────────
function showAccessModal() {
  if (document.getElementById('accessModal')) return;
  const modal = document.createElement('div');
  modal.id = 'accessModal';
  modal.innerHTML = `
    <div class="modal-backdrop" id="modalBackdrop"></div>
    <div class="modal-box">
      <button class="modal-close" id="modalClose"><i class="fas fa-times"></i></button>
      <div class="modal-icon"><i class="fas fa-key"></i></div>
      <h2 class="modal-title">Nhập Mã Truy Cập</h2>
      <p class="modal-desc">Nhập mã được cung cấp để mở khóa khóa học của bạn.</p>
      <input class="modal-input" id="codeInput" type="text" placeholder="Nhập mã tại đây..." />
      <button class="modal-submit" id="modalSubmit">Xác nhận</button>
    </div>
  `;
  // inline styles for modal
  const style = document.createElement('style');
  style.id = 'modalStyle';
  style.textContent = `
    #accessModal { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center; justify-content: center; }
    .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,.45); backdrop-filter: blur(3px); }
    .modal-box {
      position: relative; background: #fff; border-radius: 18px; padding: 36px 32px;
      width: 360px; max-width: 95vw; text-align: center;
      box-shadow: 0 12px 40px rgba(0,0,0,.18);
      animation: popIn .25s ease;
    }
    @keyframes popIn { from { transform: scale(.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .modal-close {
      position: absolute; top: 14px; right: 16px;
      background: #f5f5f5; border: none; border-radius: 50%;
      width: 32px; height: 32px; cursor: pointer; font-size: 1rem; color: #555;
    }
    .modal-close:hover { background: #ffe0e0; color: #c62828; }
    .modal-icon { font-size: 2.6rem; color: #d32f2f; margin-bottom: 10px; }
    .modal-title { font-family: 'Nunito', sans-serif; font-size: 1.4rem; font-weight: 900; margin-bottom: 8px; }
    .modal-desc  { font-size: .88rem; color: #777; margin-bottom: 20px; }
    .modal-input {
      width: 100%; border: 2px solid #f0d5d5; border-radius: 10px;
      padding: 11px 16px; font-family: inherit; font-size: .95rem;
      outline: none; margin-bottom: 14px; transition: border-color .2s;
    }
    .modal-input:focus { border-color: #d32f2f; }
    .modal-submit {
      width: 100%; background: #d32f2f; color: #fff;
      border: none; border-radius: 10px; padding: 12px;
      font-family: inherit; font-size: .95rem; font-weight: 700; cursor: pointer;
      transition: background .2s;
    }
    .modal-submit:hover { background: #b71c1c; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalSubmit').addEventListener('click', () => {
    const val = document.getElementById('codeInput').value.trim();
    if (!val) { document.getElementById('codeInput').style.borderColor = '#e53935'; return; }
    alert(`Mã "${val}" đã được gửi đi xác nhận!`);
    closeModal();
  });
}

function closeModal() {
  document.getElementById('accessModal')?.remove();
  document.getElementById('modalStyle')?.remove();
}

// ── COURSES SLIDER ────────────────────────────
(function () {
  let cIdx = 0;
  const visibleCards = 3;

  function initCourseSlider() {
    const slider = document.getElementById('coursesSlider');
    const prevBtn = document.getElementById('coursePrev');
    const nextBtn = document.getElementById('courseNext');
    if (!slider || !prevBtn || !nextBtn) return;

    const cards = slider.querySelectorAll('.course-card');
    const maxIdx = Math.max(0, cards.length - visibleCards);

    function updateSlider() {
      const cardW = cards[0].offsetWidth + 16; // gap = 16
      slider.style.transform = `translateX(-${cIdx * cardW}px)`;
    }

    nextBtn.addEventListener('click', () => {
      if (cIdx < maxIdx) { cIdx++; updateSlider(); }
    });
    prevBtn.addEventListener('click', () => {
      if (cIdx > 0) { cIdx--; updateSlider(); }
    });

    window.addEventListener('resize', updateSlider);
  }

  document.addEventListener('DOMContentLoaded', initCourseSlider);
})();

// ── AVATAR DROPDOWN (global) ──────────────────
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Find the avatar div in the main navbar
    document.querySelectorAll('.avatar').forEach(function(av){
      av.style.position = 'relative';
      av.style.cursor = 'pointer';

      // Create dropdown
      var dd = document.createElement('div');
      dd.className = 'av-dropdown';
      dd.innerHTML =
        '<a href="profile.html" class="av-dd-item"><i class="fas fa-user-cog"></i> Thông tin tài khoản</a>' +
        '<a href="login.html" class="av-dd-item av-dd-logout"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>';
      av.appendChild(dd);

      av.addEventListener('click', function(e){
        e.stopPropagation();
        dd.classList.toggle('av-dd-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function(){
      document.querySelectorAll('.av-dropdown').forEach(function(d){
        d.classList.remove('av-dd-open');
      });
    });
  });
})();
