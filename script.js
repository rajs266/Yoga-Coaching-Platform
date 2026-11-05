(function initSaPreloader() {
  if (window.__saPreloaderStarted) return;
  var DURATION = 1800;
  document.documentElement.classList.add('preloader-active');
  function hidePreloader() {
    var el = document.getElementById('sa-preloader');
    document.documentElement.classList.remove('preloader-active');
    if (!el || el.classList.contains('is-done')) return;
    el.classList.add('is-done');
    window.setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 600);
  }
  window.setTimeout(hidePreloader, DURATION);

  // Handle browser back/forward navigation (bfcache)
  window.addEventListener('pageshow', function (event) {
    hidePreloader();
    // Remove loading state from submit buttons if user navigates back
    document.querySelectorAll('.btn.loading, button.loading').forEach(function (btn) {
      btn.classList.remove('loading');
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Ultimate 3D Multi-Layer Animation Cursor + Prana Particle Trail
     ========================================================================== */
  const isTouch = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);
  if (!isTouch) {
    const cursorAura = document.createElement('div');
    cursorAura.classList.add('cursor-aura');
    document.body.appendChild(cursorAura);

    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.classList.add('cursor-outline');
    document.body.appendChild(cursorOutline);

    let lastParticleTime = 0;
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 140, fill: 'forwards' }
      );
      cursorAura.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 320, fill: 'forwards' }
      );

      const now = performance.now();
      if (now - lastParticleTime > 42) {
        lastParticleTime = now;
        const p = document.createElement('span');
        p.className = 'cursor-particle';
        const size = Math.random() * 5 + 3;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${posX}px`;
        p.style.top = `${posY}px`;
        p.style.setProperty('--dx', `${(Math.random() - 0.5) * 34}px`);
        p.style.setProperty('--dy', `${-Math.random() * 28 - 8}px`);
        document.body.appendChild(p);
        setTimeout(() => {
          if (p.parentNode) p.parentNode.removeChild(p);
        }, 750);
      }
    });

    const bindHoverTargets = () => {
      const interactables = document.querySelectorAll(
        'a, button, .card, .card-light, .facility-card, .coach-card, .membership-card, .feature-tile, .stat-chip, .glass-card, .play-btn-wrapper, .dash-card, .faq-q, .hero-slide-dot, .role-option'
      );
      interactables.forEach((el) => {
        if (el.dataset.cursorBound === '1') return;
        el.dataset.cursorBound = '1';
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    };
    bindHoverTargets();

    /* 3D Interactive Tilt on Cards */
    const tiltCards = document.querySelectorAll(
      '.facility-card, .coach-card, .feature-tile, .stat-chip, .card-light:not(.pricing-card), .membership-card'
    );
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (ev) => {
        const rect = card.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        card.style.transform = `perspective(900px) translateY(-10px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     2. Navbar Scroll & Mobile Drawer
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else if (!navbar.dataset.keepScrolled) {
        navbar.classList.remove('scrolled');
      }
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const backToTopBtn = document.querySelector('a[href="#"]');
      if (backToTopBtn && backToTopBtn.style.position === 'fixed') {
        backToTopBtn.style.display = navLinks.classList.contains('active') ? 'flex' : 'none';
      }
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }
  if (mobileCloseBtn && navLinks) {
    mobileCloseBtn.addEventListener('click', () => {
      const backToTopBtn = document.querySelector('a[href="#"]');
      if (backToTopBtn && backToTopBtn.style.position === 'fixed') {
        backToTopBtn.style.display = 'flex';
      }
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  /* Active Nav Link */
  let currentPath = window.location.pathname.split('/').pop();
  if (!currentPath || currentPath === '') currentPath = 'index.html';
  document.querySelectorAll('.nav-links > a').forEach((link) => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath) link.classList.add('active');
    else link.classList.remove('active');
  });

  /* ==========================================================================
     3. Scroll Reveal IntersectionObserver
     ========================================================================== */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document
    .querySelectorAll('.reveal, .anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-zoom-in')
    .forEach((el) => observer.observe(el));

  /* ==========================================================================
     4. Home Page 4-Image Slideshow (#heroSlideshow)
     ========================================================================== */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-slide-dot');
  const heroSlideCaption = document.getElementById('heroSlideCaption');
  if (heroSlides.length > 0) {
    let currentSlide = 0;
    const captions = [
      '01 / Sunrise Vinyasa Sanctuary',
      '02 / Aerial Silk & Yin Flow',
      '03 / Himalayan Sound & Pranayama',
      '04 / Infrared Ashtanga Mastery'
    ];
    const showSlide = (idx) => {
      currentSlide = (idx + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
      heroDots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      if (heroSlideCaption) {
        heroSlideCaption.textContent = captions[currentSlide] || '';
      }
    };
    let slideTimer = setInterval(() => showSlide(currentSlide + 1), 4500);
    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        showSlide(idx);
        slideTimer = setInterval(() => showSlide(currentSlide + 1), 4500);
      });
    });
  }

  /* ==========================================================================
     5. Interactive Pranayama Breathwork Pacer (if present on page)
     ========================================================================== */
  const breathOrb = document.getElementById('breathOrb');
  const breathLabel = document.getElementById('breathPhaseLabel') || document.getElementById('breathLabel');
  const breathTimerText = document.getElementById('breathTimerLabel') || document.getElementById('breathTimerText');
  const breathToggleBtn = document.getElementById('toggleBreathBtn') || document.getElementById('breathToggleBtn');
  const breathResetBtn = document.getElementById('resetBreathBtn');
  const breathCycleCount = document.getElementById('breathCycleCount');
  const breathProgressFill = document.getElementById('breathProgressFill');
  const breathOrbIcon = document.getElementById('breathOrbIcon');
  const breathPills = document.querySelectorAll('.breath-pill[data-phase]');

  if (breathOrb && breathLabel && breathToggleBtn) {
    let breathingActive = false;
    const phases = [
      { cls: 'inhale', text: 'INHALE', sec: 4, icon: 'fa-lungs' },
      { cls: 'hold', text: 'HOLD', sec: 4, icon: 'fa-spa' },
      { cls: 'exhale', text: 'EXHALE', sec: 6, icon: 'fa-wind' }
    ];
    let phaseIdx = 0;
    let secLeft = phases[0].sec;
    let cyclesCompleted = 0;

    const syncPillsAndProgress = () => {
      const p = phases[phaseIdx];
      breathPills.forEach((pill, i) => {
        pill.classList.toggle('active', i === phaseIdx);
      });
      if (breathProgressFill) {
        const elapsed = p.sec - secLeft;
        const pct = breathingActive ? Math.min(100, Math.round(((elapsed + 1) / p.sec) * 100)) : 0;
        breathProgressFill.style.width = `${pct}%`;
      }
      if (breathOrbIcon) {
        breathOrbIcon.className = `fas ${p.icon} breath-orb__icon`;
      }
    };

    const updateBreathUI = () => {
      const p = phases[phaseIdx];
      breathLabel.textContent = p.text;
      if (breathTimerText) breathTimerText.textContent = `${secLeft}s`;
      if (breathingActive) {
        breathOrb.className = 'breath-orb ' + p.cls;
      } else {
        breathOrb.className = 'breath-orb';
      }
      syncPillsAndProgress();
    };

    // Initial idle state: Ready on Inhale 4s, button shows Play Breath Guide
    updateBreathUI();

    setInterval(() => {
      if (!breathingActive) return;
      secLeft--;
      if (secLeft <= 0) {
        phaseIdx = (phaseIdx + 1) % phases.length;
        if (phaseIdx === 0) {
          cyclesCompleted++;
          if (breathCycleCount) {
            breathCycleCount.textContent = `${cyclesCompleted} ${cyclesCompleted === 1 ? 'Cycle' : 'Cycles'}`;
          }
        }
        secLeft = phases[phaseIdx].sec;
      }
      updateBreathUI();
    }, 1000);

    breathToggleBtn.addEventListener('click', () => {
      breathingActive = !breathingActive;
      if (breathingActive) {
        breathToggleBtn.innerHTML = '<i class="fas fa-pause" style="margin-left:0;margin-right:8px;"></i> Pause Breath Guide';
        updateBreathUI();
      } else {
        breathToggleBtn.innerHTML = '<i class="fas fa-play" style="margin-left:0;margin-right:8px;"></i> Play Breath Guide';
        breathOrb.className = 'breath-orb';
        if (breathProgressFill) breathProgressFill.style.width = '0%';
      }
    });

    if (breathResetBtn) {
      breathResetBtn.addEventListener('click', () => {
        breathingActive = false;
        phaseIdx = 0;
        secLeft = phases[0].sec;
        cyclesCompleted = 0;
        if (breathCycleCount) {
          breathCycleCount.textContent = '0 Cycles';
        }
        breathToggleBtn.innerHTML = '<i class="fas fa-play" style="margin-left:0;margin-right:8px;"></i> Play Breath Guide';
        updateBreathUI();
      });
    }
  }

  /* ==========================================================================
     6. Sanctuary Video Modal with Interactive Guided Yoga Flow Visualizer
     ========================================================================== */
  const playBtn = document.querySelector('.play-btn-wrapper');
  const videoModal = document.getElementById('videoModal');
  window.openVideoModal = () => {
    if (!videoModal) return;
    const modalVideo = videoModal.querySelector('video');
    videoModal.classList.add('active');
    if (modalVideo) modalVideo.play().catch(() => {});
  };
  window.closeVideoModal = (e) => {
    if (!videoModal) return;
    if (e && e.target && e.target !== videoModal && !e.target.classList.contains('close-modal')) return;
    const modalVideo = videoModal.querySelector('video');
    videoModal.classList.remove('active');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  };
  if (playBtn && videoModal) {
    const closeModal = videoModal.querySelector('.close-modal');
    playBtn.addEventListener('click', () => window.openVideoModal());
    if (closeModal) closeModal.addEventListener('click', (e) => window.closeVideoModal(e));
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) window.closeVideoModal(e);
    });
  }
});

/* ==========================================================================
   7. StacklyAuth, KickToast, StacklyForms, StacklySelect
   ========================================================================== */
window.StacklyAuth = {
  KEY: 'stackly_user',
  getUser: function () {
    try {
      var raw = localStorage.getItem(this.KEY) || sessionStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  setUser: function (user) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
    try {
      sessionStorage.setItem(this.KEY, JSON.stringify(user));
    } catch (e) {}
  },
  clearUser: function () {
    localStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.KEY);
  },
  isLoggedIn: function () {
    var u = this.getUser();
    return !!(u && u.loggedIn);
  },
  requireAuth: function (role) {
    var u = this.getUser();
    if (!u || !u.loggedIn) {
      window.location.href = 'signin.html';
      return null;
    }
    var userRole = (u.role === 'admin') ? 'admin' : 'member';
    var reqRole = (role === 'admin') ? 'admin' : 'member';
    if (reqRole === 'admin' && userRole !== 'admin') {
      window.location.href = 'member-dashboard.html';
      return null;
    }
    if (reqRole === 'member' && userRole === 'admin') {
      window.location.href = 'admin-dashboard.html';
      return null;
    }
    return u;
  },
  dashboardFor: function (role) {
    return role === 'admin' ? 'admin-dashboard.html' : 'member-dashboard.html';
  }
};

window.KickToast = {
  ensureHost: function () {
    var host = document.getElementById('kickToastHost');
    if (!host) {
      host = document.createElement('div');
      host.id = 'kickToastHost';
      host.className = 'kick-toast-host';
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    return host;
  },
  show: function (message, type, title) {
    type = type || 'success';
    title = title || (type === 'error' ? 'Mindful Pause' : type === 'info' ? 'Sanctuary Note' : 'Namaste');
    var icons = { success: 'fa-spa', error: 'fa-circle-exclamation', info: 'fa-om' };
    var host = this.ensureHost();
    var el = document.createElement('div');
    el.className = 'kick-toast kick-toast--' + type;
    el.innerHTML =
      '<div class="kick-toast__badge"><i class="fas ' + (icons[type] || 'fa-spa') + '"></i></div>' +
      '<div class="kick-toast__body"><div class="kick-toast__title">' + title + '</div>' +
      '<div class="kick-toast__msg">' + message + '</div></div>' +
      '<div class="kick-toast__bar"><span></span></div>';
    host.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 350);
    }, 3200);
  }
};

window.StacklyForms = {
  isName: function (v) {
    return /^[a-zA-Z\s.'-]+$/.test((v || '').trim()) && (v || '').trim().length >= 2;
  },
  isEmail: function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
  },
  isPassword: function (v) {
    return (v || '').length >= 6;
  },
  isPhone: function (v) {
    if (!v || !String(v).trim()) return true;
    var digits = String(v).replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  },
  setGroupError: function (elOrGroup, on, msg) {
    if (!elOrGroup) return;
    var group = elOrGroup.classList && elOrGroup.classList.contains('form-group')
      ? elOrGroup
      : (elOrGroup.closest ? elOrGroup.closest('.form-group') : elOrGroup);
    if (!group) return;
    var err = group.querySelector('.form-error');
    if (on) {
      group.classList.add('has-error');
      if (err && msg) err.textContent = msg;
    } else {
      group.classList.remove('has-error');
    }
  }
};

window.StacklySelect = {
  closeAll: function (except) {
    document.querySelectorAll('.sa-select.is-open').forEach(function (wrap) {
      if (except && wrap === except) return;
      wrap.classList.remove('is-open');
      var menu = wrap._saMenu;
      if (menu) menu.style.display = 'none';
      var btn = wrap.querySelector('.sa-select__btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  },
  positionMenu: function (btn, menu) {
    var rect = btn.getBoundingClientRect();
    var pad = 12;
    var docEl = document.documentElement;
    var vw = Math.max(320, docEl.clientWidth || window.innerWidth || 360);
    var vh = Math.max(320, window.innerHeight || docEl.clientHeight || 600);

    // Available width strictly inside screen boundaries
    var maxSafeW = Math.max(100, vw - pad * 2);
    // Menu width defaults to button width, bounded by screen width
    var width = Math.min(rect.width, maxSafeW);
    if (width < 200 && maxSafeW >= 200) width = Math.min(260, maxSafeW);

    // Initial left aligned with button
    var left = rect.left;

    // Strict boundary checks: never let menu go beyond right or left edge of screen
    if (left + width > vw - pad) {
      left = vw - pad - width;
    }
    if (left < pad) {
      left = pad;
      width = Math.min(width, vw - pad * 2);
    }

    menu.style.display = 'block';
    menu.style.boxSizing = 'border-box';
    menu.style.width = Math.floor(width) + 'px';
    menu.style.maxWidth = Math.floor(vw - pad * 2) + 'px';
    menu.style.left = Math.floor(left) + 'px';
    menu.style.right = 'auto';

    var spaceBelow = vh - rect.bottom - pad;
    var spaceAbove = rect.top - pad;
    var menuH = Math.min(menu.scrollHeight || 180, Math.min(240, vh * 0.45));

    if (spaceBelow < 150 && spaceAbove > spaceBelow) {
      menu.style.maxHeight = Math.min(menuH, Math.max(80, spaceAbove - 6)) + 'px';
      menu.style.top = Math.max(pad, rect.top - parseFloat(menu.style.maxHeight || menuH) - 6) + 'px';
    } else {
      menu.style.maxHeight = Math.min(menuH, Math.max(80, spaceBelow - 6)) + 'px';
      menu.style.top = Math.min(rect.bottom + 6, vh - pad - 60) + 'px';
    }
  },
  enhance: function (select) {
    if (!select || select.dataset.saSelect === '1') return;
    select.dataset.saSelect = '1';

    var wrap = document.createElement('div');
    wrap.className = 'sa-select';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.classList.add('sa-select__native');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sa-select__btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="sa-select__btn-label"></span><i class="fas fa-chevron-down" aria-hidden="true"></i>';
    wrap.appendChild(btn);

    var menu = document.createElement('div');
    menu.className = 'sa-select__menu';
    menu.setAttribute('role', 'listbox');
    document.body.appendChild(menu);
    wrap._saMenu = menu;

    var labelEl = btn.querySelector('.sa-select__btn-label');

    function syncLabel() {
      var opt = select.options[select.selectedIndex];
      labelEl.textContent = opt ? opt.textContent : 'Select';
    }

    function rebuildOptions() {
      menu.innerHTML = '';
      Array.prototype.forEach.call(select.options, function (opt, idx) {
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'sa-select__option' + (opt.selected ? ' is-selected' : '');
        item.setAttribute('role', 'option');
        item.disabled = !!opt.disabled;
        item.textContent = opt.textContent;
        item.dataset.index = String(idx);
        item.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (opt.disabled) return;
          select.selectedIndex = idx;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          syncLabel();
          window.StacklySelect.closeAll();
          btn.setAttribute('aria-expanded', 'false');
        });
        menu.appendChild(item);
      });
    }

    function openMenu() {
      window.StacklySelect.closeAll(wrap);
      rebuildOptions();
      wrap.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      window.StacklySelect.positionMenu(btn, menu);
    }

    function toggleMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      if (wrap.classList.contains('is-open')) {
        window.StacklySelect.closeAll();
        btn.setAttribute('aria-expanded', 'false');
      } else {
        openMenu();
      }
    }

    btn.addEventListener('click', toggleMenu);
    select.addEventListener('change', syncLabel);
    syncLabel();
  },
  init: function (root) {
    var scope = root || document;
    var selects = scope.querySelectorAll('select');
    selects.forEach(function (sel) {
      if (sel.closest('.dash-layout') || sel.closest('.auth-shell') || sel.classList.contains('js-sa-select')) {
        window.StacklySelect.enhance(sel);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.StacklySelect.init();
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.sa-select') && !e.target.closest('.sa-select__menu')) {
      window.StacklySelect.closeAll();
    }
  });
  window.addEventListener('resize', function () {
    document.querySelectorAll('.sa-select.is-open').forEach(function (wrap) {
      var btn = wrap.querySelector('.sa-select__btn');
      var menu = wrap._saMenu;
      if (btn && menu) window.StacklySelect.positionMenu(btn, menu);
    });
  });
  window.addEventListener('scroll', function () {
    document.querySelectorAll('.sa-select.is-open').forEach(function (wrap) {
      var btn = wrap.querySelector('.sa-select__btn');
      var menu = wrap._saMenu;
      if (btn && menu) window.StacklySelect.positionMenu(btn, menu);
    });
  }, true);

  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var open = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item.open').forEach(function (x) {
        x.classList.remove('open');
      });
      if (!open) item.classList.add('open');
    });
  });

  document.querySelectorAll('[data-auth-nav]').forEach(function (wrap) {
    if (wrap.classList.contains('mobile-auth-wrapper')) {
      wrap.innerHTML =
        '<a href="signin.html" class="btn btn-outline">Sign In</a>' +
        '<a href="signup.html" class="btn btn-primary">Get Started</a>';
    } else {
      wrap.innerHTML =
        '<a href="signin.html" class="btn btn-outline" style="padding: 10px 25px; font-size: 1.05rem;">Sign In</a>' +
        '<a href="signup.html" class="btn btn-primary" style="padding: 10px 25px; font-size: 1.05rem;">Get Started <i class="fas fa-arrow-right"></i></a>';
    }
  });

  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById('logoutModal');
      if (modal) modal.classList.add('show');
      else {
        window.StacklyAuth.clearUser();
        window.KickToast.show('Signed out peacefully. Namaste!', 'info', 'Session Ended');
        setTimeout(function () {
          window.location.href = 'signin.html';
        }, 900);
      }
    });
  });

  var confirmLogout = document.getElementById('confirmLogout');
  var cancelLogout = document.getElementById('cancelLogout');
  if (confirmLogout) {
    confirmLogout.addEventListener('click', function () {
      window.StacklyAuth.clearUser();
      window.location.href = 'signin.html';
    });
  }
  if (cancelLogout) {
    cancelLogout.addEventListener('click', function () {
      var modal = document.getElementById('logoutModal');
      if (modal) modal.classList.remove('show');
    });
  }
});

window.initPasswordToggles = function () {
  document.querySelectorAll('input[type="password"]').forEach(function (passInput) {
    if (passInput.dataset.hasToggle) return;
    passInput.dataset.hasToggle = 'true';
    if (passInput.closest('.password-input-wrapper')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'password-input-wrapper';
    passInput.parentNode.insertBefore(wrapper, passInput);
    wrapper.appendChild(passInput);
    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      toggleBtn.innerHTML = isPass
        ? '<i class="fa-solid fa-eye-slash" style="color:var(--accent);"></i>'
        : '<i class="fa-solid fa-eye"></i>';
    });
    wrapper.appendChild(toggleBtn);
  });
};

window.initMobileSidebar = function () {
  var dashSidebar = document.getElementById('dashSidebar');
  var menuToggle = document.getElementById('dashMenuToggle');
  var closeBtn = document.getElementById('closeSidebarBtn');
  var dashOverlay = document.getElementById('dashOverlay');
  if (!dashSidebar || !menuToggle) return;

  var lastToggleAt = 0;
  var mq = window.matchMedia('(max-width: 900px)');
  var layoutRoot = document.querySelector('.dash-layout');
  var sidebarHome = layoutRoot || dashSidebar.parentElement;
  var overlayHome = layoutRoot || (dashOverlay && dashOverlay.parentElement);

  if (!window.__dashSidebarHomeMarker) {
    window.__dashSidebarHomeMarker = document.createComment('dash-sidebar-home');
    if (dashSidebar.parentElement) {
      dashSidebar.parentElement.insertBefore(window.__dashSidebarHomeMarker, dashSidebar);
    }
  }
  if (dashOverlay && !window.__dashOverlayHomeMarker) {
    window.__dashOverlayHomeMarker = document.createComment('dash-overlay-home');
    if (dashOverlay.parentElement) {
      dashOverlay.parentElement.insertBefore(window.__dashOverlayHomeMarker, dashOverlay);
    }
  }

  function isMobileDash() {
    return mq.matches;
  }

  function clearForcedStyles(el) {
    if (!el) return;
    [
      'left', 'top', 'right', 'bottom', 'height', 'width', 'max-width',
      'transform', 'visibility', 'opacity', 'pointer-events', 'z-index',
      'display', 'transition', 'box-shadow', 'padding-top'
    ].forEach(function (prop) {
      el.style.removeProperty(prop);
    });
  }

  function moveToBody() {
    if (dashSidebar.parentElement !== document.body) {
      document.body.appendChild(dashSidebar);
    }
    if (dashOverlay && dashOverlay.parentElement !== document.body) {
      document.body.appendChild(dashOverlay);
    }
  }

  function restoreHome() {
    var sm = window.__dashSidebarHomeMarker;
    var om = window.__dashOverlayHomeMarker;
    if (sm && sm.parentNode) {
      sm.parentNode.insertBefore(dashSidebar, sm.nextSibling);
    } else if (sidebarHome && dashSidebar.parentElement !== sidebarHome) {
      sidebarHome.insertBefore(dashSidebar, sidebarHome.firstChild);
    }
    if (dashOverlay) {
      if (om && om.parentNode) {
        om.parentNode.insertBefore(dashOverlay, om.nextSibling);
      } else if (overlayHome && dashOverlay.parentElement !== overlayHome) {
        overlayHome.appendChild(dashOverlay);
      }
    }
  }

  function resetDesktopSidebar() {
    dashSidebar.classList.remove('open');
    if (dashOverlay) dashOverlay.classList.remove('show');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('dash-sidebar-open');
    document.documentElement.classList.remove('dash-sidebar-open');
    clearForcedStyles(dashSidebar);
    clearForcedStyles(dashOverlay);
    restoreHome();
  }

  function applyMobileClosedStyles() {
    moveToBody();
    dashSidebar.classList.remove('open');
    if (dashOverlay) dashOverlay.classList.remove('show');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('dash-sidebar-open');
    document.documentElement.classList.remove('dash-sidebar-open');
    dashSidebar.style.setProperty('left', '-105%', 'important');
    dashSidebar.style.setProperty('top', '60px', 'important');
    dashSidebar.style.setProperty('height', 'calc(100dvh - 60px)', 'important');
    dashSidebar.style.setProperty('transform', 'none', 'important');
    if (dashOverlay) {
      dashOverlay.style.removeProperty('display');
      dashOverlay.style.removeProperty('top');
    }
  }

  function openSidebar() {
    if (!isMobileDash()) return;
    moveToBody();
    dashSidebar.classList.add('open');
    if (dashOverlay) dashOverlay.classList.add('show');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('dash-sidebar-open');
    document.documentElement.classList.add('dash-sidebar-open');
    dashSidebar.style.setProperty('left', '0', 'important');
    dashSidebar.style.setProperty('top', '60px', 'important');
    dashSidebar.style.setProperty('height', 'calc(100dvh - 60px)', 'important');
    dashSidebar.style.setProperty('transform', 'none', 'important');
    dashSidebar.style.setProperty('visibility', 'visible', 'important');
    dashSidebar.style.setProperty('opacity', '1', 'important');
    dashSidebar.style.setProperty('pointer-events', 'auto', 'important');
    dashSidebar.style.setProperty('z-index', '1050', 'important');
    if (dashOverlay) {
      dashOverlay.style.setProperty('display', 'block', 'important');
      dashOverlay.style.setProperty('top', '60px', 'important');
    }
  }

  function closeSidebar() {
    if (isMobileDash()) applyMobileClosedStyles();
    else resetDesktopSidebar();
  }

  function toggleSidebar(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isMobileDash()) return;
    var now = Date.now();
    if (now - lastToggleAt < 350) return;
    lastToggleAt = now;
    if (dashSidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  }

  var lastMobileMode = null;

  function syncSidebarMode(force) {
    var mobile = isMobileDash();
    if (!force && mobile === lastMobileMode) {
      if (!mobile) resetDesktopSidebar();
      return;
    }
    lastMobileMode = mobile;
    if (mobile) applyMobileClosedStyles();
    else resetDesktopSidebar();
  }

  menuToggle.onclick = toggleSidebar;
  menuToggle.type = 'button';
  if (closeBtn) {
    closeBtn.onclick = function (e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeSidebar();
    };
    closeBtn.type = 'button';
  }
  if (dashOverlay) {
    dashOverlay.onclick = function (e) {
      if (e) e.preventDefault();
      closeSidebar();
    };
  }
  if (dashSidebar.dataset.navCloseBound !== '1') {
    dashSidebar.dataset.navCloseBound = '1';
    dashSidebar.addEventListener('click', function (e) {
      if (e.target.closest('.dash-nav-btn[data-target]') && isMobileDash()) closeSidebar();
    });
  }

  if (!window.__dashSidebarResizeBound) {
    window.__dashSidebarResizeBound = true;
    var onModeChange = function () {
      syncSidebarMode();
    };
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onModeChange);
    else if (typeof mq.addListener === 'function') mq.addListener(onModeChange);
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncSidebarMode, 80);
    });
  }

  syncSidebarMode(true);

  window.openDashSidebar = openSidebar;
  window.closeDashSidebar = closeSidebar;
  window.toggleDashSidebar = toggleSidebar;
  window.resetDashSidebarDesktop = resetDesktopSidebar;
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    window.initPasswordToggles();
    window.initMobileSidebar();
  });
} else {
  window.initPasswordToggles();
  window.initMobileSidebar();
}
