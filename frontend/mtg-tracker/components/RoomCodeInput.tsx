import React, {
	ClipboardEventHandler,
	Dispatch,
	FocusEventHandler,
	KeyboardEventHandler,
	SetStateAction,
	useRef,
} from "react";

interface RoomCodeInputInterface {
  roomCode: string[];
  setRoomCode: Dispatch<SetStateAction<string[]>>;
  onSubmit?: () => void;
}

// Usage from parent:
// const [roomCode, setRoomCode] = useState(Array(6).fill(""));
export default function RoomCodeInput({ roomCode, setRoomCode, onSubmit }: RoomCodeInputInterface) {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (
			!/^[a-zA-Z0-9]$/.test(e.key) &&
			e.key !== "Backspace" &&
			e.key !== "Delete" &&
			e.key !== "Tab" &&
			!e.metaKey
		) {
			e.preventDefault();
		}

		if (e.key === "Delete" || e.key === "Backspace") {
			const index = inputRefs.current.findIndex(
				(ref) => ref === e.currentTarget
			);

			if (index === -1) {
				return;
			}

			if (roomCode[index] !== "") {
				setRoomCode((prev) => {
					const newRoomCode = [...prev];
					newRoomCode[index] = "";
          return newRoomCode;
				});
			} else if (index > 0) {
        setRoomCode((prev) => {
					const newRoomCode = [...prev];
					newRoomCode[index - 1] = "";
          return newRoomCode;
        })
        inputRefs.current[index - 1]?.focus();
      }
      return;
		}
    
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
    
    if (/^[a-zA-Z0-9]$/.test(e.key)) {
      let index = inputRefs.current.indexOf(e.target as HTMLInputElement);
      if (index >= 0 && index < roomCode.length) {
        setRoomCode((prev) => {
          const newRoomCode = [...prev];
          newRoomCode[index] = e.key.toUpperCase();;
          return newRoomCode;
        })
        inputRefs.current[index + 1]?.focus();
      }
    }
	};

	const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
		e.target.select();
	};

	const handlePaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
		e.preventDefault();
		const text = e.clipboardData.getData("text").replaceAll("/\s+/", "").toUpperCase();
		if (!new RegExp(`^[a-zA-Z0-9]{${roomCode.length}}$`).test(text)) {
			return;
		}
		const digits = text.split("");
		setRoomCode(digits);
	};

	return (
		<section className="bg-surface-600">
			<form id="roomCode-form" className="flex gap-1">
				{roomCode.map((digit, index) => (
					<input
						key={index}
						type="text"
						maxLength={1}
						value={digit}
						onChange={() => {}}
						onKeyDown={handleKeyDown}
						onFocus={handleFocus}
						onPaste={handlePaste}
						ref={(el) => (inputRefs.current[index] = el)}
            placeholder="0"
						className="text-xl w-[40px] rounded-lg border border-surface-400 py-2 text-center nth-of-type-[3]:mr-4"
					/>
				))}
			</form>
		</section>
	);
}
