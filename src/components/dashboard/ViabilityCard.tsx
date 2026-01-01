import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface ViabilityCardProps {
  data: {
    coupleProfile: { combined_income: number } | null;
    weddingCosts: { planned_amount: number }[];
    housingConfig: { rent_amount: number; housing_type: string } | null;
    recurringCosts: { amount: number }[];
    updateProfile: (updates: { combined_income: number }) => Promise<boolean>;
  };
}

export function ViabilityCard({ data }: ViabilityCardProps) {
  const { coupleProfile, weddingCosts, housingConfig, recurringCosts, updateProfile } = data;

  const totalWeddingCost = weddingCosts.reduce((sum, c) => sum + (c.planned_amount || 0), 0);
  const monthlyHousing = housingConfig?.housing_type === "rent" ? (housingConfig?.rent_amount || 0) : 0;
  const totalRecurring = recurringCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalMonthly = monthlyHousing + totalRecurring;
  const combinedIncome = coupleProfile?.combined_income || 0;
  
  const monthlyBalance = combinedIncome - totalMonthly;
  const savingsRate = combinedIncome > 0 ? (monthlyBalance / combinedIncome) * 100 : 0;

  let status: "success" | "warning" | "danger" = "success";
  let statusText = "Dentro do Orçamento";
  let StatusIcon = TrendingUp;

  if (monthlyBalance < 0) {
    status = "danger";
    statusText = "Reduza Custos";
    StatusIcon = TrendingDown;
  } else if (savingsRate < 20) {
    status = "warning";
    statusText = "Atenção: Margem Baixa";
    StatusIcon = AlertTriangle;
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-accent/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-2xl">Métrica de Viabilidade</CardTitle>
        <Badge
          variant={status === "success" ? "default" : status === "warning" ? "secondary" : "destructive"}
          className="text-sm px-3 py-1"
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          {statusText}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="income">Renda Combinada Mensal</Label>
            <Input
              id="income"
              type="number"
              placeholder="0"
              value={combinedIncome || ""}
              onChange={(e) => updateProfile({ combined_income: Number(e.target.value) })}
              className="text-lg font-semibold"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Custo Total Casamento</p>
            <p className="text-2xl font-display font-semibold">{formatCurrency(totalWeddingCost)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Gastos Mensais</p>
            <p className="text-2xl font-display font-semibold">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sobra Mensal</p>
            <p className={`text-2xl font-display font-semibold ${monthlyBalance < 0 ? "text-destructive" : "text-success"}`}>
              {formatCurrency(monthlyBalance)}
            </p>
          </div>
        </div>
        {totalWeddingCost > combinedIncome * 12 && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
            💡 <strong>Sugestão:</strong> O custo do casamento ultrapassa 12x sua renda mensal. Considere realocar 10% 
            ({formatCurrency(totalWeddingCost * 0.1)}) para uma reserva de emergência.
          </div>
        )}
      </CardContent>
    </Card>
  );
}