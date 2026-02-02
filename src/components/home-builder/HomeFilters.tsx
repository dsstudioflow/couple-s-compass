import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, Search, Filter } from "lucide-react";
import { ROOMS, ITEM_TYPES } from "@/hooks/useHomeItems";
import { ViewMode, FilterRoom, FilterType, FilterStatus } from "./types";

interface HomeFiltersProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRoom: FilterRoom;
  setFilterRoom: (room: FilterRoom) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
}

export function HomeFilters({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  filterRoom,
  setFilterRoom,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
}: HomeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar itens..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Filters row */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
        {/* Room filter */}
        <Select value={filterRoom} onValueChange={setFilterRoom}>
          <SelectTrigger className="h-10 w-[130px] shrink-0">
            <SelectValue placeholder="Cômodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos cômodos</SelectItem>
            {ROOMS.map((room) => (
              <SelectItem key={room.key} value={room.key}>
                {room.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type filter */}
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-10 w-[130px] shrink-0">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos tipos</SelectItem>
            {ITEM_TYPES.map((type) => (
              <SelectItem key={type.key} value={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
          <SelectTrigger className="h-10 w-[120px] shrink-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="purchased">Comprados</SelectItem>
          </SelectContent>
        </Select>

        {/* View mode toggle */}
        <div className="flex border rounded-lg overflow-hidden shrink-0">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-10 w-10 rounded-none"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
