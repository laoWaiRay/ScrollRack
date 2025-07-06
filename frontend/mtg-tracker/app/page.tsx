import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
	const aspNetCoreIdentityCookieName = ".AspNetCore.Identity.Application";
	const cookieStore = await cookies();
	const cookie = cookieStore.get(aspNetCoreIdentityCookieName);

	if (cookie === undefined) {
		redirect("/login");
	}

  redirect("/commandzone");
}
