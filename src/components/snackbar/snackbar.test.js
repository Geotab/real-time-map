import { showSnackBar } from "./snackbar";
import * as snackbar from "@material/snackbar";

import {
  spyOnFunction,
  spyOnAccessorFunction,
  mockMap,
  mockDateKeeper,
  createDivsWithClasses
} from "../../../tests/utils/test-helpers";

describe("snack bar tests", () => {

  beforeAll(() => {
    const fakeSnackBar = {
      open: jest.fn()
    };
    spyOnFunction(snackbar, "MDCSnackbar", () => fakeSnackBar);
  });

  test("snack bar show", () => {
    showSnackBar("test");
  });

}); 