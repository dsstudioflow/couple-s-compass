import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface CoupleProfile {
  id: string;
  user_id: string;
  partner_email: string | null;
  partner_user_id: string | null;
  partner_name: string | null;
  user_name: string | null;
  combined_income: number;
  wedding_date: string | null;
}

export interface WeddingCost {
  id: string;
  couple_id: string;
  category: string;
  planned_amount: number;
  actual_amount: number;
  notes: string | null;
}

export interface HousingConfig {
  id: string;
  couple_id: string;
  housing_type: "rent" | "finance";
  rent_amount: number;
  property_value: number;
  down_payment: number;
  interest_rate: number;
  loan_term_months: number;
}

export interface RecurringCost {
  id: string;
  couple_id: string;
  name: string;
  amount: number;
  category: string;
}

export function useCoupleData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [coupleProfile, setCoupleProfile] = useState<CoupleProfile | null>(null);
  const [weddingCosts, setWeddingCosts] = useState<WeddingCost[]>([]);
  const [housingConfig, setHousingConfig] = useState<HousingConfig | null>(null);
  const [recurringCosts, setRecurringCosts] = useState<RecurringCost[]>([]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch couple profile
      const { data: profile, error: profileError } = await supabase
        .from("couple_profiles")
        .select("*")
        .or(`user_id.eq.${user.id},partner_user_id.eq.${user.id}`)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      if (profile) {
        setCoupleProfile(profile as CoupleProfile);

        // Fetch wedding costs
        const { data: costs } = await supabase
          .from("wedding_costs")
          .select("*")
          .eq("couple_id", profile.id);
        setWeddingCosts((costs as WeddingCost[]) || []);

        // Fetch housing config
        const { data: housing } = await supabase
          .from("housing_config")
          .select("*")
          .eq("couple_id", profile.id)
          .single();
        setHousingConfig(housing as HousingConfig | null);

        // Fetch recurring costs
        const { data: recurring } = await supabase
          .from("recurring_costs")
          .select("*")
          .eq("couple_id", profile.id);
        setRecurringCosts((recurring as RecurringCost[]) || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProfile = async (updates: Partial<CoupleProfile>) => {
    if (!coupleProfile) return;

    const { error } = await supabase
      .from("couple_profiles")
      .update(updates)
      .eq("id", coupleProfile.id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return false;
    }

    setCoupleProfile({ ...coupleProfile, ...updates });
    return true;
  };

  const upsertWeddingCost = async (cost: Partial<WeddingCost> & { category: string }) => {
    if (!coupleProfile) return;

    const existingCost = weddingCosts.find((c) => c.category === cost.category);

    if (existingCost) {
      const { error } = await supabase
        .from("wedding_costs")
        .update({
          planned_amount: cost.planned_amount ?? existingCost.planned_amount,
          actual_amount: cost.actual_amount ?? existingCost.actual_amount,
          notes: cost.notes ?? existingCost.notes,
        })
        .eq("id", existingCost.id);

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return false;
      }

      setWeddingCosts(
        weddingCosts.map((c) =>
          c.id === existingCost.id ? { ...c, ...cost } : c
        )
      );
    } else {
      const { data, error } = await supabase
        .from("wedding_costs")
        .insert({
          couple_id: coupleProfile.id,
          category: cost.category,
          planned_amount: cost.planned_amount ?? 0,
          actual_amount: cost.actual_amount ?? 0,
          notes: cost.notes ?? null,
        })
        .select()
        .single();

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return false;
      }

      setWeddingCosts([...weddingCosts, data as WeddingCost]);
    }
    return true;
  };

  const upsertHousingConfig = async (config: Partial<HousingConfig>) => {
    if (!coupleProfile) return;

    if (housingConfig) {
      const { error } = await supabase
        .from("housing_config")
        .update(config)
        .eq("id", housingConfig.id);

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return false;
      }

      setHousingConfig({ ...housingConfig, ...config });
    } else {
      const { data, error } = await supabase
        .from("housing_config")
        .insert({
          couple_id: coupleProfile.id,
          housing_type: config.housing_type ?? "rent",
          rent_amount: config.rent_amount ?? 0,
          property_value: config.property_value ?? 0,
          down_payment: config.down_payment ?? 0,
          interest_rate: config.interest_rate ?? 0,
          loan_term_months: config.loan_term_months ?? 360,
        })
        .select()
        .single();

      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        return false;
      }

      setHousingConfig(data as HousingConfig);
    }
    return true;
  };

  const addRecurringCost = async (cost: { name: string; amount: number; category: string }) => {
    if (!coupleProfile) return;

    const { data, error } = await supabase
      .from("recurring_costs")
      .insert({
        couple_id: coupleProfile.id,
        ...cost,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return null;
    }

    setRecurringCosts([...recurringCosts, data as RecurringCost]);
    return data as RecurringCost;
  };

  const updateRecurringCost = async (id: string, updates: Partial<RecurringCost>) => {
    const { error } = await supabase
      .from("recurring_costs")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return false;
    }

    setRecurringCosts(
      recurringCosts.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    return true;
  };

  const deleteRecurringCost = async (id: string) => {
    const { error } = await supabase.from("recurring_costs").delete().eq("id", id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return false;
    }

    setRecurringCosts(recurringCosts.filter((c) => c.id !== id));
    return true;
  };

  return {
    loading,
    coupleProfile,
    weddingCosts,
    housingConfig,
    recurringCosts,
    updateProfile,
    upsertWeddingCost,
    upsertHousingConfig,
    addRecurringCost,
    updateRecurringCost,
    deleteRecurringCost,
    refetch: fetchData,
  };
}