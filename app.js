/**
 * BIG BOSS & CO - BESPOKE TAILORS | INTERACTIVE MASTER LOGIC
 * Minimalistic Luxury Light Theme with Advanced Animations & Enhanced UX
 * Master Tailors of C.G. Road, Navrangpura, Ahmedabad
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressAndBackToTop();
  initLiveStoreStatus();
  initQuickFitAdvisor();
  initBespokeCustomizer();
  initGalleryAndLightbox();
  initAppointmentBooking();
  initMobileNavigation();
  initDefaultBookingDate();
  initScrollRevealAnimations();
  initStatsCounter();
  init3DCardTilt();
  initAtelierActivityToast();
});

/* ==========================================================================
   1. SCROLL PROGRESS TAPE & BACK TO TOP BUTTON WITH PROGRESS RING
   ========================================================================== */
function initScrollProgressAndBackToTop() {
  const tape = document.getElementById('scrollProgressTape');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const progressRing = document.getElementById('progressRingCircle');
  const circumference = 144; // 2 * PI * 23

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Update measuring tape width
    if (tape) {
      tape.style.width = `${Math.min(progress * 100, 100)}%`;
    }

    // Update Back to Top circular ring & visibility
    if (backToTopBtn && progressRing) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
      const offset = circumference - (progress * circumference);
      progressRing.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   2. SCROLL REVEAL ANIMATIONS & HERO STATS COUNTER
   ========================================================================== */
function initScrollRevealAnimations() {
  const elementsToAnimate = document.querySelectorAll(
    '.section-header, .pillar-item, .silhouette-card, .fabric-card, .gallery-item-card, ' +
    '.fabric-spec-card, .process-step-card, .guide-point-item, .measuring-tape-card, .measurement-lounge-card, ' +
    '.craft-spotlight-banner, .booking-card-wrapper, .store-info-card, .store-map-wrapper, .testimonial-card, .advisor-widget-card'
  );

  elementsToAnimate.forEach((el, index) => {
    el.classList.add('reveal-init');
    const delayClass = `delay-${(index % 4) + 1}`;
    el.classList.add(delayClass);
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToAnimate.forEach(el => observer.observe(el));
}

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const statsRow = document.querySelector('.hero-stats-row');
  if (!statsRow) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsRow);

  function animateCounters() {
    statNumbers.forEach(stat => {
      const originalText = stat.textContent.trim();
      if (originalText.includes('35+')) {
        animateValue(stat, 0, 35, 1200, '+');
      } else if (originalText.includes('10K+')) {
        animateValue(stat, 0, 10, 1200, 'K+');
      } else if (originalText.includes('500+')) {
        animateValue(stat, 0, 500, 1400, '+');
      }
    });
  }

  function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easedProgress * (end - start) + start);
      obj.textContent = currentVal + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   3. LIVE SHOWROOM HOURS & STATUS ENGINE (AHMEDABAD IST TIMEZONE)
   ========================================================================== */
function initLiveStoreStatus() {
  const statusPill = document.getElementById('liveStoreStatusPill');
  const statusText = document.getElementById('liveStatusText');
  const currentBadge = document.getElementById('currentStatusBadge');

  function updateStatus() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 3600000;
    const istDate = new Date(utcTime + istOffset);

    const day = istDate.getDay();
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
    const currentTimeVal = hours + (minutes / 60);

    let isOpen = false;
    let closingTimeStr = '';
    let openingTimeStr = '11:00 AM';

    if (day === 0) {
      // Sunday: 11:00 AM to 1:30 PM (13.5)
      if (currentTimeVal >= 11.0 && currentTimeVal < 13.5) {
        isOpen = true;
        closingTimeStr = '1:30 PM';
      }
    } else {
      // Monday to Saturday: 11:00 AM to 8:30 PM (20.5)
      if (currentTimeVal >= 11.0 && currentTimeVal < 20.5) {
        isOpen = true;
        closingTimeStr = '8:30 PM';
      }
    }

    if (statusPill && statusText) {
      if (isOpen) {
        statusPill.classList.remove('closed');
        statusText.textContent = `Open Now • Closes ${closingTimeStr}`;
      } else {
        statusPill.classList.add('closed');
        statusText.textContent = `Closed Now • Opens Tomorrow at ${openingTimeStr}`;
      }
    }

    if (currentBadge) {
      if (isOpen) {
        currentBadge.textContent = '🟢 Open Now';
        currentBadge.style.color = '#059669';
      } else {
        currentBadge.textContent = '🔴 Closed (Opens 11:00 AM)';
        currentBadge.style.color = '#dc2626';
      }
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* ==========================================================================
   4. INTERACTIVE SMART FIT ADVISOR (ENHANCED UX)
   ========================================================================== */
function initQuickFitAdvisor() {
  const occasionSelect = document.getElementById('advisorOccasion');
  const buildSelect = document.getElementById('advisorBuild');
  const recText = document.getElementById('advisorRecText');
  const applyBtn = document.getElementById('applyAdvisorRecBtn');

  const recommendations = {
    'wedding': {
      silhouette: 'sherwani',
      fabric: 'banarasi-silk',
      text: 'Royal Sherwani in Pure Raw Silk & Brocade'
    },
    'reception': {
      silhouette: 'tuxedo',
      fabric: 'italian-wool',
      text: '3-Piece Tuxedo in Super 140s Wool'
    },
    'business': {
      silhouette: 'business-suit',
      fabric: 'italian-wool',
      text: '2-Piece Executive Suit in Italian Wool'
    },
    'festive': {
      silhouette: 'nehru-jacket',
      fabric: 'royal-velvet',
      text: 'Designer Nehru Bandi in Midnight Velvet'
    }
  };

  function updateRec() {
    const occ = occasionSelect?.value || 'reception';
    const rec = recommendations[occ] || recommendations['reception'];
    if (recText) {
      recText.style.opacity = '0';
      setTimeout(() => {
        recText.textContent = rec.text;
        recText.style.opacity = '1';
      }, 150);
    }
  }

  occasionSelect?.addEventListener('change', updateRec);
  buildSelect?.addEventListener('change', updateRec);

  applyBtn?.addEventListener('click', () => {
    const occ = occasionSelect?.value || 'reception';
    const rec = recommendations[occ] || recommendations['reception'];

    // Select silhouette card
    const targetSil = document.querySelector(`.silhouette-card[data-id="${rec.silhouette}"]`);
    targetSil?.click();

    // Select fabric card
    const targetFab = document.querySelector(`.fabric-card[data-id="${rec.fabric}"]`);
    targetFab?.click();

    // Scroll to customizer
    const customizerBox = document.querySelector('.customizer-box');
    customizerBox?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Pulse animation on the applied cards
    targetSil?.classList.add('price-flash');
    setTimeout(() => targetSil?.classList.remove('price-flash'), 600);
  });
}

/* ==========================================================================
   5. INTERACTIVE BESPOKE GARMENT CUSTOMIZER (STUDIO)
   ========================================================================== */
function initBespokeCustomizer() {
  if (!document.getElementById('customizer')) return;

  const state = {
    step: 1,
    silhouetteId: 'tuxedo',
    silhouetteName: '3-Piece Bespoke Tuxedo',
    silhouetteIcon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-2 18H8L6 3z"></path><path d="M9 3l3 7 3-7"></path><polygon points="10 5.5 12 7 10 8.5 10 5.5" fill="currentColor"></polygon><polygon points="14 5.5 12 7 14 8.5 14 5.5" fill="currentColor"></polygon><circle cx="12" cy="7" r="1.1" fill="currentColor"></circle></svg>',
    basePrice: 14500,
    turnaround: '7-10 Days',
    fabricId: 'italian-wool',
    fabricName: 'Super 140s Italian Wool',
    fabricPrice: 4000,
    fabricGradient: 'radial-gradient(circle at 30% 30%, #253350 0%, #141c2c 100%)',
    lapelName: 'Peak Lapel (Silk Satin Facing)',
    lapelPrice: 800,
    accentName: 'Custom Golden Monogram',
    accentPrice: 600,
    monogramInitials: '',
    currentDisplayedPrice: 19900
  };

  const fabricGradients = {
    'italian-wool': 'radial-gradient(circle at 30% 30%, #253350 0%, #141c2c 100%)',
    'banarasi-silk': 'radial-gradient(circle at 30% 30%, #831843 0%, #4a044e 100%)',
    'royal-velvet': 'radial-gradient(circle at 30% 30%, #3b0764 0%, #1e1b4b 100%)',
    'irish-linen': 'radial-gradient(circle at 30% 30%, #d6c7a1 0%, #9e916e 100%)',
    'giza-cotton': 'radial-gradient(circle at 30% 30%, #f1f5f9 0%, #94a3b8 100%)',
    'raymond-suiting': 'radial-gradient(circle at 30% 30%, #4b5563 0%, #1f2937 100%)'
  };

  const silhouetteIcons = {
    'tuxedo': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-2 18H8L6 3z"></path><path d="M9 3l3 7 3-7"></path><polygon points="10 5.5 12 7 10 8.5 10 5.5" fill="currentColor"></polygon><polygon points="14 5.5 12 7 14 8.5 14 5.5" fill="currentColor"></polygon><circle cx="12" cy="7" r="1.1" fill="currentColor"></circle></svg>',
    'business-suit': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14l-2 18H7L5 3z"></path><path d="M8 3l4 9 4-9"></path><polygon points="11 5.5 13 5.5 12.5 13 11.5 13" fill="currentColor"></polygon><line x1="12" y1="13" x2="12" y2="20"></line></svg>',
    'sherwani': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h12l-1.5 17.5h-9L6 3.5z"></path><path d="M9 3.5v3h6v-3"></path><line x1="12" y1="6.5" x2="12" y2="21"></line><circle cx="12" cy="9" r="0.9" fill="currentColor"></circle><circle cx="12" cy="12" r="0.9" fill="currentColor"></circle><circle cx="12" cy="15" r="0.9" fill="currentColor"></circle><circle cx="12" cy="18" r="0.9" fill="currentColor"></circle></svg>',
    'nehru-jacket': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10l-1.5 16.5h-7L7 4z"></path><path d="M9.5 4v2.5h5V4"></path><line x1="12" y1="6.5" x2="12" y2="20.5"></line><circle cx="12" cy="9" r="0.8" fill="currentColor"></circle><circle cx="12" cy="12" r="0.8" fill="currentColor"></circle><circle cx="12" cy="15" r="0.8" fill="currentColor"></circle><circle cx="12" cy="18" r="0.8" fill="currentColor"></circle></svg>',
    'indo-western': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14l-2 17-6-2-4 2L5 4z"></path><path d="M10 4v3l5 8v6"></path><circle cx="12.5" cy="10" r="0.8" fill="currentColor"></circle><circle cx="13.8" cy="13" r="0.8" fill="currentColor"></circle><circle cx="15" cy="16" r="0.8" fill="currentColor"></circle></svg>',
    'shirt-trouser': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l-1 9H7L6 3z"></path><path d="M7 12l1 9h3l1-7 1 7h3l1-9"></path><line x1="12" y1="3" x2="12" y2="12"></line></svg>'
  };

  const tabBtns = document.querySelectorAll('.step-tab-btn');
  const panels = document.querySelectorAll('.config-step-panel');
  const silhouetteCards = document.querySelectorAll('.silhouette-card');
  const fabricCards = document.querySelectorAll('.fabric-card');
  const optionChips = document.querySelectorAll('.option-chip');
  const monogramInput = document.getElementById('monogramText');

  // Preview elements
  const previewTitle = document.getElementById('previewSilhouetteTitle');
  const previewFabric = document.getElementById('previewFabricSubtitle');
  const specSilhouette = document.getElementById('specSilhouetteVal');
  const specFabric = document.getElementById('specFabricVal');
  const specLapel = document.getElementById('specLapelVal');
  const specAccent = document.getElementById('specAccentVal');
  const previewPrice = document.getElementById('previewPriceVal');
  const previewTime = document.getElementById('previewTimeVal');

  // Visualizer elements
  const visualizerCanvas = document.getElementById('visualizerCanvas');
  const visualizerBadge = document.getElementById('visualizerBadge');
  const visualizerTagTitle = document.getElementById('visualizerTagTitle');
  const visualizerTagFabric = document.getElementById('visualizerTagFabric');

  function goToStep(stepNum) {
    state.step = parseInt(stepNum);
    tabBtns.forEach(btn => {
      const bStep = parseInt(btn.dataset.step);
      btn.classList.toggle('active', bStep === state.step);
      btn.setAttribute('aria-selected', bStep === state.step);
    });
    panels.forEach((p, idx) => {
      p.classList.toggle('active', (idx + 1) === state.step);
    });

    // On mobile devices, smoothly center the active step tab in the horizontal scroll track
    const activeTab = document.querySelector(`.step-tab-btn[data-step="${stepNum}"]`);
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.dataset.step));
  });

  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.dataset.target));
  });

  document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => goToStep(btn.dataset.target));
  });

  // Silhouette Selection
  silhouetteCards.forEach(card => {
    card.addEventListener('click', () => {
      silhouetteCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.silhouetteId = card.dataset.id;
      state.silhouetteName = card.dataset.name;
      state.silhouetteIcon = silhouetteIcons[card.dataset.id] || silhouetteIcons['tuxedo'];
      state.basePrice = parseInt(card.dataset.base);
      state.turnaround = card.dataset.time;
      renderPreview();
    });
  });

  // Fabric Selection
  fabricCards.forEach(card => {
    card.addEventListener('click', () => {
      fabricCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.fabricId = card.dataset.id;
      state.fabricName = card.dataset.name;
      state.fabricPrice = parseInt(card.dataset.mod);
      state.fabricGradient = fabricGradients[card.dataset.id] || fabricGradients['italian-wool'];
      renderPreview();
    });
  });

  // Lapel & Accent Chips Selection
  optionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.type;
      document.querySelectorAll(`.option-chip[data-type="${type}"]`).forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      if (type === 'lapel') {
        state.lapelName = chip.dataset.name;
        state.lapelPrice = parseInt(chip.dataset.mod);
      } else if (type === 'accent') {
        state.accentName = chip.dataset.name;
        state.accentPrice = parseInt(chip.dataset.mod);
      }
      renderPreview();
    });
  });

  if (monogramInput) {
    monogramInput.addEventListener('input', (e) => {
      state.monogramInitials = e.target.value.trim().toUpperCase();
      renderPreview();
    });
  }

  // Smooth Rolling Price Animation with Gold Flash
  function animatePriceRoll(targetPrice) {
    if (!previewPrice) return;
    const startPrice = state.currentDisplayedPrice;
    const duration = 400;
    let startTime = null;

    previewPrice.classList.add('price-flash');
    setTimeout(() => previewPrice.classList.remove('price-flash'), 450);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * (targetPrice - startPrice) + startPrice);
      previewPrice.textContent = `₹${val.toLocaleString('en-IN')}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        previewPrice.textContent = `₹${targetPrice.toLocaleString('en-IN')}`;
        state.currentDisplayedPrice = targetPrice;
      }
    }
    window.requestAnimationFrame(step);
  }

  function renderPreview() {
    const total = state.basePrice + state.fabricPrice + state.lapelPrice + state.accentPrice;

    if (previewTitle) previewTitle.textContent = state.silhouetteName;
    if (previewFabric) previewFabric.textContent = state.fabricName;
    if (specSilhouette) specSilhouette.textContent = state.silhouetteName;
    if (specFabric) specFabric.textContent = state.fabricName;
    if (specLapel) specLapel.textContent = state.lapelName;
    
    let accentDisplay = state.accentName;
    if (state.monogramInitials) {
      accentDisplay += ` [Initials: "${state.monogramInitials}"]`;
    }
    if (specAccent) specAccent.textContent = accentDisplay;

    // Trigger rolling price animation
    animatePriceRoll(total);

    if (previewTime) {
      previewTime.textContent = state.turnaround;
    }

    // Update Visualizer Banner
    if (visualizerCanvas) {
      visualizerCanvas.style.background = state.fabricGradient;
    }
    if (visualizerBadge) {
      visualizerBadge.innerHTML = state.silhouetteIcon;
    }
    if (visualizerTagTitle) {
      visualizerTagTitle.textContent = state.silhouetteName.split(' ')[0] + ' ' + (state.silhouetteName.split(' ')[1] || '');
    }
    if (visualizerTagFabric) {
      visualizerTagFabric.textContent = state.fabricName;
    }

    // Update Live Monogram Stamping on Canvas
    const visualizerMonogram = document.getElementById('visualizerMonogramBadge');
    if (visualizerMonogram) {
      if (state.monogramInitials) {
        visualizerMonogram.textContent = state.monogramInitials;
        visualizerMonogram.style.display = 'inline-flex';
      } else {
        visualizerMonogram.style.display = 'none';
      }
    }
  }

  // Deep Linking from other pages (e.g. fabrics.html or gallery.html ?silhouette=sherwani&fabric=royal-velvet)
  function applyUrlParameters() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const silParam = urlParams.get('silhouette') || urlParams.get('sil');
      const fabParam = urlParams.get('fabric') || urlParams.get('fab');

      if (silParam) {
        const targetSil = document.querySelector(`.silhouette-card[data-id="${silParam}"]`);
        if (targetSil) {
          targetSil.click();
        }
      }

      if (fabParam) {
        const targetFab = document.querySelector(`.fabric-card[data-id="${fabParam}"]`);
        if (targetFab) {
          targetFab.click();
        }
      }

      if (silParam || fabParam) {
        const customizerBox = document.getElementById('customizer');
        setTimeout(() => {
          customizerBox?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    } catch (e) {
      console.warn('URL parameter parsing skipped:', e);
    }
  }

  renderPreview();
  applyUrlParameters();

  const bookSpecHandler = (e) => {
    e.preventDefault();
    const bookingSection = document.getElementById('booking');
    const garmentSelect = document.getElementById('garmentType');
    const notesArea = document.getElementById('specialNotes');

    const specPayload = {
      silhouette: state.silhouetteName,
      silhouetteId: state.silhouetteId,
      fabric: state.fabricName,
      fabricId: state.fabricId,
      lapel: state.lapelName,
      accent: state.accentName,
      monogram: state.monogramInitials,
      price: (state.basePrice + state.fabricPrice + state.lapelPrice + state.accentPrice)
    };

    try {
      sessionStorage.setItem('bigboss_customizer_spec', JSON.stringify(specPayload));
    } catch (err) {}

    if (garmentSelect) {
      const opts = Array.from(garmentSelect.options);
      const match = opts.find(o => o.text.toLowerCase().includes(state.silhouetteName.toLowerCase().split(' ')[0]));
      if (match) {
        garmentSelect.value = match.value;
      }
    }

    if (notesArea) {
      const summaryText = `[Customizer Spec] Silhouette: ${state.silhouetteName} | Fabric: ${state.fabricName} | Cut: ${state.lapelName} | Accent: ${state.accentName}${state.monogramInitials ? ` (Monogram: ${state.monogramInitials})` : ''} | Est. Investment: ₹${specPayload.price.toLocaleString('en-IN')}`;
      notesArea.value = summaryText;
    }

    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('clientName')?.focus();
    } else {
      window.location.href = 'booking.html';
    }
  };

  document.getElementById('bookWithSpecBtn')?.addEventListener('click', bookSpecHandler);
  document.getElementById('confirmCustomizerBtn')?.addEventListener('click', bookSpecHandler);
}

/* ==========================================================================
   6. SHOWROOM GALLERY WITH PREV / NEXT LIGHTBOX NAVIGATION
   ========================================================================== */
function initGalleryAndLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item-card'));
  if (galleryItems.length === 0) return;

  const filterBtns = document.querySelectorAll('.filter-pill');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  let currentPhotoIndex = 0;

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.dataset.category || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = 'block';
          item.style.animation = 'fadeInScale 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  function showPhotoAtIndex(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentPhotoIndex = index;

    const item = galleryItems[currentPhotoIndex];
    const src = item.dataset.src;
    const title = item.dataset.title || '';
    const caption = item.dataset.caption || '';

    if (lightboxImg && lightboxCaption && lightboxCounter) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxImg.style.opacity = '1';
      }, 150);

      const cat = item.dataset.category || '';
      let customizerParam = '';
      if (cat.includes('suits')) customizerParam = '?silhouette=tuxedo&fabric=italian-wool';
      else if (cat.includes('ethnic')) customizerParam = '?silhouette=sherwani&fabric=banarasi-silk';
      else if (cat.includes('waistcoats')) customizerParam = '?silhouette=nehru-jacket&fabric=banarasi-silk';
      else if (cat.includes('fabrics')) customizerParam = '?fabric=italian-wool';

      const actionButtons = `
        <div class="lightbox-action-row" style="margin-top:0.85rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
          <a href="https://wa.me/917926449098?text=${encodeURIComponent(`Hello Big Boss & Co, I am inquiring about "${title}" from your showroom lookbook.`)}" target="_blank" rel="noopener" class="btn-luxury-primary" style="padding:0.45rem 1rem; font-size:0.8rem; min-height:auto;">
            Inquire on WhatsApp ↗
          </a>
          <a href="customizer.html${customizerParam}" class="btn-luxury-outline" style="padding:0.45rem 1rem; font-size:0.8rem; min-height:auto; border-color:rgba(184,147,68,0.6); color:#FFFFFF;">
            Configure in Studio →
          </a>
        </div>
      `;

      lightboxCaption.innerHTML = `<strong style="font-size:1.1rem; color:#FFFFFF;">${title}</strong><br><span style="color:#D1D5DB; font-size:0.86rem; margin-top:0.3rem; display:inline-block;">${caption}</span>${actionButtons}`;
      lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryItems.length}`;
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showPhotoAtIndex(index);
      lightboxModal?.classList.add('active');
      lightboxModal?.setAttribute('aria-hidden', 'false');
    });
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhotoAtIndex(currentPhotoIndex - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPhotoAtIndex(currentPhotoIndex + 1);
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // Touch swipe support for iOS Safari & Android mobile browsers
  let touchStartX = 0;
  let touchEndX = 0;
  lightboxModal?.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].screenX;
    }
  }, { passive: true });

  lightboxModal?.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          showPhotoAtIndex(currentPhotoIndex + 1); // Swipe left -> Next
        } else {
          showPhotoAtIndex(currentPhotoIndex - 1); // Swipe right -> Previous
        }
      }
    }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhotoAtIndex(currentPhotoIndex - 1);
    if (e.key === 'ArrowRight') showPhotoAtIndex(currentPhotoIndex + 1);
  });
}

/* ==========================================================================
   7. APPOINTMENT BOOKING, PASS GENERATOR & GOLDEN STARDUST BURST
   ========================================================================== */
function initAppointmentBooking() {
  const form = document.getElementById('appointmentForm');
  const ticketModal = document.getElementById('ticketModal');
  const closeTicketBtn = document.getElementById('closeTicketModalBtn');
  const whatsAppTicketBtn = document.getElementById('sendWhatsAppTicketBtn');
  const calendarBtn = document.getElementById('addGoogleCalendarBtn');
  const printTicketBtn = document.getElementById('printTicketBtn');
  const copyRefBtn = document.getElementById('copyRefBtn');

  if (!form) return;

  // Check if a bespoke specification was transferred from the customizer page
  try {
    const savedSpec = sessionStorage.getItem('bigboss_customizer_spec');
    if (savedSpec) {
      const spec = JSON.parse(savedSpec);
      const garmentSelect = document.getElementById('garmentType');
      const notesArea = document.getElementById('specialNotes');

      if (garmentSelect && spec.silhouette) {
        const silText = (spec.silhouette || '').toLowerCase();
        const opts = Array.from(garmentSelect.options);
        let match = null;
        if (silText.includes('tuxedo')) {
          match = opts.find(o => o.value.toLowerCase().includes('tuxedo'));
        } else if (silText.includes('sherwani')) {
          match = opts.find(o => o.value.toLowerCase().includes('sherwani'));
        } else if (silText.includes('nehru') || silText.includes('bandi')) {
          match = opts.find(o => o.value.toLowerCase().includes('nehru') || o.value.toLowerCase().includes('bandi'));
        } else if (silText.includes('indo-western') || silText.includes('achkan')) {
          match = opts.find(o => o.value.toLowerCase().includes('indo-western') || o.value.toLowerCase().includes('achkan'));
        } else if (silText.includes('business') || silText.includes('executive') || silText.includes('suit')) {
          match = opts.find(o => o.value.toLowerCase().includes('executive') || o.value.toLowerCase().includes('suit'));
        } else if (silText.includes('shirt') || silText.includes('trouser')) {
          match = opts.find(o => o.value.toLowerCase().includes('shirt'));
        }
        if (match) garmentSelect.value = match.value;
      }

      if (notesArea && !notesArea.value) {
        notesArea.value = `[Transferred Customizer Spec] Silhouette: ${spec.silhouette} | Fabric: ${spec.fabric} | Lapel: ${spec.lapel} | Accent: ${spec.accent}${spec.monogram ? ` (Monogram: ${spec.monogram})` : ''} | Est. Investment: ₹${Number(spec.price).toLocaleString('en-IN')}`;
      }

      // Display luxury visual banner on booking page
      const specBanner = document.getElementById('attachedSpecBanner');
      if (specBanner) {
        specBanner.innerHTML = `
          <div class="attached-spec-card">
            <div class="attached-spec-header">
              <div class="attached-spec-title">
                <span class="pulse-dot"></span>
                <h5>Bespoke Blueprint Attached from Studio</h5>
              </div>
              <a href="customizer.html" class="attached-spec-edit">Modify in Studio ↗</a>
            </div>
            <div class="attached-spec-body">
              <div class="spec-chip"><strong>Silhouette:</strong> ${spec.silhouette}</div>
              <div class="spec-chip"><strong>Fabric:</strong> ${spec.fabric}</div>
              <div class="spec-chip"><strong>Lapel:</strong> ${spec.lapel}</div>
              <div class="spec-chip"><strong>Accent:</strong> ${spec.accent}${spec.monogram ? ` ("${spec.monogram}")` : ''}</div>
              <div class="spec-chip price"><strong>Est. Investment:</strong> ₹${Number(spec.price).toLocaleString('en-IN')}</div>
            </div>
          </div>
        `;
        specBanner.style.display = 'block';
      }

      sessionStorage.removeItem('bigboss_customizer_spec');
      document.getElementById('clientName')?.focus();
    }
  } catch (err) {}

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const garment = document.getElementById('garmentType').value;
    const venue = document.getElementById('consultationType').value;
    const date = document.getElementById('preferredDate').value;
    const time = document.getElementById('preferredTime').value;
    const notes = document.getElementById('specialNotes').value.trim();

    if (!name || !phone || !date) {
      alert('Please fill in your Name, Phone Number, and Preferred Date.');
      return;
    }

    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const refCode = `BB-2026-${randomCode}`;

    const dateObj = new Date(date);
    const dateFormatted = dateObj.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const elRef = document.getElementById('ticketRefCode');
    if (elRef) elRef.textContent = refCode;
    const elName = document.getElementById('ticketClientName');
    if (elName) elName.textContent = name;
    const elPhone = document.getElementById('ticketClientPhone');
    if (elPhone) elPhone.textContent = phone;
    const elGarment = document.getElementById('ticketGarmentType');
    if (elGarment) elGarment.textContent = garment;

    const elVenue = document.getElementById('ticketVenue') || document.getElementById('ticketConsultationType');
    if (elVenue) elVenue.textContent = venue;

    const elDate = document.getElementById('ticketDate');
    if (elDate) elDate.textContent = dateFormatted;
    const elTime = document.getElementById('ticketTime');
    if (elTime) elTime.textContent = time;
    const elDateTime = document.getElementById('ticketDateTime');
    if (elDateTime) elDateTime.textContent = `${dateFormatted} at ${time}`;

    // Trigger Golden Stardust Celebration Burst
    const submitBtn = form.querySelector('button[type="submit"]');
    const rect = submitBtn?.getBoundingClientRect();
    if (rect) {
      triggerStardustBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    // Google Calendar Event Link
    if (calendarBtn) {
      const cleanDate = date.replace(/-/g, '');
      const startTimeFormatted = `${cleanDate}T110000Z`;
      const endTimeFormatted = `${cleanDate}T123000Z`;
      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Bespoke Fitting Trial - Big Boss & Co')}&dates=${startTimeFormatted}/${endTimeFormatted}&details=${encodeURIComponent(`Bespoke fitting trial for ${name} (${garment}). Ref: ${refCode}`)}&location=${encodeURIComponent('10, Sun House, Opp. Navrangpura Tel. Exch., C.G. Road, Ahmedabad')}`;
      calendarBtn.href = calUrl;
    }

    // Copy Reference Code Handler
    if (copyRefBtn) {
      copyRefBtn.onclick = () => {
        navigator.clipboard.writeText(refCode).then(() => {
          const original = copyRefBtn.innerHTML;
          copyRefBtn.innerHTML = '✓ Copied Pass Ref!';
          setTimeout(() => { copyRefBtn.innerHTML = original; }, 2200);
        }).catch(() => {
          alert(`Reference Code: ${refCode}`);
        });
      };
    }

    if (whatsAppTicketBtn) {
      const msg = encodeURIComponent(
        `*Big Boss & Co Bespoke Appointment Pass*\n` +
        `Pass Ref: ${refCode}\n` +
        `Client: ${name}\n` +
        `Phone: ${phone}\n` +
        `Garment: ${garment}\n` +
        `Venue: ${venue}\n` +
        `Schedule: ${dateFormatted} at ${time}\n` +
        (notes ? `Notes: ${notes}\n` : '') +
        `Please confirm my fitting session.`
      );
      whatsAppTicketBtn.onclick = () => {
        window.open(`https://wa.me/917926449098?text=${msg}`, '_blank');
      };
    }

    if (ticketModal) {
      ticketModal.classList.add('active');
      ticketModal.setAttribute('aria-hidden', 'false');
    }
  });

  if (closeTicketBtn) {
    closeTicketBtn.addEventListener('click', closeTicketModal);
  }

  if (ticketModal) {
    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) closeTicketModal();
    });
  }

  if (printTicketBtn) {
    printTicketBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function closeTicketModal() {
  const ticketModal = document.getElementById('ticketModal');
  if (ticketModal) {
    ticketModal.classList.remove('active');
    ticketModal.setAttribute('aria-hidden', 'true');
  }
}

function triggerStardustBurst(originX, originY) {
  const colors = ['#D4AF37', '#9C782B', '#F5E7A9', '#B45309', '#10B981'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('stardust-particle');
    const size = Math.random() * 8 + 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 140 + 40;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1200);
  }
}

function initDefaultBookingDate() {
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = `${yyyy}-${mm}-${dd}`;
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
}

/* ==========================================================================
   8. 3D CARD TILT EFFECT (TACTILE APPLE/STRIPE LUXURY MICRO-INTERACTION)
   ========================================================================== */
function init3DCardTilt() {
  // Only enable 3D card tilt on desktop devices with fine pointer (mouse/trackpad) to prevent touch jitter on mobile
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll('.tilt-card, .hero-featured-box');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   9. ATELIER ACTIVITY TICKER TOAST (DISCREET UX ENHANCEMENT)
   ========================================================================== */
function initAtelierActivityToast() {
  const toast = document.getElementById('activityToast');
  const toastMsg = document.getElementById('toastMessage');
  const closeBtn = document.getElementById('closeToastBtn');
  if (!toast || !toastMsg) return;

  try {
    if (sessionStorage.getItem('bigboss_toast_dismissed') === '1') {
      return;
    }
  } catch (e) {}

  let dismissed = false;
  let isHovered = false;

  const activities = [
    'Hand-basted: 3-Piece Italian Wool Tuxedo for trial today',
    'Appointment reserved: Master fitting trial for Bodakdev groom',
    'New Textile Roll: Super 150s Pure Wool suiting bolts added',
    'Finished garment: Royal Embroidered Sherwani ready for pickup',
    'Bespoke consultation scheduled at C.G. Road Showroom',
    'Anatomical pattern cut: 2-Piece Executive Suit for Navrangpura patron'
  ];

  let actIndex = 0;
  let hideTimeout = null;

  toast.addEventListener('mouseenter', () => { isHovered = true; });
  toast.addEventListener('mouseleave', () => {
    isHovered = false;
    if (toast.classList.contains('visible') && !dismissed) {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!isHovered && !dismissed) toast.classList.remove('visible');
      }, 2500);
    }
  });

  function showNextToast() {
    if (dismissed || isHovered) return;
    toastMsg.textContent = activities[actIndex];
    toast.classList.add('visible');

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!dismissed && !isHovered) toast.classList.remove('visible');
    }, 6000);

    actIndex = (actIndex + 1) % activities.length;
  }

  // First toast after 3 seconds
  setTimeout(() => {
    showNextToast();
    setInterval(showNextToast, 16000);
  }, 3000);

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissed = true;
    clearTimeout(hideTimeout);
    toast.classList.remove('visible');
    try {
      sessionStorage.setItem('bigboss_toast_dismissed', '1');
    } catch (err) {}
  });
}

/* ==========================================================================
   10. MOBILE NAVIGATION TOGGLE & HEADER SCROLL SHADOW
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.setAttribute('aria-expanded', 'false');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when tapping any navigation link
    navMenu.querySelectorAll('.nav-item-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when tapping anywhere outside the mobile drawer
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when resizing above mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }

  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });
}
