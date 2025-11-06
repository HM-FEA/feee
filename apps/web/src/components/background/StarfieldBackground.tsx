'use client';

import { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  color: 'emerald' | 'cyan';
}

const STAR_COUNT = 200;
const SPEED = 0.3; // Reduced from 2 to 0.3 for slower, more subtle movement

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars - limited z-depth for cylinder effect
    const initStars = () => {
      starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 300 + 700, // Limited z-range (700-1000) for cylinder-like depth
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.5 ? 'emerald' : 'cyan',
      }));
    };
    initStars();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        // Move stars toward camera
        star.z -= SPEED;

        // Reset star when it reaches camera (maintain cylinder depth)
        if (star.z <= 700) {
          star.z = 1000;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }

        // Perspective projection
        const scale = 1000 / (1000 - star.z);
        const x = (star.x - canvas.width / 2) * scale + canvas.width / 2;
        const y = (star.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = star.size * scale;

        // Mouse parallax effect (very subtle, reduced from 0.02 to 0.005)
        const dx = (mouseRef.current.x - canvas.width / 2) * 0.005;
        const dy = (mouseRef.current.y - canvas.height / 2) * 0.005;

        const finalX = x + dx * (1 - star.z / 1000);
        const finalY = y + dy * (1 - star.z / 1000);

        // Draw star
        const opacity = star.opacity * (1 - star.z / 1000) * 0.8;
        const color = star.color === 'emerald' ? '0, 255, 159' : '0, 229, 255';

        ctx.fillStyle = `rgba(${color}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect for closer stars
        if (star.z < 500) {
          ctx.strokeStyle = `rgba(${color}, ${opacity * 0.5})`;
          ctx.lineWidth = size * 0.5;
          ctx.beginPath();
          ctx.arc(finalX, finalY, size, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #050505 0%, #0D0D0F 100%)',
      }}
    />
  );
}
