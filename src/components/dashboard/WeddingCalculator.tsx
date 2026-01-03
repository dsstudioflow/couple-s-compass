import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Save, Check, Plus, X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FIXED_CATEGORIES = [
  { key: "cerimonia", label: "Cerimônia" },
  { key: "festa", label: "Festa" },
  { key: "vestido_terno", label: "Vestido/Terno" },
  { key: "buffet", label: "Buffet" },
  { key: "decoracao", label: "Decoração" },
  { key: "fotografia", label: "Fotografia" },
];

const FIXED_CATEGORY_KEYS = FIXED_CATEGORIES.map(c => c.key);

const SCENARIOS = {
  economico: { cerimonia: 3000, festa: 15000, vestido_terno: 2000, buffet: 8000, decoracao: 3000, fotografia: 3000 },
  padrao: { cerimonia: 8000, festa: 40000, vestido_terno: 8000, buffet: 20000, decoracao: 8000, fotografia: 6000 },
  luxo: { cerimonia: 25000, festa: 120000, vestido_terno: 25000, buffet: 60000, decoracao: 25000, fotografia: 15000 },
};

type CostValues = Record<string, { planned_amount: number; actual_amount: number; label: string }>;

interface WeddingCalculatorProps {
  data: {
    weddingCosts: { category: string; planned_amount: number; actual_amount: number }[];
    saveAllWeddingCosts: (costs: { category: string; planned_amount: number; actual_amount: number }[]) => Promise<boolean>;
  };
}

export function WeddingCalculator({ data }: WeddingCalculatorProps) {
  const { weddingCosts, saveAllWeddingCosts } = data;
  const { toast } = useToast();
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [localCosts, setLocalCosts] = useState<CostValues>({});
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Initialize local state from props - aggregate by category
  const initializeFromProps = useCallback(() => {
    const aggregated: CostValues = {};
    const order: string[] = [];
    
    // Initialize fixed categories first
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

    // Initialize custom categories from existing data
    weddingCosts.forEach(cost => {
      if (!FIXED_CATEGORY_KEYS.includes(cost.category) && !aggregated[cost.category]) {
        aggregated[cost.category] = {
          planned_amount: cost.planned_amount || 0,
          actual_amount: cost.actual_amount || 0,
          label: cost.category, // Custom categories use the key as the display label
        };
        order.push(cost.category);
      }
    });

    setLocalCosts(aggregated);
    setCategoryOrder(order);
    setHasChanges(false);
  }, [weddingCosts]);

  useEffect(() => {
    initializeFromProps();
  }, [initializeFromProps]);

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
    setActiveScenario(scenario);
    const values = SCENARIOS[scenario];
    setLocalCosts(prev => {
      const newCosts: CostValues = {};
      // Apply scenario only to fixed categories
      FIXED_CATEGORIES.forEach(cat => {
        newCosts[cat.key] = {
          planned_amount: values[cat.key as keyof typeof values] || 0,
          actual_amount: prev[cat.key]?.actual_amount || 0,
          label: cat.label,
        };
      });
      // Keep custom categories as-is
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
    
    // Use the original name as the key (preserving case and spaces)
    const key = trimmed;
    
    // Check if category already exists (case-insensitive)
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
    if (FIXED_CATEGORY_KEYS.includes(key)) return;
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
      // Save in the order defined by categoryOrder
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

  const totalPlanned = Object.values(localCosts).reduce((sum, c) => sum + (c.planned_amount || 0), 0);
  const totalActual = Object.values(localCosts).reduce((sum, c) => sum + (c.actual_amount || 0), 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  // Get ordered categories for rendering
  const orderedCategories = categoryOrder
    .filter(key => localCosts[key])
    .map(key => ({ key, ...localCosts[key] }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Calculadora de Casamento
        </CardTitle>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={justSaved ? "bg-emerald-600 hover:bg-emerald-600" : ""}
        >
          {justSaved ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Salvo
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? "Salvando..." : "Salvar"}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(["economico", "padrao", "luxo"] as const).map((scenario) => (
            <Button
              key={scenario}
              variant={activeScenario === scenario ? "default" : "outline"}
              size="sm"
              onClick={() => handleScenario(scenario)}
            >
              {scenario === "economico" ? "Econômico" : scenario === "padrao" ? "Padrão" : "Luxo"}
            </Button>
          ))}
        </div>
        
        {/* Categories */}
        <div className="space-y-3">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground">
            <span className="w-12"></span>
            <span>Categoria</span>
            <span>Planejado</span>
            <span>Real</span>
            <span className="w-8"></span>
          </div>
          {orderedCategories.map((cat, index) => {
            const isFixed = FIXED_CATEGORY_KEYS.includes(cat.key);
            return (
              <div key={cat.key} className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 items-center">
                {/* Reorder buttons */}
                <div className="flex flex-col w-12">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                    onClick={() => handleMoveCategory(cat.key, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground"
                    onClick={() => handleMoveCategory(cat.key, "down")}
                    disabled={index === orderedCategories.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
                
                <Label htmlFor={`${cat.key}-planned`} className="text-sm truncate">
                  {cat.label}
                </Label>
                <Input
                  id={`${cat.key}-planned`}
                  type="number"
                  placeholder="R$ 0"
                  value={cat.planned_amount || ""}
                  onChange={(e) => handleInputChange(cat.key, "planned_amount", Number(e.target.value))}
                  className="text-sm"
                />
                <Input
                  id={`${cat.key}-actual`}
                  type="number"
                  placeholder="R$ 0"
                  value={cat.actual_amount || ""}
                  onChange={(e) => handleInputChange(cat.key, "actual_amount", Number(e.target.value))}
                  className="text-sm"
                />
                
                {/* Remove button (only for custom categories) */}
                <div className="w-8">
                  {!isFixed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveCategory(cat.key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Category */}
        <div className="flex gap-2 items-center pt-2">
          <Input
            placeholder="Nova categoria (ex: Lua de Mel)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="text-sm flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {/* Totals */}
        <div className="pt-3 border-t grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 font-medium">
          <span className="w-12"></span>
          <span className="text-sm">Total</span>
          <span className="text-sm text-primary">{formatCurrency(totalPlanned)}</span>
          <span className="text-sm">{formatCurrency(totalActual)}</span>
          <span className="w-8"></span>
        </div>

        {hasChanges && (
          <p className="text-xs text-muted-foreground text-center">
            Você tem alterações não salvas
          </p>
        )}
      </CardContent>
    </Card>
  );
}