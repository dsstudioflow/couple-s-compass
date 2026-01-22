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
    <div className="flex flex-col sm:flex-row gap-2">
      <Input
        placeholder="Nova categoria (ex: Lua de Mel)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
        className="text-sm flex-1 h-11 rounded-xl border-border/50"
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
