import { getRefreshToken } from "@/actions/helpers/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const refreshToken = await getRefreshToken();

	if (!refreshToken) {
		redirect("/login");
	}

  redirect("/commandzone");
}
