import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Receipt, Plus, Trash2 } from "lucide-react";

interface RecurringCostsProps {
  data: {
    recurringCosts: { id: string; name: string; amount: number; category: string }[];
    addRecurringCost: (cost: { name: string; amount: number; category: string }) => Promise<{ id: string } | null>;
    deleteRecurringCost: (id: string) => Promise<boolean>;
  };
}

export function RecurringCosts({ data }: RecurringCostsProps) {
  const { recurringCosts, addRecurringCost, deleteRecurringCost } = data;
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleAdd = async () => {
    if (!newName.trim() || !newAmount) return;
    await addRecurringCost({ name: newName.trim(), amount: Number(newAmount), category: "outros" });
    setNewName("");
    setNewAmount("");
  };

  const total = recurringCosts.reduce((sum, c) => sum + c.amount, 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4 md:w-5 md:h-5 text-accent" />
          </div>
          <CardTitle className="font-display text-lg md:text-xl">Custos Mensais Recorrentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-5 px-4 md:px-6">
        {/* Add new cost - stacked on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Input
            placeholder="Ex: Luz, Internet..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 h-11 md:h-12 rounded-xl border-border/50 text-sm md:text-base"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="Valor"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 sm:w-28 md:w-32 h-11 md:h-12 rounded-xl border-border/50 text-sm md:text-base"
            />
            <Button 
              size="icon" 
              onClick={handleAdd}
              disabled={!newName.trim() || !newAmount}
              className="h-11 w-11 md:h-12 md:w-12 rounded-xl shrink-0"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>

        {recurringCosts.length > 0 ? (
          <div className="space-y-2">
            {recurringCosts.map((cost) => (
              <div 
                key={cost.id}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30 border border-border/50 group"
              >
                <span className="font-medium text-sm md:text-base truncate mr-2">{cost.name}</span>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <span className="text-muted-foreground text-sm md:text-base">{formatCurrency(cost.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteRecurringCost(cost.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Total */}
            <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-accent/5 border border-accent/20 mt-3 md:mt-4">
              <span className="font-display font-semibold text-sm md:text-base">Total Mensal</span>
              <span className="font-display font-bold text-base md:text-lg text-accent">{formatCurrency(total)}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 text-muted-foreground">
            <Receipt className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-30" />
            <p className="text-sm md:text-base">Nenhum custo cadastrado</p>
            <p className="text-xs md:text-sm">Adicione seus gastos mensais acima</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
