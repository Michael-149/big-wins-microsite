import { getAllLessons } from '@/lib/content';
import LessonCard from '@/components/cards/LessonCard';

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sil-primary via-sil-teal-2 to-sil-teal-3 text-white py-20 md:py-28 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="text-white font-semibold text-sm">8 Research Lessons</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Lessons from Big Wins
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl leading-relaxed font-light mb-8">
            What we learned from studying transformative social science research that achieved large-scale societal impact over the past 50 years.
          </p>
          <div className="flex items-center gap-2 text-white/80">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-sm font-medium">Explore the lessons below</span>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>
    </>
  );
}
