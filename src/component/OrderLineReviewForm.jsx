import { useState } from "react";
import { toast } from "react-toastify";
import { submitOrderReview } from "../api/medusa/store";

function StarPicker({ value, onChange, disabled }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className={`text-2xl transition ${
            star <= value ? "text-amber-500" : "text-gray-300"
          }`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function OrderLineReviewForm({ orderId, line, existingReview, onSubmitted }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [busy, setBusy] = useState(false);

  if (existingReview) {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm">
        <p className="font-semibold text-green-900">Your review</p>
        <p className="mt-1 text-amber-600">{"★".repeat(existingReview.rating)}</p>
        <p className="mt-2 text-gray-700">{existingReview.comment}</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.info("Please select a star rating");
      return;
    }
    setBusy(true);
    try {
      const { review } = await submitOrderReview(orderId, {
        product_id: line.product_id,
        rating,
        comment,
      });
      toast.success("Thank you for your review!");
      onSubmitted?.(review);
    } catch (err) {
      toast.error(err?.message || "Could not submit review");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-green-100 bg-[#f7fbf4] p-4"
    >
      <p className="text-sm font-semibold text-gray-950">Review this item</p>
      <div className="mt-2">
        <StarPicker value={rating} onChange={setRating} disabled={busy} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="What did you like about this product?"
        className="mt-3 w-full rounded-xl border border-green-100 px-3 py-2 text-sm outline-none focus:border-green-700"
      />
      <button
        type="submit"
        disabled={busy}
        className="mt-3 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-950 disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
