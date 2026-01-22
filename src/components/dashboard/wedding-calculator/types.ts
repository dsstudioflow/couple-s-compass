export type CalculatorMode = 'presets' | 'custom';

export type CostValues = Record<string, { 
  planned_amount: number; 
  actual_amount: number; 
  label: string 
}>;

export interface WeddingCost {
  category: string;
  planned_amount: number;
  actual_amount: number;
}

export interface WeddingCalculatorProps {
  data: {
    weddingCosts: WeddingCost[];
    saveAllWeddingCosts: (costs: WeddingCost[]) => Promise<boolean>;
  };
}

export const FIXED_CATEGORIES = [
  { key: "cerimonia", label: "Cerimônia" },
  { key: "festa", label: "Festa" },
  { key: "vestido_terno", label: "Vestido/Terno" },
  { key: "buffet", label: "Buffet" },
  { key: "decoracao", label: "Decoração" },
  { key: "fotografia", label: "Fotografia" },
];

export const FIXED_CATEGORY_KEYS = FIXED_CATEGORIES.map(c => c.key);

export const SCENARIOS = {
  economico: { cerimonia: 3000, festa: 15000, vestido_terno: 2000, buffet: 8000, decoracao: 3000, fotografia: 3000 },
  padrao: { cerimonia: 8000, festa: 40000, vestido_terno: 8000, buffet: 20000, decoracao: 8000, fotografia: 6000 },
  luxo: { cerimonia: 25000, festa: 120000, vestido_terno: 25000, buffet: 60000, decoracao: 25000, fotografia: 15000 },
};

export const MODE_STORAGE_KEY = 'wedding-calculator-mode';
