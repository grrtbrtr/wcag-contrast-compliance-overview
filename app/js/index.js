import '../styles/styles.scss';

import ColorCombinationView from 'ColorCombinationView';

const loadJSON = (callback) => {
	let xhr = new XMLHttpRequest();

	xhr.open('GET', 'colors.json', true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			return callback(xhr.responseText);
		}
	}
	xhr.send(null);
}

loadJSON((response) => {
	let json = JSON.parse(response);
	let container = document.getElementById('combinations');

	for (let i = 0; i < json.length; i++) {
		let combination = json[i];
		/* eslint-disable no-new */
		let el = new ColorCombinationView('combination-' + (i+1), combination.foreground, combination.background, container);
		el.dataset.fg = combination.foreground;
		el.dataset.bg = combination.background;
	}

	container.innerHTML = container.innerHTML;
});