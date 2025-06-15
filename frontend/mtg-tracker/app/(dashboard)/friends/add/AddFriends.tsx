"use client";
import { useAuth } from "@/hooks/useAuth";
import { UserReadDTO } from "@/types/client";
import { useEffect, useState } from "react";
import TextInput from "@/components/TextInput";
import ButtonPrimary from "@/components/ButtonPrimary";
import OptionsLayout from "@/components/OptionsLayout";
import { QRCodeSVG } from "qrcode.react";
import { useZxing } from "react-zxing";
import QrCodeScan from "@/public/icons/qrcode-scan.svg";

interface AddFriendsInterface {
	friends: UserReadDTO[] | null;
}

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

export default function AddFriends({ friends }: AddFriendsInterface) {
	const { user } = useAuth();
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

	useEffect(() => {
		if (!isVideoContainerHidden) {
			ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [isScanning, videoReady]);

	return (
		<OptionsLayout title="Add Friends">
			<h2 className="mt-6 mb-4 self-center">ADD BY USERNAME</h2>
			<form className="flex flex-col">
				<TextInput
					label="Add Friend"
					name="friend"
					onChange={(e) => setFriendUserName(e.target.value)}
					value={friendUserName}
					autoComplete="new-password"
					placeholder="Username"
				/>

				<ButtonPrimary type="submit" onClick={() => {}}>
					ADD
				</ButtonPrimary>
			</form>

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
						// hidden={isVideoContainerHidden}
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

			<div className="w-40 self-center">
				<ButtonPrimary onClick={handleToggleVideoContainer}>
					{isScanning ? (
						"STOP"
					) : (
						<div className="text-white flex justify-center items-center gap-2">
							<div className="size-[1em]">
								<QrCodeScan />
							</div>
							<span className="">SCAN</span>
						</div>
					)}
				</ButtonPrimary>
			</div>

			<div>{result}</div>
		</OptionsLayout>
	);
}

// function ViewFinder() {
//   return (
//     <div className="size-48 bg-white">

//     </div>
//   )
// }
