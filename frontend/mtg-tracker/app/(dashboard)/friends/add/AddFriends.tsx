"use client";
import { useAuth } from "@/hooks/useAuth";
import { UserFriendAddDTO, UserReadDTO } from "@/types/client";
import { FormEvent, useEffect, useState } from "react";
import TextInput from "@/components/TextInput";
import ButtonPrimary from "@/components/ButtonPrimary";
import OptionsLayout from "@/components/OptionsLayout";
import { QRCodeSVG } from "qrcode.react";
import { useZxing } from "react-zxing";
import QrCodeScan from "@/public/icons/qrcode-scan.svg";
import { api } from "@/generated/client";
import { getFriends } from "@/actions/friends";
import useToast from "@/hooks/useToast";
import { isAxiosError } from "axios";
import { CONFLICT, NOT_FOUND } from "@/constants/httpStatus";
import { isValidationErrorArray } from "@/helpers/validationHelpers";
import { useFriend } from "@/hooks/useFriend";
import { ActionType } from "@/context/FriendContext";
import UserAdd from "@/public/icons/user-add.svg";

interface AddFriendsInterface {}

interface Person {
	id: string;
	userName: string;
}

const people: Person[] = [
	{ id: "1", userName: "Durward Reynolds" },
	{ id: "2", userName: "Kenton Towne" },
	{ id: "3", userName: "Therese Wunsch" },
	{ id: "4", userName: "Benedict Kessler" },
	{ id: "5", userName: "Katelyn Rohan" },
	{ id: "6", userName: "Durward Reynolds" },
	{ id: "7", userName: "Kenton Towne" },
	{ id: "8", userName: "Therese Wunsch" },
	{ id: "9", userName: "Benedict Kessler" },
	{ id: "10", userName: "Katelyn Rohan" },
];

export default function AddFriends({}: AddFriendsInterface) {
	const { user } = useAuth();
	const { toast } = useToast();
	const { friends, dispatch } = useFriend();

	const [friendUserName, setFriendUserName] = useState("");
	const [isQrExpanded, setIsQrExpanded] = useState(false);
	const [videoReady, setVideoReady] = useState(false);
	const [result, setResult] = useState("");
	const [isScanning, setIsScanning] = useState(false);
	const { ref } = useZxing({
		onDecodeResult(result) {
			setResult(result.getText());
			setIsScanning(false);
			setVideoReady(false);
		},
		onDecodeError(error) {
			setResult("");
			console.log(error);
		},
		paused: !isScanning,
	}) as { ref: React.RefObject<HTMLVideoElement> };

	const isVideoContainerHidden = !videoReady || !isScanning;

	function handleToggleVideoContainer() {
		if (isScanning) {
			setIsScanning(false);
			setVideoReady(false);
		} else {
			setVideoReady(false);
			setIsScanning(true);
		}
	}

	async function handleSendFriendRequest(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			await api.postApiFriendRequestUserName(undefined, {
				params: { userName: friendUserName },
				withCredentials: true,
			});
			setFriendUserName("");
			toast(`Sent Friend Request to ${friendUserName}`, "success");
		} catch (error) {
			if (isAxiosError(error)) {
				const status = error.response?.status;
				switch (status) {
					case NOT_FOUND:
						toast("Username does not exist", "warn");
						return;
					case CONFLICT:
						if (isValidationErrorArray(error.response?.data)) {
							const errorMessage = error.response.data[0].description;
							toast(errorMessage, "warn");
						} else {
							toast("Could not send request", "warn");
						}
						return;
					default:
						toast("Could not send request", "warn");
				}
			}
			throw error;
		}
	}

	useEffect(() => {
		if (!isVideoContainerHidden) {
			ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [isScanning, videoReady]);

	useEffect(() => {
		tryAddAndUpdateFriends();
	}, [result]);

	return (
		<OptionsLayout title="Add Friends">
			<h2 className="mb-4 self-center">ADD BY USERNAME</h2>
			<form
				className="flex flex-col"
				onSubmit={(e) => handleSendFriendRequest(e)}
			>
				<TextInput
					label="Add Friend"
					name="friend"
					onChange={(e) => setFriendUserName(e.target.value)}
					value={friendUserName}
					autoComplete="new-password"
					placeholder="Username"
				/>

				<div className="-mt-3 lg:w-fit self-end">
					<ButtonPrimary
						type="submit"
						onClick={() => {}}
						style="transparent"
						uppercase={false}
					>
						Add
						<div className="size-[1.8em]">
							<UserAdd />
						</div>
					</ButtonPrimary>
				</div>
			</form>

			<div className="flex flex-col items-center lg:hidden">
				<h2 className="mt-6 mb-4 self-center">ADD BY QR</h2>
				<div className="flex justify-center items-center">
					<div className="w-fit bg-white flex justify-center items-center p-2">
						<QRCodeSVG
							value={user?.id || ""}
							width={isQrExpanded ? 256 : 128}
							height={isQrExpanded ? 256 : 128}
							onClick={() => setIsQrExpanded(!isQrExpanded)}
						/>
					</div>
				</div>

				<div className="flex justify-center items-center my-2">
					<div
						className={`rounded-2xl overflow-hidden relative transition-opacity duration-500 ${
							isVideoContainerHidden ? "opacity-0" : "opacity-100 mt-8"
						}`}
					>
						<div
							className={`border-black border-8 rounded-2xl w-[50%] aspect-square absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]`}
						/>
						<video
							className={`w-auto ${
								isVideoContainerHidden ? "h-0" : ""
							} transition-all duration-500`}
							ref={ref}
							onPlaying={() => setVideoReady(true)}
						/>
					</div>
				</div>

				<div className="w-40 self-center -mt-3">
					<ButtonPrimary
						onClick={handleToggleVideoContainer}
						style="transparent"
            uppercase={false}
					>
						{isScanning ? (
							"Stop"
						) : (
							<div className="flex justify-center items-center gap-2">
								<span className="">Scan</span>
								<div className="size-[1em]">
									<QrCodeScan />
								</div>
							</div>
						)}
					</ButtonPrimary>
				</div>
			</div>
		</OptionsLayout>
	);

	async function tryAddAndUpdateFriends() {
		const updateFriendsList = async () => {
			setResult("");
			try {
				const updatedFriends = (await getFriends()) ?? [];
				dispatch({ type: ActionType.UPDATE, payload: updatedFriends });
			} catch (error) {
				console.log(error);
			}
		};

		if (result) {
			const userFriendAddDTO: UserFriendAddDTO = {
				id: result,
				requiresPermission: false,
			};

			try {
				await api.postApiFriend(userFriendAddDTO, { withCredentials: true });
				updateFriendsList();
				toast("Successfully Added", "success");
			} catch (error) {
				if (isAxiosError(error) && error.response?.status == CONFLICT) {
					toast("Already Friends", "warn");
				}
				toast("Error Adding Friend", "warn");
			}
		}
	}
}
