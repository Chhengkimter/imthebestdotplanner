import { useEffect, useRef } from 'react';

const PetalBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const COUNT = 60;
    const petals = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const rand = (a, b) => a + Math.random() * (b - a);

    const newPetal = (startFull) => ({
      x: rand(-30, canvas.width + 30),
      y: startFull ? rand(-canvas.height, canvas.height) : rand(-80, -10),
      size: rand(5, 11),
      speedY: rand(0.6, 2.0),
      speedX: rand(-0.8, 0.8),
      rot: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.025, 0.025),
      swing: rand(0.3, 1.2),
      swingSpeed: rand(0.008, 0.022),
      swingOffset: rand(0, Math.PI * 2),
      opacity: rand(0.55, 0.92),
      hue: rand(330, 355), // Keeps it in the pink/lavender range
      life: 0
    });

    for (let i = 0; i < COUNT; i++) petals.push(newPetal(true));

    const draw = (p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.6, -s * 0.9, s * 1.1, -s * 0.1, 0, s * 0.5);
      ctx.bezierCurveTo(-s * 1.1, -s * 0.1, -s * 0.6, -s * 0.9, 0, -s);
      const g = ctx.createLinearGradient(0, -s, 0, s * 0.5);
      g.addColorStop(0, `hsl(${p.hue}, 80%, 85%)`);
      g.addColorStop(1, `hsl(${p.hue}, 60%, 72%)`);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.life++;
        p.x += p.speedX + Math.sin(p.life * p.swingSpeed + p.swingOffset) * p.swing;
        p.y += p.speedY;
        p.rot += p.rotSpeed;
        if (p.y > canvas.height + 20) Object.assign(p, newPetal(false));
        draw(p);
      });
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default PetalBackground;