import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-48 h-48">
        <DotLottieReact
          src="https://lottie.host/bf332e7e-378b-44b3-bd5d-6c2878658e68/ZSybSYYaT8.lottie"
          loop
          autoplay
        />
      </div>
      <h2 className="text-xl font-black italic uppercase tracking-tighter animate-pulse">
        Civic<span className="text-teal-600">Eye</span> is Loading...
      </h2>
    </div>
  );
};

export default Loading;
