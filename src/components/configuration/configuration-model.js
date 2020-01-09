export function selectTab(tab) {
	const selectedTab = document.getElementById(tab);

	if (selectedTab.classList.contains("RTM-TabSelected")) {
		return false;
	}
	else {

		const tabs = document.getElementsByClassName("RTM-Tab");
		for (let i = 0; i < tabs.length; i++) {
			tabs[i].classList.remove("RTM-TabSelected");
			tabs[i].classList.add("RTM-TabNotSelected");
		};

		selectedTab.classList.remove("RTM-TabNotSelected");
		selectedTab.classList.add("RTM-TabSelected");

		switch (selectedTab.id) {
			case "RTM-ExceptionTitle":
				document.getElementById("exception-tab").style.display = "block";
				document.getElementById("status-tab").style.display = "none";
				document.getElementById("vehicle-tab").style.display = "none";
				break;
			case "RTM-StatusTitle":
				document.getElementById("status-tab").style.display = "block";
				document.getElementById("exception-tab").style.display = "none";
				document.getElementById("vehicle-tab").style.display = "none";
				break;
			case "RTM-VehicleTitle":
				document.getElementById("vehicle-tab").style.display = "block";
				document.getElementById("exception-tab").style.display = "none";
				document.getElementById("status-tab").style.display = "none";
				break;
		}
	}
}
