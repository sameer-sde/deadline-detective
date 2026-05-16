import { useEffect, useRef } from "react";

export function Atmosphere() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 8 + Math.random() * 6,
      length: 15 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.2,
    }));

    let frame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(180,200,255,0.15)";
      ctx.lineWidth = 0.5;
      drops.forEach((d) => {
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {/* Rain canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.8 }}
      />
      {/* Lightning flash */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "rgba(200,220,255,0.06)",
        animation: "lightning 8s infinite",
      }} />
      {/* Fog */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, width: "200%", height: 120,
        background: "linear-gradient(to top, rgba(20,15,8,0.8), transparent)",
        pointerEvents: "none", zIndex: 1,
        animation: "fogMove 25s linear infinite",
        opacity: 0.6,
      }} />
      {/* Vignette */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
      }} />
      {/* Amber glow top */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "50%", height: "35%",
        background: "radial-gradient(ellipse, rgba(180,120,40,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 1,
      }} />
    </>
  );
}

export function CandleFlame({ size = 24 }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: size,
      filter: "drop-shadow(0 0 8px rgba(255,160,40,0.8))",
      animation: "flicker 4s ease-in-out infinite",
    }}>🕯️</span>
  );
}
