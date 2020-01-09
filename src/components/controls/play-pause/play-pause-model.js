import storage from "../../../dataStore/index";

export const pausePlayModel = {
  playBackBox: undefined,
  playing: true,
  pausePlayIcon: undefined,

  initPausePlay() {
    this.pausePlayIcon = document.getElementById("RTMControlButton");
    this.pausePlayIcon.classList.add("RTM-pauseIcon");
    storage.dateKeeper$.subscribe(this.updatePausePlay.bind(this));
  },

  updatePausePlay() {
    if (this.playing === storage.dateKeeper$.paused) {
      this.playing = !this.playing;
      if (this.playing) {
        this.setPlayBackground();
      } else {
        this.setPausedBackground();
      }
    }
  },

  togglePausePlay() {
    if (this.playing) {
      this.setToPause();
    } else {
      this.setToPlay();
    }
  },

  setToPlay() {
    this.playing = true;
    this.setPlayBackground();
    storage.dateKeeper$.resume();
  },

  setToPause() {
    this.playing = false;
    this.setPausedBackground();
    storage.dateKeeper$.pause();
  },

  setPlayBackground() {
    this.pausePlayIcon.classList.remove("RTM-playIcon");
    this.pausePlayIcon.classList.add("RTM-pauseIcon");
  },

  setPausedBackground() {
    this.pausePlayIcon.classList.remove("RTM-pauseIcon");
    this.pausePlayIcon.classList.add("RTM-playIcon");
  }
};
