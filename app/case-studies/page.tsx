import Link from 'next/link';
import { getAllCaseStudies } from '@/lib/content';

export default function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            8 Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
            Real-world examples of social science research that shaped policy and practice, from housing mobility to climate economics to behavioral nudges.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((caseStudy) => (
            <Link
              key={caseStudy.slug}
              href={`/case-studies/${caseStudy.slug}`}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-sil-primary group"
            >
              <article>
                {/* Domain Header */}
                <div className="bg-sil-primary px-6 py-3 group-hover:bg-sil-teal-2 transition-colors duration-200">
                  <span className="text-white text-sm font-semibold">
                    {caseStudy.frontmatter.domain}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-sil-primary transition-colors duration-200">
                    {caseStudy.frontmatter.title}
                  </h2>

                  {/* Hero Metric */}
                  <p className="text-2xl font-bold text-sil-red-1 mb-4">
                    {caseStudy.frontmatter.heroMetric}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {caseStudy.frontmatter.keyResearchers && caseStudy.frontmatter.keyResearchers.length > 0 && (
                      <p>
                        <span className="font-semibold text-gray-700">Key Researchers:</span>{' '}
                        {caseStudy.frontmatter.keyResearchers.slice(0, 2).join(', ')}
                        {caseStudy.frontmatter.keyResearchers.length > 2 && ', et al.'}
                      </p>
                    )}
                    {caseStudy.frontmatter.timespan && (
                      <p>
                        <span className="font-semibold text-gray-700">Timespan:</span>{' '}
                        {caseStudy.frontmatter.timespan}
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <span className="text-sil-primary font-semibold group-hover:underline">
                    Read Full Story →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
