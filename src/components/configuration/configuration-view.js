import React, { Component } from "react";
import { ExceptionsTab } from "./exception-config/exceptions-tab";
import { StatusTab } from "./status-config/status-tab";
import { VehiclesTab } from "./vehicles-config/vehicles-tab";
import { initCollapse } from "./utils/config-collapse";
import { diagnosticSearch } from "./status-config/status-search";
import { exceptionSearch } from "./exception-config/exception-search";
import { deviceSearch } from "./vehicles-config/vehicle-search";

export class ConfigView extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         exceptionsSearchList: [],
         statuses: [],
         devices: [],
         exceptionDisplayList: [],
         statusDisplayList: [],
         vehicleDisplayList: []
      };
      this.setExceptions = this.setExceptions.bind(this);
      this.setExceptionsList = this.setExceptionsList.bind(this);
      this.setStatusList = this.setStatusList.bind(this);
      this.setVehicleList = this.setVehicleList.bind(this);
      this.setStatuses = this.setStatuses.bind(this);
      this.setDevices = this.setDevices.bind(this);
   }

   setExceptions(props) {
      this.setState({ exceptionsSearchList: props });
   }

   setExceptionsList(props) {
      this.setState({ exceptionDisplayList: props });
   }

   setStatusList(props) {
      this.setState({ statusDisplayList: props });
   }

   setVehicleList(props) {
      this.setState({ vehicleDisplayList: props });
   }

   setStatuses(props) {
      this.setState({ statuses: props });
   }

   setDevices(props) {
      this.setState({ devices: props });
   }

   componentDidMount() {
      exceptionSearch.init(this.setExceptions);
      diagnosticSearch.init(this.setStatuses);
      deviceSearch.init(this.setDevices);
      exceptionSearch.loadSavedExceptionConfig(this.setExceptionsList);
      diagnosticSearch.loadSavedStatusConfig(this.setStatusList);
      deviceSearch.loadSavedDeviceConfig(this.setVehicleList);
      initCollapse();
   }

   render() {
      return (
         <div id="RTM-config-view">
            <div id="RTM-config-container">
               <div id="RTM-config-header" className="">
                  <VehiclesTab
                     devices={this.state.devices}
                     vehicleDisplayList={this.state.vehicleDisplayList}
                     onClick={this.setVehicleList}
                  />
                  <StatusTab
                     statuses={this.state.statuses}
                     statusDisplayList={this.state.statusDisplayList}
                     onClick={this.setStatusList}
                  />
                  <ExceptionsTab
                     exceptions={this.state.exceptionsSearchList}
                     exceptionDisplayList={this.state.exceptionDisplayList}
                     onClick={this.setExceptionsList}
                  />
               </div>
            </div>
         </div>
      );
   }
}
