import {
  Subject,
  interval,
  empty
} from "rxjs";

import {
  switchMap,
  scan,
  startWith,
  mapTo,
  publish,
  throttleTime
} from "rxjs/operators";

import {
  checkIfLive,
  getLiveTime,
  resetTransitionAnimation
} from "../../utils/helper";

import storage from "../../dataStore";

import {
  setupTimeObjects,
  updatePeriodChangeFunctions,
  updateTimeChangeFunctions,
  differentDateSet
} from "./date-keeper-helpers";

export function initDateKeeper() {

  const startTime = new Date(Date.now() - storage.delay);
  setupTimeObjects(startTime);

  storage.dateKeeper$ = dateKeeper;
  storage.dateKeeper$.init(storage.currentTime, 1000);

  storage.dateKeeper$.subscribe(currentSecond => storage.currentTime = currentSecond);

  storage.dateKeeper$.pause();
}

export const dateKeeper = {

  init(startDate, period = 1000) {

    this.startDate = startDate;
    this.newTime = startDate;
    this.period = period;
    this.paused = false;

    this.emitterSubject = new Subject();
    this.inputThrottler = new Subject();

    this.currentSecond$ = this.createDateKeeper();
    this.createInputThrottler();

    this.subscriberList = [];
  },

  get state() {
    // console.trace(new Date(this.newTime));
    return {
      period: this.period,
      newTimeSet: this.newTime,
      pause: this.paused
    };
  },

  get observable() {
    return this.currentSecond$;
  },

  getPeriod() {
    return this.period;
  },

  createDateKeeper() {
    const res = this.emitterSubject.pipe(

      startWith(this.state),

      switchMap(next => {

        if (next.pause) {
          return empty();
        }

        const res = interval(next.period).pipe(mapTo(false));
        if (next.newTimeSet) {
          this.newTime = false;
          return res.pipe(startWith(next.newTimeSet));
        }
        return res;

      }),

      scan((currentTime, newTimeSet) =>
        newTimeSet ? newTimeSet : currentTime + 1000,
        0
      ),

      publish()
    );

    res.connect();
    this.newTime = false;
    return res;
  },

  createInputThrottler() {

    this.inputThrottler.pipe(
      throttleTime(360)
    ).subscribe(state => {
      this.emitterSubject.next(state);
    });

  },

  emitNext() {
    this.inputThrottler.next(this.state);
  },

  subscribe(callback) {
    const newSub = this.currentSecond$.subscribe(callback);
    this.subscriberList.push(newSub);
    return newSub;
  },

  pause() {
    this.paused = true;
    this.emitNext();
  },

  resume() {
    this.paused = false;
    this.emitNext();
  },

  setPeriod(period) {
    this.period = period;
    this.paused = false;
    updatePeriodChangeFunctions(period);
    this.emitNext();
  },

  setNewTime(newTimeInput) {

    this.newTime = Math.round(newTimeInput / 1000) * 1000;

    if (this.newTime < storage.dayStart.getTime() || this.newTime > storage.dayEnd.getTime()) {
      this.pause();
      differentDateSet(this.newTime);
    }

    if (checkIfLive(this.newTime) > 600) {
      this.newTime = getLiveTime();
    }

    storage.currentTime = this.newTime;
    updateTimeChangeFunctions(this.newTime);

    this.paused = false;
    this.emitNext();
    resetTransitionAnimation();
  },

  update() {

    storage.currentTime += 1000;

    if (checkIfLive(storage.currentTime) > 600) {
      storage.currentTime = getLiveTime();
    }

    this.setNewTime(storage.currentTime);
  }

};