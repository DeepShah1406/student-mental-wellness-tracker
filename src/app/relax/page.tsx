"use client";

import { useState, useEffect, useRef } from "react";

// Synthesize relaxing chime sound (C5 -> G5 -> C6) for session completion
const playChime = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    // Play a nice upward chime arpeggio
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
    
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (err) {
    console.error("Audio playback error:", err);
  }
};

// Synthesize bubble popping sound (plop sound effect using frequency sweep)
const playPlop = () => {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    // Quick frequency sweep down to simulate a bubble pop
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch (err) {
    console.error("Audio playback error:", err);
  }
};

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  popped: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

type TimerMode = "focus" | "shortBreak" | "longBreak";

export default function RelaxCenter() {
  // --- Pomodoro Timer State ---
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Time durations (in seconds)
  const durations: Record<TimerMode, number> = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  // Switch mode and reset timer
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playChime();
            // Automatically transition focus to short break, break to focus
            if (mode === "focus") {
              switchMode("shortBreak");
            } else {
              switchMode("focus");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Controls
  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Circular progress math
  const totalSeconds = durations[mode];
  const percentLeft = (timeLeft / totalSeconds) * 100;
  const strokeDashoffset = 282.6 - (282.6 * percentLeft) / 100;

  // --- Zen Bubble Popper Game State ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const bubbleIdCounter = useRef<number>(0);
  const [popCount, setPopCount] = useState<number>(0);

  // Colors suitable for a calm dark theme
  const bubbleColors = [
    "rgba(99, 102, 241, 0.3)",  // Indigo
    "rgba(168, 85, 247, 0.3)",  // Purple
    "rgba(236, 72, 153, 0.3)",  // Pink
    "rgba(14, 165, 233, 0.3)",  // Sky
    "rgba(52, 211, 153, 0.3)",  // Emerald
  ];

  const particleColors = [
    "#818cf8", "#a78bfa", "#f472b6", "#38bdf8", "#34d399"
  ];

  // Initialize Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Initial setup
    bubblesRef.current = [];
    particlesRef.current = [];
    bubbleIdCounter.current = 0;

    // Spawn initial bubbles
    for (let i = 0; i < 8; i++) {
      spawnBubble(canvas.width / dpr, canvas.height / dpr, true);
    }

    const render = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // --- Draw Grid/Stars Background inside Canvas ---
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.fillRect(0, 0, width, height);
      
      // Draw ambient grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- Update & Draw Bubbles ---
      const bubbles = bubblesRef.current;
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        
        // Gentle drift physics
        b.y += b.vy;
        b.x += b.vx + Math.sin(b.y / 30) * 0.2; // slight wobble

        // Boundary bounce (sides)
        if (b.x - b.radius < 0 || b.x + b.radius > width) {
          b.vx *= -1;
        }

        // Re-spawn if floats off top
        if (b.y + b.radius < -10) {
          bubbles.splice(i, 1);
          spawnBubble(width, height, false);
          continue;
        }

        // Draw bubble body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        // Draw bubble glossy highlights
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();
      }

      // Maintain bubble count
      while (bubblesRef.current.length < 10) {
        spawnBubble(width, height, false);
      }

      // --- Update & Draw Particles ---
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // small gravity drift
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  const spawnBubble = (width: number, height: number, initialRandomY = false) => {
    const radius = 20 + Math.random() * 25;
    const x = radius + Math.random() * (width - radius * 2);
    // Float up from bottom or place randomly on initial load
    const y = initialRandomY ? Math.random() * (height - 100) + 50 : height + radius + 10;
    
    bubbleIdCounter.current += 1;
    bubblesRef.current.push({
      id: bubbleIdCounter.current,
      x,
      y,
      radius,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.5 + Math.random() * 0.8), // gentle upward velocity
      color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      popped: false,
    });
  };

  // Handle Canvas Clicking (Popping Bubbles)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bubbles = bubblesRef.current;
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      const distance = Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2);

      // Pop hit detection
      if (distance <= b.radius + 6) { // slight margin for easy mobile clicks
        // Trigger pop effects
        playPlop();
        setPopCount((prev) => prev + 1);

        // Spawn particles
        const count = 12 + Math.floor(Math.random() * 8);
        for (let j = 0; j < count; j++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          particlesRef.current.push({
            x: b.x,
            y: b.y,
            radius: 1.5 + Math.random() * 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            alpha: 1.0,
          });
        }

        // Remove the bubble and spawn a new one from bottom
        bubbles.splice(i, 1);
        spawnBubble(rect.width, rect.height, false);
        break;
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-start relative overflow-hidden bg-slate-950 px-4 py-8">
      {/* Glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full space-y-8 z-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-semibold">
            🧘‍♀️ Relax & Focus Space
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Relax Center
          </h1>
          <p className="text-xs text-slate-400">
            A balanced zone to manage your exam anxiety. Focus with the Pomodoro Timer, and pop bubbles to unwind.
          </p>
        </div>

        {/* Dynamic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card 1: Pomodoro Timer */}
          <div className="lg:col-span-5 glass p-8 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex flex-col items-center justify-between space-y-8">
            <div className="w-full text-center space-y-1.5">
              <h2 className="text-lg font-bold text-slate-200">Study Pomodoro</h2>
              <p className="text-xs text-slate-400">Focus your studies, then rest. Studies show 25m focus keeps minds fresh.</p>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative h-48 w-48 flex items-center justify-center">
              <svg className="absolute h-full w-full transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="96"
                  cy="96"
                  r="45"
                  className="stroke-slate-900 fill-none"
                  strokeWidth="8"
                />
                {/* Active Indicator */}
                <circle
                  cx="96"
                  cy="96"
                  r="45"
                  className="stroke-indigo-500 fill-none transition-all duration-300"
                  strokeWidth="8"
                  strokeDasharray="282.6"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Counter Display */}
              <div className="text-center z-10">
                <span className="text-4xl font-extrabold tracking-wider font-mono text-slate-100 block">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
                  {mode === "focus" ? "🎯 Focus Session" : mode === "shortBreak" ? "☕ Rest Break" : "🌴 Long Rest"}
                </span>
              </div>
            </div>

            {/* Mode Selectors */}
            <div className="flex bg-slate-950 border border-slate-850 p-1.5 rounded-xl gap-1 w-full">
              <button
                onClick={() => switchMode("focus")}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  mode === "focus" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => switchMode("shortBreak")}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  mode === "shortBreak" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Short Rest (5m)
              </button>
              <button
                onClick={() => switchMode("longBreak")}
                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  mode === "longBreak" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Long Rest (15m)
              </button>
            </div>

            {/* Timer Actions */}
            <div className="flex gap-4 items-center">
              <button
                onClick={resetTimer}
                title="Reset Session"
                className="p-3 rounded-full border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center"
              >
                🔄
              </button>
              <button
                onClick={toggleTimer}
                className={`px-8 py-3 rounded-full font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 ${
                  isRunning
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/10"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/10"
                }`}
              >
                {isRunning ? (
                  <>⏸️ Pause</>
                ) : (
                  <>▶️ Start Focus</>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Zen Bubble Popper */}
          <div className="lg:col-span-7 glass p-8 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-200">Zen Bubble Popper</h2>
                <p className="text-xs text-slate-400">Click gently drifting bubbles to pop them. Pressure-free rest mode.</p>
              </div>
              <div className="bg-purple-950/25 border border-purple-500/20 px-3 py-1.5 rounded-xl text-center">
                <span className="block text-[9px] text-purple-400 font-bold uppercase tracking-wider">Bubbles Popped</span>
                <span className="text-lg font-black text-white font-mono">{popCount}</span>
              </div>
            </div>

            {/* Game Canvas Container */}
            <div className="relative border border-slate-850 rounded-2xl overflow-hidden bg-slate-950 h-[380px] w-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              />
              {/* Gentle Helper hint */}
              {popCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-950/40 backdrop-blur-[1px] transition-opacity duration-500">
                  <div className="text-center p-6 space-y-2 max-w-xs bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
                    <span className="text-3xl block animate-bounce">🧼</span>
                    <h3 className="text-xs font-bold text-slate-200">Tap to Pop</h3>
                    <p className="text-[10px] text-slate-400">Gently tap floating bubbles to hear calm synthesized plops and clear your mind.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="flex gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[10px] text-indigo-300 items-start">
              <span>💡</span>
              <p className="leading-normal">
                <strong>Taking study pauses:</strong> Scientific research shows taking a 5-minute break every 25 minutes restores focus, improves motivation, and reduces test anxiety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
