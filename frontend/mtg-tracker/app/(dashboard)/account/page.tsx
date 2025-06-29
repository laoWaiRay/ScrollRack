"use server";

import { getUserWithEmail } from "@/actions/getUserWithEmail";
import Account from "./Account";

export default async function page() {
	const userWithEmail = await getUserWithEmail();

	return (
		<Account
			userEmail={userWithEmail?.email ?? ""}
			emailConfirmed={userWithEmail?.emailConfirmed ?? false}
		/>
	);
}
