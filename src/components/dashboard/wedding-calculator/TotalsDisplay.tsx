import { Sparkles, TrendingDown } from "lucide-react";

interface TotalsDisplayProps {
  totalPlanned: number;
  totalActual: number;
}

export function TotalsDisplay({ totalPlanned, totalActual }: TotalsDisplayProps) {
  const formatCompact = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value);

  const remaining = totalPlanned - totalActual;
  const paidPercent = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

  return (
    <div className="pt-3 md:pt-4 border-t border-border/50 space-y-3">
      <div className="p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-sm md:text-base">Total</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Planejado</p>
              <p className="font-display font-bold text-primary text-sm md:text-base">{formatCompact(totalPlanned)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">Pago</p>
              <p className="font-display font-semibold text-sm md:text-base">{formatCompact(totalActual)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining balance */}
      <div className={`p-3 md:p-4 rounded-xl border ${
        remaining >= 0 
          ? "bg-success/5 border-success/20" 
          : "bg-destructive/5 border-destructive/20"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className={`w-4 h-4 ${remaining >= 0 ? "text-success" : "text-destructive"}`} />
            <span className="font-display font-semibold text-sm md:text-base">
              {remaining >= 0 ? "Falta pagar" : "Acima do orçamento"}
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground">{paidPercent}% pago</p>
              <p className={`font-display font-bold text-sm md:text-base ${
                remaining >= 0 ? "text-success" : "text-destructive"
              }`}>
                {formatCompact(Math.abs(remaining))}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-2 rounded-full bg-muted/50 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              remaining >= 0 ? "bg-success" : "bg-destructive"
            }`}
            style={{ width: `${Math.min(paidPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
