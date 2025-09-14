import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await login(formData); // Make sure your login returns { success, message }
      // console.log("From Login Page", res);

      if (res?.success) {
        navigate("/"); // redirect to chat home or dashboard
      } else {
        toast.error(res?.message || "Invalid credentials. Try again!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side */}
      <div className="w-1/2 bg-black text-orange-500 flex flex-col items-center justify-center p-10">
        <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
        <p className="text-gray-400 text-lg max-w-md text-center">
          Log in to your account and continue chatting with your friends in
          real-time.
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-zinc-900 text-white flex flex-col justify-center p-10">
        <h2 className="text-3xl font-semibold mb-6 text-orange-500">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 text-orange-400">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-black border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-orange-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-black border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-md font-semibold transition disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Log In"}
          </button>

          <p className="text-sm text-gray-400 mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
