import { fromEvent } from "rxjs";
import { map, debounceTime } from "rxjs/operators";
import { getRulesByName, getBlobStorage, saveBlobStorage } from "../../../services/api/helpers";
import storage from "../../../dataStore";
import { filterByVisibility } from "../utils/config-helpers";

export const exceptionSearch = {
	exceptionResultsCache: {},
	displayList: {},

	get searchInput() {
		return document.getElementById("RTM-exception-search-bar");
	},

	init(mapPropsToComponent) {
		// Init rxjs debounce search.
		const searchInputObservable$ = fromEvent(exceptionSearch.searchInput, "input").pipe(map(i => i.currentTarget.value));
		const debouncedInput = searchInputObservable$.pipe(debounceTime(250));
		debouncedInput.subscribe((searchInput) => exceptionSearch.buildSearchList(searchInput, mapPropsToComponent));
	},

	loadSavedExceptionConfig(mapPropsToComponent) {

		return getBlobStorage().then(val => {
			exceptionSearch.searchInput.value = "";
			const cachedExceptions = val
				.map(e => JSON.parse(e.data))
				.filter(e => e.configData.type === "Exception")
				.sort((a, b) => b.date - a.date);

			if (cachedExceptions.length > 0) {
				const cachedException = cachedExceptions[0].configData;
				exceptionSearch.displayList = cachedException.typeData;
				storage.selectedExceptions = filterByVisibility(exceptionSearch.displayList);
				exceptionSearch.buildExceptionDisplayList(mapPropsToComponent);
			}
		}).catch(error =>
			console.warn("Server is unavailable, please try again later: ", error)
		);
	},

	buildSearchList(searchInput, mapPropsToComponent) {
		return getRulesByName(searchInput).then(ruleList => {

			ruleList.forEach(rule => {
				let {
					color,
					name,
					id,
					baseType
				} = rule;

				if (baseType === "Stock") { name += " (Default)"; };
				const visible = true;

				exceptionSearch.exceptionResultsCache[name] = { color, name, id, visible, baseType };
			});

			mapPropsToComponent(Object.values(exceptionSearch.exceptionResultsCache));
		});
	},

	handleItemSelected(event, mapPropsToComponent) {
		event.preventDefault();
		exceptionSearch.saveSelectedValue(mapPropsToComponent);
	},

	saveSelectedValue(mapPropsToComponent) {
		const { value } = exceptionSearch.searchInput;
		const exceptionData = exceptionSearch.exceptionResultsCache[value];

		if (exceptionData) {
			exceptionSearch.displayList[exceptionData.id] = exceptionData;
			exceptionSearch.saveConfig(mapPropsToComponent);
			exceptionSearch.searchInput.value = "";
		}
		return exceptionData;
	},

	buildExceptionDisplayList(mapPropsToComponent) {
		mapPropsToComponent(Object.values(exceptionSearch.displayList)
			.filter(ruleData => ruleData.id && ruleData.name));
	},

	deleteItemFromExceptionList(id, mapPropsToComponent) {
		delete exceptionSearch.displayList[id];
		exceptionSearch.saveConfig(mapPropsToComponent);
	},

	saveConfig(mapPropsToComponent) {
		storage.selectedExceptions = filterByVisibility(exceptionSearch.displayList);
		saveBlobStorage("Exception", exceptionSearch.displayList);
		exceptionSearch.buildExceptionDisplayList(mapPropsToComponent);
		storage.dateKeeper$.update();
	},

	toggleExceptionVisibility(ruleID, mapPropsToComponent) {
		const selectedException = exceptionSearch.displayList[ruleID];
		selectedException.visible = !selectedException.visible;
		exceptionSearch.saveConfig(mapPropsToComponent);
	},
	deleteAllItems(mapPropsToComponent) {
		exceptionSearch.displayList = {};
		exceptionSearch.saveConfig(mapPropsToComponent);
	},
	setVisibilityForAllItems(visibility, mapPropsToComponent) {
		Object.values(exceptionSearch.displayList)
			.forEach(selectedItem =>
				selectedItem.visible = visibility
			);
		exceptionSearch.saveConfig(mapPropsToComponent);
	}
};
