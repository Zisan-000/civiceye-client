import React from "react";
import Navbar from "../Header/Navbar";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <>
      <header className="">
        <Navbar></Navbar>
      </header>
      <main className="">
        <Outlet></Outlet>
      </main>
    </>
  );
};

export default AuthLayout;
