"use client";
import styles from "../styles.module.css";
import TextInput from "@/components/TextInput";
import { useState } from "react";
import GoogleLogo from "@/public/icons/google.svg";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPwHidden, setIsPwHidden] = useState(true);

	return (
		<div
			className={`${styles.gridB} flex flex-col justify-center items-start mx-12`}
		>
			<div className={`flex flex-col justify-center px-12 py-12`}>
				<h1 className="text-lg mb-4 text-fg-light font-semibold select-none">
					Log in to your account
				</h1>
				<TextInput
					name="email"
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextInput
					type="password"
					hidden={isPwHidden}
          toggleHidden={() => setIsPwHidden(!isPwHidden)}
					name="password"
					label="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
        <Link href='/forgot-password' className="self-end text-fg font-normal rounded p-sm">Forgot password?</Link>
				<ButtonPrimary onClick={() => {}}>Log in</ButtonPrimary>
				<div className="text-fg-dark flex justify-center items-center">
					<div className="bg-fg-dark h-[1px] grow mr-4 ml-1" />
					<span className="select-none">OR</span>
					<div className="bg-fg-dark h-[1px] grow ml-4 mr-1" />
				</div>
				<ButtonPrimary onClick={() => {}} style="google">
          <div className="flex items-center justify-center">
            Sign in with Google{" "}
            <GoogleLogo className="ml-2" />
          </div>
				</ButtonPrimary>
				<div className="flex justify-center items-center">
					Don't have an account?{" "}
					<Link href="/register" className="link px-1">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}
