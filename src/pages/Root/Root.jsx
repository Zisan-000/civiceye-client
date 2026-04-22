import React, { Suspense, useEffect } from "react";
import Navbar from "../../components/Header/Navbar";
import { Outlet, useNavigation } from "react-router";
import Footer from "../../components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import Loading from "../../components/Loading/Loading";

const Root = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const isLoading = navigation.state === "loading";
  return (
    <div id="smooth-wrapper">
      {/* The Toaster is fixed, so it stays OUTSIDE the smooth-content */}
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />
      <div id="smooth-content">
        {/* 1. Navbar stays inside so it scrolls (unless you want it fixed) */}

        {/* 2. Main Content Area */}
        <div className="max-w-7xl mx-auto">
          <main>{isLoading ? <Loading /> : <Outlet />}</main>
        </div>

        {/* 3. Footer MUST be inside the same smooth-content div */}
        <Footer />
      </div>
    </div>
  );
};

export default Root;
