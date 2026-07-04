import { useEffect, useRef, useState } from 'react';
import styles from './Solutions.module.css';
import type { SolutionsStrings } from './types';

type Point = { x: number; y: number };

export type Shape =
  | { type: 'pen'; points: Point[]; color: string }
  | { type: 'box'; x1: number; y1: number; x2: number; y2: number; color: string }
  | { type: 'arrow'; x1: number; y1: number; x2: number; y2: number; color: string }
  | { type: 'text'; x: number; y: number; text: string; color: string };

// Owned by the form so sketches survive toggling the board panel off/on
export type BoardState = { shapes: Shape[]; w: number; h: number };

export function emptyBoardState(): BoardState {
  return { shapes: [], w: 0, h: 0 };
}

// Fixed light-paper colors: the board keeps a light background in dark mode
const INK = '#2c2822';
const PAPER = '#fbf8f1';
const BOARD_H = 320;

function drawShape(ctx: CanvasRenderingContext2D, s: Shape) {
  ctx.save();
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (s.type === 'pen') {
    ctx.beginPath();
    s.points.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
    if (s.points.length === 1) {
      ctx.arc(s.points[0].x, s.points[0].y, 1.1, 0, 7);
      ctx.fill();
    }
    ctx.stroke();
  } else if (s.type === 'box') {
    const x = Math.min(s.x1, s.x2);
    const y = Math.min(s.y1, s.y2);
    const w = Math.abs(s.x2 - s.x1);
    const h = Math.abs(s.y2 - s.y1);
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6);
    else ctx.rect(x, y, w, h);
    ctx.stroke();
  } else if (s.type === 'arrow') {
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(s.x2, s.y2);
    ctx.stroke();
    const ang = Math.atan2(s.y2 - s.y1, s.x2 - s.x1);
    const L = 11;
    ctx.beginPath();
    ctx.moveTo(s.x2, s.y2);
    ctx.lineTo(s.x2 - L * Math.cos(ang - 0.42), s.y2 - L * Math.sin(ang - 0.42));
    ctx.moveTo(s.x2, s.y2);
    ctx.lineTo(s.x2 - L * Math.cos(ang + 0.42), s.y2 - L * Math.sin(ang + 0.42));
    ctx.stroke();
  } else {
    ctx.font = "15px 'IBM Plex Sans', sans-serif";
    ctx.textBaseline = 'middle';
    ctx.fillText(s.text, s.x, s.y);
  }
  ctx.restore();
}

// Renders the sketch onto an offscreen canvas (paper background so the PNG
// isn't transparent). Works even when the board panel is unmounted.
export async function boardToBlob(state: BoardState): Promise<Blob | null> {
  if (!state.shapes.length || !state.w) return null;
  const scale = 2;
  const cv = document.createElement('canvas');
  cv.width = state.w * scale;
  cv.height = state.h * scale;
  const ctx = cv.getContext('2d');
  if (!ctx) return null;
  ctx.scale(scale, scale);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, state.w, state.h);
  for (const s of state.shapes) drawShape(ctx, s);
  return new Promise((resolve) => cv.toBlob((b) => resolve(b), 'image/png'));
}

interface Props {
  board: BoardState;
  accent: string;
  s: SolutionsStrings['sandbox'];
}

export function SketchBoard({ board, accent, s }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const curRef = useRef<Shape | null>(null);
  const drawingRef = useRef(false);
  const [tool, setTool] = useState<'pen' | 'box' | 'arrow' | 'text'>('pen');
  const [color, setColor] = useState(INK);
  const [textEntry, setTextEntry] = useState<Point | null>(null);
  const textValueRef = useRef('');
  const textOpenRef = useRef(false);

  const redraw = () => {
    const ctx = ctxRef.current;
    if (!ctx || !board.w) return;
    ctx.clearRect(0, 0, board.w, board.h);
    const all = curRef.current ? [...board.shapes, curRef.current] : board.shapes;
    for (const sh of all) drawShape(ctx, sh);
  };

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const w = Math.max(50, el.clientWidth || 600);
    const dpr = window.devicePixelRatio || 1;
    el.width = w * dpr;
    el.height = BOARD_H * dpr;
    board.w = w;
    board.h = BOARD_H;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent): Point => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const commitText = (p: Point) => {
    if (!textOpenRef.current) return;
    textOpenRef.current = false;
    const txt = textValueRef.current.trim();
    if (txt) board.shapes.push({ type: 'text', x: p.x, y: p.y, text: txt, color });
    textValueRef.current = '';
    setTextEntry(null);
    redraw();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const p = pos(e);
    if (tool === 'text') {
      // Prevent the pointerdown's default focus handling: without this the
      // browser moves focus to <body> right after React mounts+autofocuses the
      // inline input, blurring it in the same frame so it vanishes instantly.
      // (This also stops the compat mousedown, so a tap no longer blurs an open
      // entry — hence we commit the previous one here instead.)
      e.preventDefault();
      // inline input instead of window.prompt — a blocking dialog inside
      // pointerdown eats every following tap on mobile.
      if (textOpenRef.current && textEntry) commitText(textEntry); // finalize the open entry
      textValueRef.current = '';
      textOpenRef.current = true;
      setTextEntry(p);
      return;
    }
    try {
      canvasRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    drawingRef.current = true;
    curRef.current =
      tool === 'pen'
        ? { type: 'pen', points: [p], color }
        : { type: tool, x1: p.x, y1: p.y, x2: p.x, y2: p.y, color };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current || !curRef.current) return;
    const p = pos(e);
    const cur = curRef.current;
    if (cur.type === 'pen') cur.points.push(p);
    else if (cur.type !== 'text') {
      cur.x2 = p.x;
      cur.y2 = p.y;
    }
    redraw();
  };

  const onPointerUp = () => {
    if (!drawingRef.current) return;
    if (curRef.current) board.shapes.push(curRef.current);
    curRef.current = null;
    drawingRef.current = false;
    redraw();
  };

  const undo = () => {
    board.shapes.pop();
    redraw();
  };
  const clear = () => {
    board.shapes.length = 0;
    curRef.current = null;
    redraw();
  };

  const toolBtn = (t: typeof tool, label: string) => (
    <button
      type="button"
      className={`${styles.toolBtn} ${tool === t ? styles.toolBtnActive : ''}`}
      onClick={() => setTool(t)}
    >
      {label}
    </button>
  );

  return (
    <div className={`${styles.boardPanel} ${styles.panelIn}`}>
      <div className={styles.boardToolbar}>
        {toolBtn('pen', s.bPen)}
        {toolBtn('box', s.bBox)}
        {toolBtn('arrow', s.bArrow)}
        {toolBtn('text', s.bText)}
        <span className={styles.toolbarSep} />
        <button
          type="button"
          title="ink"
          className={`${styles.swatch} ${color === INK ? styles.swatchActive : ''}`}
          style={{ background: INK }}
          onClick={() => setColor(INK)}
        />
        <button
          type="button"
          title="accent"
          className={`${styles.swatch} ${color === accent ? styles.swatchActive : ''}`}
          style={{ background: accent }}
          onClick={() => setColor(accent)}
        />
        <span className={styles.toolbarSep} />
        <button type="button" className={styles.toolBtn} onClick={undo}>
          {s.bUndo}
        </button>
        <button type="button" className={styles.toolBtn} onClick={clear}>
          {s.bClear}
        </button>
      </div>
      <div className={styles.boardWrap}>
        <canvas
          ref={canvasRef}
          className={styles.boardCanvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {textEntry && (
          <input
            autoFocus
            type="text"
            className={styles.boardTextInput}
            style={{
              left: textEntry.x,
              top: textEntry.y,
              color,
              maxWidth: `calc(100% - ${Math.round(textEntry.x)}px - 8px)`,
            }}
            placeholder={s.bText}
            onChange={(e) => {
              textValueRef.current = e.target.value;
            }}
            onBlur={() => commitText(textEntry)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitText(textEntry);
              if (e.key === 'Escape') {
                textOpenRef.current = false;
                textValueRef.current = '';
                setTextEntry(null);
              }
            }}
          />
        )}
      </div>
      <span className={styles.hintText}>{s.boardHint}</span>
    </div>
  );
}
