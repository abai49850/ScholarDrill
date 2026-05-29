import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { motion } from "framer-motion";
import { BookOpen, Calculator, PenTool, MessageSquare, Play, Flame, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";

const years = [3, 5, 7, 9];
const subjects = [
  { id: "reading", name: "Reading", icon: BookOpen, color: "text-subject-reading", bg: "bg-subject-reading/10", border: "border-subject-reading" },
  { id: "writing", name: "Writing", icon: PenTool, color: "text-subject-writing", bg: "bg-subject-writing/10", border: "border-subject-writing" },
  { id: "maths", name: "Numeracy", icon: Calculator, color: "text-subject-maths", bg: "bg-subject-maths/10", border: "border-subject-maths" },
  { id: "conventions", name: "Language Conventions", icon: MessageSquare, color: "text-subject-conventions", bg: "bg-subject-conventions/10", border: "border-subject-conventions" },
];

export default function NaplanHub() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number>(5);
  const [selectedSubject, setSelectedSubject] = useState<string>("maths");

  const handleStart = () => {
    navigate(`/naplan/simulator?year=${selectedYear}&subject=${selectedSubject}`);
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Selection Area */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-display mb-4">NAPLAN Preparation Hub</h1>
              <p className="text-lg text-muted-foreground">Select your year level and subject to start a realistic practice exam.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <h2 className="text-xl font-bold">1. Select Year Level</h2>
              <div className="grid grid-cols-4 gap-4">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`rounded-2xl p-6 text-center border-2 transition-all ${
                      selectedYear === year
                        ? "border-primary bg-primary/5 shadow-md scale-105"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Year</span>
                    <span className={`text-4xl font-black ${selectedYear === year ? "text-primary" : "text-foreground"}`}>{year}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
              <h2 className="text-xl font-bold">2. Select Subject</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {subjects.map((sub) => {
                  const isSelected = selectedSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`rounded-2xl p-6 border-2 transition-all flex items-center gap-4 text-left ${
                        isSelected
                          ? `border-primary bg-primary/5 shadow-md`
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${isSelected ? "bg-primary text-white" : sub.bg + " " + sub.color}`}>
                        <sub.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{sub.name}</h3>
                        <p className="text-sm text-muted-foreground">40 Questions • 45 Mins</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-6">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-12 h-14 text-lg shadow-lg shadow-primary/25" onClick={handleStart}>
                <Play className="mr-2 fill-current h-5 w-5" />
                Start Realistic Simulator
              </Button>
            </motion.div>
          </div>

          {/* Gamification Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="sticky top-32 space-y-6">
              <div className="bg-card border border-border shadow-sm rounded-[2rem] p-6">
                <h3 className="font-bold mb-6 text-lg">Your Progress</h3>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl mb-4 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <Flame className="h-6 w-6 text-orange-500 fill-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Daily Streak</p>
                      <p className="font-bold text-lg">14 Days</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl mb-6 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <Trophy className="h-6 w-6 text-purple-500 fill-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total XP</p>
                      <p className="font-bold text-lg">4,250</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Level 8 Scholar</span>
                    <span className="text-muted-foreground">150 XP to Level 9</span>
                  </div>
                  <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
