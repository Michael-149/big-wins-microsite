import { getCaseStudy, getAllCaseStudies, getLessonsForCaseStudy } from '@/lib/content';
import CaseStudyHero from '@/components/case-study/CaseStudyHero';
import CaseStudyTabs from '@/components/case-study/CaseStudyTabs';
import CaseStudyAccordion from '@/components/case-study/CaseStudyAccordion';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PrevNextNav from '@/components/ui/PrevNextNav';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all case studies
export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

// Generate metadata for each case study
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
    };
  }

  return {
    title: `${caseStudy.frontmatter.title} | Big Wins in Social Science`,
    description: `${caseStudy.frontmatter.heroMetric} - ${caseStudy.frontmatter.domain}`,
  };
}

// Helper function to parse content into sections
function parseSections(htmlContent: string) {
  // Split by H2 headings
  const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
  const matches = [...htmlContent.matchAll(h2Regex)];

  if (matches.length === 0) {
    return [{
      id: 'overview',
      title: 'Overview',
      content: htmlContent,
    }];
  }

  const sections: Array<{ id: string; title: string; content: string }> = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const title = match[1].replace(/<[^>]*>/g, ''); // Strip any HTML tags
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : htmlContent.length;

    const content = htmlContent.slice(startIndex, endIndex).trim();

    sections.push({ id, title, content });
  }

  return sections;
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudy(slug);

  if (!caseStudy) {
    notFound();
  }

  const relatedLessons = await getLessonsForCaseStudy(slug);
  const sections = parseSections(caseStudy.content);

  // Calculate previous and next case studies (alphabetically by slug)
  const allCaseStudies = getAllCaseStudies();
  const sortedCaseStudies = allCaseStudies.sort((a, b) => a.slug.localeCompare(b.slug));
  const currentIndex = sortedCaseStudies.findIndex(cs => cs.slug === slug);
  const prevCaseStudy = currentIndex > 0 ? sortedCaseStudies[currentIndex - 1] : null;
  const nextCaseStudy = currentIndex < sortedCaseStudies.length - 1 ? sortedCaseStudies[currentIndex + 1] : null;

  return (
    <>
      <ReadingProgressBar />
      {/* Hero Section */}
      <CaseStudyHero
        title={caseStudy.frontmatter.title}
        domain={caseStudy.frontmatter.domain}
        heroMetric={caseStudy.frontmatter.heroMetric}
        timespan={caseStudy.frontmatter.timespan}
        keyResearchers={caseStudy.frontmatter.keyResearchers}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Case Studies', href: '/case-studies' },
              { label: caseStudy.frontmatter.title },
            ]}
          />

          {/* Tabs for Desktop */}
          <CaseStudyTabs sections={sections} />

          {/* Accordion for Mobile */}
          <CaseStudyAccordion sections={sections} />

          {/* Lessons Exemplified */}
          {relatedLessons.length > 0 && (
            <section className="mt-16 pt-16 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-black mb-4">
                Lessons Exemplified
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                This case study demonstrates these key lessons:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedLessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/lessons/${lesson.slug}`}
                    className="block bg-white border-2 border-sil-teal-3 rounded-lg p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-sil-teal-1"
                  >
                    <article className="flex items-start gap-4">
                      {/* Lesson Number */}
                      <div className="flex-shrink-0 w-10 h-10 bg-sil-teal-1 text-white rounded-full font-bold text-lg flex items-center justify-center">
                        {lesson.frontmatter.number}
                      </div>

                      {/* Lesson Info */}
                      <div>
                        <h3 className="text-lg font-bold text-black mb-1">
                          {lesson.frontmatter.shortTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Learn more about this lesson →
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Previous/Next Navigation */}
          <PrevNextNav
            type="case-study"
            prev={
              prevCaseStudy
                ? {
                    href: `/case-studies/${prevCaseStudy.slug}`,
                    title: prevCaseStudy.frontmatter.title,
                  }
                : undefined
            }
            next={
              nextCaseStudy
                ? {
                    href: `/case-studies/${nextCaseStudy.slug}`,
                    title: nextCaseStudy.frontmatter.title,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
}
