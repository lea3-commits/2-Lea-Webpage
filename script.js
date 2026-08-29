(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('confetti');
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext('2d');
  var colors = ['#ffe27f', '#ff9fc0', '#9bd6ff', '#b3e69b', '#d1495b', '#e8b93e'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var pieces = [];
  var COUNT = Math.min(140, Math.floor(window.innerWidth / 8));

  for (var i = 0; i < COUNT; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.25,
      vy: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 1.6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0
    });
  }

  var duration = 3200; // ms
  var start = null;

  function frame(ts) {
    if (!start) start = ts;
    var elapsed = ts - start;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var stillFalling = false;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;

      if (p.y < canvas.height + 20) stillFalling = true;

      var fade = 1;
      if (elapsed > duration - 700) {
        fade = Math.max(0, 1 - (elapsed - (duration - 700)) / 700);
      }

      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (elapsed < duration && stillFalling) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }

  requestAnimationFrame(frame);
})();
