import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Trash2, GripVertical } from "lucide-react";
import { HomeItem } from "./types";
import { ROOMS, ITEM_TYPES } from "@/hooks/useHomeItems";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";

interface HomeItemListProps {
  items: HomeItem[];
  onToggleStatus: (id: string) => void;
  onEdit: (item: HomeItem) => void;
  onDelete: (id: string) => void;
}

function SortableItem({ item, onToggleStatus, onEdit, onDelete }: {
  item: HomeItem;
  onToggleStatus: (id: string) => void;
  onEdit: (item: HomeItem) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const roomLabel = ROOMS.find((r) => r.key === item.room)?.label || item.room;
  const typeLabel = ITEM_TYPES.find((t) => t.key === item.item_type)?.label || item.item_type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-xl border bg-card hover:shadow-md transition-all ${
        item.status === "purchased" ? "bg-success/5 border-success/30" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground hover:text-foreground p-1 shrink-0"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="cursor-pointer" onClick={() => onToggleStatus(item.id)}>
        <Checkbox checked={item.status === "purchased"} className="pointer-events-none" />
      </div>

      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Sem foto
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm truncate ${item.status === "purchased" ? "line-through text-muted-foreground" : ""}`}>
            {item.name}
          </span>
          {item.priority === "high" && (
            <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">!</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">{roomLabel}</Badge>
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{typeLabel}</Badge>
        </div>
      </div>

      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-xs text-muted-foreground">Est: {formatCurrency(item.estimated_price)}</p>
        {item.actual_price > 0 && (
          <p className={`text-xs font-medium ${item.actual_price <= item.estimated_price ? "text-success" : "text-destructive"}`}>
            Real: {formatCurrency(item.actual_price)}
          </p>
        )}
      </div>

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
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function HomeItemList({ items, onToggleStatus, onEdit, onDelete }: HomeItemListProps) {
  const [orderedItems, setOrderedItems] = useState(items);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  if (orderedItems.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {orderedItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
