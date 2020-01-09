import storage from "../../../dataStore/index";
import { checkIfLive, getLiveTime } from "../../../utils/helper";

export const liveButtonModel = {
  liveButton: undefined,
  liveText: undefined,
  islive: true,

  initLiveButton() {
    this.liveButton = document.getElementById("RTM-LiveDot");
    this.liveText = document.getElementById("RTM-LiveButton");
    this.setLiveBackground();
    storage.dateKeeper$.subscribe(this.checkIfLive.bind(this));
  },

  checkIfLive(currentSecond) {
    
    const timeAhead = checkIfLive(currentSecond);

    if (timeAhead) {
      if (timeAhead > 1800) {
        this.islive = false;
        this.goToLive();
        return;
      }

      if (!this.islive) {
        storage.dateKeeper$.setPeriod(1000);
        this.islive = true;
        this.setLiveBackground();
      }
      return true;

    } else {

      if (this.islive) {
        this.islive = false;
        this.setNotLiveBackground();
      }

      return false;
    }
  },

  setLiveBackground() {
    const playbackSpeedDropdown = document.getElementsByClassName("mdc-select__native-control");
    this.liveButton.style.backgroundColor = "Crimson";
    this.liveText.style.cssText = "color:Crimson !important; font-weight: bold;";
    playbackSpeedDropdown[0].setAttribute("disabled", "");
    playbackSpeedDropdown[0].classList.add("disabledDropdown");
  },

  setNotLiveBackground() {
    const playbackSpeedDropdown = document.getElementsByClassName("mdc-select__native-control");
    this.liveButton.style.backgroundColor = "Black";
    this.liveText.style.cssText = "color:Black !important; font-weight: normal;";
    playbackSpeedDropdown[0].removeAttribute("disabled");
    playbackSpeedDropdown[0].classList.remove("disabledDropdown");
  },

  goToLive() {
    if (!this.islive) {
      const liveTime = new Date(getLiveTime());
      this.islive = true;
      this.setLiveBackground();
      storage.dateKeeper$.period = 1000;
      storage.dateKeeper$.setNewTime(liveTime);
    }
  }
};