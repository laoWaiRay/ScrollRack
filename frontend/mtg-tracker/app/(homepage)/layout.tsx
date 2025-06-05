import styles from "./styles.module.css";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import Image from "next/image";
import LogoImage from "@/public/icons/scroll.svg";

interface LoginLayoutProps {
	children: ReactNode;
}

export default function HomepageLayout({ children }: LoginLayoutProps) {
	return (
		<div className="bg-gradient-hero">
			<main id="main-wrapper" className={`min-h-dvh ${styles.gridLayout}`}>
      
        {/* Left side of page is the Hero image */}
				<div
					className={`${styles.gridA} flex flex-col justify-center items-end mx-12`}
				>
					<div
						className={`flex flex-col justify-center items-center mb-16 mt-12`}
					>
						<div className="flex flex-col">
							<div className="flex items-center">
                <LogoImage title="Scroll with quill writing" className="text-white" />
								<h2 className="font-dancing-script text-3xl text-white">
									ScrollRack
								</h2>
							</div>
							<h2 className="font-dancing-script text-xl text-fg">
								the Commander game tracker
							</h2>
						</div>
						<div className="mt-8">
							<Image
								src="/images/Hero.png"
								alt="ScrollRack app dashboard view"
								width={542}
								height={399}
                priority={true}
							/>
						</div>
					</div>
				</div>
        
        {/* Right side of page is either Login or Register */}
				{children}
			</main>
			<Footer />
		</div>
	);
}
