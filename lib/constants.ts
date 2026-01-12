// Constants for lessons and case studies

export const LESSON_SLUGS = {
  PUBLIC_ENGAGEMENT: 'public-engagement',
  ARCHETYPES: 'archetypes',
  DESIGN_DETAILS: 'design-details',
  KNOWLEDGE_BROKERS: 'knowledge-brokers',
  LEGITIMACY_NARRATIVE: 'legitimacy-narrative',
  POLICY_WINDOWS: 'policy-windows',
  LONG_TIMELINE: 'long-timeline',
  DIFFERENT_ROLES: 'different-roles',
} as const;

export const CASE_STUDY_SLUGS = {
  MTO: 'moving-to-opportunity',
  NEEDLE: 'needle-exchange',
  NUDGES: 'behavioral-nudges',
  ETS: 'emissions-trading',
  MINDSET: 'growth-mindset',
  DICE: 'dice-modeling',
  SPECTRUM: 'fcc-spectrum',
  AMC: 'amc-vaccines',
} as const;

export const DOMAIN_COLORS: Record<string, string> = {
  'Housing Policy / Economic Mobility': 'sil-teal-1',
  'Public Health / Harm Reduction': 'sil-teal-2',
  'Behavioral Economics / Public Policy': 'sil-teal-3',
  'Environmental Economics / Climate Policy': 'sil-teal-2',
  'Educational Psychology / Social-Emotional Learning': 'sil-teal-1',
  'Climate Economics / Environmental Policy': 'sil-teal-3',
  'Market Design / Telecommunications': 'sil-teal-3',
  'Development Economics / Global Health': 'sil-red-1',
};
