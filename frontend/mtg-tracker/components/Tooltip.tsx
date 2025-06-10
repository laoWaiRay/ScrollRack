import { useFloating, offset, useHover, useInteractions } from "@floating-ui/react";
import { useState } from "react";

interface TooltipInterface {
  children: React.ReactNode;
  text: string;
  placement?: 'bottom' | 'right';
  _offset?: number;
  styles?: string;
}

export default function Tooltip({ children, text, placement = 'bottom', _offset = 1, styles }: TooltipInterface) {
	const [isOpen, setIsOpen] = useState(false);
	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
    middleware: [
      offset(_offset)
    ],
    placement: placement,
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
          className={`${styles} bg-surface-400 rounded-lg text-fg p-md text-base w-max z-10`}
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