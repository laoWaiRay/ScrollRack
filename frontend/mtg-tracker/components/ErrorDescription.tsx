
interface ErrorDescriptionInterface {
  description: string;
}

export default function ErrorDescription({ description }: ErrorDescriptionInterface) {
	return (
		<div className="text-error -mt-2 mb-1 flex flex-col items-start">
			{description}
		</div>
	);
}
