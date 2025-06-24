"use client"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactNode } from "react";

export default function DatePickerProvider({ children }: { children: ReactNode}) {
  return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
      {children}      
    </LocalizationProvider>
  )
}