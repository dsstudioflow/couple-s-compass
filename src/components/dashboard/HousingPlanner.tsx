import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";

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

  // Cálculo da parcela (Tabela Price)
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
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          Planejador de Moradia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={config.housing_type}
          onValueChange={(v) => upsertHousingConfig({ housing_type: v as "rent" | "finance" })}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="rent">Aluguel</TabsTrigger>
            <TabsTrigger value="finance">Financiamento</TabsTrigger>
          </TabsList>

          <TabsContent value="rent" className="space-y-3">
            <div className="space-y-1">
              <Label>Valor do Aluguel Mensal</Label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={config.rent_amount || ""}
                onChange={(e) => upsertHousingConfig({ rent_amount: Number(e.target.value) })}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Custo anual</p>
              <p className="text-xl font-semibold">{formatCurrency(config.rent_amount * 12)}</p>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Valor do Imóvel</Label>
                <Input
                  type="number"
                  value={config.property_value || ""}
                  onChange={(e) => upsertHousingConfig({ property_value: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Entrada</Label>
                <Input
                  type="number"
                  value={config.down_payment || ""}
                  onChange={(e) => upsertHousingConfig({ down_payment: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Juros Anual (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={config.interest_rate || ""}
                  onChange={(e) => upsertHousingConfig({ interest_rate: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Prazo (meses)</Label>
                <Input
                  type="number"
                  value={config.loan_term_months || ""}
                  onChange={(e) => upsertHousingConfig({ loan_term_months: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                <p className="text-xl font-semibold">{formatCurrency(monthlyPayment)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Custo Total</p>
                <p className="text-xl font-semibold">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}