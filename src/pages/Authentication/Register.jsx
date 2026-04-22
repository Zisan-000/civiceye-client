import React, { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";
import { Helmet } from "react-helmet";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Register = () => {
  const { createUser, setUser } = use(AuthContext);
  const handleRegister = (e) => {
    e.preventDefault();
    // //console.log(e.target);
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const number = form.number.value;
    const password = form.password.value;
    const confirm = form.confirm.value;
    //console.log({ name, email, number, password, confirm });
    createUser(email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        setUser(user);
        //console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode, errorMessage);
      });
  };
  return (
    <div>
      <Helmet>
        <title>Registration || CivicEye</title>
      </Helmet>
      <div className="min-h-screen lg:min-h-screen flex items-center justify-center my-20 bg-linear-to-br from-purple-100 via-blue-100 to-white px-4 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 order-2 lg:order-1">
            <h2 className="text-2xl font-semibold text-black mb-6 text-center">
              Create your account
            </h2>

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-black rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Full Name"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Full Name
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-black rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Email"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Email
                </label>
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  name="number"
                  type="tel"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-black rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Phone Number"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Phone Number
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-black rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Password"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Password
                </label>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  name="confirm"
                  type="password"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-black rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Confirm Password"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Confirm Password
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-all text-white font-semibold shadow-lg hover:shadow-indigo-500/40"
              >
                Register
              </button>
            </form>
          </div>

          {/* Register Card */}

          <div className="text-blue-500 space-y-6 text-center lg:text-left order-1 lg:order-2">
            <h1 className="text-5xl font-extrabold leading-tight">
              Join CivicEye 🚀
            </h1>
            <DotLottieReact
              src="https://lottie.host/f464c052-9de8-4c52-b2e9-79f7a9be4482/2sJwNbMQlP.lottie"
              loop
              autoplay
            />
            <p className="text-gray-600 text-lg">
              Create an account to report civic issues, stay updated, and
              contribute to building a better community.
            </p>
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline">
                <Link to="/auth/login">Login here</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
