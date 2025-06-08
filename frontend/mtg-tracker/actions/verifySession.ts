"use server"

import { api } from "@/generated/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verifySession() {
	const aspNetCoreIdentityCookieName = ".AspNetCore.Identity.Application";
	const cookieStore = await cookies();
	const cookie = cookieStore.get(aspNetCoreIdentityCookieName);

	if (cookie === undefined) {
		redirect("/login");
	}

	let user = null;

	try {
		user = await api.getApiUseridentity({
			headers: {
				cookie: `${aspNetCoreIdentityCookieName}=${cookie.value}`,
			},
		});
	} catch (error) {
		console.log(JSON.stringify(error));
    redirect("/login");
	}
  
  if (user == null) {
    redirect("/login");
  }
  
  return user;
}
