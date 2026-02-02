import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { HomeItem } from "./types";
import { ROOMS, ITEM_TYPES } from "@/hooks/useHomeItems";

interface HomeItemListProps {
  items: HomeItem[];
  onToggleStatus: (id: string) => void;
  onEdit: (item: HomeItem) => void;
  onDelete: (id: string) => void;
}

export function HomeItemList({ items, onToggleStatus, onEdit, onDelete }: HomeItemListProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const roomLabel = ROOMS.find((r) => r.key === item.room)?.label || item.room;
        const typeLabel = ITEM_TYPES.find((t) => t.key === item.item_type)?.label || item.item_type;

        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl border bg-card hover:shadow-md transition-all ${
              item.status === "purchased" ? "bg-success/5 border-success/30" : ""
            }`}
          >
            {/* Checkbox */}
            <div
              className="cursor-pointer"
              onClick={() => onToggleStatus(item.id)}
            >
              <Checkbox checked={item.status === "purchased"} className="pointer-events-none" />
            </div>

            {/* Image thumbnail */}
            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                  Sem foto
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium text-sm truncate ${
                    item.status === "purchased" ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {item.name}
                </span>
                {item.priority === "high" && (
                  <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">
                    !
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
                  {roomLabel}
                </Badge>
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                  {typeLabel}
                </Badge>
              </div>
            </div>

            {/* Prices */}
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-xs text-muted-foreground">
                Est: {formatCurrency(item.estimated_price)}
              </p>
              {item.actual_price > 0 && (
                <p
                  className={`text-xs font-medium ${
                    item.actual_price <= item.estimated_price ? "text-success" : "text-destructive"
                  }`}
                >
                  Real: {formatCurrency(item.actual_price)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {item.store_link && (
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <a href={item.store_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
