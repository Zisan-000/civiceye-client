import React from "react";
import Navbar from "../Header/Navbar";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <header className="max-w-7xl mx-auto">
        <Navbar></Navbar>
      </header>
      <main className="max-w-7xl mx-auto">
        <Outlet></Outlet>
      </main>
    </>
  );
};

export default AuthLayout;
