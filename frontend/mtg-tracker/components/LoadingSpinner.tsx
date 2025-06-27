import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner() {
	return (
		<div className="flex w-full justify-center mt-12">
			<CircularProgress color="secondary" />
		</div>
	);
}
