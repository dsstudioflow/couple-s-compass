import { Heart, Home, Receipt, TrendingUp, Calendar, Users, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

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
  const [activeSection, setActiveSection] = useState("viability");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
    );

    menuItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl shadow-black/10 dark:shadow-black/30">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-xl h-11 w-11 transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110" 
                      : "hover:bg-muted hover:scale-105"
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "animate-pulse-soft" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2 font-medium">
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        <div className="w-px h-8 bg-border mx-2" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-11 w-11 hover:bg-muted transition-all duration-300 hover:scale-105"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="mb-2">
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-11 w-11 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-105"
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="mb-2">
            Sair
          </TooltipContent>
        </Tooltip>
      </div>
    </nav>
  );
}