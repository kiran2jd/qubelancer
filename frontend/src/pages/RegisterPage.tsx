import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layers,
  Lock,
  Mail,
  User,
  Briefcase,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState<"customer" | "professional">("customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [preferredCurrency, setPreferredCurrency] = useState("INR");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation rules
  const errors: Record<string, string | null> = {
    firstName:
      !firstName.trim()
        ? "First name is required"
        : firstName.trim().length < 2
        ? "First name must be at least 2 characters"
        : null,
    lastName:
      !lastName.trim()
        ? "Last name is required"
        : lastName.trim().length < 1
        ? "Last name must be at least 1 character"
        : null,
    email:
      !email.trim()
        ? "Email address is required"
        : !emailRegex.test(email.trim())
        ? "Please enter a valid email address (e.g. name@domain.com)"
        : null,
    password:
      !password
        ? "Password is required"
        : password.length < 8
        ? "Password must be at least 8 characters long"
        : !/[A-Z]/.test(password) || !/[0-9]/.test(password)
        ? "Password should contain at least 1 uppercase letter and 1 number"
        : null,
    confirmPassword:
      !confirmPassword
        ? "Please confirm your password"
        : confirmPassword !== password
        ? "Passwords do not match"
        : null,
    agreeTerms: !agreeTerms ? "You must agree to the Terms of Service to proceed" : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });
    setError(null);

    if (hasErrors) {
      setError("Please fix all form validation errors before creating your account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register({
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role,
        country_code: countryCode,
        preferred_currency: preferredCurrency,
      });

      if (res.user.roles.includes("professional")) {
        navigate("/dashboard/professional", { replace: true });
      } else {
        navigate("/dashboard/customer", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8 bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Create your QubeLancer account
          </h2>
          <p className="text-xs text-slate-400">
            Join the global high-trust freelance network & autonomous work ecosystem
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Switcher Cards */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
              role === "customer"
                ? "bg-indigo-600/15 border-indigo-500 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <UserCheck className={`w-5 h-5 ${role === "customer" ? "text-indigo-400" : "text-slate-500"}`} />
              {role === "customer" && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
            </div>
            <div>
              <div className="text-sm font-bold">I'm a Customer</div>
              <div className="text-[11px] text-slate-400">Post projects & hire verified specialists</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("professional")}
            className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
              role === "professional"
                ? "bg-indigo-600/15 border-indigo-500 text-white"
                : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <Briefcase className={`w-5 h-5 ${role === "professional" ? "text-indigo-400" : "text-slate-500"}`} />
              {role === "professional" && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
            </div>
            <div>
              <div className="text-sm font-bold">I'm a Professional</div>
              <div className="text-[11px] text-slate-400">Offer consulting & publish services</div>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                First Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="First name"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                    touched.firstName && errors.firstName
                      ? "border-rose-500"
                      : touched.firstName && !errors.firstName
                      ? "border-emerald-500/50"
                      : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
              </div>
              {touched.firstName && errors.firstName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Last Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Last name"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                    touched.lastName && errors.lastName
                      ? "border-rose-500"
                      : touched.lastName && !errors.lastName
                      ? "border-emerald-500/50"
                      : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
              </div>
              {touched.lastName && errors.lastName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
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
                placeholder="name@company.com"
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

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password (Min 8 chars, 1 uppercase, 1 number) <span className="text-rose-400">*</span>
            </label>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-rose-500"
                    : touched.confirmPassword && !errors.confirmPassword && confirmPassword
                    ? "border-emerald-500/50"
                    : "border-slate-800 focus:border-indigo-500"
                }`}
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Country & Currency */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Country
              </label>
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  if (e.target.value === "IN") setPreferredCurrency("INR");
                  else if (e.target.value === "US") setPreferredCurrency("USD");
                  else if (e.target.value === "GB") setPreferredCurrency("GBP");
                  else if (e.target.value === "DE") setPreferredCurrency("EUR");
                }}
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="IN">India (IN)</option>
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="DE">Germany (DE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Preferred Currency
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="GBP">GBP (£ British Pound)</option>
                <option value="EUR">EUR (€ Euro)</option>
              </select>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs text-slate-400 leading-relaxed">
                I agree to the QubeLancer Terms of Service and Privacy Policy, and understand that professional licenses are subject to verification before executing regulated jobs.
              </span>
            </label>
            {touched.agreeTerms && errors.agreeTerms && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.agreeTerms}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all duration-150 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isSubmitting ? "Creating Account..." : `Register as ${role === "customer" ? "Customer" : "Professional"}`}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
