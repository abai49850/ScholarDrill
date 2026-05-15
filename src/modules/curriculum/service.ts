import { supabase } from "@/integrations/supabase/client";
import type { CurriculumNode, AustralianState, SubjectDomain } from "./types";

export class CurriculumService {
  /**
   * Fetches the hierarchical taxonomy for a specific subject and state.
   */
  static async getTaxonomy(domain: SubjectDomain, state?: AustralianState): Promise<CurriculumNode[]> {
    const { data, error } = await supabase
      .from('curriculum_taxonomy')
      .select('*')
      .eq('domain', domain)
      .order('level', { ascending: true });

    if (error) {
      console.error("Error fetching taxonomy:", error);
      return [];
    }

    return data as CurriculumNode[];
  }

  /**
   * Updates student mastery for a specific skill.
   */
  static async updateMastery(userId: string, taxonomyId: string, score: number) {
    const { error } = await supabase
      .from('student_skill_mastery')
      .upsert({
        user_id: userId,
        taxonomy_id: taxonomyId,
        mastery_score: score,
        last_practiced_at: new Date().toISOString()
      }, { onConflict: 'user_id,taxonomy_id' });

    if (error) console.error("Error updating mastery:", error);
  }

  /**
   * Gets mastery analytics for a student.
   */
  static async getStudentAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('student_skill_mastery')
      .select('*, curriculum_taxonomy(*)')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching analytics:", error);
      return [];
    }

    return data;
  }
}
