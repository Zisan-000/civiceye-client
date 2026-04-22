import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Loading from "../../components/Loading/Loading";

const Leaderboard = () => {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use your actual Vercel URL here!
    const url = "https://civiceye-server.vercel.app";

    fetch(`${url}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setHelpers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading></Loading>;

  const safeHelpers = Array.isArray(helpers) ? helpers : [];

  const topThree = safeHelpers.slice(0, 3);
  const theRest = safeHelpers.slice(3);

  return (
    <div className=" mt-10  py-20 px-4 rounded-2xl mb-2">
      <Helmet>
        <title>Home || CivicEye</title>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold uppercase italic font-mozilla-text text-slate-900">
            Community <span className="text-teal-900 ">Titans</span>
          </h1>
          <p className="font-bold opacity-60 uppercase tracking-widest mt-2">
            Recognizing our most active citizens
          </p>
        </header>

        {/* --- THE PODIUM (Top 3) --- */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-12">
          {/* 2nd Place */}
          {topThree[1] && (
            <PodiumCard
              user={topThree[1]}
              rank={2}
              color="bg-zinc-600"
              height="h-[380px]"
              shadow="shadow-teal-800"
            />
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <PodiumCard
              user={topThree[0]}
              rank={1}
              color="bg-yellow-500"
              height="h-[450px]"
              shadow="shadow-teal-200"
            />
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <PodiumCard
              user={topThree[2]}
              rank={3}
              color="bg-yellow-800"
              height="h-[350px]"
              shadow="shadow-teal-600"
            />
          )}
        </div>

        {/* --- THE LIST (Rank 4+) --- */}
        <div className="bg-white rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden border border-base-300">
          {/* The Inner container - reduced padding on mobile */}
          <div className="bg-white/30 rounded-[30px] md:rounded-[40px] shadow-inner overflow-hidden border border-white/50">
            {theRest.map((user, index) => (
              <div
                key={user._id}
                className="group relative flex items-center justify-between p-4 md:p-6 transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] border-b border-slate-50 last:border-0"
              >
                {/* Left Side: Rank, Avatar, Name */}
                <div className="flex items-center gap-3 md:gap-8">
                  {/* Rank: smaller text and width on mobile */}
                  <span className="text-lg md:text-2xl font-mozilla-text italic text-slate-400/30 group-hover:text-teal-600 transition-colors w-6 md:w-10">
                    {index + 4}
                  </span>

                  {/* Avatar: shrunken on mobile */}
                  <div className="avatar placeholder">
                    <div className="bg-slate-200 text-slate-500 rounded-xl md:rounded-2xl w-10 h-10 md:w-14 md:h-14 transition-transform group-hover:scale-110 flex items-center justify-center">
                      <span className="text-sm md:text-xl font-bold">
                        {user.userName[0]}
                      </span>
                    </div>
                  </div>

                  {/* Name & ID */}
                  <div className="max-w-30 sm:max-w-none">
                    <h3 className="font-mozilla-text uppercase text-xs md:text-base text-slate-700 tracking-tight group-hover:text-slate-900 truncate sm:whitespace-normal">
                      {user.userName}
                    </h3>
                    {/* ID: Hidden on very small screens to prevent overlap */}
                    <p className="hidden sm:block text-[10px] font-bold opacity-40 lowercase group-hover:opacity-60 transition-opacity">
                      {user._id}
                    </p>
                  </div>
                </div>

                {/* Middle: Badges - Hidden on mobile/tablet (only visible on Large screens) */}
                <div className="hidden lg:flex gap-2">
                  {user.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-[8px] font-mozilla-text uppercase italic px-3 py-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:bg-teal-600/10 group-hover:text-teal-600 transition-colors border border-transparent group-hover:border-primary/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Right Side: Points - Compact on mobile */}
                <div className="text-right bg-slate-900 group-hover:bg-teal-600 text-white px-4 md:px-7 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg transition-all group-hover:scale-105">
                  <p className="text-lg md:text-2xl font-mozilla-text italic leading-none">
                    {user.totalUpvotes}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-mozilla-text uppercase opacity-60 tracking-widest">
                    Pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for the Podium
const PodiumCard = ({ user, rank, color, height }) => (
  <div
    className={`relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-md rounded-[50px] shadow-2xl border-b-12 ${height} w-full md:w-72 transition-all hover:-translate-y-2 border-slate-100`}
  >
    {/* Rank Badge */}
    <div
      className={`absolute -top-6 w-14 h-14 ${color} rounded-3xl flex items-center justify-center shadow-xl border-4 border-white rotate-12`}
    >
      <span className="text-2xl font-mozilla-text font-extrabold italic text-white -rotate-12">
        #{rank}
      </span>
    </div>

    <div className="avatar placeholder mt-6 mb-4">
      <div className="bg-slate-900 text-white rounded-[30px] w-20 shadow-lg flex justify-center items-center">
        <span className="text-3xl font-mozilla-text">{user.userName[0]}</span>
      </div>
    </div>

    <h3 className="font-mozilla-text uppercase text-xl text-slate-800 text-center leading-none">
      {user.userName}
    </h3>
    <p className="text-[12px] mt-2 font-bold text-teal-600 opacity-70 mb-5 lowercase tracking-tighter">
      {user._id}
    </p>

    {/* Badges */}
    <div className="flex flex-wrap justify-center gap-1.5 mb-6">
      {user.badges.map((badge) => (
        <span
          key={badge}
          className="text-[9px] bg-slate-100 text-slate-600 font-mozilla-text px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200"
        >
          {badge}
        </span>
      ))}
    </div>

    <div className="mt-auto flex items-center gap-2">
      <div className="text-center">
        <p className="text-4xl font-mozilla-text italic text-slate-900 leading-none">
          {user.totalUpvotes}
        </p>
        <p className="text-[10px] font-mozilla-text opacity-30 uppercase tracking-[0.2em]">
          Upvotes
        </p>
      </div>
    </div>
  </div>
);

export default Leaderboard;
