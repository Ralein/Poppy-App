"use client";

import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  tx: string;
  ty: string;
  rot: string;
  color: string;
  size: number;
}

interface PetalBurstProps {
  active: boolean;
  onComplete?: () => void;
}

export default function PetalBurst({ active, onComplete }: PetalBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#FF6B8A", "#FFB3C1", "#A8C5A0", "#F4A261", "#A8DADC"];
      const newParticles = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8 + Math.random() * 20 - 10;
        const rad = (angle * Math.PI) / 180;
        const distance = 30 + Math.random() * 25;
        const tx = `${Math.cos(rad) * distance}px`;
        const ty = `${Math.sin(rad) * distance}px`;
        const rot = `${angle + 90 + Math.random() * 45}deg`;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 6;

        return {
          id: i,
          tx,
          ty,
          rot,
          color,
          size,
        };
      });

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="petal-particle"
          style={
            {
              "--tx": p.tx,
              "--ty": p.ty,
              "--rot": p.rot,
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
              backgroundColor: p.color,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
