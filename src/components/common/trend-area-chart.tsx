"use client";

import { EvilAreaChart } from "@/components/evilcharts/charts/recharts-area-chart";

type TrendPoint = {
  label: string;
  value: number;
};

const trendChartConfig = {
  value: {
    label: "Value",
    colors: {
      light: ["#F6B719", "#168C97"],
      dark: ["#F7C948", "#27B3BF"],
    },
  },
};

export function TrendAreaChart({
  points,
  isLoading = false,
}: {
  points: TrendPoint[];
  isLoading?: boolean;
}) {
  const data = points.length ? points : fallbackPoints();

  return (
    <EvilAreaChart
      data={data}
      config={trendChartConfig}
      curveType="monotone"
      animationType="left-to-right"
      isLoading={isLoading}
      loadingPoints={7}
      className="h-56 aspect-auto sm:h-72"
      chartProps={{ margin: { top: 16, right: 14, bottom: 4, left: 4 } }}
    >
      <EvilAreaChart.Grid strokeDasharray="4 4" />
      <EvilAreaChart.XAxis dataKey="label" tickMargin={10} interval="preserveStartEnd" />
      <EvilAreaChart.YAxis width={36} allowDecimals={false} />
      <EvilAreaChart.Tooltip variant="frosted-glass" roundness="xl" />
      <EvilAreaChart.Area
        dataKey="value"
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

function fallbackPoints() {
  return Array.from({ length: 7 }, (_, index) => ({
    label: `Day ${index + 1}`,
    value: 0,
  }));
}
