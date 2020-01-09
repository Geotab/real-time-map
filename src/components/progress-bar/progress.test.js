import { progressBar } from "./progress-indicator";
import * as linearProgress from "@material/linear-progress";

import {
  spyOnFunction,
} from "../../../tests/utils/test-helpers";

describe("progressBar tests", () => {

  beforeAll(() => {
    const fakeProgress = {
      open: jest.fn(),
      close: jest.fn()
    };
    spyOnFunction(linearProgress, "MDCLinearProgress", () => fakeProgress);
    jest.useFakeTimers();
  });

  test("update", () => {
    progressBar.update(0.5);
  });

  test("update", () => {
    progressBar.update(1);
    jest.runAllTimers();
  });
}); 