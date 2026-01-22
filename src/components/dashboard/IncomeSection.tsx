import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, User, Users } from "lucide-react";

interface IncomeSectionProps {
  userName: string | null;
  partnerName: string | null;
  userIncome: number;
  partnerIncome: number;
  onUserIncomeChange: (value: number) => void;
  onPartnerIncomeChange: (value: number) => void;
}

export function IncomeSection({
  userName,
  partnerName,
  userIncome,
  partnerIncome,
  onUserIncomeChange,
  onPartnerIncomeChange,
}: IncomeSectionProps) {
  const combinedIncome = userIncome + partnerIncome;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <div className="space-y-3">
      {/* Individual incomes - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        {/* User income */}
        <div className="space-y-2 p-3 md:p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-primary" />
            </div>
            <Label htmlFor="user-income" className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">
              {userName || "Você"}
            </Label>
          </div>
          <Input
            id="user-income"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={userIncome || ""}
            onChange={(e) => onUserIncomeChange(Number(e.target.value))}
            className="text-sm md:text-base font-display font-semibold bg-background/80 border-0 h-9 md:h-10 rounded-lg"
          />
        </div>

        {/* Partner income */}
        <div className="space-y-2 p-3 md:p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-accent" />
            </div>
            <Label htmlFor="partner-income" className="text-[10px] md:text-xs font-medium text-muted-foreground truncate">
              {partnerName || "Parceiro(a)"}
            </Label>
          </div>
          <Input
            id="partner-income"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={partnerIncome || ""}
            onChange={(e) => onPartnerIncomeChange(Number(e.target.value))}
            className="text-sm md:text-base font-display font-semibold bg-background/80 border-0 h-9 md:h-10 rounded-lg"
          />
        </div>
      </div>

      {/* Combined total */}
      <div className="p-3 md:p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          </div>
          <span className="text-xs md:text-sm font-medium text-muted-foreground">Renda Combinada</span>
        </div>
        <span className="text-base md:text-xl font-display font-bold text-primary">
          {formatCurrency(combinedIncome)}
        </span>
      </div>
    </div>
  );
}
