import storage from "../../../dataStore";
import { getLiveTime } from "../../../utils/helper";
import { showSnackBar } from "../../snackbar/snackbar";

export const dateTimeModel = {

  get dateInput() {
    return document.getElementById("dateInputBox");
  },

  get startTimeInput() {
    return document.getElementById("timeRangeStart");
  },

  get currentTimeInput() {
    return document.getElementById("currentTimeInput");
  },

  initDateTimeInput() {

    this.setDefaultDateValue();
    this.setDefaultStartTimeValue();
    this.setDefaultCurrentTimeValue();

    this.dateInput.addEventListener("keyup", this.onDateEntered.bind(this));
    this.startTimeInput.addEventListener("keyup", this.onStartTimeEntered.bind(this));
    this.currentTimeInput.addEventListener("keyup", this.onCurrentTimeEntered.bind(this));

    this.dateInput.addEventListener("change", onChange);
    this.startTimeInput.addEventListener("change", onChange);
    this.currentTimeInput.addEventListener("change", onChange);

    storage.dateKeeper$.subscribe(this.updateCurrentSecond.bind(this));
  },

  setDefaultDateValue() {
    this.dateInput.value = new Date(storage.currentTime).toLocaleDateString("en-CA");
  },

  setDefaultStartTimeValue() {
    this.startTimeInput.value = new Date(storage.timeRangeStart).toLocaleTimeString("en-GB");
  },

  setDefaultCurrentTimeValue() {
    this.currentTimeInput.value = new Date(storage.currentTime).toLocaleTimeString("en-GB");
  },

  updateCurrentSecond(currentSecond) {

    if (this.dateInput && document.activeElement != this.dateInput) {
      this.setDefaultDateValue();
    }

    if (this.startTimeInput && document.activeElement != this.startTimeInput) {
      this.setDefaultStartTimeValue();
    }

    if (this.currentTimeInput && document.activeElement != this.currentTimeInput) {
      this.currentTimeInput.value = new Date(currentSecond).toLocaleTimeString("en-GB");
    }
  },


  onDateEntered(event) {
    if (!checkRightKeyEntered(event)) {
      return;
    }

    // this.dateInput.blur();
    const selectedTime = new Date(this.dateInput.value + " " + this.currentTimeInput.value);

    if (checkDateInFuture(selectedTime)) {
      this.setDefaultDateValue();
    } else {
      this.dateInput.value = selectedTime.toLocaleDateString("en-CA");
      this.applyAndUpdate(selectedTime.getTime());
    }
  },

  onStartTimeEntered(event) {
    if (!checkRightKeyEntered(event)) {
      return;
    }

    this.startTimeInput.blur();
    const selectedTime = new Date(this.dateInput.value + " " + this.startTimeInput.value);

    if (checkDateInFuture(selectedTime)) {
      this.setDefaultStartTimeValue();

    } else {
      const newTime = selectedTime.getTime();
      storage.timeRangeStart = newTime;
      if (newTime > storage.currentTime) {
        storage.currentTime = newTime;
      }
      this.applyAndUpdate(storage.currentTime);
    }
  },

  onCurrentTimeEntered(event) {
    if (!checkRightKeyEntered(event)) {
      return;
    }

    this.currentTimeInput.blur();
    const selectedTime = new Date(this.dateInput.value + " " + this.currentTimeInput.value);

    if (checkDateInFuture(selectedTime)) {
      this.setDefaultCurrentTimeValue();

    } else {
      const newTime = selectedTime.getTime();
      if (newTime < storage.timeRangeStart) {
        storage.timeRangeStart = newTime;
      }
      this.applyAndUpdate(newTime);
    }
  },

  applyAndUpdate(newTime) {
    this.updateCurrentSecond(newTime);
    storage.dateKeeper$.setNewTime(newTime);
  }
};

function checkRightKeyEntered(event) {
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  return (event.keyCode === 13);
}

function checkDateInFuture(selectedTime) {

  const liveDate = new Date(getLiveTime());

  if (selectedTime > liveDate) {
    alert("Selected date is in future!");
    //Snackbar notificaiton
    return true;
  }

  return false;
}

export function onChange() {
  showSnackBar("Please hit Enter to apply your changes!");
};