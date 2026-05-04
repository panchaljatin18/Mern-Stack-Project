"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center justify-center bg-slate-900">
      {/* Single soft orb — left */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
        }}
      />
      {/* Single soft orb — right */}
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.16) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] text-center px-6 max-w-[780px] w-full">
        {/* Live badge */}
        <div className="animate-fade-down inline-flex items-center gap-2 py-[7px] px-[18px] rounded-full mb-8 text-[13px] font-semibold text-white/70 border border-white/10 bg-white/5">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] shrink-0" />
          2,400+ homes available
        </div>

        {/* Main heading */}
        <h1
          className="animate-fade-up font-black leading-[1.1] m-0 mb-5 text-white tracking-[-1.5px]"
          style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}
        >
          Find Your Perfect
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-400 bg-clip-text text-transparent">
            Stay Anywhere
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up delay-100 text-white/50 max-w-[480px] mx-auto mb-[44px] leading-relaxed font-normal"
          style={{ fontSize: "clamp(1rem,2vw,1.15rem)" }}
        >
          Browse handpicked homes, save your favourites, and book your next trip in seconds.
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up delay-200 flex gap-3 justify-center flex-wrap">
          <Link
            href="/favourites"
            className="inline-flex items-center gap-[9px] py-[14px] px-[32px] rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-[14px] no-underline shadow-[0_6px_24px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(99,102,241,0.45)]"
          >
            <i className="fas fa-heart text-[13px]" />
            View Favourites
          </Link>

          <Link
            href="/host/add-home"
            className="inline-flex items-center gap-[9px] py-[14px] px-[32px] rounded-xl bg-white/5 border border-white/10 text-white/85 font-bold text-[14px] no-underline transition-all duration-200 hover:bg-white/10 hover:-translate-y-[2px]"
          >
            <i className="fas fa-plus text-[13px]" />
            List Your Home
          </Link>
        </div>

        {/* Stats — clean pill row */}
        <div className="animate-fade-up delay-300 grid grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-2.5 w-full max-w-[680px] mx-auto mt-14 p-2.5 rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/80 to-slate-800/70 shadow-[0_18px_45px_rgba(2,6,23,0.28)] backdrop-blur-md">
          {[
            { value: "2,400+", label: "Homes", icon: "fa-house-chimney", color: "#f43f5e" },
            { value: "18K+", label: "Guests", icon: "fa-users", color: "#22c55e" },
            { value: "120+", label: "Cities", icon: "fa-location-dot", color: "#38bdf8" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-center gap-2.5 text-center py-[14px] px-3 border border-white/10 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
            >
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-white shrink-0"
                style={{
                  background: stat.color || "#f59e0b",
                  boxShadow: `0 10px 24px ${stat.color || "#f59e0b"}55`,
                }}
              >
                <i className={`fas ${stat.icon || "fa-star"} text-[14px]`} />
              </span>
              <div>
                <div className="text-[22px] font-black text-white leading-none mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                  {stat.label === "Rating" ? "4.9" : stat.value}
                </div>
                <div className="text-[12px] text-white/80 font-bold">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade into white */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-b from-transparent to-[#f8fafc] pointer-events-none" />
    </section>
  );
}
