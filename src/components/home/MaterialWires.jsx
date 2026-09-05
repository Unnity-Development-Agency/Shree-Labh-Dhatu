"use client";
import { useEffect, useRef } from "react";

export default function MaterialWires({ hostRef, color, paused }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, host = hostRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !host) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, visible = false, phase = 0;
    const target = { x: 0, y: 0 }, pointer = { x: 0, y: 0 };
    function draw() {
      frame = 0;
      const animated = !paused && !motion.matches;
      if (animated) {
        phase += 0.002;
        pointer.x += (target.x - pointer.x) * 0.045;
        pointer.y += (target.y - pointer.y) * 0.045;
      }
      ctx.clearRect(0, 0, width, height);
      // Parallel coil contours: a consistent industrial drawing, with restrained parallax.
      for (let wire = 0; wire < 7; wire++) {
        ctx.beginPath();
        const spacing = Math.min(width * 0.015, 18);
        ctx.ellipse(
          width * 0.8 + pointer.x * 12,
          height * 0.53 + pointer.y * 10 + Math.sin(phase) * 3,
          width * 0.35 + wire * spacing,
          height * 0.3 + wire * spacing,
          -0.28 + pointer.x * 0.012, 0, Math.PI * 2,
        );
        ctx.strokeStyle = wire % 3 === 0 ? "#7c886e" : color;
        ctx.globalAlpha = wire % 3 === 0 ? 0.22 : 0.28;
        ctx.lineWidth = wire % 3 === 0 ? 2 : 1.5;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
      if (animated && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function restart() {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) draw();
    }
    function resize() {
      width = host.clientWidth; height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      restart();
    }
    const move = event => {
      const bounds = host.getBoundingClientRect();
      target.x = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      target.y = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    };
    const reset = () => { target.x = 0; target.y = 0; };
    const sizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); });
    sizeObserver.observe(host); viewObserver.observe(host);
    host.addEventListener("pointermove", move); host.addEventListener("pointerleave", reset);
    motion.addEventListener("change", restart); document.addEventListener("visibilitychange", restart);
    resize();
    return () => {
      cancelAnimationFrame(frame); sizeObserver.disconnect(); viewObserver.disconnect();
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", restart); document.removeEventListener("visibilitychange", restart);
    };
  }, [hostRef, color, paused]);
  return <canvas ref={canvasRef} aria-hidden="true" />;
}
