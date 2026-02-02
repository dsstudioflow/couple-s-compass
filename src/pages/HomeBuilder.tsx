import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { HomeBuilderContent } from "@/components/home-builder/HomeBuilderContent";
import { Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const HomeBuilder = () => {
  const { user, loading, signOut } = useAuth();
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
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse-soft" />
            <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Gradient background accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-success/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <header className="relative h-14 md:h-16 border-b border-border/50 flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-xl sticky top-0 z-10 safe-top">
        <div className="flex items-center gap-2 md:gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                <Link to="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar ao Dashboard</TooltipContent>
          </Tooltip>
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center shadow-sm shrink-0">
            <Home className="w-4 h-4 md:w-5 md:h-5 text-success" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base md:text-lg font-semibold truncate">
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
                className="rounded-xl"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
