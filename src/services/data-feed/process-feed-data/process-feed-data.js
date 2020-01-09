import { processLogRecords } from "./process-log-records";
import { LOGRECORD, EXCEPTIONEVENT } from "../../../constants/feed-type-names";
import { apiConfig } from "../../../dataStore/api-config";
import processExceptionEvents from "./process-exception-events";


const dataProcessingFunctions = {
  [LOGRECORD]: processLogRecords,
  [EXCEPTIONEVENT]: processExceptionEvents
};

export function processFeedData(result) {
  // console.log(result);
  result.forEach((typeResult, index) => {
    const processingFunction = dataProcessingFunctions[apiConfig.feedTypesToGet[index]];
    if (processingFunction) {
      processingFunction(typeResult.data);
    }
  });
}
