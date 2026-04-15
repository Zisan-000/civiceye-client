import { use, useEffect, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";
import { Link } from "react-router";

export default function ProblemList() {
  const { user } = use(AuthContext);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAILS = [
    "ak01739394811@gmail.com",
    "jannatul.ferdous17@g.bracu.ac.bd",
  ];

  const isAdmin = ADMIN_EMAILS.includes(user?.email);

  // --- STRICT LIFECYCLE ARRAY ---
  const LIFECYCLE = [
    "Open",
    "In Review",
    "Work in Progress",
    "Resolved",
    "Closed",
  ];

  // --- 1. UNIFIED VOTING HANDLERS ---
  const handleUpvote = (id, reporterEmail) => {
    if (user?.email === reporterEmail) {
      toast.error("You cannot upvote your own report!");
      return;
    }
    setVoteModal({
      isOpen: true,
      type: "upvote",
      problemId: id,
      reporterEmail: reporterEmail,
    });
  };

  const handleFlag = (id, reporterEmail) => {
    if (user?.email === reporterEmail) {
      toast.error("You cannot flag your own report!");
      return;
    }
    setVoteModal({
      isOpen: true,
      type: "flag",
      problemId: id,
      reporterEmail: reporterEmail,
    });
  };

  // --- 2. CONFIRMATION HANDLER ---
  const confirmVote = async () => {
    const { type, problemId, reporterEmail } = voteModal;
    const endpoint = type === "upvote" ? "upvote" : "flag";

    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/${endpoint}/${problemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user?.email, reporterEmail }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `${type === "upvote" ? "Verified" : "Flagged"} successfully!`,
        );
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
      setVoteModal({
        isOpen: false,
        type: "",
        problemId: null,
        reporterEmail: "",
      });
    }
  };

  // --- 3. STATUS & DELETE HANDLERS ---
  const handleStatusChange = async (id, newStatus) => {
    const targetProblem = problems.find((p) => p._id === id);
    const reporterEmail = targetProblem?.userEmail;

    let currentStatus = targetProblem?.status || "Open";
    if (currentStatus.toLowerCase() === "pending") currentStatus = "Open";
    if (currentStatus === "In-Progress") currentStatus = "Work in Progress";

    if (
      newStatus !== "Fake" &&
      currentStatus !== "Fake" &&
      newStatus !== "Pending"
    ) {
      const currentIndex = LIFECYCLE.indexOf(currentStatus);
      const newIndex = LIFECYCLE.indexOf(newStatus);

      if (newIndex !== currentIndex + 1 && newIndex !== currentIndex) {
        const nextValidStep = LIFECYCLE[currentIndex + 1];
        toast.error(`Invalid Sequence! Next step must be "${nextValidStep}".`);
        return;
      }
    }

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
        setProblems((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)),
        );
        toast.success(`Status updated to ${newStatus}!`);
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Update failed");
      }
    } catch (err) {
      toast.error("Network error!");
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
    type: "",
    problemId: null,
    reporterEmail: "",
  });

  useEffect(() => {
    fetch("http://localhost:1069/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        const liveScoredProblems = data.map((prob) => {
          // 1. Get the base score from MongoDB (the 80 you see in the DB)
          const baseScore = prob.urgencyScore || 0;

          // 2. Calculate Live Time Component (Max 24 points over 48 hours)
          const postDate = new Date(prob.createdAt || new Date());
          const hoursSincePosted = Math.max(
            0,
            (new Date() - postDate) / (1000 * 60 * 60),
          );
          const timeBonus = Math.min(hoursSincePosted, 48) * 0.5;

          // 3. Calculate Live Upvote Component
          const upvoteBonus = (prob.upvotes || 0) * 1.5;

          // 4. Final Score = Base (Keywords) + Upvotes + Time
          let finalScore = Math.min(
            100,
            Math.round(baseScore + upvoteBonus + timeBonus),
          );

          return {
            ...prob,
            urgencyScore: finalScore,
          };
        });

        const sortedByUrgency = liveScoredProblems.sort(
          (a, b) => b.urgencyScore - a.urgencyScore,
        );
        setProblems(sortedByUrgency);
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "open":
      case "pending":
        return "badge-warning";
      case "in review":
        return "badge-info opacity-80";
      case "work in progress":
      case "in-progress":
        return "badge-info";
      case "resolved":
        return "badge-success";
      case "closed":
        return "badge-neutral";
      case "fake":
        return "badge-error border-2 border-dotted font-bold text-xl";
      default:
        return "badge-ghost";
    }
  };

  const STATUS_ORDER = {
    Open: 1,
    "In Review": 2,
    "Work in Progress": 3,
    Resolved: 4,
    Closed: 5,
  };

  const [sortType, setSortType] = useState("urgency");
  const sortedProblems = [...problems].sort((a, b) => {
    if (a.status === "Fake" && b.status !== "Fake") return 1;
    if (a.status !== "Fake" && b.status === "Fake") return -1;
    if (sortType === "urgency")
      return (b.urgencyScore || 0) - (a.urgencyScore || 0);
    if (sortType === "popularity") return (b.upvotes || 0) - (a.upvotes || 0);
    if (sortType === "date")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortType === "status")
      return (STATUS_ORDER[a.status] || 99) - (STATUS_ORDER[b.status] || 99);
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
        setProblems((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, status: "Fake", priority: "Low" } : p,
          ),
        );
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
        <div className="badge badge-primary p-4">
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
          <option value="urgency">🚨 Urgency </option>
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
            {sortedProblems.map((prob) => (
              <tr
                key={prob._id}
                className={`hover transition-all ${
                  prob.status === "Fake"
                    ? "bg-red-500 opacity-70 animate-pulse select-none italic"
                    : ""
                }`}
              >
                <td>
                  <div className="flex flex-col">
                    <div
                      className={`${prob.status === "Fake" ? "" : "font-bold text-primary"}`}
                    >
                      {prob.userName || "Anonymous"}
                    </div>
                    <div className="text-xs opacity-50 mb-2">
                      {prob.userEmail}
                    </div>

                    {/* NEW DETAILS BUTTON */}
                    <Link
                      to={`/problems/details/${prob._id}`}
                      className="btn btn-xs btn-outline btn-ghost border-gray-300 gap-1 w-fit hover:bg-[#00ADB5]/10 hover:text-[#00ADB5] hover:border-[#00ADB5]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
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
                      View Details
                    </Link>
                  </div>
                </td>

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
                  </div>
                </td>

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

                <td>
                  <div className="flex flex-col items-start gap-2">
                    {/* 1. Dynamic Priority/Flag Badge */}
                    <div
                      className={`badge badge-sm font-bold ${
                        (prob.flags || 0) > 5
                          ? "badge-ghost opacity-50 italic"
                          : (prob.upvotes || 0) > 10
                            ? "badge-error animate-pulse"
                            : "badge-accent"
                      }`}
                    >
                      {(prob.flags || 0) > 5
                        ? "Flagged"
                        : (prob.upvotes || 0) > 10
                          ? "High"
                          : "Medium"}
                    </div>

                    {/* 2. Unified voting buttons */}
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleUpvote(prob._id, prob.userEmail)}
                          className="btn btn-circle btn-xs btn-outline btn-success"
                          disabled={prob.status === "Fake"}
                          title="Verify this issue"
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
                          className="btn btn-circle btn-xs btn-outline btn-error"
                          disabled={prob.status === "Fake"}
                          title="Flag as incorrect"
                        >
                          ▼
                        </button>
                        <span className="text-[10px] font-bold mt-1">
                          {prob.flags || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className=" flex gap-2 join-vertical  ">
                    {prob.urgencyScore && (
                      <div className="badge badge-error gap-2 font-black text-white shadow-md px-4 py-4 text-xs uppercase tracking-wider">
                        🚨 Score: {prob.urgencyScore}/100
                      </div>
                    )}
                    <span
                      className={`badge ${getStatusClass(prob.status)} capitalize whitespace-nowrap px-4 py-3`}
                    >
                      {prob.status || "Open"}
                    </span>
                  </div>
                </td>

                <td>{new Date(prob.createdAt).toLocaleDateString()}</td>
                {/* Add this inside your map loop, ideally in a new <td> or the Reporter <td> */}

                {isAdmin && (
                  <td>
                    <div className="flex items-center gap-2">
                      {prob.status === "Fake" ? (
                        <button
                          onClick={() => handleStatusChange(prob._id, "Open")}
                          className="btn btn-xs btn-success btn-outline"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleMarkFake(prob._id, prob.userEmail)
                          }
                          className="btn btn-xs btn-error btn-outline"
                        >
                          Fake?
                        </button>
                      )}

                      <select
                        className="select select-bordered select-xs"
                        onChange={(e) =>
                          handleStatusChange(prob._id, e.target.value)
                        }
                        value={
                          prob.status === "pending" || !prob.status
                            ? "Open"
                            : prob.status
                        }
                      >
                        {LIFECYCLE.map((step, index) => {
                          let currentStatus = prob.status || "Open";
                          if (currentStatus.toLowerCase() === "pending")
                            currentStatus = "Open";
                          if (currentStatus === "In-Progress")
                            currentStatus = "Work in Progress";

                          const currentIndex = LIFECYCLE.indexOf(currentStatus);
                          const isAllowed =
                            index === currentIndex ||
                            index === currentIndex + 1;

                          return (
                            <option
                              key={step}
                              value={step}
                              disabled={!isAllowed}
                            >
                              {step}
                            </option>
                          );
                        })}
                        {prob.status === "Fake" && (
                          <option value="Fake">Fake</option>
                        )}
                      </select>

                      <button
                        onClick={() => handleDelete(prob._id)}
                        className="btn btn-ghost btn-xs text-error p-0"
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

      {voteModal.isOpen && (
        <div className="modal modal-open">
          <div className="modal-box border-2 border-[#00ADB5]">
            <h3 className="font-bold text-lg">
              Confirm {voteModal.type === "upvote" ? "Verification" : "Flag"}?
            </h3>
            <p className="py-4 text-sm">
              Are you sure you want to {voteModal.type} this report?
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
