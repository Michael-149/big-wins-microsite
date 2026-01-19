'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedMetric from '@/components/ui/AnimatedMetric';

interface ROIComparisonProps {
  investment: string;
  return: string;
  multiplier: string;
  investmentLabel?: string;
  returnLabel?: string;
  description?: string;
}

export default function ROIComparison({
  investment,
  return: returnValue,
  multiplier,
  investmentLabel = 'Investment',
  returnLabel = 'Return',
  description,
}: ROIComparisonProps) {
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

  return (
    <div
      ref={ref}
      className="my-16 p-8 md:p-12 bg-gradient-to-br from-sil-primary/5 via-white to-sil-teal-2/5 border-2 border-sil-primary/20 rounded-2xl overflow-hidden"
    >
      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
        Return on Investment
      </h3>

      {/* ROI Flow Visualization */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
        {/* Investment Box */}
        <div className="relative">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-6 md:p-8 shadow-lg min-w-[200px] text-center">
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
              {investmentLabel}
            </div>
            <AnimatedMetric
              value={investment}
              className="text-3xl md:text-4xl font-black text-gray-900"
            />
          </div>
        </div>

        {/* Arrow with Multiplier */}
        <div className="relative flex flex-col md:flex-row items-center gap-4">
          {/* Arrow */}
          <svg
            className={`w-16 h-16 md:w-24 md:h-24 text-sil-primary transform md:rotate-0 rotate-90 transition-all duration-1000 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>

          {/* Multiplier Badge */}
          <div
            className={`absolute -top-8 md:top-auto md:-translate-y-12 bg-sil-red-1 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <span className="text-lg md:text-xl font-black">{multiplier}x</span>
          </div>
        </div>

        {/* Return Box */}
        <div className="relative">
          <div
            className={`bg-gradient-to-br from-sil-primary to-sil-teal-2 border-2 border-sil-primary rounded-xl p-6 md:p-8 shadow-2xl min-w-[200px] text-center transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-90'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="text-sm font-semibold text-white/90 uppercase tracking-wide mb-3">
              {returnLabel}
            </div>
            <AnimatedMetric
              value={returnValue}
              className="text-3xl md:text-4xl font-black text-white"
            />
          </div>

          {/* Decorative glow */}
          <div className="absolute inset-0 bg-sil-primary/20 rounded-xl blur-2xl -z-10" />
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-center text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {/* Bottom accent bar */}
      <div className="mt-8 h-1 w-full bg-gradient-to-r from-transparent via-sil-primary to-transparent rounded-full" />
    </div>
  );
}
