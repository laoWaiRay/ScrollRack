import Image from "next/image";
import GithubLogo from "@/public/icons/github.svg";

export default function Footer() {
	return (
		<footer className="px-12 py-12 bg-surface-600 flex justify-between">
			<p className="max-w-[35rem]">
				ScrollRack is unofficial Fan Content permitted under the{" "}
				<a
					href="https://company.wizards.com/en/legal/fancontentpolicy"
					className="link font-normal"
				>
					Fan Content Policy.
				</a>{" "}
				Not approved/endorsed by Wizards. Portions of the materials used are
				property of Wizards of the Coast. ©Wizards of the Coast LLC.
			</p>
			<div className="flex flex-col items-end border-0 border-white">
				<p className="pb-4">
					See more of my stuff on{" "}
					<a href="https://github.com/laoWaiRay" className="link inline-flex">
						GitHub
						<GithubLogo className="ml-2" />
					</a>
				</p>
				<p>
					<a href="https://buymeacoffee.com/laowairay" className="flex mr-[6px] link text-fg">
						Buy me a coffee
						<Image
              className="ml-2 w-[1em] h-[1em]"
							src="/icons/bmc-logo-light.svg"
							alt="Coffee cup"
							width={16}
							height={16}
						/>
					</a>
				</p>
			</div>
		</footer>
	);
}
