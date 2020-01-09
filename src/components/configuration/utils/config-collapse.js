import storage from "../../../dataStore";

export const initCollapse = () => {
	const coll = document.getElementsByClassName("collapsible");

	coll[0].addEventListener("click", function() {

		this.classList.toggle("active");
		const content = document.getElementById("RTM-config-container");
		const map = document.getElementById("RTM-Map");
		const button = document.getElementById("collapse-button");

		if (content.style.maxWidth === "100%") {
			button.title = "Open Configuration Panel";
			button.classList.remove("closeConfigPanel");
			button.classList.add("openConfigPanel");
			content.style.maxWidth = "0%";
			map.style.maxWidth = "100%";
		}
		else {
			button.title = "Collapse Configuration Panel";
			button.classList.remove("openConfigPanel");
			button.classList.add("closeConfigPanel");
			content.style.maxWidth = "100%";
			map.style.maxWidth = "75%";
		}

		storage.map.invalidateSize(true);
	});
};
