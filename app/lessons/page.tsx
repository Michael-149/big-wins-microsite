import { getAllLessons } from '@/lib/content';
import LessonCard from '@/components/cards/LessonCard';

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            8 Lessons from Big Wins
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            What we learned from studying transformative social science research that achieved large-scale societal impact.
          </p>
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
