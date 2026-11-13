import React, { useState } from "react";
import { reviewsApi } from "../api/marketplace";
import { Review } from "../types";
import { X, Star, Loader2, AlertCircle, MessageSquare } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  counterpartName: string;
  onSuccess: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  contractId,
  counterpartName,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const errors: Record<string, string | null> = {
    rating: !rating || rating < 1 || rating > 5 ? "Please select a rating from 1 to 5 stars" : null,
    comment:
      !comment.trim()
        ? "Written evaluation feedback is required"
        : comment.trim().length < 10
        ? `Feedback must be at least 10 characters (${comment.trim().length}/10)`
        : comment.trim().length > 1000
        ? "Feedback cannot exceed 1000 characters"
        : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ rating: true, comment: true });
    setError(null);

    if (hasErrors) {
      setError("Please complete the required review fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const review = await reviewsApi.submit({
        contract_id: contractId,
        rating,
        comment: comment.trim(),
      });
      onSuccess(review);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
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
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Performance Review</h3>
            <p className="text-xs text-slate-400">
              Share your feedback for <span className="text-slate-200 font-semibold">{counterpartName}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Star selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Overall Rating <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = (hoverRating ?? rating) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        isFilled
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-600 hover:text-slate-500"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm font-semibold text-slate-200">
                {rating} of 5 Stars
              </span>
            </div>
            {touched.rating && errors.rating && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.rating}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Written Evaluation & Feedback <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] ${comment.trim().length < 10 ? "text-amber-400" : "text-emerald-400"}`}>
                {comment.trim().length} chars (min 10)
              </span>
            </div>
            <div className="relative">
              <textarea
                rows={4}
                placeholder="Describe collaboration quality, punctuality, technical competence, and deliverables..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onBlur={() => handleBlur("comment")}
                className={`w-full px-3 py-2.5 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none leading-relaxed resize-none transition ${
                  touched.comment && errors.comment
                    ? "border-rose-500"
                    : "border-slate-700 focus:border-indigo-500"
                }`}
              />
              <MessageSquare className="absolute right-3 bottom-3 w-4 h-4 text-slate-600 pointer-events-none" />
            </div>
            {touched.comment && errors.comment && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.comment}
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
                  Publishing Review...
                </>
              ) : (
                "Publish Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
