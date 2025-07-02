"use server";

import { getUserWithEmail } from "@/actions/getUserWithEmail";
import Account from "./Account";
import { extractAuthResult } from "@/helpers/extractAuthResult";

export default async function page() {
  const authResult = await getUserWithEmail();
	const userWithEmail = extractAuthResult(authResult);

	return (
		<Account
			userEmail={userWithEmail?.email ?? ""}
			emailConfirmed={userWithEmail?.emailConfirmed ?? false}
		/>
	);
}
