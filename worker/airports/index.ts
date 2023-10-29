import Fuse from "fuse.js";
import airports from "./airports.json";

const fuse = new Fuse(airports.reverse(), {
	keys: ["code", "city", "country"]
});

export function getAirportCode(q: string) {
	return fuse.search(q)[0]?.item?.code;
}
