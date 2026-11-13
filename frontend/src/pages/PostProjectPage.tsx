import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/marketplace";
import { api } from "../api/client";
import { aiApi, GeneratedJobPost } from "../api/ai";
import {
  FolderPlus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Mic,
  MicOff,
  Wand2,
  HelpCircle,
  Tag,
} from "lucide-react";

export const PostProjectPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState<number | string>("");
  const [budgetMax, setBudgetMax] = useState<number | string>(500);
  const [deadlineDays, setDeadlineDays] = useState<number>(30);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  // Touched & validation states
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dedicated AI Copilot states
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Validation rules
  const errors: Record<string, string | null> = {
    title:
      !title.trim()
        ? "Project title is required"
        : title.trim().length < 10
        ? "Title must be at least 10 characters long"
        : title.trim().length > 120
        ? "Title must not exceed 120 characters"
        : null,
    category:
      !categoryId && categories.length === 0
        ? "Category is loading..."
        : !categoryId && categories.length > 0 && !categories[0]?.id
        ? "Please select a valid category"
        : null,
    description:
      !description.trim()
        ? "Project scope & deliverables are required"
        : description.trim().length < 30
        ? `Description must be at least 30 characters (${description.trim().length}/30)`
        : null,
    budgetMin:
      budgetMin !== "" && Number(budgetMin) < 0
        ? "Minimum budget cannot be negative"
        : budgetMin !== "" && budgetMax !== "" && Number(budgetMin) > Number(budgetMax)
        ? "Minimum budget cannot exceed maximum budget"
        : null,
    budgetMax:
      budgetMax === ""
        ? "Maximum budget is required"
        : Number(budgetMax) < 25
        ? "Maximum budget must be at least $25 USD"
        : null,
    deadlineDays:
      !deadlineDays || deadlineDays < 1
        ? "Deadline must be at least 1 day"
        : deadlineDays > 365
        ? "Deadline cannot exceed 365 days (1 year)"
        : null,
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // AI Voice Recognition handler
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Dedicated AI Auto-Fill execution
  const handleAiAutoFill = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiSuccessMessage(null);
    setError(null);

    try {
      const result: GeneratedJobPost = await aiApi.generateJobPost(aiPrompt);

      // Auto-populate form
      setTitle(result.title);
      setDescription(result.description);
      if (result.budget_min) setBudgetMin(result.budget_min);
      setBudgetMax(result.budget_max);
      setDeadlineDays(result.deadline_days);
      setSuggestedSkills(result.suggested_skills || []);

      // Attempt matching category
      if (categories.length > 0) {
        const matched =
          categories.find((c) =>
            c.name.toLowerCase().includes(result.category_name.toLowerCase())
          ) ||
          categories.find((c) =>
            result.category_name.toLowerCase().includes(c.name.toLowerCase())
          );
        if (matched) {
          setCategoryId(matched.id);
        } else if (!categoryId) {
          setCategoryId(categories[0].id);
        }
      }

      setAiSuccessMessage(
        `AI Requirement analyzed! Generated: "${result.title}" with ${result.suggested_skills?.length || 0} skills identified.`
      );
      // Mark touched to validate filled data
      setTouched({
        title: true,
        category: true,
        description: true,
        budgetMin: true,
        budgetMax: true,
        deadlineDays: true,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to generate AI requirement brief");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      category: true,
      description: true,
      budgetMin: true,
      budgetMax: true,
      deadlineDays: true,
    });
    setError(null);

    if (hasErrors) {
      setError("Please fix the highlighted errors before submitting your project brief.");
      return;
    }

    const activeCatId = categoryId || categories[0]?.id;
    if (!activeCatId) {
      setError("Please select a project category");
      return;
    }

    const calculatedDeadline = new Date(
      Date.now() + deadlineDays * 24 * 60 * 60 * 1000
    ).toISOString();

    setIsSubmitting(true);
    try {
      const created = await projectsApi.create({
        category_id: activeCatId,
        title: title.trim(),
        description: description.trim(),
        budget_min: budgetMin !== "" ? Number(budgetMin) : undefined,
        budget_max: Number(budgetMax),
        currency_code: "USD",
        deadline: calculatedDeadline,
      });

      navigate(`/projects/${created.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post project brief");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/customer"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs text-indigo-400 font-mono tracking-wider">
            CLIENT PROJECT SPECIFICATION
          </span>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED AI REQUIREMENT ASSISTANT (VOICE & CHAT REQUIREMENT GENERATOR) */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">AI Voice & Smart Brief Copilot</h2>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
                    DEDICATED OPTION
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Speak or type your raw project requirement. The AI will extract the scope, budget, timeline, and fill the form instantly.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Tell us what you want to build or hire for (e.g. 'I need a full-stack engineer to build a React and FastAPI dashboard with Razorpay escrow payments in 3 weeks with a budget of $1200')..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full pl-4 pr-24 py-3 bg-slate-950/80 border border-indigo-500/30 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 resize-none transition"
              />
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`absolute right-3 top-3 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40"
                }`}
                title="Speak your requirement"
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-indigo-400" /> Voice Input
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                You can review and edit all fields below before publishing.
              </span>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiGenerating || !aiPrompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 disabled:opacity-40 transition-all cursor-pointer"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Requirement...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Generate & Smart Fill
                  </>
                )}
              </button>
            </div>

            {aiSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{aiSuccessMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN PROJECT BRIEF FORM WITH STRICT REAL-TIME VALIDATIONS */}
        {/* ========================================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Project Specification & Requirements</h1>
              <p className="text-xs text-slate-400">
                Provide clear project scope to invite proposals from verified global professionals.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Project Title <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">{title.length}/120</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="e.g. Enterprise Microservices Architecture Review & Security Audit"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                  touched.title && errors.title
                    ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
                    : touched.title && !errors.title
                    ? "border-emerald-500/50 focus:border-emerald-500"
                    : "border-slate-800 focus:border-indigo-500"
                }`}
              />
              {touched.title && errors.title && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={categoryId || categories[0]?.id || ""}
                onChange={(e) => setCategoryId(e.target.value)}
                onBlur={() => handleBlur("category")}
                disabled={isLoadingCategories}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.is_regulated ? "(Regulated Services — Verified License Required)" : ""}
                  </option>
                ))}
              </select>
              {selectedCategory?.is_regulated && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    Regulated Category: Bids are restricted to professionals with verified government credentials and approved licenses.
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Detailed Scope of Work & Deliverables <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-[11px] ${
                    description.trim().length < 30 ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  {description.trim().length} chars (min 30)
                </span>
              </div>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Describe project objectives, tech stack, milestones, regulatory constraints, and acceptance criteria in detail..."
                className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none leading-relaxed resize-none transition ${
                  touched.description && errors.description
                    ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50"
                    : touched.description && !errors.description
                    ? "border-emerald-500/50 focus:border-emerald-500"
                    : "border-slate-800 focus:border-indigo-500"
                }`}
              />
              {touched.description && errors.description && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.description}
                </p>
              )}
            </div>

            {/* Suggested Skills Preview */}
            {suggestedSkills.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> AI Recommended Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 text-xs font-mono border border-indigo-500/30"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minimum Budget ($ USD Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g. 200"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    onBlur={() => handleBlur("budgetMin")}
                    className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                      touched.budgetMin && errors.budgetMin
                        ? "border-rose-500"
                        : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {touched.budgetMin && errors.budgetMin && (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.budgetMin}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Maximum Budget ($ USD Required) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min={25}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    onBlur={() => handleBlur("budgetMax")}
                    className={`w-full pl-8 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                      touched.budgetMax && errors.budgetMax
                        ? "border-rose-500"
                        : "border-slate-800 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {touched.budgetMax && errors.budgetMax ? (
                  <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.budgetMax}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    ~ ₹{(Number(budgetMax || 0) * 84).toLocaleString("en-IN")} INR (Milestones settle in INR via Razorpay Escrow)
                  </p>
                )}
              </div>
            </div>

            {/* Expected Completion Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Expected Completion Window (Days) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  onBlur={() => handleBlur("deadlineDays")}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                    touched.deadlineDays && errors.deadlineDays
                      ? "border-rose-500"
                      : "border-slate-800 focus:border-indigo-500"
                  }`}
                />
              </div>
              {touched.deadlineDays && errors.deadlineDays && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.deadlineDays}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Link
                to="/dashboard/customer"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing Brief...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Project Brief
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
