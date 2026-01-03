import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Save, Check, Plus, X } from "lucide-react";
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
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Initialize local state from props - aggregate by category
  const initializeFromProps = useCallback(() => {
    const aggregated: CostValues = {};
    
    // Initialize fixed categories
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
    });

    // Initialize custom categories from existing data
    weddingCosts.forEach(cost => {
      if (!FIXED_CATEGORY_KEYS.includes(cost.category) && !aggregated[cost.category]) {
        aggregated[cost.category] = {
          planned_amount: cost.planned_amount || 0,
          actual_amount: cost.actual_amount || 0,
          label: cost.category, // Custom categories use the key as label
        };
      }
    });

    setLocalCosts(aggregated);
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
    
    // Generate a key from the name
    const key = trimmed.toLowerCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (localCosts[key]) {
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
    setNewCategoryName("");
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleRemoveCategory = (key: string) => {
    if (FIXED_CATEGORY_KEYS.includes(key)) return; // Can't remove fixed categories
    setLocalCosts(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    setHasChanges(true);
    setJustSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const costsToSave = Object.entries(localCosts).map(([key, val]) => ({
        category: key,
        planned_amount: val.planned_amount || 0,
        actual_amount: val.actual_amount || 0,
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

  // Separate fixed and custom categories for rendering
  const fixedCategoryEntries = FIXED_CATEGORIES.map(cat => ({ key: cat.key, ...localCosts[cat.key] }));
  const customCategoryEntries = Object.entries(localCosts)
    .filter(([key]) => !FIXED_CATEGORY_KEYS.includes(key))
    .map(([key, val]) => ({ key, ...val }));

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
        
        {/* Fixed Categories */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground">
            <span>Categoria</span>
            <span>Planejado</span>
            <span>Real</span>
          </div>
          {fixedCategoryEntries.map((cat) => (
            <div key={cat.key} className="grid grid-cols-3 gap-2 items-center">
              <Label htmlFor={`${cat.key}-planned`} className="text-sm truncate">{cat.label}</Label>
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
            </div>
          ))}

          {/* Custom Categories */}
          {customCategoryEntries.map((cat) => (
            <div key={cat.key} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center">
              <Label htmlFor={`${cat.key}-planned`} className="text-sm truncate">{cat.label}</Label>
              <Input
                id={`${cat.key}-planned`}
                type="number"
                placeholder="R$ 0"
                value={cat.planned_amount || ""}
                onChange={(e) => handleInputChange(cat.key, "planned_amount", Number(e.target.value))}
                className="text-sm w-24"
              />
              <Input
                id={`${cat.key}-actual`}
                type="number"
                placeholder="R$ 0"
                value={cat.actual_amount || ""}
                onChange={(e) => handleInputChange(cat.key, "actual_amount", Number(e.target.value))}
                className="text-sm w-24"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveCategory(cat.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Custom Category */}
        <div className="flex gap-2 items-center pt-2">
          <Input
            placeholder="Nova categoria (ex: Lua de mel)"
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
        <div className="pt-3 border-t grid grid-cols-3 gap-2 font-medium">
          <span className="text-sm">Total</span>
          <span className="text-sm text-primary">{formatCurrency(totalPlanned)}</span>
          <span className="text-sm">{formatCurrency(totalActual)}</span>
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