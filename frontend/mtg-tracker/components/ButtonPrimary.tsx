import { Button } from "@headlessui/react";

interface ButtonPrimaryProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  style?: 'primary' | 'secondary' | 'transparent' | 'google';
  type?: "submit" | "button";
  uppercase?: boolean;
}

interface ButtonStyle {
  color: string;
  hover: string;
  active: string;
  textColor: string;
}

const buttonStyles: {[style: string]: ButtonStyle} = {
  primary: {
    color: 'bg-primary-400',
    hover: 'data-hover:bg-primary-300',
    active: 'data-hover:data-active:bg-primary-500',
    textColor: 'text-white'    
  },
  secondary: {
    color: 'bg-surface-400',
    hover: 'data-hover:bg-surface-300',
    active: 'data-hover:data-active:bg-surface-400',
    textColor: 'text-fg-light'    
  },
  transparent: {
    color: 'bg-transparent',
    hover: 'data-hover:border-b data-hover:border-inherit data-hover:cursor-pointer',
    active: '',
    textColor: 'text-fg-light',
  },
  google: {
    color: 'bg-surface-400',
    hover: 'data-hover:bg-surface-300',
    active: 'data-hover:data-active:bg-surface-400',
    textColor: 'text-fg-light'
  }
}

export default function ButtonPrimary({ onClick, children, style = 'primary', type = "button", uppercase = true }: ButtonPrimaryProps) {
  const {color, hover, active, textColor} = buttonStyles[style];
  const padding = style === "transparent" ? "py-1 px-0.5" : "p-4 lg:py-3";
  const border = style === "transparent" ? "" : "rounded";
  const textStyles = uppercase ? "uppercase text-sm" : "text-base";
  
	return (
		<Button
      type={type}
			className={`${color} ${hover} ${active} ${textColor} ${padding} ${border} ${textStyles} my-4 w-full flex justify-center gap-2 items-center`}
			onClick={onClick}
		>
      {children}
		</Button>
	);
}