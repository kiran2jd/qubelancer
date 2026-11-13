import React, { useState } from "react";
import { professionalsApi } from "../api/professionals";
import { Category, ServiceItem } from "../types";
import { X, Briefcase, Loader2, AlertCircle } from "lucide-react";

interface ServiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: (service: ServiceItem) => void;
  defaultCurrency?: string;
  isVerified?: boolean;
}

export const ServiceCreateModal: React.FC<ServiceCreateModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSuccess,
  defaultCurrency = "USD",
  isVerified = false,
}) => {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState<"fixed" | "hourly">("fixed");
  const [basePrice, setBasePrice] = useState<number | string>(150);
  const [deliveryDays, setDeliveryDays] = useState<number | string>(3);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const errors: Record<string, string | null> = {
    title:
      !title.trim()
        ? "Service title is required"
        : title.trim().length < 8
        ? "Title must be at least 8 characters"
        : title.trim().length > 100
        ? "Title cannot exceed 100 characters"
        : null,
    description:
      !description.trim()
        ? "Scope & deliverables description is required"
        : description.trim().length < 25
        ? `Description must be at least 25 characters (${description.trim().length}/25)`
        : null,
    basePrice:
      basePrice === ""
        ? "Price is required"
        : Number(basePrice) < 10
        ? "Minimum price is $10 USD"
        : null,
    deliveryDays:
      deliveryDays === ""
        ? "Delivery days are required"
        : Number(deliveryDays) < 1
        ? "Delivery must take at least 1 day"
        : Number(deliveryDays) > 90
        ? "Delivery cannot exceed 90 days"
        : null,
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const hasErrors = Object.values(errors).some((err) => err !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, basePrice: true, deliveryDays: true });
    setError(null);

    if (hasErrors) {
      setError("Please fix the errors before creating this service package.");
      return;
    }

    if (selectedCategory?.is_regulated && !isVerified) {
      setError(
        `Category "${selectedCategory.name}" is regulated. Your professional profile must be verified by administrators before publishing services in this category.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await professionalsApi.createService({
        category_id: categoryId || categories[0]?.id,
        title: title.trim(),
        description: description.trim(),
        price_type: priceType,
        base_price: Number(basePrice),
        currency_code: defaultCurrency,
        delivery_days: Number(deliveryDays),
      });
      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create service listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Publish New Service Offering</h3>
            <p className="text-xs text-slate-400">
              Showcase a packaged consultation or fixed deliverable to prospective clients.
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
              Primary Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.is_regulated ? "(Regulated — Verification Required)" : ""}
                </option>
              ))}
            </select>
            {selectedCategory?.is_regulated && (
              <p className="mt-1 text-[11px] text-amber-400">
                ⚠️ Regulated profession: Requires verified license credentials.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Service Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Full-Stack Web Application Architecture Audit"
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Scope & Deliverables <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] ${description.trim().length < 25 ? "text-amber-400" : "text-emerald-400"}`}>
                {description.trim().length} chars (min 25)
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Describe what is included in this service package..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur("description")}
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none resize-none transition ${
                touched.description && errors.description
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.description && errors.description && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Pricing Structure
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as "fixed" | "hourly")}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Price ({defaultCurrency === "USD" ? "$ USD" : defaultCurrency}) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-sm font-semibold">
                  {defaultCurrency === "USD" ? "$" : "₹"}
                </span>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  onBlur={() => handleBlur("basePrice")}
                  className={`w-full pl-7 pr-3 py-2 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                    touched.basePrice && errors.basePrice
                      ? "border-rose-500"
                      : "border-slate-700 focus:border-indigo-500"
                  }`}
                />
              </div>
              {touched.basePrice && errors.basePrice ? (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.basePrice}
                </p>
              ) : (
                defaultCurrency === "USD" && Number(basePrice) > 0 && (
                  <span className="text-[11px] text-amber-400 mt-1 block font-medium">
                    ~ ₹{(Number(basePrice) * 84).toLocaleString("en-IN")} INR settlement
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Estimated Delivery Time (Days) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              onBlur={() => handleBlur("deliveryDays")}
              className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-white text-sm focus:outline-none transition ${
                touched.deliveryDays && errors.deliveryDays
                  ? "border-rose-500"
                  : "border-slate-700 focus:border-indigo-500"
              }`}
            />
            {touched.deliveryDays && errors.deliveryDays && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {errors.deliveryDays}
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
              Publish Offering
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
