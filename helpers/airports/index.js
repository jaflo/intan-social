import csv from "csv-parser";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const csvFilePath = path.join(__dirname, "airports.csv");
const csvURL = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";

if (!fs.existsSync(csvFilePath)) {
	console.log("CSV file does not exist. Downloading...");
	try {
		const response = await fetch(csvURL);
		if (!response.ok) {
			throw new Error(`Failed to download CSV (HTTP status ${response.status})`);
		}
		const csvData = await response.text();
		fs.writeFileSync(csvFilePath, csvData);
		console.log("CSV file downloaded successfully.");
	} catch (error) {
		console.error("Error downloading CSV file:", error);
	}
} else {
	console.log("CSV file already exists.");
}

const parser = csv({
	headers: [
		"AirportID",
		"Name",
		"City",
		"Country",
		"IATA",
		"ICAO",
		"Latitude",
		"Longitude",
		"Altitude",
		"Timezone",
		"DST",
		"TzDatabaseTime",
		"Type",
		"Source"
	],
	mapValues: ({ value }) => (value === "\\N" ? undefined : value)
});

function saveJSONToFile(data, fileName) {
	try {
		const jsonData = JSON.stringify(data);
		fs.writeFileSync(path.join(__dirname, fileName), jsonData);
		console.log(`JSON data saved to ${fileName}`);
	} catch (error) {
		console.error("Error saving JSON data:", error);
	}
}

let placeList = new Set();
let airports = [];

fs.createReadStream(csvFilePath)
	.pipe(parser)
	.on("data", (row) => {
		const subset = ["Name", "City", "Country", "IATA", "Latitude", "Longitude"].reduce(
			(filteredObj, key) => {
				filteredObj[key] = row[key];
				return filteredObj;
			},
			{}
		);
		if (subset.City) placeList.add(subset.City + ", " + subset.Country);
		placeList.add(subset.Country);
		if (subset.IATA) {
			const { Name, City, Country, IATA, Latitude, Longitude } = subset;
			airports.push({
				code: IATA,
				name: Name,
				city: City,
				country: Country,
				lat: Number(Number(Latitude).toFixed(3)),
				lon: Number(Number(Longitude).toFixed(3))
			});
		}
	})
	.on("end", () => {
		saveJSONToFile([...placeList], "places.json");
		saveJSONToFile(airports, "airports.json");
	});
