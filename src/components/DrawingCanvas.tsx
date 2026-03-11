import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, Undo2, Paintbrush, Download, PaintBucket, Circle, Square, Minus, Pipette, RotateCcw, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ColorWheel from "@/components/ColorWheel";

const PALETTE_COLORS = [
  // Row 1 - basics
  "hsl(0,0%,0%)", "hsl(0,0%,30%)", "hsl(0,0%,50%)", "hsl(0,0%,70%)", "hsl(0,0%,90%)", "hsl(0,0%,100%)",
  // Row 2 - warm
  "hsl(0,84%,60%)", "hsl(0,84%,40%)", "hsl(15,90%,55%)", "hsl(25,95%,53%)", "hsl(35,92%,50%)", "hsl(45,90%,55%)",
  // Row 3 - green/teal
  "hsl(80,60%,45%)", "hsl(120,50%,40%)", "hsl(152,60%,32%)", "hsl(170,60%,40%)", "hsl(185,70%,45%)", "hsl(200,80%,50%)",
  // Row 4 - blue/purple/pink
  "hsl(220,70%,55%)", "hsl(240,55%,50%)", "hsl(260,60%,55%)", "hsl(280,55%,50%)", "hsl(310,60%,50%)", "hsl(330,70%,50%)",
];

const SIZES = [1, 2, 4, 8, 14, 24];

type Tool = "brush" | "eraser" | "fill" | "line" | "rect" | "circle" | "eyedropper";

const TOOL_CONFIG: { tool: Tool; icon: typeof Paintbrush; label: string }[] = [
  { tool: "brush", icon: Paintbrush, label: "Pincel" },
  { tool: "eraser", icon: Eraser, label: "Borracha" },
  { tool: "fill", icon: PaintBucket, label: "Balde de tinta" },
  { tool: "line", icon: Minus, label: "Linha" },
  { tool: "rect", icon: Square, label: "Retângulo" },
  { tool: "circle", icon: Circle, label: "Círculo" },
  { tool: "eyedropper", icon: Pipette, label: "Conta-gotas" },
];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(PALETTE_COLORS[0]);
  const [customColor, setCustomColor] = useState("#000000");
  const [size, setSize] = useState(4);
  const [opacity, setOpacity] = useState(100);
  const [tool, setTool] = useState<Tool>("brush");
  const historyRef = useRef<ImageData[]>([]);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  const getCtx = useCallback(() => canvasRef.current?.getContext("2d", { willReadFrequently: true }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveHistory();
  }, []);

  const saveHistory = () => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    if (historyRef.current.length > 50) historyRef.current.shift();
  };

  const undo = () => {
    const ctx = getCtx();
    if (!ctx || historyRef.current.length < 2) return;
    historyRef.current.pop();
    ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
  };

  const clearCanvas = () => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    saveHistory();
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Flood fill algorithm
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const px = Math.floor(startX * dpr);
    const py = Math.floor(startY * dpr);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Parse fill color
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.fillStyle = fillColor;
    tempCtx.globalAlpha = opacity / 100;
    tempCtx.fillRect(0, 0, 1, 1);
    const fillRgba = tempCtx.getImageData(0, 0, 1, 1).data;

    const targetIdx = (py * width + px) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];
    const targetA = data[targetIdx + 3];

    if (targetR === fillRgba[0] && targetG === fillRgba[1] && targetB === fillRgba[2] && targetA === fillRgba[3]) return;

    const tolerance = 30;
    const matchesTarget = (idx: number) => {
      return Math.abs(data[idx] - targetR) <= tolerance &&
        Math.abs(data[idx + 1] - targetG) <= tolerance &&
        Math.abs(data[idx + 2] - targetB) <= tolerance &&
        Math.abs(data[idx + 3] - targetA) <= tolerance;
    };

    const stack: [number, number][] = [[px, py]];
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const idx = (cy * width + cx) * 4;
      const vIdx = cy * width + cx;

      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
      if (visited[vIdx]) continue;
      if (!matchesTarget(idx)) continue;

      visited[vIdx] = 1;
      data[idx] = fillRgba[0];
      data[idx + 1] = fillRgba[1];
      data[idx + 2] = fillRgba[2];
      data[idx + 3] = fillRgba[3];

      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
    saveHistory();
  };

  // Eyedropper
  const pickColor = (x: number, y: number) => {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const px = Math.floor(x * dpr);
    const py = Math.floor(y * dpr);
    const pixel = ctx.getImageData(px, py, 1, 1).data;
    const picked = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    setColor(picked);
    setTool("brush");
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);

    if (tool === "fill") {
      floodFill(pos.x, pos.y, color);
      return;
    }

    if (tool === "eyedropper") {
      pickColor(pos.x, pos.y);
      return;
    }

    setIsDrawing(true);

    if (tool === "line" || tool === "rect" || tool === "circle") {
      shapeStartRef.current = pos;
      snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = size;
    ctx.globalAlpha = tool === "eraser" ? 1 : opacity / 100;
    ctx.strokeStyle = tool === "eraser" ? "#fff" : color;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const pos = getPos(e);

    if ((tool === "line" || tool === "rect" || tool === "circle") && shapeStartRef.current && snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      const start = shapeStartRef.current;
      ctx.beginPath();
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity / 100;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (tool === "line") {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(start.x, start.y, pos.x - start.x, pos.y - start.y);
      } else if (tool === "circle") {
        const rx = Math.abs(pos.x - start.x) / 2;
        const ry = Math.abs(pos.y - start.y) / 2;
        const cx = start.x + (pos.x - start.x) / 2;
        const cy = start.y + (pos.y - start.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      return;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    shapeStartRef.current = null;
    snapshotRef.current = null;
    const ctx = getCtx();
    if (ctx) ctx.globalAlpha = 1;
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

  const handleCustomColor = (hex: string) => {
    setCustomColor(hex);
    setColor(hex);
    setTool("brush");
  };

  const getCursor = () => {
    if (tool === "eyedropper") return "crosshair";
    if (tool === "fill") return "cell";
    return "crosshair";
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-card p-2 shadow-sm">
          {/* Tools */}
          {TOOL_CONFIG.map(({ tool: t, icon: Icon, label }) => (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <Button
                  variant={tool === t ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTool(t)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>{label}</p></TooltipContent>
            </Tooltip>
          ))}

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Size slider */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <div className="rounded-full bg-foreground" style={{ width: Math.min(size + 2, 18), height: Math.min(size + 2, 18) }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" side="bottom">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Tamanho: {size}px</p>
              <Slider
                value={[size]}
                onValueChange={([v]) => setSize(v)}
                min={1}
                max={40}
                step={1}
              />
            </PopoverContent>
          </Popover>

          {/* Opacity slider */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-mono">
                {opacity}%
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" side="bottom">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Opacidade: {opacity}%</p>
              <Slider
                value={[opacity]}
                onValueChange={([v]) => setOpacity(v)}
                min={5}
                max={100}
                step={5}
              />
            </PopoverContent>
          </Popover>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Color palette popover */}
          {/* Color wheel + palette */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <div className="h-6 w-6 rounded-full border-2 border-border shadow-sm" style={{ backgroundColor: color }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" side="bottom">
              <div className="mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Paleta de Cores</span>
              </div>

              {/* Color wheel */}
              <div className="mb-3">
                <ColorWheel
                  size={160}
                  value={color}
                  onChange={(c) => {
                    setColor(c);
                    setCustomColor(c);
                    if (tool === "eraser" || tool === "eyedropper") setTool("brush");
                  }}
                />
              </div>

              {/* Preset grid */}
              <div className="grid grid-cols-6 gap-1.5">
                {PALETTE_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setColor(c); setTool(tool === "eraser" || tool === "eyedropper" ? "brush" : tool); }}
                    className={`h-7 w-7 rounded-full border-2 transition-all hover:scale-110 ${color === c ? "border-foreground ring-1 ring-foreground/30 scale-110" : "border-border/50"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Quick colors */}
          <div className="flex gap-1">
            {PALETTE_COLORS.slice(0, 8).map((c) => (
              <button
                key={`q-${c}`}
                onClick={() => { setColor(c); if (tool === "eraser" || tool === "eyedropper") setTool("brush"); }}
                className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Undo, Clear, Download */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Desfazer</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearCanvas}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Limpar tudo</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={download}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Baixar</p></TooltipContent>
          </Tooltip>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full aspect-[4/3] rounded-xl border-2 border-border bg-background touch-none"
          style={{ cursor: getCursor() }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </TooltipProvider>
  );
}
