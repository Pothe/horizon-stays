import type { Review } from "@/types/database";

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-ink/60 text-sm">
        No reviews yet. Be the first to stay and share your experience.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-ink/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-brass text-sm">{"★".repeat(review.rating)}</span>
            <span className="text-ink/30 text-sm">{"★".repeat(5 - review.rating)}</span>
            {review.title && (
              <span className="font-medium text-ink text-sm ml-2">{review.title}</span>
            )}
          </div>
          {review.body && <p className="text-sm text-ink/70 mt-2">{review.body}</p>}
          <p className="text-xs text-ink/40 mt-2">
            {new Date(review.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
