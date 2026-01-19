import MetricCard from './MetricCard';

interface Metric {
  value: string;
  label: string;
  description?: string;
  highlight?: boolean;
}

interface MetricGridProps {
  metrics: Metric[];
  title?: string;
}

export default function MetricGrid({ metrics, title }: MetricGridProps) {
  if (metrics.length === 0) return null;

  return (
    <section className="my-16">
      {title && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-sil-primary to-sil-teal-2 rounded-full" />
        </div>
      )}

      <div
        className={`grid gap-6 ${
          metrics.length === 1
            ? 'grid-cols-1'
            : metrics.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : metrics.length === 3
            ? 'grid-cols-1 md:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <MetricCard
              value={metric.value}
              label={metric.label}
              description={metric.description}
              variant={metric.highlight ? 'highlight' : 'default'}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
