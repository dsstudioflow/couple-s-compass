import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

const COLORS = [
  "hsl(142, 70%, 45%)",
  "hsl(200, 80%, 55%)",
  "hsl(280, 65%, 55%)",
  "hsl(35, 90%, 55%)",
  "hsl(350, 75%, 55%)",
  "hsl(175, 70%, 40%)",
  "hsl(250, 60%, 60%)",
  "hsl(15, 85%, 55%)",
];

const LABELS: Record<string, string> = {
  cerimonia: "Cerimônia",
  festa: "Festa",
  vestido_terno: "Vestido/Terno",
  buffet: "Buffet",
  decoracao: "Decoração",
  fotografia: "Fotografia",
};

interface WeddingPieChartProps {
  weddingCosts: { category: string; planned_amount: number }[];
}

export function WeddingPieChart({ weddingCosts }: WeddingPieChartProps) {
  const chartData = useMemo(() => 
    weddingCosts
      .filter((c) => c.planned_amount > 0)
      .map((c) => ({
        name: LABELS[c.category] || c.category,
        value: c.planned_amount,
      }))
      .sort((a, b) => b.value - a.value),
    [weddingCosts]
  );

  const total = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatCompact = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return `R$ ${value}`;
  };

  if (chartData.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-lg">Distribuição de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center text-muted-foreground">
          Adicione custos do casamento para ver o gráfico
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-lg">Distribuição de Gastos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row items-center gap-4 p-4">
          {/* Chart */}
          <div className="relative w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium">Total</p>
                <p className="text-lg font-bold text-foreground">{formatCompact(total)}</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-2">
            {chartData.map((item, index) => {
              const percent = ((item.value / total) * 100).toFixed(0);
              return (
                <div 
                  key={item.name}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-muted-foreground">{formatCompact(item.value)}</span>
                      <span className="text-[10px] text-muted-foreground/70">({percent}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
