import React from "react";
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#222831] text-[#EEEEEE] border-t border-[#00ADB5]/20">
      <div className="footer max-w-7xl mx-auto p-10 flex flex-col md:flex-row justify-between gap-10">
        {/* ================= BRAND ASIDE ================= */}
        <aside className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#00ADB5] rounded-xl flex items-center justify-center shadow-[0_0_15px_#00ADB555]">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <p className="text-2xl font-extrabold tracking-tighter">
              Civic<span className="text-[#00ADB5]">Eye</span>
            </p>
          </div>
          <p className="text-white font-medium leading-relaxed">
            Empowering citizens to build smarter cities through real-time
            reporting and community-driven data.
            <br />
            <span className="text-xs mt-4 block opacity-50">
              © 2026 CivicEye Bangladesh. All rights reserved.
            </span>
          </p>
        </aside>

        {/* ================= NAVIGATION GROUPS ================= */}
        <nav>
          <h6 className="footer-title text-[#00ADB5] opacity-100 font-bold mb-4">
            Platform
          </h6>
          <Link
            to="/problems/report"
            className="link link-hover hover:text-[#00ADB5] transition-colors mb-2"
          >
            Map Reports
          </Link>
          <Link
            to="/problems/categorize"
            className="link link-hover hover:text-[#00ADB5] transition-colors mb-2"
          >
            Smart Categories
          </Link>
          <Link
            to="/problems/list"
            className="link link-hover hover:text-[#00ADB5] transition-colors mb-2"
          >
            Public Feed
          </Link>
          <Link
            to="/career"
            className="link link-hover hover:text-[#00ADB5] transition-colors"
          >
            Career
          </Link>
        </nav>

        <nav>
          <h6 className="footer-title text-[#00ADB5] opacity-100 font-bold mb-4">
            <Link to="/leaderboard">Leaderboard</Link>
          </h6>
          <Link
            to="/dashboard"
            className="link link-hover hover:text-[#00ADB5] transition-colors mb-2"
          >
            Dashboard
          </Link>
          <a className="link link-hover hover:text-[#00ADB5] transition-colors mb-2">
            Contact Admin
          </a>
          <a className="link link-hover hover:text-[#00ADB5] transition-colors mb-2">
            City Partnerships
          </a>
          <a className="link link-hover hover:text-[#00ADB5] transition-colors">
            Press Kit
          </a>
        </nav>

        <nav>
          <h6 className="footer-title text-[#00ADB5] opacity-100 font-bold mb-4">
            Social Presence
          </h6>
          <div className="grid grid-flow-col gap-4">
            <a className="text-2xl hover:text-[#00ADB5] transition-all hover:-translate-y-1 cursor-pointer">
              <FaTwitter />
            </a>
            <a className="text-2xl hover:text-[#00ADB5] transition-all hover:-translate-y-1 cursor-pointer">
              <FaGithub />
            </a>
            <a className="text-2xl hover:text-[#00ADB5] transition-all hover:-translate-y-1 cursor-pointer">
              <FaFacebook />
            </a>
            <a className="text-2xl hover:text-[#00ADB5] transition-all hover:-translate-y-1 cursor-pointer">
              <FaLinkedin />
            </a>
          </div>
          <div className="mt-6">
            <p className="text-xs text-white">Version 3.2.0-stable</p>
          </div>
        </nav>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="footer footer-center p-4 bg-[#1a1f26] text-white border-t border-white/5">
        <aside>
          <p>Built with 💚 for a better Bangladesh</p>
        </aside>
      </div>
    </footer>
  );
};

export default Footer;
