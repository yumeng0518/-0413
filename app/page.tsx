"use client";
import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

const MAX_PUPIL_OFFSET = 42;

function getPupilOffset(mouse: Point, eye: Point): Point {
  const dx = mouse.x - eye.x;
  const dy = mouse.y - eye.y;
  const distance = Math.hypot(dx, dy) || 1;
  const clamped = Math.min(MAX_PUPIL_OFFSET, distance);

  return {
    x: (dx / distance) * clamped,
    y: (dy / distance) * clamped,
  };
}

export default function Home() {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [leftPupil, setLeftPupil] = useState<Point>({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const leftRect = leftEyeRef.current?.getBoundingClientRect();
      const rightRect = rightEyeRef.current?.getBoundingClientRect();
      if (!leftRect || !rightRect) return;

      const mouse = { x: event.clientX, y: event.clientY };
      const leftEye = {
        x: leftRect.left + leftRect.width / 2,
        y: leftRect.top + leftRect.height / 2,
      };
      const rightEye = {
        x: rightRect.left + rightRect.width / 2,
        y: rightRect.top + rightRect.height / 2,
      };

      setLeftPupil(getPupilOffset(mouse, leftEye));
      setRightPupil(getPupilOffset(mouse, rightEye));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = () => {
    window.alert("clicked");
  };

  return (
    <main className="cosmos-page">
      <div className="eyes-background" aria-hidden="true">
        <div className="giant-eye" ref={leftEyeRef}>
          <div
            className="pupil"
            style={{
              transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
            }}
          />
        </div>
        <div className="giant-eye" ref={rightEyeRef}>
          <div
            className="pupil"
            style={{
              transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
            }}
          />
        </div>
      </div>
      <h1 className="liquid-title">你好</h1>
      <button className="tech-button" type="button" onClick={handleClick}>
        点击我
      </button>
    </main>
  );
}
