import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingUp, 
  Users, 
  Heart, 
  Home, 
  Receipt, 
  Calendar, 
  Sun, 
  Moon, 
  LogOut,
  ChevronUp
} from "lucide-react";

const menuItems = [
  { id: "viability", title: "Visão Geral", icon: TrendingUp },
  { id: "couple-profile", title: "Perfil", icon: Users },
  { id: "wedding", title: "Casamento", icon: Heart },
  { id: "housing", title: "Moradia", icon: Home },
  { id: "recurring", title: "Custos", icon: Receipt },
  { id: "projection", title: "Projeção", icon: Calendar },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const header = document.querySelector("header");
    const headerHeight = header?.offsetHeight || 64;
    const y = element.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

export function BottomNav() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("viability");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up (mobile UX pattern)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Update active section based on scroll position
      const sections = menuItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      })).filter(s => s.element);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsExpanded(false);
  };

  // Get the 3 most important items for collapsed mobile view
  const primaryItems = menuItems.slice(0, 3);
  const secondaryItems = menuItems.slice(3);

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 safe-bottom ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Expanded menu (additional items) */}
      <div 
        className={`mx-4 mb-2 transition-all duration-300 origin-bottom ${
          isExpanded 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex justify-center gap-2 p-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl">
          {secondaryItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleNavClick(item.id)}
                className={`flex-1 flex-col gap-1 h-auto py-3 rounded-xl no-select transition-all ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "hover:bg-muted active:scale-95"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="mx-4 mb-4 md:mx-auto md:max-w-fit">
        <div className="flex items-center justify-between gap-1 px-2 py-2 md:px-4 md:py-3 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 shadow-xl shadow-black/10 dark:shadow-black/30">
          {/* Primary navigation items */}
          <div className="flex items-center gap-1">
            {primaryItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-xl h-11 w-11 md:h-12 md:w-12 transition-all duration-200 no-select ${
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105" 
                          : "hover:bg-muted active:scale-95"
                      }`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? "animate-pulse-soft" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="mb-2 font-medium hidden md:block">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Expand button for secondary items (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-xl h-11 w-11 md:h-12 md:w-12 transition-all duration-200 no-select ${
                isExpanded ? "bg-muted" : "hover:bg-muted"
              } active:scale-95`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronUp className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
          
          <div className="w-px h-8 bg-border mx-1 md:mx-2" />
          
          {/* Theme and logout buttons */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-11 w-11 md:h-12 md:w-12 hover:bg-muted transition-all duration-200 no-select active:scale-95"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2 hidden md:block">
                {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-11 w-11 md:h-12 md:w-12 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 no-select active:scale-95"
                  onClick={signOut}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2 hidden md:block">
                Sair
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </nav>
  );
}
