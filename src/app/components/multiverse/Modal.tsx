import type React from "react";
import type { ComponentProps } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { cn } from "./../../lib/utilities";

import Text from "./Text";
import Button from "./Button";

const MAP_VARIANT_CLASS = {
	default: "",
	primary: "bg-brand-subtle text-onBrand-subtle",
	info: "bg-info-subtle text-onInfo-subtle",
	success: "bg-success-subtle text-onSuccess-subtle",
	warning: "bg-warning-subtle text-onWarning-subtle",
	danger: "bg-danger-subtle text-onDanger-subtle",
	inverse: "bg-inverse-subtle text-onInverse-subtle",
} as const;

const MAP_MODAL_WIDTH_CLASS = {
	sm: "max-w-sm",
	default: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
} as const;

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;
type Size = keyof typeof MAP_MODAL_WIDTH_CLASS;

type ModalProps = {
	onClose: () => void;
	title: string;
	intent?: Intent;
	size?: Size;
	primaryAction?: {
		label: string;
		onClick: () => void;
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
	};
	altAction?: {
		label: string;
		onClick: () => void;
	};
	children: React.ReactNode;
};

export default function Modal({
	onClose,
	title,
	intent = "default",
	size = "default",
	primaryAction,
	secondaryAction,
	altAction,
	children,
}: ModalProps) {
	return (
		<div
			className={cn(
				"relative my-10 rounded-lg border border-subtle bg-interface shadow-lg",
				"text flex h-fit w-screen flex-col justify-between",
				MAP_MODAL_WIDTH_CLASS[size]
			)}
		>
			<div
				className={cn(
					"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
					"rounded-t-lg border-subtle border-b px-6",
					MAP_VARIANT_CLASS[intent]
				)}
			>
				<Text size="lead" weight="semibold">
					{title}
				</Text>
				<button
					type="button"
					className="aspect-square rounded text-2xl duration-200 hover:bg-interface-hovered hover:shadow-button"
					onClick={onClose}
					aria-label="Close modal"
				>
					<IoCloseOutline />
				</button>
			</div>

			<div className="flex-1 p-6">{children}</div>

			{(primaryAction || secondaryAction) && (
				<div className=" flex h-[3.75rem] w-full px-6">
					<div className="flex-1">
						{" "}
						{altAction && (
							<Button
								variant="text"
								intent={intent}
								className="capitalize p-0 [&_span]:mx-0 hover:bg-transparent"
								onClick={() => {
									altAction.onClick();
								}}
							>
								{altAction.label}
							</Button>
						)}
					</div>
					<div className="flex gap-1 justify-self-end ">
						{secondaryAction && (
							<Button
								variant="outline"
								className="capitalize"
								onClick={() => {
									secondaryAction.onClick();
								}}
							>
								{secondaryAction.label}
							</Button>
						)}
						{primaryAction && (
							<Button
								variant="solid"
								intent={intent}
								className="capitalize"
								onClick={() => {
									primaryAction.onClick();
								}}
							>
								{primaryAction.label}
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
