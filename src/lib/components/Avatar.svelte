<script lang="ts">
	import { nanoid } from "nanoid";
	import { colors as defaultColors } from "$lib/helpers/colors";

	export let name: string;
	export let size = 36;
	export let colors: string[] = defaultColors;
	export let square = false;

	const maskID = nanoid();
	const SIZE = 36;

	const hashCode = (name: string) => {
		var hash = 0;
		for (var i = 0; i < name.length; i++) {
			var character = name.charCodeAt(i);
			hash = (hash << 5) - hash + character;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash);
	};

	const getDigit = (number: number, ntn: number) => {
		return Math.floor((number / Math.pow(10, ntn)) % 10);
	};

	const getBoolean = (number: number, ntn: number) => {
		return !(getDigit(number, ntn) % 2);
	};

	const getUnit = (number: number, range: number, index?: number) => {
		let value = number % range;

		if (index && getDigit(number, index) % 2 === 0) {
			return -value;
		} else return value;
	};

	const getRandomColor = (number: number, colors: any[], range: number) => {
		return colors[number % range];
	};

	const getContrast = (hexcolor: string) => {
		// If a leading # is provided, remove it
		if (hexcolor.slice(0, 1) === "#") {
			hexcolor = hexcolor.slice(1);
		}

		// Convert to RGB value
		var r = parseInt(hexcolor.substr(0, 2), 16);
		var g = parseInt(hexcolor.substr(2, 2), 16);
		var b = parseInt(hexcolor.substr(4, 2), 16);

		// Get YIQ ratio
		var yiq = (r * 299 + g * 587 + b * 114) / 1000;

		// Check contrast
		return yiq >= 128 ? "#000000" : "#FFFFFF";
	};

	const numFromName = hashCode(name);
	const range = colors && colors.length;
	const wrapperColor = getRandomColor(numFromName, colors, range);
	const preTranslateX = getUnit(numFromName, 10, 1);
	const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
	const preTranslateY = getUnit(numFromName, 10, 2);
	const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

	const data = {
		wrapperColor: wrapperColor,
		faceColor: getContrast(wrapperColor),
		backgroundColor: getRandomColor(numFromName + 13, colors, range),
		wrapperTranslateX: wrapperTranslateX,
		wrapperTranslateY: wrapperTranslateY,
		wrapperRotate: getUnit(numFromName, 360),
		wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
		isMouthOpen: getBoolean(numFromName, 2),
		isCircle: getBoolean(numFromName, 1),
		eyeSpread: getUnit(numFromName, 5),
		mouthSpread: getUnit(numFromName, 3),
		faceRotate: getUnit(numFromName, 10, 3),
		faceTranslateX:
			wrapperTranslateX > SIZE / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
		faceTranslateY:
			wrapperTranslateY > SIZE / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2)
	};
</script>

<svg
	viewBox={`0 0 ${SIZE} ${SIZE}`}
	fill="none"
	role="img"
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
>
	<mask id={maskID} maskUnits="userSpaceOnUse" x={0} y={0} width={SIZE} height={SIZE}>
		<rect width={SIZE} height={SIZE} rx={square ? undefined : SIZE * 2} fill="#FFFFFF" />
	</mask>
	<g mask={`url(#${maskID})`}>
		<rect width={SIZE} height={SIZE} fill={data.backgroundColor} />
		<rect
			x="0"
			y="0"
			width={SIZE}
			height={SIZE}
			transform={`translate(${data.wrapperTranslateX} ${data.wrapperTranslateY}) rotate(${
				data.wrapperRotate
			} ${SIZE / 2} ${SIZE / 2}) scale(${data.wrapperScale})`}
			fill={data.wrapperColor}
			rx={data.isCircle ? SIZE : SIZE / 6}
		/>
		<g
			transform={`translate(${data.faceTranslateX} ${data.faceTranslateY}) rotate(${
				data.faceRotate
			} ${SIZE / 2} ${SIZE / 2})`}
		>
			{#if data.isMouthOpen}
				<path
					d={`M15 ${19 + data.mouthSpread}c2 1 4 1 6 0`}
					stroke={data.faceColor}
					fill="none"
					stroke-linecap="round"
				/>
			{:else}
				<path d={`M13,${19 + data.mouthSpread} a1,0.75 0 0,0 10,0`} fill={data.faceColor} />
			{/if}
			<rect
				x={14 - data.eyeSpread}
				y={14}
				width={1.5}
				height={2}
				rx={1}
				stroke="none"
				fill={data.faceColor}
			/>
			<rect
				x={20 + data.eyeSpread}
				y={14}
				width={1.5}
				height={2}
				rx={1}
				stroke="none"
				fill={data.faceColor}
			/>
		</g>
	</g>
</svg>
