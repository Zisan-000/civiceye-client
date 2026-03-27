import React, { use } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../provider/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = use(AuthContext);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleGoogle = () => {
    googleLogin()
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    login(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in:", user.email);

        // Success feedback
        alert(`Welcome back, ${user.email}!`);

        // Redirect to the original destination
        navigate(from, { replace: true });
      })
      .catch((error) => {
        // Error feedback
        const errorMessage = error.message;
        alert("Login Failed: " + errorMessage);
        console.error(error.code, errorMessage);
      });
  };
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-gray-900 to-black px-4 my-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6 text-center lg:text-left">
            <h1 className="text-5xl font-extrabold leading-tight">
              Welcome Back 👋
            </h1>
            <p className="text-gray-300 text-lg">
              Log in to{" "}
              <span className="font-semibold text-white">CivicEye</span> and
              help improve your community. Report issues, stay informed, and be
              part of positive change.
            </p>
            <p className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <span className="text-indigo-400 cursor-pointer hover:underline">
                <Link to="/auth/register">Register here</Link>
              </span>
            </p>
          </div>

          {/* Login Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Login to your account
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-white rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Email"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Email
                </label>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  className="peer w-full px-4 pt-5 pb-2 bg-white/10 text-white rounded-lg outline-none border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder-transparent"
                  placeholder="Password"
                />
                <label className="absolute left-4 top-2 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-400">
                  Password
                </label>
              </div>

              {/* Forgot */}
              <div className="text-right">
                <a className="text-sm text-indigo-400 hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-all text-white font-semibold shadow-lg hover:shadow-indigo-500/40">
                Login
              </button>
            </form>
            {/* Google Button */}
            <button
              onClick={handleGoogle}
              type="button"
              className="btn w-full h-12 flex items-center justify-center gap-3 py-3 rounded-lg bg-white text-gray-800 font-medium hover:bg-gray-100 transition-all shadow-md my-3"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.72 1.22 9.23 3.6l6.9-6.9C35.64 2.4 30.2 0 24 0 14.64 0 6.6 5.4 2.56 13.28l8.04 6.24C12.6 13.1 17.8 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.6-.14-3.14-.4-4.64H24v9h12.7c-.55 2.96-2.2 5.48-4.7 7.18l7.2 5.6C43.9 37.3 46.5 31.4 46.5 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.6 28.52A14.5 14.5 0 019.5 24c0-1.57.27-3.08.74-4.48l-8.04-6.24A23.9 23.9 0 000 24c0 3.84.92 7.47 2.56 10.72l8.04-6.2z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.2 0 11.4-2.05 15.2-5.6l-7.2-5.6c-2 1.36-4.56 2.18-8 2.18-6.2 0-11.4-3.6-13.4-8.8l-8.04 6.2C6.6 42.6 14.64 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
