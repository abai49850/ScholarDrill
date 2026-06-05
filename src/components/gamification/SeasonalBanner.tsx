import { Timer, Snowflake, ChevronRight } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";

interface Props {
  mathsToday: number;
  claimed: boolean;
  onClaim: () => void;
}

export const SeasonalBanner = ({ mathsToday, claimed, onClaim }: Props) => {
  const target = 5;
  const complete = mathsToday >= target;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-md border-b-4 border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Decorative Elements */}
      <Snowflake className="absolute top-2 left-4 h-8 w-8 text-white/20 animate-spin-slow" />
      <Snowflake className="absolute bottom-2 right-1/4 h-12 w-12 text-white/10" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none mix-blend-overlay" />

      <div className="relative z-10 flex items-center gap-4 w-full">
        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0 shadow-inner">
          <span className="text-3xl">❄️</span>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-wider text-blue-200 bg-black/20 px-2 py-0.5 rounded-md">Live Event</span>
            <div className="flex items-center gap-1 text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-md shadow-sm">
              <Timer className="h-3 w-3" /> 3 Days Left
            </div>
          </div>
          <h3 className="font-black text-xl md:text-2xl tracking-tight text-white drop-shadow-sm">Winter Study Dash</h3>
          <p className="text-sm font-medium text-blue-100 mt-1 max-w-sm">
            Complete {target} numeracy questions today to collect a 150 XP event bonus.
          </p>
          <div className="mt-3 h-2 max-w-sm rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-white" style={{ width: `${Math.min((mathsToday / target) * 100, 100)}%` }} />
          </div>
          <p className="text-xs font-bold text-blue-100 mt-1">{Math.min(mathsToday, target)}/{target} numeracy questions completed today</p>
        </div>
      </div>

      <div className="relative z-10 shrink-0 w-full sm:w-auto flex justify-end">
        {complete ? (
          <Button
            type="button"
            disabled={claimed}
            onClick={onClaim}
            className="bg-white text-indigo-700 hover:bg-blue-50 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)]"
          >
            {claimed ? "Bonus Claimed" : "Collect 150 XP"}
          </Button>
        ) : (
          <Link
            to="/practice?subject=maths"
            className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] hover:translate-y-[2px] transition-all flex items-center gap-2"
          >
            Start Numeracy
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
