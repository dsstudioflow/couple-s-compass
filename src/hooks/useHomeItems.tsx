import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface HomeItem {
  id: string;
  couple_id: string;
  name: string;
  room: string;
  item_type: string;
  estimated_price: number;
  actual_price: number;
  status: "pending" | "purchased";
  priority: "low" | "medium" | "high";
  store_link: string | null;
  image_url: string | null;
  notes: string | null;
  purchased_at: string | null;
  is_gifted: boolean;
  created_at: string;
  updated_at: string;
}

export type NewHomeItem = Omit<HomeItem, "id" | "couple_id" | "created_at" | "updated_at">;

export const ROOMS = [
  { key: "sala", label: "Sala" },
  { key: "quarto", label: "Quarto" },
  { key: "cozinha", label: "Cozinha" },
  { key: "banheiro", label: "Banheiro" },
  { key: "area_servico", label: "Área de Serviço" },
  { key: "escritorio", label: "Escritório" },
  { key: "varanda", label: "Varanda" },
  { key: "outro", label: "Outro" },
];

export const ITEM_TYPES = [
  { key: "moveis", label: "Móveis" },
  { key: "eletrodomesticos", label: "Eletrodomésticos" },
  { key: "decoracao", label: "Decoração" },
  { key: "utensilios", label: "Utensílios" },
  { key: "eletronicos", label: "Eletrônicos" },
  { key: "outro", label: "Outro" },
];

export const PRIORITIES = [
  { key: "high", label: "Alta", color: "text-destructive" },
  { key: "medium", label: "Média", color: "text-warning" },
  { key: "low", label: "Baixa", color: "text-muted-foreground" },
];

export function useHomeItems(coupleId: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HomeItem[]>([]);

  const fetchItems = useCallback(async () => {
    if (!coupleId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home_items")
        .select("*")
        .eq("couple_id", coupleId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data as HomeItem[]) || []);
    } catch (error) {
      console.error("Error fetching home items:", error);
      toast({
        title: "Erro ao carregar itens",
        description: "Não foi possível carregar os itens do lar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [coupleId, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (item: Partial<NewHomeItem> & { name: string; room: string; item_type: string }) => {
    if (!coupleId) return null;

    try {
      const { data, error } = await supabase
        .from("home_items")
        .insert({
          couple_id: coupleId,
          name: item.name,
          room: item.room,
          item_type: item.item_type,
          estimated_price: item.estimated_price ?? 0,
          actual_price: item.actual_price ?? 0,
          status: item.status ?? "pending",
          priority: item.priority ?? "medium",
          store_link: item.store_link ?? null,
          image_url: item.image_url ?? null,
          notes: item.notes ?? null,
          purchased_at: item.purchased_at ?? null,
          is_gifted: item.is_gifted ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data as HomeItem, ...prev]);
      toast({ title: "Item adicionado!", description: `${item.name} foi adicionado com sucesso.` });
      return data as HomeItem;
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return null;
    }
  };

  const updateItem = async (id: string, updates: Partial<HomeItem>) => {
    try {
      const { error } = await supabase
        .from("home_items")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      return true;
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return false;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Get item to check for image
      const item = items.find(i => i.id === id);
      
      // Delete image from storage if exists
      if (item?.image_url) {
        const path = item.image_url.split("/home-items/")[1];
        if (path) {
          await supabase.storage.from("home-items").remove([path]);
        }
      }

      const { error } = await supabase
        .from("home_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast({ title: "Item removido", description: "O item foi removido com sucesso." });
      return true;
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return false;
    }
  };

  const toggleStatus = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return false;

    const newStatus = item.status === "pending" ? "purchased" : "pending";
    const purchasedAt = newStatus === "purchased" ? new Date().toISOString() : null;

    return updateItem(id, { status: newStatus, purchased_at: purchasedAt });
  };

  const uploadImage = async (file: File, itemId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${itemId}-${Date.now()}.${fileExt}`;
      const filePath = `${coupleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("home-items")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("home-items")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      return null;
    }
  };

  // Computed stats
  const giftedItems = items.filter(i => i.is_gifted);
  const stats = {
    totalItems: items.length,
    purchasedItems: items.filter(i => i.status === "purchased").length,
    pendingItems: items.filter(i => i.status === "pending").length,
    totalEstimated: items.reduce((sum, i) => sum + (i.estimated_price || 0), 0),
    totalActual: items.filter(i => !i.is_gifted).reduce((sum, i) => sum + (i.actual_price || 0), 0),
    giftedItems: giftedItems.length,
    giftedSavings: giftedItems.reduce((sum, i) => sum + (i.estimated_price || 0), 0),
    byRoom: ROOMS.map(room => ({
      room: room.label,
      key: room.key,
      estimated: items.filter(i => i.room === room.key).reduce((sum, i) => sum + (i.estimated_price || 0), 0),
      actual: items.filter(i => i.room === room.key).reduce((sum, i) => sum + (i.actual_price || 0), 0),
      count: items.filter(i => i.room === room.key).length,
    })).filter(r => r.count > 0),
    byType: ITEM_TYPES.map(type => ({
      type: type.label,
      key: type.key,
      estimated: items.filter(i => i.item_type === type.key).reduce((sum, i) => sum + (i.estimated_price || 0), 0),
      actual: items.filter(i => i.item_type === type.key).reduce((sum, i) => sum + (i.actual_price || 0), 0),
      count: items.filter(i => i.item_type === type.key).length,
    })).filter(t => t.count > 0),
  };

  return {
    loading,
    items,
    stats,
    addItem,
    updateItem,
    deleteItem,
    toggleStatus,
    uploadImage,
    refetch: fetchItems,
  };
}
