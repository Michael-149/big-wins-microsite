import AnimatedMetric from '@/components/ui/AnimatedMetric';

interface CaseStudyHeroProps {
  title: string;
  domain: string;
  heroMetric: string;
  timespan: string;
  keyResearchers: string[];
}

export default function CaseStudyHero({
  title,
  domain,
  heroMetric,
  timespan,
  keyResearchers,
}: CaseStudyHeroProps) {
  return (
    <section className="bg-sil-primary text-white py-16 md:py-20 border-b border-sil-teal-2">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Domain Tag */}
        <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded mb-6">
          <span className="text-white font-semibold text-sm">{domain}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight max-w-4xl">
          {title}
        </h1>

        {/* Hero Metric */}
        <div className="mb-10">
          <AnimatedMetric
            value={heroMetric}
            className="text-5xl md:text-6xl font-bold text-white block mb-2"
          />
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
              Timespan
            </p>
            <p className="text-base">{timespan}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
              Key Researchers
            </p>
            <p className="text-base">{keyResearchers.join(', ')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
