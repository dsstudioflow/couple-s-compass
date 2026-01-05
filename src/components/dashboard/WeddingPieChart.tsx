import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";
import { PieChart as PieIcon } from "lucide-react";

const COLORS = [
  "hsl(250, 60%, 55%)",
  "hsl(12, 80%, 60%)",
  "hsl(160, 70%, 42%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(200, 80%, 55%)",
  "hsl(330, 70%, 55%)",
  "hsl(60, 70%, 50%)",
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
      <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <PieIcon className="w-5 h-5 text-accent" />
            </div>
            <CardTitle className="font-display text-xl">Distribuição de Gastos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center text-muted-foreground">
          Adicione custos do casamento para ver o gráfico
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
            <PieIcon className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className="font-display text-xl">Distribuição de Gastos</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row items-center gap-6 p-6">
          {/* Chart */}
          <div className="relative w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="transition-opacity duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    padding: '12px 16px',
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total</p>
                <p className="text-2xl font-display font-bold text-foreground">{formatCompact(total)}</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3">
            {chartData.map((item, index) => {
              const percent = ((item.value / total) * 100).toFixed(0);
              return (
                <div 
                  key={item.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:shadow-sm transition-all cursor-default"
                >
                  <div 
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">{formatCompact(item.value)}</span>
                      <span className="text-[10px] text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded-full">{percent}%</span>
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