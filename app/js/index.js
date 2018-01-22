import '../styles/styles.scss';

import Color from 'Color';
import ColorCombination from 'ColorCombination';
import ColorCombinationView from 'ColorCombinationView';

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

const init = () => {
	parseInput();

	document.getElementById('theme').addEventListener('submit', (e) => {
		e.preventDefault();
		parseInput();
	})
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const parseInput = async () => {
	// Clear existing combinations
	document.getElementById('combinations').innerHTML = '';

	await sleep(200);

	let inputColors = {
		background: buildArrayFromFieldColorValues(document.querySelectorAll('#colors_background .input_swatches__swatch input[type="text"]')),
		text: buildArrayFromFieldColorValues(document.querySelectorAll('#colors_text .input_swatches__swatch input[type="text"]')),
		overlay: buildArrayFromFieldColorValues(document.querySelectorAll('#colors_overlay .input_swatches__swatch input[type="text"]'))
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
			let color = new Color(c.value);
			color.alpha = opacityArr[j];
			textColors.push(color);
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
			let color = new Color(c.value);
			color.alpha = opacityArr[j];
			overlayColors.push(color);
		}
	}

	let combinations = [];
	let container = document.getElementById('combinations');
	for (let i = 0; i < backgroundColors.length; i++) {
		for (let j = 0; j < overlayColors.length; j++) {
			for (let k = 0; k < textColors.length; k++) {
				combinations.push(new ColorCombination(textColors[k], overlayColors[j], backgroundColors[i]));
			}
		}
	}

	for (let i = 0; i < combinations.length; i++) {
		let el = new ColorCombinationView('combination-' + (i + 1), combinations[i], container);
		el.dataset.fg = combinations[i].foreground;
		el.dataset.bg = combinations[i].background;
		el.dataset.base = combinations[i].base;
	}

	//
	// filter
	//
	let levelFilterElements = document.querySelectorAll('input[name=filter-levels]');
	for (let i = 0; i < levelFilterElements.length; i++) {
		levelFilterElements[i].addEventListener('change', (e) => {
			setLevelFilter(e.currentTarget.value);
		});
	}
	setLevelFilter(document.querySelector('input[name=filter-levels][checked]').value);
}

const setLevelFilter = (minimumLevel) => {
	let combinations = document.querySelectorAll('.combination');
	for (let i = 0; i < combinations.length; i++) {
		if (combinations[i].dataset.contrast < minimumLevel) {
			combinations[i].style.display = 'none';
		} else {
			combinations[i].style.display = '';
		}
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

init();
