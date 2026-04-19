import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-6xl font-bold text-red-500 text-center mb-10">
        Error 404
      </h1>
      <div className="w-full max-w-md">
        <DotLottieReact
          src="https://lottie.host/1b1e59f0-ec43-4dd6-983f-18ca3d14d966/aX50e0oyk2.lottie"
          loop
          autoplay
        />
      </div>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-12 btn btn-primary"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
