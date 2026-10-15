import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import ReadingProgressBar from './ReadingProgressBar';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <ReadingProgressBar />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-[#32adfe] hover:bg-blue-50/50 dark:text-neutral-400 dark:hover:text-[#30aefc] dark:hover:bg-neutral-900 transition-colors"
              aria-label="打开导航"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-sm font-medium text-[#32adfe] dark:text-[#30aefc] lg:text-base">
              高性价比人生指南
            </h1>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="w-9 lg:hidden" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-5xl mx-auto w-full">
          {children}
        </main>

        <footer className="border-t border-slate-200 dark:border-neutral-800 px-4 py-6 text-center">
          <p className="text-xs text-slate-600 dark:text-neutral-500">
            内容来源于《高性价比人生指南》，仅作可视化展示
          </p>
        </footer>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
