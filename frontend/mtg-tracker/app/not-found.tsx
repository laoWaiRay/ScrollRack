import ButtonLink from "@/components/ButtonLink";
import Footer from "@/components/Footer";

export default function NotFound() {
	return (
		<main>
			<div className="flex flex-col">
				<section className="min-h-dvh flex flex-col justify-center items-center bg-gradient-lost-page w-full">
					<div className="p-8 flex flex-col gap-8">
						<h1 className="text-lg">
							<span>
								404 <span className="text-fg-dark">|</span> Plane Not Found
							</span>
						</h1>
						<ButtonLink
							href="/"
							style="transparent"
							styles="border rounded-lg border-surface-400 text-center"
							uppercase={false}
						>
							Back
						</ButtonLink>
					</div>
				</section>
				<Footer />
			</div>
		</main>
	);
}
