import { Button } from "@headlessui/react";

interface ButtonPrimaryProps {
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	children: React.ReactNode;
	style?: "primary" | "secondary" | "transparent" | "danger" | "google";
	type?: "submit" | "button";
	uppercase?: boolean;
	disabled?: boolean;
  styles?: string;
}

interface ButtonStyle {
	color: string;
	hover: string;
	active: string;
	textColor: string;
}

const buttonStyles: { [style: string]: ButtonStyle } = {
	primary: {
		color: "bg-primary-400",
		hover: "data-hover:bg-primary-300",
		active: "data-hover:data-active:bg-primary-500",
		textColor: "text-white",
	},
	secondary: {
		color: "bg-surface-400",
		hover: "data-hover:bg-surface-300",
		active: "data-hover:data-active:bg-surface-400",
		textColor: "text-fg-light",
	},
	transparent: {
		color: "bg-transparent",
		hover:
			"data-hover:text-white",
		active: "",
		textColor: "text-fg",
	},
	danger: {
		color: "bg-transparent",
		hover: "data-hover:bg-error data-hover:text-white",
		active: "data-hover:data-active:brightness-90",
		textColor: "text-error",
	},
	google: {
		color: "bg-surface-400",
		hover: "data-hover:bg-surface-300",
		active: "data-hover:data-active:bg-surface-400",
		textColor: "text-fg-light",
	},
};

export default function ButtonPrimary({
	onClick,
	children,
	style = "primary",
	type = "button",
	uppercase = true,
	disabled = false,
  styles,
}: ButtonPrimaryProps) {
	const { color, hover, active, textColor } = buttonStyles[style];
	// const padding = style === "transparent" ? "py-1 px-0.5" : "p-4 lg:py-3";
  let border = "";
  if (style === "transparent") {
    border = "border border-surface-400"
  }
	const textStyles = uppercase ? "uppercase text-sm" : "text-base";

	return (
		<Button
			type={type}
			className={`${color} ${hover} ${active} ${textColor} ${border} ${textStyles} p-4 lg-py-3 rounded-lg
      ${disabled && "opacity-50"} ${
				style === "danger" && "border border-error/50"
			} my-4 w-full flex justify-center gap-2 items-center ${styles}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</Button>
	);
}
