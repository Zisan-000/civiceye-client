import { use, useState } from "react";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";

export default function SmartCategoryForm() {
  const { user, dbUser, refreshDbUser } = use(AuthContext);
  const [category, setCategory] = useState("");
  const [dynamicData, setDynamicData] = useState({});
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDynamicChange = (field, value) => {
    setDynamicData((prev) => ({ ...prev, [field]: value }));
  };

  // --- 1. Added handleUpvote Function ---
  const handleUpvote = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/upvote/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user?.email }),
        },
      );

      if (response.ok) {
        alert(
          "Upvoted successfully! Thank you for supporting an existing report.",
        );
        // Clear form since they upvoted instead of creating new
        setCategory("");
        setAddress("");
        setDynamicData({});
        setDescription("");
      }
    } catch (error) {
      console.error("Upvote error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Initial Trust Score Validation [cite: 23, 25]
    if (dbUser?.trustScore < 30) {
      toast.error("Submission blocked: Your Trust Score is too low.");
      return;
    }

    // Start a loading toast to show work is in progress
    const loadingToast = toast.loading(
      "Uploading image and submitting report...",
    );

    try {
      let beforeImageUrl = null;

      // 2. Upload to ImgBB FIRST
      if (selectedFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", selectedFile);

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=936b6268b95724d4891ad3e474de132d`,
          {
            method: "POST",
            body: imgFormData,
          },
        );
        const imgData = await imgRes.json();
        if (imgData.success) {
          beforeImageUrl = imgData.data.display_url;
        }
      }

      // 3. Prepare final data [cite: 20]
      const formData = {
        userEmail: user?.email,
        userName: user?.displayName || "Citizen",
        category: category,
        address: address,
        specificDetails: dynamicData,
        additionalNotes: description,
        beforeImage: beforeImageUrl,
        location: null,
        createdAt: new Date(),
      };

      // 4. Send to Backend
      const response = await fetch("http://localhost:1069/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Dismiss loading toast before showing final results
      toast.dismiss(loadingToast);

      // 5. Handle Responses
      if (response.status === 403) {
        toast.error(result.error);
        return;
      }

      // Handle Duplicate Check [cite: 26, 28]
      if (response.status === 409) {
        const upvote = window.confirm(
          `${result.message}\n\nWould you like to upvote the existing report instead?`,
        );
        if (upvote) {
          handleUpvote(result.existingId);
        }
        return;
      }

      // 6. Final Success Logic [cite: 63]
      if (result.success) {
        if (refreshDbUser) refreshDbUser(user.email);

        // Toast Success Message
        toast.success("Smart Report Submitted Successfully!");

        // Clear states
        setCategory("");
        setDynamicData({});
        setDescription("");
        setAddress("");
        setSelectedFile(null);

        // Small delay before reload so user can see the toast
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(result.error || "Something went wrong on the server.");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Connection Error:", error);
      toast.error("Could not connect to the server. Check port 1069.");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 mt-10">
        <h1 className="text-3xl font-bold mb-2 text-center text-primary">
          Smart Issue Categorization
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Dynamic form fields change based on the selected issue type.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-base-200 p-8 rounded-2xl shadow-xl"
        >
          <div className="mb-6">
            <label className="label">
              <span className="label-text font-semibold text-lg">
                1. Select Issue Category
              </span>
            </label>
            <select
              className="select select-bordered select-lg w-full text-base bg-base-100"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setDynamicData({});
              }}
              required
            >
              <option value="" disabled>
                Select a category...
              </option>
              <option value="Fire Hazard">🔥 Fire Hazard</option>
              <option value="Environment">🌳 Environment</option>
              <option value="Broken Bench">🪑 Broken Bench</option>
              <option value="General">📝 General</option>
              <option value="water">💧 Water & Plumbing</option>
              <option value="noise">🔊 Noise Complaint</option>
              <option value="road">🚧 Road & Pothole</option>
              <option value="waste">🗑️ Garbage & Waste</option>
              <option value="electrical">⚡ Electrical & Streetlight</option>
            </select>
          </div>

          {category && (
            <div className="mb-6 p-5 bg-base-100 rounded-xl border border-primary/20 shadow-sm transition-all duration-300">
              <h3 className="text-md font-bold text-primary mb-4 border-b pb-2">
                Specific Details Required
              </h3>
              <div className="space-y-4">
                {category === "water" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Severity of Leak?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("severity", e.target.value)
                        }
                        required
                      >
                        <option value="">Select...</option>
                        <option value="drop">Minor dripping</option>
                        <option value="steady">Steady flow</option>
                        <option value="flood">
                          Severe flooding/pipe burst
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Is the water foul-smelling?
                        </span>
                      </label>
                      <div className="flex gap-6 px-2 mt-2">
                        <label className="cursor-pointer flex items-center gap-2">
                          <input
                            type="radio"
                            name="smell"
                            className="radio radio-primary"
                            value="yes"
                            onChange={(e) =>
                              handleDynamicChange("badSmell", e.target.value)
                            }
                            required
                          />{" "}
                          Yes
                        </label>
                        <label className="cursor-pointer flex items-center gap-2">
                          <input
                            type="radio"
                            name="smell"
                            className="radio radio-primary"
                            value="no"
                            onChange={(e) =>
                              handleDynamicChange("badSmell", e.target.value)
                            }
                          />{" "}
                          No
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {category === "noise" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Time of Occurrence?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("time", e.target.value)
                        }
                        required
                      >
                        <option value="">Select time...</option>
                        <option value="morning">Morning (6 AM - 12 PM)</option>
                        <option value="afternoon">
                          Afternoon (12 PM - 6 PM)
                        </option>
                        <option value="night">Night (6 PM - 12 AM)</option>
                        <option value="latenight">
                          Late Night (12 AM - 6 AM)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Source of Noise?
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Construction, Loud Party, Generator"
                        className="input input-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("source", e.target.value)
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {category === "road" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Size of Pothole/Damage?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("size", e.target.value)
                        }
                        required
                      >
                        <option value="">Select size...</option>
                        <option value="small">Small (Nuisance)</option>
                        <option value="medium">
                          Medium (Requires slowing down)
                        </option>
                        <option value="large">
                          Large (Dangerous to vehicles)
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {category === "waste" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Type of Waste?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("wasteType", e.target.value)
                        }
                        required
                      >
                        <option value="">Select waste type...</option>
                        <option value="organic">Organic/Food Waste</option>
                        <option value="plastic">Plastics & Packaging</option>
                        <option value="construction">
                          Construction Debris
                        </option>
                        <option value="hazardous">
                          Hazardous (Glass, Chemicals)
                        </option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="label cursor-pointer justify-start gap-4 p-2 bg-base-200 rounded-lg">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          onChange={(e) =>
                            handleDynamicChange(
                              "blockingRoad",
                              e.target.checked,
                            )
                          }
                        />
                        <span className="label-text font-medium">
                          Is this blocking the road/walkway?
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {category === "electrical" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Specific Electrical Issue?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("electricalIssue", e.target.value)
                        }
                        required
                      >
                        <option value="">Select issue...</option>
                        <option value="flickering">
                          Streetlight Flickering
                        </option>
                        <option value="dead">Streetlight Completely Out</option>
                        <option value="exposed_wire">
                          Exposed/Hanging Wires (URGENT)
                        </option>
                        <option value="sparking">
                          Transformer Sparking (URGENT)
                        </option>
                      </select>
                    </div>
                  </>
                )}

                {category === "Fire Hazard" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text text-error font-bold">
                          Is the fire spreading? (URGENT)
                        </span>
                      </label>
                      <select
                        className="select select-bordered select-error w-full"
                        onChange={(e) =>
                          handleDynamicChange("isSpreading", e.target.value)
                        }
                        required
                      >
                        <option value="">Select status...</option>
                        <option value="yes">Yes, spreading rapidly</option>
                        <option value="no">No, currently contained</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          What is burning?
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="E.g., Garbage pile, Electrical box, Tree"
                        className="input input-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("burningMaterial", e.target.value)
                        }
                        required
                      />
                    </div>
                  </>
                )}

                {/* --- NEW LOGIC FOR ENVIRONMENT --- */}
                {category === "Environment" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Type of Environmental Hazard?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("envType", e.target.value)
                        }
                        required
                      >
                        <option value="">Select issue...</option>
                        <option value="chemical">
                          Chemical Spill / Hazardous Waste
                        </option>
                        <option value="animal">Dead Animal / Biohazard</option>
                        <option value="air">
                          Severe Air Pollution / Smoke
                        </option>
                        <option value="water">Contaminated Water Body</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="label cursor-pointer justify-start gap-4 p-2 bg-base-200 rounded-lg">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-warning"
                          onChange={(e) =>
                            handleDynamicChange(
                              "hasStrongOdor",
                              e.target.checked,
                            )
                          }
                        />
                        <span className="label-text font-medium">
                          Is there a strong, toxic odor?
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* --- NEW LOGIC FOR BROKEN BENCH --- */}
                {category === "Broken Bench" && (
                  <>
                    <div>
                      <label className="label">
                        <span className="label-text font-medium">
                          Material of the Bench?
                        </span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        onChange={(e) =>
                          handleDynamicChange("benchMaterial", e.target.value)
                        }
                        required
                      >
                        <option value="">Select material...</option>
                        <option value="wood">Wood</option>
                        <option value="metal">Metal</option>
                        <option value="concrete">Concrete / Stone</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="label cursor-pointer justify-start gap-4 p-2 bg-base-200 rounded-lg border border-warning/50">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-warning"
                          onChange={(e) =>
                            handleDynamicChange(
                              "hasSharpEdges",
                              e.target.checked,
                            )
                          }
                        />
                        <span className="label-text font-medium">
                          Are there exposed sharp edges or nails? (Safety Risk)
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* --- NEW LOGIC FOR GENERAL --- */}
                {category === "General" && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      You selected <strong>General</strong>. Please provide a
                      clear and detailed explanation of the issue in the
                      "Additional Description" box below.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="label">
              <span className="label-text font-semibold text-lg">
                2. Additional Description
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full text-base bg-base-100"
              placeholder="Provide any extra details here..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="label">
              <span className="label-text font-semibold text-lg">
                2. Specific Location / Address
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full text-base bg-base-100 border-primary/40 focus:border-primary"
              placeholder="Enter the exact address or landmarks (e.g., Road 5, Block C, near the yellow building)"
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required // Make it required so you don't get reports without locations
            ></textarea>
          </div>

          <div className="form-control w-full my-4">
            <label className="label">
              <span className="label-text font-bold">
                Upload Issue Photo (Before)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="file-input file-input-bordered file-input-primary w-full"
            />
            <label className="label">
              <span className="label-text-alt opacity-60">
                Help workers identify the issue quickly.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={dbUser?.trustScore < 30}
            className={`btn btn-lg w-full rounded-full border-none shadow-xl transition-all ${
              dbUser?.trustScore < 30
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#00ADB5] hover:bg-teal-400 text-white"
            }`}
          >
            {dbUser?.trustScore < 30
              ? "Account Restricted"
              : "Submit Smart Report"}
          </button>
        </form>
      </div>
    </>
  );
}
