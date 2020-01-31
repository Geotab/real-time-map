import { apiConfig } from "../../../dataStore/api-config";
import { processLogRecords } from "./process-log-records";
import { processExceptionEvents } from "./process-exception-events";
import { LOGRECORD, EXCEPTIONEVENT } from "../../../constants/feed-type-names";

export const dataProcessingFunctions = {
	[LOGRECORD]: processLogRecords,
	[EXCEPTIONEVENT]: processExceptionEvents
};

export function processFeedData(result) {

	// console.warn(12, result);
	result.forEach((typeResult, index) => {

		const feedTypeName = apiConfig.feedTypesToGet[index];
		const processingFunction = dataProcessingFunctions[feedTypeName];
		if (processingFunction) {
			processingFunction(typeResult.data);
		}

	});
}
