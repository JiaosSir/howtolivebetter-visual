import { useEffect, useState } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import docsData from '../data/docs.json';
import type { DocPage as DocPageType } from '../types';
import FadeIn from '../components/FadeIn';
import KeywordText from '../components/KeywordText';

const docs = docsData as DocPageType[];

export default function DocPage() {
  const { docId } = useParams<{ docId: string }>();
  const { hash, state, key: locationKey } = useLocation();
  const doc = docs.find((d) => d.id === docId);
  const anchorId = hash.replace(/^#/, '');
  const searchTerms = (state as { searchTerms?: string[] } | null)?.searchTerms;
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (!anchorId) {
      setHighlightedId(null);
      return;
    }

    let cancelled = false;

    const scrollTimer = window.setTimeout(() => {
      if (cancelled) return;
      const target = document.getElementById(anchorId);
      if (!target) return;

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

  if (!doc) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#32adfe]/10 dark:bg-[#30aefc]/10 border border-[#32adfe]/20 dark:border-[#30aefc]/20 text-[#32adfe] dark:text-[#30aefc] text-xs font-medium mb-4">
            附录文档
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#32adfe] dark:text-[#30aefc]">{doc.title}</h1>
        </div>
      </FadeIn>

      <div className="space-y-8">
        {doc.sections.map((section, index) => (
          <FadeIn key={index} delay={Math.min(index * 80, 400)} direction="up">
            <section
              id={`doc-${doc.id}-s${index}`}
              className={`rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 transition-shadow duration-300 scroll-mt-24 ${
                highlightedId === `doc-${doc.id}-s${index}`
                  ? 'ring-2 ring-[#32adfe]/60 dark:ring-[#30aefc]/60 shadow-lg shadow-[#32adfe]/10 dark:shadow-[#30aefc]/10'
                  : ''
              }`}
            >
              <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-3">
                <KeywordText
                  text={section.title}
                  terms={highlightedId === `doc-${doc.id}-s${index}` ? searchTerms : undefined}
                />
              </h2>
              <div className="text-slate-700 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                <KeywordText
                  text={section.content}
                  terms={highlightedId === `doc-${doc.id}-s${index}` ? searchTerms : undefined}
                />
              </div>
            </section>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
