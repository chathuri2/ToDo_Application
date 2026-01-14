"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, ArrowRight } from "lucide-react"; // Icons

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/",
        }, {
            onRequest: () => setLoading(true),
            onSuccess: () => router.push("/"),
            onError: (ctx) => {
                setError(ctx.error.message);
                setLoading(false);
            }
        });
    };

    return (
        // Main Background Gradient
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-purple-600 to-indigo-800 p-4">

            {/* Card Container */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[500px]">

                {/* LEFT SIDE: Artistic Blobs */}
                <div className="w-full md:w-1/2 relative bg-white overflow-hidden hidden md:block">
                    {/* Purple Blob (Top Left) */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-90 blur-xl mix-blend-multiply filter" />
                    {/* Orange Blob (Bottom Center) */}
                    <div className="absolute -bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-90 blur-xl mix-blend-multiply filter" />
                    {/* Small Accent Blob */}
                    <div className="absolute top-1/2 right-10 w-24 h-24 bg-purple-300 rounded-full opacity-60 blur-lg" />
                </div>

                {/* RIGHT SIDE: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative z-10">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">User Login</h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-500 transition-all"
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
                                className="w-full pl-11 pr-4 py-3 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 placeholder-gray-500 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {loading ? "LOGGING IN..." : "LOGIN"}
                        </button>

                        {/* Links */}
                        <div className="text-center space-y-4">
                            <a href="#" className="block text-sm text-gray-500 hover:text-purple-600">
                                Forgot Username password?
                            </a>

                            <Link
                                href="/signup"
                                className="inline-flex items-center text-sm text-gray-600 hover:text-purple-700 font-medium group"
                            >
                                Create Your Account
                                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}