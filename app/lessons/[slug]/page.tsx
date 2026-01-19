import { getLesson, getAllLessons, getCaseStudiesForLesson } from '@/lib/content';
import LessonSidebar from '@/components/lesson/LessonSidebar';
import LessonHero from '@/components/lesson/LessonHero';
import LessonTabs from '@/components/lesson/LessonTabs';
import LessonAccordion from '@/components/lesson/LessonAccordion';
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

// Parse H2 sections from HTML content
function parseSections(htmlContent: string) {
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
    const title = match[1].replace(/<[^>]*>/g, '');
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : htmlContent.length;

    const content = htmlContent.slice(startIndex, endIndex).trim();

    sections.push({ id, title, content });
  }

  return sections;
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

  // Parse sections from content
  const sections = parseSections(lesson.content);

  // Calculate previous and next lessons
  const currentIndex = allLessons.findIndex(l => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Engaging descriptions for each lesson
  const descriptions: Record<number, string> = {
    1: "From partnerships to advocacy to community-driven innovation—engagement takes many forms, all essential for translating research into lasting change.",
    2: "Different archetypes of researcher-champions drive impact in distinct ways—from idea entrepreneurs to field builders.",
    3: "Implementation details are the intervention itself—small design choices determine success or failure at scale.",
    4: "Translators between academic research and policy implementation are essential catalysts for evidence-based change.",
    5: "Strategic framing that cuts across ideological divides enables adoption at scale in polarized environments.",
    6: "Seizing political and institutional moments of opportunity accelerates impact when research is ready.",
    7: "Decades-long sustained engagement—not quick wins—characterizes transformative research trajectories.",
    8: "Researchers play multiple roles beyond publishing: advocate, advisor, implementer, and knowledge broker.",
  };

  return (
    <>
      <ReadingProgressBar />

      {/* Hero Section */}
      <LessonHero
        number={lesson.frontmatter.number}
        title={lesson.frontmatter.title}
        icon={lesson.frontmatter.icon}
        topics={lesson.frontmatter.topics}
        description={descriptions[lesson.frontmatter.number]}
      />

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

          {/* Section Navigation: Tabs (desktop) and Accordion (mobile) */}
          <LessonTabs sections={sections} />
          <LessonAccordion sections={sections} />

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
