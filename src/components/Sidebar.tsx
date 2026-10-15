import { NavLink } from 'react-router-dom';
import chaptersData from '../data/chapters.json';
import docsData from '../data/docs.json';
import type { Chapter, DocPage } from '../types';

const chapters = chaptersData as Chapter[];
const docs = docsData as DocPage[];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-800 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#32adfe] to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">指</span>
            </div>
            <span className="text-sm font-semibold text-[#32adfe] dark:text-[#30aefc]">人生指南</span>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-[#32adfe] hover:bg-blue-50/50 dark:text-neutral-400 dark:hover:text-[#30aefc] dark:hover:bg-neutral-900 transition-colors"
            aria-label="关闭导航"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2">
        <div className="space-y-0.5">
          <NavLink
            to="/preface"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#32adfe]/10 dark:bg-[#30aefc]/10 text-[#32adfe] dark:text-[#30aefc] border border-[#32adfe]/20 dark:border-[#30aefc]/20'
                  : 'text-slate-700 dark:text-neutral-400 hover:text-[#32adfe] dark:hover:text-[#30aefc] hover:bg-blue-50/50 dark:hover:bg-neutral-900'
              }`
            }
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-neutral-500">
              序
            </span>
            <span className="truncate">前言与阅读指南</span>
          </NavLink>

          <div className="pt-2 pb-1">
            <p className="px-3 text-xs text-slate-500 dark:text-neutral-600">章节</p>
          </div>

          {chapters.map((chapter) => (
            <NavLink
              key={chapter.id}
              to={`/chapter/${chapter.id}`}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#32adfe]/10 dark:bg-[#30aefc]/10 text-[#32adfe] dark:text-[#30aefc] border border-[#32adfe]/20 dark:border-[#30aefc]/20'
                    : 'text-slate-700 dark:text-neutral-400 hover:text-[#32adfe] dark:hover:text-[#30aefc] hover:bg-blue-50/50 dark:hover:bg-neutral-900'
                }`
              }
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-neutral-500">
                {chapter.number}
              </span>
              <span className="truncate">{chapter.title}</span>
              <span className="ml-auto text-xs text-slate-500 dark:text-neutral-600">{chapter.items.length}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-neutral-800">
          <p className="px-3 text-xs text-slate-500 dark:text-neutral-600 mb-2">附录文档</p>
          <div className="space-y-0.5">
            {docs.map((doc, i) => (
              <NavLink
                key={doc.id}
                to={`/doc/${doc.id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#32adfe]/10 dark:bg-[#30aefc]/10 text-[#32adfe] dark:text-[#30aefc] border border-[#32adfe]/20 dark:border-[#30aefc]/20'
                      : 'text-slate-700 dark:text-neutral-400 hover:text-[#32adfe] dark:hover:text-[#30aefc] hover:bg-blue-50/50 dark:hover:bg-neutral-900'
                  }`
                }
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-neutral-500">
                  D{i + 1}
                </span>
                <span className="truncate">{doc.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
