import '../styles/styles.scss';

import ColorCombination from 'ColorCombination';
import ColorCombinationView from 'ColorCombinationView';

let clickOutsideHandlerAttached = false;

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

const clickOutsideHandler = () => {
	document.getElementById('backdrop').removeEventListener('click', clickOutsideHandler);
	clickOutsideHandlerAttached = false;

	let combinationElements = document.getElementsByClassName('combination');
	Array.from(combinationElements).forEach((currentEl) => {
    currentEl.classList.remove('combination--before', 'combination--selected', 'combination--after');
	});
}

const combinationClickHandler = (e) => {
	let el = e.currentTarget;
	let combinationElements = document.getElementsByClassName('combination');
	let passedClickedElement = false;
	let closingElement = false;

	if (el.classList.contains('combination--selected')) {
		closingElement = true;
		document.getElementById('backdrop').removeEventListener('click', clickOutsideHandler);
		clickOutsideHandlerAttached = false;
	} else if (clickOutsideHandlerAttached === false) {
		document.getElementById('backdrop').addEventListener('click', clickOutsideHandler);
		clickOutsideHandlerAttached = true;
	}

	Array.from(combinationElements).forEach((currentEl) => {
    currentEl.classList.remove('combination--before', 'combination--selected', 'combination--after');

		if (closingElement === false) {
			if (currentEl.id === el.id) {
				currentEl.classList.add('combination--selected');
				passedClickedElement = true;
			} else if (passedClickedElement === false) {
				currentEl.classList.add('combination--before');
			} else {
				currentEl.classList.add('combination--after');
			}
		}
  });
}

loadJSON((response) => {
	let json = JSON.parse(response);
	let container = document.getElementById('combinations');

	for (let i = 0; i < json.length; i++) {
		let combination = new ColorCombination(json[i].foreground, json[i].background, json[i].base);
		let el = new ColorCombinationView('combination-' + (i + 1), combination, container);
		el.dataset.fg = combination.foreground;
		el.dataset.bg = combination.background;
		el.dataset.base = combination.base;
	}

	//container.innerHTML = container.innerHTML;

	let combinationElements = document.getElementsByClassName('combination');
	Array.from(combinationElements).forEach((el) => {
    el.addEventListener('click', combinationClickHandler);
  });
});
