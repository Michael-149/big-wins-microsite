import Link from 'next/link';

interface LessonSidebarProps {
  lessons: Array<{
    slug: string;
    frontmatter: {
      number: number;
      shortTitle: string;
    };
  }>;
  currentSlug: string;
}

export default function LessonSidebar({ lessons, currentSlug }: LessonSidebarProps) {
  return (
    <nav className="hidden lg:block w-64 flex-shrink-0" aria-label="Lessons navigation">
      <div className="sticky top-24">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          All Lessons
        </h2>
        <ul className="space-y-2">
          {lessons.map((lesson) => {
            const isActive = lesson.slug === currentSlug;
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sil-teal-1 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-sil-teal-2'
                  }`}
                >
                  <span className="text-sm font-bold mr-2">{lesson.frontmatter.number}.</span>
                  <span className="text-sm">{lesson.frontmatter.shortTitle}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
