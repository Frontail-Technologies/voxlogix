"use client";

import { EvilAreaChart } from "@/components/evilcharts/charts/recharts-area-chart";

type UsagePoint = {
  date: string;
  aiLogs: number;
};

type ChartPoint = {
  label: string;
  aiLogs: number;
};

const chartConfig = {
  aiLogs: {
    label: "AI Logs",
    colors: {
      light: ["#F6B719", "#168C97"],
      dark: ["#F7C948", "#27B3BF"],
    },
  },
};

export function MasterUsageChart({
  points,
  isLoading = false,
}: {
  points: UsagePoint[];
  isLoading?: boolean;
}) {
  const data = normalizePoints(points);

  return (
    <EvilAreaChart
      data={data}
      config={chartConfig}
      curveType="monotone"
      animationType="left-to-right"
      isLoading={isLoading}
      loadingPoints={7}
      className="h-56 aspect-auto sm:h-72"
      chartProps={{ margin: { top: 16, right: 14, bottom: 4, left: 4 } }}
    >
      <EvilAreaChart.Grid strokeDasharray="4 4" />
      <EvilAreaChart.XAxis
        dataKey="label"
        tickMargin={10}
        interval="preserveStartEnd"
      />
      <EvilAreaChart.YAxis width={36} allowDecimals={false} />
      <EvilAreaChart.Tooltip variant="frosted-glass" roundness="xl" />
      <EvilAreaChart.Area
        dataKey="aiLogs"
        variant="gradient"
        strokeVariant="solid"
        strokeWidth={2}
      >
        <EvilAreaChart.Dot variant="default" />
        <EvilAreaChart.ActiveDot variant="border" />
      </EvilAreaChart.Area>
    </EvilAreaChart>
  );
}

function normalizePoints(points: UsagePoint[]): ChartPoint[] {
  if (points.length > 0) {
    return points.map((point) => ({
      label: formatChartDate(point.date),
      aiLogs: point.aiLogs,
    }));
  }

  return Array.from({ length: 7 }, (_, index) => ({
    label: `Day ${index + 1}`,
    aiLogs: 0,
  }));
}

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
