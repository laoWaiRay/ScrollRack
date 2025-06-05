import { Button } from "@headlessui/react";

interface ButtonPrimaryProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  style?: 'primary' | 'google';
}

interface ButtonStyle {
  color: string;
  hover: string;
  active: string;
  textColor: string;
}

const buttonStyles: {[style: string]: ButtonStyle} = {
  primary: {
    color: 'bg-primary-500',
    hover: 'data-hover:bg-primary-400',
    active: 'data-hover:data-active:bg-primary-600',
    textColor: 'text-white'    
  },
  google: {
    color: 'bg-surface-500',
    hover: 'data-hover:bg-surface-400',
    active: 'data-hover:data-active:bg-surface-600',
    textColor: 'text-fg-light'
  }
}

export default function ButtonPrimary({ onClick, children, style = 'primary' }: ButtonPrimaryProps) {
  const {color, hover, active, textColor} = buttonStyles[style];

	return (
		<Button
			className={`${color} ${hover} ${active} ${textColor} my-4 p-md rounded font-semibold`}
			onClick={onClick}
		>
      {children}
		</Button>
	);
}