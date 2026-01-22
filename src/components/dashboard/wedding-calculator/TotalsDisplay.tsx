import { Sparkles } from "lucide-react";

interface TotalsDisplayProps {
  totalPlanned: number;
  totalActual: number;
}

export function TotalsDisplay({ totalPlanned, totalActual }: TotalsDisplayProps) {
  const formatCompact = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(value);

  return (
    <div className="pt-3 md:pt-4 border-t border-border/50">
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
              <p className="text-[10px] text-muted-foreground">Real</p>
              <p className="font-display font-semibold text-sm md:text-base">{formatCompact(totalActual)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
