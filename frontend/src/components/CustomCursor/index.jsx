"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const trailRefs = useRef([]);
  const rippleRef = useRef(null);

  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [cursorType, setCursorType] = useState("default"); // default | link | input

  useEffect(() => {
    document.body.style.cursor = "none";

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const el = e.target;
      if (el.closest("a")) setCursorType("link");
      else if (el.closest("button")) setCursorType("link");
      else if (el.closest("input,textarea,select")) setCursorType("input");
      else setCursorType("default");

      setHovered(!!el.closest("a,button,input,textarea,select,[data-hover]"));
    };

    const onDown = (e) => {
      setClicked(true);
      // ripple
      if (rippleRef.current) {
        rippleRef.current.style.left = e.clientX - 20 + "px";
        rippleRef.current.style.top = e.clientY - 20 + "px";
        rippleRef.current.style.opacity = "1";
        rippleRef.current.style.transform = "scale(0)";
        rippleRef.current.style.transition = "none";
        requestAnimationFrame(() => {
          if (rippleRef.current) {
            rippleRef.current.style.transition = "transform 0.5s ease, opacity 0.5s ease";
            rippleRef.current.style.transform = "scale(4)";
            rippleRef.current.style.opacity = "0";
          }
        });
      }
    };
    const onUp = () => setClicked(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Trail positions history
    const history = Array.from({ length: 12 }, () => ({ x: -200, y: -200 }));

    let raf;
    const animate = () => {
      // Smooth ring follow
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;

      // Shift history
      history.unshift({ x: mouse.current.x, y: mouse.current.y });
      history.pop();

      if (ringRef.current) {
        const size = hovered ? 60 : 40;
        ringRef.current.style.left = ring.current.x - size / 2 + "px";
        ringRef.current.style.top = ring.current.y - size / 2 + "px";
      }

      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x - 5 + "px";
        dotRef.current.style.top = mouse.current.y - 5 + "px";
      }

      trailRefs.current.forEach((el, i) => {
        if (!el || !history[i + 1]) return;
        const p = history[i + 1];
        const size = Math.max(2, 10 - i * 0.7);
        el.style.left = p.x - size / 2 + "px";
        el.style.top = p.y - size / 2 + "px";
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.opacity = (1 - i / 12) * 0.55 + "";
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const ringSize = hovered ? 60 : 40;

  const ringColor = {
    link: "#f43f5e",
    input: "#22c55e",
    default: "#6366f1",
  }[cursorType];

  const ringGlow = {
    link: "0 0 16px rgba(244,63,94,0.7), 0 0 40px rgba(244,63,94,0.25), inset 0 0 12px rgba(244,63,94,0.1)",
    input: "0 0 16px rgba(34,197,94,0.7), 0 0 40px rgba(34,197,94,0.25), inset 0 0 12px rgba(34,197,94,0.1)",
    default: "0 0 16px rgba(99,102,241,0.7), 0 0 40px rgba(99,102,241,0.25), inset 0 0 12px rgba(99,102,241,0.1)",
  }[cursorType];

  const dotGradient = {
    link: "radial-gradient(circle,#fff 30%,#f43f5e 100%)",
    input: "radial-gradient(circle,#fff 30%,#22c55e 100%)",
    default: "radial-gradient(circle,#fff 30%,#6366f1 100%)",
  }[cursorType];

  const trailColor = {
    link: "244,63,94",
    input: "34,197,94",
    default: "99,102,241",
  }[cursorType];

  return (
    <>
      {/* Outer magnetic ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: ringSize,
          height: ringSize,
          borderRadius: "50%",
          border: `1.5px solid ${ringColor}`,
          background: `rgba(${trailColor},0.04)`,
          boxShadow: ringGlow,
          pointerEvents: "none",
          zIndex: 999997,
          transition: "width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.2s",
          transform: clicked ? "scale(0.8)" : "scale(1)",
          mixBlendMode: "normal",
        }}
      >
        {/* Inner spinning dashes */}
        <div
          style={{
            position: "absolute",
            inset: 3,
            borderRadius: "50%",
            border: `1px dashed rgba(${trailColor},0.4)`,
            animation: "spin-slow 4s linear infinite",
          }}
        />
        {/* Center crosshair dot (only on hover) */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: ringColor,
              boxShadow: `0 0 8px ${ringColor}`,
            }}
          />
        )}
      </div>

      {/* Sharp center dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: clicked ? 14 : 10,
          height: clicked ? 14 : 10,
          borderRadius: "50%",
          background: dotGradient,
          boxShadow: `0 0 12px rgba(${trailColor},1), 0 0 24px rgba(${trailColor},0.5)`,
          pointerEvents: "none",
          zIndex: 999999,
          transition: "width 0.1s, height 0.1s, background 0.2s, box-shadow 0.2s",
          transform: "translate(0,0)",
        }}
      />

      {/* Comet trail */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          style={{
            position: "fixed",
            borderRadius: "50%",
            background: `rgba(${trailColor},${0.6 - i * 0.05})`,
            boxShadow: `0 0 ${6 - i * 0.4}px rgba(${trailColor},0.6)`,
            pointerEvents: "none",
            zIndex: 999996,
            transition: "background 0.2s",
          }}
        />
      ))}

      {/* Click ripple */}
      <div
        ref={rippleRef}
        style={{
          position: "fixed",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2px solid rgba(${trailColor},0.6)`,
          pointerEvents: "none",
          zIndex: 999995,
          opacity: 0,
        }}
      />
    </>
  );
}
