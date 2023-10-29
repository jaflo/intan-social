const API_BASE_PATH = "http://0.0.0.0:8787";

export async function post<T>(path: string, data: unknown) {
	const result = await fetch(API_BASE_PATH + path, {
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		method: "POST"
	});
	const response: T & {
		success: boolean;
	} = await result.json();

	if (!result.ok) {
		throw new Error("Request failed: " + result.statusText);
	} else if (!response.success) {
		console.error("Request didn't return successfully", response);
		throw new Error("Request didn't return successfully");
	}
	return response;
}
