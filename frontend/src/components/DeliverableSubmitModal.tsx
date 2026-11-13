import React, { useState } from "react";
import { contractsApi } from "../api/marketplace";
import { Contract } from "../types";
import { X, CheckCircle2, Loader2, AlertCircle, FileCheck, Link as LinkIcon } from "lucide-react";

interface DeliverableSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  milestoneId: string;
  milestoneTitle: string;
  onSuccess: (updatedContract: Contract) => void;
}

export const DeliverableSubmitModal: React.FC<DeliverableSubmitModalProps> = ({
  isOpen,
  onClose,
  contractId,
  milestoneId,
  milestoneTitle,
  onSuccess,
}) => {
  const [notes, setNotes] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  const errors: Record<string, string | null> = {
    notes:
      !notes.trim()
        ? "Deliverable summary is required"
        : notes.trim().length < 20
        ? `Please provide more detail (${notes.trim().length}/20 chars min)`
        : null,
    assetUrl:
      assetUrl.trim().length > 0 && !urlRegex.test(assetUrl.trim())
        ? "Please enter a valid link URL (e.g. https://github.com/... or https://drive.google.com/...)"
        : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ notes: true, assetUrl: true });
    setError(null);

    if (hasErrors) {
      setError("Please resolve the validation errors before submitting deliverables.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDeliverableNotes = assetUrl.trim()
        ? `${notes.trim()}\n\n🔗 Deliverable Resource Link: ${assetUrl.trim()}`
        : notes.trim();

      const updated = await contractsApi.submitMilestoneDeliverable(
        contractId,
        milestoneId,
        fullDeliverableNotes
      );
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit deliverable");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Submit Milestone Deliverables</h3>
            <p className="text-xs text-slate-400 line-clamp-1">
              Milestone: <span className="text-slate-200 font-semibold">{milestoneTitle}</span>
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Deliverable Summary & Access Instructions <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] ${notes.trim().length < 20 ? "text-amber-400" : "text-emerald-400"}`}>
                {notes.trim().length} chars (min 20)
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Detail the completed work, staging links, documentation, test reports, or verification instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => handleBlur("notes")}
              className={`w-full px-3 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none leading-relaxed resize-none transition ${
                touched.notes && errors.notes
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.notes && errors.notes && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.notes}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Repository / Cloud Drive Link (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="url"
                placeholder="https://github.com/org/repo or https://drive.google.com/..."
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                onBlur={() => handleBlur("assetUrl")}
                className={`w-full pl-9 pr-3 py-2 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                  touched.assetUrl && errors.assetUrl
                    ? "border-rose-500"
                    : "border-slate-700 focus:border-indigo-500"
                }`}
              />
            </div>
            {touched.assetUrl && errors.assetUrl && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.assetUrl}
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
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submit for Approval
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
