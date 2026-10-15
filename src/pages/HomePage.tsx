import { Link } from 'react-router-dom';
import chaptersData from '../data/chapters.json';
import docsData from '../data/docs.json';
import type { Chapter, DocPage } from '../types';
import FadeIn from '../components/FadeIn';
import AnimatedCounter from '../components/AnimatedCounter';

const chapters = chaptersData as Chapter[];
const docs = docsData as DocPage[];

export default function HomePage() {
  const totalItems = chapters.reduce((sum, ch) => sum + ch.items.length, 0);

  return (
    <div>
      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-[#32adfe] via-blue-600 to-blue-700 bg-clip-text text-transparent mb-4 dark:from-[#30aefc] dark:via-[#30aefc] dark:to-[#30aefc]">
            高性价比人生指南
          </h1>
          <p className="text-slate-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
            {totalItems} 条建议，每条写明花掉什么、换回什么、证据有多硬。
            不用全做——挑走一两条就算数。
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#32adfe] dark:text-[#30aefc]">
                <AnimatedCounter end={chapters.length} />
              </div>
              <div className="text-slate-500 text-xs mt-1">个章节</div>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#32adfe] dark:text-[#30aefc]">
                <AnimatedCounter end={totalItems} />
              </div>
              <div className="text-slate-500 text-xs mt-1">条建议</div>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-neutral-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#32adfe] dark:text-[#30aefc]">
                <AnimatedCounter end={docs.length} />
              </div>
              <div className="text-slate-500 text-xs mt-1">篇附录</div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter, index) => (
          <FadeIn key={chapter.id} delay={Math.min(index * 40, 400)} direction="up">
            <Link
              to={`/chapter/${chapter.id}`}
              className="group block rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 transition-all duration-300 hover:border-[#32adfe]/50 dark:hover:border-[#30aefc]/50 hover:bg-[#32adfe]/5 dark:hover:bg-[#30aefc]/5 hover:shadow-lg hover:shadow-[#32adfe]/10"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-neutral-400 group-hover:bg-[#32adfe]/10 group-hover:text-[#32adfe] dark:group-hover:bg-[#30aefc]/10 dark:group-hover:text-[#30aefc] transition-colors">
                  {chapter.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-[#32adfe] dark:text-[#30aefc] group-hover:text-[#1a9ae8] dark:group-hover:text-[#30aefc] transition-colors truncate">
                    {chapter.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-neutral-500 mt-1 line-clamp-2">
                    {chapter.subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500 dark:text-neutral-600">{chapter.items.length} 条</span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={400}>
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-4">附录文档</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <Link
                key={doc.id}
                to={`/doc/${doc.id}`}
                className="group block rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 transition-all duration-300 hover:border-[#32adfe]/50 dark:hover:border-[#30aefc]/50 hover:bg-[#32adfe]/5 dark:hover:bg-[#30aefc]/5"
              >
                <h3 className="text-sm font-medium text-[#32adfe] dark:text-[#30aefc] group-hover:text-[#1a9ae8] dark:group-hover:text-[#30aefc] transition-colors">
                  {doc.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
