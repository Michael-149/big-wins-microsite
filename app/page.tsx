import Link from 'next/link';
import { getAllLessons } from '@/lib/content';
import LessonCard from '@/components/cards/LessonCard';

export default function Home() {
  const lessons = getAllLessons();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight tracking-tight">
              8 Lessons from Social Science Big Wins
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              How research achieves large-scale societal impact: insights from eight transformative case studies spanning housing, health, environment, and economics.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="/lessons"
                className="inline-block bg-sil-primary hover:bg-sil-teal-2 text-white font-semibold px-8 py-4 rounded transition-all duration-200"
              >
                Explore the Lessons →
              </Link>
              <span className="text-gray-400">or</span>
              <a
                href="https://michael-149.github.io/big-wins-game/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sil-primary hover:text-sil-teal-2 font-semibold transition-colors"
              >
                Play the Game 🎮
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          The 8 Lessons
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Evidence-based insights for researchers, policymakers, and funders seeking to maximize the societal impact of social science research.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>

      {/* Case Studies Preview */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              8 Case Studies
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl">
              Real-world examples of research that shaped policy and practice, from needle exchange programs to climate economics to behavioral nudges.
            </p>
          </div>
          <div className="animate-fade-in delay-200">
            <Link
              href="/case-studies"
              className="inline-block bg-sil-primary hover:bg-sil-teal-2 text-white font-semibold px-8 py-4 rounded transition-all duration-200"
            >
              View All Case Studies →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
