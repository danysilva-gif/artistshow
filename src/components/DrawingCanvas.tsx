import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, Undo2, Paintbrush, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = [
  "hsl(0,0%,10%)", "hsl(0,84%,60%)", "hsl(25,95%,53%)", "hsl(45,90%,55%)",
  "hsl(152,60%,32%)", "hsl(200,80%,50%)", "hsl(260,60%,55%)", "hsl(330,70%,50%)",
  "hsl(0,0%,100%)",
];

const SIZES = [2, 4, 8, 14];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const historyRef = useRef<ImageData[]>([]);

  const getCtx = useCallback(() => canvasRef.current?.getContext("2d"), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveHistory();
  }, []);

  const saveHistory = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    if (historyRef.current.length > 30) historyRef.current.shift();
  };

  const undo = () => {
    const ctx = getCtx();
    if (!ctx || historyRef.current.length < 2) return;
    historyRef.current.pop();
    ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    setIsDrawing(true);
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = tool === "eraser" ? "#fff" : color;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveHistory();
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "meu-desenho.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setTool("brush"); }}
            className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool === "brush" ? "border-foreground scale-110" : "border-border"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="mx-1 h-6 w-px bg-border" />
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${size === s ? "border-foreground bg-muted" : "border-border"}`}
          >
            <div className="rounded-full bg-foreground" style={{ width: s + 2, height: s + 2 }} />
          </button>
        ))}
        <div className="mx-1 h-6 w-px bg-border" />
        <Button variant={tool === "eraser" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setTool(tool === "eraser" ? "brush" : "eraser")}>
          {tool === "eraser" ? <Paintbrush className="h-4 w-4" /> : <Eraser className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={undo}><Undo2 className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={download}><Download className="h-4 w-4" /></Button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full aspect-[4/3] rounded-xl border-2 border-border bg-background cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  );
}
