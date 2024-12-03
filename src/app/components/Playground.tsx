"use client";
import { useState } from "react";
import { z } from "zod";

import { HiArchive, HiBookmark } from "react-icons/hi";
import { FaCreditCard, FaRegCreditCard, FaWifi } from "react-icons/fa";
import { RiCoinLine, RiPaypalLine } from "react-icons/ri";

import Radio from "./multiverse/RadioButton";
import Checkbox from "./multiverse/Checkbox";
import Tooltip from "./multiverse/Tooltip";
import Card from "./multiverse/Card";
import Accordion from "./multiverse/Accordion";
import useToast from "./multiverse/Toast";
import Button from "./multiverse/Button";
import FormRadio from "./multiverse/FormRadio";
import useCreateOverlay from "./multiverse/useCreateOverlay";
import Modal from "./multiverse/Modal";

// Zod schemas
const paymentSchema = z.object({
	payment: z.enum(["credit", "debit", "paypal", "crypto"]),
});

const notificationsSchema = z.object({
	notifications: z.array(z.enum(["email", "sms", "push", "whatsapp"])),
});

function PlaygroundContent() {
	// Single selection state
	const [selectedPayment, setSelectedPayment] = useState<string>("");

	// Multiple selection state for notifications
	const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
		[]
	);

	// Error state
	const [errors, setErrors] = useState<{
		payment?: string;
		notifications?: string;
	}>({});

	// Example data for payment methods
	const paymentMethods = [
		{
			value: "credit",
			label: "Credit Card",
			description: "Pay with Visa, Mastercard, or American Express",
			icon: HiBookmark,
		},
		{
			value: "debit",
			label: "Debit Card",
			description: "Direct payment from your bank account",
			icon: FaRegCreditCard,
		},
		{
			value: "paypal",
			label: "PayPal",
			description: "Pay using your PayPal account",
			icon: RiPaypalLine,
		},
		{
			value: "crypto",
			label: "Cryptocurrency",
			description: "Pay with Bitcoin, Ethereum, or other cryptocurrencies",
			icon: RiCoinLine,
		},
	];

	// Example data for notification preferences
	const notificationPreferences = [
		{
			value: "email",
			label: "Email",
			description: "Receive notifications via email",
			icon: HiArchive,
		},
		{
			value: "sms",
			label: "SMS",
			description: "Receive notifications via SMS",
			icon: FaCreditCard,
		},
		{
			value: "push",
			label: "Push Notifications",
			description: "Receive push notifications",
			icon: RiPaypalLine,
		},
		{
			value: "whatsapp",
			label: "WhatsApp",
			description: "Receive notifications via WhatsApp",
			icon: RiCoinLine,
		},
	];

	const showModal = useCreateOverlay({});

	// Handle form submission
	const handleSubmit = () => {
		// Reset errors
		setErrors({});

		// Validate payment method
		const paymentValidation = paymentSchema.safeParse({
			payment: selectedPayment,
		});
		const notificationsValidation = notificationsSchema.safeParse({
			notifications: selectedNotifications,
		});

		let isValid = true;

		if (!paymentValidation.success) {
			setErrors((prev) => ({
				...prev,
				payment: "Invalid payment method selected.",
			}));
			isValid = false;
		}

		if (!notificationsValidation.success) {
			setErrors((prev) => ({
				...prev,
				notifications: "Invalid notification preferences selected.",
			}));
			isValid = false;
		}

		if (isValid) {
			alert("Form submitted successfully!");
		}
	};

	// Handling Checkbox change
	const handleCheckboxChange = (value: string, checked: boolean) => {
		if (checked) {
			setSelectedNotifications([...selectedNotifications, value]);
		} else {
			setSelectedNotifications(
				selectedNotifications.filter((v) => v !== value)
			);
		}
	};

	const { toast, ToastPortal } = useToast({
		maxToasts: 8,
		position: "top-left",
	});

	const openModal = () => {
		showModal({
			// position: "left",
			component: ({ close }) => (
				<Modal
					onClose={close}
					title={"Modal 1"}
					intent="danger"
					size="3xl"
					primaryAction={{
						label: "yeet",
						onClick: () => {},
					}}
					secondaryAction={{
						label: "yeet",
						onClick: () => {},
					}}
					altAction={{
						label: "yeet",
						onClick: () => {},
					}}
				>
					yeet
				</Modal>
			),
		});
	};

	return (
		<div className="w-full">
			<div className="grid w-full place-items-center py-40">
				{/* <Tooltip
					content={
						<div className="max-w-40">
							Lorem ipsum dolor sit amet consectetur adipisicing elit.
							Consequatur ex numquam corrupti ipsum debitis laudantium! Mollitia
							quo eligendi assumenda ut.
						</div>
					}
					position="top"
					offset="end"
					dismissible
					// title="Tooltip Title"
				>
					<button
						type="button"
						className="mx-auto rounded bg-green-500 px-4 py-2 text-white"
					>
						Hover or Click Me
					</button>
				</Tooltip> */}

				<Tooltip dismissible>
					<Tooltip.Target>
						<button
							type="button"
							className="mx-auto rounded bg-green-500 px-4 py-2 text-white"
						>
							Hover or Click Me
						</button>
					</Tooltip.Target>
					<Tooltip.Content position="right" offset="end">
						<Tooltip.Title>Optional Title</Tooltip.Title>
						Content goes here
					</Tooltip.Content>
				</Tooltip>
			</div>
			<div className="flex flex-col space-y-4">
				{/* Single selection */}
				<div>
					<h2 className="text mb-4 font-semibold text-xl">
						Select Payment Method
					</h2>
					<FormRadio
						name="yeet"
						label="yeet"
						value={selectedPayment}
						onChange={(value) => setSelectedPayment(value as string)}
					>
						{[
							...paymentMethods.map((method) => (
								<Radio.Item
									key={method.value}
									label={method.label}
									value={method.value}
									description={method.description}
									icon={method.icon}
								/>
							)),
							<Radio.Item
								key="yeet"
								label="yeet"
								value="yeet"
								description="yeet"
								// icon={FaChessBishop} // Uncomment if needed
							/>,
						]}
					</FormRadio>

					{errors.payment && (
						<p className="mt-2 text-red-500">{errors.payment}</p>
					)}

					<div className="text mt-4 rounded bg-gray-100 p-4 ">
						<p>
							Selected payment method: <strong>{selectedPayment}</strong>
						</p>
					</div>
				</div>
				{/* Multiple Selection for notifications */}
				<div>
					<h2 className="text mb-4 font-semibold text-xl">
						Choose Notification Preferences
					</h2>
					<div className="flex flex-col space-y-2">
						{notificationPreferences.map((notification) => (
							<Checkbox
								key={notification.value}
								label={notification.label}
								checked={selectedNotifications.includes(notification.value)}
								onChange={(checked) =>
									handleCheckboxChange(notification.value, checked)
								}
								description={notification.description}
								icon={notification.icon}
							/>
						))}

						<Checkbox
							key={"yeet"}
							label={"yeet"}
							checked={selectedNotifications.includes("yeet")}
							onChange={(checked) => handleCheckboxChange("yeet", checked)}
							description={"yeet"}
						/>
					</div>

					{errors.notifications && (
						<p className="mt-2 text-red-500">{errors.notifications}</p>
					)}

					<div className="text mt-4 rounded bg-gray-100 p-4">
						<p>Selected notification methods:</p>
						<ul className="mt-2 ml-4 list-disc">
							{selectedNotifications.map((method) => (
								<li key={method}>{method}</li>
							))}
						</ul>
					</div>
				</div>
				{/* Submit Button */}
				<button
					type="button"
					className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
					onClick={openModal}
				>
					open modal
				</button>
				<Button variant="solid" onClick={() => toast("title")}>
					open toast via string
				</Button>
				<Button
					variant="solid"
					onClick={() =>
						toast({
							message: "yeet",
							title: "yeet",
							filled: true,
							intent: "success",
							action: { label: "yeet", onClick: () => {} },
							duration: 5_000,
							position: "top-center",
						})
					}
				>
					open success toast
				</Button>{" "}
				<Button
					variant="solid"
					onClick={() =>
						toast({
							message: "yeet",
							title: "yeet",
							filled: true,
							intent: "danger",
							action: { label: "yeet", onClick: () => {} },
							duration: 5_000,
							position: "top-center",
						})
					}
				>
					open danger toast
				</Button>{" "}
				<Button
					variant="solid"
					onClick={() =>
						toast({
							// message: "yeet",
							title: "yeet",
							filled: true,
							duration: 0,
							position: "bottom-center",
							size: "xs",
						})
					}
				>
					open default toast
				</Button>
				<Button
					variant="solid"
					onClick={() => {
						const toasts = [
							{
								message: "Success Toast",
								title: "Success Toast Message",
								duration: 10_000,
								filled: true,
								intent: "success",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Danger Toast",
								title: "Danger Toast Message",
								duration: 10_000,
								filled: true,
								intent: "danger",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Warning Toast",
								title: "Warning Toast Message",
								duration: 10_000,
								filled: true,
								intent: "warning",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Default Toast",
								title: "Default Toast Message",
								duration: 10_000,
								filled: true,
								intent: "default",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Success Toast",
								title: "Success Toast Message",
								duration: 10_000,
								intent: "success",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Danger Toast",
								title: "Danger Toast Message",
								duration: 10_000,
								intent: "danger",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Warning Toast",
								title: "Warning Toast Message",
								duration: 10_000,
								intent: "warning",
								action: { label: "Button", onClick: () => {} },
							},
							{
								message: "Default Toast",
								title: "Default Toast Message",
								duration: 10_000,
								intent: "default",
								action: { label: "Button", onClick: () => {} },
							},
						];

						toasts.forEach((toastInput, index) => {
							setTimeout(() => {
								toast(toastInput);
							}, index * 300); // Delay of 300ms per toast
						});
					}}
				>
					open toast all toasts
				</Button>
				{ToastPortal && <ToastPortal />}
				<Card
					// primaryAction={{
					// 	label: "primary button",
					// 	onClick: () => {},
					// }}
					// secondaryAction={{
					// 	label: "secondary button",
					// 	onClick: () => {},
					// }}
					// headerAction={{
					// 	label: "yeet",
					// 	onClick: () => {},
					// }}
					title="yeet"
					description="yeet"
					size="2xl"
				>
					<div className="w-full">yeet</div>
				</Card>
			</div>
		</div>
	);
}

export default function Playground() {
	return <PlaygroundContent />;
}
