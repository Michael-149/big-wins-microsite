// Content parsing functions for markdown files
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import type { Lesson, CaseStudy, LessonFrontmatter, CaseStudyFrontmatter } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get a single lesson by slug
 */
export async function getLesson(slug: string): Promise<Lesson> {
  const filePath = path.join(contentDirectory, 'lessons', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);

  return {
    slug,
    frontmatter: data as LessonFrontmatter,
    content: processedContent.toString(),
  };
}

/**
 * Get all lessons
 */
export function getAllLessons(): { slug: string; frontmatter: LessonFrontmatter }[] {
  const lessonsDirectory = path.join(contentDirectory, 'lessons');

  if (!fs.existsSync(lessonsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(lessonsDirectory);

  const lessons = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(lessonsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        frontmatter: data as LessonFrontmatter,
      };
    });

  // Sort by lesson number
  return lessons.sort((a, b) => a.frontmatter.number - b.frontmatter.number);
}

/**
 * Get a single case study by slug
 */
export async function getCaseStudy(slug: string): Promise<CaseStudy> {
  const filePath = path.join(contentDirectory, 'case-studies', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);

  return {
    slug,
    frontmatter: data as CaseStudyFrontmatter,
    content: processedContent.toString(),
  };
}

/**
 * Get all case studies
 */
export function getAllCaseStudies(): { slug: string; frontmatter: CaseStudyFrontmatter }[] {
  const caseStudiesDirectory = path.join(contentDirectory, 'case-studies');

  if (!fs.existsSync(caseStudiesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(caseStudiesDirectory);

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(caseStudiesDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        frontmatter: data as CaseStudyFrontmatter,
      };
    });
}

/**
 * Get case studies related to a specific lesson
 */
export function getCaseStudiesForLesson(lessonSlug: string): { slug: string; frontmatter: CaseStudyFrontmatter }[] {
  const allCaseStudies = getAllCaseStudies();
  return allCaseStudies.filter(cs =>
    cs.frontmatter.lessonsExemplified?.includes(lessonSlug)
  );
}

/**
 * Get lessons related to a specific case study
 */
export function getLessonsForCaseStudy(caseStudySlug: string): { slug: string; frontmatter: LessonFrontmatter }[] {
  const allLessons = getAllLessons();
  return allLessons.filter(lesson =>
    lesson.frontmatter.relatedCaseStudies?.includes(caseStudySlug)
  );
}
