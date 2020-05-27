import React, { Component } from "react";
import configuration from "../index";
import { VehicleFormComponent } from "./vehicle-form-component";
import { VehicleToggleButtons } from "./vehicle-toggle-buttons";
import { VehicleListComponent } from "./vehicle-list-component";

export const VehiclesTab = props => (
   <div>
      <button
         id="RTM-VehicleTitle"
         className="RTM-Tab RTM-TabSelected"
         onClick={() => configuration.selectTab("RTM-VehicleTitle")}
      >
         Vehicles
    </button>
      <div id="vehicle-tab" className="RTM-config-info">
         <VehicleFormComponent
            devices={props.devices}
            setVehicleDisplay={props.onClick}
         />
         <div className="config-Header">
            <p>Selected Vehicles:</p>
            <div className="toggleButtonDiv" id="ToggleDeviceButtons">
               <VehicleToggleButtons setVehicleDisplay={props.onClick} />
            </div>
         </div>
         <div id="RTM-vehicles-view">
            <div className="config-list">
               <div>
                  <ul className="mdc-list" id="VehicleList">
                     <VehicleListComponent
                        vehicleDisplayList={props.vehicleDisplayList}
                        setVehicleDisplay={props.onClick}
                     />
                  </ul>
               </div>
            </div>
         </div>
      </div>
   </div>
);
