import * as React from "react";
import type { IconType } from "react-icons";
import { FaCircle as Circle } from "react-icons/fa";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "./../../lib/utilities";

import Text from "./Text";

import "./RadioButton.css";

const Group = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-4", className)}
			{...props}
			ref={ref}
		/>
	);
});
Group.displayName = RadioGroupPrimitive.Root.displayName;

type ButtonProps = {
	label: string;
	value: string;
	description?: string;
	contained?: boolean;
	disabled?: boolean;
	icon?: IconType;
};

const ItemContent = ({
	label,
	description,
	icon: Icon,
}: {
	label: string;
	description?: string;
	icon: IconType;
}) => (
	<>
		<div
			className={cn(
				"text grid aspect-square h-9 w-9 shrink-0 place-items-center rounded-md bg-interface-subtle text-xl",
				"group-hover:text-brand",
				"group-data-[state=checked]:bg-brand group-data-[state=checked]:text-white",
				"transition-colors duration-300"
			)}
		>
			<Icon />
		</div>
		<div className="flex flex-col gap-1">
			<Text size="body" weight="medium" className="text-left">
				{label}
			</Text>
			{description && (
				<Text size="caption" color="subtle">
					{description}
				</Text>
			)}
		</div>
	</>
);

const Item = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	ButtonProps
>(
	(
		{ label, value, description, contained = false, disabled = false, icon },
		ref
	) => {
		return (
			<div
				className={cn(
					"radio-item-root flex",
					description ? "items-start" : "items-center",
					contained
						? "min-w-[20.5625rem] gap-x-[0.5rem] rounded border p-[1rem]"
						: "gap-x-[0.75rem]"
				)}
			>
				<RadioGroupPrimitive.Item
					ref={ref}
					className={cn(
						!icon &&
							"aspect-square h-4 w-4 rounded-full border bg-surface-raised " +
								"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
								"disabled:cursor-not-allowed disabled:opacity-50 " +
								"data-[state=checked]:border-info-subtle " +
								"data-[state=checked]:bg-interface-selected-subtle " +
								"data-[state=checked]:text-onSelected-subtle",
						icon &&
							"group flex w-full items-start gap-3 rounded-lg transition-colors " +
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interface-focus " +
								"disabled:cursor-not-allowed disabled:opacity-50"
					)}
					value={value}
					disabled={disabled}
				>
					{icon ? (
						<ItemContent label={label} description={description} icon={icon} />
					) : (
						<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
							<Circle className="h-2 w-2 fill-current text-current" />
						</RadioGroupPrimitive.Indicator>
					)}
				</RadioGroupPrimitive.Item>
				{!icon && (
					<div className="space-y-px">
						<Text as="p" size="body">
							{label}
						</Text>
						{description ? (
							<p className="text-caption-tight text-subtle">{description}</p>
						) : null}
					</div>
				)}
			</div>
		);
	}
);
Item.displayName = RadioGroupPrimitive.Item.displayName;

const Radio = {
	Group,
	Item,
};

export default Radio;
