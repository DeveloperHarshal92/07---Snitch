import React from "react";

export const LuxurisenIcon = ({ size = 28, color = "currentColor", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 250 200"
    width={size}
    height={(size * 200) / 250}
    className={className}
    style={{ display: "inline-block", verticalAlign: "middle" }}
  >
    <g
      fill="none"
      stroke={color}
      strokeWidth="13"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M 65 95 C 45 95 30 75 40 55 C 45 40 65 35 75 45 C 85 25 115 20 135 35 C 150 20 180 25 190 45 C 205 35 220 50 215 68 C 225 80 220 95 200 95"
        opacity="0.9"
      />
      <path d="M 15 35 C 10 75 40 115 95 125 C 120 128 135 110 135 90 C 135 75 115 65 90 75 C 60 85 35 65 30 45 Z" />
      <path d="M 25 35 C 40 70 80 95 125 95" />
      <path d="M 20 95 C 35 125 75 145 120 142" />

      <path d="M 225 35 C 230 75 200 115 145 125 C 120 128 105 110 105 90 C 105 75 125 65 150 75 C 180 85 205 65 210 45 Z" />
      <path d="M 215 35 C 200 70 160 95 115 95" />
      <path d="M 220 95 C 205 125 165 145 120 142" />
      <path d="M 85 160 C 95 185 115 185 120 168 C 125 185 145 185 155 160" />
    </g>
  </svg>
);

export const LuxurisenLogo = ({
  iconSize = 28,
  textSize = "1.2rem",
  color = "#C9A96E",
  textColor = "inherit",
  showIcon = true,
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}
      onClick={onClick}
      style={{ color: textColor }}
    >
      {showIcon && <LuxurisenIcon size={iconSize} color={color} />}
      <span
        style={{
          fontFamily: "'Cormorant Garamond', 'Inter', serif",
          letterSpacing: "0.22em",
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
