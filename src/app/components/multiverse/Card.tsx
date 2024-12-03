import type React from "react";

import { cn } from "./../../lib/utilities";

import Text from "./Text";
import Button from "./Button";

const MAP_CARD_WIDTH_CLASS = {
	sm: "max-w-sm",
	default: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
} as const;

type Size = keyof typeof MAP_CARD_WIDTH_CLASS;

type CardProps = {
	title: string;
	description?: string;
	size?: Size;
	headerAction?: {
		label: string;
		onClick: () => void;
	};
	primaryAction?: {
		label: string;
		onClick: () => void;
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
	};
	children: React.ReactNode;
	className?: string;
};

export default function Card({
	title,
	className,
	description,
	size = "default",
	headerAction,
	primaryAction,
	secondaryAction,
	children,
}: CardProps) {
	return (
		<div
			className={cn(
				"relative rounded-lg border",
				"flex w-full flex-col justify-between",
				"overflow-x-clip",
				"bg-surface-raised ",
				MAP_CARD_WIDTH_CLASS[size],
				className
			)}
		>
			<div
				className={cn(
					"flex w-full items-center justify-between pt-5 pb-4",
					"rounded-t-lg px-5"
				)}
			>
				<div className="flex flex-col">
					<Text size="lead" weight="semibold">
						{title}
					</Text>
					<Text size="caption" color="subtle">
						{description}
					</Text>
				</div>
				{headerAction && (
					<Button
						variant="solid"
						className="capitalize"
						onClick={() => {
							headerAction.onClick();
						}}
					>
						{headerAction.label}
					</Button>
				)}
			</div>

			<div className="grid place-items-center px-5 text">{children}</div>

			{(primaryAction || secondaryAction) && (
				<div className="flex w-full items-center gap-2 rounded-b-lg px-5 pb-5 pt-4">
					{primaryAction && (
						<Button
							variant="solid"
							intent="primary"
							className="capitalize"
							onClick={() => {
								primaryAction.onClick();
							}}
						>
							{primaryAction.label}
						</Button>
					)}
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
				</div>
			)}
		</div>
	);
}
