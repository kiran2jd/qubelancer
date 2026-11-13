import React, { useState } from "react";
import { proposalsApi } from "../api/marketplace";
import { Proposal } from "../types";
import { X, Send, Loader2, AlertCircle, Clock } from "lucide-react";

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  defaultCurrency?: string;
  onSuccess: (proposal: Proposal) => void;
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  defaultCurrency = "USD",
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number | string>(500);
  const [durationDays, setDurationDays] = useState<number | string>(7);
  const [coverLetter, setCoverLetter] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const errors: Record<string, string | null> = {
    amount:
      amount === ""
        ? "Bid amount is required"
        : Number(amount) < 25
        ? "Minimum bid amount is $25 USD"
        : null,
    durationDays:
      durationDays === ""
        ? "Estimated delivery days are required"
        : Number(durationDays) < 1
        ? "Delivery duration must be at least 1 day"
        : Number(durationDays) > 180
        ? "Delivery duration cannot exceed 180 days"
        : null,
    coverLetter:
      !coverLetter.trim()
        ? "Proposal and strategy pitch is required"
        : coverLetter.trim().length < 30
        ? `Pitch must be at least 30 characters (${coverLetter.trim().length}/30)`
        : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ amount: true, durationDays: true, coverLetter: true });
    setError(null);

    if (hasErrors) {
      setError("Please fix all validation errors before submitting your proposal.");
      return;
    }

    setIsSubmitting(true);
    try {
      const proposal = await proposalsApi.submit({
        project_id: projectId,
        amount: Number(amount),
        currency_code: defaultCurrency,
        estimated_duration_days: Number(durationDays),
        cover_letter: coverLetter.trim(),
      });
      onSuccess(proposal);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Submit Proposal</h3>
            <p className="text-xs text-slate-400 line-clamp-1">
              Project: <span className="text-slate-200">{projectTitle}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Bid Amount ($ USD) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={() => handleBlur("amount")}
                  className={`w-full pl-8 pr-3 py-2 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                    touched.amount && errors.amount
                      ? "border-rose-500"
                      : "border-slate-700 focus:border-indigo-500"
                  }`}
                />
              </div>
              {touched.amount && errors.amount ? (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.amount}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">
                  ~ ₹{(Number(amount || 0) * 84).toLocaleString("en-IN")} INR (Client settles in INR)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimated Delivery (Days) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  onBlur={() => handleBlur("durationDays")}
                  className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                    touched.durationDays && errors.durationDays
                      ? "border-rose-500"
                      : "border-slate-700 focus:border-indigo-500"
                  }`}
                />
              </div>
              {touched.durationDays && errors.durationDays && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.durationDays}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Proposal & Strategy Pitch <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] ${coverLetter.trim().length < 30 ? "text-amber-400" : "text-emerald-400"}`}>
                {coverLetter.trim().length} chars (min 30)
              </span>
            </div>
            <textarea
              rows={5}
              placeholder="Outline your domain expertise, technical approach, proposed delivery milestones, and why you are the ideal consultant for this scope..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              onBlur={() => handleBlur("coverLetter")}
              className={`w-full px-3 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none leading-relaxed resize-none transition ${
                touched.coverLetter && errors.coverLetter
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.coverLetter && errors.coverLetter && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.coverLetter}
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting Bid...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit Bid
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
