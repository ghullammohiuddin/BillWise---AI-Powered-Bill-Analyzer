import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LargestContributorBadge({ name }: { name: string }) {
  return (
    <Badge variant="alert">
      <Star className="h-3 w-3" aria-hidden="true" />
      {name}
    </Badge>
  );
}
