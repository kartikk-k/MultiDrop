"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ColorPin } from "./types";
import ImageDropZone from "./ImageDropZone";
import Toolbar from "./Toolbar";
import ColorPinOverlay from "./ColorPinOverlay";
import Magnifier from "./Magnifier";
import { copyImageWithPins } from "./copyImageWithPins";

export default function ColorDropper() {
  const [image, setImage] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [pins, setPins] = useState<ColorPin[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [magnifierPixels, setMagnifierPixels] = useState<string[]>([]);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImage(src);
      setPins([]);

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      }
    };
    img.src = src;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          loadImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    },
    [loadImage]
  );

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      // Ignore when modifier keys are held (allow normal Cmd+V paste etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key.toLowerCase()) {
        case "p":
          if (image) setPicking((p) => !p);
          break;
        case "x":
          if (image) setPins([]);
          break;
        case "n":
          if (image) {
            setImage(null);
            setPins([]);
            setPicking(false);
          }
          break;
        case "c":
          if (image && containerRef.current && imgRef.current) {
            e.preventDefault();
            copyImageWithPins(containerRef.current, imgRef.current, pins).then(() => {
              setCopyFeedback(true);
              setTimeout(() => setCopyFeedback(false), 2000);
            });
          }
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [image, pins]);

  const getColorAtPosition = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !imgRef.current) return null;

      const imgEl = container.querySelector("img");
      if (!imgEl) return null;

      const imgRect = imgEl.getBoundingClientRect();
      const relX = clientX - imgRect.left;
      const relY = clientY - imgRect.top;

      if (relX < 0 || relY < 0 || relX > imgRect.width || relY > imgRect.height)
        return null;

      const scaleX = canvas.width / imgRect.width;
      const scaleY = canvas.height / imgRect.height;
      const pixelX = Math.floor(relX * scaleX);
      const pixelY = Math.floor(relY * scaleY);

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const pixel = ctx.getImageData(pixelX, pixelY, 1, 1).data;
      const hex =
        "#" +
        ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
          .toString(16)
          .slice(1)
          .toUpperCase();

      const pctX = (relX / imgRect.width) * 100;
      const pctY = (relY / imgRect.height) * 100;

      return { hex, pctX, pctY };
    },
    []
  );

  const getMagnifierPixels = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !imgRef.current) return [];

      const imgEl = container.querySelector("img");
      if (!imgEl) return [];

      const imgRect = imgEl.getBoundingClientRect();
      const relX = clientX - imgRect.left;
      const relY = clientY - imgRect.top;

      const scaleX = canvas.width / imgRect.width;
      const scaleY = canvas.height / imgRect.height;
      const centerX = Math.floor(relX * scaleX);
      const centerY = Math.floor(relY * scaleY);

      const ctx = canvas.getContext("2d");
      if (!ctx) return [];

      const gridSize = 11;
      const half = Math.floor(gridSize / 2);
      const pixels: string[] = [];

      for (let dy = -half; dy <= half; dy++) {
        for (let dx = -half; dx <= half; dx++) {
          const px = centerX + dx;
          const py = centerY + dy;
          if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
            const pixel = ctx.getImageData(px, py, 1, 1).data;
            pixels.push(`rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
          } else {
            pixels.push("rgb(0, 0, 0)");
          }
        }
      }
      return pixels;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!picking) return;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      const result = getColorAtPosition(e.clientX, e.clientY);
      if (result) {
        setHoveredColor(result.hex);
        setMagnifierPixels(getMagnifierPixels(e.clientX, e.clientY));
      }
    },
    [picking, getColorAtPosition, getMagnifierPixels]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!picking) return;
      const result = getColorAtPosition(e.clientX, e.clientY);
      if (result) {
        setPins((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            x: result.pctX,
            y: result.pctY,
            hex: result.hex,
          },
        ]);
      }
    },
    [picking, getColorAtPosition]
  );

  const handleMouseLeave = useCallback(() => {
    setCursorPos(null);
    setHoveredColor(null);
    setMagnifierPixels([]);
  }, []);

  const handleCopyImage = useCallback(async () => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    await copyImageWithPins(container, img, pins);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  }, [pins]);

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen bg-[#303030]">
      {/* Hidden canvas for pixel reading */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top bar — always visible */}
      <Toolbar
        picking={picking}
        hasPins={pins.length > 0}
        copyFeedback={copyFeedback}
        onTogglePicking={() => setPicking((p) => !p)}
        onCopyImage={handleCopyImage}
        onClearPins={() => setPins([])}
        onNewImage={() => {
          setImage(null);
          setPins([]);
          setPicking(false);
        }}
        disabled={!image}
      />

      {/* Canvas area — always visible */}
      <div className="flex flex-1 flex-col w-full px-4 pb-4 relative">
        <div className="relative flex-1 w-full flex flex-col rounded-2xl overflow-hidden p-4">
          <div className="w-full h-full flex items-center justify-center flex-1">

            <div
              className="w-full h-full absolute top-0 left-0"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backgroundImage:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.16) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            {!image ? (
              <ImageDropZone onFile={handleFile} />
            ) : (
              <div
                ref={containerRef}
                className="relative max-w-5xl w-full"
                style={{ cursor: picking ? "none" : "default" }}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onMouseLeave={handleMouseLeave}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-auto rounded-lg select-none"
                  draggable={false}
                />

                {/* Color pins */}
                {pins.map((pin) => (
                  <ColorPinOverlay
                    key={pin.id}
                    pin={pin}
                    onRemove={(id) => setPins((prev) => prev.filter((p) => p.id !== id))}
                  />
                ))}

                {/* Magnifier */}
                {picking && cursorPos && (
                  <Magnifier
                    cursorPos={cursorPos}
                    pixels={magnifierPixels}
                    hoveredColor={hoveredColor}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
