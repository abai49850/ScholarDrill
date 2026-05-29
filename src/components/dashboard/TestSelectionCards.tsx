import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { testCards } from "@/data/mockProgress";
import { DifficultyBadge } from "@/components/practice/DifficultyBadge";
import { useUserProfile } from "@/contexts/UserProfileContext";

const subjectMap: Record<string, string> = {
  Mathematics: "maths",
  Reading: "reading",
  Writing: "writing",
  Reasoning: "reasoning",
  Conventions: "conventions",
};

const categories = [
  { key: "all", label: "All Tests" },
  { key: "naplan", label: "NAPLAN" },
  { key: "selective", label: "Selective" },
  { key: "scholarship", label: "Scholarship" },
] as const;

export function TestSelectionCards() {
  const { profile } = useUserProfile();
  const initialCategory = profile.examFocus === "all" ? "all" : profile.examFocus;
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  // When profile changes, sync the category filter
  useEffect(() => {
    setActiveCategory(profile.examFocus === "all" ? "all" : profile.examFocus);
  }, [profile.id, profile.examFocus]);

  const filtered = useMemo(() => {
    let list = testCards;
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
        {categories.map((cat) => (
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
          {filtered.map((test, i) => (
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
                      {test.questionCount} questions
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
                    <Link to={`/practice?subject=${subjectMap[test.subjects[0]] || test.subjects[0].toLowerCase()}&year=${profile.yearLevel}`}>
                      Start Practice <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
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
