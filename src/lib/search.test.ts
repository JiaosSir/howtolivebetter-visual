import { describe, it, expect } from 'vitest';
import { searchContent, highlightParts, tokenizeQuery, searchStats } from './search';

describe('searchContent', () => {
  it('finds suggestion items by keyword', () => {
    const results = searchContent('安全带');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].path).toBe('/chapter/ch01#item-ch01-1');
    expect(results[0].kind).toBe('item');
  });

  it('supports multiple keywords separated by spaces', () => {
    const results = searchContent('安全带 后排');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].path).toBe('/chapter/ch01#item-ch01-1');
  });

  it('finds appendix doc sections', () => {
    const results = searchContent('彩礼');
    expect(results.some((result) => result.kind === 'docSection')).toBe(true);
  });

  it('finds chapter entries', () => {
    const results = searchContent('不要早死');
    expect(results.some((result) => result.kind === 'chapter')).toBe(true);
  });

  it('matches latin keywords case-insensitively', () => {
    const lower = searchContent('nhtsa');
    const upper = searchContent('NHTSA');
    expect(lower.length).toBeGreaterThan(0);
    expect(upper.map((result) => result.id)).toEqual(lower.map((result) => result.id));
  });

  it('returns snippets containing the keyword', () => {
    const results = searchContent('安全带');
    expect(results[0].snippet.length).toBeGreaterThan(0);
    expect(results[0].snippet).toContain('安全带');
  });

  it('returns no results for unknown keywords', () => {
    expect(searchContent('这是一串不存在的关键词xyz')).toEqual([]);
  });

  it('returns no results for blank queries', () => {
    expect(searchContent('   ')).toEqual([]);
  });

  it('respects the result limit', () => {
    const results = searchContent('人', 5);
    expect(results).toHaveLength(5);
  });
});

describe('tokenizeQuery', () => {
  it('splits on whitespace and lowercases', () => {
    expect(tokenizeQuery('  NHTSA  安全带 ')).toEqual(['nhtsa', '安全带']);
  });

  it('returns an empty array for blank input', () => {
    expect(tokenizeQuery('   ')).toEqual([]);
  });
});

describe('highlightParts', () => {
  it('marks every occurrence of the terms', () => {
    const parts = highlightParts('系安全带，前排后排都系', ['安全带', '后排']);
    expect(parts.filter((part) => part.match).map((part) => part.text)).toEqual(['安全带', '后排']);
    expect(parts.map((part) => part.text).join('')).toBe('系安全带，前排后排都系');
  });

  it('matches case-insensitively', () => {
    const parts = highlightParts('NHTSA data', ['nhtsa']);
    expect(parts[0]).toEqual({ text: 'NHTSA', match: true });
  });

  it('escapes regex characters in terms', () => {
    const parts = highlightParts('a+b', ['a+b']);
    expect(parts).toEqual([{ text: 'a+b', match: true }]);
  });
});

describe('searchStats', () => {
  it('counts indexed content', () => {
    expect(searchStats.chapters).toBe(34);
    expect(searchStats.docs).toBe(9);
    expect(searchStats.items).toBeGreaterThan(0);
    expect(searchStats.docSections).toBeGreaterThan(0);
  });
});
