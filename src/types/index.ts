export type EvidenceLevel = 'A' | 'B' | 'C';

export type CostCategory = '换寿命' | '换钱' | '换时间精力' | '换人身自由';

export type ValueTier = '极高' | '高' | '一般';

export interface BookItem {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  cost: string;
  plainLanguage: string;
  benefit: string;
  evidenceLevel: EvidenceLevel;
  source: string;
  note?: string;
  costCategory: CostCategory;
  valueTier: ValueTier;
  timeCost: '少' | '中' | '多';
  moneyCost: '不花钱' | '少' | '多';
  effortRequired: boolean;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  items: BookItem[];
  costCategories: CostCategory[];
  relatedDocs?: string[];
}

export interface DocPage {
  id: string;
  title: string;
  sections: DocSection[];
}

export interface DocSection {
  title: string;
  content: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}
