import React, { use, useEffect, useRef } from "react";
import CountUp from "react-countup";
import { Link } from "react-router";
import Leaderboard from "../../pages/Leaderboard/Leaderboard";
import { FaStar } from "react-icons/fa";
import { BsHexagonFill } from "react-icons/bs";
import gsap from "gsap";
import { ScrollSmoother, ScrollTrigger, SplitText } from "gsap/all";
import { AuthContext } from "../../provider/AuthProvider";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

const Banner = () => {
  const bannerTitleRef = useRef(null);
  const { user } = use(AuthContext);
  // console.log(user);

  useEffect(() => {
    // Target the h2 and p specifically inside the ref
    const targets = bannerTitleRef.current.querySelectorAll("h2, p");

    const split = new SplitText(targets, {
      type: "lines, words",
      linesClass: "clip-text",
    });

    gsap.from(split.words, {
      scrollTrigger: {
        trigger: bannerTitleRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.02, // Fast stagger for a clean reveal
      ease: "power2.out",
    });

    return () => split.revert();
  }, []);

  return (
    <>
      <div className="min-h-screen pb-10 mt-20 font-mozilla-text ">
        <div
          className="flex items-center gap-24 whitespace-nowrap"
          style={{
            display: "inline-flex",
            animation: "marquee 40s linear infinite",
            paddingLeft: "100%",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {/* Item 1 - Breaking News Style */}
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-[10px] font-black px-2 py-0.5 rounded-sm text-white animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              LIVE
            </span>
            <span className="text-black text-sm font-semibold tracking-tight">
              Heavy rain alert: 4 new waterlogging reports in Dhanmondi.
            </span>
          </div>

          {/* Item 2 - Gamification/Trust Score */}
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00ADB5] rounded-full shadow-[0_0_10px_#00ADB5] animate-pulse"></div>
            <span className="text-black text-[11px] font-black uppercase tracking-[0.2em]">
              Trust Leader:
            </span>
            <span className="text-teal-700 text-sm font-medium">
              User{" "}
              <span className="text-black border-b border-teal-500/50">
                zobaer.zi***
              </span>{" "}
              just reached 850 points!
            </span>
          </div>

          {/* Item 3 - Educational/Tips */}
          <div className="flex items-center gap-3">
            <span className="text-teal-900 font-light text-xl">/</span>
            <span className="text-slate-400 text-sm italic font-medium">
              CivicEye prevents duplicates within 10m of existing reports.
            </span>
          </div>

          {/* Item 4 - System Update */}
          <div className="flex items-center gap-3">
            <span className="bg-[#2d333b] text-[#00ADB5] text-[10px] font-black px-2 py-1 rounded border border-[#00ADB5]/20 uppercase">
              Update
            </span>
            <span className="text-teal-700 text-sm font-medium">
              New "Smart Category" forms added for Waste Management.
            </span>
          </div>
        </div>

        {/* ================= SECTION 1: HERO ================= */}
        <section
          className="relative text-white overflow-hidden py-24 lg:py-32 rounded-3xl shadow-2xl mt-2 bg-gray-900"
          // style={{
          //   WebkitMaskImage:
          //     "linear-gradient(to bottom, black 60%, transparent 100%)",
          //   // maskImage:
          //   //   "linear-gradient(to bottom, black 60%, transparent 100%)",
          // }}
        >
          {/* 1. The ImgBB Photo as the Full Background */}
          <img
            src="https://i.ibb.co.com/DDYFc0Bm/pexels-the-ahnafpiash-11260693.jpg"
            alt="City Background"
            className="absolute inset-0 w-full h-full object-cover z-0 banner-image"
          />

          <div className="absolute inset-0 z-0 bg-linear-to-br from-black/80 via-black/50 to-teal-900/70 "></div>

          {/* 3. Abstract Background Shapes (Opacity lowered so it doesn't wash out the city) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute top-48 right-12 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center ">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold  text-white">
              Empowering Citizens, Building Better Cities
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 ">
              See a Problem? <br className="hidden md:block" />
              {/* Changed text gradient to bright yellow/amber so it stands out against the dark photo */}
              <span className="text-transparent font-mozilla-text bg-clip-text  bg-linear-to-br from-white via-teal-600 to-teal-500 ">
                Report it with CivicEye.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium shadow-black drop-shadow-md">
              Join thousands of active citizens. Report potholes, water leaks,
              and community issues instantly. Earn trust points and watch your
              city improve.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/problems/report"
                className="btn btn-warning btn-lg shadow-lg hover:scale-105 transition-transform border-none text-white  bg-linear-to-br from-gray-500 via-teal-600 to-teal-800"
              >
                Report an Issue Now
              </Link>
              <Link
                to="/interactivemap"
                className="btn btn-outline text-white hover:bg-white hover:text-indigo-600 border-white btn-lg backdrop-blur-sm"
              >
                View Community Map
              </Link>
            </div>
          </div>
        </section>

        <div>
          {user?.email ? (
            <Leaderboard />
          ) : (
            <div className="text-center p-10 my-10 bg-gray-50/40 rounded-2xl border-2 border-dashed">
              <h2 className="text-xl font-bold text-[#222831]">Members Only</h2>
              <p className="text-gray-500">
                Please login to view the community impact leaderboard.
              </p>
              <Link to="/auth/login" className="btn btn-primary mt-4">
                Login Now
              </Link>
            </div>
          )}
        </div>

        {/* ================= SECTION 2: HOW IT WORKS ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24 banner-section">
          <div className="text-center mb-16" ref={bannerTitleRef}>
            <h2 className="text-4xl font-bold text-base-content mb-4">
              How CivicEye Works
            </h2>
            <h3 className="text-gray-500 max-w-xl mx-auto">
              Three simple steps to make your neighborhood a better, safer place
              to live.
            </h3>
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
                <div className="w-16 h-16 rounded-2xl bg-teal-600/10 text-teal-600 flex items-center justify-center mb-4">
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
        <section className="bg-base-200 py-24 rounded-2xl shadow-lg border border-base-300 banner-section">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="relative">
                  {/* Decorative background behind image placeholder */}
                  <div className="absolute -inset-4 bg-linear-to-r from-green-800 to-teal-400 rounded-3xl opacity-30 blur-lg"></div>
                  <div
                    className="relative bg-base-100 p-8 rounded-3xl shadow-2xl border border-base-300"
                    ref={bannerTitleRef}
                  >
                    <h3 className="text-2xl font-bold mb-6 text-center">
                      Smart Tech for Smart Cities
                    </h3>
                    <div className="space-y-4">
                      {/* Fake UI mockup of features */}
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="badge bg-teal-400 text-white badge-lg">
                          +5
                        </div>
                        <div className="font-semibold">
                          Trust Score Rewarded
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="badge bg-teal-600 text-white badge-lg">
                          AI
                        </div>
                        <div className="font-semibold">
                          Smart Duplicate Detection
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="badge bg-teal-900 text-white badge-lg">
                          ↑ 42
                        </div>
                        <div className="font-semibold">Community Upvotes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 space-y-8" ref={bannerTitleRef}>
                <h2 className="text-4xl font-bold text-base-content">
                  More than just a complaint box.
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">
                  CivicEye is built with cutting-edge technology to prevent spam
                  and highlight the most urgent issues.
                </p>

                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-600/20 flex items-center justify-center shrink-0">
                      <FaStar className="text-yellow-400" />
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
                      <BsHexagonFill className="text-red-500" />
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
            <div className="stat  shadow-lg rounded-3xl border border-base-200 text-center py-8 bg-blue-500/80 text-white transition-colors cursor-default">
              <div className="stat-title text-gray-200 text-sm">
                Total Reports
              </div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={1204}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              </div>
              <div className="stat-desc font-medium text-gray-200 text-sm">
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
            <div className="stat  shadow-lg rounded-3xl border border-base-200 text-center py-8 bg-success/80 text-white transition-colors cursor-default">
              <div className="stat-title text-gray-200 text-sm">
                Issues Resolved
              </div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={89}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
                %
              </div>
              <div className="stat-desc font-medium text-gray-200 text-sm">
                City-wide average
              </div>
            </div>
            <div className="stat  shadow-lg rounded-3xl border border-base-200 text-center py-8 bg-warning/80 text-white transition-colors cursor-default">
              <div className="stat-title text-gray-200 text-sm">
                Active Citizens
              </div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={3000}
                  duration={3}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              </div>
              <div className="stat-desc font-medium text-gray-200 text-sm">
                Working together
              </div>
            </div>
            <div className="stat  shadow-lg rounded-3xl border border-base-200 text-center py-8 bg-secondary/80 text-white transition-colors cursor-default">
              <div className="stat-title text-gray-200 text-sm">
                Upvotes Cast
              </div>
              <div className="stat-value text-4xl mt-2 mb-1">
                <CountUp
                  end={12}
                  duration={5}
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
                K+
              </div>
              <div className="stat-desc font-medium text-gray-200 text-sm">
                Validating problems
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: CTA ================= */}
        <section className=" mx-auto px-6 mb-10">
          <div className="bg-linear-to-br from-teal-700/60 via-teal-400/30 to-white text-black rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
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
                className="btn bg-teal-600 text-white btn-lg px-10 rounded-full shadow-xl hover:scale-105 transition-transform border-none"
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
