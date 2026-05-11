// Saves AI-generated (or admin-edited) questions using service role,
// since there is no authenticated admin user yet.
// Validates payload shape strictly before insert.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUBJECTS = ["maths", "reading", "writing", "conventions", "reasoning"];
const EXAM_TYPES = ["naplan", "selective", "scholarship", "general"];
const STATUSES = ["draft", "approved"];

interface QInput {
  content: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
  explanation?: string;
  difficulty?: number;
  subject: string;
  exam_type: string;
  year_level: number;
  topic?: string;
  subtopic?: string;
  skill_tags?: string[];
  source_reference?: string;
  time_limit_seconds?: number;
  status?: string;
}

async function requireAdmin(req: Request): Promise<Response | null> {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  const authorization = req.headers.get("Authorization");

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return new Response(JSON.stringify({ error: "Server auth not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!authorization) {
    return new Response(JSON.stringify({ error: "Authentication required" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Invalid session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError || !role) {
    return new Response(JSON.stringify({ error: "Admin access required" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return null;
}

function validate(q: QInput): string | null {
  if (!q || typeof q !== "object") return "Missing question";
  if (!q.content || typeof q.content !== "string") return "content required";
  if (!Array.isArray(q.options) || q.options.length < 2) return "options required";
  for (const o of q.options) {
    if (!o || typeof o.id !== "string" || typeof o.text !== "string") return "invalid option";
  }
  if (!q.correct_option_id || !q.options.find((o) => o.id === q.correct_option_id))
    return "correct_option_id must match an option id";
  if (!SUBJECTS.includes(q.subject)) return "invalid subject";
  if (!EXAM_TYPES.includes(q.exam_type)) return "invalid exam_type";
  if (!Number.isFinite(q.year_level) || q.year_level < 1 || q.year_level > 12)
    return "invalid year_level";
  if (q.status && !STATUSES.includes(q.status)) return "invalid status";
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authError = await requireAdmin(req);
    if (authError) return authError;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const items: QInput[] = Array.isArray(body?.questions) ? body.questions : [];
    if (items.length === 0) {
      return new Response(JSON.stringify({ error: "No questions provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (items.length > 50) {
      return new Response(JSON.stringify({ error: "Too many questions (max 50)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = items.map((q) => {
      const err = validate(q);
      if (err) throw new Error(err);
      const status = q.status === "approved" ? "approved" : "draft";
      return {
        content: q.content,
        options: q.options,
        correct_option_id: q.correct_option_id,
        explanation: q.explanation ?? "",
        difficulty: Math.max(1, Math.min(5, Number(q.difficulty ?? 3))),
        subject: q.subject,
        exam_type: q.exam_type,
        year_level: Math.round(q.year_level),
        topic: q.topic ?? "",
        subtopic: q.subtopic ?? "",
        skill_tags: Array.isArray(q.skill_tags) ? q.skill_tags : [],
        source_reference: q.source_reference ?? "",
        time_limit_seconds: Math.max(20, Math.min(300, Number(q.time_limit_seconds ?? 60))),
        status,
        approved_at: status === "approved" ? new Date().toISOString() : null,
      };
    });

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data, error } = await supabase.from("questions").insert(rows).select("id, status");
    if (error) {
      console.error("insert error", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ inserted: data?.length ?? 0, ids: data ?? [] }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
