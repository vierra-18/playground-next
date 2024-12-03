import {
	Children,
	type ComponentPropsWithoutRef,
	type ReactElement,
} from "react";

import { cn } from "./../../lib/utilities";

import FormFieldWrapper, {
	type Props as WrapperProps,
} from "./FormFieldWrapper";
import Radio from "./RadioButton";

type RadioItemType = {
	value: string;
} & Omit<ComponentPropsWithoutRef<typeof Radio.Item>, "onChange" | "checked">;

type Props = {
	value: string;
	onChange: (value: string) => void;
	label: string;
	children: Array<ReactElement<RadioItemType>> | ReactElement<RadioItemType>;
	containerClassName?: string;
} & WrapperProps;

function FormRadio({
	name,
	value,
	onChange,
	readOnly,
	label,
	error,
	children: raw,
	containerClassName,
	...rest
}: Props) {
	const children = Array.isArray(raw) ? raw : [raw];
	return (
		<FormFieldWrapper name={name} error={error} readOnly={readOnly} {...rest}>
			<Radio.Group
				className={cn("grid w-full gap-4 pt-4 pb-2", containerClassName)}
				onValueChange={(val) => onChange(val)}
				value={value}
			>
				{Children.toArray(
					children.map((c: ReactElement) => {
						const { value: cValue, label, ...rest } = c.props as RadioItemType;
						return (
							<Radio.Item key={cValue} label={label} value={cValue} {...rest} />
						);
					})
				)}
			</Radio.Group>
		</FormFieldWrapper>
	);
}

export default FormRadio;
