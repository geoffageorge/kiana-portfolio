import { useEffect, useId, useRef, useState } from 'react';
import { finalOutline } from './finalOutline.js';
import './HeroArtwork.css';

// Geometry and animation timings come from Assets/clarifying-chaos-solid-colors.html.
const rings = ['#9cbabc', '#e5ef18', '#afddb1', '#5fd1d3'];
const labels = [
  { text: 'INSIGHTS', x: 95, width: 145, px: -50, py: -200, qx: 40, qy: -160, stack: 432.5 },
  { text: 'RESEARCH', x: 246, width: 145, px: 200, py: -350, qx: 150, qy: -300, stack: 281.5 },
  { text: 'INTERVIEWS', x: 397, width: 165, px: -260, py: -60, qx: -300, qy: -120, stack: 120.5 },
  { text: 'PROTOTYPING', x: 568, width: 185, px: 160, py: -120, qx: 100, qy: -80, stack: -60.5 },
  { text: 'TESTING', x: 759, width: 135, px: 70, py: -390, qx: 90, qy: -220, stack: -226.5 },
];
const threads = Array.from({ length: 25 }, (_, index) => ({
  rx: 180 + index * 7, ry: 74 + index * 3, angle: index * 23,
  endAngle: index * 23 + (index % 2 ? 100 : -100), duration: 12 + index % 5,
}));
const data = Array.from({ length: 32 }, (_, index) => {
  const angle = index * 2.39996;
  const radius = 220 + (index % 5) * 32;
  return { x: 600 + Math.cos(angle) * radius, y: 450 + Math.sin(angle) * radius, text: index % 3 ? '1' : '0' };
});

export default function HeroArtwork({ settings }) {
  const svgRef = useRef(null);
  const id = useId();
  const gradientId = `${id}-ocean`;
  const glowId = `${id}-glow`;
  const clipId = `${id}-canvas`;
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (reduceMotion) svg.pauseAnimations();
    else svg.unpauseAnimations();
  }, [reduceMotion]);

  const { viewBox, movement } = settings;
  const labelScale = movement.labelSpread / 100;

  return (
    <figure className={`hero-artwork${reduceMotion ? ' hero-artwork--reduced' : ''}`} style={{ maxWidth: `${settings.maxWidth}px`, '--hero-offset-x': `${movement.x}px`, '--hero-offset-y': `${movement.y}px` }}>
      <svg ref={svgRef} className="hero-artwork__svg" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Clarifying the chaos</title>
        <desc id={`${id}-desc`}>Blue-gray, yellow, mint and turquoise rings rotate amid a spirograph and research labels, then resolve into a single circle.</desc>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            {rings.map((color, index) => <stop key={color} offset={index / 3} stopColor={color} />)}
          </linearGradient>
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse"><rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} /></clipPath>
        </defs>
        <g className="hero-artwork__scene" clipPath={`url(#${clipId})`}>
        <g className="threads" fill="none" strokeWidth="1.1">
          {threads.map((thread, index) => (
            <ellipse key={index} cx="600" cy="450" rx={thread.rx} ry={thread.ry} stroke={`url(#${gradientId})`} opacity=".28" transform={`rotate(${thread.angle} 600 450)`}>
              <animateTransform attributeName="transform" type="rotate" values={`${thread.angle} 600 450;${thread.endAngle} 600 450`} dur={`${thread.duration}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
        </g>
        <g className="data" fill="#31869c" fontFamily="monospace" fontSize="15">
          {data.map((point, index) => <text key={index} x={point.x} y={point.y} opacity=".35">{point.text}</text>)}
        </g>
        <g className="orbit" fill="none" strokeWidth="58">
          {rings.map((color, index) => <circle key={color} className={`ring r${index + 1}`} cx="600" cy="450" r="105" stroke={color} />)}
        </g>
        <g className="end halo" fill="none" strokeWidth="10" filter={`url(#${glowId})`}>
          {finalOutline.map((arc, index) => <path key={index} d={arc.path} stroke={arc.color} />)}
        </g>
        <g className="end" fill="none" strokeWidth="3">
          {finalOutline.map((arc, index) => <path key={index} d={arc.path} stroke={arc.color} />)}
        </g>
        <g className="labels" textAnchor="middle" style={{ fontSize: '17px' }}>
          {labels.map(label => (
            <g className="pill" key={label.text} style={{ '--px': `${label.px * labelScale}px`, '--py': `${label.py * labelScale}px`, '--qx': `${label.qx * labelScale}px`, '--qy': `${label.qy * labelScale}px`, '--stack': `${label.stack}px` }}>
              <rect x={label.x} y="745" width={label.width} height="42" rx="21" fill="white" fillOpacity=".95" stroke="#b5c8cb" strokeWidth="1" />
              <text x={label.x + label.width / 2} y="772">{label.text}</text>
            </g>
          ))}
        </g>
        <text className="clarity" x="600" y="450" textAnchor="middle" dominantBaseline="middle">Clarity</text>
        </g>
      </svg>
    </figure>
  );
}
