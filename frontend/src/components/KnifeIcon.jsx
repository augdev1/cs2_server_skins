import React from 'react';

export default function KnifeIcon({ size = 18, className = '', color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Tactical CS2 Blade */}
      <path d="M19.5 3.5l1 1c1.5 1.5 1 4.5-1 6.5l-7 7-3-3 7-7c2-2 5-2.5 6.5-1l-1.5-1.5z" />
      <path d="M10.5 15.5L6 20l-2.5-1L4 16.5l4.5-4.5" />
      <path d="M14 8l2 2" />
      <circle cx="5" cy="19" r="1" fill={color} />
    </svg>
  );
}
