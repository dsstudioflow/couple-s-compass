import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ExternalLink, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Package,
  Gift
} from "lucide-react";
import { HomeItem } from "./types";
import { ROOMS, ITEM_TYPES, PRIORITIES } from "@/hooks/useHomeItems";

interface HomeItemCardProps {
  item: HomeItem;
  onToggleStatus: (id: string) => void;
  onEdit: (item: HomeItem) => void;
  onDelete: (id: string) => void;
  onToggleGifted: (id: string, isGifted: boolean) => void;
}

export function HomeItemCard({ item, onToggleStatus, onEdit, onDelete, onToggleGifted }: HomeItemCardProps) {
  const roomLabel = ROOMS.find(r => r.key === item.room)?.label || item.room;
  const typeLabel = ITEM_TYPES.find(t => t.key === item.item_type)?.label || item.item_type;
  const priority = PRIORITIES.find(p => p.key === item.priority);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  return (
    <Card className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
      item.status === "purchased" ? "bg-success/5 border-success/30" : ""
    } ${item.is_gifted ? "ring-2 ring-success/50" : ""}`}>
      {/* Image or placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="w-10 h-10 text-muted-foreground/40" />
          </div>
        )}
        
        {/* Status checkbox overlay */}
        <div className="absolute top-2 left-2">
          <div 
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-background/90 backdrop-blur-sm shadow-sm cursor-pointer"
            onClick={() => onToggleStatus(item.id)}
          >
            <Checkbox 
              checked={item.status === "purchased"}
              className="pointer-events-none"
            />
          </div>
        </div>

        {/* Actions dropdown */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-7 w-7 rounded-lg shadow-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(item.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Priority badge */}
        {item.priority === "high" && !item.is_gifted && (
          <Badge 
            variant="destructive" 
            className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5"
          >
            Prioridade
          </Badge>
        )}

        {/* Gifted badge */}
        {item.is_gifted && (
          <Badge 
            className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 bg-success text-success-foreground"
          >
            <Gift className="w-3 h-3 mr-1" />
            Presenteado
          </Badge>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Title and status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-medium text-sm line-clamp-1 ${
            item.status === "purchased" ? "line-through text-muted-foreground" : ""
          }`}>
            {item.name}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {roomLabel}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {typeLabel}
          </Badge>
        </div>

        {/* Prices */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="text-xs">
            <span className="text-muted-foreground">Est: </span>
            <span className="font-medium">{formatCurrency(item.estimated_price)}</span>
          </div>
          {item.actual_price > 0 && (
            <div className="text-xs">
              <span className="text-muted-foreground">Real: </span>
              <span className={`font-medium ${
                item.actual_price <= item.estimated_price ? "text-success" : "text-destructive"
              }`}>
                {formatCurrency(item.actual_price)}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          {item.store_link ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
              asChild
            >
              <a href={item.store_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1" />
                Ver na loja
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs opacity-50"
              disabled
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Sem link
            </Button>
          )}
          <Button
            variant={item.is_gifted ? "default" : "outline"}
            size="sm"
            className={`flex-1 h-8 text-xs ${item.is_gifted ? "bg-success hover:bg-success/90 text-success-foreground" : ""}`}
            onClick={() => onToggleGifted(item.id, !item.is_gifted)}
          >
            <Gift className="w-3 h-3 mr-1" />
            {item.is_gifted ? "Presenteado" : "Presentear"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
