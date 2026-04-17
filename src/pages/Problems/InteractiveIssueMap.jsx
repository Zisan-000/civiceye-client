import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router";
import L from "leaflet";

// Fix for default marker icons not showing up correctly in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Marker Icons for CivicEye Categories
const iconMap = {
  // Red Icons
  "fire hazard": new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  electrical: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  // Blue Icons
  "water leak": new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  // Green Icons
  environment: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  waste: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  // Yellow/Gold Fallback for others
  general: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  road: new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

export default function InteractiveIssueMap() {
  const [activeIssues, setActiveIssues] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1069/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        // THE SELECTIVE FILTER:
        const activeAndRegional = data.filter((prob) => {
          // 1. Must be an active status
          const isActive = [
            "Pending",
            "Open",
            "In Review",
            "Work in Progress",
          ].includes(prob.status);

          // 2. Must have a region field that is not empty/null
          const hasRegion = prob.region;

          // Only return true if BOTH conditions are met
          return isActive && hasRegion;
        });

        setActiveIssues(activeAndRegional);
      });
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-10">
      {/* Title Section */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#222831] tracking-tight italic">
            COMMUNITY LIVE MAP
          </h1>
          <p className="text-gray-500 text-sm">
            Real-time visualization of active reports
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="badge badge-outline gap-2 p-4 font-bold uppercase text-[10px]">
            <span className="w-4 h-4 text-2xl rounded-full bg-blue-500 animate-pulse"></span>{" "}
            <span className="font-bold">
              {activeIssues.length} Active Issues
            </span>
          </div>
        </div>
      </div>

      {/* Map Container Wrapper */}
      <div className="h-200 w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative z-0">
        {/* Legend - High Z-Index to stay clickable */}
        <div className="absolute top-6 right-6 z-999 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white max-w-xs">
          <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
            Category Legend
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {/* Red Group: Urgent/Safety */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span>{" "}
              Fire/Electric
            </div>

            {/* Blue Group: Utilities */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span>{" "}
              Water/Plumb
            </div>

            {/* Green Group: Environment */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-green-600">
              <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></span>{" "}
              Environment
            </div>

            {/* Orange/Gold Group: Infrastructure */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-orange-500">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></span>{" "}
              Road/Pothole
            </div>

            {/* Purple Group: Social/Misc */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-purple-600">
              <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></span>{" "}
              Noise/Benches
            </div>

            {/* Yellow Group: Default */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-yellow-600">
              <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></span>{" "}
              General
            </div>
          </div>
        </div>

        <MapContainer
          center={[23.8103, 90.4125]} // Dhaka
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />

          {activeIssues.map((issue) => {
            if (!issue.location?.lat || !issue.location?.lng) return null;

            // 1. Convert DB category to lowercase for matching
            const categoryKey = (issue.category || "general").toLowerCase();

            // 2. Select icon based on standardized key (Using the lowercase dictionary)
            // Ensure your iconMap has lowercase keys like 'general', 'water', etc.
            const selectedIcon = iconMap[categoryKey] || iconMap["general"];

            return (
              <Marker
                key={issue._id}
                position={[issue.location.lat, issue.location.lng]}
                // FIX: Use the 'selectedIcon' variable here!
                icon={selectedIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-1 w-48 font-sans">
                    <div className="flex justify-between items-start mb-2">
                      {/* Region Badge we just discussed */}
                      <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">
                        {issue.region || "Local Area"}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 italic">
                        {issue.category}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-800 leading-tight mb-3">
                      {issue.description}
                    </p>

                    <div className="flex items-center justify-between border-t pt-2 border-dashed border-slate-200">
                      <span className="text-xs font-bold text-primary">
                        👍 {issue.upvotes || 0}
                      </span>
                      <Link
                        to={`/problems/details/${issue._id}`}
                        className="btn btn-active hover:btn-error btn-xs rounded-lg text-white px-3"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
