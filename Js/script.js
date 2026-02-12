// © Zero - Código libre no comercial

// Cargar el SVG y animar los corazones
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    if (!container) return;
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        setTimeout(() => {
          showDedicationText();
          startFloatingObjects();
          showCountdown();
          playBackgroundMusic(); 
        }, 1200);
      }, totalDuration);
    }, 50);

    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida:\n\nDesde el primer momento supe que eras tú. Tu sonrisa, tu voz, tu forma de ser… todo en ti me hace sentir en casa.\n\nGracias por acompañarme en cada paso, por entenderme incluso en silencio, y por llenar mis días de amor.\n\nTe amo más de lo que las palabras pueden expresar.`;
  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      setTimeout(showSignature, 600);
    }
  }
  type();
}

function showSignature() {
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Yahir";
  signature.classList.add('visible');
}

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}

function showCountdown() {
  const container = document.getElementById('countdown');
  let startParam = getURLParam('start');
  let eventParam = getURLParam('event');
  let startDate = startParam ? new Date(startParam + 'T00:00:00') : new Date('2024-12-11T00:00:00'); 
  let eventDate = eventParam ? new Date(eventParam + 'T00:00:00') : new Date('2026-12-11T00:00:00');

  function update() {
    const now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let eventDiff = eventDate - now;
    let eventDays = Math.max(0, Math.floor(eventDiff / (1000 * 60 * 60 * 24)));
    let eventHours = Math.max(0, Math.floor((eventDiff / (1000 * 60 * 60)) % 24));
    let eventMinutes = Math.max(0, Math.floor((eventDiff / (1000 * 60)) % 60));
    let eventSeconds = Math.max(0, Math.floor((eventDiff / 1000) % 60));

    container.innerHTML =
      `Llevamos juntos: <b>${days}</b> días<br>` +
      `Nuestro aniversario: <b>${eventDays}d ${eventHours}h ${eventMinutes}m ${eventSeconds}s</b>`;
    container.classList.add('visible');
  }
  update();
  setInterval(update, 1000);
}

// --- MÚSICA CON NOMBRES CORREGIDOS (music1, music2, music3) ---
function playBackgroundMusic() {
  let audio = document.getElementById('bg-music');
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'bg-music';
    document.body.appendChild(audio);
  }

  // NOMBRES CORREGIDOS AQUÍ
  const playlist = [
    'Music/music1.mp3',
    'Music/music2.mp3',
    'Music/music3.mp3'
  ];

  function getRandomTrack() {
    return playlist[Math.floor(Math.random() * playlist.length)];
  }

  let currentTrack = getRandomTrack();
  audio.src = currentTrack;
  audio.volume = 0.6;

  audio.addEventListener('ended', () => {
    let nextTrack;
    do {
      nextTrack = getRandomTrack();
    } while (nextTrack === currentTrack && playlist.length > 1);
    currentTrack = nextTrack;
    audio.src = currentTrack;
    audio.play();
  });

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.style.cssText = "position:fixed; bottom:18px; right:18px; z-index:100; background:rgba(255,255,255,0.8); border:none; border-radius:24px; padding:10px 18px; cursor:pointer; font-size:1.1em; box-shadow: 0 2px 10px rgba(0,0,0,0.2);";
    document.body.appendChild(btn);
  }

  const updateBtnText = () => {
    btn.textContent = audio.paused ? '▶️ Música' : '🔊 Música';
  };

  const startPlay = () => {
    audio.play().then(() => {
      updateBtnText();
      window.removeEventListener('click', startPlay);
    }).catch(() => updateBtnText());
  };

  // Intentar reproducir y activar con el primer clic del usuario en la pantalla
  startPlay();
  window.addEventListener('click', startPlay, { once: true });

  btn.onclick = (e) => {
    e.stopPropagation();
    if (audio.paused) audio.play();
    else audio.pause();
    updateBtnText();
  };
}

window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
