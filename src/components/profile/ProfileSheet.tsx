import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "./AvatarUpload";
import { useAuth } from "@/hooks/useAuth";
import { useCoupleData } from "@/hooks/useCoupleData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, User, Calendar, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { user, signOut } = useAuth();
  const { coupleProfile, refetch } = useCoupleData();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [userName, setUserName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (coupleProfile?.user_name) {
      setUserName(coupleProfile.user_name);
    }
  }, [coupleProfile?.user_name]);

  const handleSaveName = async () => {
    if (!coupleProfile?.id || !userName.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("couple_profiles")
        .update({ user_name: userName.trim() })
        .eq("id", coupleProfile.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Sucesso",
        description: "Nome atualizado!",
      });
    } catch (error) {
      console.error("Error updating name:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o nome.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (url: string | null) => {
    if (!coupleProfile?.id) return;

    try {
      const { error } = await supabase
        .from("couple_profiles")
        .update({ avatar_url: url })
        .eq("id", coupleProfile.id);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error("Error updating avatar URL:", error);
    }
  };

  const handleSignOut = async () => {
    onOpenChange(false);
    await signOut();
  };

  const createdAt = user?.created_at 
    ? format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-display">Meu Perfil</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex justify-center">
            <AvatarUpload
              avatarUrl={coupleProfile?.avatar_url}
              userName={coupleProfile?.user_name}
              userId={user?.id || ""}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          <Separator />

          {/* User Info Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                Nome
              </Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Seu nome"
                />
                <Button 
                  onClick={handleSaveName} 
                  disabled={isSaving || userName === coupleProfile?.user_name}
                  size="sm"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                E-mail
              </Label>
              <Input value={user?.email || ""} disabled className="bg-muted" />
            </div>

            {createdAt && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Membro desde
                </Label>
                <p className="text-sm text-foreground px-3 py-2 bg-muted rounded-md">
                  {createdAt}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Theme Section */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Aparência</Label>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="flex-1"
              >
                <Sun className="h-4 w-4 mr-2" />
                Claro
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="flex-1"
              >
                <Moon className="h-4 w-4 mr-2" />
                Escuro
              </Button>
            </div>
          </div>

          <Separator />

          {/* Sign Out */}
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
