'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
}

export default function InteractiveCard({
  children,
  className,
  intensity = 10,
  glow = true,
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [shadowOffset, setShadowOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    // Calculate rotation angles
    const angleY = (x / centerX) * intensity;
    const angleX = -(y / centerY) * intensity;

    setRotationX(angleX);
    setRotationY(angleY);

    // Calculate shadow offset
    const shadowX = (x / centerX) * 10;
    const shadowY = (y / centerY) * 10;
    setShadowOffset({ x: shadowX, y: shadowY });
  };

  const handleMouseLeave = () => {
    setRotationX(0);
    setRotationY(0);
    setShadowOffset({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{
        rotateX: rotationX,
        rotateY: rotationY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        perspective: '1000px',
      }}
      className={clsx(
        'relative rounded-lg transition-all duration-300',
        'bg-[#0D0D0F] border border-[#1A1A1F]',
        isHovered && glow && 'border-[#00FF9F] shadow-lg',
        isHovered && glow && '[box-shadow:0_0_30px_rgba(0,255,159,0.3)]',
        className
      )}
    >
      {/* Glow effect background */}
      {glow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 blur-xl -z-10"
          animate={{
            opacity: isHovered ? 0.3 : 0,
          }}
          style={{
            background: 'radial-gradient(circle, #00FF9F, transparent)',
            x: shadowOffset.x,
            y: shadowOffset.y,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
