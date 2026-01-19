import LessonIcon from '@/components/icons/LessonIcon';

interface LessonHeroProps {
  number: number;
  title: string;
  icon: string;
  topics?: string[];
  description: string;
}

export default function LessonHero({
  number,
  title,
  icon,
  topics = [],
  description,
}: LessonHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-sil-primary via-sil-teal-2 to-sil-teal-3 text-white py-16 md:py-24 overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Lesson Number + Icon Badge */}
        <div className="flex items-center gap-6 mb-8">
          {/* Large Icon Container - Editorial statement piece */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl" />
            <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl">
              <LessonIcon
                iconName={icon}
                className="w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-lg"
              />
            </div>
          </div>

          {/* Lesson Number - Bold typographic element */}
          <div className="flex flex-col">
            <span className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">
              Lesson
            </span>
            <span className="text-6xl md:text-7xl font-black text-white leading-none tracking-tight">
              {number}
            </span>
          </div>
        </div>

        {/* Topics Tags - Refined badges */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="inline-block bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/25 text-white/90 text-xs font-medium tracking-wide"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Title - Editorial headline treatment */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] max-w-5xl text-white drop-shadow-sm">
          {title}
        </h1>

        {/* Description - Compelling sub-headline */}
        <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed font-light">
          {description}
        </p>
      </div>
    </section>
  );
}
