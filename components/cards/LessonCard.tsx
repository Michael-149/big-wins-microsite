import Link from 'next/link';
import type { LessonFrontmatter } from '@/lib/types';

interface LessonCardProps {
  lesson: {
    slug: string;
    frontmatter: LessonFrontmatter;
  };
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const { number, shortTitle } = lesson.frontmatter;

  // Create engaging descriptions for each lesson
  const descriptions: Record<number, string> = {
    1: "Stakeholder engagement matters more than formal research partnerships",
    2: "Different archetypes of researcher-champions drive impact in distinct ways",
    3: "Implementation details are the intervention—small changes determine success or failure",
    4: "Translators between academic research and policy implementation are essential",
    5: "Strategic framing that cuts across ideological divides enables adoption at scale",
    6: "Seizing political and institutional moments of opportunity accelerates impact",
    7: "Decades-long sustained engagement—not quick wins—characterizes transformative research",
    8: "Researchers play multiple roles beyond publishing: advocate, advisor, implementer",
  };

  return (
    <Link
      href={`/lessons/${lesson.slug}`}
      className="block bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-xl hover:border-sil-primary group"
    >
      <article className="flex flex-col h-full">
        {/* Lesson Number */}
        <div className="inline-flex items-center justify-center w-10 h-10 bg-sil-primary text-white rounded font-bold text-lg mb-4 flex-shrink-0 group-hover:bg-sil-teal-2 transition-colors duration-200">
          {number}
        </div>

        {/* Short Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug group-hover:text-sil-primary transition-colors duration-200">
          {shortTitle}
        </h3>

        {/* Engaging Description */}
        <p className="text-sm text-gray-600 leading-relaxed flex-grow">
          {descriptions[number]}
        </p>
      </article>
    </Link>
  );
}
