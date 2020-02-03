import React from "react";
import ReactDOM from "react-dom";

export const ModalContent = () => (
	<span>
		<p className="RTM-zoomIcon"></p>
		<h3 id="configuration-panel">Configuration Panel</h3>
		<p>The arrow icon on the right will expand to open the configuration panel on click.</p>
		<p className="RTM-configPNG"></p>
		<p>The three tabs in the panel allow users to search Exceptions, Statuses and filter the map by Vehicle/Groups.</p>
		<p>The selected configuration is applied immediately upon click.</p>
		<p>Users may toggle the visibility of the configuration selection by clicking on the eye-icon in the tab and remove the configuration by clicking on the clear button.</p>
		<p>Configuration settings persist along sessions with the same user name, they're loaded and applied upon login.</p>
		<p className="RTM-filterCar"></p>
		<p>Clicking on the Vehicle Icon in the Vehicle Tab will set the view to the car on the Map.</p>
		<h3 id="control-bar">Control Bar</h3>
		<p>On the bottom of the page is the control bar, with the following features:</p>
		<p className="RTM-controlBarPNG"></p>
		<p>Two sliders on top, the rectangular slider can be dragged to select a new time onwards from which the Vehicle Paths are shown on the Map.</p>
		<p>The arrow shaped slider can be dragged to set the Current Time.</p>
		<p>A play/pause button to the bottom left.</p>
		<p>Playback Speed menu to the right of the play/pause button allowing users to Fast Forward on the Map.</p>
		<p>A live button to the bottom right that bring users to the latest feed data.</p>
		<p>A date at bottom center, that also functions as an input, allowing users to select a specific date in the past.</p>
		<p>Two time inputs on the bottom center. The Start Time input allows users to set the start time for the Vehicle Paths and the Current time input sets the Current Time on the Map.</p>
		<p className="RTM-dateTimePNG"></p>
		<h3 id="additional-features">Additional Features</h3>
		<p>Every vehicle marker, path and exception path will have a popup that is opened on click. It will look similar to this:</p>
		<p className="RTM-focusCarPng"></p>
		<p>On clicking the black vehicle icon near the the top right of the pop up, the map will zoom into the vehicle and add it to the list of filtered vehicles:</p>
		<p className="RTM-carFocused"></p>
		<p>If get exception data is enabled, then upon clicking an exception path, a popup will display the exception rule name, duration, as well as driver name.</p>
		<p className="RTM-exceptionPopup"></p>
		<p>If get status feed is enabled, then diagnostic status data would be displayed in the popup as well:</p>
		<p className="RTM-carStatusPopup"></p>
		<p>https://www.geotab.com/video/set-rules-fleet-mygeotab/</p>
		<p>https://www.geotab.com/video/advanced-rules-and-groups/</p>
		<p>Any rules added in MyGeoTab will be displayed on this map if the exception has occurred, using the color selected in rule settings.</p>
	</span>
);

