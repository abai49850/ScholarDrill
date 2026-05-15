import { motion } from "framer-motion";
import { Flame, Trophy, Star, Shield, Zap } from "lucide-react";

export const StudentGamificationSection = () => {
  return (
    <section className="py-24 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Visual Left Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10 grid gap-4 max-w-md mx-auto">
              {/* Daily Goal Card */}
              <div className="bg-card border border-border shadow-lg rounded-2xl p-5 transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    Daily Quest
                  </h4>
                  <span className="text-sm font-bold text-muted-foreground">150 XP</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Complete 3 Maths lessons without any mistakes.</p>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[66%] rounded-full" />
                </div>
                <p className="text-xs text-right mt-2 font-bold text-muted-foreground">2/3 Completed</p>
              </div>

              {/* Streak & Rank Cards Container */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border shadow-lg rounded-2xl p-5 flex flex-col items-center justify-center transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <Flame className="h-8 w-8 text-orange-500 fill-orange-500" />
                  </div>
                  <h4 className="font-bold text-xl">14 Days</h4>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Streak</p>
                </div>
                
                <div className="bg-card border border-border shadow-lg rounded-2xl p-5 flex flex-col items-center justify-center transform -rotate-1 hover:rotate-0 transition-transform">
                  <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Shield className="h-8 w-8 text-purple-500 fill-purple-500" />
                  </div>
                  <h4 className="font-bold text-xl">Gold League</h4>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top 15%</p>
                </div>
              </div>

              {/* Leaderboard Snippet */}
              <div className="bg-card border border-border shadow-lg rounded-2xl p-5 mt-2">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Weekly Leaderboard
                </h4>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah M.", xp: 2450, color: "text-yellow-500" },
                    { rank: 2, name: "Leo T. (You)", xp: 2100, color: "text-muted-foreground bg-primary/10 rounded-lg -mx-2 px-2 py-1" },
                    { rank: 3, name: "David L.", xp: 1950, color: "text-orange-500" },
                  ].map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between text-sm ${user.color.includes('bg-') ? user.color : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${user.color.includes('text-') ? user.color : ''}`}>#{user.rank}</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <span className="font-bold text-muted-foreground">{user.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-yellow-500/10 rounded-full blur-[100px] -z-10" />
          </motion.div>

          {/* Text Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600 mb-6">
              <Star className="h-4 w-4 fill-orange-500" />
              Make learning addictive
            </div>
            <h2 className="text-display mb-6">Learning that feels like playing.</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We've combined proven educational psychology with game design to keep students motivated, engaged, and eager to learn every single day.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
              {[
                {
                  title: "Earn XP & Level Up",
                  desc: "Every correct answer earns XP. Watch them level up and unlock new avatars.",
                  icon: "✨"
                },
                {
                  title: "Build Streaks",
                  desc: "Daily study habits are rewarded with streaks that they won't want to break.",
                  icon: "🔥"
                },
                {
                  title: "Weekly Leagues",
                  desc: "Friendly competition in tiered leagues keeps motivation incredibly high.",
                  icon: "🏆"
                },
                {
                  title: "Daily Challenges",
                  desc: "Bite-sized daily quests ensure consistent, manageable practice sessions.",
                  icon: "⚡"
                }
              ].map((item, i) => (
                <div key={i}>
                  <div className="text-3xl mb-3">{item.icon}</div>
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
