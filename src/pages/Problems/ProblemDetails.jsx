import React, { useState, useEffect, use } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { useLoaderData, useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";

const ProblemDetails = () => {
  const { user } = use(AuthContext);
  const problem = useLoaderData();
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(true);
  console.log(problem);

  const ADMIN_EMAILS = [
    "ak01739394811@gmail.com",
    "jannatul.ferdous17@g.bracu.ac.bd",
  ];

  const WORKER_EMAILS = ["worker1@example.com", "zobaer.zisan@gmail.com"];

  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  const isWorker = WORKER_EMAILS.includes(user?.email);

  // Preload image to handle the preloader disappearance [cite: 47]
  useEffect(() => {
    if (problem.afterImage) {
      const img = new Image();
      img.src = problem.afterImage;
      img.onload = () => setIsImageLoading(false);
    }
  }, [problem.afterImage]);

  const statusColors = {
    Open: "badge-accent",
    "In-Progress": "badge-info",
    "Work in Progress": "badge-info",
    Resolved: "badge-success",
    Closed: "badge-ghost",
    Fake: "badge-error",
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=936b6268b95724d4891ad3e474de132d`,
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await response.json();
      const imageUrl = imgData.data.display_url;

      const payload = {};
      if (type === "before") payload.beforeImage = imageUrl;
      if (type === "after") {
        payload.afterImage = imageUrl;
        payload.status = "Resolved"; // Workflow transition [cite: 32, 45]
      }

      const res = await fetch(
        `http://localhost:1069/api/complaints/update-images/${problem._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const finalData = await res.json();
      if (finalData.success) {
        toast.success(`${type} image uploaded!`);
        window.location.reload(); // Refresh to update loader data
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-10 bg-base-100 shadow-2xl rounded-3xl border border-base-200">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-ghost mb-6"
      >
        ← Back to List
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 uppercase">
            {problem.category || "General"} Report
          </h1>
          <p className="opacity-60 text-sm font-mono tracking-tighter">
            Case ID: {problem._id}
          </p>
        </div>

        <div
          className={`badge badge-lg p-4 font-bold ${statusColors[problem.status] || "badge-ghost"}`}
        >
          {problem.status || "Open"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-4">
          <div className="card bg-base-200 p-5 rounded-2xl">
            <h2 className="font-bold text-gray-500 text-xs uppercase mb-3 tracking-widest">
              Issue Description
            </h2>
            <p className="text-lg leading-relaxed">{problem.description}</p>
          </div>

          <div className="card bg-base-200 p-5 rounded-2xl">
            <h2 className="font-bold text-gray-500 text-xs uppercase mb-3 tracking-widest">
              Reporter Contact
            </h2>
            <p className="font-bold text-primary">
              {problem.userName || "Anonymous User"}
            </p>
            <p className="text-sm opacity-70">{problem.userEmail}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="stats stats-vertical shadow w-full rounded-2xl border border-base-300">
            <div className="stat">
              <div className="stat-title text-xs uppercase font-bold text-error">
                Urgency Level
              </div>
              <div className="stat-value text-error">
                Score: {problem.urgencyScore || 0}
              </div>
              <div className="stat-desc font-bold italic">
                Calculated by Logic Engine [cite: 42]
              </div>
            </div>
            <div className="stat">
              <div className="stat-title text-xs uppercase font-bold text-primary">
                Popularity
              </div>
              <div className="stat-value text-primary">
                {problem.upvotes || 0}
              </div>
              <div className="stat-desc">Citizen Verifications [cite: 34]</div>
            </div>
          </div>

          <div className="card bg-teal-50 p-4 rounded-2xl border border-teal-100">
            <h2 className="font-bold text-teal-700 text-xs uppercase mb-2">
              Location Data [cite: 17, 19]
            </h2>
            <p className="text-sm font-medium text-teal-900">
              {problem.region || "Dhaka Society"}
            </p>
            {problem.location && (
              <p className="text-[10px] font-mono opacity-60">
                LAT: {problem.location.lat} | LNG: {problem.location.lng}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Status Timeline  */}
      <div className="mt-10 bg-base-100 p-8 rounded-3xl border border-base-200 shadow-sm">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span className="p-2 bg-primary/10 rounded-lg text-primary text-sm">
            🕒
          </span>
          Real-Time Status Timeline
        </h2>

        <ul className="steps steps-vertical w-full">
          {/* Map through the timeline array */}
          {problem.timeline && problem.timeline.length > 0 ? (
            problem.timeline
              .filter((event) => event.status !== "Open") // Strictly "no open"
              .map((event, index) => (
                <li key={index} className="step step-primary">
                  <div className="flex flex-col items-start ml-4 text-left mb-6">
                    <span className="font-bold text-lg uppercase tracking-tight">
                      {event.status}
                    </span>
                    <span className="text-xs opacity-50 font-mono">
                      {new Date(event.time).toLocaleDateString()} |
                      {new Date(event.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <p className="text-sm mt-1 text-base-content/70 italic">
                      {event.message}
                    </p>
                  </div>
                </li>
              ))
          ) : (
            // Fallback for old data without a timeline array
            <li className="step step-primary">
              <div className="flex flex-col items-start ml-4 text-left mb-6">
                <span className="font-bold text-lg uppercase">Reported</span>
                <span className="text-xs opacity-50 font-mono">
                  {new Date(problem.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>

      {/* Worker Upload Section [cite: 45, 46] */}
      {(isAdmin || isWorker) && (
        <div className="mt-8 space-y-6 bg-base-200 p-6 rounded-3xl border-2 border-dashed border-base-300">
          <h2 className="text-lg font-bold uppercase tracking-widest text-center">
            Worker Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">
                1. Capture "Before" State
              </span>
              <input
                type="file"
                disabled={problem.beforeImage}
                onChange={(e) => handleImageUpload(e.target.files[0], "before")}
                className="file-input file-input-bordered file-input-warning w-full"
              />
              {problem.beforeImage && (
                <span className="text-xs text-success font-bold">
                  ✓ Before Photo Saved
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold">
                2. Capture "After" State
              </span>
              <input
                type="file"
                disabled={!problem.beforeImage || problem.afterImage}
                onChange={(e) => handleImageUpload(e.target.files[0], "after")}
                className="file-input file-input-bordered file-input-success w-full"
              />
              {problem.afterImage && (
                <span className="text-xs text-success font-bold">
                  ✓ Resolution Complete
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 border-t pt-10">
        <h2 className="text-xl font-bold mb-6 text-[#222831]">
          Workflow Tracking
        </h2>
        <ul className="steps steps-vertical lg:steps-horizontal w-full text-sm">
          <li className="step step-primary">Reported</li>
          <li
            className={`step ${["In Review", "Work in Progress", "Resolved", "Closed"].includes(problem.status) ? "step-primary" : ""}`}
          >
            Reviewing
          </li>
          <li
            className={`step ${["In-Progress", "Work in Progress", "Resolved", "Closed"].includes(problem.status) ? "step-primary" : ""}`}
          >
            In-Progress
          </li>
          <li
            className={`step ${["Resolved", "Closed"].includes(problem.status) ? "step-primary" : ""}`}
          >
            Resolved
          </li>
        </ul>
      </div>

      {/* Resolution Proof Slider Section [cite: 47] */}
      {["Resolved", "Closed"].includes(problem.status) &&
        problem.afterImage && (
          <div className="mt-10 card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
            <div className="p-6 border-b border-base-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-success flex items-center gap-2">
                <span>✅ Resolution Proof</span>
              </h2>
              <div className="badge badge-outline animate-pulse">
                Slide Horizontal
              </div>
            </div>

            <div className="relative h-200 w-full bg-base-300">
              {isImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-200 z-20">
                  <span className="loading loading-infinity loading-lg text-primary"></span>
                  <p className="text-xs font-bold opacity-50 mt-2">
                    LOADING COMPARISON...
                  </p>
                </div>
              )}

              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage
                    src={problem.beforeImage}
                    alt="Before"
                    // Native lazy loading
                    loading="lazy"
                    style={{ objectFit: "contain" }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={problem.afterImage}
                    alt="After"
                    loading="lazy"
                    style={{ objectFit: "contain" }}
                  />
                }
                className="h-200 w-full"
              />
              <div className="absolute top-4 left-4 z-10 badge badge-neutral opacity-80">
                BEFORE
              </div>
              <div className="absolute top-4 right-4 z-10 badge badge-primary opacity-80">
                AFTER
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProblemDetails;
