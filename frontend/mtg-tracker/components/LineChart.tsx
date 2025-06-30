"use client";

import {
	BLUE,
	GREEN,
	RED,
	WHITE,
} from "@/constants/colors";
import { WinLossGameCount } from "@/types/client";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), {
	ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface LineChartInterface {
  buckets: WinLossGameCount[];
}

const initialMonthNames = [
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
];

function formatTimeShort(isoString: string) {
  return dayjs(isoString).format("MMM D");
}

function formatTimeLong(isoString: string) {
  return dayjs(isoString).format("MMM D YYYY");
}

export default function LineChart({ buckets }: LineChartInterface) {
	const [monthNames, setMonthNames] = useState(initialMonthNames);
	useEffect(() => {
		if (window.innerWidth <= 768) {
			setMonthNames([
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D",
			]);
		}
	}, []);

	const lineChartConfig = {
		type: "line",
		series: [
			{
				name: "Played",
				data: buckets.map(b => b.games),
			},
			{
				name: "Win",
				data: buckets.map(b => b.wins),
			},
			{
				name: "Loss",
				data: buckets.map(b => b.losses),
			},
		],
		options: {
			chart: {
				toolbar: {
					show: false,
				},
        floating: true,
        width: "100%",
        zoom: {
          enabled: false,
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
					horizontal: 20,
          vertical: 10,
				},
			},
			colors: [BLUE, GREEN, RED],
			stroke: {
				lineCap: "round",
				curve: "smooth",
        width: 4,
			},
			markers: {
				size: 0,
			},
			xaxis: {
				axisTicks: {
					show: false,
				},
				axisBorder: {
					show: false,
				},
				labels: {
          show: true,
          trim: false,
          hideOverlappingLabels: true,
          offsetY: 0,
          offsetX: 6,
          rotate: 0,
					style: {
						colors: WHITE,
						// fontSize: "0.5em",
						fontFamily: "inherit",
						fontWeight: "inherit",
					},
				},
        overwriteCategories: buckets.map((b, i) => i % 2 == 0 ? `${formatTimeShort(b.periodStart)}` : ""),
        categories: buckets.map((b, i) => i < buckets.length - 1 ? `${formatTimeLong(b.periodStart)} - ${formatTimeLong(b.periodEnd)}` : "Recent"),
        tooltip: {
          enabled: false,
        },
			},
			yaxis: {
				labels: {
					style: {
						colors: WHITE,
						// fontSize: "1em",
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
        enabled: true,
				theme: "dark",
        x: {
          show: true,
        },
			},
		},
	};

	return <Chart {...lineChartConfig} width="100%" height="100%"/>;
}
