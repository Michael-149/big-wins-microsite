import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NavItem {
  title: string;
  href: string;
}

interface PrevNextNavProps {
  prev?: NavItem;
  next?: NavItem;
  type: 'lesson' | 'case-study';
}

export default function PrevNextNav({ prev, next, type }: PrevNextNavProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      className="mt-16 pt-8 border-t border-gray-200"
      aria-label={`${type === 'lesson' ? 'Lesson' : 'Case study'} navigation`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous */}
        <div>
          {prev ? (
            <Link
              href={prev.href}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-sil-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Previous</span>
              </div>
              <div className="text-lg font-semibold text-gray-900 group-hover:text-sil-primary transition-colors">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {/* Next */}
        <div>
          {next ? (
            <Link
              href={next.href}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-sil-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-end gap-2 text-sm font-semibold text-gray-500 mb-2">
                <span>Next</span>
                <ChevronRightIcon className="w-4 h-4" />
              </div>
              <div className="text-lg font-semibold text-gray-900 group-hover:text-sil-primary transition-colors text-right">
                {next.title}
              </div>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </div>
    </nav>
  );
}
