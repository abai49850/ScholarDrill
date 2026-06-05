import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, ChevronRight, Layers } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { examCards, examCategories } from "@/data/examCatalog";

export function TestSelectionCards() {
  const { profile } = useUserProfile();
  const initialCategory = profile.examFocus === "all" ? "all" : profile.examFocus;
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  // When profile changes, sync the category filter
  useEffect(() => {
    setActiveCategory(profile.examFocus === "all" ? "all" : profile.examFocus);
  }, [profile.id, profile.examFocus]);

  const filtered = useMemo(() => {
    let list = examCards;
    if (activeCategory !== "all") {
      list = list.filter((t) => t.category === activeCategory);
    }
    // Match year level: include tests where the profile's year fits, or near (±1)
    list = list.filter((t) =>
      t.yearLevels.includes(profile.yearLevel) ||
      t.yearLevels.some((y) => Math.abs(y - profile.yearLevel) <= 1)
    );
    return list;
  }, [activeCategory, profile.yearLevel]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {examCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((test, i) => {
            const subjectQuery = test.subjects.length === 1 ? `subject=${test.subjects[0]}&` : "";
            return (
            <motion.div
              key={test.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl p-5 card-hover group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{test.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate">{test.title}</h3>
                    <DifficultyBadge level={test.difficulty} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {test.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {test.questionCountLabel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {test.estimatedMinutes} min
                    </span>
                    <span>
                      Year {test.yearLevels.join(", ")}
                    </span>
                  </div>
                  <Button variant="default" size="sm" asChild className="group-hover:shadow-md transition-shadow">
                    <Link to={`/practice?${subjectQuery}exam=${test.dbExamType}&testId=${test.id}&year=${profile.yearLevel}`}>
                      Start Practice <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4 border-t border-border/60 pt-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  Exam structure
                </div>
                <div className="space-y-2">
                  {test.sections.slice(0, 3).map((section) => (
                    <div key={`${test.id}-${section.name}`} className="flex items-start justify-between gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{section.name}</span>
                        <span className="text-muted-foreground"> - {section.focus}</span>
                      </div>
                      <span className="shrink-0 text-muted-foreground">{section.questionLabel}, {section.minutes} min</span>
                    </div>
                  ))}
                </div>
                <a
                  href={test.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[11px] font-medium text-primary hover:underline"
                >
                  Source: {test.sourceLabel}
                </a>
              </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
          No tests match Year {profile.yearLevel} in this category yet. Try a different filter or persona.
        </div>
      )}
    </div>
  );
}
