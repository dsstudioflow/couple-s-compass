import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";

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
      <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="font-display text-xl">Projeção de Patrimônio</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Informe sua renda combinada</p>
            <p className="text-sm">para visualizar a projeção</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">Projeção de Patrimônio</CardTitle>
            <p className="text-sm text-muted-foreground">Próximos 12 meses</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-success" />
              </div>
              <p className="text-sm text-muted-foreground">Sobra Mensal</p>
            </div>
            <p className={`text-2xl font-display font-bold ${monthlyBalance < 0 ? "text-destructive" : "text-success"}`}>
              {formatCurrency(monthlyBalance)}
            </p>
          </div>
          <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Projeção 12 meses</p>
            </div>
            <p className="text-2xl font-display font-bold text-primary">
              {formatCurrency(Math.max(0, monthlyBalance * 12))}
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPatrimonio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
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
              <Area
                type="monotone"
                dataKey="patrimonio"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPatrimonio)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}