export function formatTime(
	seconds: number,
	formatStyle: "normal" | "hms" = "normal"
) {
	const hr = Math.floor(seconds / 3600);
	const min = Math.floor((seconds % 3600) / 60);
	const sec = Math.floor(seconds % 60);

	switch (formatStyle) {
		case "hms":
      if (hr > 0) {
        return `${hr}h ${min}m ${sec}s`;
      } else if (min > 0) {
        return `${min}m ${sec}s`;
      } else {
        return `${sec}s`;
      }
		default:
			const hours = hr.toString().padStart(2, "0");
			const minutes = min.toString().padStart(2, "0");
			const secs = sec.toString().padStart(2, "0");
			return `${hours}:${minutes}:${secs}`;
	}
}

// SSR-safe date formatting to avoid hydration issues when using Date.toLocaleDateString()
export function IsoToDateString(iso: string) {
  const date = new Date(iso);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}