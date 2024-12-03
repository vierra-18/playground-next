import React, { type ReactElement } from "react";
import type { IconType } from "react-icons";

type Icon = IconType | ReactElement;

export const renderIcon = (Icon: Icon) => {
	if (React.isValidElement(Icon)) {
		return Icon;
	}
	if (typeof Icon === "function") {
		return <Icon />;
	}
	return null;
};
