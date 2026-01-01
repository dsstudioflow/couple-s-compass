import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const CATEGORIES = [
  { key: "cerimonia", label: "Cerimônia" },
  { key: "festa", label: "Festa" },
  { key: "vestido_terno", label: "Vestido/Terno" },
  { key: "buffet", label: "Buffet" },
  { key: "decoracao", label: "Decoração" },
  { key: "fotografia", label: "Fotografia" },
];

const SCENARIOS = {
  economico: { cerimonia: 3000, festa: 15000, vestido_terno: 2000, buffet: 8000, decoracao: 3000, fotografia: 3000 },
  padrao: { cerimonia: 8000, festa: 40000, vestido_terno: 8000, buffet: 20000, decoracao: 8000, fotografia: 6000 },
  luxo: { cerimonia: 25000, festa: 120000, vestido_terno: 25000, buffet: 60000, decoracao: 25000, fotografia: 15000 },
};

interface WeddingCalculatorProps {
  data: {
    weddingCosts: { category: string; planned_amount: number }[];
    upsertWeddingCost: (cost: { category: string; planned_amount: number }) => Promise<boolean>;
  };
}

export function WeddingCalculator({ data }: WeddingCalculatorProps) {
  const { weddingCosts, upsertWeddingCost } = data;
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const getCostValue = (category: string) => {
    const cost = weddingCosts.find((c) => c.category === category);
    return cost?.planned_amount || 0;
  };

  const handleScenario = async (scenario: keyof typeof SCENARIOS) => {
    setActiveScenario(scenario);
    const values = SCENARIOS[scenario];
    for (const [category, amount] of Object.entries(values)) {
      await upsertWeddingCost({ category, planned_amount: amount });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Calculadora de Casamento
        </CardTitle>
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
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="space-y-1">
              <Label htmlFor={cat.key} className="text-sm">{cat.label}</Label>
              <Input
                id={cat.key}
                type="number"
                placeholder="R$ 0"
                value={getCostValue(cat.key) || ""}
                onChange={(e) => upsertWeddingCost({ category: cat.key, planned_amount: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}