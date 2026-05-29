-- Migration: Australian Education Pathway Architecture
-- Date: 2024-05-15

-- 1. ENUMS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'australian_state') THEN
        CREATE TYPE australian_state AS ENUM ('NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_category') THEN
        CREATE TYPE exam_category AS ENUM ('NAPLAN', 'ICAS', 'SCHOLARSHIP', 'SELECTIVE', 'VCE', 'HSC', 'QCE', 'SACE', 'WACE', 'GENERAL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subject_domain') THEN
        CREATE TYPE subject_domain AS ENUM ('MATHS', 'ENGLISH', 'SCIENCE', 'REASONING');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CURRICULUM TAXONOMY
CREATE TABLE IF NOT EXISTS curriculum_taxonomy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES curriculum_taxonomy(id),
    title TEXT NOT NULL,
    domain subject_domain NOT NULL,
    level INTEGER NOT NULL, -- 0: Subject, 1: Domain, 2: Subdomain, 3: Skill
    curriculum_code TEXT UNIQUE, -- e.g., 'ACARA-M1.2'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. EXAM DEFINITIONS
CREATE TABLE IF NOT EXISTS exam_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category exam_category NOT NULL,
    state australian_state, -- NULL for national exams like NAPLAN
    year_level INTEGER NOT NULL,
    title TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    feature_flags JSONB DEFAULT '{}'::jsonb, -- e.g., {"timed": true, "adaptive": true}
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. STATE SYLLABUS MAPPINGS
CREATE TABLE IF NOT EXISTS state_syllabus_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taxonomy_id UUID REFERENCES curriculum_taxonomy(id) ON DELETE CASCADE,
    state australian_state NOT NULL,
    syllabus_code TEXT NOT NULL, -- e.g., 'NSW-EN3-1A'
    outcome_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SKILL TRACKING (MASTERY)
CREATE TABLE IF NOT EXISTS student_skill_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, 
    taxonomy_id UUID REFERENCES curriculum_taxonomy(id) ON DELETE CASCADE,
    mastery_score FLOAT DEFAULT 0.0, -- 0.0 to 1.0
    total_attempts INTEGER DEFAULT 0,
    last_practiced_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, taxonomy_id)
);

-- 6. CONTENT TAGGING
-- The questions table is created by a later checked-in migration. Keep this
-- migration safe for fresh databases and apply these columns again later.
DO $$ BEGIN
    IF to_regclass('public.questions') IS NOT NULL THEN
        ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS state australian_state;
        ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS curriculum_nodes UUID[];
        ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS aus_spelling_checked BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 7. INDICES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_taxonomy_parent ON curriculum_taxonomy(parent_id);
CREATE INDEX IF NOT EXISTS idx_mastery_user ON student_skill_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_state_level ON exam_definitions(state, year_level);
