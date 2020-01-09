const storage = {

  startDate: undefined,
  delay: 300 * 1000,

  exceptionsEnabled: true,

  maxZoom: 18,
  minZoom: 3,

  selectedStatuses: {},
  selectedExceptions: {},
  selectedDevices: {},

  realTimeFeedDataGetter: undefined,
  historicalComplete: false,

  _timeRangeStart: undefined,
  get timeRangeStart() {
    return this._timeRangeStart;
  },
  set timeRangeStart(timeRangeStart) {
    this._timeRangeStart = timeRangeStart;
  },

  _currentTime: undefined,
  get currentTime() {
    return this._currentTime;
  },
  set currentTime(currentTime) {
    this._currentTime = currentTime;
  },

  _map: undefined,
  get map() {
    return this._map;
  },
  set map(map) {
    this._map = map;
  },

  _dateKeeper$: undefined,
  get dateKeeper$() {
    return this._dateKeeper;
  },
  set dateKeeper$(dateKeeper) {
    this._dateKeeper = dateKeeper;
  },
};

export default storage;