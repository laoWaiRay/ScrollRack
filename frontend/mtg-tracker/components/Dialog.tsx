import {
	Dialog as HeadlessUiDialog,
	DialogPanel,
	DialogTitle,
	Description,
  DialogBackdrop,
  Button,
} from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

interface DialogInterface {
	title: string;
	description: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
}

export default function Dialog({ title, description, isDialogOpen, setIsDialogOpen, onConfirm}: DialogInterface) {
	return (
		<HeadlessUiDialog
			open={isDialogOpen}
			onClose={() => setIsDialogOpen(false)}
			className="relative z-50"
		>
			<DialogBackdrop className="fixed inset-0 bg-black/80" />
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
				<DialogPanel className="max-w-lg space-y-4 border border-surface-500 bg-surface-600 p-8 rounded-lg">
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
							className="border border-surface-500 rounded-lg p-4 hover:bg-surface-500 hover:text-white"
							onClick={() => {onConfirm(); setIsDialogOpen(false);}}
						>
							Confirm
						</Button>
					</div>
				</DialogPanel>
			</div>
		</HeadlessUiDialog>
	);
}
