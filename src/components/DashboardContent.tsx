import { useCoupleData } from "@/hooks/useCoupleData";
import { ViabilityCard } from "@/components/dashboard/ViabilityCard";
import { CoupleProfileCard } from "@/components/dashboard/CoupleProfileCard";
import { WeddingCalculator } from "@/components/dashboard/WeddingCalculator";
import { WeddingPieChart } from "@/components/dashboard/WeddingPieChart";
import { WeddingComparisonChart } from "@/components/dashboard/WeddingComparisonChart";
import { HousingPlanner } from "@/components/dashboard/HousingPlanner";
import { RecurringCosts } from "@/components/dashboard/RecurringCosts";
import { WealthProjectionChart } from "@/components/dashboard/WealthProjectionChart";
import { Loader2 } from "lucide-react";

export function DashboardContent() {
  const data = useCoupleData();

  if (data.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <section id="viability" className="animate-fade-in">
        <ViabilityCard data={data} />
      </section>
      
      <section id="couple-profile" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <CoupleProfileCard data={data} />
      </section>

      <section id="wedding" className="space-y-4 md:space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
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
