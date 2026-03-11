import { useRef, useEffect, useState, useCallback } from "react";

interface ColorWheelProps {
  size?: number;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorWheel({ size = 160, value, onChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const radius = size / 2;
  const innerRadius = radius * 0.25;

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = radius;
    const cy = radius;

    // Draw color wheel with saturation rings
    for (let r = radius; r >= innerRadius; r -= 0.5) {
      const saturation = 30 + ((r - innerRadius) / (radius - innerRadius)) * 70;
      for (let angle = 0; angle < 360; angle += 1) {
        const startAngle = (angle - 1) * (Math.PI / 180);
        const endAngle = (angle + 1) * (Math.PI / 180);
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.arc(cx, cy, Math.max(r - 1, innerRadius), endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = `hsl(${angle}, ${saturation}%, 50%)`;
        ctx.fill();
      }
    }

    // White center
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "hsl(0,0%,85%)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [size, radius, innerRadius]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const pickColorAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const cx = radius;
    const cy = radius;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > radius || dist < innerRadius) return;

    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d")!;
    const pixel = ctx.getImageData(Math.floor(x * dpr), Math.floor(y * dpr), 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1].toString(16).padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
    onChange(hex);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pickColorAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    pickColorAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, cursor: "crosshair", borderRadius: "50%" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="touch-none"
      />
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-6 rounded-full border-2 border-border shadow-sm"
          style={{ backgroundColor: value }}
        />
        <span className="text-xs font-mono text-muted-foreground">{value.toUpperCase()}</span>
      </div>
    </div>
  );
}
