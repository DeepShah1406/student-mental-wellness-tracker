"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface ConfettiRef {
  trigger: () => void;
}

const Confetti = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    trigger() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const colors = ["#0d9488", "#0891b2", "#10b981", "#34d399", "#22d3ee", "#f43f5e", "#fbbf24"];
      
      // Spawn 150 explosion particles from the bottom center
      for (let i = 0; i < 150; i++) {
        particlesRef.current.push({
          x: canvas.width / 2,
          y: canvas.height + 20,
          radius: 3.5 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 16,
          vy: -18 - Math.random() * 16,
          gravity: 0.5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.01
        });
      }
      
      // Start loop if not already running
      if (!animationFrameRef.current) {
        loop();
      }
    }
  }));

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      
      // Draw standard rectangular confetti flakes
      ctx.fillRect(-p.radius, -p.radius * 1.5, p.radius * 2, p.radius * 3);
      ctx.restore();
    }

    if (particles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[999] w-screen h-screen"
    />
  );
});

Confetti.displayName = "Confetti";
export default Confetti;
