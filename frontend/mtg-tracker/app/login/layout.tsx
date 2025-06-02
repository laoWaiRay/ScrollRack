import Footer from "@/components/Footer";
import { ReactNode} from "react"

interface LoginLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="flex flex-col justify-end">
      {children}
      <Footer />
    </div>
  )
}