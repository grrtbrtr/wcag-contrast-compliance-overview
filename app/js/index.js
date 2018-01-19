import '../styles/styles.scss';

import Color from 'Color';
import ColorCombination from 'ColorCombination';
import ColorCombinationView from 'ColorCombinationView';

//let clickOutsideHandlerAttached = false;

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


/*const loadJSON = (callback) => {
	let xhr = new XMLHttpRequest();

	xhr.open('GET', 'colors.json', true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
			return callback(xhr.responseText);
		}
	}
	xhr.send(null);
}*/

/*const clickOutsideHandler = () => {
	document.getElementById('backdrop').removeEventListener('click', clickOutsideHandler);
	document.getElementById('backdrop').style.display = 'none';
	clickOutsideHandlerAttached = false;

	let combinationElements = document.getElementsByClassName('combination');
	Array.from(combinationElements).forEach((currentEl) => {
    currentEl.classList.remove('combination--before', 'combination--selected', 'combination--after');
	});
}*/

/*const combinationClickHandler = (e) => {
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
}*/

const buildArrayFromFieldColorValues = (fields) => {
	let arr = [];

	for (let i = 0; i < fields.length; i++) {
		let color = hexStringToColor(fields[i].value);
		arr.push({
			name: fields[i].id,
			value: color
		});
	}

	return arr;
}

const parseStuff = () => {
	let inputColors = {
		background: buildArrayFromFieldColorValues(document.querySelectorAll('#colors_background .swatch input[type="text"]')),
		text: buildArrayFromFieldColorValues(document.querySelectorAll('#colors_text .swatch input[type="text"]')),
		overlay: buildArrayFromFieldColorValues(document.querySelectorAll('#colors_overlay .swatch input[type="text"]'))
	};

	// Create color combinations
	let opacityMap = {
		text: {
			light: [0.7, 0.9, 1],
			dark: [0.4, 0.6, 0.9],
			other: [1]
		},
		overlays: {
			tints: [0.50, 0.70, 0.80, 0.90, 0.95],
			shades: [0.40, 0.60, 0.80]
		}
	}

	let backgroundColors = [];
	for (let i = 0; i < inputColors.background.length; i++) {
		let c = inputColors.background[i];
		backgroundColors.push(c.value);
	}

	let textColors = [];
	for (let i = 0; i < inputColors.text.length; i++) {
		let c = inputColors.text[i];
		let opacityArr = [];
		switch (c.name) {
			case 'colors_text_dark':
				opacityArr = opacityMap.text.dark;
				break;
			case 'colors_text_light':
				opacityArr = opacityMap.text.light;
				break;
			default:
				opacityArr = opacityMap.text.other;
				break;
		}

		for (let j = 0; j < opacityArr.length; j++) {
			c.value.alpha = opacityArr[j];
			textColors.push(c.value);
		}
	}

	let overlayColors = [];
	for (let i = 0; i < inputColors.overlay.length; i++) {
		let c = inputColors.overlay[i];
		let opacityArr = [];
		switch (c.name) {
			case 'colors_overlay_dark':
				opacityArr = opacityMap.overlays.shades.reverse().concat([0]);
				break;
			case 'colors_overlay_light':
				opacityArr = opacityMap.overlays.tints;
				break;
			default:
				break;
		}

		for (let j = 0; j < opacityArr.length; j++) {
			c.value.alpha = opacityArr[j];
			overlayColors.push(c.value);
		}
	}

	//console.log(backgroundColors.length + " - " + overlayColors.length + " " + textColors.length);

	let combinations = [];
	for (let i = 0; i < backgroundColors.length; i++) {
		for (let j = 0; j < overlayColors.length; j++) {
			for (let k = 0; k < textColors.length; k++) {
				combinations.push(new ColorCombination(textColors[k], overlayColors[j], backgroundColors[i]));
			}
		}
	}


	let container = document.getElementById('combinations');

	for (let i = 0; i < combinations.length; i++) {
		let combinationGroup = document.createElement('div');
		combinationGroup.classList.add('combinations__group');
		combinationGroup.innerHTML = '<h2>' + combinations[i].foreground + '</h2>';
		container.appendChild(combinationGroup);

		let combinationGroupSwatchesContainer = document.createElement('div');
		combinationGroupSwatchesContainer.classList.add('combinations__swatches');
		combinationGroup.appendChild(combinationGroupSwatchesContainer);

		//for (let j = 0; j < groupNode.swatches.length; j++) {
			//console.log(combinations[i].base);
			//console.log(combinations[i]);
			let el = new ColorCombinationView('combination-' + (i + 1), combinations[i], combinationGroupSwatchesContainer);
			el.dataset.fg = combinations[i].foreground;
			el.dataset.bg = combinations[i].background;
			el.dataset.base = combinations[i].base;
		//}
	}
}

const hexStringToColor = (hex) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return new Color('rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(', ') + ', 1)');
  }
  throw new Error('Incorrect hex string');
}

parseStuff();

/*loadJSON((response) => {
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
});*/
