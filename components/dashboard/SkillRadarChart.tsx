'use client';
import React, { useEffect, useState } from 'react';

export function SkillRadarChart({ skills }: { skills: { name: string; value: number }[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const size = 300;
  const center = size / 2;
  const maxRadius = center - 40;
  
  const numSides = skills.length;
  const angleStep = (Math.PI * 2) / numSides;
  
  const getPoint = (value: number, index: number, radiusScale: number = 1) => {
    const r = (value / 100) * maxRadius * radiusScale;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate background grid polygons
  const levels = [20, 40, 60, 80, 100];
  const grids = levels.map(level => {
    return skills.map((_, i) => {
      const pt = getPoint(level, i);
      return `${pt.x},${pt.y}`;
    }).join(' ');
  });

  const dataPoints = skills.map((s, i) => getPoint(mounted ? s.value : 0, i));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative">
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Background Grid */}
        {grids.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke="#1e293b" strokeWidth="1" />
        ))}
        
        {/* Axes */}
        {skills.map((_, i) => {
          const pt = getPoint(100, i);
          return (
            <line key={`axis-${i}`} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="#1e293b" strokeWidth="1" />
          );
        })}
        
        {/* Data Polygon */}
        <polygon 
          points={dataPolygon} 
          fill="url(#radarGradient)" 
          stroke="#8b5cf6" 
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Data Points */}
        {dataPoints.map((pt, i) => (
          <circle key={`pt-${i}`} cx={pt.x} cy={pt.y} r="4" fill="#8b5cf6" className="transition-all duration-1000 ease-out" />
        ))}
        
        {/* Labels */}
        {skills.map((skill, i) => {
          const pt = getPoint(100, i, 1.25);
          return (
            <text 
              key={`label-${i}`} 
              x={pt.x} 
              y={pt.y} 
              fill="#94a3b8" 
              fontSize="10" 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="font-medium"
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
