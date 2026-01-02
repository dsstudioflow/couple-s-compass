import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
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
  const chartData = Object.keys(CATEGORY_LABELS).map((key) => {
    const cost = weddingCosts.find((c) => c.category === key);
    return {
      category: CATEGORY_LABELS[key],
      planejado: cost?.planned_amount || 0,
      real: cost?.actual_amount || 0,
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
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Planejado vs Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Adicione custos planejados e reais para visualizar a comparação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Planejado vs Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
              />
              <Legend />
              <Bar 
                dataKey="planejado" 
                name="Planejado" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="real" 
                name="Real" 
                fill="hsl(var(--accent))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
