import type { EvidenceLevel } from '../types';

type FilterValue = 'all' | EvidenceLevel;

interface ChapterFilterProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  evidenceCounts: Record<string, number>;
}

const levels: { value: FilterValue; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'A', label: 'A 级' },
  { value: 'B', label: 'B 级' },
  { value: 'C', label: 'C 级' },
];

export default function ChapterFilter({
  activeFilter,
  onFilterChange,
  evidenceCounts,
}: ChapterFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {levels.map(({ value, label }) => {
        if (value !== 'all' && !evidenceCounts[value]) return null;
        const isActive = activeFilter === value;
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-[#32adfe]/20 dark:bg-[#30aefc]/20 text-[#32adfe] dark:text-[#30aefc] border border-[#32adfe]/30 dark:border-[#30aefc]/30'
                : 'bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 hover:border-[#32adfe]/50 dark:hover:border-[#30aefc]/50 hover:text-[#32adfe] dark:hover:text-[#30aefc]'
            }`}
          >
            <span>{label}</span>
            {value !== 'all' && evidenceCounts[value] && (
              <span className="text-slate-500 dark:text-neutral-600">{evidenceCounts[value]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
