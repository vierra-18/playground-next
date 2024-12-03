// UIProvider.tsx
import React, { type ReactNode } from "react";
import PopupProvider from "./OverlayProvider";

interface UIProviderProps {
	children: ReactNode;
}

export function MultiverseProvider({ children }: UIProviderProps) {
	return (
		<>
			<PopupProvider>{children}</PopupProvider>
		</>
	);
}
