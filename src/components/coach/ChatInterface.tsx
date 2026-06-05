import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EncouragementOverlay } from "./EncouragementOverlay";
import { generateResponse, type ChatMessage } from "@/modules/ai-engine/coach";
import type { TutorPersonality } from "@/data/tutors";
import { useAuth } from "@/contexts/AuthContext";
import { buildPerformanceSummary, getUserStats } from "@/lib/statsApi";

interface Props {
  tutor: TutorPersonality;
  goals: string[];
  onChangeTutor: () => void;
}

function TypingIndicator({ tutor }: { tutor: TutorPersonality }) {
  return (
    <div className="flex items-end gap-3 max-w-[80%]">
      <div className="w-8 h-8 rounded-full border-2 overflow-hidden shrink-0 bg-muted" style={{ borderColor: tutor.color }}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.avatarSeed}&backgroundColor=transparent`} alt={tutor.name} className="w-full h-full object-contain" />
      </div>
      <div className={`px-4 py-3 rounded-2xl rounded-bl-sm border ${tutor.bgClass} ${tutor.borderClass}`}>
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-2 h-2 rounded-full bg-current opacity-50"
              style={{ color: tutor.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, tutor }: { msg: ChatMessage; tutor: TutorPersonality }) {
  const isStudent = msg.role === "student";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex items-end gap-3 ${isStudent ? "flex-row-reverse max-w-[80%] ml-auto" : "max-w-[80%]"}`}
    >
      {!isStudent && (
        <div className="w-8 h-8 rounded-full border-2 overflow-hidden shrink-0 bg-muted" style={{ borderColor: tutor.color }}>
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.avatarSeed}&backgroundColor=transparent`} alt={tutor.name} className="w-full h-full object-contain" />
        </div>
      )}
      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isStudent
        ? "bg-primary text-primary-foreground rounded-br-sm"
        : `${tutor.bgClass} ${tutor.textClass} border ${tutor.borderClass} rounded-bl-sm`
      }`}>
        {msg.content.split("**").map((part, i) =>
          i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
        )}
        {msg.xpAwarded && (
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-500/20 rounded-lg px-2 py-1 w-fit">
            <Star className="h-3 w-3 fill-current" /> +{msg.xpAwarded} XP
          </div>
        )}
      </div>
    </motion.div>
  );
}

export const ChatInterface = ({ tutor, goals, onChangeTutor }: Props) => {
  const { user, profile } = useAuth();
  const [performanceSummary, setPerformanceSummary] = useState("No practice activity available yet.");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "0", role: "tutor", content: tutor.greeting, timestamp: new Date() },
    ...(goals.length > 0 ? [{
      id: "1",
      role: "tutor" as const,
      content: `I can see you want to focus on: **${goals.join(", ")}**. That's a great plan! ${tutor.emoji} Let's start — pick a quick reply below, or just type anything!`,
      timestamp: new Date(),
    }] : []),
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [overlay, setOverlay] = useState<{ xp: number; message: string } | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user) return;
    getUserStats(user.id, profile?.daily_goal ?? 10)
      .then((stats) => setPerformanceSummary(buildPerformanceSummary(stats, profile?.daily_goal ?? 10)))
      .catch(() => setPerformanceSummary("Practice activity could not be loaded for this chat."));
  }, [profile?.daily_goal, user]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const studentMsg: ChatMessage = { id: Date.now().toString(), role: "student", content: text, timestamp: new Date() };
    setMessages(prev => [...prev, studentMsg]);
    setInput("");
    setIsTyping(true);

    // Gemini API call
    const { content, xpAwarded } = await generateResponse(tutor, text, [...messages, studentMsg], {
      state: profile?.region,
      yearLevel: profile?.year_level,
      examType: profile?.exam_focus,
      performanceSummary,
    });
    const tutorMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "tutor", content, timestamp: new Date(), xpAwarded };
    setMessages(prev => [...prev, tutorMsg]);
    setIsTyping(false);

    if (xpAwarded) {
      setTotalXp(prev => prev + xpAwarded);
      if (xpAwarded >= 15) {
        setOverlay({ xp: xpAwarded, message: content.split("\n")[0] });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-border ${tutor.bgClass}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 overflow-hidden bg-muted" style={{ borderColor: tutor.color }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.avatarSeed}&backgroundColor=transparent`} alt={tutor.name} className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
          </div>
          <div>
            <p className={`font-bold text-sm ${tutor.textClass}`}>{tutor.name} {tutor.emoji}</p>
            <p className="text-xs text-muted-foreground">AI Study Coach · Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {totalXp > 0 && (
            <div className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-black text-yellow-600">+{totalXp} XP</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onChangeTutor} className="gap-1.5 text-xs rounded-full">
            <RefreshCw className="h-3.5 w-3.5" /> Change Tutor
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide bg-muted/10">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} tutor={tutor} />)}
        {isTyping && <TypingIndicator tutor={tutor} />}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-6 py-3 border-t border-border/50 flex gap-2 overflow-x-auto scrollbar-hide">
        {tutor.quickReplies.map((qr) => (
          <button
            key={qr}
            onClick={() => send(qr)}
            className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all hover:scale-105 ${tutor.bgClass} ${tutor.textClass} ${tutor.borderClass} hover:shadow-sm`}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-3 bg-background border-2 border-border rounded-2xl px-4 py-2 focus-within:border-primary/50 transition-colors"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${tutor.name} anything…`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${input.trim() ? `bg-gradient-to-br ${tutor.gradientClass} text-white shadow-md hover:shadow-lg hover:scale-105` : "bg-muted text-muted-foreground"}`}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-2">AI responses are for learning guidance only. Always verify with your teacher.</p>
      </div>

      {/* Encouragement Overlay */}
      {overlay && (
        <EncouragementOverlay
          tutor={tutor}
          xpGained={overlay.xp}
          message={overlay.message}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  );
};
