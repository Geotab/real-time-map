import React from "react";
import { MapView } from "./components/map/map-view";
import { ControlsView } from "./components/controls/controls-component";
import { ConfigView } from "./components/configuration/configuration-view";
import ReactDOM from "react-dom";
import { LoginPage } from "./utils/stand-alone/login";

class View extends React.Component {
  render() {
    return (
      <div id="RTM-ViewContainer">
        {this.props.isLogged ? <> < ConfigView /> < MapView />  < ControlsView /></> : <LoginPage showError={this.props.showError} />}
      </div>
    );
  }
}

export function initView(isLogged, showError) {
  ReactDOM.render(<View isLogged={isLogged} showError={showError} />, document.getElementById("real-time-map-container"));
}
