"use client"
import { ToastContainer, Slide } from "react-toastify";

export default function ToastDynamic() {
	return (
		<ToastContainer
			position="top-left"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick={false}
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme="dark"
			transition={Slide}
		/>
	);
}