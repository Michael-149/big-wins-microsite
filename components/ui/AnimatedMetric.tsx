'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedMetricProps {
  value: string;
  className?: string;
  duration?: number;
}

// Easing function: fast start, slow end
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// Parse metric string to extract numbers and formatting
function parseMetric(value: string): {
  prefix?: string;
  suffix?: string;
  numbers: number[];
  connector?: string;
  original: string;
} {
  const original = value;

  // Handle ranges like "15% to 53%" or "$100 to $200"
  const rangeMatch = value.match(/^(.*?)(\d[\d,\.]*)\s*(to|-)\s*(.*?)(\d[\d,\.]*)(.*)$/i);
  if (rangeMatch) {
    const prefix = rangeMatch[1];
    const num1 = parseFloat(rangeMatch[2].replace(/,/g, ''));
    const connector = ` ${rangeMatch[3]} `;
    const middlePrefix = rangeMatch[4];
    const num2 = parseFloat(rangeMatch[5].replace(/,/g, ''));
    const suffix = rangeMatch[6];

    return {
      prefix: prefix || undefined,
      numbers: [num1, num2],
      connector,
      suffix: suffix || undefined,
      original,
    };
  }

  // Handle simple numbers with prefix/suffix like "31%", "$302,000"
  const simpleMatch = value.match(/^(.*?)(\d[\d,\.]*)(.*)$/);
  if (simpleMatch) {
    const prefix = simpleMatch[1];
    const num = parseFloat(simpleMatch[2].replace(/,/g, ''));
    const suffix = simpleMatch[3];

    return {
      prefix: prefix || undefined,
      numbers: [num],
      suffix: suffix || undefined,
      original,
    };
  }

  // Fallback: couldn't parse, return original
  return {
    numbers: [],
    original,
  };
}

// Format number with commas for thousands
function formatNumber(num: number, hasDecimals: boolean): string {
  if (hasDecimals) {
    return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return Math.round(num).toLocaleString('en-US');
}

export default function AnimatedMetric({
  value,
  className = '',
  duration = 1200,
}: AnimatedMetricProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    // Parse the metric
    const parsed = parseMetric(value);

    // If we couldn't parse numbers, just show the value
    if (parsed.numbers.length === 0) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Animate the numbers
            const startTime = Date.now();
            const hasDecimals = parsed.numbers.some((n) => n % 1 !== 0);

            let rafId: number;

            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutExpo(progress);

              // Calculate current values
              const currentNumbers = parsed.numbers.map((targetNum) =>
                Math.round(targetNum * easedProgress)
              );

              // Build display string
              let display = parsed.prefix || '';

              if (currentNumbers.length === 1) {
                display += formatNumber(currentNumbers[0], hasDecimals);
              } else if (currentNumbers.length === 2) {
                display += formatNumber(currentNumbers[0], hasDecimals);
                display += parsed.connector || ' to ';
                display += formatNumber(currentNumbers[1], hasDecimals);
              }

              display += parsed.suffix || '';

              setDisplayValue(display);

              if (progress < 1) {
                rafId = requestAnimationFrame(animate);
              } else {
                // Ensure we end with the exact target value
                setDisplayValue(parsed.original);
              }
            };

            rafId = requestAnimationFrame(animate);

            // Cleanup
            return () => {
              if (rafId) {
                cancelAnimationFrame(rafId);
              }
              observer.disconnect();
            };
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={value}
      aria-live="polite"
    >
      {displayValue}
    </span>
  );
}
