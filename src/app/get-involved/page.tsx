import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Involved | Big Wins in Social Science',
  description: 'Help us expand our understanding of how social science research achieves transformative impact.',
};

export default function GetInvolvedPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sil-teal-3 to-sil-teal-2 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Involved
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed opacity-95">
            Help us expand our understanding of how social science research achieves transformative impact.
          </p>
        </div>
      </section>

      {/* Living Resource Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            A Living Resource
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            This collection represents <strong>Version 1.0</strong> of our Big Wins project—a carefully curated set of eight case studies spanning housing, health, environment, and economics. These examples are not exhaustive. Transformative social science research extends far beyond these domains.
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-700">
            Future editions may focus on additional areas where social science research has driven large-scale impact:
          </p>

          {/* Domain Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Public Health</h3>
              <p className="text-sm text-gray-600">Health policy, pandemic preparedness, health equity, behavioral health</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Public Safety</h3>
              <p className="text-sm text-gray-600">Evidence-based policing, criminal justice reform, violence prevention</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Education Policy</h3>
              <p className="text-sm text-gray-600">School reform, teacher effectiveness, early childhood interventions</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Global Development</h3>
              <p className="text-sm text-gray-600">Poverty alleviation, health systems, economic development</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Public Finance</h3>
              <p className="text-sm text-gray-600">Tax policy, government efficiency, public investment</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Labor & Employment</h3>
              <p className="text-sm text-gray-600">Workforce development, labor markets, social insurance</p>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-gray-700">
            We welcome suggestions for case studies in these domains or others where social science research has achieved meaningful impact at scale.
          </p>
        </div>
      </section>

      {/* Ways to Contribute Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Ways to Contribute
          </h2>

          <div className="space-y-8">
            {/* Suggest Case Studies */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-sil-teal-1 shadow-sm">
              <div className="flex items-start">
                <span className="text-4xl mr-4" aria-hidden="true">📚</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    Suggest Case Studies
                  </h3>
                  <p className="text-lg leading-relaxed mb-6 text-gray-700">
                    Know of a &ldquo;big win&rdquo; where social science research shaped policy or practice at scale? Help us identify transformative examples to consider for future editions.
                  </p>
                  <a
                    href="https://forms.gle/gLgeuRk9qD1dm5XV9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-sil-teal-1 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sil-teal-2 transition-colors"
                  >
                    Suggest a Case Study
                  </a>
                </div>
              </div>
            </div>

            {/* Sponsor Research */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-sil-teal-1 shadow-sm">
              <div className="flex items-start">
                <span className="text-4xl mr-4" aria-hidden="true">💰</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    Sponsor Research
                  </h3>
                  <p className="text-lg leading-relaxed mb-6 text-gray-700">
                    Interested in supporting the development of new case studies or expanding this resource? Philanthropic partnerships help us deepen our analysis and broaden coverage across domains.
                  </p>
                  <a
                    href="mailto:meddy149@gmail.com"
                    className="inline-block bg-sil-teal-1 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sil-teal-2 transition-colors"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>

            {/* Report Issues */}
            <div className="bg-white p-8 rounded-lg border-l-4 border-sil-teal-1 shadow-sm">
              <div className="flex items-start">
                <span className="text-4xl mr-4" aria-hidden="true">🔧</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    Report Issues
                  </h3>
                  <p className="text-lg leading-relaxed mb-6 text-gray-700">
                    Spotted an error, bug, or have feedback on existing content? Help us improve the quality and accuracy of this resource.
                  </p>
                  <a
                    href="https://forms.gle/gLgeuRk9qD1dm5XV9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-sil-teal-1 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sil-teal-2 transition-colors"
                  >
                    Report a Bug or Error
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-sil-teal-3/10 to-sil-teal-2/10 p-8 rounded-lg border border-sil-teal-3/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Your Contribution Matters
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Every case study suggestion, error report, or partnership inquiry helps us build a more comprehensive understanding of how social science research creates meaningful change. Together, we can identify patterns, overcome barriers, and accelerate the path from research to impact.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sil-teal-3 to-sil-teal-2 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Explore the Current Collection
          </h2>
          <p className="text-xl mb-8 opacity-95">
            See the eight case studies and lessons that make up Version 1.0.
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
            This project is powered by Stanford Impact Labs.
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
