import Fuse from "fuse.js";
import airports from "./airports.json";

const fuse = new Fuse(airports.reverse(), {
	keys: [
		{
			name: "name",
			weight: 2
		},
		"code",
		"city",
		"country"
	]
});

export function getAirportCode(q: string) {
	return fuse.search(q)[0]?.item?.code;
}

export function getAirportDetails(airport: string) {
	return airports.find((entry) => entry.code === airport);
}

export function isValidAirportCode(airport: string) {
	return !!getAirportDetails(airport);
}

export function isCloseTo(aCode: string, bCode: string) {
	const a = getAirportDetails(aCode);
	const b = getAirportDetails(bCode);

	if (!a || !b) {
		return false;
	}

	const R = 6371; // Radius of the earth in km
	const dLat = deg2rad(b.lat - a.lat); // deg2rad below
	const dLon = deg2rad(b.lon - a.lon);
	const lat1 = deg2rad(a.lat);
	const lat2 = deg2rad(b.lat);

	const sinHalfDLat = Math.sin(dLat / 2);
	const sinHalfDLon = Math.sin(dLon / 2);
	const cosLat1 = Math.cos(lat1);
	const cosLat2 = Math.cos(lat2);

	const sinA = sinHalfDLat * sinHalfDLat + sinHalfDLon * sinHalfDLon * cosLat1 * cosLat2;
	const c = 2 * Math.atan2(Math.sqrt(sinA), Math.sqrt(1 - sinA));
	const d = R * c; // Distance in km

	return d <= 60;
}

function deg2rad(deg: number) {
	return deg * (Math.PI / 180);
}
