import { useFloating, offset, useHover, useInteractions } from "@floating-ui/react";
import { useState } from "react";

interface TooltipInterface {
  children: React.ReactNode;
  text: string;
}

export default function Tooltip({ children, text }: TooltipInterface) {
	const [isOpen, setIsOpen] = useState(false);
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
    middleware: [
      offset(1)
    ]
	});
	const hover = useHover(context, {
		mouseOnly: true,
		delay: {
			open: 250,
			close: 0,
		},
	});
	const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      {isOpen && (
        <div
          className="bg-surface-500 rounded-lg text-fg p-md text-base"
          ref={refs.setFloating}
          {...getReferenceProps()}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {text}
        </div>
      )}
      <div ref={refs.setReference}>
        {children}
      </div>
    </>
  )
}