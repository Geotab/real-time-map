import React from "react";
import { MapView } from "./components/map/map-view";
import { ControlsView } from "./components/controls/controls-component";
import { ConfigView } from "./components/configuration/configuration-view";
import { TutorialModal } from "./components/modal";
import ReactDOM from "react-dom";

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showTutorialModal: true };
    this.onModalClose = this.onModalClose.bind(this);
  };

  onModalClose() {
    this.setState(() => ({ showTutorialModal: false }));
  }

  render() {
    return (
      <div id="RTM-ViewContainer">
        < ConfigView />
        < MapView />
        < ControlsView />
        {this.state.showTutorialModal && <TutorialModal onModalClose={this.onModalClose} />}
      </div>
    );
  }
}

export function initView() {
  ReactDOM.render(<View />, document.getElementById("real-time-map-container"));
}
