import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";

const WorkerDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [unassignedTasks, setUnassignedTasks] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  console.log(unassignedTasks);

  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const ADMIN_EMAILS = [
    "ak01739394811@gmail.com",
    "jannatul.ferdous17@g.bracu.ac.bd",
  ];

  const isAdmin = ADMIN_EMAILS.includes(user?.email);

  useEffect(() => {
    // If loading is done and user is not an admin, kick them out
    if (!loading && !isAdmin) {
      toast.error("Access Denied: Admins Only");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    // 1. Fetch ALL workers
    fetch("http://localhost:1069/api/workers")
      .then((res) => res.json())
      .then((data) => {
        setWorkers(data);
      })
      .catch((err) => console.error("Worker fetch error:", err));

    // 2. Fetch ALL Open Complaints
    fetch("http://localhost:1069/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        const open = data.filter((task) => task.status === "Open");
        setUnassignedTasks(open);
      })
      .catch((err) => console.error("Complaints fetch error:", err));
  }, []);

  const handleVerify = async (workerId) => {
    const loadingToast = toast.loading("Verifying worker...");
    try {
      const response = await fetch(
        `http://localhost:1069/api/workers/verify/${workerId}`,
        {
          method: "PATCH",
        },
      );
      const result = await response.json();
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success("Worker Approved!");
        setWorkers((prevWorkers) =>
          prevWorkers.map((worker) =>
            worker._id === workerId
              ? { ...worker, status: "Verified" }
              : worker,
          ),
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error, "Failed to connect to server.");
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  const handleAssign = async (taskId) => {
    const loadingToast = toast.loading("Assigning task...");
    try {
      const response = await fetch("http://localhost:1069/api/workers/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          workerEmail: selectedWorker.email,
          workerRegion: selectedWorker.region,
          // Removed regional constraint for the assignment payload
        }),
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message);
        document.getElementById("assign_modal").close();
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error, "Assignment failed.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <h1 className="text-4xl font-black uppercase italic mb-10 text-center text-primary">
        Worker Management Center
      </h1>

      {/* SECTION 1: PENDING APPLICATIONS (Hidden if none) */}
      {workers.filter((w) => w.status === "Pending").length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-black uppercase italic mb-6 text-warning flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-warning text-white flex items-center justify-center text-sm">
              !
            </span>
            Pending Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workers
              .filter((w) => w.status === "Pending")
              .map((worker) => (
                <div
                  key={worker._id}
                  className="card bg-white shadow-xl rounded-[30px] p-6 border-4 border-yellow-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-black uppercase text-slate-800">
                      {worker.name}
                    </h2>
                    <div className="badge badge-warning font-bold text-[10px] uppercase">
                      Pending
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mb-4 italic">
                    "{worker.experience?.substring(0, 80)}..."
                  </p>
                  <button
                    onClick={() => handleVerify(worker._id)}
                    className="btn btn-warning btn-block rounded-2xl font-black uppercase italic"
                  >
                    Verify & Approve
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE WORKFORCE & ASSIGNMENT */}
      <div>
        <h2 className="text-2xl font-black uppercase italic mb-6 text-primary">
          Verified Workforce
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workers
            .filter((w) => w.status === "Verified")
            .map((worker) => (
              <div
                key={worker._id}
                className="card bg-white shadow-xl rounded-[30px] p-6 border-4 border-white transition-all hover:border-primary/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-black uppercase text-slate-800">
                      {worker.name}
                    </h2>
                    <span className="badge badge-primary badge-outline text-[10px] font-bold uppercase">
                      {worker.specialization}
                    </span>
                  </div>
                  <div
                    className={`text-right ${worker.activeJobs >= 3 ? "text-error" : "text-success"}`}
                  >
                    <p className="text-2xl font-black leading-none">
                      {worker.activeJobs}/3
                    </p>
                    <p className="text-[8px] font-bold uppercase opacity-50">
                      Active Jobs
                    </p>
                  </div>
                </div>

                {/* NEW: ENHANCED ASSIGNED TASKS INFO SECTION */}
                <div className="mt-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex justify-between">
                    Current Workload
                    <span>{worker.currentTasks?.length || 0} Jobs</span>
                  </p>

                  {worker.currentTasks && worker.currentTasks.length > 0 ? (
                    <div className="space-y-3">
                      {worker.currentTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="border-l-2 border-primary pl-3 py-1"
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-[11px] font-black uppercase text-primary">
                              {task.category}
                            </p>
                            <span className="text-[9px] font-bold opacity-50 uppercase">
                              {task.region || "General"}
                            </span>
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 line-clamp-1 italic">
                            {task.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-[10px] italic font-bold text-slate-300">
                        Available for assignment
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedWorker(worker);
                    document.getElementById("assign_modal").showModal();
                  }}
                  disabled={worker.activeJobs >= 3}
                  className="btn btn-primary btn-block rounded-2xl font-black uppercase italic"
                >
                  {worker.activeJobs >= 3
                    ? "Worker Overloaded"
                    : "Assign New Task"}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* --- ASSIGNMENT MODAL REMAINS THE SAME --- */}
      <dialog id="assign_modal" className="modal">
        <div className="modal-box rounded-[40px] max-w-2xl">
          <h3 className="font-black text-2xl uppercase italic mb-2">
            Assign Task to {selectedWorker?.name}
          </h3>

          <p className="text-xs font-bold opacity-60 mb-6 uppercase tracking-widest text-primary">
            Universal Task List (All Regions)
          </p>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {/* REMOVED THE .filter() THAT CHECKED FOR REGION */}

            {unassignedTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center justify-between p-4 bg-base-200 rounded-2xl border-2 border-white shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-sm uppercase">
                      {task.category}
                    </p>

                    <span className="badge badge-ghost text-[8px] font-bold uppercase">
                      {task.region || task.address}
                    </span>
                  </div>

                  <p className="text-xs italic opacity-70 line-clamp-1">
                    {task.description}
                  </p>
                </div>

                <button
                  onClick={() => handleAssign(task._id)}
                  className="btn btn-sm btn-success text-white rounded-xl font-bold uppercase ml-4"
                >
                  Assign
                </button>
              </div>
            ))}

            {unassignedTasks.length === 0 && (
              <div className="text-center py-10 opacity-40 italic font-bold">
                No unassigned tasks found in the system.
              </div>
            )}
          </div>

          <div className="modal-action">
            <button
              className="btn btn-ghost rounded-2xl"
              onClick={() => document.getElementById("assign_modal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default WorkerDashboard;
