"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";

export default function HomePage() {
	const router = useRouter();
	const { user, dispatch } = useAuth();
  const { logoutAsync } = useLogout();

	return (
		<main>
			<section className="bg-surface-600">Main Content</section>
			<div className="p-12 bg-surface-500">
				<div className="flex gap-4">
					<Link className="block p-6 bg-surface-300" href="/login">
						/login
					</Link>
					<Link className="block p-6 bg-surface-300" href="/register">
						/register
					</Link>
					<Link className="block p-6 bg-surface-300" href="/commandzone">
						/commandzone
					</Link>
				</div>

				<p className="text-fg-light">Light Text</p>
				<p className="text-fg">Normal Text</p>
				<p className="text-fg-dark">Dark Text</p>

				<h2>Primary Colors</h2>
				<div className="flex">
					<div className="p-6 bg-primary-100">100</div>
					<div className="p-6 bg-primary-200">200</div>
					<div className="p-6 bg-primary-300">300</div>
					<div className="p-6 bg-primary-400">400</div>
					<div className="p-6 bg-primary-500">500</div>
					<div className="p-6 bg-primary-600">600</div>
				</div>

				<h2>Surface Colors</h2>
				<div className="flex">
					<div className="p-6 bg-surface-100">100</div>
					<div className="p-6 bg-surface-200">200</div>
					<div className="p-6 bg-surface-300">300</div>
					<div className="p-6 bg-surface-400">400</div>
					<div className="p-6 bg-surface-500">500</div>
					<div className="p-6 bg-surface-600">600</div>
				</div>

				<h2>Special Colors</h2>
				<div className="flex">
					<div className="p-6 bg-error">Error</div>
				</div>

				{/* <h2>Font Sizes</h2>
        <p className="text-small">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam enim sed dolorum earum nisi expedita est delectus, esse ipsa exercitationem ducimus commodi ipsum laboriosam eveniet magni. Molestias dolore corporis ipsum.</p>
        <p className="text-base">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio harum beatae odit voluptatum consectetur rem, deleniti impedit, doloribus commodi obcaecati possimus esse, fuga praesentium libero voluptates ut consequuntur officia dolores.</p>
        <p className="text-lg">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perferendis dolorum, delectus qui, quisquam fugit itaque voluptate dolor a architecto molestiae magni omnis similique officia ad alias nesciunt laboriosam in maxime?</p>
        <p className="text-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero officiis nemo quos commodi autem veniam culpa, eius minus tempore iure quis, numquam ipsam similique sit. Blanditiis odit consectetur quae vero!</p>
        <p className="text-2xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas accusantium praesentium doloribus quos voluptatibus officia sapiente cumque minima ducimus, placeat officiis vel nesciunt, doloremque iusto dolore at mollitia non. Illum.</p>
        <p className="text-3xl">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laboriosam corrupti, quia temporibus culpa ullam aspernatur rem consequatur laborum id quos maxime atque praesentium voluptatem odit doloribus fugiat nobis exercitationem repudiandae.</p> */}

				<h1 className="text-lg">Test the API!</h1>
				<button className="text-lg p-3 bg-surface-400" onClick={async () => await logoutAsync()}>
					Logout
				</button>

				<h1 className="text-lg">Client Auth Context</h1>
				<p>{user ? JSON.stringify(user) : "No auth"}</p>
			</div>
		</main>
	);
}
