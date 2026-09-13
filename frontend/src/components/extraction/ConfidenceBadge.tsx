import { Badge } from '@/components/ui/badge';

interface ConfidenceBadgeProps {
  confidence: number; // 0-1
}

// Section 3.2: visible but non-alarming — informational, not a verdict. The
// per-field missing/uncertain flags are what actually warns the user.
export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const percent = Math.round(confidence * 100);
  return <Badge variant="neutral">Extraction confidence: {percent}%</Badge>;
}
