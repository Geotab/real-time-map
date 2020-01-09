export function spyOnFunction(moduleName, functionName, mockFunction = jest.fn()) {
  const spyFunction = jest.spyOn(moduleName, functionName);
  spyFunction.mockImplementation(mockFunction);

  return spyFunction;
}

export function spyOnAccessorFunction(moduleName, functionName, accessType = "get", mockFunction = jest.fn()) {
  const spyFunction = jest.spyOn(moduleName, functionName, accessType);
  spyFunction.mockImplementation(mockFunction);

  return spyFunction;
}

export function mockMap(storage, zoom, inBounds) {

  const fakeMap = {
    getZoom() {
      return zoom;
    },
    getBounds() {
      return {
        contains() {
          return inBounds;
        }
      };
    },
    flyTo: jest.fn(),
    panTo: jest.fn(),
    on: jest.fn(),
    whenReady: jest.fn(),
    addLayer: jest.fn(),
    setView: jest.fn()
  };

  spyOnAccessorFunction(storage, "map", "get", () => fakeMap);

  return fakeMap;
}

export function mockDateKeeper(storage, period, paused = false) {

  const fakeDateKeeper = {
    paused,
    pause: jest.fn(),
    resume: jest.fn(),
    subscribe: jest.fn(),
    setNewTime: jest.fn(),
    setPeriod: jest.fn(),
    update: jest.fn(),

    getPeriod() {
      return period;
    },

    observable: {
      pipe() {
        return {
          subscribe: jest.fn()
        };
      }
    }
  };

  spyOnAccessorFunction(storage, "dateKeeper$", "get", () => fakeDateKeeper);

  return fakeDateKeeper;
}


export function mockAPI(apiConfig) {
  apiConfig.api = {
    call: jest.fn(),
    multiCall: jest.fn()
  };
  return apiConfig;
}


export function createDivsWithID(ids) {
  document.body.innerHTML += ids.map(id =>
    `<div id='${id}'></div>`
  ).join("");
}


export function createDivsWithClasses(classes) {
  document.body.innerHTML += classes.map(divClass =>
    `<div class='${divClass}'></div>`
  ).join("");
}
