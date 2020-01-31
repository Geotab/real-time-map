import { processLogRecords } from "./process-log-records";
import * as markers from "../../../components/map/markers/marker-model";

import { spyOnFunction } from "../../../../tests/utils/test-helpers";
import { deviceID, latLng2018, time2018 } from "../../../../tests/utils/mock-device";
import { getTestLogRecordsData } from "../../../../tests/utils/mock-feed";

describe("processLogRecords Tests", () => {

	let testLogRecordsData;

	beforeAll(() => {
		jest.useFakeTimers();
		spyOnFunction(markers, "createDeviceMarker");
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	beforeEach(() => {
		testLogRecordsData = getTestLogRecordsData().data;
	});

	test("processLogRecords", () => {

		processLogRecords(testLogRecordsData);
		expect(markers.createDeviceMarker).toHaveBeenCalledWith(deviceID);
	});

	test("processLogRecords", () => {

		const sameTimeData = {
			dateTime: time2018,
			device: {
				id: deviceID
			},
			id: "YJZ",
			latitude: latLng2018[0],
			longitude: latLng2018[1],
			speed: 18
		};
		testLogRecordsData.push(sameTimeData);

		processLogRecords(testLogRecordsData);
		expect(markers.createDeviceMarker).toHaveBeenCalledWith(deviceID);
	});

});
