"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@headlessui/react";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import OptionsLayout from "@/components/OptionsLayout";

export default function Account() {
	const { user } = useAuth();
	const [enabled, setEnabled] = useState(false);

	return (
		<OptionsLayout title="Account">
				<h2 className="mb-6 self-center">EDIT PROFILE</h2>
        TODO: Refactor form into a useForm hook
		</OptionsLayout>
	);
}
