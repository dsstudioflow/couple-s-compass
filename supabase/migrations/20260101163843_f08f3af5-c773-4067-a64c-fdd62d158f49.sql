-- Tabela de perfis de casais
CREATE TABLE public.couple_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_email TEXT,
  partner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_name TEXT,
  user_name TEXT,
  combined_income NUMERIC DEFAULT 0,
  wedding_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de custos do casamento
CREATE TABLE public.wedding_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couple_profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  planned_amount NUMERIC DEFAULT 0,
  actual_amount NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de configurações de moradia
CREATE TABLE public.housing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couple_profiles(id) ON DELETE CASCADE,
  housing_type TEXT DEFAULT 'rent' CHECK (housing_type IN ('rent', 'finance')),
  rent_amount NUMERIC DEFAULT 0,
  property_value NUMERIC DEFAULT 0,
  down_payment NUMERIC DEFAULT 0,
  interest_rate NUMERIC DEFAULT 0,
  loan_term_months INTEGER DEFAULT 360,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(couple_id)
);

-- Tabela de custos recorrentes mensais
CREATE TABLE public.recurring_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couple_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'outros',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de patrimônio mensal (para gráfico de projeção)
CREATE TABLE public.monthly_savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES public.couple_profiles(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  planned_savings NUMERIC DEFAULT 0,
  actual_savings NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(couple_id, month, year)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.couple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_savings ENABLE ROW LEVEL SECURITY;

-- Função para verificar se o usuário tem acesso ao casal (proprietário ou parceiro)
CREATE OR REPLACE FUNCTION public.has_couple_access(couple_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.couple_profiles
    WHERE id = couple_id
    AND (user_id = auth.uid() OR partner_user_id = auth.uid())
  )
$$;

-- Função para obter o couple_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_couple_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.couple_profiles
  WHERE user_id = auth.uid() OR partner_user_id = auth.uid()
  LIMIT 1
$$;

-- Políticas RLS para couple_profiles
CREATE POLICY "Users can view their own couple profile"
ON public.couple_profiles FOR SELECT
USING (user_id = auth.uid() OR partner_user_id = auth.uid());

CREATE POLICY "Users can create their own couple profile"
ON public.couple_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own couple profile"
ON public.couple_profiles FOR UPDATE
USING (user_id = auth.uid() OR partner_user_id = auth.uid());

CREATE POLICY "Users can delete their own couple profile"
ON public.couple_profiles FOR DELETE
USING (user_id = auth.uid());

-- Políticas RLS para wedding_costs
CREATE POLICY "Users can view their couple wedding costs"
ON public.wedding_costs FOR SELECT
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can create wedding costs for their couple"
ON public.wedding_costs FOR INSERT
WITH CHECK (public.has_couple_access(couple_id));

CREATE POLICY "Users can update their couple wedding costs"
ON public.wedding_costs FOR UPDATE
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can delete their couple wedding costs"
ON public.wedding_costs FOR DELETE
USING (public.has_couple_access(couple_id));

-- Políticas RLS para housing_config
CREATE POLICY "Users can view their couple housing config"
ON public.housing_config FOR SELECT
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can create housing config for their couple"
ON public.housing_config FOR INSERT
WITH CHECK (public.has_couple_access(couple_id));

CREATE POLICY "Users can update their couple housing config"
ON public.housing_config FOR UPDATE
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can delete their couple housing config"
ON public.housing_config FOR DELETE
USING (public.has_couple_access(couple_id));

-- Políticas RLS para recurring_costs
CREATE POLICY "Users can view their couple recurring costs"
ON public.recurring_costs FOR SELECT
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can create recurring costs for their couple"
ON public.recurring_costs FOR INSERT
WITH CHECK (public.has_couple_access(couple_id));

CREATE POLICY "Users can update their couple recurring costs"
ON public.recurring_costs FOR UPDATE
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can delete their couple recurring costs"
ON public.recurring_costs FOR DELETE
USING (public.has_couple_access(couple_id));

-- Políticas RLS para monthly_savings
CREATE POLICY "Users can view their couple monthly savings"
ON public.monthly_savings FOR SELECT
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can create monthly savings for their couple"
ON public.monthly_savings FOR INSERT
WITH CHECK (public.has_couple_access(couple_id));

CREATE POLICY "Users can update their couple monthly savings"
ON public.monthly_savings FOR UPDATE
USING (public.has_couple_access(couple_id));

CREATE POLICY "Users can delete their couple monthly savings"
ON public.monthly_savings FOR DELETE
USING (public.has_couple_access(couple_id));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_couple_profiles_updated_at
BEFORE UPDATE ON public.couple_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wedding_costs_updated_at
BEFORE UPDATE ON public.wedding_costs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_housing_config_updated_at
BEFORE UPDATE ON public.housing_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recurring_costs_updated_at
BEFORE UPDATE ON public.recurring_costs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();