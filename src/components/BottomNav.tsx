import { Heart, Home, Receipt, TrendingUp, Calendar, Users, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { title: "Visão Geral", icon: TrendingUp, id: "viability" },
  { title: "Perfil", icon: Users, id: "couple-profile" },
  { title: "Casamento", icon: Heart, id: "wedding" },
  { title: "Moradia", icon: Home, id: "housing" },
  { title: "Custos", icon: Receipt, id: "recurring" },
  { title: "Projeção", icon: Calendar, id: "projection" },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export function BottomNav() {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-background/80 backdrop-blur-xl border shadow-lg shadow-black/10 dark:shadow-black/30">
        {menuItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => scrollToSection(item.id)}
              >
                <item.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="mb-1">
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-muted transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="mb-1">
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="mb-1">
            Sair
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
}
