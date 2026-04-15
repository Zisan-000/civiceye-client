import { useState, useEffect, use } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AuthContext } from "../../provider/AuthProvider";
import toast from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const REGIONS = {
  dhaka: {
    name: "Dhaka Division",
    center: [23.8103, 90.4125],
    zoom: 10,
    bounds: { north: 24.5, south: 23.0, east: 91.0, west: 89.5 },
  },
  chittagong: {
    name: "Chittagong Division",
    center: [22.3569, 91.7832],
    zoom: 9,
    bounds: { north: 23.0, south: 21.0, east: 92.5, west: 91.0 },
  },
  sylhet: {
    name: "Sylhet Division",
    center: [24.8949, 91.8687],
    zoom: 10,
    bounds: { north: 25.3, south: 24.0, east: 92.5, west: 91.0 },
  },
  rajshahi: {
    name: "Rajshahi Division",
    center: [24.3745, 88.6042],
    zoom: 10,
    bounds: { north: 25.3, south: 23.6, east: 89.8, west: 88.0 },
  },
  khulna: {
    name: "Khulna Division",
    center: [22.8456, 89.5403],
    zoom: 9,
    bounds: { north: 24.1, south: 21.6, east: 90.0, west: 88.8 },
  },
  barisal: {
    name: "Barisal Division",
    center: [22.701, 90.3535],
    zoom: 10,
    bounds: { north: 23.2, south: 21.8, east: 91.0, west: 89.8 },
  },
  rangpur: {
    name: "Rangpur Division",
    center: [25.7439, 89.2752],
    zoom: 10,
    bounds: { north: 26.6, south: 25.0, east: 89.9, west: 88.0 },
  },
  mymensingh: {
    name: "Mymensingh Division",
    center: [24.7471, 90.4203],
    zoom: 10,
    bounds: { north: 25.4, south: 24.0, east: 91.0, west: 89.6 },
  },
};

function MapMover({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

function LocationPicker({ position, setPosition, setMapError, activeRegion }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const bounds = activeRegion.bounds;

      if (
        lat <= bounds.north &&
        lat >= bounds.south &&
        lng <= bounds.east &&
        lng >= bounds.west
      ) {
        setPosition(e.latlng);
        setMapError("");
      } else {
        setMapError(
          `Location is outside ${activeRegion.name}! Please select within the boundary.`,
        );
      }
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export default function ReportProblem() {
  const [selectedRegionKey, setSelectedRegionKey] = useState("dhaka");
  const [position, setPosition] = useState(null);
  const [mapError, setMapError] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { user, dbUser, refreshDbUser, loading } = use(AuthContext);
  console.log("Current User in ReportProblem:", user);
  console.log("DB User Trust Score:", dbUser?.trustScore);
  console.log("Loading state:", loading);

  const activeRegion = REGIONS[selectedRegionKey];

  const handleRegionChange = (e) => {
    setSelectedRegionKey(e.target.value);
    setPosition(null);
    setMapError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Initial Validation
    if (dbUser?.trustScore < 30) {
      alert("Submission blocked: Your Trust Score is too low.");
      return;
    }
    if (!position) {
      setMapError("Please tap on the map to pin the issue location.");
      return;
    }

    try {
      let beforeImageUrl = null;

      // 2. Upload to ImgBB FIRST
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=936b6268b95724d4891ad3e474de132d`,
          {
            method: "POST",
            body: formData,
          },
        );
        const imgData = await imgRes.json();
        if (imgData.success) {
          beforeImageUrl = imgData.data.display_url;
        }
      }

      // 3. Prepare the data AFTER getting the image URL
      const complaintData = {
        userEmail: user?.email,
        userName: user?.displayName || "Citizen",
        region: activeRegion.name,
        description,
        beforeImage: beforeImageUrl, // Now this has the URL
        location: { lat: position.lat, lng: position.lng },
        category: "general",
      };

      // 4. NOW call the backend with the prepared data
      const response = await fetch("http://localhost:1069/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData),
      });

      const result = await response.json();

      // 5. Handle Responses
      if (response.status === 403) {
        toast.error(result.error);
        return;
      }

      if (response.status === 409) {
        const upvote = window.confirm(
          `${result.message}\n\nWould you like to upvote the existing report instead?`,
        );
        if (upvote) {
          handleUpvote(result.existingId);
        }
        return;
      }

      if (result.success) {
        if (refreshDbUser) refreshDbUser(user.email);
        toast.success(
          result.message || "Success! Complaint reported. +5 Trust Score.",
        );
        setDescription("");
        setPosition(null);
        setSelectedFile(null);
        window.location.reload();
      } else {
        alert(
          "Server Error: " + (result.error || "An unexpected error occurred."),
        );
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert(
        "Could not connect to the backend. Ensure your Node.js server is running on port 1069.",
      );
    }
  };

  const handleUpvote = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:1069/api/complaints/upvote/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail: user.email }),
        },
      );

      if (response.ok) {
        toast.success(
          "Upvoted successfully! This issue now has a higher priority.",
        );

        setPosition(null);
        setDescription("");
      }
    } catch (error) {
      console.error("Upvote error:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Report a Community Issue
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-base-200 p-6 rounded-xl shadow-lg"
      >
        <div className="mb-6">
          <label className="label">
            <span className="label-text font-semibold text-lg">
              1. Select Area
            </span>
          </label>
          <select
            className="select select-bordered w-full text-base"
            value={selectedRegionKey}
            onChange={handleRegionChange}
          >
            {Object.entries(REGIONS).map(([key, region]) => (
              <option key={key} value={key}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="label">
            <span className="label-text font-semibold text-lg">
              2. Pin the Location
            </span>
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Tap anywhere inside {activeRegion.name} to set a pin.
          </p>

          <div className="h-80 w-full rounded-lg overflow-hidden border-2 border-primary z-0">
            <MapContainer
              center={activeRegion.center}
              zoom={activeRegion.zoom}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapMover center={activeRegion.center} zoom={activeRegion.zoom} />

              <LocationPicker
                position={position}
                setPosition={setPosition}
                setMapError={setMapError}
                activeRegion={activeRegion}
              />
            </MapContainer>
          </div>

          {mapError && (
            <div className="alert alert-error mt-4 shadow-sm">
              <span>{mapError}</span>
            </div>
          )}

          {position && (
            <div className="mt-2 text-sm text-success font-semibold">
              Location Selected: {position.lat.toFixed(4)},{" "}
              {position.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="label">
            <span className="label-text font-semibold text-lg">
              3. Describe the Issue
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full text-base"
            placeholder="E.g., Huge pothole near the main gate..."
            rows="4"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          {dbUser?.trustScore < 30 ? "Account Restricted" : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
