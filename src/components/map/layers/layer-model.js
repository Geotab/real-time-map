import L from "leaflet";
import storage from "../../../dataStore";

const LayerModel = {
  layerList: {
    movingLayer: L.layerGroup(),
    // pathLayer: L.layerGroup(),
    exceptionLayer: L.layerGroup()
  },

  // Built in leaflet layer controls
  // layerControl: undefined,

  initLayers() {
    this.layerList.movingLayer.addTo(storage.map);
    this.layerList.stoppedLayer = this.layerList.movingLayer;
    // this.createLayerControls();
    L.control.scale().addTo(storage.map);
  },

  // createLayerControls() {

  //   const movingLayerTitle = "All";
  //   const exceptionLayerTitle = "Exceptions";

  //   const overlayGroups = {
  //     [movingLayerTitle]: this.layerList.movingLayer,
  //     [exceptionLayerTitle]: this.layerList.exceptionLayer
  //   };

  //   this.layerControl = L.control.layers(null, overlayGroups);
  //   this.layerControl.addTo(storage.map);
  // },

  createNewLayer(name) {
    this.layerList[name] = L.layerGroup();
    this.layerList[name].addTo(storage.map);
    // this.layerControl.addOverlay(this.layerList[name], name);
    // this.layerControl.expand();
  },

  addToLayer(name, obj) {
    if (!this.layerList.hasOwnProperty(name)) {
      this.createNewLayer(name);
    }
    this.layerList[name].addLayer(obj);
  },

  removeFromLayer(name, obj) {
    this.layerList[name].removeLayer(obj);
  },

  isInLayer(name, obj) {
    return this.layerList.hasOwnProperty(name) ?
      this.layerList[name].hasLayer(obj) :
      false;
  },

  removeFromAllLayers(obj) {
    Object.values(this.layerList).forEach(layer => {
      layer.removeLayer(obj);
    });
  },

  addToAllLayer(obj) {
    try {
      this.layerList.movingLayer.addLayer(obj);
    } catch (error) {
      console.warn("67", obj);
    }
  },

  addToStopppedLayer(obj) {
    this.layerList.movingLayer.addLayer(obj);
  },

  showLayer(name) {
    this.layerList[name].addTo(storage.map);
  },

  hideAllLayers() {
    Object.values(this.layerList).forEach(layer => {
      layer.remove();
    });
  },

  reset() {
    Object.values(this.layerList).forEach(layer => {
      layer.clearLayers();
    });
  }
};
export default LayerModel;
