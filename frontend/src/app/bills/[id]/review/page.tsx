import { redirect } from 'next/navigation';

/**
 * The Extraction Review screen (Section 3.2) happens BEFORE a bill is
 * saved — at that point there's no bill `id` yet, since Section 5's upload
 * flow only returns one from the final `POST /bills` call. So this
 * scaffolded `[id]/review` route can't host that screen; the real review
 * step lives in the /upload flow instead (see ExtractionForm, rendered from
 * useUploadBill's 'review' step). This route is kept only so a stray link
 * to it doesn't 404 — it just forwards to the bill's detail page.
 */
export default function BillReviewRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/bills/${params.id}`);
}
