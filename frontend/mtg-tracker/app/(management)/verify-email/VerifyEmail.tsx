"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ButtonPrimary from "@/components/ButtonPrimary";
import { api } from "@/generated/client";

export default function VerifyEmail() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);

	useEffect(() => {
		(async function () {
			const id = searchParams.get("id");
			const token = searchParams.get("token");

			if (!id || !token) {
				setStatus("error");
				return;
			}

      try {
        await api.postApiUserverifyEmail(undefined, { queries: { id, token } });
        setStatus("success");
      } catch (error) {
        console.log(error)
        setStatus("error");
      }
		})();
	}, [searchParams, router]);

	return (
		<div className="p-6 bg-gradient-hero text-center w-full flex flex-col justify-center items-center min-h-screen">
			<div className="flex flex-col gap-4 max-w-md text-fg-light">
				{status === "loading" && <p>Verifying your email...</p>}
				{status === "success" && <p>Email verified!</p>}
				{status === "error" && <p>Invalid or expired link.</p>}
				<ButtonPrimary
					onClick={() => router.push("/commandzone")}
					uppercase={false}
					style="transparent"
				>
					Back
				</ButtonPrimary>
			</div>
		</div>
	);
}
