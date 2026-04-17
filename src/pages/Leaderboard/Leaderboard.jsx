import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [helpers, setHelpers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1069/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setHelpers(data));
  }, []);

  const topThree = helpers.slice(0, 3);
  const theRest = helpers.slice(3);

  return (
    <div className=" bg-indigo-100 py-20 px-4 rounded-2xl">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900">
            Community <span className="text-primary">Titans</span>
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
              color="bg-slate-300"
              height="h-[380px]"
              shadow="shadow-gray-700"
            />
          )}

          {/* 1st Place */}
          {topThree[0] && (
            <PodiumCard
              user={topThree[0]}
              rank={1}
              color="bg-yellow-400"
              height="h-[450px]"
              shadow="shadow-yellow-200"
            />
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <PodiumCard
              user={topThree[2]}
              rank={3}
              color="bg-orange-400"
              height="h-[350px]"
              shadow="shadow-orange-200"
            />
          )}
        </div>

        {/* --- THE LIST (Rank 4+) --- */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-base-300">
          <div className="bg-white/30 rounded-[40px] shadow-inner overflow-hidden border border-white/50">
            {theRest.map((user, index) => (
              <div
                key={user._id}
                className="group relative flex items-center justify-between p-6 transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(0,0,0,0.05)] border-b border-white last:border-0"
              >
                {/* Visual Rank Indicator */}
                <div className="flex items-center gap-8">
                  <span className="text-2xl font-black italic text-slate-400/30 group-hover:text-primary transition-colors w-10">
                    {index + 4}
                  </span>

                  {/* Avatar */}
                  <div className="avatar placeholder">
                    <div className="bg-slate-200 text-slate-500 rounded-2xl w-14 h-14 transition-transform group-hover:scale-110 flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {user.userName[0]}
                      </span>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div>
                    <h3 className="font-black uppercase text-slate-700 tracking-tight group-hover:text-slate-900">
                      {user.userName}
                    </h3>
                    <p className="text-[10px] font-bold opacity-40 lowercase group-hover:opacity-60 transition-opacity">
                      {user._id}
                    </p>
                  </div>
                </div>

                {/* Badges - Hidden on small screens */}
                <div className="hidden lg:flex gap-2">
                  {user.badges.map((badge) => (
                    <span
                      key={badge}
                      className="text-[8px] font-black uppercase italic px-3 py-1.5 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-transparent group-hover:border-primary/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Points Badge */}
                <div className="text-right bg-slate-900 group-hover:bg-primary text-white px-7 py-3 rounded-2xl shadow-lg transition-all group-hover:scale-105">
                  <p className="text-2xl font-black italic leading-none">
                    {user.totalUpvotes}
                  </p>
                  <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">
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
      <span className="text-2xl font-black italic text-white -rotate-12">
        #{rank}
      </span>
    </div>

    <div className="avatar placeholder mt-6 mb-4">
      <div className="bg-slate-900 text-white rounded-[30px] w-20 shadow-lg flex justify-center items-center">
        <span className="text-3xl font-black">{user.userName[0]}</span>
      </div>
    </div>

    <h3 className="font-black uppercase text-xl text-slate-800 text-center leading-none">
      {user.userName}
    </h3>
    <p className="text-[12px] mt-2 font-bold text-primary opacity-70 mb-5 lowercase tracking-tighter">
      {user._id}
    </p>

    {/* Badges */}
    <div className="flex flex-wrap justify-center gap-1.5 mb-6">
      {user.badges.map((badge) => (
        <span
          key={badge}
          className="text-[9px] bg-slate-100 text-slate-600 font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-200"
        >
          {badge}
        </span>
      ))}
    </div>

    <div className="mt-auto flex items-center gap-2">
      <div className="text-center">
        <p className="text-4xl font-black italic text-slate-900 leading-none">
          {user.totalUpvotes}
        </p>
        <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
          Upvotes
        </p>
      </div>
    </div>
  </div>
);

export default Leaderboard;
