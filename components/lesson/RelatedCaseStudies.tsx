import Link from 'next/link';

interface CaseStudy {
  slug: string;
  frontmatter: {
    title: string;
    domain: string;
    heroMetric: string;
  };
}

interface RelatedCaseStudiesProps {
  caseStudies: CaseStudy[];
}

export default function RelatedCaseStudies({ caseStudies }: RelatedCaseStudiesProps) {
  if (caseStudies.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t border-gray-200">
      <h2 className="text-3xl font-bold text-black mb-4">
        See It In Action
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Case studies that exemplify this lesson:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseStudies.map((caseStudy) => (
          <Link
            key={caseStudy.slug}
            href={`/case-studies/${caseStudy.slug}`}
            className="block bg-white border-2 border-sil-teal-3 rounded-lg p-6 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-sil-teal-1"
          >
            <article>
              {/* Domain Tag */}
              <div className="inline-block bg-sil-teal-1/10 text-sil-teal-3 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {caseStudy.frontmatter.domain}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-black mb-3">
                {caseStudy.frontmatter.title}
              </h3>

              {/* Hero Metric */}
              <p className="text-2xl font-bold text-sil-red-1 mb-2">
                {caseStudy.frontmatter.heroMetric}
              </p>

              {/* CTA */}
              <span className="text-sil-teal-2 font-semibold text-sm hover:underline">
                Read Full Story →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
