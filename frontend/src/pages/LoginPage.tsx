import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Layers, Lock, Mail, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [showMfaInput, setShowMfaInput] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors: Record<string, string | null> = {
    email: !email.trim()
      ? "Email address is required"
      : !emailRegex.test(email.trim())
      ? "Please enter a valid email address"
      : null,
    password: !password ? "Password is required" : null,
    totpCode: showMfaInput && (!totpCode || totpCode.length !== 6) ? "Enter a 6-digit authenticator code" : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, totpCode: true });
    setError(null);

    if (errors.email || errors.password || (showMfaInput && errors.totpCode)) {
      setError("Please fix errors before signing in.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({
        email: email.trim(),
        password,
        totp_code: showMfaInput ? totpCode : undefined,
      });

      if (res.requires_mfa) {
        setShowMfaInput(true);
        setError("Two-factor authentication code required. Please enter the code from your authenticator app.");
      } else {
        const target = res.user.roles.includes("professional")
          ? "/dashboard/professional"
          : "/dashboard/customer";
        navigate(from === "/dashboard" ? target : from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="text-xs text-slate-400">
            Sign in to your QubeLancer account
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                  touched.email && errors.email
                    ? "border-rose-500"
                    : touched.email && !errors.email
                    ? "border-emerald-500/50"
                    : "border-slate-800 focus:border-indigo-500"
                }`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password <span className="text-rose-400">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                  touched.password && errors.password
                    ? "border-rose-500"
                    : touched.password && !errors.password
                    ? "border-emerald-500/50"
                    : "border-slate-800 focus:border-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.password}
              </p>
            )}
          </div>

          {showMfaInput && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
              <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>6-Digit Authenticator Code (MFA)</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                onBlur={() => handleBlur("totpCode")}
                placeholder="123456"
                className="w-full px-4 py-2.5 bg-slate-950 border border-indigo-500/40 rounded-xl text-center text-lg tracking-widest font-mono text-white focus:outline-none focus:border-indigo-400"
              />
              {touched.totpCode && errors.totpCode && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.totpCode}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all duration-150 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Authenticating..." : showMfaInput ? "Verify & Sign In" : "Sign In"}
          </button>
        </form>

        {/* 1-Click Demo Showcase Access for Client & Stakeholders */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold text-center mb-2.5">
            Instant Demo Testing Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={async () => {
                setIsSubmitting(true);
                setError(null);
                try {
                  await login({ email: "demo.client@qubelancer.com", password: "Password123!" });
                  navigate("/dashboard/customer", { replace: true });
                } catch (e: any) {
                  setError(e.message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 text-center transition flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span className="font-semibold text-indigo-400">👤 Client Demo</span>
              <span className="text-[10px] text-slate-400">Priya Sharma</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsSubmitting(true);
                setError(null);
                try {
                  await login({ email: "demo.consultant@qubelancer.com", password: "Password123!" });
                  navigate("/dashboard/professional", { replace: true });
                } catch (e: any) {
                  setError(e.message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 text-center transition flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span className="font-semibold text-emerald-400">💼 Consultant Demo</span>
              <span className="text-[10px] text-slate-400">Arjun Mehta</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
