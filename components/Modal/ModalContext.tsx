'use client'
import { createContext, useCallback, useContext, useState } from "react";
import { Modal } from "./Modal";
import Spacing from "../Spacing/Spacing";

type ModalConfig = {
	id: string;
	content: React.ReactNode;
	onClose?: () => void;
};

type ModalContextType = {
	showModal: (config: Omit<ModalConfig, "id">) => void;
	closeModal: (id: string) => void;
	close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("ModalProvider is missing");
	return ctx;
};

function generateUUIDv4() {
	// UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8); // y is 8, 9, A, or B
		return v.toString(16);
	});
}


export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  	const [modals, setModals] = useState<ModalConfig[]>([]);

	const showModal = useCallback((config: Omit<ModalConfig, "id">) => {
		const id = generateUUIDv4();
		setModals((prev) => [...prev, { ...config, id }]);
	}, []);

	const close =  useCallback(() => {
		setModals((prev) => {
			if (prev.length === 0) return prev;
			const lastModal = prev[prev.length - 1];
			if (lastModal.onClose) lastModal.onClose();
			return prev.slice(0, -1);
		});
  }, []);

	const closeModal = useCallback((id: string) => {
		setModals((prev) => prev.filter((m) => m.id !== id));
	}, []);

	return (
		<ModalContext.Provider value={{ showModal, closeModal, close }}>
			{children}
			{modals.map((modal, index) => {
				return <Modal key={index}>
					{modal.content}
				</Modal>
			})}
		</ModalContext.Provider>
	);
};
