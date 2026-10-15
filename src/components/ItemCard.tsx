import { useState } from 'react';
import type { BookItem } from '../types';
import EvidenceBadge from './EvidenceBadge';

interface ItemCardProps {
  item: BookItem;
  className?: string;
}

export default function ItemCard({ item, className = '' }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`group relative rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 backdrop-blur-sm p-5 transition-all duration-300 md:hover:border-[#32adfe] md:dark:hover:border-[#30aefc]/70 md:hover:bg-[#32adfe]/5 md:dark:hover:bg-neutral-800 md:hover:shadow-lg md:hover:shadow-[#32adfe]/5 active:bg-transparent ${className}`}
      data-testid={`item-card-${item.id}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-slate-400 dark:text-neutral-600 group-hover:text-[#32adfe] dark:group-hover:text-[#30aefc] transition-colors">
            {item.number}
          </span>
          <EvidenceBadge level={item.evidenceLevel} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[#32adfe] dark:text-[#30aefc] mb-2 leading-snug">
            {item.title}
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-black dark:text-[#30aefc] uppercase tracking-wider">说人话</span>
              <p className="text-slate-700 dark:text-neutral-300 text-sm mt-1 leading-relaxed">{item.plainLanguage}</p>
            </div>

            <div>
              <span className="text-xs font-medium text-black dark:text-[#30aefc] uppercase tracking-wider">成本</span>
              <p className="text-slate-600 dark:text-neutral-400 text-sm mt-1">{item.cost}</p>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-slate-500 hover:text-[#32adfe] dark:hover:text-[#30aefc] transition-colors flex items-center gap-1"
              aria-expanded={expanded}
            >
              <span>{expanded ? '收起详情' : '查看详情'}</span>
              <svg
                className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-neutral-800 animate-fadeIn">
                <div>
                  <span className="text-xs font-medium text-black dark:text-[#30aefc] uppercase tracking-wider">收益</span>
                  <p className="text-slate-600 dark:text-neutral-400 text-sm mt-1 leading-relaxed">{item.benefit}</p>
                </div>

                <div>
                  <span className="text-xs font-medium text-black dark:text-[#30aefc] uppercase tracking-wider">来源</span>
                  <p className="text-slate-500 dark:text-neutral-500 text-xs mt-1 leading-relaxed break-all">{item.source}</p>
                </div>

                {item.note && (
                  <div>
                    <span className="text-xs font-medium text-black dark:text-[#30aefc] uppercase tracking-wider">备注</span>
                    <p className="text-slate-600 dark:text-neutral-400 text-sm mt-1 leading-relaxed">{item.note}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
