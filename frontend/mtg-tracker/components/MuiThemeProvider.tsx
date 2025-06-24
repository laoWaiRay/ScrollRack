"use client";

import { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function MuiThemeProvider({
	children,
}: {
	children: ReactNode;
}) {
	return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}