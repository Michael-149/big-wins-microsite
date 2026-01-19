import AnimatedMetric from '@/components/ui/AnimatedMetric';
import CaseStudyIcon from '@/components/icons/CaseStudyIcon';

interface CaseStudyHeroProps {
  title: string;
  icon: string;
  domain: string;
  heroMetric: string;
  timespan: string;
  keyResearchers: string[];
}

export default function CaseStudyHero({
  title,
  icon,
  domain,
  heroMetric,
  timespan,
  keyResearchers,
}: CaseStudyHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-sil-red-1 via-sil-red-2 to-cardinal text-white py-16 md:py-24 overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Icon Badge - Visually distinct from lessons */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-xl blur-xl" />
            <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl">
              <CaseStudyIcon
                iconName={icon}
                className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg"
              />
            </div>
          </div>

          {/* Domain Tag */}
          <div className="inline-block bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/25">
            <span className="text-white/90 font-medium text-xs md:text-sm tracking-wide">{domain}</span>
          </div>
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
