import React, { Suspense } from "react";
import Navbar from "../../components/Header/Navbar";
import { Outlet, useNavigation } from "react-router";
import Footer from "../../components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import Loading from "../../components/Loading/Loading";

const Root = () => {
  const navigation = useNavigation();

  // This will be true WHENEVER any loader in your app is running
  const isLoading = navigation.state === "loading";
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        <Navbar></Navbar>
      </div>
      <div className="max-w-7xl mx-auto">
        <main>{isLoading ? <Loading /> : <Outlet />}</main>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Root;
