import { supabase } from "@/integrations/supabase/client";
import { CurriculumService } from "../curriculum/service";

export class ParentService {
  /**
   * Links a parent to a student using an invite code.
   */
  static async linkStudent(parentId: string, inviteCode: string) {
    const { data: link, error } = await supabase
      .from('parent_child_links')
      .update({ parent_id: parentId, status: 'ACTIVE' })
      .eq('invite_code', inviteCode)
      .select()
      .single();

    if (error) throw error;
    return link;
  }

  /**
   * Aggregates progress trends for a student over the last 30 days.
   */
  static async getProgressTrends(studentId: string) {
    const { data: snapshots } = await supabase
      .from('mastery_snapshots')
      .select('*')
      .eq('student_id', studentId)
      .order('recorded_at', { ascending: false })
      .limit(20);

    // Group by domain and calculate delta
    const trends: Record<string, { current: number, previous: number }> = {};
    snapshots?.forEach(s => {
      if (!trends[s.domain]) {
        trends[s.domain] = { current: s.avg_mastery_score, previous: s.avg_mastery_score };
      } else {
        trends[s.domain].previous = s.avg_mastery_score; // Oldest one in the limit
      }
    });

    return trends;
  }

  /**
   * Calculates "Exam Readiness" score (0-100).
   */
  static async calculateExamReadiness(studentId: string) {
    const analytics = await CurriculumService.getStudentAnalytics(studentId);
    if (analytics.length === 0) return 0;

    const totalMastery = analytics.reduce((acc, s) => acc + (s.mastery_score || 0), 0);
    return Math.round((totalMastery / analytics.length) * 100);
  }

  /**
   * Generates a weekly summary report data.
   */
  static async generateWeeklySummary(studentId: string) {
    const readiness = await this.calculateExamReadiness(studentId);
    const trends = await this.getProgressTrends(studentId);
    
    // Fetch recent session results
    const { data: recentSessions } = await supabase
      .from('naplan_sessions')
      .select('*')
      .eq('user_id', studentId)
      .eq('status', 'COMPLETED')
      .order('completed_at', { ascending: false })
      .limit(5);

    return {
      readiness,
      trends,
      recentSessions,
      generatedAt: new Date().toISOString()
    };
  }
}
