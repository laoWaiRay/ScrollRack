import Link from "next/link"

interface SidebarLink {
  children: React.ReactNode;
  href: string;
}


export default function SidebarLink({ children, href }: SidebarLink) {
  return (
    <Link href={href} className="flex items-center justify-start p-md rounded text-fg-light hover:bg-surface-400">
      <span className="ml-3 flex items-center justify-start">
        {children}
      </span>
    </Link>
  )
}