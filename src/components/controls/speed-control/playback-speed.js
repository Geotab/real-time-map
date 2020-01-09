import storage from "../../../dataStore";
import { MDCSelect } from "@material/select";
import { checkIfLive } from "../../../utils/helper";

export const playBackSpeedModel = {
  select: undefined,
  speedUpdated: false,

  initPlayBackSpeed() {

    playBackSpeedModel.select = new MDCSelect(document.querySelector(".mdc-select"));
    playBackSpeedModel.select.listen("MDCSelect:change", this.newSpeedSelected.bind(this));

  },

  newSpeedSelected() {

    if (this.speedUpdated) {
      this.speedUpdated = false;
      return;
    }

    this.speedUpdated = true;

    const timeAhead = checkIfLive(storage.currentTime);
    if (timeAhead) {
      playBackSpeedModel.select.value = 1;
    } else {

      const { value } = playBackSpeedModel.select;
      storage.dateKeeper$.setPeriod(1000 / value);
    }

  },

  updateSpeed(period) {
    this.speedUpdated = true;
    const speed = 1000 / period;
    playBackSpeedModel.select.value = Math.round(speed);
  }
};