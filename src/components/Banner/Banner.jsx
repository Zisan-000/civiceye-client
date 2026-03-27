import React from "react";
import CountUp from "react-countup";
import { Link } from "react-router";

const Banner = () => {
  return (
    <>
      <div className="min-h-screen bg-base-100 font-sans pb-10">
        {/* Announcement Bar */}
        <div className="w-full rounded-3xl mt-3 bg-gray-800 border-y border-teal-600 py-2 overflow-hidden  top-16 z-40">
          {/* The Animation Container */}
          <div
            className="flex items-center gap-16 whitespace-nowrap"
            style={{
              display: "inline-flex",
              animation: "marquee 40s linear infinite",
              paddingLeft: "100%", // Starts from the far right
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.animationPlayState = "paused")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.animationPlayState = "running")
            }
          >
            {/* Item 1 */}
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded text-white animate-pulse">
                LIVE
              </span>
              <span className="text-[#EEEEEE] text-sm font-medium">
                Heavy rain alert: 4 new waterlogging reports in Dhanmondi.
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00ADB5] rounded-full shadow-[0_0_8px_#00ADB5]"></div>
              <span className="text-[#00ADB5] text-sm font-bold uppercase tracking-widest">
                Trust Leader:
              </span>
              <span className="text-[#EEEEEE] text-sm font-medium">
                User ak017**** just reached 850 points!
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-lg">|</span>
              <span className="text-[#EEEEEE] text-sm opacity-80 italic">
                CivicEye prevents duplicates within 10m of existing reports.
              </span>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-2">
              <span className="bg-[#393E46] text-[#00ADB5] text-[10px] font-bold px-2 py-0.5 rounded border border-[#00ADB5]/30">
                UPDATE
              </span>
              <span className="text-[#EEEEEE] text-sm font-medium">
                New "Smart Category" forms added for Waste Management.
              </span>
            </div>
          </div>
        </div>
        {/* ================= SECTION 1: HERO ================= */}
        <section
          className="relative bg-linear-to-br from-gray-500 via-teal-600 to-teal-800 text-white overflow-hidden py-24 lg:py-32 rounded-3xl shadow-2xl mt-2"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute top-48 right-12 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold tracking-wide text-white">
              Empowering Citizens, Building Better Cities
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              See a Problem? <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-amber-500">
                Report it with CivicEye.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of active citizens. Report potholes, water leaks,
              and community issues instantly. Earn trust points and watch your
              city improve.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/problems/report"
                className="btn btn-warning btn-lg shadow-lg hover:scale-105 transition-transform border-none"
              >
                Report an Issue Now
              </Link>
              <Link
                to="/problems/list"
                className="btn btn-outline text-white hover:bg-white hover:text-indigo-600 border-white btn-lg backdrop-blur-sm"
              >
                View Community Map
              </Link>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: HOW IT WORKS ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">
              How CivicEye Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to make your neighborhood a better, safer place
              to live.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card bg-base-100 shadow-xl border-t-4 border-error hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-xl">1. Spot the Issue</h3>
                <p className="text-gray-500 text-sm">
                  Find a pothole, broken streetlight, or illegal dumping in your
                  area.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card bg-base-100 shadow-xl border-t-4 border-primary hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-xl">2. Pin & Report</h3>
                <p className="text-gray-500 text-sm">
                  Use our Smart Categorization or GPS Map to log the exact
                  location and details.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card bg-base-100 shadow-xl border-t-4 border-success hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-xl">3. Track Resolution</h3>
                <p className="text-gray-500 text-sm">
                  Watch the status change from Pending to Resolved as
                  authorities take action.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: KEY FEATURES ================= */}
        <section className="bg-base-200 py-24 rounded-2xl shadow-lg border border-base-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="relative">
                  {/* Decorative background behind image placeholder */}
                  <div className="absolute -inset-4 bg-linear-to-r from-primary to-teal-500 rounded-3xl opacity-30 blur-lg"></div>
                  <div className="relative bg-base-100 p-8 rounded-3xl shadow-2xl border border-base-300">
                    <h3 className="text-2xl font-bold mb-6 text-center">
                      Smart Tech for Smart Cities
                    </h3>
                    <div className="space-y-4">
                      {/* Fake UI mockup of features */}
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="badge badge-primary badge-lg">+5</div>
                        <div className="font-semibold">
                          Trust Score Rewarded
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="badge badge-warning badge-lg">AI</div>
                        <div className="font-semibold">
                          Smart Duplicate Detection
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="badge badge-info badge-lg">↑ 42</div>
                        <div className="font-semibold">Community Upvotes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-4xl font-bold text-base-content">
                  More than just a complaint box.
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  CivicEye is built with cutting-edge technology to prevent spam
                  and highlight the most urgent issues.
                </p>

                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      ⭐
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">
                        The Trust Score Engine
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Earn points for valid reports. Users with high scores
                        get their issues prioritized by city admins.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                      🛑
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">Duplicate Detection</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Our geo-spatial algorithm prevents map clutter by
                        grouping similar issues within a 10-meter radius.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: IMPACT STATS ================= */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat bg-base-100 shadow-lg rounded-3xl border border-base-200 text-center py-8 hover:bg-blue-500 hover:text-white transition-colors cursor-default">
              <div className="stat-title opacity-70">Total Reports</div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={1204}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              </div>
              <div className="stat-desc font-medium opacity-80">
                ↗︎
                <CountUp
                  end={400}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
                <span className="pl-1">this month</span>
              </div>
            </div>
            <div className="stat bg-base-100 shadow-lg rounded-3xl border border-base-200 text-center py-8 hover:bg-success hover:text-white transition-colors cursor-default">
              <div className="stat-title opacity-70">Issues Resolved</div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={89}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
                %
              </div>
              <div className="stat-desc font-medium opacity-80">
                City-wide average
              </div>
            </div>
            <div className="stat bg-base-100 shadow-lg rounded-3xl border border-base-200 text-center py-8 hover:bg-warning hover:text-white transition-colors cursor-default">
              <div className="stat-title opacity-70">Active Citizens</div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={3000}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              </div>
              <div className="stat-desc font-medium opacity-80">
                Working together
              </div>
            </div>
            <div className="stat bg-base-100 shadow-lg rounded-3xl border border-base-200 text-center py-8 hover:bg-secondary hover:text-white transition-colors cursor-default">
              <div className="stat-title opacity-70">Upvotes Cast</div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={12}
                  duration={5}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
                K+
              </div>
              <div className="stat-desc font-medium opacity-80">
                Validating problems
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: CTA ================= */}
        <section className="max-w-5xl mx-auto px-6 mb-10">
          <div className="bg-linear-to-br from-indigo-700 via-purple-700 to-indigo-800 text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Grid Pattern overlay - kept white (#ffffff) as it looks great against blue */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to make an impact?
              </h2>
              <p className="text-lg md:text-xl opacity-80 mb-8 max-w-2xl mx-auto">
                Your voice matters. Report an issue today and help us build a
                more responsive, safer, and cleaner city.
              </p>
              <Link
                to="/auth/register"
                className="btn btn-warning btn-lg px-10 rounded-full shadow-xl hover:scale-105 transition-transform border-none"
              >
                Join CivicEye Today
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Banner;
