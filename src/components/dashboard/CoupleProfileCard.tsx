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
import { Users, CalendarIcon, Mail, UserPlus, Check, Clock } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Perfil do Casal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Wedding Date Section */}
          <div className="space-y-3">
            <Label>Data do Casamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !weddingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {weddingDate ? format(weddingDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
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
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">Contagem regressiva</p>
                <p className="text-2xl font-display font-bold text-primary">
                  {daysUntilWedding} dias
                </p>
              </div>
            )}

            {daysUntilWedding !== null && daysUntilWedding <= 0 && (
              <Badge variant="default" className="text-sm">
                🎉 Parabéns! Hoje é o grande dia!
              </Badge>
            )}
          </div>

          {/* Partner Invite Section */}
          <div className="space-y-3">
            <Label>Vincular Parceiro(a)</Label>
            
            {isPartnerLinked ? (
              <div className="p-3 bg-success/10 rounded-lg border border-success/20 flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium">{coupleProfile?.partner_name || "Parceiro(a)"}</p>
                  <p className="text-sm text-muted-foreground">Vinculado com sucesso</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Input
                    placeholder="Nome do parceiro(a)"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Email do parceiro(a)"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                    />
                    <Button 
                      onClick={handlePartnerInvite} 
                      disabled={saving || !partnerEmail.trim()}
                      size="icon"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {hasPendingInvite && (
                  <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-warning" />
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
