import { Button } from "@headlessui/react";

interface ButtonPrimaryProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  style?: 'primary' | 'secondary' | 'google';
  type?: "submit" | "button";
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
    active: 'data-hover:data-active:bg-primary-400',
    textColor: 'text-white'    
  },
  secondary: {
    color: 'bg-surface-400',
    hover: 'data-hover:bg-surface-300',
    active: 'data-hover:data-active:bg-surface-400',
    textColor: 'text-fg-light'    
  },
  google: {
    color: 'bg-surface-400',
    hover: 'data-hover:bg-surface-300',
    active: 'data-hover:data-active:bg-surface-400',
    textColor: 'text-fg-light'
  }
}

export default function ButtonPrimary({ onClick, children, style = 'primary', type = "button" }: ButtonPrimaryProps) {
  const {color, hover, active, textColor} = buttonStyles[style];

	return (
		<Button
      type={type}
			className={`${color} ${hover} ${active} ${textColor} my-4 py-4 px-4 lg:py-2 rounded font-semibold w-full`}
			onClick={onClick}
		>
      {children}
		</Button>
	);
}