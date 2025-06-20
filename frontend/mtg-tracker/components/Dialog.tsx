"use client";
import {
	Dialog as HeadlessUiDialog,
	DialogPanel,
	DialogTitle,
	Description,
	DialogBackdrop,
	Button,
} from "@headlessui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Close from "@/public/icons/close.svg";
import ButtonIcon from "./ButtonIcon";

interface DialogInterface {
	title: string;
	description: string;
	isDialogOpen: boolean;
	setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
	onConfirm: () => void;
	useCountdown?: boolean;
}

export default function Dialog({
	title,
	description,
	isDialogOpen,
	setIsDialogOpen,
	onConfirm,
	useCountdown = false,
}: DialogInterface) {
	const [isConfirmDisabled, setIsConfirmDisabled] = useState(useCountdown);
	const [countDown, setCountdown] = useState(3);

	useEffect(() => {
		let handle: NodeJS.Timeout | undefined = undefined;

		if (useCountdown && isDialogOpen) {
			handle = setInterval(() => {
				setCountdown((prev) => {
					prev--;
					if (prev <= 0) {
						setIsConfirmDisabled(false);
						if (handle) clearInterval(handle);
					}
					return prev;
				});
			}, 1000);

      return () => {
        setIsConfirmDisabled(true);
        setCountdown(3);
        if (handle) {
          clearInterval(handle);
        }
      }
		}
	}, [isDialogOpen]);

	return (
		<HeadlessUiDialog
			open={isDialogOpen}
			onClose={() => setIsDialogOpen(false)}
			className="relative z-50"
		>
			<DialogBackdrop className="fixed inset-0 bg-black/80" />
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
				<DialogPanel className="max-w-lg space-y-4 border border-surface-500 bg-surface-600 p-8 rounded-lg relative">
					<ButtonIcon styles="border border-fg-dark text-fg-dark absolute inset-y-0 right-0 w-fit h-fit mr-4 mt-4">
						<div
							className="size-[2em] p-1"
							onClick={() => setIsDialogOpen(false)}
						>
							<Close />
						</div>
					</ButtonIcon>
					<DialogTitle className="text-lg">{title}</DialogTitle>
					<Description>{description}</Description>
					<div className="flex gap-4 justify-end">
						<Button
							className="border border-surface-500 rounded-lg p-4 hover:bg-surface-500 hover:text-white"
							onClick={() => setIsDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							className={`bg-error/80 text-white rounded-lg p-4 not-disabled:hover:bg-error disabled:opacity-50 w-24`}
							onClick={() => {
								onConfirm();
								setIsDialogOpen(false);
							}}
							disabled={isConfirmDisabled}
						>
							{isConfirmDisabled ? countDown : "Confirm"}
						</Button>
					</div>
				</DialogPanel>
			</div>
		</HeadlessUiDialog>
	);
}
