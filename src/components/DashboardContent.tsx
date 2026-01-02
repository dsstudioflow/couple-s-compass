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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <section id="viability">
        <ViabilityCard data={data} />
      </section>
      
      <section id="couple-profile">
        <CoupleProfileCard data={data} />
      </section>

      <section id="wedding" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <WeddingCalculator data={data} />
          <WeddingPieChart weddingCosts={data.weddingCosts} />
        </div>
        <WeddingComparisonChart weddingCosts={data.weddingCosts} />
      </section>

      <section id="housing">
        <HousingPlanner data={data} />
      </section>

      <section id="recurring">
        <RecurringCosts data={data} />
      </section>

      <section id="projection">
        <WealthProjectionChart data={data} />
      </section>
    </div>
  );
}
