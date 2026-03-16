import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Package, CheckCircle2, Gift, TrendingUp, Wallet } from "lucide-react";

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

  const totalPaid = stats.totalActual;
  const totalSaved = stats.totalEstimated - stats.totalActual - stats.giftedSavings;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      {/* Orçamento Total */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-display font-bold truncate">{formatCurrency(stats.totalEstimated)}</p>
              <p className="text-xs text-muted-foreground truncate">Orçamento total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pago */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg md:text-2xl font-display font-bold truncate text-primary">
                {formatCurrency(totalPaid)}
              </p>
              <p className="text-xs text-muted-foreground">{stats.purchasedItems} itens pagos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presenteado */}
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

      {/* Economizado */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              totalSaved >= 0 ? "bg-success/10" : "bg-destructive/10"
            }`}>
              <TrendingUp className={`w-5 h-5 ${totalSaved >= 0 ? "text-success" : "text-destructive rotate-180"}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-lg md:text-2xl font-display font-bold truncate ${
                totalSaved >= 0 ? "text-success" : "text-destructive"
              }`}>
                {totalSaved >= 0 ? "+" : ""}{formatCurrency(totalSaved)}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalSaved >= 0 ? "Economizado" : "Acima do orçamento"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-display font-bold">{progressPercent}%</p>
              </div>
              <Progress value={progressPercent} className="h-1.5 mt-1" />
              <p className="text-[10px] text-muted-foreground mt-0.5">{stats.purchasedItems + stats.giftedItems} de {stats.totalItems}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
