import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Save, Check, Sparkles, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryRow } from "./wedding-calculator/CategoryRow";
import { AddCategoryInput } from "./wedding-calculator/AddCategoryInput";
import { TotalsDisplay } from "./wedding-calculator/TotalsDisplay";
import { useWeddingCalculator } from "./wedding-calculator/useWeddingCalculator";
import { WeddingCalculatorProps, SCENARIOS } from "./wedding-calculator/types";

export function WeddingCalculator({ data }: WeddingCalculatorProps) {
  const { weddingCosts, saveAllWeddingCosts } = data;
  
  const {
    mode,
    activeScenario,
    orderedCategories,
    hasChanges,
    isSaving,
    justSaved,
    newCategoryName,
    totalPlanned,
    totalActual,
    setNewCategoryName,
    handleModeChange,
    handleInputChange,
    handleLabelChange,
    handleScenario,
    handleAddCategory,
    handleRemoveCategory,
    handleMoveCategory,
    handleSave,
    isFixedCategory,
  } = useWeddingCalculator({ weddingCosts, saveAllWeddingCosts });

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="flex flex-col gap-3 pb-3 md:pb-4 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <CardTitle className="font-display text-lg md:text-xl">Calculadora de Casamento</CardTitle>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`rounded-xl h-10 px-4 w-full sm:w-auto ${justSaved ? "bg-success hover:bg-success" : ""}`}
          >
            {justSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Salvo
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar"}
              </>
            )}
          </Button>
        </div>

        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'presets' | 'custom')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger 
              value="presets" 
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Modelos Prontos</span>
              <span className="sm:hidden">Modelos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Personalizado</span>
              <span className="sm:hidden">Livre</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="space-y-4 md:space-y-5 px-4 md:px-6">
        {/* Scenario buttons - only in presets mode */}
        {mode === 'presets' && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
            {(["economico", "padrao", "luxo"] as const).map((scenario) => (
              <Button
                key={scenario}
                variant={activeScenario === scenario ? "default" : "outline"}
                size="sm"
                onClick={() => handleScenario(scenario)}
                className="rounded-xl shrink-0 text-xs md:text-sm"
              >
                {scenario === "economico" ? (
                  <>💰 Econômico</>
                ) : scenario === "padrao" ? (
                  <>✨ Padrão</>
                ) : (
                  <>👑 Luxo</>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Custom mode empty state */}
        {mode === 'custom' && orderedCategories.length === 0 && (
          <div className="text-center py-8 px-4 rounded-xl bg-muted/30 border border-dashed border-border">
            <Palette className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-display font-semibold text-base mb-1">Modo Personalizado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione suas próprias categorias de custos do casamento. Você tem total liberdade para criar e organizar como preferir.
            </p>
          </div>
        )}
        
        {/* Categories list */}
        {orderedCategories.length > 0 && (
          <div className="space-y-2">
            {/* Header - hidden on mobile, visible on larger screens */}
            <div className="hidden md:grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-3 text-xs font-medium text-muted-foreground px-1">
              <span className="w-10"></span>
              <span>Categoria</span>
              <span>Planejado</span>
              <span>Real</span>
              <span className="w-8"></span>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {orderedCategories.map((cat, index) => (
                <CategoryRow
                  key={cat.key}
                  category={cat}
                  index={index}
                  totalCount={orderedCategories.length}
                  isFixed={isFixedCategory(cat.key)}
                  onInputChange={handleInputChange}
                  onLabelChange={handleLabelChange}
                  onMove={handleMoveCategory}
                  onRemove={handleRemoveCategory}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Category */}
        <AddCategoryInput
          value={newCategoryName}
          onChange={setNewCategoryName}
          onAdd={handleAddCategory}
        />

        {/* Totals */}
        {orderedCategories.length > 0 && (
          <TotalsDisplay totalPlanned={totalPlanned} totalActual={totalActual} />
        )}

        {hasChanges && (
          <p className="text-xs text-muted-foreground text-center animate-pulse">
            Você tem alterações não salvas
          </p>
        )}
      </CardContent>
    </Card>
  );
}
