import '../styles/styles.scss';

import ColorCombination from 'ColorCombination';
import ColorCombinationView from 'ColorCombinationView';

let clickOutsideHandlerAttached = false;

/**
 * Polyfill for .closest() selector
 */
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function closest(s) {
		var that = this;
		var el = that;
		if (!document.documentElement.contains(el)) {
			return null;
		}
		do {
			if (el.matches(s)) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	};
}


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
	document.getElementById('backdrop').style.display = 'none';
	clickOutsideHandlerAttached = false;

	let combinationElements = document.getElementsByClassName('combination');
	Array.from(combinationElements).forEach((currentEl) => {
    currentEl.classList.remove('combination--before', 'combination--selected', 'combination--after');
	});
}

const combinationClickHandler = (e) => {
	let el = e.currentTarget;
	let combinationElements = e.currentTarget.closest('.combinations__swatches').getElementsByClassName('combination');
	let passedClickedElement = false;
	let closingElement = false;

	if (el.classList.contains('combination--selected')) {
		closingElement = true;
		document.getElementById('backdrop').removeEventListener('click', clickOutsideHandler);
		document.getElementById('backdrop').style.display = 'none';
		clickOutsideHandlerAttached = false;

	} else if (clickOutsideHandlerAttached === false) {
		document.getElementById('backdrop').addEventListener('click', clickOutsideHandler);
		document.getElementById('backdrop').style.display = 'block';
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
	let groupNode;

	for (let i = 0; i < json.length; i++) {
		groupNode = json[i];

		let combinationGroup = document.createElement('div');
		combinationGroup.classList.add('combinations__group');
		combinationGroup.innerHTML = '<h2>' + groupNode.title + '</h2>';
		container.appendChild(combinationGroup);

		let combinationGroupSwatchesContainer = document.createElement('div');
		combinationGroupSwatchesContainer.classList.add('combinations__swatches');
		combinationGroup.appendChild(combinationGroupSwatchesContainer);

		for (let j = 0; j < groupNode.swatches.length; j++) {
			console.log(groupNode.swatches[j].base);
			let combination = new ColorCombination(groupNode.swatches[j].foreground, groupNode.swatches[j].background, groupNode.swatches[j].base);
			console.log(combination);
			let el = new ColorCombinationView('combination-' + ((i+1) * (j+1)), combination, combinationGroupSwatchesContainer);
			el.dataset.fg = combination.foreground;
			el.dataset.bg = combination.background;
			el.dataset.base = combination.base;
		}
	}

	//container.innerHTML = container.innerHTML;

	let combinationElements = document.getElementsByClassName('combination');
	Array.from(combinationElements).forEach((el) => {
    el.addEventListener('click', combinationClickHandler);
  });
});
