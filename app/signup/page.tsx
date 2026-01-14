"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Mail, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/login",
    }, {
      onRequest: () => setLoading(true),
      onSuccess: () => router.push("/login"),
      onError: (ctx) => {
        setError(ctx.error.message);
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-600 to-red-500 p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[550px]">

        {/* LEFT SIDE: Artistic Blobs (Inverted pattern for variety) */}
        <div className="w-full md:w-1/2 relative bg-white overflow-hidden hidden md:block">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-gradient-to-bl from-orange-400 to-red-500 rounded-full opacity-80 blur-2xl mix-blend-multiply" />
          <div className="absolute -bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full opacity-80 blur-2xl mix-blend-multiply" />
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-0.5 transition-all"
            >
              {loading ? "CREATING..." : "SIGN UP"}
            </button>

            {/* Footer */}
            <div className="text-center mt-4">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 font-medium group"
              >
                Already have an account? Login
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}