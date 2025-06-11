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

interface LineChartInterface {
  height: string;
}

export default function LineChart({ height }: LineChartInterface) {
	const lineChartConfig = {
		type: "line",
		series: [
			{
				name: "Played",
				data: [6, 2, 3, 8, 1, 4, 2, 5, 6, 10, 5, 2],
			},
			{
				name: "Win",
				data: [3, 1, 2, 5, 0, 3, 0, 2, 3, 5, 3, 2],
			},
			{
				name: "Loss",
				data: [3, 1, 1, 3, 1, 1, 2, 3, 3, 5, 2, 0],
			},
		],
		options: {
			chart: {
				toolbar: {
					show: false,
				},
			},
			title: {
				text: "Game History",
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
			legend: {
				show: true,
				labels: {
					colors: WHITE,
				},
        itemMargin: {
          horizontal: 10,
        },
			},
			colors: [BLUE, GREEN, RED],
			stroke: {
				lineCap: "round",
				curve: "smooth",
			},
			markers: {
				size: 0,
			},
			xaxis: {
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: false,
				},
				labels: {
					style: {
						colors: WHITE,
						fontSize: "1em",
						fontFamily: "inherit",
						fontWeight: "inherit",
					},
				},
				categories: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
			},
			yaxis: {
				labels: {
					style: {
						colors: WHITE,
						fontSize: "1em",
						fontFamily: "inherit",
						fontWeight: "inherit",
					},
				},
			},
			grid: {
				show: true,
				borderColor: "#dddddd",
				strokeDashArray: 1,
				xaxis: {
					lines: {
						show: false,
					},
				},
				padding: {
					top: 5,
					right: 20,
				},
			},
			fill: {
				opacity: 0.8,
			},
			tooltip: {
				theme: "dark",
			},
		},
	};

	return <Chart {...lineChartConfig} width={"100%"} height={height} />;
}
