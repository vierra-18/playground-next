"use client";

import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import type { IconType } from "react-icons";
import { RiInformationFill } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, type ComponentProps } from "react";

import { cn } from "./../../lib/utilities";

import Button from "./Button";
import Text from "./Text";

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;

type ToastProps = {
	isActive?: boolean;
	icon?: IconType;
	title: string;
	message?: string;
	duration?: number;
	intent?: Intent;
	showTimestamp?: boolean;
	filled?: boolean;
	size?: keyof typeof MAP_SIZE_CLASS;
	position?: keyof typeof MAP_POSITION_CLASS;
	onClose?: () => void;
	action?: {
		label: string;
		onClick?: () => void;
	};
};

type ToastConfig = {
	maxToasts: number;
	position: ToastProps["position"];
};

type ToastOptions = Partial<Omit<ToastData, "id" | "isActive">>;

type ToastData = Omit<ToastProps, "isActive"> & {
	id: number;
	isActive?: boolean;
};

type ToastInput = string | (ToastOptions & { title: string });

const REMOVE_DELAY = 500;
const DEFAULT_CONFIG: ToastConfig = {
	maxToasts: 5,
	position: "top-right",
};

let nextId = 1;
const listeners = new Set<() => void>();
let config: ToastConfig = DEFAULT_CONFIG;

const toastUtils = {
	isActive: (toast: ToastData) => toast.isActive,

	isActiveNonCenter: (toast: ToastData) =>
		toast.isActive && !toast.position?.includes("center"),

	isCentered: (toast: ToastData) => toast.position?.includes("center"),

	removeToastAfterDelay: (toastId: number, notify: () => void) => {
		setTimeout(() => {
			toastStore.toasts = toastStore.toasts.filter(
				(toast) => toast.id !== toastId
			);
			notify();
		}, REMOVE_DELAY);
	},
};

const toastStore = {
	toasts: [] as ToastData[],

	toast: (input: ToastInput, message?: string, options: ToastOptions = {}) => {
		const isConfigObject = typeof input === "object";
		const position = isConfigObject
			? input.position
			: options.position ?? config.position;

		if (toastUtils.isCentered({ position } as ToastData)) {
			toastStore.private.clearCenterToasts();
		}

		toastStore.private.enforceMaxToasts();

		const newToast: ToastData = {
			id: nextId++,
			title: isConfigObject ? input.title : input,
			message: isConfigObject ? input.message ?? "" : message ?? "",
			intent: isConfigObject ? input.intent : options.intent,
			duration: isConfigObject ? input.duration : options.duration,
			position,
			isActive: true,
			...(isConfigObject ? input : options),
		};

		toastStore.toasts = [...toastStore.toasts, newToast];
		toastStore.private.notifyListeners();
	},

	removeToast: (id: number) => {
		toastStore.toasts = toastStore.toasts.map((toast) =>
			toast.id === id ? { ...toast, isActive: false } : toast
		);
		toastStore.private.notifyListeners();
		toastUtils.removeToastAfterDelay(id, toastStore.private.notifyListeners);
	},
	setConfig: (newConfig: Partial<ToastConfig>) => {
		config = { ...config, ...newConfig };
		if (toastStore.toasts.length > config.maxToasts) {
			toastStore.toasts = toastStore.toasts.slice(-config.maxToasts);
			toastStore.private.notifyListeners();
		}
	},

	getConfig: () => config,

	private: {
		clearCenterToasts: () => {
			toastStore.toasts.forEach((toast) => {
				if (toastUtils.isActive(toast) && toastUtils.isCentered(toast)) {
					toast.isActive = false;
					toastStore.private.notifyListeners();
					toastUtils.removeToastAfterDelay(
						toast.id,
						toastStore.private.notifyListeners
					);
				}
			});
		},

		enforceMaxToasts: () => {
			const activeToasts = toastStore.toasts.filter(
				toastUtils.isActiveNonCenter
			);

			if (activeToasts.length >= config.maxToasts) {
				const oldestActiveToast = toastStore.toasts.find(
					toastUtils.isActiveNonCenter
				);

				if (oldestActiveToast) {
					oldestActiveToast.isActive = false;
					toastStore.private.notifyListeners();
					toastUtils.removeToastAfterDelay(
						oldestActiveToast.id,
						toastStore.private.notifyListeners
					);
				}
			}
		},

		notifyListeners: () => {
			listeners.forEach((listener) => listener());
		},
	},
};

export function useToastStore() {
	return {
		toasts: React.useSyncExternalStore(
			(listener) => {
				listeners.add(listener);
				return () => listeners.delete(listener);
			},
			() => toastStore.toasts
		),
		config: toastStore.getConfig(),
	};
}

function useToast(customConfig?: Partial<ToastConfig>) {
	const [portalMounted, setPortalMounted] = React.useState(false);

	useEffect(() => {
		if (!portalMounted) {
			setPortalMounted(true);
		}
		if (customConfig) {
			toastStore.setConfig(customConfig);
		}
	}, [portalMounted, customConfig]);

	const toast = React.useCallback(
		(input: ToastInput, message?: string, options: ToastOptions = {}) => {
			toastStore.toast(input, message, options);
		},
		[]
	);

	return {
		toast,
		removeToast: toastStore.removeToast,
		ToastPortal: portalMounted ? ToastPortal : null,
	};
}

const commonTransition = {
	type: "spring",
	bounce: 0.25,
};

const createPositionAnimation = (
	axis: "x" | "y",
	initialDistance: string,
	animateDistance: string,
	isCenter = false,
	duration = 0.5
) => ({
	initial: { [axis]: initialDistance, opacity: 0 },
	animate: { [axis]: 0, opacity: 1, ...(isCenter ? { scale: 1 } : undefined) },
	exit: {
		[axis]: animateDistance,
		opacity: 0,
		...(isCenter ? { scale: 0.8 } : undefined),
	},
	transition: { ...commonTransition, duration },
});

const MAP_POSITION_ANIMATION = {
	"top-right": createPositionAnimation("x", "30%", "30%"),
	"top-left": createPositionAnimation("x", "-30%", "-30%"),
	"bottom-right": createPositionAnimation("x", "30%", "30%"),
	"bottom-left": createPositionAnimation("x", "-30%", "-30%"),
	"top-center": createPositionAnimation("y", "-100%", "100%", true, 1),
	"bottom-center": createPositionAnimation("y", "100%", "-100%", true, 1),
} as const;

const MAP_POSITION_CLASS = {
	"top-right": {
		container: "place-items-end",
		toast: "flex-col-reverse justify-end w-fit",
	},
	"top-left": {
		container: "place-items-start",
		toast: "flex-col-reverse justify-end w-fit",
	},
	"bottom-right": {
		container: "place-items-end",
		toast: "flex-col justify-end w-fit",
	},
	"bottom-left": {
		container: "place-items-start",
		toast: "flex-col justify-end w-fit",
	},
	"top-center": {
		container: "place-items-center",
		toast: "flex-col-reverse justify-end items-center w-full",
	},
	"bottom-center": {
		container: "place-items-center",
		toast: "flex-col justify-end items-center w-full",
	},
} as const;

const MAP_SIZE_CLASS = {
	xs: "max-w-60",
	sm: "max-w-xs",
	default: "max-w-sm",
};
const MAP_ICON_COLOR_CLASS: Record<Intent, string> = {
	default: "",
	primary: "text-brand",
	info: "text-info",
	success: "text-success",
	warning: "text-warning",
	danger: "text-danger",
	inverse: "text-inverse",
};

const MAP_SPAN_BG_COLOR_CLASS: Record<Intent, string> = {
	default: "bg-inverse",
	primary: "bg-brand",
	info: "bg-info",
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-danger",
	inverse: "bg-inverse",
};

const MAP_FILLED_SPAN_BG_COLOR_CLASS: Record<Intent, string> = {
	default: "bg-brand",
	primary: "bg-brand-hovered",
	info: "bg-info-hovered",
	success: "bg-success-hovered",
	warning: "bg-warning-hovered",
	danger: "bg-danger-hovered",
	inverse: "bg-inverse-hovered",
};

const MAP_FILLED_BG_COLOR_CLASS: Record<Intent, string> = {
	default: "bg-inverse",
	primary: "bg-brand",
	info: "bg-info",
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-danger",
	inverse: "",
};

function Timestamp() {
	const currentTime = new Date().toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
	return (
		<Text size="caption" lineHeight="tight" color="subtle">
			{`Today ${currentTime}`}
		</Text>
	);
}

function Toast({
	isActive = false,
	onClose,
	icon: Icon = RiInformationFill,
	title,
	action,
	message,
	duration,
	intent = "default",
	filled = false,
	size = "default",
	showTimestamp = false,
	position = "top-right",
}: ToastProps) {
	const propDuration = (() => {
		if (action && duration === undefined) return undefined;
		if (duration === 0) return undefined;
		return duration ?? 5000;
	})();
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	const animation = MAP_POSITION_ANIMATION[position ?? "top-right"];

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (isActive && propDuration) {
			timer = setTimeout(() => {
				if (onCloseRef.current) {
					onCloseRef.current();
				}
			}, propDuration);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isActive, propDuration]);

	return (
		<motion.div
			initial={animation.initial}
			animate={isActive ? animation.animate : animation.exit}
			transition={animation.transition}
			className={cn(
				"pointer-events-none z-[999999] flex w-screen bg-transparent px-4 text",
				position.includes("center") ? "absolute" : "relative",
				MAP_SIZE_CLASS[size]
			)}
			layout
		>
			<div
				className={cn(
					"toast-container !pointer-events-auto relative z-[999]",
					"w-full overflow-y-auto overscroll-contain md:max-h-32",
					"rounded bg-interface p-4 shadow-md",
					filled && MAP_FILLED_BG_COLOR_CLASS[intent]
				)}
			>
				<div className="flex flex-col justify-between">
					<div className="flex">
						<div className="flex flex-1 flex-col justify-between gap-2">
							<div className="flex gap-2">
								<div
									className={cn(
										"flex items-start justify-center",
										filled ? "text-light" : MAP_ICON_COLOR_CLASS[intent]
									)}
								>
									<Icon />
								</div>
								{title && (
									<Text
										size="body"
										weight="medium"
										color={`${filled ? "light" : "default"}`}
									>
										{title}
									</Text>
								)}
							</div>
							{message && (
								<div className="flex flex-1 justify-between">
									<div className="flex flex-1 flex-col gap-y-2">
										<Text
											size="caption"
											lineHeight="tight"
											color={`${filled ? "light" : "subtle"}`}
										>
											{message}
										</Text>
										{showTimestamp && <Timestamp />}
									</div>
								</div>
							)}
						</div>
						<div className="flex gap-3">
							{action && (
								<Button
									onClick={() => {
										action.onClick?.();
									}}
									variant={`${
										intent === "default"
											? "outline"
											: filled
											? "outline"
											: "solid"
									}`}
									size="small"
									className="self-center capitalize"
									intent={filled ? "default" : intent}
								>
									{action.label}
								</Button>
							)}
							<button
								type="button"
								onClick={onClose}
								className={cn(filled && "text-light")}
							>
								<IoClose />
							</button>
						</div>
					</div>

					{filled && propDuration && (
						<span
							className={cn(
								"absolute bottom-0 left-0 h-1 w-full bg-interface-disabled"
							)}
						/>
					)}
					{propDuration && (
						<motion.span
							key={isActive && propDuration ? "active" : "inactive"}
							initial={{ scaleX: isActive ? 1 : 0 }}
							animate={{ scaleX: 0 }}
							transition={{
								duration: propDuration / 1000,
								ease: "linear",
							}}
							className={cn(
								"absolute bottom-0 left-0 h-1 w-full origin-left",
								filled
									? MAP_FILLED_SPAN_BG_COLOR_CLASS[intent]
									: MAP_SPAN_BG_COLOR_CLASS[intent]
							)}
						/>
					)}
				</div>
			</div>
		</motion.div>
	);
}

function ToastContainer() {
	const { toasts, config } = useToastStore();
	const { removeToast } = useToast();

	const groupedToasts = React.useMemo(() => {
		const groups = new Map<ToastProps["position"], ToastData[]>();

		toasts.forEach((toast) => {
			const position = toast.position ?? config.position;
			if (!groups.has(position)) {
				groups.set(position, []);
			}
			groups.get(position)?.push(toast);
		});

		return groups;
	}, [toasts, config.position]);

	return (
		<AnimatePresence
			mode={config.position?.includes("center") ? "wait" : "sync"}
		>
			{Array.from(groupedToasts.entries()).map(([position, positionToasts]) => {
				const positionClass = MAP_POSITION_CLASS[position ?? "top-right"];

				return (
					<div
						key={position}
						className={cn(
							"pointer-events-none fixed inset-0 grid h-screen w-screen",
							positionClass.container
						)}
					>
						<div
							className={cn(
								"pointer-events-none",
								"relative flex h-screen ",
								"gap-3 py-5",
								positionClass.toast
							)}
						>
							{positionToasts.map((toast) => (
								<Toast
									key={toast.id}
									{...toast}
									isActive={toast.isActive}
									position={position}
									onClose={() => {
										toast.onClose?.();
										removeToast(toast.id);
									}}
								/>
							))}
						</div>
					</div>
				);
			})}
		</AnimatePresence>
	);
}

function ToastPortal() {
	const [mounted, setMounted] = React.useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted) return null;

	return createPortal(<ToastContainer />, document.body);
}

export default useToast;
