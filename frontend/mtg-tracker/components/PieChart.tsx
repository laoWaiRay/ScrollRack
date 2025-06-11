"use client";

import {
	BLACK,
	BLUE,
	BLUE2,
	BLUE3,
	BLUE5,
	GREEN,
	GREEN2,
	GREEN3,
	GREEN5,
	RED,
	RED2,
	RED3,
	RED5,
	WHITE,
} from "@/constants/colors";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
	ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface PieChartInterface {
  height: string;
}

export default function PieChart({ height }: PieChartInterface) {
	const pieChartConfig = {
		type: "donut",
		series: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		options: {
			labels: [
				"Sheoldred",
				"Atraxa",
				"Jin-Gitaxias",
				"Urabrask",
				"Vorinclex",
				"Urza, Lord High Artificer",
				"Wilson, Refined Grizzly",
				"Traxos, Scourge of Kroog",
				"The Prismatic Bridge",
				"Mr. House",
				"Chun Li",
				"Jon Irenicus",
			],
			chart: {
				toolbar: {
					show: false,
				},
			},
			title: {
				text: "Decks Played",
				align: "center",
				style: {
					fontSize: "16px",
					fontWeight: "normal",
					fontFamily: "inherit",
					color: WHITE,
				},
			},
			dataLabels: {
				enabled: false,
			},
			colors: [BLACK, WHITE, BLUE, RED, BLUE, GREEN, WHITE, WHITE, WHITE],
			tooltip: {
				enabled: true,
				custom: function ({
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
						`${80}% of games` +
						"</div>" +
						"</div>"
					);
				},
			},
			stroke: {
				colors: ["#121212"],
				width: 1,
			},
			legend: {
				show: true,
				position: "bottom",
				labels: {
					colors: WHITE,
				},
				offsetY: 2,
        height: 70
			},
		},
	};

	return <Chart {...pieChartConfig} width={"100%"} height={height} />;
}
