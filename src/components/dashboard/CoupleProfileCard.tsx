import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarIcon, Mail, UserPlus, Check, Clock, Heart, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { CoupleProfile } from "@/hooks/useCoupleData";

interface CoupleProfileCardProps {
  data: {
    coupleProfile: CoupleProfile | null;
    updateProfile: (updates: Partial<CoupleProfile>) => Promise<boolean>;
  };
}

export function CoupleProfileCard({ data }: CoupleProfileCardProps) {
  const { coupleProfile, updateProfile } = data;
  const { toast } = useToast();
  const [partnerEmail, setPartnerEmail] = useState(coupleProfile?.partner_email || "");
  const [partnerName, setPartnerName] = useState(coupleProfile?.partner_name || "");
  const [saving, setSaving] = useState(false);

  const weddingDate = coupleProfile?.wedding_date ? new Date(coupleProfile.wedding_date) : undefined;
  const daysUntilWedding = weddingDate ? differenceInDays(weddingDate, new Date()) : null;

  const handleDateSelect = async (date: Date | undefined) => {
    if (date) {
      await updateProfile({ wedding_date: format(date, "yyyy-MM-dd") });
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePartnerInvite = async () => {
    const email = partnerEmail.trim();
    
    if (!email) {
      toast({
        title: "Erro",
        description: "Digite o e-mail do parceiro(a)",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Erro",
        description: "Digite um e-mail válido",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const success = await updateProfile({
      partner_email: email,
      partner_name: partnerName.trim() || null,
    });

    if (success) {
      toast({
        title: "Convite enviado!",
        description: `Quando ${partnerName || "seu parceiro(a)"} criar uma conta com o e-mail ${email}, vocês serão vinculados automaticamente.`,
      });
    }
    setSaving(false);
  };

  const handleCancelInvite = async () => {
    setSaving(true);
    const success = await updateProfile({
      partner_email: null,
      partner_name: null,
      partner_user_id: null,
    });

    if (success) {
      setPartnerEmail("");
      setPartnerName("");
      toast({
        title: "Convite cancelado",
        description: "O convite foi removido com sucesso.",
      });
    }
    setSaving(false);
  };

  const isPartnerLinked = !!coupleProfile?.partner_user_id;
  const hasPendingInvite = !!coupleProfile?.partner_email && !isPartnerLinked;

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </div>
          <CardTitle className="font-display text-lg md:text-xl">Perfil do Casal</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {/* Wedding Date Section */}
          <div className="space-y-3 md:space-y-4">
            <Label className="text-xs md:text-sm font-medium text-muted-foreground">Data do Casamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 md:h-12 rounded-xl border-border/50 text-sm md:text-base",
                    !weddingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                  <span className="truncate">
                    {weddingDate ? format(weddingDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={weddingDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {daysUntilWedding !== null && daysUntilWedding > 0 && (
              <div className="p-4 md:p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl md:rounded-2xl border border-primary/10">
                <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 md:gap-2">
                  <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary animate-pulse-soft" />
                  Contagem regressiva
                </p>
                <p className="text-3xl md:text-4xl font-display font-bold text-primary mt-1">
                  {daysUntilWedding}
                  <span className="text-sm md:text-lg font-normal text-muted-foreground ml-1.5 md:ml-2">dias</span>
                </p>
              </div>
            )}

            {daysUntilWedding !== null && daysUntilWedding <= 0 && (
              <Badge className="text-xs md:text-sm bg-primary/10 text-primary border-primary/20 px-3 md:px-4 py-1.5 md:py-2">
                🎉 Parabéns! Hoje é o grande dia!
              </Badge>
            )}
          </div>

          {/* Partner Invite Section */}
          <div className="space-y-3 md:space-y-4">
            <Label className="text-xs md:text-sm font-medium text-muted-foreground">Vincular Parceiro(a)</Label>
            
            {isPartnerLinked ? (
              <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-xl md:rounded-2xl border border-emerald-500/20 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-base md:text-lg truncate">
                    {coupleProfile?.partner_name || "Parceiro(a)"}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">Vinculado com sucesso</p>
                </div>
              </div>
            ) : hasPendingInvite ? (
              <div className="space-y-3">
                <div className="p-4 md:p-5 bg-amber-500/5 rounded-xl md:rounded-2xl border border-amber-500/20">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm md:text-base">Aguardando vinculação</p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                        {coupleProfile?.partner_name && (
                          <span className="block">{coupleProfile.partner_name}</span>
                        )}
                        <span className="flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          {coupleProfile?.partner_email}
                        </span>
                      </p>
                      <p className="text-[10px] md:text-xs text-muted-foreground mt-2 leading-relaxed">
                        Quando essa pessoa criar uma conta com este e-mail, vocês serão vinculados automaticamente.
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelInvite}
                  disabled={saving}
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 mr-2" />
                  )}
                  Cancelar convite
                </Button>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                <Input
                  placeholder="Nome do parceiro(a)"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="h-11 md:h-12 rounded-xl border-border/50 text-sm md:text-base"
                />
                <div className="flex gap-2">
                  <Input
                    type="email"
                    inputMode="email"
                    placeholder="Email do parceiro(a)"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="h-11 md:h-12 rounded-xl border-border/50 text-sm md:text-base"
                  />
                  <Button 
                    onClick={handlePartnerInvite} 
                    disabled={saving || !partnerEmail.trim()}
                    size="icon"
                    className="h-11 w-11 md:h-12 md:w-12 rounded-xl shrink-0"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground">
                  Digite o e-mail que seu parceiro(a) usará para criar a conta. 
                  Vocês serão vinculados automaticamente.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
