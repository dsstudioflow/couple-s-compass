import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BottomNav } from "@/components/BottomNav";
import { DashboardContent } from "@/components/DashboardContent";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";
import { Loader2, Heart } from "lucide-react";

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
      {/* Subtle organic background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/3 -right-1/3 w-2/3 h-2/3 bg-gradient-to-bl from-primary/4 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 bg-gradient-to-tr from-accent/4 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <header className="relative h-14 md:h-16 border-b border-border/40 flex items-center justify-between px-4 md:px-6 bg-background/90 backdrop-blur-xl sticky top-0 z-10 safe-top">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full gradient-accent flex items-center justify-center shrink-0">
            <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-base md:text-lg font-semibold italic text-foreground truncate">
              Nosso Planejamento
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground -mt-0.5 hidden sm:block">
              Organize seu futuro a dois
            </p>
          </div>
        </div>
        
        <ProfileDropdown />
      </header>

      <main className="relative px-3 py-4 md:p-6 lg:p-8 pb-32 md:pb-28 max-w-7xl mx-auto overflow-x-hidden">
        <DashboardContent />
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
