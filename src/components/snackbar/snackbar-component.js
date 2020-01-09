import React, { Component } from "react";

export const SnackBar = () => (
  <div className="mdc-snackbar mdc-snackbar--align-start">
    <div className="mdc-snackbar__surface">
      <div
        className="mdc-snackbar__label"
        role="status"
        aria-live="polite"
      ></div>
      <div className="mdc-snackbar__actions">
        <button
          type="button"
          className="mdc-button mdc-snackbar__action"
        ></button>
      </div>
    </div>
  </div>
);
