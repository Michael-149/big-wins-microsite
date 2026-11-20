// Figures derived from content, so no page types a number by hand.
import type { Page } from './types';

/** The long-list size from the method page's glance figures ("67 candidates on the long list"). */
export function candidateCount(method?: Page): string | undefined {
  const glance = method?.data.glance;
  if (!Array.isArray(glance)) return undefined;
  const hit = glance.find((g) => typeof g?.label === 'string' && /candidate/i.test(g.label));
  return hit && typeof hit.value === 'string' ? hit.value : undefined;
}
