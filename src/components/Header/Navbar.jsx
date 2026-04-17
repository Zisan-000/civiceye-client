import React, { use, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = use(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const ADMIN_EMAILS = ["ak01739394811@gmail.com", "your-email@gmail.com"];
  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  console.log(isAdmin);
  const logoutModalRef = useRef(null);
  // console.log(user);
  useEffect(() => {
    if (user?.email) {
      const fetchScore = () => {
        fetch(`http://localhost:1069/api/users/${user.email}`)
          .then((res) => res.json())
          .then((data) => setDbUser(data))
          .catch((err) => console.error("Error fetching user score:", err));
      };

      fetchScore();

      // Strategy: Re-fetch every 30 seconds to keep it live
      const interval = setInterval(fetchScore, 30000);
      return () => clearInterval(interval);
    }
  }, [user]); // Runs whenever the logged-in user changes
  const navigate = useNavigate();
  const handleConfirmLogout = () => {
    // We trigger the logout logic
    if (logoutModalRef.current) {
      logoutModalRef.current.close();
    }
    logout()
      .then(() => {
        toast.success("Logged out successfully!");
        navigate("/");
        // Small delay before reload to let the toast be seen
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed. Please try again.");
      });
  };
  return (
    <>
      <div className="navbar  top-0 z-50 bg-[#EEEEEE]/90 backdrop-blur-md shadow-sm border-b border-gray-200/50 px-4 md:px-8">
        {/* ================= NAVBAR START (Logo & Mobile Menu) ================= */}
        <div className="navbar-start">
          {/* Mobile Menu */}
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-[#222831]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-60 p-2 shadow-xl border border-gray-100"
            >
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${
                      isActive
                        ? "text-[#00ADB5] bg-[#00ADB5]/10"
                        : "text-[#393E46] hover:text-[#00ADB5]"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <span className="text-[#393E46] font-medium pointer-events-none">
                  Problems
                </span>
                <ul className="p-2">
                  <li>
                    <NavLink
                      to="/problems/report"
                      onClick={() => document.activeElement.blur()}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#00ADB5] bg-[#00ADB5]/10 font-bold"
                          : "text-[#393E46]"
                      }
                    >
                      Map Report
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/problems/categorize"
                      onClick={() => document.activeElement.blur()}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#00ADB5] bg-[#00ADB5]/10 font-bold"
                          : "text-[#393E46]"
                      }
                    >
                      Smart Form
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/problems/list"
                      onClick={() => document.activeElement.blur()}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#00ADB5] bg-[#00ADB5]/10 font-bold"
                          : "text-[#393E46]"
                      }
                    >
                      View All Issues
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `font-medium transition-colors ${
                      isActive
                        ? "text-[#00ADB5] bg-[#00ADB5]/10"
                        : "text-[#393E46] hover:text-[#00ADB5]"
                    }`
                  }
                >
                  About
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Brand Logo */}
          <Link
            to="/"
            className="btn btn-ghost text-2xl font-extrabold tracking-tight gap-1 hover:bg-transparent"
          >
            <span className="text-[#222831]">Civic</span>
            <span className="text-[#00ADB5]">Eye</span>
          </Link>
        </div>

        {/* ================= NAVBAR CENTER (Desktop Menu) ================= */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 items-center">
            {/* --- HOME LINK --- */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-semibold rounded-full px-4 transition-all ${
                    isActive
                      ? "text-[#00ADB5] bg-[#00ADB5]/10 shadow-sm"
                      : "text-[#393E46] bg-gray-300 hover:text-[#00ADB5] hover:bg-[#00ADB5]/10"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {/* --- PROBLEMS DROPDOWN --- */}
            <li className="dropdown dropdown-bottom relative z-10">
              <div
                tabIndex={0}
                role="button"
                className={`font-semibold rounded-full px-4 transition-all ${
                  window.location.pathname.startsWith("/problems")
                    ? "text-[#00ADB5] bg-[#00ADB5]/10 shadow-sm"
                    : "text-[#393E46] bg-gray-300 hover:text-[#00ADB5] hover:bg-[#00ADB5]/10"
                }`}
              >
                Problems
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-2xl z-50 w-64 p-2 shadow-xl border border-gray-100 mt-2 top-full left-0 
               before:content-[''] before:absolute before:-top-2 before:left-0 before:w-full before:h-2"
              >
                <li>
                  <NavLink
                    to="/problems/report"
                    className={({ isActive }) =>
                      `rounded-xl font-medium py-3 z-10 ${
                        isActive
                          ? "text-[#00ADB5] bg-[#00ADB5]/10"
                          : "hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]"
                      }`
                    }
                  >
                    📍 Geo-Tagged Map Report
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/problems/categorize"
                    className={({ isActive }) =>
                      `rounded-xl font-medium py-3 z-10 ${
                        isActive
                          ? "text-[#00ADB5] bg-[#00ADB5]/10"
                          : "hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]"
                      }`
                    }
                  >
                    📝 Smart Category Form
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/problems/list"
                    className={({ isActive }) =>
                      `rounded-xl font-medium py-3 ${
                        isActive
                          ? "text-[#00ADB5] bg-[#00ADB5]/10"
                          : "hover:bg-[#00ADB5]/10 hover:text-[#00ADB5]"
                      }`
                    }
                  >
                    📋 View All Problems
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Interactive Map */}
            <li>
              <NavLink
                to="/interactivemap"
                className={({ isActive }) =>
                  `font-semibold rounded-full px-4 transition-all ${
                    isActive
                      ? "text-[#00ADB5] bg-[#00ADB5]/10 shadow-sm"
                      : "text-[#393E46] bg-gray-300 hover:text-[#00ADB5] hover:bg-[#00ADB5]/10"
                  }`
                }
              >
                Map
              </NavLink>
            </li>
            {/* Community Dashboard */}
            <li>
              <NavLink
                to="/communitydashboard"
                className={({ isActive }) =>
                  `font-semibold rounded-full px-4 transition-all ${
                    isActive
                      ? "text-[#00ADB5] bg-[#00ADB5]/10 shadow-sm"
                      : "text-[#393E46] bg-gray-300 hover:text-[#00ADB5] hover:bg-[#00ADB5]/10"
                  }`
                }
              >
                Community
              </NavLink>
            </li>

            {/* --- ABOUT LINK --- */}
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `font-semibold rounded-full px-4 transition-all ${
                    isActive
                      ? "text-[#00ADB5] bg-[#00ADB5]/10 shadow-sm"
                      : "text-[#393E46] bg-gray-300 hover:text-[#00ADB5] hover:bg-[#00ADB5]/10"
                  }`
                }
              >
                About
              </NavLink>
            </li>
          </ul>
        </div>

        {/* ================= NAVBAR END (User Actions) ================= */}
        <div className="navbar-end gap-3 lg:gap-4">
          {/* 2. Sleek Trust Score Pill (Only shows if logged in and data exists) */}
          {user && dbUser && (
            <div className="hidden sm:flex items-center bg-white rounded-full pr-4 pl-1.5 py-1.5 shadow-sm border border-gray-200 transition-all hover:shadow-md cursor-default">
              <div
                className={`text-white text-xs font-bold px-2.5 py-1 rounded-full mr-2 shadow-sm ${dbUser.trustScore < 30 ? "bg-red-500" : "bg-[#00ADB5]"}`}
              >
                Score
              </div>
              <span
                className={`font-extrabold ${dbUser.trustScore < 30 ? "text-red-500" : "text-[#222831]"}`}
              >
                {dbUser.trustScore}
              </span>
            </div>
          )}

          {/* 3. Authentication & Profile Logic */}
          {!user ? (
            <Link
              to="/auth/login"
              className="btn bg-[#222831] hover:bg-[#393E46] text-white rounded-full px-6 shadow-md border-none"
            >
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar ring-2 ring-[#00ADB5]/30 hover:ring-[#00ADB5] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#393E46]">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 opacity-80" />
                  )}
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-2xl z-50 mt-4 w-64 p-3 shadow-2xl border border-gray-100"
              >
                {/* --- 1. USER EMAIL HEADER (Fixed for long emails) --- */}
                <li className="px-3 pb-3 mb-2 border-b border-gray-100 pointer-events-none">
                  <div className="flex flex-col items-start p-0 bg-transparent active:bg-transparent">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Signed in as
                    </span>
                    <span className="text-sm font-semibold text-[#222831] leading-tight break-all">
                      {user.email}
                    </span>
                  </div>
                </li>

                {/* --- 2. MENU ITEMS --- */}
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-[#00ADB5]/10 hover:text-[#00ADB5] font-medium rounded-xl py-2.5 px-3 flex justify-between"
                  >
                    My Profile
                    <span className="badge bg-[#00ADB5] text-white border-none badge-xs p-1 px-2">
                      New
                    </span>
                  </Link>
                </li>

                <li>
                  <a className="hover:bg-[#00ADB5]/10 hover:text-[#00ADB5] font-medium rounded-xl py-2.5 px-3">
                    Settings
                  </a>
                </li>

                {/* --- 3. LOGOUT (Styled to match) --- */}
                <li className="mt-2 pt-1 border-t border-gray-50">
                  <button
                    className="w-full text-left hover:bg-red-50 text-red-500 font-bold rounded-xl py-2.5 px-3 flex items-center gap-2"
                    onClick={() => logoutModalRef.current.showModal()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Logout Modal */}
      <dialog
        id="logout_modal"
        ref={logoutModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box border-t-4 border-error">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Confirm Logout
          </h3>
          <p className="py-4 opacity-70">
            Are you sure you want to end your session? You will need to log back
            in to report new issues.
          </p>

          <div className="modal-action">
            {/* Form method="dialog" handles the 'Cancel/Close' logic automatically */}
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancel</button>
            </form>

            {/* This button runs your actual logout logic */}
            <button
              className="btn btn-error text-white font-bold"
              onClick={handleConfirmLogout}
            >
              Logout Now
            </button>
          </div>
        </div>

        {/* This form allows clicking outside the box to close the modal */}
        <form method="dialog" className="modal-backdrop bg-black/50">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Navbar;
