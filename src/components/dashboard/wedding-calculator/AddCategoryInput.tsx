import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddCategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export function AddCategoryInput({ value, onChange, onAdd }: AddCategoryInputProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
      <Input
        placeholder="Nova categoria (ex: Lua de Mel)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        className="h-11 min-w-0 flex-1 rounded-xl border-border/50 text-sm"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        disabled={!value.trim()}
        className="h-11 rounded-xl px-4 w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar
      </Button>
    </div>
  );
}
