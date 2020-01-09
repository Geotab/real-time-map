import { MDCLinearProgress } from "@material/linear-progress";

export const progressBar = {
  update(progress) {
    const linearProgress = new MDCLinearProgress(document.querySelector(".mdc-linear-progress"));
    linearProgress.open();
    linearProgress.progress = progress;
    if (progress >= 1) {
      setTimeout(() => linearProgress.close(), 1000);
    }
  }
};