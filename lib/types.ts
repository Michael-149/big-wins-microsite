// TypeScript interfaces for Big Wins microsite content

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface LessonFrontmatter {
  number: number;
  slug: string;
  title: string;
  shortTitle: string;
  icon: string; // Required: Heroicons icon name
  topics?: string[]; // Optional: Topic tags for categorization
  relatedCaseStudies: string[]; // Array of case study slugs
}

export interface Lesson {
  slug: string;
  frontmatter: LessonFrontmatter;
  content: string;
}

export interface CaseStudyFrontmatter {
  title: string;
  slug: string;
  domain: string;
  domainColor?: string;
  keyResearchers: string[];
  timespan: string;
  heroMetric: string;
  lessonsExemplified: string[]; // Array of lesson slugs
  timeline?: TimelineEvent[]; // Optional timeline data
}

export interface CaseStudy {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
  content: string;
}
