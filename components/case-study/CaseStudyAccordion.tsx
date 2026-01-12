'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface CaseStudyAccordionProps {
  sections: Section[];
}

export default function CaseStudyAccordion({ sections }: CaseStudyAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set([sections[0]?.id])
  );

  // Handle URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && sections.some(s => s.id === hash)) {
      setOpenSections(new Set([hash]));
    }
  }, [sections]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    // Update URL hash
    if (!openSections.has(id)) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="md:hidden space-y-4">
      {sections.map((section) => {
        const isOpen = openSections.has(section.id);

        return (
          <div
            key={section.id}
            className="border-2 border-sil-teal-3 rounded-lg overflow-hidden"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-bold text-lg text-black text-left">
                {section.title}
              </span>
              <svg
                className={`w-6 h-6 text-sil-teal-2 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div
                className="px-6 py-6 bg-white border-t-2 border-sil-teal-3/20
                  prose prose-base max-w-none
                  prose-headings:text-black prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
                  prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
                  prose-h4:text-lg prose-h4:mt-3 prose-h4:mb-2
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-black prose-strong:font-semibold
                  prose-a:text-sil-teal-2 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-sil-teal-3
                  prose-blockquote:bg-sil-teal-1/10 prose-blockquote:py-3 prose-blockquote:px-4
                  prose-blockquote:not-italic prose-blockquote:text-gray-700
                  prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5
                  prose-li:text-gray-700 prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
