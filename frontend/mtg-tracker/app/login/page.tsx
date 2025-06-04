"use client";
import Image from "next/image";
import { Input, Field, Label } from "@headlessui/react";
import TextInput from "@/components/TextInput";
import { useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const colors = [
		"bg-blue-900",
		"bg-teal-900",
		"bg-lime-900",
		"bg-cyan-900",
		"bg-sky-900",
		"bg-orange-900",
		"bg-red-900",
		"bg-emerald-900",
		"bg-violet-900",
		"bg-purple-900",
		"bg-rose-900",
		"bg-yellow-900",
	];

	return (
		<>
			{/* Left side - Hero */}
			<div className="flex flex-col col-start-1 col-end-7 justify-center items-center">
				<div className="flex flex-col col-start-1 col-end-7 justify-center items-center mb-16">
					<h2 className="font-dancing-script text-2xl">ScrollRack</h2>
					<h2 className="font-dancing-script text-lg text-fg-light">
						the Commander game tracker
					</h2>
					<div className="mt-8">
						<Image
							src="/images/Hero.png"
							alt="ScrollRack app dashboard view"
							width={542}
							height={399}
						/>
					</div>
				</div>
			</div>

			{/* Right side - Login Interface */}
			<div className="flex flex-col col-start-7 col-end-13 justify-center items-center">
				<div className="flex flex-col justify-center border border-white px-12 py-12">
					<h1 className="text-lg mb-4 text-fg-light">Log in to your account</h1>
					<TextInput
						name="email"
						label="Email"
						value={email}
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextInput
            type="password"
						name="password"
						label="Password"
						value={password}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</div>
		</>

		// <>
		//   {
		//     colors.map(c => <div className={c} key={c}></div>)
		//   }
		// </>
	);
}
