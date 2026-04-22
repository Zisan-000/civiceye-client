import React from "react";
import { ShieldCheck, Zap, MapPin, Cpu } from "lucide-react";
import { Link } from "react-router";
import { Helmet } from "react-helmet";
import { BiLogoMongodb } from "react-icons/bi";
import { SiExpress } from "react-icons/si";
import { RiReactjsLine } from "react-icons/ri";
import { TbBrandNodejs } from "react-icons/tb";
import { SiTailwindcss } from "react-icons/si";
import { CgVercel } from "react-icons/cg";
import { AiFillFire } from "react-icons/ai";
import { FaBriefcase } from "react-icons/fa";
const About = () => {
  const techs = [
    {
      icon: <BiLogoMongodb className="text-green-500 text-5xl" />,
      name: "MongoDB",
    },
    { icon: <SiExpress className="text-white text-5xl" />, name: "Express" },
    {
      icon: <RiReactjsLine className="text-blue-500 text-5xl" />,
      name: "React",
    },
    {
      icon: <TbBrandNodejs className="text-green-600 text-5xl" />,
      name: "Node",
    },
    {
      icon: <SiTailwindcss className="text-blue-400 text-5xl" />,
      name: "Tailwind",
    },
    { icon: <CgVercel className="text-white text-5xl" />, name: "Vercel" },
    {
      icon: <AiFillFire className="text-orange-500 text-5xl" />,
      name: "Firebase",
    },
  ];
  return (
    <div className="min-h-screen  p-6 lg:p-12">
      <Helmet>
        <title>About || CivicEye</title>
      </Helmet>
      {/* --- 1. HERO SECTION --- */}
      <section className="hero bg-linear-to-br from-primary/10 to-base-200 rounded-3xl overflow-hidden mb-16 shadow-inner">
        <div className="hero-content text-center py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="badge text-teal-600 badge-outline mb-4 px-4 py-3 font-bold uppercase ">
              Digital Governance 2026
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-black mb-6 leading-tight">
              Civic<span className="text-teal-600">Eye</span>
            </h1>
            <p className="text-xl opacity-80 leading-relaxed mb-8">
              A data-driven platform designed to bridge the gap between citizens
              and local authorities in Bangladesh. We transform community
              complaints into actionable data using modern MERN stack
              technology.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/problems/report">
                <button className="btn bg-teal-600 text-white btn-wide shadow-lg hover:bg-white hover:text-teal-600">
                  Report an Issue
                </button>
              </Link>
              <Link to="/interactivemap">
                <button className="btn text-teal-600 btn-wide border border-teal-600 hover:bg-teal-600 hover:text-white">
                  View Live Map
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. THE CORE PILLARS (The "CSE" Logic) --- */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
          <Cpu className="text-teal-600" /> How the System Thinks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trust Score */}
          <div className="card bg-base-100 shadow-xl border-b-4 border-primary hover:-translate-y-2 transition-transform">
            <div className="card-body">
              <div className="w-12 h-12 bg-teal-600/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="text-teal-600" />
              </div>
              <h3 className="card-title font-bold">Trust Score Algorithm</h3>
              <p className="text-sm opacity-70">
                Our system uses a dynamic 0-100 Trust Score. High-quality
                reports earn points, while fake reports result in a **-50 point
                penalty**, ensuring community accountability.
              </p>
            </div>
          </div>

          {/* Priority Logic */}
          <div className="card bg-base-100 shadow-xl border-b-4 border-secondary hover:-translate-y-2 transition-transform">
            <div className="card-body">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-secondary" />
              </div>
              <h3 className="card-title font-bold">Automated Prioritization</h3>
              <p className="text-sm opacity-70">
                We use weighted sorting based on upvotes and flags. Issues with
                over 10 upvotes are automatically escalated to{" "}
                <strong>High Priority</strong>
                for immediate admin review.
              </p>
            </div>
          </div>

          {/* Geo-Spatial */}
          <div className="card bg-base-100 shadow-xl border-b-4 border-accent hover:-translate-y-2 transition-transform">
            <div className="card-body">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-teal-600" />
              </div>
              <h3 className="card-title font-bold">Duplicate Detection</h3>
              <p className="text-sm opacity-70">
                Powered by MongoDB Geospatial indexing, CivicEye detects similar
                reports within a 10-meter radius, preventing clutter and
                redundant data entries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-24  mx-auto">
        <div className="bg-gray-50 rounded-3xl p-10 md:p-16 text-center shadow-sm border border-gray-100">
          {/* Completed Heading with Icon */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
            <FaBriefcase className="text-[#00ADB5]" />
            Careers at CivicEye
          </h2>

          {/* Supporting Text */}
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Passionate about civic tech and building better communities? We are
            always looking for driven engineers, designers, and city advocates
            to help us grow.
          </p>

          {/* Call to Action Button */}

          <Link
            to="/career"
            className="btn bg-[#00ADB5] hover:bg-teal-600 text-white border-none px-8 rounded-2xt shadow-md hover:shadow-lg transition-all hover:-translate-y-1 text-base h-auto py-3"
          >
            View Open Positions
          </Link>
        </div>
      </section>

      {/* --- 4. TECHNOLOGY STACK --- */}
      <section className="text-center pb-12">
        <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest my-16">
          Developed with modern technologies
        </h3>

        <div className="relative w-80 h-80 mx-auto rotate-circle">
          {techs.map((tech, index) => {
            const angle = (360 / techs.length) * index;

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `
              rotate(${angle}deg)
              translate(120px)
              rotate(-${angle}deg)
            `,
                }}
              >
                <div className="keep-upright bg-black p-4 rounded-full">
                  {tech.icon}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- 5. FOOTER-STYLE CALL TO ACTION --- */}
      <footer className="text-center mt-20 p-10 bg-base-200 rounded-3xl border-t border-base-300">
        <p className="font-bold opacity-50 mb-2 italic text-xs">
          A CSE Semester Project Implementation
        </p>
        <p className="opacity-70">© 2026 CivicEye. Dhaka, Bangladesh.</p>
      </footer>
    </div>
  );
};

export default About;
