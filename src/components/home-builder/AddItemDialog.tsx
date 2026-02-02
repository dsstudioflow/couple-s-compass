import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Link, Loader2, X } from "lucide-react";
import { HomeItem } from "./types";
import { ROOMS, ITEM_TYPES, PRIORITIES, NewHomeItem } from "@/hooks/useHomeItems";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Partial<NewHomeItem> & { name: string; room: string; item_type: string }) => Promise<HomeItem | null>;
  onUploadImage: (file: File, itemId: string) => Promise<string | null>;
  onUpdateItem: (id: string, updates: Partial<HomeItem>) => Promise<boolean>;
  editItem?: HomeItem | null;
}

export function AddItemDialog({ 
  open, 
  onOpenChange, 
  onAdd, 
  onUploadImage,
  onUpdateItem,
  editItem 
}: AddItemDialogProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    room: "sala",
    item_type: "moveis",
    estimated_price: "",
    actual_price: "",
    priority: "medium",
    store_link: "",
    notes: "",
  });

  // Reset form when dialog opens/closes or editItem changes
  useState(() => {
    if (open && editItem) {
      setFormData({
        name: editItem.name,
        room: editItem.room,
        item_type: editItem.item_type,
        estimated_price: editItem.estimated_price?.toString() || "",
        actual_price: editItem.actual_price?.toString() || "",
        priority: editItem.priority,
        store_link: editItem.store_link || "",
        notes: editItem.notes || "",
      });
      setImagePreview(editItem.image_url);
    } else if (open) {
      setFormData({
        name: "",
        room: "sala",
        item_type: "moveis",
        estimated_price: "",
        actual_price: "",
        priority: "medium",
        store_link: "",
        notes: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);

    try {
      if (editItem) {
        // Update existing item
        let imageUrl = editItem.image_url;
        
        if (imageFile) {
          const url = await onUploadImage(imageFile, editItem.id);
          if (url) imageUrl = url;
        }

        await onUpdateItem(editItem.id, {
          name: formData.name,
          room: formData.room,
          item_type: formData.item_type,
          estimated_price: Number(formData.estimated_price) || 0,
          actual_price: Number(formData.actual_price) || 0,
          priority: formData.priority as "low" | "medium" | "high",
          store_link: formData.store_link || null,
          notes: formData.notes || null,
          image_url: imageUrl,
        });
      } else {
        // Create new item
        const newItem = await onAdd({
          name: formData.name,
          room: formData.room,
          item_type: formData.item_type,
          estimated_price: Number(formData.estimated_price) || 0,
          actual_price: Number(formData.actual_price) || 0,
          priority: formData.priority as "low" | "medium" | "high",
          store_link: formData.store_link || null,
          notes: formData.notes || null,
          status: "pending",
          purchased_at: null,
          image_url: null,
        });

        // Upload image if selected
        if (newItem && imageFile) {
          const imageUrl = await onUploadImage(imageFile, newItem.id);
          if (imageUrl) {
            await onUpdateItem(newItem.id, { image_url: imageUrl });
          }
        }
      }

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editItem ? "Editar Item" : "Adicionar Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Imagem (opcional)</Label>
            <div 
              className="relative h-32 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                  <Camera className="h-8 w-8" />
                  <span className="text-xs">Clique para adicionar</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-muted-foreground">Nome do item *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Sofá 3 lugares"
              className="h-11"
              required
            />
          </div>

          {/* Room and Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Cômodo</Label>
              <Select 
                value={formData.room} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, room: v }))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map(room => (
                    <SelectItem key={room.key} value={room.key}>{room.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Select 
                value={formData.item_type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, item_type: v }))}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_TYPES.map(type => (
                    <SelectItem key={type.key} value={type.key}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Preço Estimado</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={formData.estimated_price}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_price: e.target.value }))}
                placeholder="R$ 0"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Preço Real</Label>
              <Input
                type="number"
                inputMode="numeric"
                value={formData.actual_price}
                onChange={(e) => setFormData(prev => ({ ...prev, actual_price: e.target.value }))}
                placeholder="R$ 0"
                className="h-11"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Prioridade</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(p => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Store link */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Link da loja (opcional)</Label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="url"
                value={formData.store_link}
                onChange={(e) => setFormData(prev => ({ ...prev, store_link: e.target.value }))}
                placeholder="https://..."
                className="h-11 pl-9"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Observações (opcional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Cor, tamanho, modelo..."
              rows={2}
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-11" disabled={loading || !formData.name.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editItem ? "Salvar Alterações" : "Adicionar Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
