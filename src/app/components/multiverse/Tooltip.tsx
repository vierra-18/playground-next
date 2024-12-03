import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { MdClose as Close } from "react-icons/md";
import Text from "./Text";
import { cn } from "./../../lib/utilities";

const style = `
  [data-side="bottom"][data-align="end"] span,
  [data-side="top"][data-align="end"] span {
    right: 10% !important;
    left: unset !important;
  }
  [data-side="bottom"][data-align="start"] span,
  [data-side="top"][data-align="start"] span {
    left: 10% !important;
  }
`;

const TooltipContext = React.createContext<{
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	dismissible?: boolean;
} | null>(null);

const useTooltipContext = () => {
	const context = React.useContext(TooltipContext);
	if (!context) {
		throw new Error(
			"Tooltip compound components must be used within a Tooltip component"
		);
	}
	return context;
};

const Target = ({ children }: { children: React.ReactNode }) => {
	const { open, setOpen, dismissible } = useTooltipContext();

	return (
		<TooltipPrimitive.Trigger
			asChild
			{...(dismissible && { onClick: () => setOpen(!open) })}
		>
			{children}
		</TooltipPrimitive.Trigger>
	);
};

const Content = ({
	children,
	position = "bottom",
	offset = "center",
	className,
	...props
}: {
	children: React.ReactNode;
	position?: "top" | "right" | "bottom" | "left";
	offset?: "center" | "end" | "start";
	className?: string;
} & Omit<
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
	"content"
>) => {
	const [isMounted, setIsMounted] = React.useState(false);
	// const { dismissible } = useTooltipContext();

	React.useLayoutEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<>
			{isMounted && <style>{style}</style>}
			<TooltipPrimitive.Content
				className={cn(
					"z-50 max-w-[18.75rem] animate-in overflow-hidden rounded",
					"fade-in zoom-in",
					"data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
					"data-[side=bottom]:slide-top data-[side=left]:slide-right",
					"data-[side=right]:slide-left data-[side=top]:slide-bottom",
					"border-transparent bg-inverse p-4 text-onInverse transition-all",
					"data-[state=closed]:animate-out",
					className
				)}
				sideOffset={10}
				arrowPadding={15}
				side={position}
				align={offset}
				{...props}
			>
				<div className="flex flex-col gap-2 text-caption">{children}</div>
				<TooltipPrimitive.Arrow
					className="visible border-none fill-black-500"
					width={15}
					height={7}
				/>
			</TooltipPrimitive.Content>
		</>
	);
};

const Title = ({ children }: { children: React.ReactNode }) => {
	const { dismissible, setOpen } = useTooltipContext();

	return (
		<div className={cn(children ? "flex" : "absolute top-0 right-0")}>
			{children && (
				<Text
					size="caption"
					weight="semibold"
					color="onInverse"
					className={cn(children && "flex-1")}
				>
					{children}
				</Text>
			)}
			{dismissible && (
				<button
					type="button"
					onClick={() => setOpen(false)}
					className="absolute top-1.5 right-1.5 text-caption"
				>
					<Close />
				</button>
			)}
		</div>
	);
};

interface TooltipProps {
	children: React.ReactNode;
	dismissible?: boolean;
}

const Tooltip = ({ children, dismissible }: TooltipProps) => {
	const [open, setOpen] = React.useState(false);

	// Validate required children
	const childArray = React.Children.toArray(children);
	const hasTarget = childArray.some(
		(child) => React.isValidElement(child) && child.type === Target
	);
	const hasContent = childArray.some(
		(child) => React.isValidElement(child) && child.type === Content
	);

	if (!hasTarget) {
		throw new Error("Tooltip must contain a Tooltip.Target component");
	}
	if (!hasContent) {
		throw new Error("Tooltip must contain a Tooltip.Content component");
	}

	return (
		<TooltipContext.Provider value={{ open, setOpen, dismissible }}>
			<TooltipPrimitive.Provider>
				<TooltipPrimitive.Root
					delayDuration={300}
					{...(dismissible && { open })}
				>
					{children}
				</TooltipPrimitive.Root>
			</TooltipPrimitive.Provider>
		</TooltipContext.Provider>
	);
};

// Add static components
Tooltip.Target = Target;
Tooltip.Content = Content;
Tooltip.Title = Title;

export default Tooltip;
