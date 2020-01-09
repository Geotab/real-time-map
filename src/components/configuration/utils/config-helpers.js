export function filterByVisibility(toggleList) {

	const filteredSelection = {};

	Object.values(toggleList)
		.filter(exception => exception.visible)
		.forEach(exception => {

			const {
				id
			} = exception;

			filteredSelection[id] = exception;
		});

	return filteredSelection;
}
