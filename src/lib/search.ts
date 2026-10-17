import chaptersData from '../data/chapters.json';
import docsData from '../data/docs.json';
import type { Chapter, DocPage } from '../types';

export type SearchResultKind = 'chapter' | 'item' | 'docSection';

export interface SearchResult {
  id: string;
  kind: SearchResultKind;
  title: string;
  context: string;
  snippet: string;
  path: string;
}

interface SearchField {
  text: string;
  weight: number;
}

interface SearchEntry {
  id: string;
  kind: SearchResultKind;
  title: string;
  context: string;
  snippetFields: string[];
  fields: SearchField[];
  path: string;
}

export interface HighlightPart {
  text: string;
  match: boolean;
}

const chapters = chaptersData as Chapter[];
const docs = docsData as DocPage[];

export const searchStats = {
  chapters: chapters.length,
  items: chapters.reduce((sum, chapter) => sum + chapter.items.length, 0),
  docs: docs.length,
  docSections: docs.reduce((sum, doc) => sum + doc.sections.length, 0),
};

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const chapter of chapters) {
    entries.push({
      id: `chapter-${chapter.id}`,
      kind: 'chapter',
      title: chapter.title,
      context: `第 ${chapter.number} 章`,
      snippetFields: [chapter.subtitle, chapter.description].filter(Boolean),
      fields: [
        { text: chapter.title, weight: 8 },
        { text: chapter.subtitle, weight: 3 },
        { text: chapter.description, weight: 2 },
      ],
      path: `/chapter/${chapter.id}`,
    });

    for (const item of chapter.items) {
      const plainLanguage = item.plainLanguage ?? '';
      const benefit = item.benefit ?? '';
      const cost = item.cost ?? '';
      const note = item.note ?? '';
      const source = item.source ?? '';

      entries.push({
        id: `item-${item.id}`,
        kind: 'item',
        title: item.title,
        context: `第 ${chapter.number} 章 · ${chapter.title} · 第 ${item.number} 条`,
        snippetFields: [plainLanguage, benefit, cost, note, source],
        fields: [
          { text: item.title, weight: 8 },
          { text: plainLanguage, weight: 4 },
          { text: benefit, weight: 3 },
          { text: cost, weight: 2 },
          { text: note, weight: 2 },
          { text: source, weight: 1 },
        ],
        path: `/chapter/${chapter.id}#item-${item.id}`,
      });
    }
  }

  for (const doc of docs) {
    doc.sections.forEach((section, index) => {
      entries.push({
        id: `doc-${doc.id}-s${index}`,
        kind: 'docSection',
        title: section.title,
        context: doc.title,
        snippetFields: [section.content],
        fields: [
          { text: section.title, weight: 7 },
          { text: section.content, weight: 3 },
          { text: doc.title, weight: 2 },
        ],
        path: `/doc/${doc.id}#doc-${doc.id}-s${index}`,
      });
    });
  }

  return entries;
}

let indexCache: SearchEntry[] | null = null;

function getIndex(): SearchEntry[] {
  if (!indexCache) indexCache = buildIndex();
  return indexCache;
}

export function tokenizeQuery(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function countOccurrences(text: string, term: string, max = 3): number {
  let count = 0;
  let position = 0;
  while (count < max) {
    position = text.indexOf(term, position);
    if (position === -1) break;
    count += 1;
    position += term.length;
  }
  return count;
}

function scoreEntry(entry: SearchEntry, terms: string[], query: string): number | null {
  let score = 0;

  for (const term of terms) {
    let matched = false;

    for (const field of entry.fields) {
      const text = field.text.toLowerCase();
      const index = text.indexOf(term);
      if (index === -1) continue;

      matched = true;
      let termScore = field.weight;
      if (index === 0) termScore += field.weight * 0.6;
      termScore += (countOccurrences(text, term) - 1) * field.weight * 0.3;
      score += termScore;
    }

    if (!matched) return null;
  }

  const title = entry.title.toLowerCase();
  if (!query.includes(' ') && title.includes(query)) score += 15;
  if (title === query) score += 30;
  for (const term of terms) {
    if (title.startsWith(term)) score += 5;
  }

  return score;
}

function makeSnippet(entry: SearchEntry, terms: string[], maxLength = 110): string {
  const source =
    entry.snippetFields.find((text) => terms.some((term) => text.toLowerCase().includes(term))) ??
    entry.snippetFields[0] ??
    '';
  const clean = source.replace(/\s+/g, ' ').trim();
  if (!clean) return '';

  let matchIndex = -1;
  for (const term of terms) {
    const index = clean.toLowerCase().indexOf(term);
    if (index !== -1 && (matchIndex === -1 || index < matchIndex)) matchIndex = index;
  }

  if (matchIndex === -1) {
    return clean.length > maxLength ? `${clean.slice(0, maxLength)}…` : clean;
  }

  let start = Math.max(0, matchIndex - 28);
  let end = Math.min(clean.length, start + maxLength);
  if (end - start < maxLength) start = Math.max(0, end - maxLength);

  return `${start > 0 ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`;
}

export function searchContent(rawQuery: string, limit = 30): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const terms = tokenizeQuery(query);
  if (terms.length === 0) return [];

  const matches: { entry: SearchEntry; score: number }[] = [];

  for (const entry of getIndex()) {
    const score = scoreEntry(entry, terms, query);
    if (score !== null) matches.push({ entry, score });
  }

  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.entry.title.length !== b.entry.title.length) {
      return a.entry.title.length - b.entry.title.length;
    }
    return a.entry.title.localeCompare(b.entry.title);
  });

  return matches.slice(0, limit).map(({ entry }) => ({
    id: entry.id,
    kind: entry.kind,
    title: entry.title,
    context: entry.context,
    snippet: makeSnippet(entry, terms),
    path: entry.path,
  }));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightParts(text: string, terms: string[]): HighlightPart[] {
  if (!text) return [];

  const validTerms = [...new Set(terms.filter(Boolean))].sort((a, b) => b.length - a.length);
  if (validTerms.length === 0) return [{ text, match: false }];

  const pattern = new RegExp(`(${validTerms.map(escapeRegExp).join('|')})`, 'gi');
  const lowered = new Set(validTerms.map((term) => term.toLowerCase()));

  return text
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, match: lowered.has(part.toLowerCase()) }));
}
