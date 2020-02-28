import React, { Component } from "react";
import { mapModel } from "./map-model";
import { progressBar } from "../progress-bar";
import { ProgressIndicatorComponent } from "../progress-bar/progress-indicator-component";
import { SnackBar } from "../snackbar/snackbar-component";
import {
  apiConfig
} from "../../dataStore/api-config";
import storage from "../../dataStore";

export class MapView extends React.Component {
  componentDidMount() {
    mapModel.handleMapCreated("RTM-Map");
    progressBar.update();
  }

  render() {
    return (
      <div id="RTM-Map-Container">
        {storage.isStandAlone ? <button id="RTM-LogoutButton" onClick={() => { apiConfig.api.forget(); }}>Logout</button> : null}
        <div id="RTM-Map">
          <ProgressIndicatorComponent />
          <button
            type="button"
            className="collapsible"
            id="collapse-button"
            title="Open Configuration Panel"
          ></button>
          <SnackBar />
        </div>
      </div>
    );
  }
}
