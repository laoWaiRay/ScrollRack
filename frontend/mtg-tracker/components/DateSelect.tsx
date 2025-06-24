"use client";

import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";

const MobileDatePicker = dynamic(
	() =>
		import("@mui/x-date-pickers/MobileDatePicker").then(
			(mod) => mod.MobileDatePicker
		),
	{
		ssr: false,
	}
);

interface DateSelectInterface {
	value: PickerValue;
	setValue: Dispatch<SetStateAction<PickerValue>>;
	disabled?: boolean;
  minDate?: dayjs.Dayjs;
}

export default function DateSelect({
	value,
	setValue,
	disabled = false,
  minDate
}: DateSelectInterface) {
	return (
		<div className="w-fit h-fit !text-white">
			<MobileDatePicker
				value={value}
				onChange={(val) => setValue(val)}
				disabled={disabled}
        minDate={minDate}
        maxDate={dayjs()}
			/>
		</div>
	);
}
