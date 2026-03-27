import React, { use, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import PaymentModal from "../Payment/PaymentModal";
import toast from "react-hot-toast";
// FIX: Ensure this is 'react-router-dom'
import { useLocation, useNavigate } from "react-router";

export default function Profile() {
  const { user, dbUser, loading } = use(AuthContext);
  const [stats, setStats] = useState({ reportCount: 0, totalUpvotes: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  //   const toastShownRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:1069/api/user-stats/${user.email}`)
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Error fetching stats:", err));
    }
  }, [user?.email]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const tranId = queryParams.get("transactionId");
    console.log(tranId);

    if (status === "success") {
      // 1. Trigger the toast immediately
      toast.success(
        <div className="flex flex-col py-1">
          <b className="text-[#222831] text-sm">Payment Successful!</b>
          <p className="text-[#00ADB5] text-[10px] font-bold uppercase tracking-tighter">
            Trust Score Restored
          </p>
        </div>,
        {
          id: "payment-success", // Using a hardcoded ID prevents duplicates automatically!
          duration: 4000,
          style: {
            borderRadius: "15px",
            background: "#FFFFFF",
            color: "#222831",
            border: "2px solid #00ADB5",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        },
      );

      // 2. Clean up the URL after a short delay
      const timeout = setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 500);

      return () => clearTimeout(timeout);
    }

    // --- ADD THIS BLOCK FOR FAILURE ---
    if (status === "failed" || status === "cancelled") {
      toast.error(
        <div className="flex flex-col py-1">
          <b className="text-[#222831] text-sm">
            {status === "failed" ? "Payment Failed" : "Payment Cancelled"}
          </b>
          <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter">
            Please try again to restore your score.
          </p>
        </div>,
        {
          id: "payment-error",
          duration: 4000,
          style: {
            borderRadius: "15px",
            background: "#FFFFFF",
            color: "#222831",
            border: "2px solid #FF4B2B", // Red border
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        },
      );
      navigate("/profile", { replace: true });
    }
  }, [location.search, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-dots loading-lg text-[#00ADB5]"></span>
      </div>
    );
  }

  const trustScore = dbUser?.trustScore ?? 100;
  const isRestricted = trustScore < 30;

  return (
    <div className="max-w-5xl mx-auto p-6 my-10 animate-fadeIn">
      {/* ================= HEADER SECTION ================= */}
      <div className="relative bg-linear-to-r from-[#222831] to-[#393E46] rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <svg width="200" height="200" fill="white" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="avatar ring-4 ring-[#00ADB5] ring-offset-4 ring-offset-[#222831] rounded-full shadow-2xl">
            <div className="w-32 h-32 rounded-full border-4 border-[#EEEEEE]">
              <img
                src={user?.photoURL}
                alt="Profile"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-[#EEEEEE] mb-1">
              {user?.displayName || "Honorable Citizen"}
            </h1>
            <p className="text-[#00ADB5] font-semibold text-lg">
              {user?.email}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="badge badge-outline text-[#EEEEEE] border-gray-600">
                ID: {user?.uid?.slice(0, 8)}
              </span>
              <span className="badge bg-[#00ADB5] text-white border-none">
                Verified Account
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* ================= TRUST SCORE CARD ================= */}
        <div className="md:col-span-1 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center">
          <h3 className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-4">
            Current Reputation
          </h3>

          <div
            className={`radial-progress ${isRestricted ? "text-red-500" : "text-[#00ADB5]"} font-black text-3xl mb-4`}
            style={{
              "--value": trustScore,
              "--size": "10rem",
              "--thickness": "12px",
            }}
          >
            {trustScore}
          </div>

          <p
            className={`font-bold mb-6 ${isRestricted ? "text-red-600" : "text-green-600"}`}
          >
            {isRestricted ? "Restricted Status" : "Healthy Reputation"}
          </p>

          {/* ================= PAY FINE OPTION ================= */}
          {isRestricted ? (
            <div className="w-full space-y-4">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-xs text-red-700">
                  Your score is below 30. You cannot post reports until you
                  restore your score.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn w-full bg-[#222831] hover:bg-[#393E46] text-white border-none rounded-2xl shadow-lg animate-bounce"
              >
                💸 Pay 500 BDT Fine
              </button>

              {/* Include the Modal Component */}
              <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">
              Keep reporting valid issues to earn more Trust Points!
            </p>
          )}
        </div>

        {/* ================= STATS & INFO ================= */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Real Reports Count */}
              <div className="bg-[#EEEEEE] p-6 rounded-3xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Reports Submitted
                </p>
                <h4 className="text-3xl font-black text-[#222831]">
                  {stats.reportCount}
                </h4>
              </div>

              {/* Real Upvotes Count */}
              <div className="bg-[#EEEEEE] p-6 rounded-3xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase">
                  Upvotes Received
                </p>
                <h4 className="text-3xl font-black text-[#222831]">
                  {stats.totalUpvotes}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-[#222831] mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-[#00ADB5] rounded-full"></span>{" "}
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Enable Notifications</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  defaultChecked
                />
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Public Profile Visibility</span>
                <input
                  type="checkbox"
                  className="toggle toggle-accent"
                  defaultChecked
                />
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">Newsletter Subscription</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
