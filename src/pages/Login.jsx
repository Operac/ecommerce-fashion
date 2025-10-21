import { useState } from "react";
import Layout from "../Shared/Layout/Layout";

// Mock Input component since we don't have the actual one
const Input = ({ type, labelFor, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="text-white text-sm font-medium">{labelFor}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-gray-800 text-white px-4 py-3 rounded-md border border-primary focus:outline-none focus:border-white transition-colors"
    />
  </div>
);



const Login = () => {
  const [activeTab, setActiveTab] = useState("login"); // "login", "signup", or "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      console.log("Logging in:", email, password);
    } else if (activeTab === "signup") {
      console.log("Signing up:", fullName, email, password);
    } else if (activeTab === "forgot") {
      console.log("Reset password for:", email);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-primary backdrop-blur-sm p-8 rounded-2xl shadow-2xl flex flex-col gap-6"
        >
          {/* Header */}
          <div className="text-center mb-2">
            <h2 className="text-white text-3xl font-bold mb-2">
              {activeTab === "login" && "Welcome Back"}
              {activeTab === "signup" && "Create Account"}
              {activeTab === "forgot" && "Reset Password"}
            </h2>
            <p className="text-primary text-sm">
              {activeTab === "login" && "Sign in to your account"}
              {activeTab === "signup" && "Join us today"}
              {activeTab === "forgot" && "We'll send you a reset link"}
            </p>
          </div>

          {/* Tab Navigation */}
          {activeTab !== "forgot" && (
            <div className="flex gap-2 bg-gray-900 p-1 rounded-lg mb-2">
              <button
                type="button"
                onClick={() => switchTab("login")}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "bg-primary text-white shadow-lg"
                    : "text-primary hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab("signup")}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-primary text-white shadow-lg"
                    : "text-primary hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <>
              <Input
                type="text"
                labelFor="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
              <Input
                type="email"
                labelFor="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <Input
                type="password"
                labelFor="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
              <Input
                type="password"
                labelFor="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <>
              <Input
                type="email"
                labelFor="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <Input
                type="password"
                labelFor="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </>
          )}

          {/* Forgot Password Form */}
          {activeTab === "forgot" && (
            <>
              <Input
                type="email"
                labelFor="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-white text-black font-bold py-3 rounded-md hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {activeTab === "login" && "Sign In"}
            {activeTab === "signup" && "Create Account"}
            {activeTab === "forgot" && "Send Reset Link"}
          </button>

          {/* Forgot Password Link (only on login) */}
          {activeTab === "login" && (
            <p
              onClick={() => switchTab("forgot")}
              className="text-sm text-white text-center cursor-pointer hover:text-gray-600 hover:underline transition-colors"
            >
              Forgot Password?
            </p>
          )}

          {/* Back to Login (only on forgot password) */}
          {activeTab === "forgot" && (
            <p
              onClick={() => switchTab("login")}
              className="text-sm text-white text-center cursor-pointer  hover:underline transition-colors"
            >
              ← Back to Sign In
            </p>
          )}

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-white">
            <p className="text-sm text-white text-center">
              {activeTab === "login" && "New customer? "}
              {activeTab === "signup" && "Already have an account? "}
              {activeTab === "forgot" && "Remember your password? "}
              <span
                onClick={() => switchTab(activeTab === "signup" ? "login" : "signup")}
                className="text-white cursor-pointer font-bold hover:underline transition-colors"
              >
                {activeTab === "login" && "Create an account"}
                {activeTab === "signup" && "Sign in here"}
                {activeTab === "forgot" && "Sign in here"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login;