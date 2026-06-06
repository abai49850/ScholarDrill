import { motion } from "framer-motion";
import { CalendarCheck, Flame, Shield, Star, Trophy, Zap } from "lucide-react";

const habitItems = [
  {
    title: "Earn XP and Level Up",
    desc: "Every correct answer earns XP and makes progress visible.",
    icon: Star,
  },
  {
    title: "Build Streaks",
    desc: "Daily study habits are rewarded with streaks students want to keep.",
    icon: Flame,
  },
  {
    title: "Weekly Leagues",
    desc: "Friendly competition keeps motivation high without overwhelming students.",
    icon: Trophy,
  },
  {
    title: "Daily Challenges",
    desc: "Bite-sized quests turn practice into a manageable routine.",
    icon: CalendarCheck,
  },
];

export const StudentGamificationSection = () => {
  return (
    <section className="py-24 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10 grid gap-4 max-w-md mx-auto">
              <motion.div
                animate={{ rotate: [-1.5, 0.8, -1.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="bg-card border border-border shadow-lg rounded-2xl p-5"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    Daily Quest
                  </h4>
                  <span className="text-sm font-bold text-muted-foreground">150 XP</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Complete 3 maths lessons without mistakes.</p>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "20%" }}
                    whileInView={{ width: "66%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-right mt-2 font-bold text-muted-foreground">2/3 completed</p>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-card border border-border shadow-lg rounded-2xl p-5 flex flex-col items-center justify-center"
                >
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <Flame className="h-8 w-8 text-orange-500 fill-orange-500" />
                  </div>
                  <h4 className="font-bold text-xl">14 Days</h4>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Streak</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-card border border-border shadow-lg rounded-2xl p-5 flex flex-col items-center justify-center"
                >
                  <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-8 w-8 text-purple-500 fill-purple-500" />
                  </div>
                  <h4 className="font-bold text-xl">Gold</h4>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top 15%</p>
                </motion.div>
              </div>

              <div className="bg-card border border-border shadow-lg rounded-2xl p-5 mt-2">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Weekly Leaderboard
                </h4>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah M.", xp: 2450, highlight: false },
                    { rank: 2, name: "Leo T. (You)", xp: 2100, highlight: true },
                    { rank: 3, name: "David L.", xp: 1950, highlight: false },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between text-sm ${user.highlight ? "bg-primary/10 rounded-lg -mx-2 px-2 py-1" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">#{user.rank}</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="font-bold text-muted-foreground">{user.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 mb-6">
              <Star className="h-4 w-4 fill-orange-500" />
              Motivation that shows up every day
            </div>
            <h2 className="text-display mb-6">Practice that feels rewarding, not repetitive.</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Students see progress immediately through quests, streaks, XP and league movement, while parents still get serious learning data behind the scenes.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
              {habitItems.map((item) => (
                <div key={item.title}>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
