import { getLesson, getAllLessons, getCaseStudiesForLesson } from '@/lib/content';
import LessonSidebar from '@/components/lesson/LessonSidebar';
import RelatedCaseStudies from '@/components/lesson/RelatedCaseStudies';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PrevNextNav from '@/components/ui/PrevNextNav';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all lessons
export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

// Generate metadata for each lesson
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lesson = await getLesson(slug);

  if (!lesson) {
    return {
      title: 'Lesson Not Found',
    };
  }

  return {
    title: `${lesson.frontmatter.shortTitle} | Big Wins in Social Science`,
    description: lesson.frontmatter.title,
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = await getLesson(slug);
  const allLessons = getAllLessons();

  if (!lesson) {
    notFound();
  }

  const relatedCaseStudies = await getCaseStudiesForLesson(slug);

  // Calculate previous and next lessons
  const currentIndex = allLessons.findIndex(l => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <>
      <ReadingProgressBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          {/* Sidebar Navigation */}
          <LessonSidebar lessons={allLessons} currentSlug={slug} />

        {/* Main Content */}
        <article className="flex-1 max-w-4xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Lessons', href: '/lessons' },
              { label: lesson.frontmatter.shortTitle },
            ]}
          />

          {/* Lesson Number Badge */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sil-teal-1 text-white rounded-full font-bold text-2xl mb-6">
            {lesson.frontmatter.number}
          </div>

          {/* Lesson Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
            {lesson.frontmatter.title}
          </h1>

          {/* Lesson Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-black prose-headings:font-bold
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-black prose-strong:font-semibold
              prose-a:text-sil-teal-2 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-sil-teal-3
              prose-blockquote:bg-sil-teal-1/10 prose-blockquote:py-4 prose-blockquote:px-6
              prose-blockquote:not-italic prose-blockquote:text-gray-700
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-li:text-gray-700 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />

          {/* Key Takeaway Box */}
          <div className="mt-12 p-6 bg-sil-teal-3/10 border-2 border-sil-teal-3 rounded-lg">
            <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-2">
              <span>💡</span>
              Key Takeaway
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {lesson.frontmatter.shortTitle}: This lesson emphasizes the importance of {
                lesson.frontmatter.number === 1 ? 'engaging with stakeholders throughout the research process' :
                lesson.frontmatter.number === 2 ? 'understanding different researcher archetypes and their unique contributions' :
                lesson.frontmatter.number === 3 ? 'paying careful attention to implementation details' :
                lesson.frontmatter.number === 4 ? 'having translators who bridge academic research and policy' :
                lesson.frontmatter.number === 5 ? 'strategic framing that appeals across political divides' :
                lesson.frontmatter.number === 6 ? 'recognizing and seizing windows of opportunity' :
                lesson.frontmatter.number === 7 ? 'sustained long-term engagement beyond initial publication' :
                'researchers taking on multiple roles throughout the impact journey'
              }.
            </p>
          </div>

          {/* Related Case Studies */}
          <RelatedCaseStudies caseStudies={relatedCaseStudies} />

          {/* Previous/Next Navigation */}
          <PrevNextNav
            type="lesson"
            prev={
              prevLesson
                ? {
                    href: `/lessons/${prevLesson.slug}`,
                    title: `Lesson ${prevLesson.frontmatter.number}: ${prevLesson.frontmatter.shortTitle}`,
                  }
                : undefined
            }
            next={
              nextLesson
                ? {
                    href: `/lessons/${nextLesson.slug}`,
                    title: `Lesson ${nextLesson.frontmatter.number}: ${nextLesson.frontmatter.shortTitle}`,
                  }
                : undefined
            }
          />
        </article>
      </div>
    </div>
    </>
  );
}
