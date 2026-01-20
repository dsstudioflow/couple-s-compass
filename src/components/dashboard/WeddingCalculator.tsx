import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Save, Check, Plus, X, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
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

  const initializeFromProps = useCallback(() => {
    const aggregated: CostValues = {};
    const order: string[] = [];
    
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

  const formatCompact = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value);

  const orderedCategories = categoryOrder
    .filter(key => localCosts[key])
    .map(key => ({ key, ...localCosts[key] }));

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 md:pb-4 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <CardTitle className="font-display text-lg md:text-xl">Calculadora de Casamento</CardTitle>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`rounded-xl h-10 px-4 w-full sm:w-auto ${justSaved ? "bg-success hover:bg-success" : ""}`}
        >
          {justSaved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Salvo
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar"}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-5 px-4 md:px-6">
        {/* Scenario buttons */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {(["economico", "padrao", "luxo"] as const).map((scenario) => (
            <Button
              key={scenario}
              variant={activeScenario === scenario ? "default" : "outline"}
              size="sm"
              onClick={() => handleScenario(scenario)}
              className="rounded-xl shrink-0 text-xs md:text-sm"
            >
              {scenario === "economico" ? (
                <>💰 Econômico</>
              ) : scenario === "padrao" ? (
                <>✨ Padrão</>
              ) : (
                <>👑 Luxo</>
              )}
            </Button>
          ))}
        </div>
        
        {/* Mobile-optimized categories list */}
        <div className="space-y-2">
          {/* Header - hidden on mobile, visible on larger screens */}
          <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-3 text-xs font-medium text-muted-foreground px-1">
            <span className="w-10"></span>
            <span>Categoria</span>
            <span>Planejado</span>
            <span>Real</span>
            <span className="w-8"></span>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {orderedCategories.map((cat, index) => {
              const isFixed = FIXED_CATEGORY_KEYS.includes(cat.key);
              return (
                <div 
                  key={cat.key} 
                  className="p-3 md:p-2 rounded-xl bg-muted/30 border border-border/50 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="flex flex-col gap-2 md:hidden">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{cat.label}</Label>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handleMoveCategory(cat.key, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handleMoveCategory(cat.key, "down")}
                          disabled={index === orderedCategories.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
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
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground">Planejado</span>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="R$ 0"
                          value={cat.planned_amount || ""}
                          onChange={(e) => handleInputChange(cat.key, "planned_amount", Number(e.target.value))}
                          className="text-sm h-10 rounded-lg border-border/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground">Real</span>
                        <Input
                          type="number"
                          inputMode="numeric"
                          placeholder="R$ 0"
                          value={cat.actual_amount || ""}
                          onChange={(e) => handleInputChange(cat.key, "actual_amount", Number(e.target.value))}
                          className="text-sm h-10 rounded-lg border-border/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-3 items-center">
                    <div className="flex flex-col w-10">
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
                    
                    <Label htmlFor={`${cat.key}-planned`} className="text-sm font-medium truncate">
                      {cat.label}
                    </Label>
                    <Input
                      id={`${cat.key}-planned`}
                      type="number"
                      placeholder="R$ 0"
                      value={cat.planned_amount || ""}
                      onChange={(e) => handleInputChange(cat.key, "planned_amount", Number(e.target.value))}
                      className="text-sm h-9 rounded-lg border-border/50"
                    />
                    <Input
                      id={`${cat.key}-actual`}
                      type="number"
                      placeholder="R$ 0"
                      value={cat.actual_amount || ""}
                      onChange={(e) => handleInputChange(cat.key, "actual_amount", Number(e.target.value))}
                      className="text-sm h-9 rounded-lg border-border/50"
                    />
                    
                    <div className="w-8">
                      {!isFixed && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveCategory(cat.key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Custom Category */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Nova categoria (ex: Lua de Mel)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="text-sm flex-1 h-11 rounded-xl border-border/50"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="h-11 rounded-xl px-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Totals */}
        <div className="pt-3 md:pt-4 border-t border-border/50">
          <div className="p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-display font-semibold text-sm md:text-base">Total</span>
              </div>
              <div className="flex items-center gap-3 md:gap-6">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Planejado</p>
                  <p className="font-display font-bold text-primary text-sm md:text-base">{formatCompact(totalPlanned)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Real</p>
                  <p className="font-display font-semibold text-sm md:text-base">{formatCompact(totalActual)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasChanges && (
          <p className="text-xs text-muted-foreground text-center animate-pulse">
            Você tem alterações não salvas
          </p>
        )}
      </CardContent>
    </Card>
  );
}
