'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface LessonTabsProps {
  sections: Section[];
}

export default function LessonTabs({ sections }: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState(sections[0]?.id || '');

  // Handle URL hash on mount and hash changes
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && sections.some(s => s.id === hash)) {
      setActiveTab(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash && sections.some(s => s.id === newHash)) {
        setActiveTab(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [sections]);

  // Update URL hash when tab changes
  const handleTabChange = (sectionId: string) => {
    setActiveTab(sectionId);
    window.history.pushState(null, '', `#${sectionId}`);
  };

  const activeSection = sections.find((section) => section.id === activeTab);

  return (
    <div className="hidden lg:block">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8" aria-label="Lesson sections">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleTabChange(section.id)}
              className={`pb-4 px-2 font-semibold transition-colors relative ${
                activeTab === section.id
                  ? 'text-sil-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.title}
              {activeTab === section.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sil-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeSection && (
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
          dangerouslySetInnerHTML={{ __html: activeSection.content }}
        />
      )}
    </div>
  );
}
