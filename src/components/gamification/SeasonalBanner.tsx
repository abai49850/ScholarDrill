import { Timer, Snowflake, ChevronRight } from "lucide-react";

export const SeasonalBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-md border-b-4 border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-6 group cursor-pointer transform hover:-translate-y-1 transition-transform">
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
          <p className="text-sm font-medium text-blue-100 mt-1 max-w-sm">Earn 2x XP on all Numeracy modules. Unlock the exclusive Yeti avatar!</p>
        </div>
      </div>

      <div className="relative z-10 shrink-0 w-full sm:w-auto flex justify-end">
        <div className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] group-hover:shadow-[0_2px_0_rgba(0,0,0,0.2)] group-hover:translate-y-[2px] transition-all flex items-center gap-2">
          Join Event
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
