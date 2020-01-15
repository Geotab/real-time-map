import L from "leaflet";
import { userAPI } from "../../services/api/user-api";
import { userInfo } from "../../dataStore/api-config";
import storage from "../../dataStore";
import { resetTransitionAnimation } from "../../utils/helper";

let MAPBOX;
try {
	MAPBOX = require("../../../map-box-token.key.json");
}
catch (ex) {
	MAPBOX = {
		ACCESS_TOKEN: false
	};
}

export const mapModel = {

	handleMapCreated(element) {
		storage.map = new L.Map(element, {
			doubleClickZoom: false,
			markerZoomAnimation: false,
			worldCopyJump: true
		});
		if (MAPBOX && MAPBOX.ACCESS_TOKEN) {
			mapModel.addMapBoxTileLayer(storage.map);
		}
		else {
			mapModel.addOSMTileLayer(storage.map);
		}

		storage.map.on("mousedown", () => {
			storage.map.closePopup();
		});
		storage.map.on("zoom", resetTransitionAnimation);
	},

	addMapBoxTileLayer: map => {
		L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${MAPBOX.ACCESS_TOKEN}`, {
			attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https: //www.mapbox.com/\">Mapbox</a>",
			minZoom: storage.minZoom,
			maxZoom: storage.maxZoom,
			id: "mapbox.streets",
			accessToken: MAPBOX.ACCESS_TOKEN
		}).addTo(map);
	},

	addOSMTileLayer(map) {
		L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			subdomains: ["a", "b", "c"],
			minZoom: storage.minZoom,
			maxZoom: storage.maxZoom,
		}).addTo(map);
	},

	setMapToCompanyAddress() {
		return userAPI.getUserInfo(userInfo.userName)
			.then(result => {
				userAPI.getCoordinatesFromAddress(result[0].companyAddress)
					.then(result =>
						mapModel.mapSetView(L.latLng(result[0].y, result[0].x))
					)
					.catch(() => mapModel.mapSetView(0));
			})
			.catch(() => alert("Server is unavailable, please try again later."));
	},

	mapSetView(latlng) {
		if (latlng.length === 0) {
			storage.map.setView([43.515228, -79.683523], 12);
			console.log("Default location set to user location.");
		}
		else {
			storage.map.setView(latlng, 12);
			console.log("Location set to company address.");
		}
	}

};
