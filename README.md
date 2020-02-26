
# Installation
## Getting the Add-in:

* Download the latest release from the release page https://github.com/Geotab/real-time-map/releases.

**Or**

* Download the repo and ensure you have Node V10.16 and npm V6.9.
* Execute `npm install` to install all dependencies.
* Execute `npm run build`, to build the add-in.
* After the build succeeds, you can find the MyGeotab compatible add-in inside the "dist" folder!

## Installation into MyGeotab:

1. Navigate to MyGeotab/systemSettings/Add-Ins, and click new Add-in.
2. Fill in the configuration field, or copy the values from configuration.json from this project.
3. Proceed to click the "add" button in files, and upload the entire dist folder to Mygeotab.
4. Navigate to the Real Time Map addin page (which should be on the sidebar if you used the provided configuration file)

# Development:

1. Execute `npm install` to install all dependencies.
2. Execute `npm run devBuild && npm run devServer` to start the dev server (or execute dev.sh).

### This creates a server (http://localhost:9000/) that can be ran and tested locally as long as you have an account with mygeotab api access.

# Using The Real Time Map Add-in:

Upon starting the map, you will be greeted with the following landing page:

<kbd><img src="readme-images/start.png"></kbd>

On the top left hand side is the zoom controls.

<kbd><img src="readme-images/zoomIcon.png"></kbd>

## Configuration Panel

The arrow icon on the right will expand to open the configuration panel on click.

<kbd><img src="readme-images/config12.gif"></kbd>

The three tabs in the panel allow users to search Exceptions, Statuses and filter the map by Vehicle/Groups.

The selected configuration is applied immediately upon click.

Users may toggle the visibility of the configuration selection by clicking on the eye-icon in the tab and remove the configuration by clicking on the clear button.

Configuration settings persist along sessions with the same user name, they're loaded and applied upon login.

<kbd><img src="readme-images/filterCar.png"></kbd>

Clicking on the Vehicle Icon in the Vehicle Tab will set the view to the car on the Map.

## Control Bar

On the bottom of the page is the control bar, with the following features:

<kbd><img src="readme-images/controlBar.png"></kbd>

Two sliders on top, the rectangular slider can be dragged to select a new time onwards from which the Vehicle Paths are shown on the Map.

The arrow shaped slider can be dragged to set the Current Time.

A play/pause button to the bottom left.

Playback Speed menu to the right of the play/pause button allowing users to Fast Forward on the Map.

A live button to the bottom right that bring users to the latest feed data.

A date at bottom center, that also functions as an input, allowing users to select a specific date in the past.

Two time inputs on the bottom center. The Start Time input allows users to set the start time for the Vehicle Paths and the Current time input sets the Current Time on the Map.

## Additional Features

Every vehicle marker, path and exception path will have a popup that is opened on click. It will look similar to this:

<kbd><img src="readme-images/focusCarButton.png"></kbd>


On clicking the black vehicle icon near the the top right of the pop up, the map will zoom into the vehicle and add it to the list of filtered vehicles:

<kbd><img src="readme-images/carFocused.png"></kbd>

If get exception data is enabled, then upon clicking an exception path, a popup will display the exception rule name, duration, as well as driver name.

<kbd><img src="readme-images/exceptionPopup.png"></kbd>

If get status feed is enabled, then diagnostic status data would be displayed in the popup as well:

<kbd><img src="readme-images/CarStatusMarkerPopup.png"></kbd>

## Additional resources

https://my.geotab.com/sdk/api/apiReference.html

https://leafletjs.com/index.html

For more information or inquiries please contact danisnguyen@geotab.com

# License

## MIT License

## Copyright (c) 2020 Geotab Inc.
