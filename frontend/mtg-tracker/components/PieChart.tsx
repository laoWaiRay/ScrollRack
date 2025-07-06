"use client";

import { PIE_CHART_COLORS } from "@/constants/colors";
import { DeckPlayCount } from "@/types/client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Chart = dynamic(() => import("react-apexcharts"), {
	ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface PieChartInterface {
	deckPlayCounts: DeckPlayCount[];
	gamesPlayed: number;
}

export default function PieChart({
	deckPlayCounts,
	gamesPlayed,
}: PieChartInterface) {
	console.log(deckPlayCounts);
	console.log(gamesPlayed);

	function renderTooltip({
		series,
		seriesIndex,
		w,
	}: {
		series: number[];
		seriesIndex: number;
		w: any;
	}) {
		return (
			'<div class="pie_chart_tooltip">' +
			"<div>" +
			w.globals.labels[seriesIndex] +
			"</div>" +
			"<div>" +
			`Played: ${series[seriesIndex]}` +
			"</div>" +
			"<div>" +
			(gamesPlayed > 0
				? `${((series[seriesIndex] / gamesPlayed) * 100).toFixed(1)}% of games`
				: "") +
			"</div>" +
			"</div>"
		);
	}

	const series = useMemo(
		() => deckPlayCounts.map((playCount) => playCount.numGames),
		[deckPlayCounts]
	);

	const options: ApexOptions = useMemo(
		() => ({
			labels: deckPlayCounts.map((playCount) => playCount.commander),
			chart: {
				toolbar: {
					show: false,
				},
				height: "100%",
			},
			title: {
				text: "Decks Played",
				align: "center",
				margin: 15,
				style: {
					fontSize: "16px",
					fontWeight: "normal",
					fontFamily: "inherit",
					color: "#ffffff",
				},
			},
			dataLabels: {
				enabled: false,
			},
			colors: deckPlayCounts.map(
				(playCount, i) => PIE_CHART_COLORS[i % PIE_CHART_COLORS.length]
			),
			tooltip: {
				enabled: true,
				custom: renderTooltip,
			},
			stroke: {
				colors: ["#121212"],
				width: 1,
			},
			legend: {
				show: true,
				position: "bottom",
				labels: {
					colors: "#ffffff",
				},
				markers: {
					offsetX: -2,
				},
				offsetY: 4,
				height: 70,
			},
		}),
		[deckPlayCounts, gamesPlayed]
	);

	return (
		<Chart
      key={gamesPlayed}
			options={options}
			type="donut"
			series={series}
			height="100%"
			width="100%"
		/>
	);
}
