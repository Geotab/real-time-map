import {
	time2018,
	time2019,
	time2020,
	latLng2018,
	latLng2019,
	latLng2020,
	deviceID
}
from "./mock-device";

const sampleLogRecordsData = {
	data: [{
			dateTime: time2018,
			device: {
				id: deviceID
			},
			id: "YJZ",
			latitude: latLng2018[0],
			longitude: latLng2018[1],
			speed: 18
		},
		{
			dateTime: time2019,
			device: {
				id: deviceID
			},
			id: "YJZ",
			latitude: latLng2019[0],
			longitude: latLng2019[1],
			speed: 36
		},
		{
			dateTime: time2020,
			device: {
				id: deviceID
			},
			id: "YJZ",
			latitude: latLng2020[0],
			longitude: latLng2020[1],
			speed: 60
		}
	],
	toVersion: "0000000000000006",
};

const sampleExceptionEventData = {
	data: [{
		activeFrom: time2018,
		activeTo: time2019,
		device: {
			id: deviceID
		},
		id: "YJZ",
		diagnostic: {
			id: "AtWork"
		},
		distance: 360,
		driver: {
			id: "YJZ"
		},
		duration: "06:18:36",
		rule: { id: "YJZAtWork" },
		version: "0000000005c3284b"
	}],
	toVersion: "0000000000000012",
};

export function getTestLogRecordsData() {
	return { ...sampleLogRecordsData };
};

export function getTestExceptionEventData() {
	return { ...sampleExceptionEventData };
};

export function getTestFeedData() {
	return [
		getTestLogRecordsData(),
		getTestExceptionEventData()
	];
};

// const requestedFeedTypes = [LOGRECORD, EXCEPTIONEVENT];

// const samplelogRecordsData = {
// 	// change keys to seconds start of day?
// 	deviceID: {
// 		orderedDateTimes: [
// 			date2018,
// 			date2019,
// 			date2020
// 		],

// 		[date2018]: {
// 			latLng: [latLng2018.lat, latLng2018.lng],
// 			speed: 18
// 		},
// 		[date2019]: {
// 			latLng: [latLng2019.lat, latLng2019.lng],
// 			speed: 36
// 		},
// 		[date2020]: {
// 			latLng: [latLng2020.lat, latLng2020.lng],
// 			speed: 60
// 		}
// 	}
// };
// const sampleFeedData = [{
// 		data: [{
// 				dateTime: date2018,
// 				device: {
// 					id: deviceID
// 				},
// 				id: "YJZ",
// 				latitude: latLng2018.lat,
// 				longitude: latLng2018.lng,
// 				speed: 18
// 			},
// 			{
// 				dateTime: date2019,
// 				device: {
// 					id: deviceID
// 				},
// 				id: "YJZ",
// 				latitude: latLng2019.lat,
// 				longitude: latLng2019.lng,
// 				speed: 36
// 			},
// 			{
// 				dateTime: date2020,
// 				device: {
// 					id: deviceID
// 				},
// 				id: "YJZ",
// 				latitude: latLng2020.lat,
// 				longitude: latLng2020.lng,
// 				speed: 60
// 			}
// 		],
// 		toVersion: "0000000000000006",
// 	},
// 	{
// 		data: [{
// 			activeFrom: date2018,
// 			activeTo: date2019,
// 			device: {
// 				id: deviceID
// 			},
// 			id: "YJZ",
// 			diagnostic: "AtWork",
// 			distance: 360,
// 			driver: "YJZ",
// 			duration: "06:18:36",
// 			rule: { id: "YJZAtWork" },
// 			version: "0000000005c3284b"
// 		}],
// 		toVersion: "0000000000000012",
// 	}
// ];
