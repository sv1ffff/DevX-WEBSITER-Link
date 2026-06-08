let hasUserInteracted = false;
let carCanvas = null;

function initCanvasBg() {
  const c = document.createElement('canvas');
  c.id = 'car-canvas-bg';
  c.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;';
  document.body.prepend(c);
  const ctx = c.getContext('2d');
  let w, h, particles = [], animId;

  function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  class Trail {
    constructor() {
      this.reset();
      this.x = Math.random() * w;
    }
    reset() {
      this.x = Math.random() * w;
      this.y = -20;
      this.len = 60 + Math.random() * 120;
      this.speed = 2 + Math.random() * 4;
      this.width = 1 + Math.random() * 2.5;
      this.alpha = 0.1 + Math.random() * 0.3;
      this.hue = 42 + Math.random() * 20;
    }
    update() {
      this.y += this.speed;
      if (this.y > h + 20) this.reset();
    }
    draw(ctx) {
      const grad = ctx.createLinearGradient(this.x, this.y - this.len, this.x, this.y);
      grad.addColorStop(0, `hsla(${this.hue},100%,60%,0)`);
      grad.addColorStop(0.5, `hsla(${this.hue},100%,70%,${this.alpha})`);
      grad.addColorStop(1, `hsla(${this.hue},100%,60%,0)`);
      ctx.beginPath();
      ctx.moveTo(this.x - this.width, this.y - this.len);
      ctx.lineTo(this.x + this.width, this.y - this.len);
      ctx.lineTo(this.x + this.width * 0.5, this.y);
      ctx.lineTo(this.x - this.width * 0.5, this.y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  class Spark {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = 0.5 + Math.random() * 1.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = -0.5 - Math.random() * 1.5;
      this.alpha = 0.2 + Math.random() * 0.8;
      this.life = 0.5 + Math.random() * 0.5;
      this.maxLife = this.life;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= 0.005;
      this.alpha = this.alpha * 0.98;
      if (this.life <= 0 || this.y < -10) this.reset();
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${42 + Math.random() * 15},100%,70%,${this.alpha * (this.life / this.maxLife)})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Trail());
  for (let i = 0; i < 30; i++) particles.push(new Spark());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(10,10,26,0.15)';
    ctx.fillRect(0, 0, w, h);
    for (const p of particles) { p.update(); p.draw(ctx); }
    animId = requestAnimationFrame(animate);
  }
  animate();

  carCanvas = { stop: () => { cancelAnimationFrame(animId); c.remove(); window.removeEventListener('resize', resize); } };
}

function initMedia() {
  const bgMusic = document.getElementById('background-music');
  const bgVideo = document.getElementById('background');
  if (bgMusic) bgMusic.volume = 0.3;
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.play().then(() => {
      document.body.classList.remove('no-video');
    }).catch(() => {
      document.body.classList.add('no-video');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const startText = document.getElementById('start-text');
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const visitorCount = document.getElementById('visitor-count');
  const backgroundMusic = document.getElementById('background-music');
  const volumeIcon = document.getElementById('volume-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const transparencySlider = document.getElementById('transparency-slider');
  const backgroundVideo = document.getElementById('background');
  const glitchOverlay = document.querySelector('.glitch-overlay');
  const profileBlock = document.getElementById('profile-block');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');
  const socialIcons = document.querySelectorAll('.social-icon');
  const badges = document.querySelectorAll('.badge');
  const cursor = document.querySelector('.custom-cursor');
  const isTouch = window.matchMedia("(pointer:coarse)").matches;

  if (isTouch) {
    document.body.classList.add('touch-device');
    document.addEventListener('touchstart', e => { const t = e.touches[0]; cursor.style.left = t.clientX + 'px'; cursor.style.top = t.clientY + 'px'; cursor.style.display = 'block'; });
    document.addEventListener('touchmove', e => { const t = e.touches[0]; cursor.style.left = t.clientX + 'px'; cursor.style.top = t.clientY + 'px'; cursor.style.display = 'block'; });
    document.addEventListener('touchend', () => cursor.style.display = 'none');
  } else {
    document.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; cursor.style.display = 'block'; });
    document.addEventListener('mousedown', () => cursor.style.transform = 'scale(0.8) translate(-50%,-50%)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1) translate(-50%,-50%)');
  }

  // Hide volume controls if audio file missing
  if (backgroundMusic) {
    backgroundMusic.addEventListener('error', () => {
      document.querySelector('.volume-control')?.style.setProperty('display', 'none');
    });
  }

  const startMessage = "Click here to see the motion baby";
  let startIdx = 0, startVisible = true;
  function typeStart() {
    if (startIdx < startMessage.length) startIdx++;
    startText.textContent = startMessage.slice(0, startIdx) + (startVisible ? '|' : ' ');
    setTimeout(typeStart, 100);
  }
  setInterval(() => { startVisible = !startVisible; startText.textContent = startMessage.slice(0, startIdx) + (startVisible ? '|' : ' '); }, 500);

  function initVisitor() {
    let total = localStorage.getItem('totalVisitorCount');
    if (!total) { total = 921234; localStorage.setItem('totalVisitorCount', total); } else total = parseInt(total);
    if (!localStorage.getItem('hasVisited')) { total++; localStorage.setItem('totalVisitorCount', total); localStorage.setItem('hasVisited', 'true'); }
    visitorCount.textContent = total.toLocaleString();
  }
  initVisitor();

  function showProfile() {
    startScreen.classList.add('hidden');
    if (backgroundMusic) { backgroundMusic.muted = false; backgroundMusic.play().catch(() => {}); }
    if (document.body.classList.contains('no-video')) { initCanvasBg(); }
    profileBlock.classList.remove('hidden');
    gsap.fromTo(profileBlock, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', onComplete: () => { profileContainer.classList.add('orbit'); } });
    if (!isTouch) {
      try { new cursorTrailEffect({ length: 10, size: 8, speed: 0.2 }); } catch(e) {}
    }
    typeWriterName();
    typeWriterBio();
  }
  startScreen.addEventListener('click', showProfile);
  startScreen.addEventListener('touchstart', e => { e.preventDefault(); showProfile(); });

  const name = profileName.textContent;
  let nameText = '', nameIndex = 0, nameDeleting = false, nameCurVisible = true;
  function typeWriterName() {
    if (!nameDeleting && nameIndex < name.length) { nameText = name.slice(0, nameIndex + 1); nameIndex++; }
    else if (nameDeleting && nameIndex > 0) { nameText = name.slice(0, nameIndex - 1); nameIndex--; }
    else if (nameIndex === name.length) { nameDeleting = true; setTimeout(typeWriterName, 10000); return; }
    else if (nameIndex === 0) { nameDeleting = false; }
    profileName.textContent = nameText + (nameCurVisible ? '|' : ' ');
    if (Math.random() < 0.1) { profileName.classList.add('glitch'); setTimeout(() => profileName.classList.remove('glitch'), 200); }
    setTimeout(typeWriterName, nameDeleting ? 150 : 300);
  }
  setInterval(() => { nameCurVisible = !nameCurVisible; profileName.textContent = nameText + (nameCurVisible ? '|' : ' '); }, 500);

  const bioMessages = [ profileBio.dataset.bio || "Welcome to my profile!", "\"Hello, World!\"" ];
  let bioText = '', bioIndex = 0, bioMsgIdx = 0, bioDeleting = false, bioCurVisible = true;
  function typeWriterBio() {
    if (!bioDeleting && bioIndex < bioMessages[bioMsgIdx].length) { bioText = bioMessages[bioMsgIdx].slice(0, bioIndex + 1); bioIndex++; }
    else if (bioDeleting && bioIndex > 0) { bioText = bioMessages[bioMsgIdx].slice(0, bioIndex - 1); bioIndex--; }
    else if (bioIndex === bioMessages[bioMsgIdx].length) { bioDeleting = true; setTimeout(typeWriterBio, 2000); return; }
    else if (bioIndex === 0 && bioDeleting) { bioDeleting = false; bioMsgIdx = (bioMsgIdx + 1) % bioMessages.length; }
    profileBio.textContent = bioText + (bioCurVisible ? '|' : ' ');
    if (Math.random() < 0.1) { profileBio.classList.add('glitch'); setTimeout(() => profileBio.classList.remove('glitch'), 200); }
    setTimeout(typeWriterBio, bioDeleting ? 75 : 150);
  }
  setInterval(() => { bioCurVisible = !bioCurVisible; profileBio.textContent = bioText + (bioCurVisible ? '|' : ' '); }, 500);

  let currentAudio = backgroundMusic, isMuted = false;
  function toggleMute() {
    isMuted = !isMuted;
    if (currentAudio) currentAudio.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>';
  }
  volumeIcon.addEventListener('click', toggleMute);
  volumeIcon.addEventListener('touchstart', e => { e.preventDefault(); toggleMute(); });
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      if (currentAudio) { currentAudio.volume = volumeSlider.value; currentAudio.muted = false; isMuted = false; }
      volumeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>';
    });
  }

  if (transparencySlider) {
    transparencySlider.addEventListener('input', () => {
      const o = transparencySlider.value;
      if (o == 0) {
        profileBlock.style.background = 'rgba(0,0,0,0)'; profileBlock.style.borderColor = 'transparent'; profileBlock.style.backdropFilter = 'none';
      } else {
        profileBlock.style.background = `rgba(0,0,0,${o})`; profileBlock.style.backdropFilter = `blur(${10*o}px)`;
      }
      [socialIcons,badges,profilePicture,profileName,profileBio,visitorCount].forEach(el => { if (el&&el.forEach) el.forEach(e => { e.style.pointerEvents = 'auto'; e.style.opacity = '1'; }); });
    });
  }

  let tiltTimeout;
  function handleTilt(e, el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const mx = (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) - cx;
    const my = (e.type === 'touchmove' ? e.touches[0].clientY : e.clientY) - cy;
    const rotX = (my/r.height)*20;
    const rotY = -(mx/r.width)*20;
    gsap.to(el, { rotationX: rotX, rotationY: rotY, duration: 0.4, ease: 'power3.out', transformPerspective: 1200 });
    clearTimeout(tiltTimeout);
    if (e.type !== 'mouseleave') {
      const glowX = ((mx/r.width)*50)+50;
      const glowY = ((my/r.height)*50)+50;
      el.style.setProperty('--glow-x', glowX + '%');
      el.style.setProperty('--glow-y', glowY + '%');
    }
  }
  profileBlock.addEventListener('mousemove', e => handleTilt(e, profileBlock));
  profileBlock.addEventListener('touchmove', e => { e.preventDefault(); handleTilt(e, profileBlock); });
  profileBlock.addEventListener('mouseleave', () => {
    gsap.to(profileBlock, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
    profileBlock.style.removeProperty('--glow-x');
    profileBlock.style.removeProperty('--glow-y');
  });
  profileBlock.addEventListener('touchend', () => {
    gsap.to(profileBlock, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
  });

  profilePicture.addEventListener('mouseenter', () => { glitchOverlay.style.opacity = '1'; setTimeout(() => glitchOverlay.style.opacity = '0', 500); });
  function fastOrbit() {
    profileContainer.classList.remove('fast-orbit','orbit');
    void profileContainer.offsetWidth;
    profileContainer.classList.add('fast-orbit');
    setTimeout(() => { profileContainer.classList.remove('fast-orbit'); void profileContainer.offsetWidth; profileContainer.classList.add('orbit'); }, 500);
  }
  profilePicture.addEventListener('click', fastOrbit);
  profilePicture.addEventListener('touchstart', e => { e.preventDefault(); fastOrbit(); });

  typeStart();
});
