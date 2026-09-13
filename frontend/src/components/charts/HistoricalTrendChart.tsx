'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPKR } from '@/lib/utils/formatCurrency';
import { formatBillingMonth } from '@/lib/utils/formatDate';
import type { BillListItem } from '@/lib/types/bill';

interface HistoricalTrendChartProps {
  bills: BillListItem[];
}

interface ChartPoint {
  label: string;
  totalAmount: number;
  units: number;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-surface p-space-sm shadow-card">
      <p className="text-body-sm text-ink-muted">{point.label}</p>
      <p className="text-body-md font-medium text-ink">
        {formatPKR(point.totalAmount)}
      </p>
      <p className="text-body-sm text-ink-muted">
        {point.units.toLocaleString('en-US')} kWh
      </p>
    </div>
  );
}

// Section 3.8: total amount over time, chronological, with an optional
// secondary line for units. Reuses the same GET /bills list as the
// Dashboard — no separate trend endpoint exists in the contract.
export function HistoricalTrendChart({ bills }: HistoricalTrendChartProps) {
  const data: ChartPoint[] = [...bills]
    .sort((a, b) => (a.billingMonth > b.billingMonth ? 1 : -1))
    .map((bill) => ({
      label: formatBillingMonth(bill.billingMonth),
      totalAmount: bill.totalAmount,
      units: bill.units,
    }));

  return (
    <div className="h-72 w-full rounded-lg border border-border bg-surface p-space-md">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#475569' }} />
          <YAxis
            yAxisId="amount"
            tick={{ fontSize: 12, fill: '#475569' }}
            tickFormatter={(value: number) => value.toLocaleString('en-US')}
          />
          <YAxis
            yAxisId="units"
            orientation="right"
            tick={{ fontSize: 12, fill: '#475569' }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            yAxisId="amount"
            type="monotone"
            dataKey="totalAmount"
            name="Total (PKR)"
            stroke="#0B5351"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="units"
            type="monotone"
            dataKey="units"
            name="Units (kWh)"
            stroke="#2A9D8F"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
