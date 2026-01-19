import Link from 'next/link';
import CaseStudyIcon from '@/components/icons/CaseStudyIcon';

interface CaseStudySidebarProps {
  caseStudies: Array<{
    slug: string;
    frontmatter: {
      title: string;
      icon: string;
    };
  }>;
  currentSlug: string;
}

export default function CaseStudySidebar({ caseStudies, currentSlug }: CaseStudySidebarProps) {
  return (
    <nav className="hidden lg:block w-64 flex-shrink-0" aria-label="Case studies navigation">
      <div className="sticky top-24">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          All Case Studies
        </h2>
        <ul className="space-y-2">
          {caseStudies.map((caseStudy) => {
            const isActive = caseStudy.slug === currentSlug;
            return (
              <li key={caseStudy.slug}>
                <Link
                  href={`/case-studies/${caseStudy.slug}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sil-red-1 text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-sil-red-2'
                  }`}
                >
                  <CaseStudyIcon
                    iconName={caseStudy.frontmatter.icon}
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-sil-red-1'
                    }`}
                  />
                  <span className="text-sm leading-tight">{caseStudy.frontmatter.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
