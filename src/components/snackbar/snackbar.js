import { MDCSnackbar } from "@material/snackbar";

export function showSnackBar(message, action = "OK") {
	const snackbar = new MDCSnackbar(document.querySelector(".mdc-snackbar"));
	snackbar.labelText = message;
	snackbar.actionButtonText = action;
	snackbar.timeoutMs = 5000;
	snackbar.open();
};
