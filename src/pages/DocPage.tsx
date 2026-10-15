import { useParams, Navigate } from 'react-router-dom';
import docsData from '../data/docs.json';
import type { DocPage as DocPageType } from '../types';
import FadeIn from '../components/FadeIn';

const docs = docsData as DocPageType[];

export default function DocPage() {
  const { docId } = useParams<{ docId: string }>();
  const doc = docs.find((d) => d.id === docId);

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
            <section className="rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
              <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-3">{section.title}</h2>
              <div className="text-slate-700 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
