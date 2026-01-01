import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          Custos Mensais Recorrentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ex: Luz, Internet..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Valor"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-28"
          />
          <Button size="icon" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {recurringCosts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringCosts.map((cost) => (
                <TableRow key={cost.id}>
                  <TableCell>{cost.name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cost.amount)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteRecurringCost(cost.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold">Total</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(total)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Adicione seus custos mensais acima
          </p>
        )}
      </CardContent>
    </Card>
  );
}