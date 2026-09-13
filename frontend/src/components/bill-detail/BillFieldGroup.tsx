import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Field {
  label: string;
  value: string;
  isMissing?: boolean;
}

interface BillFieldGroupProps {
  title: string;
  fields: Field[];
}

export function BillFieldGroup({ title, fields }: BillFieldGroupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-space-sm sm:grid-cols-3">
        {fields.map(({ label, value, isMissing }) => (
          <div key={label}>
            <p className="text-body-sm text-ink-muted">{label}</p>
            <p
              className={
                isMissing
                  ? 'text-body-md italic text-ink-muted'
                  : 'text-body-md tabular-nums text-ink'
              }
            >
              {value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
