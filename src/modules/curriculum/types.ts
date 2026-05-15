export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export type ExamCategory = 
  | 'NAPLAN' | 'ICAS' | 'SCHOLARSHIP' | 'SELECTIVE' 
  | 'VCE' | 'HSC' | 'QCE' | 'SACE' | 'WACE' | 'GENERAL';

export type SubjectDomain = 'MATHS' | 'ENGLISH' | 'SCIENCE' | 'REASONING';

export interface CurriculumNode {
  id: string;
  parent_id?: string;
  title: string;
  domain: SubjectDomain;
  level: 0 | 1 | 2 | 3; // Subject, Domain, Subdomain, Skill
  code?: string;
  description?: string;
  state_mappings?: StateMapping[];
}

export interface StateMapping {
  state: AustralianState;
  syllabus_code: string;
  outcome_description: string;
}
