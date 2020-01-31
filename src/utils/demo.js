import { initDemoData, generatedDevices } from "./demo-data";

const feedBufferSeconds = 360;

export const fakeUserData = {
	companyAddress: "fakeCompanyAddress"
};

export const fakeSession = {
	userName: "demoUserName",
	database: "demoDatabase",
	sessionId: "demoSessionId"
};

export const typeNameHandlers = {
	"AddInData": [],
	"User": [fakeUserData],

	LogRecord(fromDate, toDate, deviceSearch) {

		// const msDiff = new Date() - new Date(fromDate);
		// const secondsDiff = Math.round(msDiff / 1000);

		const results = Object.values(generatedDevices).flatMap(device =>
			device.getLogRecordForTimeRange(fromDate, toDate)
		);

		// const totalRecords = Math.min(1000, secondsDiff / 10);
		// const newID = createNewDevice();

		// console.warn('fromDate', createFakeLogRecords(fromDate, 1, 100), secondsDiff);
		// const { length } = route1;
		// // console.warn('25', length);

		// let currentID = 1;
		// let currentIndex = 0;

		// const results = [generateLogRecord(fromDate, currentIndex, currentID)];

		// while (isGetFeed && currentIndex < 12) {
		// 	results.push(generateLogRecord(fromDate, currentIndex, currentID));
		// 	currentIndex++;
		// }
		return results;
	},

	ExceptionEvent() {
		return [];
	}
};

function getCurrentTime() {

	return new Date().getTime();
}

export const callNameHandlers = {

	Get(parameters) {
		const {
			typeName
		} = parameters;

		const result = typeNameHandlers[typeName];
		return result;
	},

	GetCoordinates() {
		const y = 43.515228;
		const x = -79.683523;
		return [{ x, y }];
	},

	GetFeed(parameters) {
		const {
			typeName,
			fromVersion,
			search
		} = parameters;

		const {
			search: {
				fromDate
			}
		} = parameters;

		// console.warn(92, typeName, fromVersion);

		const result = {
			data: [],
			toVersion: fromVersion
		};

		const newDataNeeded = fromVersion === undefined || fromVersion < getCurrentTime();

		if (newDataNeeded) {

			const newVersion = getCurrentTime() + feedBufferSeconds * 1000;
			const startingTime = fromVersion ? fromVersion : dateToTime(fromDate);

			const typeHandleFunction = typeNameHandlers[typeName];
			result.data = typeHandleFunction(startingTime, newVersion, search);

			result.toVersion = newVersion;
		}

		return result;
		// if (toVersion === undefined) {

		// 	const result = {
		// 		data,
		// 		toVersion
		// 	};

		// 	return result;
		// }

		// fromVersion += 60000;

		// const typeHandleFunction = typeNameHandlers[typeName];
		// const data = typeHandleFunction(search, true);

		// const result = {
		// 	data,
		// 	fromVersion
		// };

		// console.warn(105, fromVersion < new Date().getTime());

		// if (fromVersion < new Date().getTime()) {
		// 	// console.warn('82', result);
		// 	return result;
		// }

	}
};

export const api = {

	call(call, parameters, resolve, reject) {
		const callHandleFunction = callNameHandlers[call];
		const result = callHandleFunction(parameters);
		// console.warn('51', call, parameters, resolve, reject, result);
		resolve(result);
	},

	multiCall(calls, resolve, reject) {

		const results = [];

		calls.map(eachCall => {
			// console.warn('70', eachCall);
			const [callName, parameters] = eachCall;
			this.call(callName, parameters, callResult => results.push(callResult), reject);
		});

		// console.warn(154, results);
		resolve(results);
	},

	getSession(callBack) {
		callBack(fakeSession);
	}

};

export const geotab = {

	addin: {

		set realTimeMap(RTM) {

			initDemoData();

			const { initialize, focus, blur } = RTM();

			const state = {};
			const callback = () => {};
			document.body.style.height = "100vh";

			initialize(api, state, callback);

		}

	},

};

export function dateToTime(date) {
	return new Date(date).getTime();
}
