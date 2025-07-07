import { getAccessToken } from "@/actions/helpers/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const accessToken = await getAccessToken();

	if (!accessToken) {
		redirect("/login");
	}

  redirect("/commandzone");
}
