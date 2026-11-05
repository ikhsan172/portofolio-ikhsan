/**
 * ==========================================================================
 * PORTOFOLIO IKHSAN SAPUTRA - JAVASCRIPT
 * ==========================================================================
 * Tech Stack: Three.js (3D Graphics), GSAP (Animations), Lucide Icons
 */

(function () {
  'use strict';

  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 1. Lucide Icons Initialization
  // --------------------------------------------------------------------------
  function initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --------------------------------------------------------------------------
  // 2. Typing Text Effect
  // --------------------------------------------------------------------------
  function initTyping() {
    var words = ['Web Developer', 'Web & Mobile Enthusiast'];
    var wordIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var targetEl = document.getElementById('type');

    if (!targetEl) return;

    if (reduceMotion) {
      targetEl.textContent = words[0];
      return;
    }

    function tick() {
      var currentWord = words[wordIndex];
      targetEl.textContent = currentWord.slice(0, charIndex);

      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(tick, 90);
      } else if (!isDeleting) {
        isDeleting = true;
        setTimeout(tick, 1400);
      } else if (charIndex > 0) {
        charIndex--;
        setTimeout(tick, 45);
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, 300);
      }
    }
    tick();
  }

  // --------------------------------------------------------------------------
  // 3. Three.js 3D Particle Starfield (with 2D Canvas Fallback)
  // --------------------------------------------------------------------------
  function initBackground() {
    var canvas = document.getElementById('stars');
    if (!canvas) return;

    // Fallback 2D Canvas Starfield
    function fallbackCanvas() {
      var ctx = canvas.getContext('2d');
      var width, height, stars = [];
      var starColor = getComputedStyle(document.documentElement).getPropertyValue('--star').trim() || '#cfe0ff';

      function resize() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        stars = [];
        var count = Math.round((width * height) / 7000);
        for (var i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.3 + 0.3,
            p: Math.random() * 6.28,
            s: Math.random() * 0.02 + 0.005,
            v: Math.random() * 0.12 + 0.02
          });
        }
      }

      window.addEventListener('resize', resize);
      resize();

      function render() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = starColor;
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          if (!reduceMotion) {
            s.p += s.s;
            s.y += s.v;
            if (s.y > height) {
              s.y = 0;
              s.x = Math.random() * width;
            }
          }
          ctx.globalAlpha = 0.25 + 0.6 * Math.abs(Math.sin(s.p));
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 6.283);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (!reduceMotion) requestAnimationFrame(render);
      }
      render();
    }

    // Try Three.js 3D WebGL renderer first
    if (typeof THREE !== 'undefined' && !reduceMotion) {
      try {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 500;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        var count = Math.min(Math.round((window.innerWidth * window.innerHeight) / 1000), 1400);
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(count * 3);
        var colors = new Float32Array(count * 3);

        var cBlue = new THREE.Color(0x60a5fa);
        var cSky = new THREE.Color(0x38bdf8);
        var cSoft = new THREE.Color(0xcfe0ff);

        for (var i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 1500;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

          var color = Math.random() > 0.6 ? cBlue : (Math.random() > 0.5 ? cSky : cSoft);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        var material = new THREE.PointsMaterial({
          size: 2.2,
          vertexColors: true,
          transparent: true,
          opacity: 0.85
        });

        var particles = new THREE.Points(geometry, material);
        scene.add(particles);

        var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
        window.addEventListener('mousemove', function (e) {
          mouseX = (e.clientX - window.innerWidth / 2) * 0.12;
          mouseY = (e.clientY - window.innerHeight / 2) * 0.12;
        }, { passive: true });

        window.addEventListener('resize', function () {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        });

        function renderThree() {
          requestAnimationFrame(renderThree);
          targetX += (mouseX - targetX) * 0.05;
          targetY += (mouseY - targetY) * 0.05;

          particles.rotation.y += 0.0005;
          particles.rotation.x = targetY * 0.0003;
          particles.rotation.y += targetX * 0.0003;

          renderer.render(scene, camera);
        }
        renderThree();
      } catch (err) {
        fallbackCanvas();
      }
    } else {
      fallbackCanvas();
    }
  }

  // --------------------------------------------------------------------------
  // 4. GSAP Animations & Interactive 3D Card Physics
  // --------------------------------------------------------------------------
  function initGSAP() {
    if (typeof gsap === 'undefined' || reduceMotion) return;

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero entrance sequence
    gsap.from('#Home h1', { opacity: 0, y: 35, duration: 1, ease: 'power3.out' });
    gsap.from('#Home .lead', { opacity: 0, y: 25, duration: 0.9, delay: 0.2, ease: 'power2.out' });
    gsap.from('#Home .cta, #Home .find', { opacity: 0, y: 20, duration: 0.8, delay: 0.35, stagger: 0.12, ease: 'power2.out' });
    gsap.from('.lanyard', { opacity: 0, y: -80, duration: 1.2, delay: 0.1, ease: 'elastic.out(1, 0.6)' });

    // About hero scroll entrance via IntersectionObserver + GSAP
    var aboutHero = document.querySelector('.about-hero');
    if (aboutHero) {
      var aboutObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          gsap.from('.about-left',      { opacity: 0, x: -40, duration: 0.85, ease: 'power2.out' });
          gsap.from('.about-photo-col', { opacity: 0, y:  40, duration: 1.0,  delay: 0.15, ease: 'power2.out' });
          gsap.from('.about-right',     { opacity: 0, x:  40, duration: 0.85, delay: 0.25, ease: 'power2.out' });
          aboutObserver.disconnect();
        }
      }, { threshold: 0.2 });
      aboutObserver.observe(aboutHero);
    }

    // Interactive 3D Card Physics & 3D Flip (Like in reference video)
    var flipper = document.getElementById('badgeFlipper');
    var lanyard = document.getElementById('lanyardCard');
    var isFlipped = false;

    if (flipper && lanyard) {
      function setCardRotation(targetY, targetX, duration, ease) {
        gsap.to(flipper, {
          rotationY: targetY,
          rotationX: targetX,
          duration: duration || 0.3,
          ease: ease || 'power2.out',
          overwrite: 'auto'
        });
      }

      // Flip on Click
      lanyard.addEventListener('click', function (e) {
        isFlipped = !isFlipped;
        var baseY = isFlipped ? 180 : 0;
        gsap.to(flipper, {
          rotationY: baseY,
          rotationX: 0,
          duration: 0.85,
          ease: 'power3.inOut',
          onComplete: function () {
            flipper.classList.toggle('flipped', isFlipped);
          }
        });
      });

      // 3D Tilt on Mouse Move
      lanyard.addEventListener('mousemove', function (e) {
        var rect = lanyard.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        var y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        var baseY = isFlipped ? 180 : 0;

        setCardRotation(baseY + x * 15, -y * 15, 0.25, 'power2.out');
      });

      // Smooth Return on Mouse Leave
      lanyard.addEventListener('mouseleave', function () {
        var baseY = isFlipped ? 180 : 0;
        setCardRotation(baseY, 0, 0.9, 'elastic.out(1, 0.5)');
      });

      // Subtle initial flip hint preview after 3 seconds
      setTimeout(function () {
        if (!isFlipped && !lanyard.matches(':hover')) {
          gsap.to(flipper, {
            rotationY: 180,
            duration: 0.9,
            ease: 'power2.inOut',
            onComplete: function () {
              isFlipped = true;
              flipper.classList.add('flipped');
              setTimeout(function () {
                if (isFlipped && !lanyard.matches(':hover')) {
                  gsap.to(flipper, {
                    rotationY: 0,
                    duration: 0.9,
                    ease: 'power2.inOut',
                    onComplete: function () {
                      isFlipped = false;
                      flipper.classList.remove('flipped');
                    }
                  });
                }
              }, 3000);
            }
          });
        }
      }, 3500);
    }
  }

  // --------------------------------------------------------------------------
  // 5. Scroll Blur & Fade Effect (GSAP ScrollTrigger scrub)
  // --------------------------------------------------------------------------
  function initScrollBlur() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (reduceMotion) return;

    // Matikan scroll blur di layar HP / mobile (<= 820px) agar tampilan tidak blur saat discroll
    if (window.innerWidth <= 820) {
      ScrollTrigger.getAll().forEach(function (st) {
        if (st.trigger && st.trigger.classList && st.trigger.classList.contains('scroll-fx')) {
          st.kill();
        }
      });
      gsap.set('.scroll-fx', { clearProps: 'all' });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var elements = document.querySelectorAll('.scroll-fx');
    if (!elements.length) return;

    elements.forEach(function (el) {
      // 1. Hero element at the very top of the page (desktop only, halus & tidak blur parah)
      if (el.classList.contains('hero-scroll-fx')) {
        gsap.fromTo(el,
          { opacity: 1, filter: 'blur(0px)', y: 0 },
          {
            opacity: 0.35,
            filter: 'blur(3px)',
            y: -14,
            ease: 'power1.in',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          }
        );
        return;
      }

      // 2. Footer element at the very bottom of the page
      if (el.classList.contains('footer-scroll-fx')) {
        gsap.fromTo(el,
          { opacity: 0.35, filter: 'blur(3px)', y: 14 },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: 0.6,
              invalidateOnRefresh: true
            }
          }
        );
        return;
      }

      // 3. All standard content elements:
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });

      tl.fromTo(el,
        { opacity: 0.35, filter: 'blur(3px)', y: 14 },
        { opacity: 1,    filter: 'blur(0px)',  y: 0,   ease: 'power1.out', duration: 0.3 }
      )
      .to(el,
        { opacity: 1,    filter: 'blur(0px)',  y: 0,   ease: 'none',       duration: 0.4 }
      )
      .to(el,
        { opacity: 0.35, filter: 'blur(3px)', y: -14, ease: 'power1.in',  duration: 0.3 }
      );
    });

    // Clean initial calculation
    ScrollTrigger.refresh();
  }

  // Handle runtime resize to enable/disable scroll blur seamlessly
  var scrollBlurResizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(scrollBlurResizeTimer);
    scrollBlurResizeTimer = setTimeout(function () {
      initScrollBlur();
    }, 150);
  });

  // Handle runtime changes to prefers-reduced-motion
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function handleMotionChange(e) {
    reduceMotion = e.matches;
    if (reduceMotion) {
      document.querySelectorAll('.stat-num').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
        if (!isNaN(target)) el.textContent = target;
      });
    }
    if (typeof ScrollTrigger === 'undefined') return;
    if (reduceMotion) {
      ScrollTrigger.getAll().forEach(function (st) {
        if (st.trigger && st.trigger.classList && st.trigger.classList.contains('scroll-fx')) {
          st.kill();
        }
      });
      if (typeof gsap !== 'undefined') {
        gsap.set('.scroll-fx', { clearProps: 'all' });
      }
    } else {
      initScrollBlur();
      initStatCounters();
      ScrollTrigger.refresh();
    }
  }

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', handleMotionChange);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(handleMotionChange);
  }

  // --------------------------------------------------------------------------
  // 6. Stat Counter Count-Up (GSAP ScrollTrigger, once)
  // --------------------------------------------------------------------------
  function initStatCounters() {
    var statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    function setFinalNumbers() {
      statNums.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
        if (!isNaN(target)) el.textContent = target;
      });
    }

    if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setFinalNumbers();
      return;
    }

    statNums.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
      if (isNaN(target)) return;

      // Start display at 0
      el.textContent = '0';

      var counterObj = { val: 0 };
      ScrollTrigger.create({
        trigger: el.closest('.stat') || el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          if (reduceMotion) {
            el.textContent = target;
            return;
          }
          gsap.to(counterObj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(counterObj.val);
            }
          });
        }
      });
    });
  }


  // --------------------------------------------------------------------------
  // 7b. Website Preview Modal (kartu project dengan data-demo)
  // --------------------------------------------------------------------------
  function initDemoModal() {
    var modal = document.getElementById('demoModal');
    if (!modal) return;
    var frame = document.getElementById('demoFrame');
    var title = document.getElementById('demoModalTitle');
    var openNew = document.getElementById('demoOpenNew');
    var closeBtn = modal.querySelector('.demo-close');
    var lastFocus = null;

    function open(card) {
      // Jika data-demo-live diisi (URL website yang sudah online), pakai itu; jika kosong, pakai snapshot statis.
      var url = card.getAttribute('data-demo-live') || card.getAttribute('data-demo');
      if (!url) return;
      lastFocus = card;
      title.textContent = card.getAttribute('data-demo-title') || 'Preview Website';
      openNew.href = url;
      frame.src = url;
      modal.hidden = false;
      document.body.classList.add('demo-open-lock');
      initIcons();
      closeBtn.focus();
    }

    function close() {
      modal.hidden = true;
      frame.removeAttribute('src');
      document.body.classList.remove('demo-open-lock');
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('[data-demo]').forEach(function (card) {
      card.addEventListener('click', function () { open(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(card);
        }
      });
    });
    modal.querySelectorAll('[data-demo-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  // --------------------------------------------------------------------------
  // 7. Portfolio Tabs Switcher
  // --------------------------------------------------------------------------
  function initTabs() {
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (o) {
          var target = document.getElementById(o.dataset.t);
          var active = (o === t);
          o.setAttribute('aria-selected', active);
          if (target) {
            target.hidden = !active;
            if (active && typeof gsap !== 'undefined' && !reduceMotion) {
              gsap.fromTo(target, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
            }
          }
        });
        initIcons();
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(function () {
            ScrollTrigger.refresh();
          }, 60);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. Navigation ScrollSpy
  // --------------------------------------------------------------------------
  function initScrollSpy() {
    var desktopLinks = document.querySelectorAll('#nav a');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');
    var sectionIds = ['Home', 'About', 'Portfolio', 'Contact'];
    var sections = sectionIds.map(function (id) { return document.getElementById(id); });

    function spy() {
      var scrollPos = window.scrollY + window.innerHeight * 0.35;
      var currentIndex = 0;
      sections.forEach(function (sec, idx) {
        if (sec && sec.offsetTop <= scrollPos) {
          currentIndex = idx;
        }
      });
      desktopLinks.forEach(function (link, idx) {
        link.classList.toggle('on', idx === currentIndex);
      });
      mobileLinks.forEach(function (link, idx) {
        link.classList.toggle('on', idx === currentIndex);
      });
    }

    window.addEventListener('scroll', spy, { passive: true });
    spy();
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer Toggle & Click Handlers
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    var menuToggle = document.getElementById('menuToggle');
    var menuClose = document.getElementById('menuClose');
    var mobileNav = document.getElementById('mobileNav');
    var backdrop = document.getElementById('mobileNavBackdrop');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileNav) return;

    function openMenu() {
      mobileNav.hidden = false;
      mobileNav.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-lock');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function closeMenu() {
      mobileNav.classList.add('closing');
      setTimeout(function () {
        mobileNav.hidden = true;
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('closing');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mobile-nav-lock');
      }, 200);
    }

    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileNav.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    if (menuClose) {
      menuClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMenu();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Contact Form Handler (FormSubmit AJAX with Automatic Email Delivery)
  // --------------------------------------------------------------------------
  function initForm() {
    var form = document.getElementById('f');
    if (!form) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    var statusMsg = document.getElementById('formStatus');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = document.getElementById('n');
      var emailInput = document.getElementById('e');
      var messageInput = document.getElementById('m');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) return;

      var originalBtnText = submitBtn ? submitBtn.innerHTML : 'Kirim Pesan';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Mengirim pesan...</span>';
      }

      if (statusMsg) {
        statusMsg.style.display = 'none';
        statusMsg.className = 'form-status';
      }

      fetch('https://formsubmit.co/ajax/ikhsansaputra357@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: 'Pesan Baru dari Portofolio: ' + name,
          _template: 'table',
          _captcha: 'false'
        })
      })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Gagal mengirim');
      })
      .then(function () {
        if (submitBtn) {
          submitBtn.innerHTML = '<span>Terkirim!</span>';
        }
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.className = 'form-status success';
          statusMsg.textContent = 'Pesan Anda telah berhasil dikirim ke email saya. Terima kasih!';
        }
        form.reset();
        setTimeout(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }, 3500);
      })
      .catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        if (statusMsg) {
          statusMsg.style.display = 'block';
          statusMsg.className = 'form-status error';
          statusMsg.innerHTML = 'Tidak dapat terkirim otomatis. <a href="mailto:ikhsansaputra357@gmail.com?subject=' + encodeURIComponent('Pesan dari ' + name) + '&body=' + encodeURIComponent(message) + '" style="color:var(--blue2);text-decoration:underline;">Klik di sini untuk mengirim manual via email</a>.';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. About Me — Canvas Mask Brush Reveal Effect
  // --------------------------------------------------------------------------
  function initAboutPhotoMask() {
    var wrap = document.getElementById('aboutPhotoWrap');
    var displayCanvas = document.getElementById('aboutMaskCanvas');
    if (!wrap || !displayCanvas) return;

    var displayCtx = displayCanvas.getContext('2d');
    var maskCanvas = document.createElement('canvas');
    var maskCtx = maskCanvas.getContext('2d');

    var hoverImg = new Image();
    var hoverImgLoaded = false;
    hoverImg.src = 'public/images/about-hover.png?v=2';

    if (hoverImg.complete && hoverImg.naturalWidth > 0) {
      hoverImgLoaded = true;
    } else {
      hoverImg.onload = function () {
        hoverImgLoaded = true;
      };
      hoverImg.onerror = function () {
        // Fallback to assets/images/about-alter.png if custom file is not found
        hoverImg.src = 'assets/images/about-alter.png';
      };
    }

    var cssWidth = 0;
    var cssHeight = 0;
    var dpr = 1;
    var brushRadius = 75;

    var lastX = 0;
    var lastY = 0;
    var hasLastPos = false;
    var isPointerActive = false;
    var isSectionVisible = true;
    var fadeFrames = 0;
    var rafId = null;

    var fullRevealProgress = { value: 0 };
    var isFullRevealed = false;

    function resize() {
      var rect = wrap.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      if (!cssWidth || !cssHeight) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      displayCanvas.width = Math.round(cssWidth * dpr);
      displayCanvas.height = Math.round(cssHeight * dpr);
      maskCanvas.width = Math.round(cssWidth * dpr);
      maskCanvas.height = Math.round(cssHeight * dpr);

      displayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Brush radius between 60px and 90px adaptive to wrap width
      brushRadius = Math.max(60, Math.min(90, Math.round(cssWidth * 0.28)));
    }

    window.addEventListener('resize', resize);
    resize();

    // Helper: draw image with object-fit: cover and center top alignment
    function drawCoverImage(ctx, img, targetW, targetH) {
      var nw = img.naturalWidth;
      var nh = img.naturalHeight;
      if (!nw || !nh) return;

      var targetRatio = targetW / targetH;
      var imgRatio = nw / nh;
      var sx, sy, sw, sh;

      if (imgRatio > targetRatio) {
        sh = nh;
        sw = nh * targetRatio;
        sx = (nw - sw) / 2;
        sy = 0;
      } else {
        sw = nw;
        sh = nw / targetRatio;
        sx = 0;
        sy = 0;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
    }

    // Paint a soft radial gradient circle onto the mask canvas
    function drawBrushPoint(x, y) {
      var grad = maskCtx.createRadialGradient(x, y, 0, x, y, brushRadius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.35)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.fillStyle = grad;
      maskCtx.beginPath();
      maskCtx.arc(x, y, brushRadius, 0, Math.PI * 2);
      maskCtx.fill();
    }

    // Interpolate points between previous and current coordinates for seamless brush stroke
    function paintLine(x1, y1, x2, y2) {
      var dist = Math.hypot(x2 - x1, y2 - y1);
      var step = 8; // step every 8px
      var steps = Math.max(1, Math.ceil(dist / step));
      for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        drawBrushPoint(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
      }
    }

    function render() {
      if (!isSectionVisible || reduceMotion) {
        rafId = null;
        return;
      }

      // 1. Fade the mask gradually using destination-out with 4% transparent black
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.fillStyle = 'rgba(0, 0, 0, 0.04)'; // Fades smoothly around 4% per frame
      maskCtx.fillRect(0, 0, cssWidth, cssHeight);

      // 2. Clear display canvas
      displayCtx.clearRect(0, 0, cssWidth, cssHeight);

      // 3. Composite mask with top hover photo
      if (hoverImgLoaded && hoverImg.naturalWidth > 0) {
        // Draw mask onto visible canvas
        displayCtx.globalCompositeOperation = 'source-over';
        displayCtx.drawImage(maskCanvas, 0, 0, cssWidth, cssHeight);

        // Clip the top image only where mask has opacity
        displayCtx.globalCompositeOperation = 'source-in';
        drawCoverImage(displayCtx, hoverImg, cssWidth, cssHeight);

        // Blend full reveal if click toggle is active
        if (fullRevealProgress.value > 0.001) {
          displayCtx.globalCompositeOperation = 'source-over';
          displayCtx.globalAlpha = fullRevealProgress.value;
          drawCoverImage(displayCtx, hoverImg, cssWidth, cssHeight);
          displayCtx.globalAlpha = 1;
        }

        // Reset
        displayCtx.globalCompositeOperation = 'source-over';
      }

      // 4. Stop RAF when mask has completely evaporated and no pointer is active
      if (!isPointerActive && (fullRevealProgress.value <= 0 || fullRevealProgress.value >= 1)) {
        fadeFrames++;
        if (fadeFrames > 80 && fullRevealProgress.value <= 0) { // ~1.3s after pointer leaves
          maskCtx.clearRect(0, 0, cssWidth, cssHeight);
          displayCtx.clearRect(0, 0, cssWidth, cssHeight);
          rafId = null;
          return;
        } else if (fadeFrames > 30 && fullRevealProgress.value >= 1) {
          rafId = null;
          return;
        }
      }

      rafId = requestAnimationFrame(render);
    }

    function startLoop() {
      if (!rafId && isSectionVisible && !reduceMotion) {
        rafId = requestAnimationFrame(render);
      }
    }

    function getPointerPos(e) {
      var rect = wrap.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    function onPointerDown(e) {
      if (reduceMotion) return;
      isPointerActive = true;
      wrap.classList.add('has-brushed');
      var pos = getPointerPos(e);
      lastX = pos.x;
      lastY = pos.y;
      hasLastPos = true;
      drawBrushPoint(pos.x, pos.y);
      startLoop();
    }

    function onPointerMove(e) {
      if (reduceMotion) return;
      var pos = getPointerPos(e);
      wrap.classList.add('has-brushed');
      isPointerActive = true;

      if (hasLastPos) {
        paintLine(lastX, lastY, pos.x, pos.y);
      } else {
        drawBrushPoint(pos.x, pos.y);
        hasLastPos = true;
      }

      lastX = pos.x;
      lastY = pos.y;
      fadeFrames = 0;
      startLoop();
    }

    function onPointerEnd() {
      isPointerActive = false;
      hasLastPos = false;
    }

    // Pointer events (Touch, Pen, Mouse unified)
    wrap.addEventListener('pointerdown', onPointerDown);
    wrap.addEventListener('pointermove', onPointerMove);
    wrap.addEventListener('pointerup', onPointerEnd);
    wrap.addEventListener('pointercancel', onPointerEnd);
    wrap.addEventListener('pointerleave', onPointerEnd);

    // Click / Tap to toggle full Spider-Man reveal (as seen in video reference)
    wrap.addEventListener('click', function () {
      if (reduceMotion) return;
      isFullRevealed = !isFullRevealed;
      wrap.classList.add('has-brushed');
      fadeFrames = 0;

      if (typeof gsap !== 'undefined') {
        gsap.to(fullRevealProgress, {
          value: isFullRevealed ? 1 : 0,
          duration: 0.45,
          ease: 'power2.inOut',
          onUpdate: function () {
            startLoop();
          }
        });
      } else {
        fullRevealProgress.value = isFullRevealed ? 1 : 0;
        startLoop();
      }
    });

    // Stop RAF loop when section is outside viewport
    var sectionAbout = document.getElementById('About') || wrap;
    if (typeof IntersectionObserver !== 'undefined') {
      var observer = new IntersectionObserver(function (entries) {
        var entry = entries[0];
        isSectionVisible = entry.isIntersecting;
        if (isSectionVisible) {
          if (isPointerActive || fadeFrames < 90) {
            startLoop();
          }
        } else {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }
      }, { threshold: 0.05 });

      observer.observe(sectionAbout);
    }

    // Handle prefers-reduced-motion dynamically
    var motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updateMotionPreference(e) {
      if (e.matches) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        displayCanvas.style.display = 'none';
        maskCtx.clearRect(0, 0, cssWidth, cssHeight);
        displayCtx.clearRect(0, 0, cssWidth, cssHeight);
      } else {
        displayCanvas.style.display = 'block';
        resize();
      }
    }

    if (motionMedia.matches) {
      displayCanvas.style.display = 'none';
    }

    if (motionMedia.addEventListener) {
      motionMedia.addEventListener('change', updateMotionPreference);
    } else if (motionMedia.addListener) {
      motionMedia.addListener(updateMotionPreference);
    }
  }

  // --------------------------------------------------------------------------
  // 9. Interactive Sound Effects (SFX) with Toggle Control
  // --------------------------------------------------------------------------
  function initSFX() {
    var sfxBtn = document.getElementById('sfxToggle');
    var sfxAudio = new Audio('assets/audio/click.mp3');
    sfxAudio.preload = 'auto';

    // Retrieve saved user setting, default to ON (true)
    var stored = localStorage.getItem('ikhsan_sfx_enabled');
    var isEnabled = stored === null ? true : stored === 'true';

    function updateUI() {
      if (!sfxBtn) return;
      if (isEnabled) {
        sfxBtn.classList.add('active');
        sfxBtn.setAttribute('title', 'Suara SFX: Aktif (Klik untuk matikan)');
        sfxBtn.setAttribute('aria-pressed', 'true');
      } else {
        sfxBtn.classList.remove('active');
        sfxBtn.setAttribute('title', 'Suara SFX: Nonaktif (Klik untuk nyalakan)');
        sfxBtn.setAttribute('aria-pressed', 'false');
      }

      var icon = sfxBtn.querySelector('i, svg');
      if (icon) {
        var newI = document.createElement('i');
        newI.setAttribute('data-lucide', isEnabled ? 'volume-2' : 'volume-x');
        icon.parentNode.replaceChild(newI, icon);
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }
    }

    function play() {
      if (!isEnabled) return;
      try {
        var sound = sfxAudio.cloneNode();
        sound.volume = 0.55;
        var p = sound.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {});
        }
      } catch (err) {}
    }

    if (sfxBtn) {
      sfxBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        isEnabled = !isEnabled;
        localStorage.setItem('ikhsan_sfx_enabled', isEnabled ? 'true' : 'false');
        updateUI();
        if (isEnabled) {
          play();
        }
      });
      updateUI();
    }

    // Play SFX on interactive elements (buttons, links, tabs, cards, badge flip)
    document.addEventListener('click', function (e) {
      if (e.target.closest('#sfxToggle')) return;
      var el = e.target.closest('button, a, .tab, .card, .card-demo, #lanyardCard, .badge-face, [role="button"], input[type="submit"], .thumb-preview-btn');
      if (el) {
        play();
      }
    }, true);
  }

  // --------------------------------------------------------------------------
  // Loading Screen Animation (Welcome To My Portfolio Website + Lightning)
  // --------------------------------------------------------------------------
  function initLoader(onComplete) {
    var loader = document.getElementById('loadingScreen');
    var bar = document.getElementById('loaderBarFill');
    var percent = document.getElementById('loaderPercent');

    if (!loader || !bar || !percent) {
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    if (reduceMotion) {
      loader.style.display = 'none';
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    var progress = 0;
    var duration = 1900; // ~1.9s durasi loading elegan & mulus
    var startTime = performance.now();

    function update(now) {
      var elapsed = now - startTime;
      var raw = Math.min(elapsed / duration, 1);
      // Easing curve agar kenaikan persentase berasa natural & dinamis
      var ease = 1 - Math.pow(1 - raw, 2.5);
      progress = Math.min(Math.round(ease * 100), 100);

      bar.style.width = progress + '%';
      percent.textContent = progress + '%';

      if (raw < 1) {
        requestAnimationFrame(update);
      } else {
        bar.style.width = '100%';
        percent.textContent = '100%';
        setTimeout(function () {
          loader.classList.add('loaded');
          setTimeout(function () {
            loader.style.display = 'none';
            if (typeof onComplete === 'function') {
              onComplete();
            }
          }, 650);
        }, 240);
      }
    }

    requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // Initialize Everything on DOM Ready
  // --------------------------------------------------------------------------
  function init() {
    initIcons();
    initBackground();
    initTabs();
    initDemoModal();
    initScrollSpy();
    initMobileMenu();
    initForm();
    initAboutPhotoMask();
    initSFX();

    // Tampilkan loading screen cinematic terlebih dahulu, kemudian picu animasi hero saat selesai
    initLoader(function () {
      initTyping();
      initGSAP();
      initScrollBlur();
      initStatCounters();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

