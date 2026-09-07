"use client";

import React, { useEffect, useState } from "react";

interface AnalogClockProps {
  size?: number;
  className?: string;
}

const ROMAN_NUMERALS = [
  { label: "XII", hour: 12 },
  { label: "I", hour: 1 },
  { label: "II", hour: 2 },
  { label: "III", hour: 3 },
  { label: "IV", hour: 4 },
  { label: "V", hour: 5 },
  { label: "VI", hour: 6 },
  { label: "VII", hour: 7 },
  { label: "VIII", hour: 8 },
  { label: "IX", hour: 9 },
  { label: "X", hour: 10 },
  { label: "XI", hour: 11 },
];

function round(val: number): number {
  return Math.round(val * 100) / 100;
}

export function AnalogClock({ size = 184, className = "" }: AnalogClockProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const radius = size / 2;
  const center = radius;

  if (!mounted || !time) {
    return (
      <div
        className={`relative inline-flex flex-col items-center select-none ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius - 2}
            fill="var(--surface)"
            stroke="var(--border)"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const accessibleTimeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      aria-label={`Current analog clock time: ${accessibleTimeString}`}
      role="img"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Subtle Sunray Dial Gradient */}
          <radialGradient id="rolexDialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--surface)" />
            <stop offset="85%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--surface-elevated)" />
          </radialGradient>
        </defs>

        {/* Stepped Fluted Outer Bezel */}
        <circle
          cx={center}
          cy={center}
          r={radius - 2}
          fill="url(#rolexDialGrad)"
          stroke="var(--clock-bezel)"
          strokeWidth="3"
        />

        {/* Fluted Edge Ring Notch Simulation */}
        <circle
          cx={center}
          cy={center}
          r={radius - 5}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.2"
        />

        {/* Railway Minute Track: Outer Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius - 9}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="0.85"
          opacity="0.7"
        />

        {/* Railway Minute Track: Inner Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius - 15}
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="0.85"
          opacity="0.7"
        />

        {/* Minute and Hour Ticks inside Railway Track */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHourTick = i % 5 === 0;
          const angle = (i / 60) * 360;
          const rad = (angle * Math.PI) / 180;
          const outerR = radius - 9;
          const innerR = radius - 15;

          const x1 = round(center + outerR * Math.sin(rad));
          const y1 = round(center - outerR * Math.cos(rad));
          const x2 = round(center + innerR * Math.sin(rad));
          const y2 = round(center - innerR * Math.cos(rad));

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isHourTick ? "var(--text-primary)" : "var(--text-secondary)"}
              strokeWidth={isHourTick ? 1.5 : 0.7}
              opacity={isHourTick ? 1 : 0.6}
              strokeLinecap="square"
            />
          );
        })}

        {/* Hour Dots / Applied Luminous Pips at each 5-minute position */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 360;
          const rad = (angle * Math.PI) / 180;
          const pipRadius = radius - 18;
          const px = round(center + pipRadius * Math.sin(rad));
          const py = round(center - pipRadius * Math.cos(rad));

          return (
            <circle
              key={`pip-${i}`}
              cx={px}
              cy={py}
              r="1.2"
              fill="var(--today)"
              opacity="0.8"
            />
          );
        })}

        {/* Rolex-style Applied Roman Numerals (Smaller, Elegant Serif) */}
        {ROMAN_NUMERALS.map((item) => {
          const angle = (item.hour / 12) * 360;
          const rad = (angle * Math.PI) / 180;
          const numeralRadius = radius - 30;
          const x = round(center + numeralRadius * Math.sin(rad));
          const y = round(center - numeralRadius * Math.cos(rad));

          return (
            <text
              key={item.label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="7px"
              fontFamily="Newsreader, 'Times New Roman', Georgia, serif"
              fontWeight="600"
              fill="var(--text-primary)"
              className="tracking-widest select-none"
            >
              {item.label}
            </text>
          );
        })}

        {/* Rolex-Style Dial Signature / Typography Below 12 */}
        <g transform={`translate(${center}, ${center - 24})`}>
          {/* Minimalist Crown / Coronet Emblem */}
          <path
            d="M -4,0 L -5,-5 L -2.2,-2.5 L 0,-6 L 2.2,-2.5 L 5,-5 L 4,0 Z"
            fill="none"
            stroke="var(--today)"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
          <circle cx="-5" cy="-5" r="0.6" fill="var(--today)" />
          <circle cx="0" cy="-6" r="0.7" fill="var(--today)" />
          <circle cx="5" cy="-5" r="0.6" fill="var(--today)" />

          {/* Brand Wordmark */}
          <text
            x="0"
            y="7"
            textAnchor="middle"
            fontSize="5.5px"
            fontFamily="Inter, ui-sans-serif, sans-serif"
            fontWeight="700"
            fill="var(--text-primary)"
            letterSpacing="0.2em"
          >
            PERFECT
          </text>
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fontSize="3.8px"
            fontFamily="Inter, ui-sans-serif, sans-serif"
            fontWeight="500"
            fill="var(--text-tertiary)"
            letterSpacing="0.14em"
          >
            CALENDAR
          </text>
        </g>

        {/* Chronometer Certification Inscription Above 6 */}
        <g transform={`translate(${center}, ${center + 24})`}>
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontSize="3.8px"
            fontFamily="Inter, ui-sans-serif, monospace"
            fontWeight="500"
            fill="var(--text-tertiary)"
            letterSpacing="0.16em"
          >
            CHRONOMETER
          </text>
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fontSize="3.4px"
            fontFamily="Inter, ui-sans-serif, monospace"
            fontWeight="600"
            fill="var(--today)"
            letterSpacing="0.12em"
          >
            IST PRECISION
          </text>
        </g>

        {/* Rolex-Style Mercedes Hour Hand */}
        {(() => {
          const rad = (hourAngle * Math.PI) / 180;
          const hLen = radius * 0.48;
          const tipX = round(center + hLen * Math.sin(rad));
          const tipY = round(center - hLen * Math.cos(rad));
          const pipDist = hLen * 0.72;
          const pipX = round(center + pipDist * Math.sin(rad));
          const pipY = round(center - pipDist * Math.cos(rad));

          return (
            <g>
              {/* Main Stem */}
              <line
                x1={center}
                y1={center}
                x2={tipX}
                y2={tipY}
                stroke="var(--text-primary)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Mercedes Luminous Circle */}
              <circle
                cx={pipX}
                cy={pipY}
                r="3.2"
                fill="var(--surface)"
                stroke="var(--text-primary)"
                strokeWidth="1.2"
              />
              {/* Internal 3-point star divider */}
              <line
                x1={pipX}
                y1={pipY}
                x2={round(pipX + 2.8 * Math.sin(rad))}
                y2={round(pipY - 2.8 * Math.cos(rad))}
                stroke="var(--text-primary)"
                strokeWidth="0.8"
              />
              <line
                x1={pipX}
                y1={pipY}
                x2={round(pipX + 2.8 * Math.sin(rad + (2 * Math.PI) / 3))}
                y2={round(pipY - 2.8 * Math.cos(rad + (2 * Math.PI) / 3))}
                stroke="var(--text-primary)"
                strokeWidth="0.8"
              />
              <line
                x1={pipX}
                y1={pipY}
                x2={round(pipX + 2.8 * Math.sin(rad + (4 * Math.PI) / 3))}
                y2={round(pipY - 2.8 * Math.cos(rad + (4 * Math.PI) / 3))}
                stroke="var(--text-primary)"
                strokeWidth="0.8"
              />
            </g>
          );
        })()}

        {/* Tapered Syringe Minute Hand */}
        {(() => {
          const rad = (minuteAngle * Math.PI) / 180;
          const mLen = radius * 0.72;
          const tipX = round(center + mLen * Math.sin(rad));
          const tipY = round(center - mLen * Math.cos(rad));

          return (
            <g>
              <line
                x1={center}
                y1={center}
                x2={tipX}
                y2={tipY}
                stroke="var(--text-primary)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Inset Luminous Spine */}
              <line
                x1={round(center + radius * 0.2 * Math.sin(rad))}
                y1={round(center - radius * 0.2 * Math.cos(rad))}
                x2={round(center + radius * 0.65 * Math.sin(rad))}
                y2={round(center - radius * 0.65 * Math.cos(rad))}
                stroke="var(--surface)"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>
          );
        })()}

        {/* Lollipop Sweeping Seconds Hand */}
        {(() => {
          const rad = (secondAngle * Math.PI) / 180;
          const sLen = radius * 0.82;
          const tailLen = radius * 0.18;
          const eyeDist = radius * 0.58;

          const tipX = round(center + sLen * Math.sin(rad));
          const tipY = round(center - sLen * Math.cos(rad));
          const tailX = round(center - tailLen * Math.sin(rad));
          const tailY = round(center + tailLen * Math.cos(rad));
          const eyeX = round(center + eyeDist * Math.sin(rad));
          const eyeY = round(center - eyeDist * Math.cos(rad));

          return (
            <g>
              {/* Second Hand Needle */}
              <line
                x1={tailX}
                y1={tailY}
                x2={tipX}
                y2={tipY}
                stroke="var(--clock-second)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              {/* Rolex-Style Circular Lollipop Pip */}
              <circle
                cx={eyeX}
                cy={eyeY}
                r="2.4"
                fill="var(--surface)"
                stroke="var(--clock-second)"
                strokeWidth="1.1"
              />
            </g>
          );
        })()}

        {/* Layered Rolex-style Center Cap Pin */}
        <circle cx={center} cy={center} r="4" fill="var(--text-primary)" />
        <circle cx={center} cy={center} r="2.2" fill="var(--clock-second)" />
        <circle cx={center} cy={center} r="0.9" fill="var(--surface)" />
      </svg>
    </div>
  );
}
