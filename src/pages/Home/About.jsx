import React from "react";
import { ShieldCheck, Zap, MapPin, Cpu } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-base-100 p-6 lg:p-12">
      {/* --- 1. HERO SECTION --- */}
      <section className="hero bg-linear-to-br from-primary/10 to-base-200 rounded-3xl overflow-hidden mb-16 shadow-inner">
        <div className="hero-content text-center py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="badge badge-primary badge-outline mb-4 px-4 py-3 font-bold uppercase tracking-widest">
              Digital Governance 2026
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-base-content mb-6 leading-tight">
              Civic<span className="text-primary">Eye</span>
            </h1>
            <p className="text-xl opacity-80 leading-relaxed mb-8">
              A data-driven platform designed to bridge the gap between citizens
              and local authorities in Bangladesh. We transform community
              complaints into actionable data using modern MERN stack
              technology.
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn btn-primary btn-wide shadow-lg">
                Report an Issue
              </button>
              <button className="btn btn-outline btn-wide">
                View Live Map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. THE CORE PILLARS (The "CSE" Logic) --- */}
      <section className="mb-24">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
          <Cpu className="text-primary" /> How the System Thinks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trust Score */}
          <div className="card bg-base-100 shadow-xl border-b-4 border-primary hover:-translate-y-2 transition-transform">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="text-primary" />
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
                <MapPin className="text-accent" />
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

      {/* --- 3. THE WORKFLOW --- */}
      <section className="bg-neutral text-neutral-content p-12 rounded-3xl mb-24 text-center">
        <h2 className="text-3xl font-bold mb-10">Transparent Process</h2>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4 italic">
              1
            </div>
            <p className="font-bold">Citizen Reports</p>
          </div>
          <div className="hidden lg:block h-1 w-20 bg-primary-content/20"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4 italic">
              2
            </div>
            <p className="font-bold">Community Vote</p>
          </div>
          <div className="hidden lg:block h-1 w-20 bg-primary-content/20"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4 italic">
              3
            </div>
            <p className="font-bold">Admin Verifies</p>
          </div>
          <div className="hidden lg:block h-1 w-20 bg-primary-content/20"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4 italic">
              4
            </div>
            <p className="font-bold">Solution Applied</p>
          </div>
        </div>
      </section>

      {/* --- 4. TECHNOLOGY STACK --- */}
      <section className="text-center pb-12">
        <h3 className="text-sm font-bold opacity-40 uppercase tracking-widest mb-8">
          Developed with modern technologies
        </h3>
        <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50 hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-black">MongoDB</span>
          <span className="text-2xl font-black">Express.js</span>
          <span className="text-2xl font-black">React.js</span>
          <span className="text-2xl font-black">Node.js</span>
          <span className="text-2xl font-black">Tailwind</span>
          <span className="text-2xl font-black">Firebase</span>
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
