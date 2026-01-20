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
      
      <CardHeader className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <CardTitle className="font-display text-lg md:text-xl">Resumo Financeiro</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">Visão mensal do seu planejamento</p>
          </div>
        </div>
        <Badge
          className={`text-xs md:text-sm px-3 md:px-4 py-1 md:py-1.5 rounded-full font-medium w-fit ${
            status === "success" 
              ? "bg-success/10 text-success border-success/20" 
              : status === "warning" 
                ? "bg-warning/10 text-warning border-warning/20" 
                : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          <StatusIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
          {statusText}
        </Badge>
      </CardHeader>

      <CardContent className="relative space-y-4 md:space-y-6 px-4 md:px-6">
        {/* Main metrics - responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="group space-y-2 md:space-y-3 p-3 md:p-5 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl md:rounded-2xl border border-border/50 transition-all active:scale-[0.98] md:hover:shadow-lg md:hover:shadow-primary/5 md:hover:-translate-y-0.5">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <Label htmlFor="income" className="text-[10px] md:text-sm font-medium text-muted-foreground truncate">Renda Mensal</Label>
            </div>
            <Input
              id="income"
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={combinedIncome || ""}
              onChange={(e) => updateProfile({ combined_income: Number(e.target.value) })}
              className="text-base md:text-xl font-display font-semibold bg-background/80 border-0 h-10 md:h-12 rounded-lg md:rounded-xl"
            />
          </div>
          
          <div className="group space-y-2 md:space-y-3 p-3 md:p-5 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl md:rounded-2xl border border-accent/20 transition-all active:scale-[0.98] md:hover:shadow-lg md:hover:-translate-y-0.5">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Receipt className="w-3 h-3 md:w-4 md:h-4 text-accent" />
              </div>
              <p className="text-[10px] md:text-sm font-medium text-muted-foreground truncate">Gastos Fixos</p>
            </div>
            <p className="text-lg md:text-2xl font-display font-bold text-accent truncate">
              {formatCurrency(totalMonthly)}
            </p>
          </div>

          <div className="group space-y-2 md:space-y-3 p-3 md:p-5 bg-gradient-to-br from-success/5 to-success/10 rounded-xl md:rounded-2xl border border-success/20 transition-all active:scale-[0.98] md:hover:shadow-lg md:hover:-translate-y-0.5">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <PiggyBank className="w-3 h-3 md:w-4 md:h-4 text-success" />
              </div>
              <p className="text-[10px] md:text-sm font-medium text-muted-foreground truncate">Sobra Mensal</p>
            </div>
            <p className={`text-lg md:text-2xl font-display font-bold truncate ${monthlyBalance < 0 ? "text-destructive" : "text-success"}`}>
              {formatCurrency(monthlyBalance)}
            </p>
            {combinedIncome > 0 && (
              <p className="text-[10px] md:text-xs text-muted-foreground">
                {savingsRate.toFixed(0)}% da renda
              </p>
            )}
          </div>

          <div className="group space-y-2 md:space-y-3 p-3 md:p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl md:rounded-2xl border border-primary/20 transition-all active:scale-[0.98] md:hover:shadow-lg md:hover:-translate-y-0.5">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <p className="text-[10px] md:text-sm font-medium text-muted-foreground truncate">Meta: Casamento</p>
            </div>
            <p className="text-lg md:text-2xl font-display font-bold text-primary truncate">{formatCurrency(totalWeddingCost)}</p>
            {monthlyBalance > 0 && totalWeddingCost > 0 && (
              <p className="text-[10px] md:text-xs text-muted-foreground">
                ~{Math.ceil(totalWeddingCost / monthlyBalance)} meses
              </p>
            )}
          </div>
        </div>

        {/* Expandable breakdown */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground rounded-xl h-11 md:h-12 text-sm md:text-base">
              <span className="font-medium">Ver detalhamento</span>
              <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3 md:pt-4">
            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
              {/* Housing */}
              <div className="p-4 md:p-5 bg-muted/30 border border-border/50 rounded-xl md:rounded-2xl space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  </div>
                  Moradia
                </div>
                {monthlyHousing > 0 ? (
                  <p className="text-lg md:text-xl font-display font-semibold">{formatCurrency(monthlyHousing)}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Não configurado</p>
                )}
              </div>

              {/* Recurring costs */}
              <div className="p-4 md:p-5 bg-muted/30 border border-border/50 rounded-xl md:rounded-2xl space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Receipt className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                  </div>
                  Gastos Recorrentes ({recurringCosts.length})
                </div>
                {recurringCosts.length > 0 ? (
                  <div className="space-y-1.5 md:space-y-2">
                    {recurringCosts.slice(0, 3).map((cost, i) => (
                      <div key={i} className="flex justify-between text-xs md:text-sm">
                        <span className="text-muted-foreground truncate mr-2">{cost.name}</span>
                        <span className="font-medium shrink-0">{formatCurrency(cost.amount)}</span>
                      </div>
                    ))}
                    {recurringCosts.length > 3 && (
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        + {recurringCosts.length - 3} outros
                      </p>
                    )}
                    <div className="pt-2 md:pt-3 border-t border-border/50 mt-2 md:mt-3 flex justify-between font-medium text-sm">
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
          <div className="p-3 md:p-4 bg-destructive/5 border border-destructive/20 rounded-xl md:rounded-2xl text-sm flex items-start gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-destructive" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-destructive text-xs md:text-sm">Atenção</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Seus gastos excedem sua renda.
              </p>
            </div>
          </div>
        )}
        {totalWeddingCost > 0 && monthlyBalance > 0 && totalWeddingCost > monthlyBalance * 24 && (
          <div className="p-3 md:p-4 bg-warning/5 border border-warning/20 rounded-xl md:rounded-2xl text-sm flex items-start gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-warning" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-warning text-xs md:text-sm">Sugestão</p>
              <p className="text-muted-foreground text-xs md:text-sm">
                Com a sobra atual, levará mais de 2 anos para juntar o valor.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
