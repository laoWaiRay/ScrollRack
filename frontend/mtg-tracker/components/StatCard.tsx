import { Card, CardBody } from "@material-tailwind/react";
import { ReactNode } from "react";

export default function StatCard({ children, styles, innerStyles }: { children: ReactNode, styles?: string, innerStyles?: string }) {
  const _styles = `${styles} w-full h-full bg-surface-500/50 rounded flex flex-col justify-between text-fg-light`;

	return (
		<Card className={_styles}>
			<CardBody className={`p-6 grow flex flex-col justify-between w-full ${innerStyles}`}>
        { children }
			</CardBody>
		</Card>
	);
}
