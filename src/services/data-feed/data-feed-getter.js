import { makeAPIMultiCall } from "../api/helpers";
import { initPaths } from "../../components/map/paths";
import storage from "../../dataStore";
import { resetTransitionAnimation, getDayPerentage } from "../../utils/helper";
import { configStorage } from "../../dataStore/database/config-storage";
import { markerList } from "../../dataStore/map-data";
import { processFeedData } from "./process-feed-data";
import { apiConfig } from "../../dataStore/api-config";
import { showSnackBar } from "../../components/snackbar/snackbar";
import { progressBar } from "../../components/progress-bar/progress-indicator";
import { throttleTime } from "rxjs/operators";

export const feedDataGetter = {

	init(fromDate, feedTypes, resultsLimit = 60000, search) {
		this.fromDate = fromDate;
		this.feedTypes = feedTypes;
		this.resultsLimit = resultsLimit; //Maximum 50000
		this.lastFeedVersions = {};
		this.feedTypes.forEach(typeName =>
			this.lastFeedVersions[typeName] = undefined
		);
		this.search = search ? search : { fromDate };
	},

	removeFeedType(typeName) {
		this.feedTypes = this.feedTypes.filter(value =>
			value != typeName
		);
	},

	addFeedType(typeName) {
		this.feedTypes.push(typeName);
	},

	getFeedData() {
		const multiCallList = this.createMultiCallList();

		return new Promise((resolve, reject) => {
			makeAPIMultiCall(multiCallList).then(result => {
				this.updateFeedVersions(result);
				// console.warn('42', result);
				resolve(result);
			});

			this.cancelRunner = () => {
				reject("Canceled");
			};
		});
	},

	updateFeedVersions(result) {
		// console.warn(53, result);
		result.forEach((value, i) => {
			const typeName = this.feedTypes[i];
			this.lastFeedVersions[typeName] = value.toVersion;
		});
	},

	createMultiCallList() {
		const APICalls = this.feedTypes.map(typeName => ["GetFeed",
			{
				"typeName": typeName,
				"fromVersion": this.lastFeedVersions[typeName],
				"resultsLimit": this.resultsLimit,
				"search": this.search
			}
		]);

		return APICalls;
	},
};

export function initRealTimeFeedRunner() {

	storage.realTimeFeedDataGetter = { ...feedDataGetter };
	storage.realTimeFeedDataGetter.init(
		new Date(storage.startDate.getTime() - 600000), //Get data 10 min before actual start time for accurate display
		apiConfig.feedTypesToGet,
		3600
	);

	realTimefeedRunner();

	if (!storage.isLiveDay) {
		return;
	}

	const getDataEvery6Seconds = storage.dateKeeper$.observable.pipe(
		throttleTime(6666)
	);

	getDataEvery6Seconds.subscribe(realTimefeedRunner);
}

export function realTimefeedRunner() {
	storage.realTimeFeedDataGetter.getFeedData()
		.then(processFeedData)
		.catch(reason => console.warn("realTimefeedRunner Canceled.", reason));
}

export function initHistoricalFeedRunner() {

	showSnackBar("Fetching Historical Data");
	progressBar.update(0.1);

	configStorage.getItem("historicalFeedDataList").then(indexedDBVal => {

		const historicalFeedDataCache = getFeedDataCache(indexedDBVal);

		storage.HistoricalFeedDataGetter = { ...feedDataGetter };
		storage.HistoricalFeedDataGetter.init(
			new Date(historicalFeedDataCache.timeStamp),
			apiConfig.feedTypesToGet,
			apiConfig.resultsLimit
		);

		historicalFeedRunner(historicalFeedDataCache);
	});

}

export function getFeedDataCache(indexedDBVal = null) {

	if (indexedDBVal && timeWithinToday(indexedDBVal.timeStamp)) {

		const { timeStamp } = indexedDBVal;
		console.log("Retrieved historical data up to: " + new Date(timeStamp));
		progressBar.update(getDayPerentage(timeStamp));
		return indexedDBVal;

	}
	else {

		const historicalFeedDataCache = apiConfig.feedTypesToGet.map(type => {
			return {
				data: [],
				// toVersion: 0,
				type
			};
		});

		historicalFeedDataCache.timeStamp = storage.dayStart.getTime();

		return historicalFeedDataCache;
	}
}

export function timeWithinToday(time) {
	return storage.dayStart.getTime() < time && time < storage.dayEnd.getTime();
}

export function historicalFeedRunner(historicalFeedDataList) {
	storage.HistoricalFeedDataGetter.getFeedData()
		.then(feedData => {
			feedData.forEach((element, index) => historicalFeedDataList[index].data = [
				...historicalFeedDataList[index].data,
				...element.data
			]);

			const latestData = feedData[0].data;

			if (latestData.length > 0 && latestData[0].dateTime <= storage.dayEnd.toISOString()) { //keep getting historical data until up to date.

				const { length } = latestData;
				const { dateTime } = latestData[length - 1];

				const dayPerentage = getDayPerentage(dateTime);

				if (dayPerentage && dayPerentage < 1) {
					progressBar.update(dayPerentage);
				}

				historicalFeedRunner(historicalFeedDataList);

			}
			else {

				historicalFeedDataList.timeStamp = latestData.length ?
					Math.min(new Date(latestData[0].dateTime).getTime(), storage.dayEnd.getTime()) :
					storage.startDate.getTime();
				historicalFeedDataComplete(historicalFeedDataList);
			}
		})
		.catch(reason => console.warn("HistoricalFeedDataGetter Canceled.", reason));
}

export function historicalFeedDataComplete(historicalFeedDataList) {
	processFeedData(historicalFeedDataList);
	resetTransitionAnimation();

	delete storage.HistoricalFeedDataGetter;
	storage.historicalComplete = true;

	Object.values(markerList)
		.forEach(marker => {
			marker.veryifyDateTimeIndex();
			marker.initExceptions();
			initPaths(marker);
		});

	if (storage.isLiveDay) {
		configStorage.setItem("historicalFeedDataList", historicalFeedDataList).then(() => console.log("Updated historical data saved!"));
	}

	progressBar.update(1);
	showSnackBar("Historical Data Load Complete");

	storage.dateKeeper$.update();
	resetTransitionAnimation();
}
