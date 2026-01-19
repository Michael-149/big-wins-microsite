import AnimatedMetric from '@/components/ui/AnimatedMetric';

interface MetricCardProps {
  value: string;
  label: string;
  description?: string;
  variant?: 'default' | 'highlight';
}

export default function MetricCard({
  value,
  label,
  description,
  variant = 'default',
}: MetricCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        variant === 'highlight'
          ? 'bg-gradient-to-br from-sil-red-1/5 to-sil-red-1/10 border-sil-red-1/30 hover:border-sil-red-1/50'
          : 'bg-white border-gray-200 hover:border-sil-primary/50'
      }`}
    >
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sil-primary/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        {/* Large metric value */}
        <div className="mb-3">
          <AnimatedMetric
            value={value}
            className={`text-4xl md:text-5xl font-black leading-none ${
              variant === 'highlight'
                ? 'text-sil-red-1'
                : 'text-gray-900'
            }`}
          />
        </div>

        {/* Label */}
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
          {label}
        </h3>

        {/* Optional description */}
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        )}

        {/* Decorative element */}
        <div
          className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${
            variant === 'highlight' ? 'bg-sil-red-1' : 'bg-sil-primary'
          }`}
        />
      </div>
    </div>
  );
}
