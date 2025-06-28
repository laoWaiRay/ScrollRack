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
			<main
				id="main-wrapper"
				className={`lg:min-h-screen min-h-dvh ${styles.gridLayout} z-0 relative`}
			>
				{/* Left side of page is the Hero image */}
				<div
					className={`${styles.gridA} flex flex-col justify-center items-center lg:items-end mx-0 lg:mr-20 w-full z-20`}
				>
					<div
						className={`flex flex-col lg:justify-end justify-center items-start lg:items-center lg:mb-16 mt-8`}
					>
						<div className="flex flex-col">
							<div className="flex items-center text-[3.5rem] lg:text-3xl text-white">
								<LogoImage
									title="Scroll with quill writing"
									className="w-[1em] h-[1em] shrink-0"
								/>
								<h2 className="font-dancing-script select-none leading-[1.5em]">
									ScrollRack
								</h2>
							</div>
							<h2 className="font-dancing-script text-[1.6rem] lg:text-xl text-fg select-none">
								the Commander game tracker
							</h2>
						</div>
						<div className="mt-8 w-[30rem] xl:w-[40rem] aspect-[34/25] relative hidden lg:block">
							<Image
								src="/images/Hero.png"
                sizes="(max-width: 768px) 0px, 40rem"
								alt="ScrollRack app dashboard view"
								fill={true}
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
