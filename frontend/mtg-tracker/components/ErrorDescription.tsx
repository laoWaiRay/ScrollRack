
interface ErrorDescriptionInterface {
  _key: string;
  description: string;
}

export default function ErrorDescription({ _key, description }: ErrorDescriptionInterface) {
	return (
		<div className="text-error -mt-2 mb-1" key={_key}>
			{description}
		</div>
	);
}
