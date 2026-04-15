"use client";

const MAGNIFIER_SIZE = 140;
const GRID_SIZE = 11;
const CELL_SIZE = MAGNIFIER_SIZE / GRID_SIZE;

interface MagnifierProps {
  cursorPos: { x: number; y: number };
  pixels: string[];
  hoveredColor: string | null;
}

export default function Magnifier({ cursorPos, pixels, hoveredColor }: MagnifierProps) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: cursorPos.x - MAGNIFIER_SIZE / 2,
        top: cursorPos.y - MAGNIFIER_SIZE / 2,
        width: MAGNIFIER_SIZE,
        height: MAGNIFIER_SIZE,
        zIndex: 50,
      }}
    >
      <svg
        width={MAGNIFIER_SIZE}
        height={MAGNIFIER_SIZE}
        viewBox={`0 0 ${MAGNIFIER_SIZE} ${MAGNIFIER_SIZE}`}
      >
        <defs>
          <clipPath id="magnifier-clip">
            <circle
              cx={MAGNIFIER_SIZE / 2}
              cy={MAGNIFIER_SIZE / 2}
              r={MAGNIFIER_SIZE / 2 - 2}
            />
          </clipPath>
        </defs>

        {/* Pixel grid inside circle */}
        <g clipPath="url(#magnifier-clip)">
          {pixels.map((color, i) => {
            const col = i % GRID_SIZE;
            const row = Math.floor(i / GRID_SIZE);
            return (
              <rect
                key={i}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE + 0.5}
                height={CELL_SIZE + 0.5}
                fill={color}
              />
            );
          })}
          {/* Grid lines */}
          {Array.from({ length: GRID_SIZE + 1 }, (_, i) => (
            <g key={`grid-${i}`}>
              <line
                x1={i * CELL_SIZE}
                y1={0}
                x2={i * CELL_SIZE}
                y2={MAGNIFIER_SIZE}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              />
              <line
                x1={0}
                y1={i * CELL_SIZE}
                x2={MAGNIFIER_SIZE}
                y2={i * CELL_SIZE}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              />
            </g>
          ))}
          {/* Center crosshair */}
          <rect
            x={5 * CELL_SIZE}
            y={5 * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
          />
        </g>

        {/* Outer ring */}
        <circle
          cx={MAGNIFIER_SIZE / 2}
          cy={MAGNIFIER_SIZE / 2}
          r={MAGNIFIER_SIZE / 2 - 2}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
      </svg>

      {/* Color label below magnifier */}
      {hoveredColor && (
        <div
          className="absolute backdrop-blur-md left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
          style={{
            top: MAGNIFIER_SIZE + 6,
            backgroundColor: "rgb(37 37 37)",
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/30"
            style={{ backgroundColor: hoveredColor }}
          />
          {hoveredColor}
        </div>
      )}
    </div>
  );
}
