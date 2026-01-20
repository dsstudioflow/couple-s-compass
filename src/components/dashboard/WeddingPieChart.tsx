import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const FIXED_CATEGORY_LABELS: Record<string, string> = {
  cerimonia: "Cerimônia",
  festa: "Festa",
  vestido_terno: "Vestido/Terno",
  buffet: "Buffet",
  decoracao: "Decoração",
  fotografia: "Fotografia",
};

const COLORS = [
  "hsl(250, 60%, 55%)",  // Primary violet
  "hsl(12, 80%, 60%)",   // Coral accent
  "hsl(160, 70%, 42%)",  // Success green
  "hsl(38, 92%, 50%)",   // Warning amber
  "hsl(280, 65%, 55%)",  // Purple
  "hsl(200, 80%, 55%)",  // Sky blue
  "hsl(330, 70%, 55%)",  // Pink
  "hsl(170, 60%, 45%)",  // Teal
];

interface WeddingPieChartProps {
  weddingCosts: { category: string; planned_amount: number; actual_amount: number }[];
}

export function WeddingPieChart({ weddingCosts }: WeddingPieChartProps) {
  const chartData = weddingCosts
    .filter(c => (c.planned_amount || 0) > 0)
    .map((cost) => {
      const label = FIXED_CATEGORY_LABELS[cost.category] || cost.category;
      return {
        name: label,
        value: cost.planned_amount || 0,
      };
    });

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const chartConfig = Object.fromEntries(
    chartData.map((item, index) => [
      item.name,
      { label: item.name, color: COLORS[index % COLORS.length] },
    ])
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatCompact = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(value);

  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
        <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 flex items-center justify-center shrink-0">
              <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            </div>
            <CardTitle className="font-display text-lg md:text-xl">Distribuição de Gastos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="text-center py-10 md:py-12 text-muted-foreground">
            <PieChartIcon className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm md:text-base">Adicione custos planejados</p>
            <p className="text-xs md:text-sm">para visualizar a distribuição</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 flex items-center justify-center shrink-0">
            <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-accent" />
          </div>
          <div>
            <CardTitle className="font-display text-lg md:text-xl">Distribuição de Gastos</CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Total: {formatCompact(total)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-6">
          {/* Chart */}
          <div className="relative w-full lg:w-1/2 h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  paddingAngle={3}
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
                    padding: '10px 14px',
                    fontSize: '13px',
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wide">Total</p>
                <p className="text-xl md:text-2xl font-display font-bold text-foreground">{formatCompact(total)}</p>
              </div>
            </div>
          </div>

          {/* Legend - horizontal scroll on mobile */}
          <div className="w-full lg:w-1/2">
            <div className="flex lg:grid lg:grid-cols-2 gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide pb-2 lg:pb-0 -mx-1 px-1">
              {chartData.map((item, index) => {
                const percent = ((item.value / total) * 100).toFixed(0);
                return (
                  <div 
                    key={item.name}
                    className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-xl bg-muted/30 border border-border/50 min-w-[140px] lg:min-w-0 shrink-0 lg:shrink"
                  >
                    <div 
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-foreground truncate">{item.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] md:text-xs font-medium text-muted-foreground">{formatCompact(item.value)}</span>
                        <span className="text-[9px] md:text-[10px] text-muted-foreground/60 bg-muted px-1 py-0.5 rounded-full">{percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
