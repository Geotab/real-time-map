import L from "leaflet";
import LayerModel from "./layer-model";
import storage from "../../../dataStore";
import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper
} from "../../../../tests/utils/test-helpers";


describe("Exception path Tests", () => {

  const testLayerName = "testLayerName";

  beforeAll(() => {
    jest.useFakeTimers();

    mockMap(storage, 12, true);

    spyOnFunction(L.control, "scale", () => {
      return {
        addTo: jest.fn()
      };
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const fakeLayer = {
      addTo: jest.fn(),
      addLayer: jest.fn(),
      removeLayer: jest.fn(),
      hasLayer: jest.fn(),
      remove: jest.fn(),
      clearLayers: jest.fn(),
    };

    // Object.keys(LayerModel.layerList).forEach(layerName => {
    //   LayerModel.layerList[layerName] = { ...fakeLayer };
    // });

    LayerModel.layerList = {
      movingLayer: fakeLayer,
      [testLayerName]: fakeLayer
    };

  });

  test("Construction", () => {
    LayerModel.initLayers();
    expect(L.control.scale).toHaveBeenCalled();
  });

  test("createNewLayer", () => {

    const newLayer = "newLayer";
    expect(LayerModel.layerList.hasOwnProperty(newLayer)).toBe(false);

    LayerModel.createNewLayer(newLayer);

    expect(LayerModel.layerList.hasOwnProperty(newLayer)).toBe(true);
  });

  test("addToLayer", () => {
    LayerModel.addToLayer(testLayerName);
    expect(LayerModel.layerList.testLayerName.addLayer).toHaveBeenCalled();
  });

  test("removeFromLayer", () => {
    LayerModel.removeFromLayer(testLayerName);
    expect(LayerModel.layerList.testLayerName.removeLayer).toHaveBeenCalled();
  });

  test("isInLayer", () => {
    LayerModel.isInLayer(testLayerName, "test");
    expect(LayerModel.layerList.testLayerName.hasLayer).toHaveBeenCalled();
  });

  test("isInLayer", () => {
    const result = LayerModel.isInLayer("fakeName");
    expect(result).toEqual(false);
  });

  test("removeFromAllLayers", () => {
    LayerModel.removeFromAllLayers("TestLayer");

    Object.values(LayerModel.layerList).forEach(layer => {
      expect(layer.removeLayer).toHaveBeenCalled();
    });
  });

  test("addToAllLayer", () => {
    LayerModel.addToAllLayer("TestLayer");
    expect(LayerModel.layerList.movingLayer.addLayer).toHaveBeenCalled();
  });

  test("addToStopppedLayer", () => {
    LayerModel.addToStopppedLayer("TestLayer");
  });

  test("showLayer", () => {
    LayerModel.showLayer(testLayerName);
    expect(LayerModel.layerList.testLayerName.addTo).toHaveBeenCalled();
  });

  test("hideAllLayers", () => {
    LayerModel.hideAllLayers();

    Object.values(LayerModel.layerList).forEach(layer => {
      expect(layer.remove).toHaveBeenCalled();
    });
  });

  test("reset", () => {
    LayerModel.reset(testLayerName);

    Object.values(LayerModel.layerList).forEach(layer => {
      expect(layer.clearLayers).toHaveBeenCalled();
    });
  });
});
