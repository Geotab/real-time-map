import React, { Component } from "react";
import { ModalContent } from "./modal-content";

export const TutorialModal = (props) => {
	return (
		<div id="RTM-ReadmeModal">
			<div id="RTM-ModalContent" >
				<div id="RTM-ModalTitleDiv" >
					<h2 id="RTM-modal-title">Real Time Map</h2>
					<button type="button" id="RTM-ModalCloseButton" onClick={props.onModalClose}>&times;</button>
				</div>
				<div id="RTM-ReadmeContent" >
					<ModalContent />
				</div>
			</div>
		</div>
	);
};
