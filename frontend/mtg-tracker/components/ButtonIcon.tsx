import { Button } from "@headlessui/react"

interface ButtonIconInterface {
  children: React.ReactNode;
  styles?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ButtonIcon({ children, styles, onClick }: ButtonIconInterface) {
  return (
    <Button
      className={`${styles} p-2 rounded hover:cursor-pointer`}
      onClick={onClick}
    >
      { children }
    </Button>
  )
}