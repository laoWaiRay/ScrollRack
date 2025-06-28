import { Button } from "@headlessui/react"

interface ButtonIconInterface {
  children: React.ReactNode;
  styles?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export default function ButtonIcon({ children, styles, onClick, disabled = false }: ButtonIconInterface) {
  return (
    <Button
      className={`${styles} rounded hover:cursor-pointer disabled:opacity-50`}
      onClick={onClick}
      disabled={disabled}
    >
      { children }
    </Button>
  )
}