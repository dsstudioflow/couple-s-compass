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
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className="font-display text-xl">Custos Mensais Recorrentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Add new cost */}
        <div className="flex gap-3">
          <Input
            placeholder="Ex: Luz, Internet, Streaming..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 h-12 rounded-xl border-border/50"
          />
          <Input
            type="number"
            placeholder="Valor"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="w-32 h-12 rounded-xl border-border/50"
          />
          <Button 
            size="icon" 
            onClick={handleAdd}
            disabled={!newName.trim() || !newAmount}
            className="h-12 w-12 rounded-xl shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {recurringCosts.length > 0 ? (
          <div className="space-y-2">
            {recurringCosts.map((cost) => (
              <div 
                key={cost.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group"
              >
                <span className="font-medium">{cost.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{formatCurrency(cost.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteRecurringCost(cost.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 mt-4">
              <span className="font-display font-semibold">Total Mensal</span>
              <span className="font-display font-bold text-lg text-accent">{formatCurrency(total)}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum custo cadastrado</p>
            <p className="text-sm">Adicione seus gastos mensais acima</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}