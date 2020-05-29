import { fromEvent } from "rxjs";
import { map, debounceTime } from "rxjs/operators";
import { markerList } from "../../../dataStore/map-data";
import { getDevicesInGroups, createGroupsByNameCall, createDeviceByNameCall, makeAPIMultiCall, getBlobStorage, saveBlobStorage, setBlobStorage } from "../../../services/api/helpers";
import { showSnackBar } from "../../../components/snackbar/snackbar";
import storage from "../../../dataStore";
import layerModel from "../../map/layers";

export const deviceSearch = {
   shown: true,
   deviceResultsCache: {},
   selectedIDS: {},

   get searchInput() {
      return document.getElementById("RTM-vehicle-search-bar");
   },

   init(mapPropsToComponent) {
      // Init rxjs debounce search.
      const searchInputObservable = fromEvent(deviceSearch.searchInput, "input").pipe(map(i => i.currentTarget.value));
      const debouncedInput = searchInputObservable.pipe(debounceTime(250));
      debouncedInput.subscribe((searchInput) => deviceSearch.buildSearchList(searchInput, mapPropsToComponent));
   },

   loadSavedDeviceConfig(mapPropsToComponent) {

      return getBlobStorage().then(val => {
         if (val.length === 0) { return; }
         const cachedDevices = JSON.parse(val[0].data);

         if (cachedDevices.configData.Vehicle) {
            deviceSearch.selectedIDS = cachedDevices.configData.Vehicle;
            deviceSearch.applyFilter();
            deviceSearch.buildDeviceDisplayList(mapPropsToComponent);
         }
      });
   },

   buildSearchList(searchInput, mapPropsToComponent) {

      const nameSearchMultiCall = [
         createDeviceByNameCall(searchInput),
         createGroupsByNameCall(searchInput)
      ];

      return makeAPIMultiCall(nameSearchMultiCall).then(results => {
         // deviceList = results[0];
         results[0]
            .map(deviceSearch.saveDeviceDataToCache);
         // groupList = results[1];
         results[1]
            .map(deviceSearch.saveGroupDataToCache);
         mapPropsToComponent(Object.values(deviceSearch.deviceResultsCache));
      });

   },

   saveDeviceDataToCache(deviceData) {
      const data = {};
      ["id", "name", "groups"].forEach(prop => data[prop] = deviceData[prop]);
      data.visible = true;
      deviceSearch.deviceResultsCache[data.name] = data;
      return data;
   },

   saveGroupDataToCache(deviceData) {
      const data = {};
      ["id", "name", "color"].forEach(prop => data[prop] = deviceData[prop]);
      data.visible = true;
      data.name += " (Group)";

      deviceSearch.deviceResultsCache[data.name] = data;
      return data;
   },

   buildDeviceDisplayList(mapPropsToComponent) {
      deviceSearch.mapPropsToComponent = mapPropsToComponent;
      mapPropsToComponent(Object.values(deviceSearch.selectedIDS)
         .filter(device => device.id && device.name));
   },

   handleItemSelected(event, mapPropsToComponent) {
      event.preventDefault();
      deviceSearch.saveSelectedValue(mapPropsToComponent);
   },

   saveSelectedValue(mapPropsToComponent) {

      const { value } = deviceSearch.searchInput;
      if (!deviceSearch.deviceResultsCache.hasOwnProperty(value)) {
         return;
      }

      const deviceData = deviceSearch.deviceResultsCache[value];
      deviceData.visible = true;
      const {
         id,
         name,
         groups,
         color,
         visible
      } = deviceData;

      if (color) { //It's a group
         deviceSearch.selectedIDS[id] = { id, name, color, visible };
      }
      else {
         deviceSearch.selectedIDS[id] = { id, name, groups, visible };
      }

      deviceSearch.searchInput.value = "";
      deviceSearch.saveConfig(mapPropsToComponent);
      return deviceData;
   },

   deleteItemFromdeviceList(id, mapPropsToComponent) {
      delete deviceSearch.selectedIDS[id];
      deviceSearch.saveConfig(mapPropsToComponent);
   },

   deleteAllItems(mapPropsToComponent) {
      deviceSearch.selectedIDS = {};
      deviceSearch.saveConfig(mapPropsToComponent);
   },

   saveConfig(mapPropsToComponent) {
      storage.setBlobStorageObj ? setBlobStorage("Vehicle", deviceSearch.selectedIDS) : saveBlobStorage("Vehicle", deviceSearch.selectedIDS);

      deviceSearch.applyFilter();
      deviceSearch.buildDeviceDisplayList(mapPropsToComponent);
   },

   applyFilter() {
      _getDeviceList(deviceSearch.selectedIDS).then(() => {
         _applyDeviceFilter(Object.keys(storage.selectedDevices));
      });
   },
   showAll(mapPropsToComponent) {
      Object.values(deviceSearch.selectedIDS)
         .forEach(selectedDevice =>
            selectedDevice.visible = true
         );
      deviceSearch.saveConfig(mapPropsToComponent);
   },
   hideAll(mapPropsToComponent) {
      Object.values(deviceSearch.selectedIDS)
         .forEach(selectedDevice =>
            selectedDevice.visible = false
         );
      deviceSearch.saveConfig(mapPropsToComponent);
   },
   toggleDeviceVisibility(id, mapPropsToComponent) {
      const selectedDevice = deviceSearch.selectedIDS[id];
      selectedDevice.visible = !selectedDevice.visible;
      deviceSearch.saveConfig(mapPropsToComponent);
   },
   zoomIntoDevice(id) {
      const deviceMarker = markerList[id];
      if (deviceMarker) {
         const newZoomLevel = Math.max(Math.min(storage.map.getZoom() + 1, 18), 15);
         storage.map.flyTo(deviceMarker.currentlatLng, newZoomLevel);
      } else {
         showSnackBar("Sorry, no current day data for selected vehicle.");
      }
   }
};

export function _getDeviceList(selectedIDs) {
   storage.selectedDevices = {};
   return Promise.all(Object.values(selectedIDs).map(data => {
      const {
         id,
         color,
         visible
      } = data;
      if (!visible) {
         return Promise.resolve("done");
      }

      if (color) { //It's a group
         return getDevicesInGroups([{ id }]).then(devices =>
            devices.forEach(device => {
               const {
                  id,
                  name,
                  groups
               } = device;
               storage.selectedDevices[id] = { id, name, groups, visible: true };
            })
         );

      }
      else {
         storage.selectedDevices[id] = data;
         return Promise.resolve("done");
      }
   }));
}

window.addDeviceToFilter = (id, name = "Go Device") => {
   deviceSearch.selectedIDS[id] = { id, name, visible: true };
   deviceSearch.saveConfig(deviceSearch.mapPropsToComponent);
   openPopup();
};

export function _applyDeviceFilter(deviceIDS) {
   // console.log(deviceIDS);
   layerModel.hideAllLayers();

   if (deviceIDS.length === 0) {
      layerModel.showLayer("movingLayer");
      return;
   }

   const layerName = "Filter";

   if (!layerModel.layerList.hasOwnProperty(layerName)) {
      layerModel.createNewLayer(layerName);
   }

   layerModel.layerList[layerName].clearLayers();
   layerModel.showLayer(layerName);

   deviceIDS.forEach(deviceID => {
      const deviceMarker = markerList[deviceID];
      if (deviceMarker) {
         deviceMarker.setLayer(layerName);
      }
   });
}

function openPopup() {
   const collapseButton = document.getElementsByClassName("collapsible");
   const vehicleTab = document.getElementById("RTM-VehicleTitle");
   if (!collapseButton[0].classList.contains("active")) {
      collapseButton[0].click();
      vehicleTab.click();
   }
}
