import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Home, Receipt, Wallet, PiggyBank } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ViabilityCardProps {
  data: {
    coupleProfile: { combined_income: number } | null;
    weddingCosts: { planned_amount: number }[];
    housingConfig: { rent_amount: number; housing_type: string } | null;
    recurringCosts: { amount: number; name: string }[];
    updateProfile: (updates: { combined_income: number }) => Promise<boolean>;
  };
}

export function ViabilityCard({ data }: ViabilityCardProps) {
  const { coupleProfile, weddingCosts, housingConfig, recurringCosts, updateProfile } = data;
  const [isOpen, setIsOpen] = useState(false);

  const totalWeddingCost = weddingCosts.reduce((sum, c) => sum + (c.planned_amount || 0), 0);
  const monthlyHousing = housingConfig?.housing_type === "rent" ? (housingConfig?.rent_amount || 0) : 0;
  const totalRecurring = recurringCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalMonthly = monthlyHousing + totalRecurring;
  const combinedIncome = coupleProfile?.combined_income || 0;
  
  const monthlyBalance = combinedIncome - totalMonthly;
  const savingsRate = combinedIncome > 0 ? (monthlyBalance / combinedIncome) * 100 : 0;

  let status: "success" | "warning" | "danger" = "success";
  let statusText = "Saudável";
  let StatusIcon = TrendingUp;

  if (monthlyBalance < 0) {
    status = "danger";
    statusText = "Déficit";
    StatusIcon = TrendingDown;
  } else if (savingsRate < 20) {
    status = "warning";
    statusText = "Margem Baixa";
    StatusIcon = AlertTriangle;
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-accent/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-2xl">Resumo Financeiro Mensal</CardTitle>
        <Badge
          variant={status === "success" ? "default" : status === "warning" ? "secondary" : "destructive"}
          className="text-sm px-3 py-1"
        >
          <StatusIcon className="w-4 h-4 mr-1" />
          {statusText}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <Label htmlFor="income" className="text-sm font-medium">Renda Mensal</Label>
            </div>
            <Input
              id="income"
              type="number"
              placeholder="0"
              value={combinedIncome || ""}
              onChange={(e) => updateProfile({ combined_income: Number(e.target.value) })}
              className="text-lg font-semibold bg-background"
            />
          </div>
          
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-medium">Gastos Mensais Fixos</p>
            </div>
            <p className="text-2xl font-display font-semibold text-orange-600 dark:text-orange-400">
              {formatCurrency(totalMonthly)}
            </p>
          </div>

          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              <p className="text-sm font-medium">Sobra Mensal</p>
            </div>
            <p className={`text-2xl font-display font-semibold ${monthlyBalance < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>
              {formatCurrency(monthlyBalance)}
            </p>
            {combinedIncome > 0 && (
              <p className="text-xs text-muted-foreground">
                {savingsRate.toFixed(0)}% da renda
              </p>
            )}
          </div>

          <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-medium text-primary">Meta: Casamento</p>
            <p className="text-2xl font-display font-semibold">{formatCurrency(totalWeddingCost)}</p>
            {monthlyBalance > 0 && totalWeddingCost > 0 && (
              <p className="text-xs text-muted-foreground">
                ~{Math.ceil(totalWeddingCost / monthlyBalance)} meses para juntar
              </p>
            )}
          </div>
        </div>

        {/* Expandable breakdown */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground">
              <span>Ver detalhamento dos gastos mensais</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Housing */}
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Home className="w-4 h-4" />
                  Moradia
                </div>
                {monthlyHousing > 0 ? (
                  <p className="text-lg font-semibold">{formatCurrency(monthlyHousing)}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Não configurado</p>
                )}
              </div>

              {/* Recurring costs */}
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Receipt className="w-4 h-4" />
                  Gastos Recorrentes ({recurringCosts.length})
                </div>
                {recurringCosts.length > 0 ? (
                  <div className="space-y-1">
                    {recurringCosts.slice(0, 3).map((cost, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate">{cost.name}</span>
                        <span>{formatCurrency(cost.amount)}</span>
                      </div>
                    ))}
                    {recurringCosts.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        + {recurringCosts.length - 3} outros
                      </p>
                    )}
                    <div className="pt-2 border-t mt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(totalRecurring)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum cadastrado</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Warning */}
        {monthlyBalance < 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
            ⚠️ <strong>Atenção:</strong> Seus gastos mensais ({formatCurrency(totalMonthly)}) excedem sua renda 
            ({formatCurrency(combinedIncome)}). Revise seus custos recorrentes ou moradia.
          </div>
        )}
        {totalWeddingCost > 0 && monthlyBalance > 0 && totalWeddingCost > monthlyBalance * 24 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm">
            💡 <strong>Sugestão:</strong> Com a sobra mensal atual, levará mais de 2 anos para juntar o valor do casamento. 
            Considere ajustar o orçamento ou aumentar a renda.
          </div>
        )}
      </CardContent>
    </Card>
  );
}