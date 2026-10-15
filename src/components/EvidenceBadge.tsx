import type { EvidenceLevel } from '../types';

const levelConfig: Record<EvidenceLevel, { color: string; label: string; tooltip: string }> = {
  A: {
    color: 'bg-emerald-500/20 text-emerald-700 dark:text-[#30aefc] border-emerald-500/30',
    label: 'A',
    tooltip: 'A级：有具体数字可查，出处是荟萃分析、大型队列或随机对照试验',
  },
  B: {
    color: 'bg-amber-500/20 text-amber-700 dark:text-[#30aefc] border-[#30aefc]/30',
    label: 'B',
    tooltip: 'B级：有研究支持，但说不出确切数字；或只有小样本研究',
  },
  C: {
    color: 'bg-slate-500/20 text-slate-700 dark:text-neutral-500 border-slate-500/30',
    label: 'C',
    tooltip: 'C级：作者经验或公认做法，没有直接研究文献',
  },
};

interface EvidenceBadgeProps {
  level: EvidenceLevel;
  className?: string;
}

export default function EvidenceBadge({ level, className = '' }: EvidenceBadgeProps) {
  const config = levelConfig[level];

  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${config.color} ${className}`}
      title={config.tooltip}
      role="img"
      aria-label={config.tooltip}
    >
      {config.label}
    </span>
  );
}
