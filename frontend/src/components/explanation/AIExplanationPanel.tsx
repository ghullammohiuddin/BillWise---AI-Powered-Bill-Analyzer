import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIExplanationPanelProps {
  explanation: string;
  /**
   * Section 3.6: "if backend flags low-confidence data, show a small
   * disclaimer". Left optional and unset by the Comparison page today —
   * `confidence` only exists on the extraction response (Section 5), it's
   * not part of the persisted Bill or the comparison response, so there's
   * currently no data source for this at comparison-view time. Wire this up
   * if/when that field gets added to GET /bills/:id or the comparison
   * response.
   */
  lowConfidence?: boolean;
}

export function AIExplanationPanel({
  explanation,
  lowConfidence,
}: AIExplanationPanelProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex-row items-center gap-space-xs space-y-0">
        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        <CardTitle>What changed, in plain language</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body-lg text-ink">{explanation}</p>
        {lowConfidence && (
          <p className="mt-space-sm text-body-sm text-ink-muted">
            Some values in this bill were uncertain — see flagged fields on the
            bill detail page.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
