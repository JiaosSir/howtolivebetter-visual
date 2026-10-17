import { useState, useMemo, useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import chaptersData from '../data/chapters.json';
import type { Chapter, EvidenceLevel } from '../types';
import ItemCard from '../components/ItemCard';
import FadeIn from '../components/FadeIn';
import ChapterFilter from '../components/ChapterFilter';

type FilterValue = 'all' | EvidenceLevel;

const chapters = chaptersData as Chapter[];

export default function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const { hash, state, key: locationKey } = useLocation();
  const chapter = chapters.find((ch) => ch.id === chapterId);
  const [filter, setFilter] = useState<FilterValue>('all');
  const anchorId = hash.replace(/^#/, '');
  const searchTerms = (state as { searchTerms?: string[] } | null)?.searchTerms;
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (!anchorId) {
      setHighlightedId(null);
      return;
    }

    setFilter('all');
    let cancelled = false;

    const scrollTimer = window.setTimeout(() => {
      if (cancelled) return;
      const target = document.getElementById(anchorId);
      if (!target) return;

      // Expanding the matched card changes layout, so scroll on the next frame.
      setHighlightedId(anchorId);
      window.requestAnimationFrame(() => {
        if (cancelled) return;
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
    }, 120);

    const clearTimer = window.setTimeout(() => {
      if (!cancelled) setHighlightedId(null);
    }, 2800);

    return () => {
      cancelled = true;
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [anchorId, locationKey]);

  if (!chapter) {
    return <Navigate to="/" replace />;
  }

  const chapterIndex = chapters.findIndex((ch) => ch.id === chapterId);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const evidenceCounts = chapter.items.reduce(
    (acc, item) => {
      acc[item.evidenceLevel] = (acc[item.evidenceLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filteredItems = useMemo(
    () =>
      filter === 'all'
        ? chapter.items
        : chapter.items.filter((item) => item.evidenceLevel === filter),
    [chapter.items, filter],
  );

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl font-bold text-[#32adfe]/30 dark:text-[#30aefc]/30">
              {chapter.number}
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#32adfe] dark:text-[#30aefc]">
              {chapter.title}
            </h1>
          </div>
          {chapter.subtitle && (
            <p className="text-slate-600 dark:text-neutral-400 text-sm mt-2">{chapter.subtitle}</p>
          )}

          <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
            <span className="text-sm text-slate-600 dark:text-neutral-500">
              {filteredItems.length} / {chapter.items.length} 条建议
            </span>
            <ChapterFilter
              activeFilter={filter}
              onFilterChange={setFilter}
              evidenceCounts={evidenceCounts}
            />
          </div>
        </div>
      </FadeIn>

      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <FadeIn
            key={item.id}
            delay={Math.min(index * 50, 300)}
            direction="up"
          >
            <ItemCard
              item={item}
              highlighted={highlightedId === `item-${item.id}`}
              searchTerms={highlightedId === `item-${item.id}` ? searchTerms : undefined}
            />
          </FadeIn>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-600 dark:text-neutral-500">
          该章节没有 {filter} 级证据的建议
        </div>
      )}

      <FadeIn delay={200}>
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-200 dark:border-neutral-800">
          {prevChapter ? (
            <Link
              to={`/chapter/${prevChapter.id}`}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-neutral-400 hover:text-[#32adfe] dark:hover:text-[#30aefc] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>
                {prevChapter.number}. {prevChapter.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextChapter ? (
            <Link
              to={`/chapter/${nextChapter.id}`}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-neutral-400 hover:text-[#32adfe] dark:hover:text-[#30aefc] transition-colors"
            >
              <span>
                {nextChapter.number}. {nextChapter.title}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </FadeIn>
    </div>
  );
}
