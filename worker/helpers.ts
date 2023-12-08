import { customAlphabet } from "nanoid";

const generator1 = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 32);
export function generateId() {
	return generator1();
}

const generator2 = customAlphabet("6789bcdfghjkmnpqrtwz", 32);
export function generateUserFacingId() {
	return generator2();
}

export const DAY_IN_MS = 24 * 60 * 60 * 1000;
