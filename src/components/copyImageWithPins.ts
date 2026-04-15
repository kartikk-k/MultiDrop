import type { ColorPin } from "./types";

export async function copyImageWithPins(
  container: HTMLDivElement,
  img: HTMLImageElement,
  pins: ColorPin[]
): Promise<"copied" | "downloaded"> {
  const imgEl = container.querySelector("img");
  if (!imgEl) throw new Error("No image element found");

  const imgRect = imgEl.getBoundingClientRect();

  // Measure actual tooltip elements from the DOM for pixel-perfect export
  const pinEls = container.querySelectorAll("[data-pin]");
  const pinMeasurements: Array<{
    id: string;
    dotRect: DOMRect;
    tooltipRect: DOMRect;
    arrowRect: DOMRect;
    swatchRect: DOMRect;
    textRect: DOMRect;
    text: string;
    tooltipBg: string;
    textColor: string;
    textFont: string;
    textLetterSpacing: number;
    tooltipRadius: number;
  }> = [];

  pinEls.forEach((el) => {
    const id = el.getAttribute("data-pin")!;
    const dot = el.querySelector("[data-dot]");
    const tooltip = el.querySelector("[data-tooltip]");
    const arrow = el.querySelector("[data-arrow]");
    const swatch = el.querySelector("[data-swatch]");
    const textEl = el.querySelector("[data-tooltip-text]");
    if (dot && tooltip && arrow && swatch && textEl) {
      const tooltipStyle = window.getComputedStyle(tooltip as Element);
      const textStyle = window.getComputedStyle(textEl as Element);
      const parsedLetterSpacing = Number.parseFloat(textStyle.letterSpacing);
      const textLetterSpacing =
        textStyle.letterSpacing === "normal" || Number.isNaN(parsedLetterSpacing)
          ? 0
          : parsedLetterSpacing;
      const parsedRadius = Number.parseFloat(tooltipStyle.borderTopLeftRadius);
      const tooltipRadius = Number.isNaN(parsedRadius) ? 6 : parsedRadius;

      pinMeasurements.push({
        id,
        dotRect: dot.getBoundingClientRect(),
        tooltipRect: tooltip.getBoundingClientRect(),
        arrowRect: arrow.getBoundingClientRect(),
        swatchRect: swatch.getBoundingClientRect(),
        textRect: textEl.getBoundingClientRect(),
        text: textEl.textContent ?? "",
        tooltipBg: tooltipStyle.backgroundColor || "#383838",
        textColor: textStyle.color || "#ffffff",
        textFont: textStyle.font || "400 12px system-ui, -apple-system, sans-serif",
        textLetterSpacing,
        tooltipRadius,
      });
    }
  });

  // Canvas at displayed size — what you see is what you get
  const w = imgRect.width;
  const h = imgRect.height;
  const dpr = window.devicePixelRatio || 1;

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = w * dpr;
  exportCanvas.height = h * dpr;
  exportCanvas.style.width = w + "px";
  exportCanvas.style.height = h + "px";
  const ctx = exportCanvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  // Draw the original image
  ctx.drawImage(img, 0, 0, w, h);

  const drawTextWithLetterSpacing = (
    text: string,
    startX: number,
    y: number,
    letterSpacing: number
  ) => {
    if (!text) return;
    if (letterSpacing <= 0) {
      ctx.fillText(text, startX, y);
      return;
    }
    let x = startX;
    for (const char of text) {
      ctx.fillText(char, x, y);
      x += ctx.measureText(char).width + letterSpacing;
    }
  };

  // Draw each pin using measured DOM positions
  const offsetX = imgRect.left;
  const offsetY = imgRect.top;

  for (const pin of pins) {
    const m = pinMeasurements.find((p) => p.id === pin.id);
    if (!m) continue;

    // Draw tooltip background
    const tx = m.tooltipRect.left - offsetX;
    const ty = m.tooltipRect.top - offsetY;
    const tw = m.tooltipRect.width;
    const th = m.tooltipRect.height;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 9999);
    ctx.fillStyle = m.tooltipBg;
    ctx.fill();

    // Draw arrow
    const ax = m.arrowRect.left - offsetX;
    const ay = m.arrowRect.top - offsetY;
    const aw = m.arrowRect.width;
    const ah = m.arrowRect.height;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + aw / 2, ay + ah);
    ctx.lineTo(ax + aw, ay);
    ctx.closePath();
    ctx.fillStyle = m.tooltipBg;
    ctx.fill();

    // Draw color swatch
    const sx = m.swatchRect.left - offsetX + m.swatchRect.width / 2;
    const sy = m.swatchRect.top - offsetY + m.swatchRect.height / 2;
    const sr = m.swatchRect.width / 2;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = pin.hex;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw text
    const textX = m.textRect.left - offsetX;
    const textY = m.textRect.top - offsetY + m.textRect.height / 2;
    ctx.font = m.textFont;
    ctx.fillStyle = m.textColor;
    ctx.textBaseline = "middle";
    drawTextWithLetterSpacing(m.text, textX, textY, m.textLetterSpacing);

    // Draw pin dot
    const dx = m.dotRect.left - offsetX + m.dotRect.width / 2;
    const dy = m.dotRect.top - offsetY + m.dotRect.height / 2;
    const dr = m.dotRect.width / 2;
    ctx.beginPath();
    ctx.arc(dx, dy, dr, 0, Math.PI * 2);
    ctx.fillStyle = pin.hex;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  return new Promise((resolve) => {
    exportCanvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        resolve("copied");
      } catch {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "color-dropper.png";
        a.click();
        URL.revokeObjectURL(url);
        resolve("downloaded");
      }
    }, "image/png");
  });
}
