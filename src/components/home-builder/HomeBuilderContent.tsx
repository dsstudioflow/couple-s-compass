import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Home, Loader2 } from "lucide-react";
import { useHomeItems } from "@/hooks/useHomeItems";
import { useCoupleData } from "@/hooks/useCoupleData";
import { HomeItem, ViewMode, FilterRoom, FilterType, FilterStatus } from "./types";
import { HomeStatsCards } from "./HomeStatsCards";
import { HomePieChart } from "./HomePieChart";
import { HomeBarChart } from "./HomeBarChart";
import { HomeFilters } from "./HomeFilters";
import { HomeItemCard } from "./HomeItemCard";
import { HomeItemList } from "./HomeItemList";
import { AddItemDialog } from "./AddItemDialog";

export function HomeBuilderContent() {
  const { coupleProfile, loading: profileLoading } = useCoupleData();
  const { 
    loading, 
    items, 
    stats, 
    addItem, 
    updateItem, 
    deleteItem, 
    toggleStatus, 
    uploadImage 
  } = useHomeItems(coupleProfile?.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<HomeItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoom, setFilterRoom] = useState<FilterRoom>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Room filter
      if (filterRoom !== "all" && item.room !== filterRoom) {
        return false;
      }
      // Type filter
      if (filterType !== "all" && item.item_type !== filterType) {
        return false;
      }
      // Status filter
      if (filterStatus !== "all" && item.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [items, searchQuery, filterRoom, filterType, filterStatus]);

  const handleEdit = (item: HomeItem) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditItem(null);
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
            <Home className="w-5 h-5 md:w-6 md:h-6 text-success" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold">Construindo o Lar</h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Organize os itens da sua casa nova
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <HomeStatsCards stats={stats} />

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <HomePieChart 
          data={stats.byRoom} 
          title="Distribuição por Cômodo" 
          dataKey="room" 
        />
        <HomePieChart 
          data={stats.byType} 
          title="Distribuição por Tipo" 
          dataKey="type" 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <HomeBarChart 
          data={stats.byRoom} 
          title="Estimado vs Real por Cômodo" 
          dataKey="room" 
        />
        <HomeBarChart 
          data={stats.byType} 
          title="Estimado vs Real por Tipo" 
          dataKey="type" 
        />
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Meus Itens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <HomeFilters
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterRoom={filterRoom}
            setFilterRoom={setFilterRoom}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Items grid/list */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredItems.map((item) => (
                <HomeItemCard
                  key={item.id}
                  item={item}
                  onToggleStatus={toggleStatus}
                  onEdit={handleEdit}
                  onDelete={deleteItem}
                  onToggleGifted={(id, isGifted) => updateItem(id, { is_gifted: isGifted })}
                />
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  {items.length === 0 
                    ? "Adicione seu primeiro item clicando no botão acima" 
                    : "Nenhum item encontrado com os filtros selecionados"}
                </div>
              )}
            </div>
          ) : (
            <HomeItemList
              items={filteredItems}
              onToggleStatus={toggleStatus}
              onEdit={handleEdit}
              onDelete={deleteItem}
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <AddItemDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onAdd={addItem}
        onUploadImage={uploadImage}
        onUpdateItem={updateItem}
        editItem={editItem}
      />
    </div>
  );
}
