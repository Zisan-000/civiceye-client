import React, { useState, useContext } from "react";

import toast from "react-hot-toast";
import { AuthContext } from "../../provider/AuthProvider";

const Careers = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const workerData = {
      name: form.name.value,
      email: user?.email || form.email.value,
      phone: form.phone.value,
      specialization: form.specialization.value,
      region: form.region.value,
      experience: form.experience.value,
    };

    try {
      const response = await fetch("http://localhost:1069/api/workers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workerData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message || "Failed to submit.");
      }
    } catch (error) {
      toast.error(error, "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added flex and min-h-screen to ensure perfect vertical and horizontal centering
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden p-6 md:p-12 border-8 border-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-primary leading-tight">
            Join CivicEye Team
          </h1>
          <p className="text-gray-500 font-bold text-sm mt-2">
            Professional services for a better society.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-gray-500">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                className="input input-bordered rounded-2xl w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-gray-500">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                defaultValue={user?.email}
                className="input input-bordered rounded-2xl bg-gray-50 w-full"
                readOnly
              />
            </div>
          </div>

          {/* Row 2: Phone & Division */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-gray-500">
                Phone Number
              </label>
              <input
                name="phone"
                type="text"
                placeholder="017XXXXXXXX"
                className="input input-bordered rounded-2xl w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label font-bold text-xs uppercase text-gray-500">
                Service Division
              </label>
              <select
                name="region"
                className="select select-bordered rounded-2xl font-bold w-full"
                required
              >
                <option value="">Select Division</option>
                <option value="Dhaka Division">Dhaka Division</option>
                <option value="Chittagong Division">Chittagong Division</option>
                <option value="Sylhet Division">Sylhet Division</option>
                <option value="Rajshahi Division">Rajshahi Division</option>
                <option value="Khulna Division">Khulna Division</option>
                <option value="Barisal Division">Barisal Division</option>
                <option value="Rangpur Division">Rangpur Division</option>
                <option value="Mymensingh Division">Mymensingh Division</option>
              </select>
            </div>
          </div>

          {/* Row 3: Specialization */}
          <div className="form-control">
            <label className="label font-bold text-xs uppercase text-gray-500">
              Specialization
            </label>
            <select
              name="specialization"
              className="select select-bordered rounded-2xl font-bold w-full"
              required
            >
              <option value="">Select Category</option>
              <option value="Fire Hazard">🔥 Fire Hazard</option>
              <option value="Environment">🌳 Environment</option>
              <option value="General">📝 General</option>
              <option value="water">💧 Water & Plumbing</option>
              <option value="noise">🔊 Noise Complaint</option>
              <option value="road">🚧 Road & Pothole</option>
              <option value="waste">🗑️ Garbage & Waste</option>
              <option value="electrical">⚡ Electrical & Streetlight</option>
            </select>
          </div>

          {/* Row 4: Experience */}
          <div className="form-control">
            <label className="label font-bold text-xs uppercase text-gray-500">
              Experience & Qualifications
            </label>
            <textarea
              name="experience"
              placeholder="Tell us about your previous work..."
              className="textarea textarea-bordered rounded-2xl h-32 w-full leading-relaxed"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary btn-block rounded-2xl text-lg font-black uppercase italic shadow-lg hover:shadow-primary/50 transition-all ${loading ? "loading" : ""}`}
          >
            {loading ? "Processing..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Careers;
