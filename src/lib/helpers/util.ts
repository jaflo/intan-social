import { dev } from "$app/environment";

export const SITE_NAME = "intan";
export function pageTitle(title?: string | string[]) {
	let result = SITE_NAME;
	if (dev) {
		result += " 🚧";
	}
	if (title) {
		if (!Array.isArray(title)) {
			title = [title];
		}
		title.reverse();
		for (const part of title) {
			result += ": " + part;
		}
	}
	return result;
}

export function unique<T>(items: T[]): T[] {
	return [...new Set(items)];
}
