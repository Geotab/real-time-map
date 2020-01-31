import { logRecordsData } from "../../../dataStore/map-data";
import { createObjectKeyIfNotExist, insertIntoOrderedArray } from "../../../utils/helper";
import { createDeviceMarker } from "../../../components/map/markers";

export function processLogRecords(data) {
	console.log("New Data Length:", data.length);
	data.map(processDeviceData)
		.filter(Boolean) //Remove undefined
		.map(deviceID => createDeviceMarker(deviceID)); //Init first seen device markers.
}

//Process it into a format we can use, and initilize device markers.
export function processDeviceData(device) {
	const {
		dateTime,
		device: {
			id: deviceID
		},
		id,
		latitude: lat,
		longitude: lng,
		speed,
	} = device;

	const roundedDateTime = new Date(dateTime);
	roundedDateTime.setMilliseconds(0);
	const dateTimeInt = roundedDateTime.getTime();

	const latLng = [lat, lng];
	const data = { latLng, speed };
	const firstDeviceMarker = saveDeviceDataToMemory(deviceID, dateTimeInt, data);

	if (firstDeviceMarker) {
		return deviceID;
	}
}

export function saveDeviceDataToMemory(deviceID, dateTime, data) {
	const initDeviceMarker = createObjectKeyIfNotExist(logRecordsData, deviceID);
	const deviceObject = logRecordsData[deviceID];

	if (initDeviceMarker) {
		deviceObject.orderedDateTimes = [];
	}

	const initDeviceDateTime = createObjectKeyIfNotExist(deviceObject, dateTime);
	if (initDeviceDateTime) {
		insertIntoOrderedArray(deviceObject.orderedDateTimes, dateTime);
	};

	deviceObject[dateTime] = data;
	return initDeviceMarker;
}
