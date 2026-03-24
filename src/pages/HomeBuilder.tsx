import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { HomeBuilderContent } from "@/components/home-builder/HomeBuilderContent";
import { Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const HomeBuilder = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-accent/15 rounded-full animate-pulse-soft" />
            <Loader2 className="w-8 h-8 animate-spin text-primary relative" />
          </div>
          <p className="text-sm text-muted-foreground font-display italic">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 bg-gradient-to-bl from-primary/4 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 bg-gradient-to-tr from-accent/4 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <header className="relative h-14 md:h-16 border-b border-border/40 flex items-center justify-between px-4 md:px-6 bg-background/90 backdrop-blur-xl sticky top-0 z-10 safe-top">
        <div className="flex items-center gap-2 md:gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg" asChild>
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar</TooltipContent>
          </Tooltip>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base md:text-lg font-semibold italic truncate">
              Construindo o Lar
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground -mt-0.5 hidden sm:block">
              Organize os itens da sua casa
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</TooltipContent>
          </Tooltip>
          <ProfileDropdown />
        </div>
      </header>

      <main className="relative px-3 py-4 md:p-6 lg:p-8 pb-8 max-w-7xl mx-auto">
        <HomeBuilderContent />
      </main>
    </div>
  );
};

export default HomeBuilder;
