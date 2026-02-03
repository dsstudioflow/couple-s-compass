import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, ShoppingCart, CheckCircle2, TrendingUp, Gift } from "lucide-react";

interface HomeStatsCardsProps {
  stats: {
    totalItems: number;
    purchasedItems: number;
    pendingItems: number;
    totalEstimated: number;
    totalActual: number;
    giftedItems: number;
    giftedSavings: number;
  };
}

export function HomeStatsCards({ stats }: HomeStatsCardsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const progressPercent = stats.totalItems > 0 
    ? Math.round((stats.purchasedItems / stats.totalItems) * 100) 
    : 0;

  const savings = stats.totalEstimated - stats.totalActual;
  const savingsPercent = stats.totalEstimated > 0 
    ? Math.round((savings / stats.totalEstimated) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {/* Total Items */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-display font-bold">{stats.totalItems}</p>
              <p className="text-xs text-muted-foreground truncate">Itens no total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-display font-bold">{stats.purchasedItems}</p>
                <span className="text-xs text-muted-foreground">/ {stats.totalItems}</span>
              </div>
              <Progress value={progressPercent} className="h-1.5 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Estimated */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-display font-bold truncate">{formatCurrency(stats.totalEstimated)}</p>
              <p className="text-xs text-muted-foreground">Orçamento total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gifted Items */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-success/5 to-success/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-success" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-display font-bold truncate text-success">
                {formatCurrency(stats.giftedSavings)}
              </p>
              <p className="text-xs text-muted-foreground">{stats.giftedItems} presenteados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              savings >= 0 ? "bg-success/10" : "bg-destructive/10"
            }`}>
              <TrendingUp className={`w-5 h-5 ${savings >= 0 ? "text-success" : "text-destructive rotate-180"}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-lg md:text-2xl font-display font-bold truncate ${
                savings >= 0 ? "text-success" : "text-destructive"
              }`}>
                {savings >= 0 ? "+" : ""}{formatCurrency(savings)}
              </p>
              <p className="text-xs text-muted-foreground">
                {savings >= 0 ? "Economizado" : "Acima do orçamento"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
