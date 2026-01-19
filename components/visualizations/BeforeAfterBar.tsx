'use client';

import { useEffect, useRef, useState } from 'react';

interface BeforeAfterBarProps {
  before: number;
  after: number;
  label: string;
  description?: string;
}

export default function BeforeAfterBar({
  before,
  after,
  label,
  description,
}: BeforeAfterBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const increase = after - before;
  const increaseText = increase > 0 ? `+${increase}` : `${increase}`;

  return (
    <div ref={ref} className="my-12 p-8 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{label}</h3>

      {/* Before Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Before
          </span>
          <span className="text-2xl font-bold text-gray-900">{before}%</span>
        </div>
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${before}%` : '0%',
            }}
          />
        </div>
      </div>

      {/* After Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            After
          </span>
          <span className="text-2xl font-bold text-sil-primary">{after}%</span>
        </div>
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-sil-primary to-sil-teal-2 rounded-full transition-all duration-1000 ease-out shadow-lg"
            style={{
              width: isVisible ? `${after}%` : '0%',
              transitionDelay: '300ms',
            }}
          />
        </div>
      </div>

      {/* Increase Indicator */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-sil-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-lg font-bold text-sil-primary">
            {increaseText} percentage points
          </span>
        </div>
        {description && (
          <span className="text-sm text-gray-600">• {description}</span>
        )}
      </div>
    </div>
  );
}
