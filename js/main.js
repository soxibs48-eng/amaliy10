/**
 * Night Trips (NT) - Main JavaScript
 * Handles interactive trip slider, category filters, booking modal,
 * ambient audio synthesizer, toast alerts, and navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Trip Data Model
  // ==========================================================================
  const tripsData = [
    {
      id: 1,
      number: '01',
      category: 'CHILL',
      categoryTag: 'CHILL EXPEDITION',
      title: 'Chill Adventure',
      image: 'assets/images/trip-dunes.svg',
      description: 'Immerse yourself in tranquil silence across undulating sand dunes under an ocean of stars. Includes luxury heated tent encampment, fireside tea ceremonies, and telescope astronomy sessions led by certified celestial navigators.',
      duration: '3 Nights / 4 Days',
      group: 'Small Group (Max 8)',
      difficulty: 'Gentle / Leisurely',
      price: '$890 / guest',
      numericPrice: 890,
      selectKey: 'chill'
    },
    {
      id: 2,
      number: '02',
      category: 'EXTREME',
      categoryTag: 'EXTREME TRAVERSE',
      title: 'Extreme Nocturne',
      image: 'assets/images/trip-extreme.svg',
      description: 'A thrilling high-altitude traverse along moonlit sandstone ridges and canyon ledges. Equipped with night-vision systems and headlamps, climb to isolated summits for an unobstructed 360° panoramic view of deep space.',
      duration: '4 Nights / 5 Days',
      group: 'Solo / Duos (Max 6)',
      difficulty: 'Challenging / Technical',
      price: '$1,250 / guest',
      numericPrice: 1250,
      selectKey: 'extreme'
    },
    {
      id: 3,
      number: '03',
      category: 'REGULAR',
      categoryTag: 'REGULAR POLAR EXPEDITION',
      title: 'Aurora Chaser',
      image: 'assets/images/trip-aurora.svg',
      description: 'Venture into the pristine Arctic wilderness where the northern lights dance across mirror-like glacial fjords. Includes heated glass-roof geodesic domes, thermal suits, and expert-led astrophotography workshops.',
      duration: '5 Nights / 6 Days',
      group: 'Small Group (Max 10)',
      difficulty: 'Moderate',
      price: '$1,690 / guest',
      numericPrice: 1690,
      selectKey: 'aurora'
    },
    {
      id: 4,
      number: '04',
      category: 'CUSTOM',
      categoryTag: 'CUSTOM NOCTURNE',
      title: 'Mystical Forest',
      image: 'assets/images/trip-forest.svg',
      description: 'A completely bespoke nocturnal journey tailored to your private group. Traverse glowing ancient cedar trails surrounded by bioluminescent flora, canopy walk retreats, and private stargazing astronomers.',
      duration: 'Custom (2-7 Nights)',
      group: 'Private Group Only',
      difficulty: 'Tailored To Preference',
      price: '$780 / guest',
      numericPrice: 780,
      selectKey: 'forest'
    }
  ];

  let currentTripIndex = 0; // Starts with Chill Adventure

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link:not(.drawer-nav-link)');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const drawerNavLinks = document.querySelectorAll('.drawer-nav-link');

  // Trip Elements
  const tabButtons = document.querySelectorAll('.trip-tab-btn');
  const tripBadgeNum = document.getElementById('tripBadgeNum');
  const tripMainImage = document.getElementById('tripMainImage');
  const tripCategoryTag = document.getElementById('tripCategoryTag');
  const tripTitle = document.getElementById('tripTitle');
  const tripDescription = document.getElementById('tripDescription');
  const tripDuration = document.getElementById('tripDuration');
  const tripGroup = document.getElementById('tripGroup');
  const tripDifficulty = document.getElementById('tripDifficulty');
  const tripPrice = document.getElementById('tripPrice');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlideNum = document.getElementById('totalSlideNum');
  const prevTripBtn = document.getElementById('prevTripBtn');
  const nextTripBtn = document.getElementById('nextTripBtn');
  const bookActiveTripBtn = document.getElementById('bookActiveTripBtn');
  const viewItineraryBtn = document.getElementById('viewItineraryBtn');

  // Booking Modal Elements
  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtn = document.getElementById('openBookingBtn');
  const mobileDrawerBookBtn = document.getElementById('mobileDrawerBookBtn');
  const closeBookingBtn = document.getElementById('closeBookingBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookingTripSelect = document.getElementById('bookingTripSelect');
  const bookingGuests = document.getElementById('bookingGuests');
  const modalPriceTotal = document.getElementById('modalPriceTotal');

  // Newsletter & Buttons
  const newsletterForm = document.getElementById('newsletterForm');
  const heroAboutBtn = document.getElementById('heroAboutBtn');
  const aboutMoreBtn = document.getElementById('aboutMoreBtn');
  const toastContainer = document.getElementById('toastContainer');
  const ambientSoundBtn = document.getElementById('ambientSoundBtn');

  // ==========================================================================
  // Header Scroll & Active Section Spy
  // ==========================================================================
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for navigation
    const sections = ['hero', 'pick-trip', 'about', 'testimonials', 'contact'];
    let currentSection = 'hero';

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          currentSection = id;
        }
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==========================================================================
  // Mobile Drawer Toggle
  // ==========================================================================
  const openDrawer = () => {
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  drawerNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ==========================================================================
  // Trip Showcase Renderer
  // ==========================================================================
  const renderTrip = (index) => {
    const trip = tripsData[index];
    if (!trip) return;

    // Fade out visual
    tripMainImage.style.opacity = '0';
    tripTitle.style.opacity = '0';
    tripDescription.style.opacity = '0';

    setTimeout(() => {
      tripBadgeNum.textContent = trip.number;
      tripMainImage.src = trip.image;
      tripMainImage.alt = `${trip.title} - ${trip.categoryTag}`;
      tripCategoryTag.textContent = trip.categoryTag;
      tripTitle.textContent = trip.title;
      tripDescription.textContent = trip.description;
      tripDuration.textContent = trip.duration;
      tripGroup.textContent = trip.group;
      tripDifficulty.textContent = trip.difficulty;
      tripPrice.textContent = trip.price;
      currentSlideNum.textContent = trip.number;
      totalSlideNum.textContent = `0${tripsData.length}`;

      // Update active category tab
      tabButtons.forEach((tab) => {
        const isActive = tab.getAttribute('data-category') === trip.category;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Fade in
      tripMainImage.style.opacity = '1';
      tripTitle.style.opacity = '1';
      tripDescription.style.opacity = '1';
    }, 150);
  };

  // Slider transitions
  tripMainImage.style.transition = 'opacity 0.25s ease, transform 0.6s ease';
  tripTitle.style.transition = 'opacity 0.25s ease';
  tripDescription.style.transition = 'opacity 0.25s ease';

  // Next / Prev actions
  if (prevTripBtn) {
    prevTripBtn.addEventListener('click', () => {
      currentTripIndex = (currentTripIndex - 1 + tripsData.length) % tripsData.length;
      renderTrip(currentTripIndex);
    });
  }

  if (nextTripBtn) {
    nextTripBtn.addEventListener('click', () => {
      currentTripIndex = (currentTripIndex + 1) % tripsData.length;
      renderTrip(currentTripIndex);
    });
  }

  // Category Tab Clicks
  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');
      const targetIndex = tripsData.findIndex((t) => t.category === category);
      if (targetIndex !== -1) {
        currentTripIndex = targetIndex;
        renderTrip(currentTripIndex);
      }
    });
  });

  // Keyboard navigation for slider
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') {
      currentTripIndex = (currentTripIndex + 1) % tripsData.length;
      renderTrip(currentTripIndex);
    } else if (e.key === 'ArrowLeft') {
      currentTripIndex = (currentTripIndex - 1 + tripsData.length) % tripsData.length;
      renderTrip(currentTripIndex);
    }
  });

  // ==========================================================================
  // Booking Modal & Price Calculator
  // ==========================================================================
  const updateModalPrice = () => {
    const selectedOption = bookingTripSelect.options[bookingTripSelect.selectedIndex];
    const pricePerGuest = parseInt(selectedOption.getAttribute('data-price') || '890', 10);
    const guests = parseInt(bookingGuests.value || '2', 10);
    const total = pricePerGuest * guests;
    modalPriceTotal.textContent = `$${total.toLocaleString()}`;
  };

  const openBooking = (presetKey = null) => {
    if (presetKey) {
      bookingTripSelect.value = presetKey;
    }
    updateModalPrice();
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeBooking = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openBookingBtn) openBookingBtn.addEventListener('click', () => openBooking());
  if (mobileDrawerBookBtn) {
    mobileDrawerBookBtn.addEventListener('click', () => {
      closeDrawer();
      openBooking();
    });
  }
  if (bookActiveTripBtn) {
    bookActiveTripBtn.addEventListener('click', () => {
      const activeTrip = tripsData[currentTripIndex];
      openBooking(activeTrip.selectKey);
    });
  }
  if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBooking);

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBooking();
  });

  bookingTripSelect.addEventListener('change', updateModalPrice);
  bookingGuests.addEventListener('change', updateModalPrice);

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('bookingName').value;
    const selectedTrip = bookingTripSelect.options[bookingTripSelect.selectedIndex].text.split('—')[0];

    closeBooking();
    showToast(`🌌 Thank you, ${guestName}! Reservation request for "${selectedTrip}" received. Our expedition concierge will contact you within 2 hours.`);
    bookingForm.reset();
  });

  // View Itinerary Button
  if (viewItineraryBtn) {
    viewItineraryBtn.addEventListener('click', () => {
      const trip = tripsData[currentTripIndex];
      showToast(`🧭 Downloaded complete PDF itinerary & astronomical guide for "${trip.title}".`);
    });
  }

  // ==========================================================================
  // Newsletter Form & Story Triggers
  // ==========================================================================
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      showToast(`✨ ${email} is now subscribed to Night Trips astronomical alerts & seasonal departures!`);
      newsletterForm.reset();
    });
  }

  if (heroAboutBtn) {
    heroAboutBtn.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (aboutMoreBtn) {
    aboutMoreBtn.addEventListener('click', () => {
      showToast('📖 Night Trips Philosophy: Founded on darkness advocacy, zero light pollution, and ecological wilderness preservation.');
    });
  }

  // FAQ Quick Links
  const safetyLink = document.getElementById('faqSafetyLink');
  const gearLink = document.getElementById('faqGearLink');
  const weatherLink = document.getElementById('faqWeatherLink');

  if (safetyLink) {
    safetyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('🛡️ Safety: Every expedition carries satellite SOS communicators, trauma medics, and dual celestial navigators.');
    });
  }
  if (gearLink) {
    gearLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('🎒 Gear: High-grade red-filtered headlamps, insulated sub-zero sleeping gear, and Celestron telescopes provided.');
    });
  }
  if (weatherLink) {
    weatherLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('☁️ Weather: In case of overcast conditions, trips are seamlessly rerouted to optimal cloudless microclimates.');
    });
  }

  // ==========================================================================
  // Ambient Sound Synthesizer (Web Audio API)
  // Generates soothing night breeze and gentle cricket ambience without external MP3s
  // ==========================================================================
  let audioCtx = null;
  let isPlayingSound = false;
  let windGain = null;
  let noiseNode = null;

  const initAmbientAudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();

    // Create pink noise for night wind breeze
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.04; // keep soft volume
      b6 = white * 0.115926;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Lowpass filter for muffled night wind
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    noiseNode.connect(filter);
    filter.connect(windGain);
    windGain.connect(audioCtx.destination);
    noiseNode.start();
  };

  if (ambientSoundBtn) {
    ambientSoundBtn.addEventListener('click', () => {
      if (!audioCtx) {
        initAmbientAudio();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (!isPlayingSound) {
        windGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.5);
        isPlayingSound = true;
        ambientSoundBtn.style.color = '#22D3EE';
        showToast('🌙 Ambient nocturnal breeze audio active.');
      } else {
        windGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.3);
        isPlayingSound = false;
        ambientSoundBtn.style.color = '';
        showToast('🔇 Ambience sound muted.');
      }
    });
  }

  // ==========================================================================
  // Toast Notification Function
  // ==========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4500);
  }

  // Initial render
  renderTrip(currentTripIndex);
});
