import React from "react";

export const LuxurisenIcon = ({ size = 26, color = "#C9A96E", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 250"
    width={size}
    height={size}
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Faceted Diamond */}
      <path
        d="M 125 15 L 215 80 L 235 170 L 125 240 L 15 170 L 35 80 Z"
        strokeWidth="5"
        strokeOpacity="0.4"
      />
      {/* Inner Concentric Frame */}
      <path
        d="M 125 32 L 200 87 L 218 162 L 125 222 L 32 162 L 50 87 Z"
        strokeWidth="3"
        strokeOpacity="0.75"
      />
      {/* Central Monogram 'L' */}
      <path
        d="M 100 75 L 100 175 L 160 175"
        strokeWidth="11"
        stroke={color}
      />
      {/* Serif accents */}
      <path d="M 88 75 L 114 75" strokeWidth="9" stroke={color} />
      <path d="M 160 163 L 160 187" strokeWidth="8" stroke={color} />
      {/* Diagonal Sartorial Facet */}
      <path d="M 148 85 L 108 165" strokeWidth="7" stroke={color} strokeOpacity="0.9" />
      {/* Top & Bottom Accents */}
      <polygon points="125,52 130,60 125,68 120,60" fill={color} stroke="none" />
      <polygon points="125,188 130,196 125,204 120,196" fill={color} stroke="none" />
    </g>
  </svg>
);

export const LuxurisenLogo = ({
  iconSize = 26,
  textSize = "1.2rem",
  color = "#C9A96E",
  textColor = "inherit",
  showIcon = true,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      onClick={onClick}
      style={{ color: textColor }}
    >
      {showIcon && (
        <div className="transition-transform duration-300 group-hover:scale-105">
          <LuxurisenIcon size={iconSize} color={color} />
        </div>
      )}
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          fontWeight: 600,
          fontSize: textSize,
          color: color,
        }}
      >
        Luxurisen
      </span>
    </div>
  );
};

export default LuxurisenLogo;
