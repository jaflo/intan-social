import { writable } from "svelte/store";

export enum ModalType {
	Error,
	Generic,
	Undismissable
}

export const modalCount = writable(0);

let lastZIndex = 10;
export function getZIndex(): number {
	return (lastZIndex += 10);
}
