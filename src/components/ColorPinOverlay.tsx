"use client";

import type { ColorPin } from "./types";

interface ColorPinOverlayProps {
  pin: ColorPin;
  onRemove: (id: string) => void;
}

export default function ColorPinOverlay({ pin, onRemove }: ColorPinOverlayProps) {
  return (
    <div
      data-pin={pin.id}
      className="absolute group"
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      {/* Pin dot */}
      <div
        data-dot
        className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-lg"
        style={{ backgroundColor: pin.hex }}
      />

      {/* Tooltip */}
      <div
        data-tooltip
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-white whitespace-nowrap tracking-[0.04em] shadow-lg"
        style={{ backgroundColor: "#383838" }}
      >
        <span
          data-swatch
          className="w-3 h-3 rounded-full flex-shrink-0 border border-white/20"
          style={{ backgroundColor: pin.hex }}
        />
        <span data-tooltip-text>{pin.hex}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(pin.id);
          }}
          className="w-0 ml-0 overflow-hidden text-zinc-400 hover:text-white opacity-0 transition-[width,margin,opacity,color] duration-150 group-hover:w-3 group-hover:ml-1 group-hover:opacity-100"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {/* Arrow */}
        <div
          data-arrow
          className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
          style={{
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #383838",
          }}
        />
      </div>
    </div>
  );
}
