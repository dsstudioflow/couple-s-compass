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
import { Users, CalendarIcon, Mail, UserPlus, Check, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoupleProfile } from "@/hooks/useCoupleData";

interface CoupleProfileCardProps {
  data: {
    coupleProfile: CoupleProfile | null;
    updateProfile: (updates: Partial<CoupleProfile>) => Promise<boolean>;
  };
}

export function CoupleProfileCard({ data }: CoupleProfileCardProps) {
  const { coupleProfile, updateProfile } = data;
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

  const handlePartnerInvite = async () => {
    if (!partnerEmail.trim()) return;
    setSaving(true);
    await updateProfile({
      partner_email: partnerEmail.trim(),
      partner_name: partnerName.trim() || null,
    });
    setSaving(false);
  };

  const isPartnerLinked = !!coupleProfile?.partner_user_id;
  const hasPendingInvite = !!coupleProfile?.partner_email && !isPartnerLinked;

  return (
    <Card className="border-0 shadow-lg shadow-primary/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="font-display text-xl">Perfil do Casal</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Wedding Date Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-muted-foreground">Data do Casamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 rounded-xl border-border/50",
                    !weddingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                  {weddingDate ? format(weddingDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
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
              <div className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary animate-pulse-soft" />
                  Contagem regressiva
                </p>
                <p className="text-4xl font-display font-bold text-primary mt-1">
                  {daysUntilWedding}
                  <span className="text-lg font-normal text-muted-foreground ml-2">dias</span>
                </p>
              </div>
            )}

            {daysUntilWedding !== null && daysUntilWedding <= 0 && (
              <Badge className="text-sm bg-primary/10 text-primary border-primary/20 px-4 py-2">
                🎉 Parabéns! Hoje é o grande dia!
              </Badge>
            )}
          </div>

          {/* Partner Invite Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-muted-foreground">Vincular Parceiro(a)</Label>
            
            {isPartnerLinked ? (
              <div className="p-5 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl border border-success/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-display font-semibold text-lg">{coupleProfile?.partner_name || "Parceiro(a)"}</p>
                  <p className="text-sm text-muted-foreground">Vinculado com sucesso</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <Input
                    placeholder="Nome do parceiro(a)"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="h-12 rounded-xl border-border/50"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Email do parceiro(a)"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      className="h-12 rounded-xl border-border/50"
                    />
                    <Button 
                      onClick={handlePartnerInvite} 
                      disabled={saving || !partnerEmail.trim()}
                      size="icon"
                      className="h-12 w-12 rounded-xl shrink-0"
                    >
                      <UserPlus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {hasPendingInvite && (
                  <div className="p-4 bg-warning/5 rounded-2xl border border-warning/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Convite pendente</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {coupleProfile?.partner_email}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}