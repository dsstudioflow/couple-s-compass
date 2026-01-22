import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  CalculatorMode,
  CostValues,
  WeddingCost,
  FIXED_CATEGORIES,
  FIXED_CATEGORY_KEYS,
  SCENARIOS,
  MODE_STORAGE_KEY,
} from "./types";

interface UseWeddingCalculatorProps {
  weddingCosts: WeddingCost[];
  saveAllWeddingCosts: (costs: WeddingCost[]) => Promise<boolean>;
}

export function useWeddingCalculator({ weddingCosts, saveAllWeddingCosts }: UseWeddingCalculatorProps) {
  const { toast } = useToast();
  
  // Load mode from localStorage
  const [mode, setMode] = useState<CalculatorMode>(() => {
    const saved = localStorage.getItem(MODE_STORAGE_KEY);
    return (saved === 'custom' || saved === 'presets') ? saved : 'presets';
  });
  
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [localCosts, setLocalCosts] = useState<CostValues>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [mode]);

  const initializeFromProps = useCallback(() => {
    const aggregated: CostValues = {};
    const order: string[] = [];
    
    if (mode === 'presets') {
      // In presets mode, start with fixed categories
      FIXED_CATEGORIES.forEach(cat => {
        const matchingCosts = weddingCosts.filter(c => c.category === cat.key);
        if (matchingCosts.length > 0) {
          const latest = matchingCosts[matchingCosts.length - 1];
          aggregated[cat.key] = {
            planned_amount: latest.planned_amount || 0,
            actual_amount: latest.actual_amount || 0,
            label: cat.label,
          };
        } else {
          aggregated[cat.key] = { planned_amount: 0, actual_amount: 0, label: cat.label };
        }
        order.push(cat.key);
      });

      // Add custom categories
      weddingCosts.forEach(cost => {
        if (!FIXED_CATEGORY_KEYS.includes(cost.category) && !aggregated[cost.category]) {
          aggregated[cost.category] = {
            planned_amount: cost.planned_amount || 0,
            actual_amount: cost.actual_amount || 0,
            label: cost.category,
          };
          order.push(cost.category);
        }
      });
    } else {
      // In custom mode, only load saved custom categories (no fixed categories)
      weddingCosts.forEach(cost => {
        if (!aggregated[cost.category]) {
          aggregated[cost.category] = {
            planned_amount: cost.planned_amount || 0,
            actual_amount: cost.actual_amount || 0,
            label: cost.category,
          };
          order.push(cost.category);
        }
      });
    }

    setLocalCosts(aggregated);
    setCategoryOrder(order);
    setHasChanges(false);
  }, [weddingCosts, mode]);

  useEffect(() => {
    initializeFromProps();
  }, [initializeFromProps]);

  const handleModeChange = (newMode: CalculatorMode) => {
    if (hasChanges) {
      toast({
        title: "Alterações não salvas",
        description: "Salve suas alterações antes de trocar de modo.",
        variant: "destructive",
      });
      return;
    }
    setMode(newMode);
    setActiveScenario(null);
  };

  const handleInputChange = (category: string, field: "planned_amount" | "actual_amount", value: number) => {
    setLocalCosts(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleScenario = (scenario: keyof typeof SCENARIOS) => {
    if (mode !== 'presets') return;
    
    setActiveScenario(scenario);
    const values = SCENARIOS[scenario];
    setLocalCosts(prev => {
      const newCosts: CostValues = {};
      FIXED_CATEGORIES.forEach(cat => {
        newCosts[cat.key] = {
          planned_amount: values[cat.key as keyof typeof values] || 0,
          actual_amount: prev[cat.key]?.actual_amount || 0,
          label: cat.label,
        };
      });
      Object.entries(prev).forEach(([key, val]) => {
        if (!FIXED_CATEGORY_KEYS.includes(key)) {
          newCosts[key] = val;
        }
      });
      return newCosts;
    });
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    
    const key = trimmed;
    const existingKey = Object.keys(localCosts).find(
      k => k.toLowerCase() === key.toLowerCase()
    );
    
    if (existingKey) {
      toast({
        title: "Categoria já existe",
        description: "Já existe uma categoria com esse nome.",
        variant: "destructive",
      });
      return;
    }

    setLocalCosts(prev => ({
      ...prev,
      [key]: { planned_amount: 0, actual_amount: 0, label: trimmed },
    }));
    setCategoryOrder(prev => [...prev, key]);
    setNewCategoryName("");
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleRemoveCategory = (key: string) => {
    // In presets mode, don't allow removing fixed categories
    if (mode === 'presets' && FIXED_CATEGORY_KEYS.includes(key)) return;
    
    setLocalCosts(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setCategoryOrder(prev => prev.filter(k => k !== key));
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleMoveCategory = (key: string, direction: "up" | "down") => {
    setCategoryOrder(prev => {
      const index = prev.indexOf(key);
      if (index === -1) return prev;
      
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newOrder = [...prev];
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
      return newOrder;
    });
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const costsToSave = categoryOrder.map(key => ({
        category: key,
        planned_amount: localCosts[key]?.planned_amount || 0,
        actual_amount: localCosts[key]?.actual_amount || 0,
      }));

      const success = await saveAllWeddingCosts(costsToSave);
      if (success) {
        setHasChanges(false);
        setJustSaved(true);
        toast({
          title: "Salvo!",
          description: "Custos do casamento atualizados com sucesso.",
        });
        setTimeout(() => setJustSaved(false), 2000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const orderedCategories = categoryOrder
    .filter(key => localCosts[key])
    .map(key => ({ key, ...localCosts[key] }));

  const totalPlanned = Object.values(localCosts).reduce((sum, c) => sum + (c.planned_amount || 0), 0);
  const totalActual = Object.values(localCosts).reduce((sum, c) => sum + (c.actual_amount || 0), 0);

  const isFixedCategory = (key: string) => mode === 'presets' && FIXED_CATEGORY_KEYS.includes(key);

  return {
    mode,
    activeScenario,
    localCosts,
    categoryOrder,
    hasChanges,
    isSaving,
    justSaved,
    newCategoryName,
    orderedCategories,
    totalPlanned,
    totalActual,
    setNewCategoryName,
    handleModeChange,
    handleInputChange,
    handleScenario,
    handleAddCategory,
    handleRemoveCategory,
    handleMoveCategory,
    handleSave,
    isFixedCategory,
  };
}
