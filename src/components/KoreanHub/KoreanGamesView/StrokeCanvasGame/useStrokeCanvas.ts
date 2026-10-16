import { useState, useRef, useEffect, useCallback } from 'react';
import { STROKE_CHARACTERS } from '../gamesData';
import type { StrokeCharacter } from '../types';
import { soundEffects } from '../soundEffects';
import { speakKorean } from '../../../../constants/koreanData';

export function useStrokeCanvas() {
  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeColor, setStrokeColor] = useState('#0f172a'); // Default Korean Obsidian Ink
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const currentChar: StrokeCharacter = STROKE_CHARACTERS[selectedCharIndex] || STROKE_CHARACTERS[0];

  // Initialize and clear canvas when currentChar changes
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnPoints([]);
    setAccuracy(null);
  }, []);

  useEffect(() => {
    clearCanvas();
  }, [currentChar, clearCanvas]);

  // Adjust canvas size for high-DPI displays
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  // Cherry blossoms celebratory effect
  const triggerBlossoms = useCallback(() => {
    const canvas = petalsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 360;
    canvas.height = canvas.parentElement?.clientHeight || 360;

    const petals: { x: number; y: number; vx: number; vy: number; rot: number; rotSpeed: number; size: number }[] = [];
    for (let i = 0; i < 35; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 50,
        vx: (Math.random() - 0.5) * 2 + 0.5,
        vy: Math.random() * 2 + 1.5,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        size: Math.random() * 6 + 6,
      });
    }

    let frames = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = 'rgba(251, 113, 133, 0.85)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      frames++;
      if (frames < 90) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  }, []);

  // Calculate drawing accuracy against character checkpoints
  const calculateAccuracy = useCallback(
    (points: { x: number; y: number }[]) => {
      const canvas = canvasRef.current;
      if (!canvas || points.length < 8) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Extract all target checkpoints
      const targetCheckpoints: { x: number; y: number }[] = [];
      currentChar.strokes.forEach((s) => {
        s.points.forEach((pt) => {
          targetCheckpoints.push({ x: pt.x * w, y: pt.y * h });
        });
      });

      if (targetCheckpoints.length === 0) return;

      // Check how many target checkpoints have at least 1 user point close to them (within tolerance)
      const tolerance = 42; // pixels
      let hitCount = 0;

      targetCheckpoints.forEach((target) => {
        const isHit = points.some((p) => {
          const dx = p.x - target.x;
          const dy = p.y - target.y;
          return Math.sqrt(dx * dx + dy * dy) <= tolerance;
        });
        if (isHit) hitCount++;
      });

      const rawRatio = hitCount / targetCheckpoints.length;
      const finalScore = Math.min(100, Math.max(50, Math.round(rawRatio * 100)));
      setAccuracy(finalScore);

      if (finalScore >= 75) {
        soundEffects.playCelebration();
        triggerBlossoms();
      }
    },
    [currentChar, triggerBlossoms]
  );

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    setDrawnPoints((prev) => [...prev, { x, y }]);
    soundEffects.playBrushStroke();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(x, y, strokeWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPointRef.current) return;

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastPointRef.current = { x, y };
    setDrawnPoints((prev) => [...prev, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Trigger score calculation
    calculateAccuracy(drawnPoints);
  };

  const handleSpeakChar = () => {
    speakKorean(currentChar.char);
  };

  return {
    currentChar,
    selectedCharIndex,
    setSelectedCharIndex,
    showGuide,
    setShowGuide,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    accuracy,
    canvasRef,
    petalsCanvasRef,
    clearCanvas,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleSpeakChar,
  };
}
