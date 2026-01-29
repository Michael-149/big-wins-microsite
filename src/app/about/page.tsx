import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Big Wins in Social Science',
  description: 'Learn how these case studies were selected and how social science research delivers large-scale societal impact.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sil-teal-3 to-sil-teal-2 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About This Project
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-95">
            Understanding how social science research creates meaningful change in people&rsquo;s lives.
          </p>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Why These Case Studies?
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            These case studies document real-world examples where social science research has delivered large-scale societal impact. They reveal the diverse pathways through which research improves people&rsquo;s lives—from informing public policy to scaling effective programs to shifting cultural norms.
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            By examining these successes, we aim to:
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-sil-teal-1 rounded-full mt-2 mr-4 flex-shrink-0"></span>
              <span className="text-lg text-gray-700">
                <strong className="text-gray-900">Illustrate diverse pathways</strong> from research to impact across different domains, geographies, and disciplines.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-sil-teal-1 rounded-full mt-2 mr-4 flex-shrink-0"></span>
              <span className="text-lg text-gray-700">
                <strong className="text-gray-900">Identify common success factors</strong> and barriers overcome along the way.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-sil-teal-1 rounded-full mt-2 mr-4 flex-shrink-0"></span>
              <span className="text-lg text-gray-700">
                <strong className="text-gray-900">Generate insights</strong> into how we can catalyze similar wins for social science research.
              </span>
            </li>
          </ul>
          <p className="text-lg leading-relaxed text-gray-700">
            This collection represents the <strong>broad landscape</strong> of high-impact social science research. Great ideas can come from communities directly affected by problems, from practitioners working on the ground, or from researchers in academic settings. Social science research helps accelerate promising solutions and prevents wasted effort on well-intentioned ideas that don&rsquo;t achieve their goals.
          </p>
        </div>
      </section>

      {/* Selection Criteria */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            How Were These Cases Selected?
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-700">
            These case studies emerged from a multi-year process engaging over 30 stakeholders, including workshops with social science scholars at multiple institutions and analysis by the public solutions R&D network. From a long list of over 65 examples, we selected cases that met the following criteria:
          </p>

          <div className="space-y-6">
            {/* Criterion 1 */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-sil-teal-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                1. Large Societal Benefit
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The research led to improvements that reached large numbers of people, created significant depth of impact, or delivered critical benefits to particularly vulnerable populations.
              </p>
            </div>

            {/* Criterion 2 */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-sil-teal-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                2. Clear Attribution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Evidence shows that social science research played a pivotal role in achieving impact at scale, not just a supporting role.
              </p>
            </div>

            {/* Criterion 3 */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-sil-teal-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                3. Well-Documented Journey
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Credible public sources trace the pathway from research to impact, allowing us to understand how change happened.
              </p>
            </div>

            {/* Criterion 4 */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-sil-teal-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                4. Diversity of Contexts
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Cases span different domains (health, education, environment, economic mobility), geographies (domestic and international), and disciplines (economics, psychology, sociology, and more).
              </p>
            </div>

            {/* Criterion 5 */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-sil-teal-1">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                5. Variety of Pathways
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Research influenced change through different mechanisms: shaping policy, creating market incentives, scaling programs, or shifting public understanding and norms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Read These Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            How to Read These Cases
          </h2>
          <p className="text-lg leading-relaxed mb-8 text-gray-700">
            These case studies document proven successes, but it&rsquo;s important to understand their context and limitations:
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Attribution Is Complex
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Large-scale impacts rarely result from research alone. Many stakeholders contribute, and some change might have occurred regardless. We&rsquo;ve used multiple credible sources to trace research&rsquo;s role and note where uncertainty exists.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Success Stories Are Not Blueprints
              </h3>
              <p className="text-gray-700 leading-relaxed">
                What works in one context may not transfer directly to another. Political, cultural, and institutional factors shape outcomes. We&rsquo;ve aimed to distinguish context-specific lessons from broadly applicable principles.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Hindsight Simplifies the Journey
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Looking backward can make success seem inevitable. In reality, these cases involved uncertainty, iteration, setbacks, and course corrections. Where possible, we&rsquo;ve documented key challenges and pivots alongside successes.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                Evidence Gaps Exist
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Public documentation may be incomplete or emphasize positive narratives. We&rsquo;ve cross-referenced academic, policy, and media sources and sought critical perspectives where available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Note */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Research Methodology
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            These case studies rely on desk research using published academic research, publicly available reports, organizational websites, and credible secondary sources. We used process tracing and triangulation across multiple sources to build a reliable picture of each case.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            While this approach provides valuable insights, it cannot capture every nuance of complex, multi-year efforts involving many stakeholders. These cases should be read as illustrative examples that reveal patterns and principles, not as comprehensive histories.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sil-teal-3 to-sil-teal-2 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Explore the Lessons and Case Studies
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Discover the patterns and principles behind these big wins in social science.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lessons"
              className="inline-block bg-white text-sil-teal-3 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Lessons
            </Link>
            <Link
              href="/case-studies"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-sil-teal-3 transition-colors"
            >
              View Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Stanford Impact Labs Credit */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-4">
            This project is part of Stanford Impact Labs&rsquo; investment strategy to catalyze large-scale impact from social science research.
          </p>
          <a
            href="https://impact.stanford.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sil-teal-2 hover:text-sil-teal-1 font-semibold transition-colors"
          >
            Learn more about Stanford Impact Labs →
          </a>
        </div>
      </section>
    </main>
  );
}
