import localForage from "localforage";
export let exceptionIndex = [];

export const configStorage = localForage.createInstance({
  name: "RTM-Database",
  storeName: "configuration"
});