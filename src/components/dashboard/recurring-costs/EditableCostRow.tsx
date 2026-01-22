import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Check, X } from "lucide-react";

interface EditableCostRowProps {
  cost: {
    id: string;
    name: string;
    amount: number;
  };
  onUpdate: (id: string, updates: { name?: string; amount?: number }) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  formatCurrency: (value: number) => string;
}

export function EditableCostRow({ cost, onUpdate, onDelete, formatCurrency }: EditableCostRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(cost.name);
  const [editAmount, setEditAmount] = useState(cost.amount.toString());

  const handleSave = async () => {
    const success = await onUpdate(cost.id, {
      name: editName.trim(),
      amount: Number(editAmount),
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(cost.name);
    setEditAmount(cost.amount.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20">
        {/* Mobile editing layout */}
        <div className="flex flex-col gap-2 md:hidden">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nome"
            className="h-10 rounded-lg text-sm"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              placeholder="Valor"
              className="flex-1 h-10 rounded-lg text-sm"
            />
            <Button
              size="icon"
              className="h-10 w-10 rounded-lg shrink-0"
              onClick={handleSave}
              disabled={!editName.trim() || !editAmount}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-lg shrink-0"
              onClick={handleCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Desktop editing layout */}
        <div className="hidden md:flex items-center gap-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Nome"
            className="flex-1 h-10 rounded-lg"
          />
          <Input
            type="number"
            inputMode="numeric"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            placeholder="Valor"
            className="w-32 h-10 rounded-lg"
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-lg shrink-0"
            onClick={handleSave}
            disabled={!editName.trim() || !editAmount}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-lg shrink-0"
            onClick={handleCancel}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/30 border border-border/50 group">
      <span className="font-medium text-sm md:text-base truncate mr-2">{cost.name}</span>
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <span className="text-muted-foreground text-sm md:text-base">{formatCurrency(cost.amount)}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(cost.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
