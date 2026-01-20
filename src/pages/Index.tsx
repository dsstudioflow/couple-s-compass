import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { DashboardContent } from "@/components/DashboardContent";
import { Loader2, Sparkles } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <header className="relative h-14 md:h-16 border-b border-border/50 flex items-center px-4 md:px-6 bg-background/80 backdrop-blur-xl sticky top-0 z-10 safe-top">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base md:text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text truncate">
              Planejador Financeiro
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground -mt-0.5 hidden sm:block">
              Organize seu futuro a dois
            </p>
          </div>
        </div>
      </header>

      <main className="relative px-3 py-4 md:p-6 lg:p-8 pb-32 md:pb-28 max-w-7xl mx-auto">
        <DashboardContent />
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
