import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

interface WealthProjectionChartProps {
  data: {
    coupleProfile: { combined_income: number } | null;
    housingConfig: { rent_amount: number; housing_type: string } | null;
    recurringCosts: { amount: number }[];
  };
}

export function WealthProjectionChart({ data }: WealthProjectionChartProps) {
  const { coupleProfile, housingConfig, recurringCosts } = data;

  const combinedIncome = coupleProfile?.combined_income || 0;
  const monthlyHousing = housingConfig?.housing_type === "rent" ? (housingConfig?.rent_amount || 0) : 0;
  const totalRecurring = recurringCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const monthlyBalance = combinedIncome - monthlyHousing - totalRecurring;

  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const currentMonth = new Date().getMonth();
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const accumulated = monthlyBalance * (i + 1);
    return {
      month: months[monthIndex],
      patrimonio: Math.max(0, accumulated),
    };
  });

  const chartConfig = {
    patrimonio: {
      label: "Patrimônio Acumulado",
      color: "hsl(var(--primary))",
    },
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

  if (combinedIncome <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Projeção de Patrimônio (12 meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Informe sua renda combinada para visualizar a projeção.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Projeção de Patrimônio (12 meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Sobra Mensal</p>
            <p className={`text-xl font-display font-semibold ${monthlyBalance < 0 ? "text-destructive" : "text-success"}`}>
              {formatCurrency(monthlyBalance)}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Projeção 12 meses</p>
            <p className="text-xl font-display font-semibold text-primary">
              {formatCurrency(Math.max(0, monthlyBalance * 12))}
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
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
              <Area
                type="monotone"
                dataKey="patrimonio"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPatrimonio)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
