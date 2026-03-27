import { use, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";

export default function ProblemList() {
  const { user } = use(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAILS = ["ak01739394811@gmail.com", "your-email@gmail.com"];
  const isAdmin = ADMIN_EMAILS.includes(user?.email);

  // --- 1. USER HANDLERS (Open Modal) ---
  const handleUpvote = (id, reporterEmail) => {
    // 1. Check for self-voting
    if (user?.email === reporterEmail) {
      toast.error("You cannot upvote your own report!");
      return;
    }
    // 2. Open Modal
    setVoteModal({
      isOpen: true,
      type: "upvote",
      problemId: id,
      reporterEmail: reporterEmail,
    });
  };

  const handleFlag = (id, reporterEmail) => {
    // 1. Check for self-flagging
    if (user?.email === reporterEmail) {
      toast.error("You cannot flag your own report!");
      return;
    }
    // 2. Open Modal
    setVoteModal({
      isOpen: true,
      type: "flag",
      problemId: id,
      reporterEmail: reporterEmail,
    });
  };

  // --- 2. CONFIRMATION HANDLER (Does the Work) ---
  const confirmVote = async () => {
    const { type, problemId } = voteModal;
    const endpoint = type === "upvote" ? "upvote" : "flag";

    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/${endpoint}/${problemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user?.email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `${type === "upvote" ? "Verified" : "Flagged"} successfully!`,
        );

        // Auto-reload to sync all counts and arrays (Mutual Exclusion)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error("Vote failed", err);
      toast.error("Server error. Try again.");
    } finally {
      // Close modal regardless of outcome
      setVoteModal({
        isOpen: false,
        type: "",
        problemId: null,
        reporterEmail: "",
      });
    }
  };

  // --- 2. ADMIN HANDLERS ---
  const handleAdminUpvote = async (id, newCount) => {
    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/admin-upvote/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newCount, adminEmail: user.email }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        setProblems((prev) =>
          prev.map((p) =>
            p._id === id
              ? {
                  ...p,
                  upvotes: parseInt(newCount),
                  priority: data.newPriority || p.priority,
                }
              : p,
          ),
        );
        toast.success("Upvotes updated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminFlag = async (id, newCount) => {
    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/admin-flag/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newCount: parseInt(newCount),
            adminEmail: user.email,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setProblems((prev) =>
          prev.map((p) =>
            p._id === id
              ? { ...p, flags: parseInt(newCount), priority: data.newPriority }
              : p,
          ),
        );
        toast.success("Flags updated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const targetProblem = problems.find((p) => p._id === id);
    const reporterEmail = targetProblem?.userEmail;
    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/status/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            adminEmail: user.email,
            reporterEmail: reporterEmail,
          }),
        },
      );
      if (response.ok) {
        setProblems(
          problems.map((p) => (p._id === id ? { ...p, status: newStatus } : p)),
        );
        toast.success("Status updated!");
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)),
        );
      }
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this report?")) {
      const response = await fetch(
        `http://localhost:1069/api/complaints/${id}?email=${user.email}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        setProblems(problems.filter((p) => p._id !== id));
        toast.success("Report deleted.");
      }
    }
  };

  const [voteModal, setVoteModal] = useState({
    isOpen: false,
    type: "", // "upvote" or "flag"
    problemId: null,
    reporterEmail: "",
  });

  useEffect(() => {
    fetch("http://localhost:1069/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
        return "badge-warning";
      case "in-progress":
        return "badge-info";
      case "resolved":
        return "badge-success";
      case "rejected":
        return "badge-error";
      case "fake":
        return "badge-error border-2 border-dotted font-bold  text-xl";
      default:
        return "badge-ghost";
    }
  };

  // sort
  const STATUS_ORDER = {
    Pending: 1,
    "In-Progress": 2,
    Resolved: 3,
    Rejected: 4,
  };

  const [sortType, setSortType] = useState("popularity");
  const sortedProblems = [...problems].sort((a, b) => {
    if (a.status === "Fake" && b.status !== "Fake") return 1;
    if (a.status !== "Fake" && b.status === "Fake") return -1;
    if (sortType === "popularity") {
      // Descending: Most upvotes first
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    if (sortType === "date") {
      // Descending: Newest first
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortType === "status") {
      // Manual Sort: Pending (1) first, Rejected (4) last
      // We use || 99 as a fallback for any undefined statuses
      const orderA = STATUS_ORDER[a.status] || 99;
      const orderB = STATUS_ORDER[b.status] || 99;
      return orderA - orderB;
    }
    return 0;
  });

  const handleMarkFake = async (id, reporterEmail) => {
    if (
      !window.confirm(
        "ARE YOU SURE? This will deduct 50 Trust Score and mark this as Fake.",
      )
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/mark-fake/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reporterEmail: reporterEmail,
            adminEmail: user?.email,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("User penalized! Report marked as Fake.");

        // OPTION A: Instant UI Update (Fastest)
        setProblems((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, status: "Fake", priority: "Low" } : p,
          ),
        );

        // OPTION B: Force Reload (Safest to sync Trust Score elsewhere)
        // setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(data.message || "Failed to mark as fake");
      }
    } catch (err) {
      console.error("Action failed", err);
      toast.error("Network error!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Issues Log</h1>
        <div className="badge badge-secondary p-4">
          {problems.length} Reports Found
        </div>
      </div>
      <div className="flex justify-end mb-4 gap-2 items-center">
        <span className="text-sm font-semibold">Sort By:</span>
        <select
          className="select select-bordered select-sm w-40"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="popularity">🔥 Popularity (Most Upvotes)</option>
          <option value="date">📅 Date (Newest First)</option>
          <option value="status">🚦 Status Workflow</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-xl border border-base-300">
        <table className="table table-zebra w-full bg-base-100">
          <thead className="bg-indigo-100">
            <tr className="text-lg font-black">
              <th>Reporter</th>
              <th>Details</th>
              <th>Location</th>
              <th>Popularity</th>
              <th>Status</th>
              <th>Date</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {/* CHANGE THIS: map over sortedProblems instead of problems */}
            {sortedProblems.map((prob) => (
              <tr
                key={prob._id}
                className={`hover transition-all ${
                  prob.status === "Fake"
                    ? "bg-red-500 opacity-70 animate-pulse select-none italic"
                    : ""
                }`}
              >
                {/* 1. Reporter Info */}
                <td>
                  <div
                    className={`${prob.status === "Fake" ? "" : "font-bold text-primary"}`}
                  >
                    {prob.userName || "Anonymous"}
                  </div>
                  <div className="text-xs opacity-50">{prob.userEmail}</div>
                </td>

                {/* 2. Problem Details */}
                <td>
                  <div className="flex flex-col gap-1">
                    <span className="badge badge-outline badge-sm font-bold uppercase w-fit">
                      {prob.category || "General"}
                    </span>
                    {prob.specificDetails &&
                    Object.keys(prob.specificDetails).length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(prob.specificDetails).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="badge badge-info badge-sm text-xs"
                            >
                              <span className="font-bold lowercase opacity-70">
                                {key}:
                              </span>{" "}
                              {String(value)}
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm italic text-gray-600">
                        {prob.description}
                      </p>
                    )}
                    {prob.additionalNotes && (
                      <p className="text-xs text-gray-400 mt-1 border-t pt-1">
                        Note: {prob.additionalNotes}
                      </p>
                    )}
                  </div>
                </td>

                {/* 3. Location Logic */}
                <td>
                  <div className="text-sm">
                    {prob.location ? (
                      <>
                        <span className="font-semibold">{prob.region}</span>
                        <br />
                        <span className="text-xs font-mono text-gray-500">
                          {prob.location.lat.toFixed(3)},{" "}
                          {prob.location.lng.toFixed(3)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs italic text-gray-700">
                        {prob.address || "No address"}
                      </span>
                    )}
                  </div>
                </td>

                {/* --- 4. COMBINED POPULARITY & PRIORITY COLUMN --- */}
                <td>
                  <div className="flex flex-col items-start gap-2">
                    <div
                      className={`badge badge-sm font-bold ${
                        prob.priority === "High"
                          ? "badge-error animate-pulse"
                          : prob.priority === "Low"
                            ? "badge-primary opacity-50"
                            : "badge-accent"
                      }`}
                    >
                      {prob.priority || "Medium"}
                    </div>

                    {isAdmin ? (
                      <div className="flex flex-col gap-1 border-l-2 border-primary pl-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-bold">UP:</span>
                          <input
                            type="number"
                            className="input input-bordered input-xs w-12"
                            defaultValue={prob.upvotes || 0}
                            onBlur={(e) =>
                              handleAdminUpvote(prob._id, e.target.value)
                            }
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-bold">FL:</span>
                          <input
                            type="number"
                            className="input input-bordered input-xs w-12"
                            defaultValue={prob.flags || 0}
                            onBlur={(e) =>
                              handleAdminFlag(prob._id, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() =>
                              handleUpvote(prob._id, prob.userEmail)
                            }
                            disabled={prob.upvotedBy?.includes(user?.email)}
                            className={`btn btn-circle btn-xs ${prob.status === "Fake" ? "pointer-events-none opacity-20" : ""} ${
                              prob.upvotedBy?.includes(user?.email)
                                ? "btn-disabled"
                                : "btn-outline btn-success"
                            }`}
                          >
                            ▲
                          </button>
                          <span className="text-[10px] font-bold mt-1">
                            {prob.upvotes || 0}
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleFlag(prob._id, prob.userEmail)}
                            disabled={prob.flaggedBy?.includes(user?.email)}
                            className={`btn btn-circle btn-xs ${prob.status === "Fake" ? "pointer-events-none opacity-20" : ""} ${
                              prob.flaggedBy?.includes(user?.email)
                                ? "btn-disabled"
                                : "btn-outline btn-error"
                            }`}
                          >
                            ▼
                          </button>
                          <span className="text-[10px] font-bold mt-1">
                            {prob.flags || 0}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                {/* 5. Status */}
                <td>
                  <div>
                    <span
                      className={`badge ${getStatusClass(prob.status)} capitalize whitespace-nowrap px-4 py-3`}
                    >
                      {prob.status || "pending"}
                    </span>
                  </div>
                </td>

                {/* 6. Date */}
                <td>{new Date(prob.createdAt).toLocaleDateString()}</td>

                {/* 7. ADMIN ACTIONS */}
                {isAdmin && (
                  <td>
                    <div className="flex items-center gap-2">
                      {/* 1. CONDITIONAL BUTTON: Fake? OR Restore */}
                      {prob.status === "Fake" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(prob._id, "Pending")
                          }
                          className="btn btn-xs btn-success btn-outline"
                          title="Restore this report to Pending"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleMarkFake(prob._id, prob.userEmail)
                          }
                          className="btn btn-xs btn-error btn-outline hover:bg-error hover:text-white transition-all"
                          title="Mark as Fake & Deduct 50 Trust Score"
                        >
                          Fake?
                        </button>
                      )}

                      {/* 2. STATUS DROPDOWN */}
                      <select
                        className="select select-bordered select-xs"
                        onChange={(e) =>
                          handleStatusChange(prob._id, e.target.value)
                        }
                        value={prob.status || "Pending"} // Use 'value' instead of 'defaultValue' for sync
                      >
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                        {/* We allow 'Fake' to show in dropdown only if it's already Fake */}
                        {prob.status === "Fake" && (
                          <option value="Fake">Fake</option>
                        )}
                      </select>

                      {/* 3. DELETE BUTTON (Always works for Admin) */}
                      <button
                        onClick={() => handleDelete(prob._id)}
                        className="btn btn-ghost btn-xs text-error p-0"
                        title="Delete Report Permanently"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {problems.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <p className="text-2xl">No issues reported yet.</p>
        </div>
      )}

      {voteModal.isOpen && (
        <div className="modal modal-open">
          <div className="modal-box border-2 border-[#00ADB5]">
            <h3 className="font-bold text-lg">
              Confirm {voteModal.type === "upvote" ? "Verification" : "Flag"}?
            </h3>
            <p className="py-4 text-sm">
              Are you sure you want to {voteModal.type} this report?
              {voteModal.type === "upvote"
                ? " This helps the community identify real issues."
                : " This will report the issue as spam or incorrect."}
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setVoteModal({ isOpen: false })}
              >
                Cancel
              </button>
              <button
                className={`btn ${voteModal.type === "upvote" ? "btn-success" : "btn-error"}`}
                onClick={confirmVote}
              >
                Yes, {voteModal.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
