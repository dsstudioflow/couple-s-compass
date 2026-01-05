import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

const FIXED_CATEGORY_LABELS: Record<string, string> = {
  cerimonia: "Cerimônia",
  festa: "Festa",
  vestido_terno: "Vestido/Terno",
  buffet: "Buffet",
  decoracao: "Decoração",
  fotografia: "Fotografia",
};

interface WeddingComparisonChartProps {
  weddingCosts: { category: string; planned_amount: number; actual_amount: number }[];
}

export function WeddingComparisonChart({ weddingCosts }: WeddingComparisonChartProps) {
  const chartData = weddingCosts.map((cost) => {
    const label = FIXED_CATEGORY_LABELS[cost.category] || cost.category;
    return {
      category: label,
      planejado: cost.planned_amount || 0,
      real: cost.actual_amount || 0,
    };
  });

  const hasData = chartData.some((d) => d.planejado > 0 || d.real > 0);

  const chartConfig = {
    planejado: {
      label: "Planejado",
      color: "hsl(var(--primary))",
    },
    real: {
      label: "Real",
      color: "hsl(var(--accent))",
    },
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

  if (!hasData) {
    return (
      <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="font-display text-xl">Planejado vs Real</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Adicione custos planejados e reais</p>
            <p className="text-sm">para visualizar a comparação</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="font-display text-xl">Planejado vs Real</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                iconType="circle"
              />
              <Bar 
                dataKey="planejado" 
                name="Planejado" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="real" 
                name="Real" 
                fill="hsl(var(--accent))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}