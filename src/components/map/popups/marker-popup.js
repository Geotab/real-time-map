import L from "leaflet";
import storage from "../../../dataStore";
import { devicesPropertyData } from "../../../dataStore/map-data";

import {
	retrieveStatusInfo,
	filterMarkerButton,
	getStrongText,
	getGroupsForDeviceID
} from "./popup-helpers";

const secondsBetweenUpdate = 3;

export function initMarkerPopup(deviceMarker) {
	const {
		mapMarker,
		deviceID
	} = deviceMarker;

	const popup = L.popup({
		// keepInView: true,
		maxHeight: 360,
		className: "markerPopups",
		offset: [0, 0]
	});

	popup.setContent(filterMarkerButton(deviceID) + getStrongText("Getting Data"));

	mapMarker.bindPopup(popup);

	const constructors = {
		mapMarker,
		popup,
		deviceID,
	};

	const newMarkerPopup = {
		...markerPopupModel,
		...constructors
	};

	mapMarker.on("popupopen", () => {
		newMarkerPopup.resetAnimation();
		newMarkerPopup.keepPopupCentered();
		newMarkerPopup.nextUpdateTick = Number.POSITIVE_INFINITY;
		newMarkerPopup.updatePopup();
	});

	newMarkerPopup.setTransitionAnimation();
	deviceMarker.popupModel = newMarkerPopup;
}

export const markerPopupModel = {
	mapMarker: undefined,
	popup: undefined,
	deviceID: undefined,
	nextUpdateTick: Number.POSITIVE_INFINITY,

	updatePopup(speed) {

		if (!this.mapMarker.isPopupOpen()) {
			return;
		}

		this.setTransitionAnimation();
		this.keepPopupCentered();

		this.nextUpdateTick++;
		const ticksBetweenUpdate = 1000 / storage.dateKeeper$.getPeriod() * secondsBetweenUpdate;

		if (this.nextUpdateTick >= ticksBetweenUpdate) {
			this.nextUpdateTick = 0;
			this.updatePopupContent(speed);
		}
	},

	updatePopupContent(speed) {

		const dataPromises = [
			getGroupsForDeviceID(this.deviceID),
			retrieveStatusInfo(this.deviceID)
		];

		Promise.all(dataPromises).then(val => {

			const groupsData = val[0];
			const statusData = val[1];

			const {
				name
			} = devicesPropertyData[this.deviceID];

			this.popup.setContent(createMarkerPopupText(this.deviceID, groupsData, speed, name, statusData));

			this.setTransitionAnimation();
			this.keepPopupCentered();
		});

	},

	setTransitionAnimation() {
		const period = storage.dateKeeper$.getPeriod();
		const element = this.popup.getElement();
		if (element && !element.style[L.DomUtil.TRANSITION] && period > 150) {
			element.style[L.DomUtil.TRANSITION] = `transform ${period / 1000}s linear`;
		}
	},

	resetAnimation() {
		const element = this.popup.getElement();
		if (element) {
			element.style[L.DomUtil.TRANSITION] = "";
		}
	},

	keepPopupCentered() {

		const latLng = this.mapMarker.getLatLng();
		const duration = storage.dateKeeper$.getPeriod() / 1000;

		storage.map.panTo(latLng, {
			duration,
			animate: true,
			easeLinearity: 1,
			noMoveStart: true
		});
	}

};

export function createMarkerPopupText(deviceID, groups, speed, name, statusData) {

	const popTextFactory = [];

	const cleanedName = name.replace("'", "\\'");
	popTextFactory.push(filterMarkerButton(deviceID, cleanedName));
	popTextFactory.push(getStrongText(cleanedName));

	popTextFactory.push(createGroupNamesDiv(groups));
	popTextFactory.push(createSpeedRow(speed));
	popTextFactory.push(createStatusDataDiv(statusData));
	return popTextFactory.filter(Boolean).join("");
}

export function createGroupNamesDiv(groups) {
	if (groups) {
		const groupNameList = Object.values(groups).map(group => group.name).filter(Boolean);
		if (groupNameList.length) {
			return `<p class="RTM-popupGrouped"> ${groupNameList.join()} </p>`;
		}
	}
}

export function createStatusDataDiv(statusData) {

	let statusDiv = "";

	if (statusData && Object.keys(statusData).length > 0) {

		statusDiv += '<p class="RTM-BorderedTextBox">' + getStrongText("Status Data:");

		const statusIDs = Object.keys(statusData);
		statusIDs.sort();

		statusIDs
			.map(statusID => statusData[statusID])
			.map(createStatusDataRow)
			.forEach(row => statusDiv += row);

		statusDiv += "</p>";
	}

	return statusDiv;
}

export function createStatusDataRow(statusRow) {

	const {
		name,
		data,
		cleanedUnitOfMeasure
	} = statusRow;

	return `<br/> ${name}: ${data} ${cleanedUnitOfMeasure}`;
}

export function createSpeedRow(speed) {
	if (speed) {
		return `Speed: ${speed} km/h`;
	}
}

