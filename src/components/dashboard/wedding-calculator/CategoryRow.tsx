import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface CategoryRowProps {
  category: {
    key: string;
    label: string;
    planned_amount: number;
    actual_amount: number;
  };
  index: number;
  totalCount: number;
  isFixed: boolean;
  onInputChange: (category: string, field: "planned_amount" | "actual_amount", value: number) => void;
  onMove: (key: string, direction: "up" | "down") => void;
  onRemove: (key: string) => void;
}

export function CategoryRow({
  category,
  index,
  totalCount,
  isFixed,
  onInputChange,
  onMove,
  onRemove,
}: CategoryRowProps) {
  return (
    <div className="p-3 md:p-2 rounded-xl bg-muted/30 border border-border/50 transition-colors">
      {/* Mobile layout */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{category.label}</Label>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => onMove(category.key, "up")}
              disabled={index === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => onMove(category.key, "down")}
              disabled={index === totalCount - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            {!isFixed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(category.key)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Planejado</span>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="R$ 0"
              value={category.planned_amount || ""}
              onChange={(e) => onInputChange(category.key, "planned_amount", Number(e.target.value))}
              className="text-sm h-10 rounded-lg border-border/50"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground">Real</span>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="R$ 0"
              value={category.actual_amount || ""}
              onChange={(e) => onInputChange(category.key, "actual_amount", Number(e.target.value))}
              className="text-sm h-10 rounded-lg border-border/50"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-3 items-center">
        <div className="flex flex-col w-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            onClick={() => onMove(category.key, "up")}
            disabled={index === 0}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            onClick={() => onMove(category.key, "down")}
            disabled={index === totalCount - 1}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        
        <Label htmlFor={`${category.key}-planned`} className="text-sm font-medium truncate">
          {category.label}
        </Label>
        <Input
          id={`${category.key}-planned`}
          type="number"
          placeholder="R$ 0"
          value={category.planned_amount || ""}
          onChange={(e) => onInputChange(category.key, "planned_amount", Number(e.target.value))}
          className="text-sm h-9 rounded-lg border-border/50"
        />
        <Input
          id={`${category.key}-actual`}
          type="number"
          placeholder="R$ 0"
          value={category.actual_amount || ""}
          onChange={(e) => onInputChange(category.key, "actual_amount", Number(e.target.value))}
          className="text-sm h-9 rounded-lg border-border/50"
        />
        
        <div className="w-8">
          {!isFixed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(category.key)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
