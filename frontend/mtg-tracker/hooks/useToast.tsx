import { Slide, ToastOptions, toast as toasty } from "react-toastify";

export default function useToast() {
  const toastOptions: ToastOptions = {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
			transition: Slide,
		};

	const toast = (message: string, type: "success" | "error" | "warn" | "default") => {
    switch (type) {
      case "success":
        toasty.success(message, toastOptions);
        break;
      case "warn":
        toasty.warn(message, toastOptions);
        break;
      case "error":
        toasty.error(message, toastOptions);
        break;
      default:
        toasty(message, toastOptions);
        break;
    }
  }
    

	return { toast };
}
