-- MIZHAR Database Schema
-- Complete setup with RLS policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  subscription_id TEXT, -- Stripe/PayPal subscription ID
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due')),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  industry TEXT,
  stage TEXT DEFAULT 'pre-seed' CHECK (stage IN ('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth', 'mature')),
  founded_date DATE,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Interview responses table
CREATE TABLE IF NOT EXISTS public.interview_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  response_value TEXT NOT NULL,
  response_type TEXT CHECK (response_type IN ('text', 'choice', 'multiselect', 'slider')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Business plan sections table
CREATE TABLE IF NOT EXISTS public.business_plan_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  section_index INTEGER,
  content TEXT,
  status TEXT DEFAULT 'empty' CHECK (status IN ('empty', 'draft', 'complete')),
  generated_by_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, section_name)
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exports table (tracks generated reports)
CREATE TABLE IF NOT EXISTS public.exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'docx', 'xlsx', 'pptx', 'zip')),
  export_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, export_type, created_at)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  context_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Valuation data table (Pro feature)
CREATE TABLE IF NOT EXISTS public.valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('revenue_multiple', 'berkus', 'scorecard', 'dcf', 'comparable')),
  valuation_amount DECIMAL(15,2),
  pre_money DECIMAL(15,2),
  post_money DECIMAL(15,2),
  dilution_percent DECIMAL(5,2),
  assumptions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Investor prospects table (Pro feature)
CREATE TABLE IF NOT EXISTS public.investor_prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  investor_name TEXT NOT NULL,
  investor_email TEXT,
  firm TEXT,
  fit_score INTEGER CHECK (fit_score >= 0 AND fit_score <= 100),
  stage_focus TEXT ARRAY,
  industry_focus TEXT ARRAY,
  outreach_status TEXT DEFAULT 'cold' CHECK (outreach_status IN ('cold', 'contacted', 'interested', 'meeting', 'passed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, investor_email)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plan_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_prospects ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Workspaces RLS
CREATE POLICY "Workspaces are viewable by owner" ON public.workspaces
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Workspaces are editable by owner" ON public.workspaces
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Workspaces are deletable by owner" ON public.workspaces
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can create workspaces" ON public.workspaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interview responses RLS
CREATE POLICY "Interview responses visible to workspace owner" ON public.interview_responses
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Interview responses editable by workspace owner" ON public.interview_responses
  FOR UPDATE USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create interview responses" ON public.interview_responses
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

-- Business plan sections RLS
CREATE POLICY "Plan sections visible to workspace owner" ON public.business_plan_sections
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Plan sections editable by workspace owner" ON public.business_plan_sections
  FOR UPDATE USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create plan sections" ON public.business_plan_sections
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

-- Documents RLS
CREATE POLICY "Documents visible to workspace owner" ON public.documents
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Documents deletable by workspace owner" ON public.documents
  FOR DELETE USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can upload documents" ON public.documents
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
    AND auth.uid() = uploaded_by
  );

-- Exports RLS
CREATE POLICY "Exports visible to workspace owner" ON public.exports
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create exports" ON public.exports
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

-- Chat messages RLS
CREATE POLICY "Chat messages visible to workspace owner" ON public.chat_messages
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

-- Valuations RLS
CREATE POLICY "Valuations visible to workspace owner" ON public.valuations
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage valuations" ON public.valuations
  FOR ALL USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

-- Investor prospects RLS
CREATE POLICY "Prospects visible to workspace owner" ON public.investor_prospects
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage prospects" ON public.investor_prospects
  FOR ALL USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE user_id = auth.uid())
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER interview_responses_updated_at BEFORE UPDATE ON public.interview_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER business_plan_sections_updated_at BEFORE UPDATE ON public.business_plan_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER valuations_updated_at BEFORE UPDATE ON public.valuations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER investor_prospects_updated_at BEFORE UPDATE ON public.investor_prospects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes for performance
CREATE INDEX idx_workspaces_user_id ON public.workspaces(user_id);
CREATE INDEX idx_interview_responses_workspace_id ON public.interview_responses(workspace_id);
CREATE INDEX idx_business_plan_sections_workspace_id ON public.business_plan_sections(workspace_id);
CREATE INDEX idx_documents_workspace_id ON public.documents(workspace_id);
CREATE INDEX idx_exports_workspace_id ON public.exports(workspace_id);
CREATE INDEX idx_chat_messages_workspace_id ON public.chat_messages(workspace_id);
CREATE INDEX idx_valuations_workspace_id ON public.valuations(workspace_id);
CREATE INDEX idx_investor_prospects_workspace_id ON public.investor_prospects(workspace_id);
