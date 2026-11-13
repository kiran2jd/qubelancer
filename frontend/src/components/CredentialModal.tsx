import React, { useState } from "react";
import { professionalsApi } from "../api/professionals";
import { Credential } from "../types";
import { X, Award, Loader2, AlertCircle } from "lucide-react";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credential: Credential) => void;
}

export const CredentialModal: React.FC<CredentialModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [issuingOrg, setIssuingOrg] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const errors: Record<string, string | null> = {
    title:
      !title.trim()
        ? "Credential or license title is required"
        : title.trim().length < 3
        ? "Title must be at least 3 characters"
        : null,
    issuingOrg:
      !issuingOrg.trim()
        ? "Issuing authority / organization is required"
        : issuingOrg.trim().length < 3
        ? "Issuing organization must be at least 3 characters"
        : null,
    credentialId:
      credentialId.trim().length > 0 && credentialId.trim().length < 4
        ? "Credential identifier should be at least 4 characters"
        : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, issuingOrg: true, credentialId: true });
    setError(null);

    if (hasErrors) {
      setError("Please fix errors before submitting the credential.");
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await professionalsApi.submitCredential({
        title: title.trim(),
        issuing_organization: issuingOrg.trim(),
        credential_identifier: credentialId.trim() || undefined,
      });
      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit credential");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Submit Professional Credential</h3>
            <p className="text-xs text-slate-400">
              Submit your license or certification for administrative verification.
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
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Credential / License Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Certified Public Accountant (CPA) or Bar Council of India License"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur("title")}
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition ${
                touched.title && errors.title
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.title && errors.title && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Issuing Organization <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Institute of Chartered Accountants of India (ICAI)"
              value={issuingOrg}
              onChange={(e) => setIssuingOrg(e.target.value)}
              onBlur={() => handleBlur("issuingOrg")}
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition ${
                touched.issuingOrg && errors.issuingOrg
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.issuingOrg && errors.issuingOrg && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.issuingOrg}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              License / Membership Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. ICAI-MEM-849204"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              onBlur={() => handleBlur("credentialId")}
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none transition ${
                touched.credentialId && errors.credentialId
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.credentialId && errors.credentialId && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.credentialId}
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
