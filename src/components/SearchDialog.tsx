import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@base-ui/react/dialog';
import { Search } from 'lucide-react';
import {
  highlightParts,
  searchContent,
  searchStats,
  tokenizeQuery,
  type SearchResultKind,
} from '../lib/search';

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

const SUGGESTIONS = ['安全带', '睡眠', '运动', '吸烟', '体检', '彩礼'];

const KIND_LABELS: Record<SearchResultKind, string> = {
  chapter: '章节',
  item: '建议',
  docSection: '附录',
};

const KIND_STYLES: Record<SearchResultKind, string> = {
  chapter: 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400',
  item: 'bg-[#32adfe]/10 text-[#32adfe] dark:bg-[#30aefc]/10 dark:text-[#30aefc]',
  docSection: 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400',
};

function HighlightedText({ text, terms }: { text: string; terms: string[] }) {
  const parts = useMemo(() => highlightParts(text, terms), [text, terms]);

  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={index}
            className="rounded-[3px] bg-[#32adfe]/15 px-0.5 font-medium text-[#32adfe] dark:bg-[#30aefc]/20 dark:text-[#30aefc]"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef<HTMLUListElement>(null);

  const terms = useMemo(() => tokenizeQuery(query), [query]);
  const results = useMemo(() => searchContent(query), [query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const option = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    option?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, results]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }

  function goToResult(path: string) {
    setOpen(false);
    navigate(path, { state: { searchTerms: terms } });
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      const result = results[activeIndex];
      if (result) {
        event.preventDefault();
        goToResult(result.path);
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:border-[#32adfe]/50 hover:text-[#32adfe] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-[#30aefc]/50 dark:hover:text-[#30aefc]"
        aria-label="搜索内容"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">搜索</span>
        <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500 md:inline">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-sm dark:bg-black/60" />
        <Dialog.Popup className="fixed left-1/2 top-[10vh] z-[61] w-[min(44rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/50">
          <Dialog.Title className="sr-only">搜索全书内容</Dialog.Title>

          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-neutral-800">
            <Search className="h-5 w-5 shrink-0 text-slate-400 dark:text-neutral-500" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="搜索建议、章节或附录文档…"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-autocomplete="list"
              aria-activedescendant={
                results[activeIndex] ? `search-option-${activeIndex}` : undefined
              }
              className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-neutral-600"
            />
            <Dialog.Close className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 transition-colors hover:border-[#32adfe]/50 hover:text-[#32adfe] dark:border-neutral-700 dark:text-neutral-500 dark:hover:border-[#30aefc]/50 dark:hover:text-[#30aefc]">
              Esc
            </Dialog.Close>
          </div>

          <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
            {query.trim() === '' ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-slate-500 dark:text-neutral-500">
                  输入关键词，在 {searchStats.items} 条建议与 {searchStats.docSections} 个附录段落中搜索
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-[#32adfe]/50 hover:text-[#32adfe] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-[#30aefc]/50 dark:hover:text-[#30aefc]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-slate-600 dark:text-neutral-400">
                  没有找到与「{query.trim()}」相关的内容
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-neutral-600">
                  试试更短的关键词，或用空格分隔多个关键词
                </p>
              </div>
            ) : (
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-slate-400 dark:text-neutral-600">
                  找到 {results.length} 条结果
                </p>
                <ul id="search-results" role="listbox" ref={listRef}>
                  {results.map((result, index) => (
                    <li
                      key={result.id}
                      id={`search-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      data-index={index}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <button
                        type="button"
                        onClick={() => goToResult(result.path)}
                        className={`w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                          index === activeIndex
                            ? 'bg-[#32adfe]/10 dark:bg-[#30aefc]/10'
                            : 'hover:bg-slate-50 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-500">
                          <span className="truncate">{result.context}</span>
                          <span
                            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${KIND_STYLES[result.kind]}`}
                          >
                            {KIND_LABELS[result.kind]}
                          </span>
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                          <HighlightedText text={result.title} terms={terms} />
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-neutral-400">
                          <HighlightedText text={result.snippet} terms={terms} />
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-2 text-[11px] text-slate-400 dark:border-neutral-800 dark:text-neutral-600">
            <span>↑↓ 选择</span>
            <span>↵ 跳转</span>
            <span>Esc 关闭</span>
            <span className="ml-auto">模糊匹配 · 全书搜索</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
