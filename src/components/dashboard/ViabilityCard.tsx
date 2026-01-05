import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Home, Receipt, Wallet, PiggyBank, Sparkles } from "lucide-react";
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
    <Card className="relative overflow-hidden border-0 shadow-xl shadow-primary/5 bg-gradient-to-br from-card via-card to-primary/5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">Resumo Financeiro</CardTitle>
            <p className="text-sm text-muted-foreground">Visão mensal do seu planejamento</p>
          </div>
        </div>
        <Badge
          className={`text-sm px-4 py-1.5 rounded-full font-medium ${
            status === "success" 
              ? "bg-success/10 text-success border-success/20" 
              : status === "warning" 
                ? "bg-warning/10 text-warning border-warning/20" 
                : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          <StatusIcon className="w-4 h-4 mr-1.5" />
          {statusText}
        </Badge>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Main metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="group space-y-3 p-5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border border-border/50 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <Label htmlFor="income" className="text-sm font-medium text-muted-foreground">Renda Mensal</Label>
            </div>
            <Input
              id="income"
              type="number"
              placeholder="0"
              value={combinedIncome || ""}
              onChange={(e) => updateProfile({ combined_income: Number(e.target.value) })}
              className="text-xl font-display font-semibold bg-background/80 border-0 h-12 rounded-xl"
            />
          </div>
          
          <div className="group space-y-3 p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl border border-accent/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Gastos Fixos</p>
            </div>
            <p className="text-2xl font-display font-bold text-accent">
              {formatCurrency(totalMonthly)}
            </p>
          </div>

          <div className="group space-y-3 p-5 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-success" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Sobra Mensal</p>
            </div>
            <p className={`text-2xl font-display font-bold ${monthlyBalance < 0 ? "text-destructive" : "text-success"}`}>
              {formatCurrency(monthlyBalance)}
            </p>
            {combinedIncome > 0 && (
              <p className="text-xs text-muted-foreground">
                {savingsRate.toFixed(0)}% da renda
              </p>
            )}
          </div>

          <div className="group space-y-3 p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Meta: Casamento</p>
            </div>
            <p className="text-2xl font-display font-bold text-primary">{formatCurrency(totalWeddingCost)}</p>
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
            <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground rounded-xl h-12">
              <span className="font-medium">Ver detalhamento dos gastos mensais</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Housing */}
              <div className="p-5 bg-muted/30 border border-border/50 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Home className="w-4 h-4 text-primary" />
                  </div>
                  Moradia
                </div>
                {monthlyHousing > 0 ? (
                  <p className="text-xl font-display font-semibold">{formatCurrency(monthlyHousing)}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Não configurado</p>
                )}
              </div>

              {/* Recurring costs */}
              <div className="p-5 bg-muted/30 border border-border/50 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-accent" />
                  </div>
                  Gastos Recorrentes ({recurringCosts.length})
                </div>
                {recurringCosts.length > 0 ? (
                  <div className="space-y-2">
                    {recurringCosts.slice(0, 3).map((cost, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate">{cost.name}</span>
                        <span className="font-medium">{formatCurrency(cost.amount)}</span>
                      </div>
                    ))}
                    {recurringCosts.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        + {recurringCosts.length - 3} outros
                      </p>
                    )}
                    <div className="pt-3 border-t border-border/50 mt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-accent">{formatCurrency(totalRecurring)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum cadastrado</p>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Warnings */}
        {monthlyBalance < 0 && (
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-2xl text-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-destructive">Atenção</p>
              <p className="text-muted-foreground">
                Seus gastos mensais ({formatCurrency(totalMonthly)}) excedem sua renda ({formatCurrency(combinedIncome)}).
              </p>
            </div>
          </div>
        )}
        {totalWeddingCost > 0 && monthlyBalance > 0 && totalWeddingCost > monthlyBalance * 24 && (
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-2xl text-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-warning">Sugestão</p>
              <p className="text-muted-foreground">
                Com a sobra mensal atual, levará mais de 2 anos para juntar o valor do casamento.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}