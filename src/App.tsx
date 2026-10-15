import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './components/ThemeContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChapterPage = lazy(() => import('./pages/ChapterPage'));
const DocPage = lazy(() => import('./pages/DocPage'));
const PrefacePage = lazy(() => import('./pages/PrefacePage'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-500">加载中...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/preface" element={<PrefacePage />} />
              <Route path="/chapter/:chapterId" element={<ChapterPage />} />
              <Route path="/doc/:docId" element={<DocPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}
