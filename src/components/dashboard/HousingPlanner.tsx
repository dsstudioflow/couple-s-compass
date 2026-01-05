import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Building, Key } from "lucide-react";

interface HousingPlannerProps {
  data: {
    housingConfig: {
      housing_type: "rent" | "finance";
      rent_amount: number;
      property_value: number;
      down_payment: number;
      interest_rate: number;
      loan_term_months: number;
    } | null;
    upsertHousingConfig: (config: Partial<{
      housing_type: "rent" | "finance";
      rent_amount: number;
      property_value: number;
      down_payment: number;
      interest_rate: number;
      loan_term_months: number;
    }>) => Promise<boolean>;
  };
}

export function HousingPlanner({ data }: HousingPlannerProps) {
  const { housingConfig, upsertHousingConfig } = data;
  const config = housingConfig || {
    housing_type: "rent" as const,
    rent_amount: 0,
    property_value: 0,
    down_payment: 0,
    interest_rate: 0,
    loan_term_months: 360,
  };

  const loanAmount = config.property_value - config.down_payment;
  const monthlyRate = config.interest_rate / 100 / 12;
  const n = config.loan_term_months;
  const monthlyPayment = monthlyRate > 0 && n > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    : 0;
  const totalCost = monthlyPayment * n;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
            <Home className="w-5 h-5 text-success" />
          </div>
          <CardTitle className="font-display text-xl">Planejador de Moradia</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={config.housing_type}
          onValueChange={(v) => upsertHousingConfig({ housing_type: v as "rent" | "finance" })}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-xl bg-muted/50 p-1">
            <TabsTrigger value="rent" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
              <Key className="w-4 h-4" />
              Aluguel
            </TabsTrigger>
            <TabsTrigger value="finance" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2">
              <Building className="w-4 h-4" />
              Financiamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rent" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Valor do Aluguel Mensal</Label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={config.rent_amount || ""}
                onChange={(e) => upsertHousingConfig({ rent_amount: Number(e.target.value) })}
                className="h-12 rounded-xl border-border/50 text-lg font-medium"
              />
            </div>
            <div className="p-5 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20">
              <p className="text-sm text-muted-foreground">Custo anual estimado</p>
              <p className="text-2xl font-display font-bold text-success">{formatCurrency(config.rent_amount * 12)}</p>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Valor do Imóvel</Label>
                <Input
                  type="number"
                  value={config.property_value || ""}
                  onChange={(e) => upsertHousingConfig({ property_value: Number(e.target.value) })}
                  className="h-11 rounded-xl border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Entrada</Label>
                <Input
                  type="number"
                  value={config.down_payment || ""}
                  onChange={(e) => upsertHousingConfig({ down_payment: Number(e.target.value) })}
                  className="h-11 rounded-xl border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Juros Anual (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.interest_rate || ""}
                  onChange={(e) => upsertHousingConfig({ interest_rate: Number(e.target.value) })}
                  className="h-11 rounded-xl border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Prazo (meses)</Label>
                <Input
                  type="number"
                  value={config.loan_term_months || ""}
                  onChange={(e) => upsertHousingConfig({ loan_term_months: Number(e.target.value) })}
                  className="h-11 rounded-xl border-border/50"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20">
                <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                <p className="text-2xl font-display font-bold text-accent">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
                <p className="text-sm text-muted-foreground">Custo Total</p>
                <p className="text-2xl font-display font-bold text-primary">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}