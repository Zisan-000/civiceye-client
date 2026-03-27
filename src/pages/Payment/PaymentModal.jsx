import React, { use, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";

export default function PaymentModal({ isOpen, onClose }) {
  const { user } = use(AuthContext);
  const [phone, setPhone] = useState("");
  const amount = 500; // Locked amount

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:1069/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: user?.displayName || "N/A",
        userEmail: user?.email || "N/A",
        phoneNumber: phone,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.url) {
          // This is the magic line that actually takes you to SSLCommerz
          window.location.replace(data.url);
        } else {
          alert("Payment initialization failed!");
        }
      })
      .catch((error) => {
        console.error("Error submitting payment:", error);
      });
  };

  return (
    <div className="modal modal-open bg-[#222831]/80 backdrop-blur-sm z-999">
      <div className="modal-box bg-white rounded-3xl border border-[#00ADB5]/20 shadow-2xl p-8 max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-red-500"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="bg-[#00ADB5]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💸</span>
          </div>
          <h3 className="text-2xl font-black text-[#222831]">Fine Payment</h3>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">
            Sandbox Testing Mode
          </p>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          {/* Read-Only Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="form-control">
              <label className="label text-xs font-bold text-gray-500 uppercase">
                Payer Name
              </label>
              <input
                type="text"
                value={user?.displayName || "Guest User"}
                readOnly
                className="input input-bordered bg-gray-50 rounded-xl text-gray-500 border-gray-200"
              />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold text-gray-500 uppercase">
                Payer Email
              </label>
              <input
                type="email"
                value={user?.email || "N/A"}
                readOnly
                className="input input-bordered bg-gray-50 rounded-xl text-gray-500 border-gray-200"
              />
            </div>
          </div>

          {/* User Input Info */}
          <div className="form-control">
            <label className="label text-xs font-bold text-[#00ADB5] uppercase">
              Contact Number
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input input-bordered rounded-xl border-[#00ADB5]/30 focus:border-[#00ADB5] focus:ring-1 focus:ring-[#00ADB5]"
            />
          </div>

          {/* Amount Display */}
          <div className="bg-[#f8f9fa] p-4 rounded-2xl flex justify-between items-center border border-dashed border-gray-300 mt-2">
            <span className="font-bold text-gray-500 text-sm">
              Amount to Pay
            </span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#222831]">
                {amount}
              </span>
              <span className="ml-1 text-sm font-bold text-gray-400">BDT</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="btn btn-lg w-full bg-[#222831] hover:bg-[#393E46] text-[#00ADB5] border-none rounded-2xl shadow-xl transition-all active:scale-95 mt-4 font-black"
          >
            CONFIRM & LOG INFO
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-400 mt-6 italic">
          * This action will only log the data to the console for your review.
        </p>
      </div>
    </div>
  );
}
