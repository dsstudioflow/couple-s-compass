import { useCoupleData } from "@/hooks/useCoupleData";
import { ViabilityCard } from "./dashboard/ViabilityCard";
import { WeddingCalculator } from "./dashboard/WeddingCalculator";
import { HousingPlanner } from "./dashboard/HousingPlanner";
import { RecurringCosts } from "./dashboard/RecurringCosts";
import { WeddingPieChart } from "./dashboard/WeddingPieChart";
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
      <ViabilityCard data={data} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <WeddingCalculator data={data} />
        <WeddingPieChart weddingCosts={data.weddingCosts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HousingPlanner data={data} />
        <RecurringCosts data={data} />
      </div>
    </div>
  );
}