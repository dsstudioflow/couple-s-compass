import { useCoupleData } from "@/hooks/useCoupleData";
import { ViabilityCard } from "./dashboard/ViabilityCard";
import { CoupleProfileCard } from "./dashboard/CoupleProfileCard";
import { WeddingCalculator } from "./dashboard/WeddingCalculator";
import { WeddingPieChart } from "./dashboard/WeddingPieChart";
import { WeddingComparisonChart } from "./dashboard/WeddingComparisonChart";
import { HousingPlanner } from "./dashboard/HousingPlanner";
import { RecurringCosts } from "./dashboard/RecurringCosts";
import { WealthProjectionChart } from "./dashboard/WealthProjectionChart";
import { Loader2 } from "lucide-react";

export function DashboardContent() {
  const data = useCoupleData();

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse-soft" />
            <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
          </div>
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section id="viability" className="animate-fade-in">
        <ViabilityCard data={data} />
      </section>
      
      <section id="couple-profile" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CoupleProfileCard data={data} />
      </section>

      <section id="wedding" className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="grid gap-6 lg:grid-cols-2">
          <WeddingCalculator data={data} />
          <WeddingPieChart weddingCosts={data.weddingCosts} />
        </div>
        <WeddingComparisonChart weddingCosts={data.weddingCosts} />
      </section>

      <section id="housing" className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <HousingPlanner data={data} />
      </section>

      <section id="recurring" className="animate-fade-in" style={{ animationDelay: "400ms" }}>
        <RecurringCosts data={data} />
      </section>

      <section id="projection" className="animate-fade-in" style={{ animationDelay: "500ms" }}>
        <WealthProjectionChart data={data} />
      </section>
    </div>
  );
}