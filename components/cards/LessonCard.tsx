import Link from 'next/link';
import type { LessonFrontmatter } from '@/lib/types';
import LessonIcon from '@/components/icons/LessonIcon';

interface LessonCardProps {
  lesson: {
    slug: string;
    frontmatter: LessonFrontmatter;
  };
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const { number, shortTitle, icon } = lesson.frontmatter;

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
      className="block bg-white border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:border-sil-primary hover:-translate-y-1 group"
    >
      <article className="flex flex-col h-full">
        {/* Icon + Number Badge */}
        <div className="flex items-center gap-3 mb-4">
          {/* Icon Container */}
          <div className="flex items-center justify-center w-12 h-12 bg-sil-primary/10 rounded-lg group-hover:bg-sil-primary/20 transition-colors duration-300">
            <LessonIcon
              iconName={icon}
              className="w-6 h-6 text-sil-primary group-hover:text-sil-teal-2 transition-colors duration-300"
            />
          </div>

          {/* Number Badge */}
          <div className="flex items-center justify-center w-8 h-8 bg-sil-primary text-white rounded-full font-bold text-sm group-hover:bg-sil-teal-2 transition-all duration-300 group-hover:scale-110">
            {number}
          </div>
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
