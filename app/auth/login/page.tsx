"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { localSession } from "../../../lib/storage/localStorage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      // Admin shortcut
      if (role === "admin" || email.toLowerCase() === "admin@platform.com") {
        localSession.setAuthUser({
          id: "admin-user",
          name: "Admin",
          email: email.trim(),
          createdAt: new Date().toISOString(),
        });
        router.push("/dashboard/admin");
        return;
      }

      // Student login — save session
      localSession.setAuthUser({
        id: `usr-${email.replace(/\W/g, "")}`,
        name: email.split("@")[0],
        email: email.trim(),
        createdAt: new Date().toISOString(),
      });

      // If onboarding is complete (using the proper localSession check), go to dashboard
      if (localSession.isOnboardingComplete()) {
        router.push("/dashboard/student");
      } else {
        router.push("/onboarding");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-between p-12 overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-slate-900 to-purple-900/40 -z-10" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-lg">S</div>
            <span className="font-bold text-2xl tracking-tight text-white">SkillGenie</span>
          </Link>
        </div>

        <div className="max-w-md animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Welcome back to your <span className="gradient-text">growth journey.</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Continue where you left off. Your AI coaches are ready for the next session.
          </p>

          <div className="glass-panel-light p-6 mb-8 relative group cursor-pointer hover:border-brand-500/50 transition-all">
            <div className="absolute top-0 right-0 -mt-3 -mr-3 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl">🎙️</div>
              <div>
                <div className="text-white font-bold">Speaking Coach</div>
                <div className="text-sm text-slate-400">Waiting for you</div>
              </div>
            </div>
            <div className="text-sm text-slate-300">
              "You made great progress on your pacing last time. Ready for the next module?"
            </div>
          </div>
        </div>

        <div className="text-slate-500 text-sm">
          © 2026 SkillGenie. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center font-bold text-white text-xl">S</div>
            <span className="font-bold text-2xl tracking-tight text-white">SkillGenie</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Log in</h2>
            <p className="text-slate-400">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-1 gap-1">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === "student" ? "bg-brand-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === "admin" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
              >
                🛡️ Supervisor / Admin
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder={role === "admin" ? "admin@platform.com" : "name@example.com"}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Forgot password?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {role === "admin" && (
              <div className="px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs">
                💡 Admin hint: use <strong>admin@platform.com</strong> with any password
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="mx-4 text-slate-500 text-sm">or</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button 
            type="button"
            className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors group cursor-not-allowed opacity-70"
            title="Coming soon"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-brand-400 hover:text-brand-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
