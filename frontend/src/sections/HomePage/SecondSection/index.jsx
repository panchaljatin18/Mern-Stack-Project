"use client";

import { useEffect, useState } from "react";
import HomeCard from "../../../components/HomeCard";
import Toast from "../../../components/Toast";
import Link from "next/link";
import { api } from "../../../lib/api";

export default function SecondSection() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    api.getHomes()
      .then((data) => { setHomes(data); setLoading(false); })
      .catch(() => { setHomes([]); setLoading(false); });
  }, []);

  const addToFavourite = async (id) => {
    try {
      const data = await api.addFavourite(id);
      if (data.success) {
        setSuccessMsg("Success! Added to Favourites.");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch { /* silently fail */ }
  };

  return (
    <>
      <Toast message={successMsg} />
      <section className="bg-slate-50 py-[72px] pb-[96px]">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Section header */}
          <div className="animate-fade-up mb-12">
            <p className="text-[12px] font-bold text-indigo-500 tracking-[1.5px] uppercase m-0 mb-2.5">
              ✦ Featured Listings
            </p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2
                className="font-black text-slate-900 m-0 tracking-[-0.5px]"
                style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)" }}
              >
                Homes you'll love
              </h2>
              <Link
                href="/bookings"
                className="text-[13px] font-bold text-indigo-500 no-underline flex items-center gap-1.5 transition-all duration-200 hover:gap-2.5 group"
              >
                View bookings
                <i className="fas fa-arrow-right text-[11px]" />
              </Link>
            </div>
          </div>

          {/* Cards */}
          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shimmer h-[360px] rounded-[20px]" />
              ))}
            </div>
          ) : homes.length === 0 ? (
            <div className="text-center py-20 px-6 text-slate-400 text-base font-semibold">
              <div className="text-[56px] mb-4 text-slate-300"><i className="fas fa-house-circle-xmark"></i></div>
              No homes available yet.
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {homes.map((home, i) => (
                <div
                  key={home.id}
                  className={`animate-fade-up delay-${Math.min((i % 6 + 1) * 100, 600)}`}
                >
                  <HomeCard home={home}>
                    <div className="flex gap-2">
                      <Link
                        href={`/home-details/${home.id}`}
                        className="flex-1 text-center bg-slate-900 text-white py-2.5 rounded-lg no-underline font-bold text-[13px] transition-colors duration-200 hover:bg-slate-800"
                      >
                        <i className="fas fa-eye mr-1.5" />
                        Details
                      </Link>
                      <button
                        onClick={() => addToFavourite(home.id)}
                        className="flex-1 bg-gradient-to-br from-rose-500 to-rose-600 text-white py-2.5 border-none rounded-lg cursor-none font-bold text-[13px] transition-opacity duration-200 hover:opacity-90"
                      >
                        <i className="fas fa-heart mr-1.5" />
                        Save
                      </button>
                    </div>
                  </HomeCard>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
