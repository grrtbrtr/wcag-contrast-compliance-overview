import Color from 'Color';
import MathUtils from 'MathUtils';
import WCAGColorChecker from 'WCAGColorChecker';

/**
 * Generate compliance indication item
 *
 * @param contrast		The contrast value
 * @param size 			The size to check compliancy for ('small' or 'large' text)
 * @param level 		The compliance level to check for ('AA' or 'AAA')
 * @param elementType 	The type of HTML element to create
 *
 * @return Returns the resulting HTMLElement object
 */
const createComplianceIndicatorItem = (contrast, size, level, elementType) => {
	let el = document.createElement(elementType);
	el.classList.add('compliance__element', 'compliance__element--' + size);

	let complianceCheckFunc;
	let htmlContent = '<span class="level">' + level + '</span><br />';

	if (size === 'small') {
		complianceCheckFunc = WCAGColorChecker.isWCAGComplianceForSmallText;

		if (level === 'AA') {
			htmlContent += '4.5';
		} else if (level === 'AAA') {
			htmlContent += '7';
		}
	} else if (size === 'large') {
		complianceCheckFunc = WCAGColorChecker.isWCAGComplianceForLargeText;

		if (level === 'AA') {
			htmlContent += '3';
		} else if (level === 'AAA') {
			htmlContent += '4.5';
		}
	}
	el.classList.add(complianceCheckFunc(contrast, level) ? 'compliance__element--passed' : 'compliance__element--failed');
	el.innerHTML = htmlContent;

	return el;
}

class ColorCombinationView {
	/**
	 * The constructor function
	 *
	 * @param id 			The id that will be set for this element
	 * @param foreground 	The foreground color (as a valid CSS value string)
	 * @param background 	The background color (as a valid CSS value string)
	 * @param parent		The HTMLElement object to which the resulting color combination view element will be added
	 *
	 * @return Returns the added HTMLElement
	 */
	constructor(id, foreground, background, parent) {
		// Create container
		let el = document.createElement('div');
		el.id = id;
		el.classList.add('combination');

		// Create color swatch
		let colorEl = document.createElement('div');
		colorEl.classList.add('combination__colors');
		colorEl.style.color = foreground;
		colorEl.style.backgroundColor = background;
		el.appendChild(colorEl); // Add to container

		el.style.display = 'none';
		parent.appendChild(el);

		// Get computed colors
		let colorStyle = window.getComputedStyle(colorEl);
		this.foregroundColor = new Color(colorStyle.color);
		this.backgroundColor = new Color(colorStyle.backgroundColor);
		this.opaqueForegroundColor = this.foregroundColor.flattenTransparency(this.backgroundColor);
		this.colorContrast = WCAGColorChecker.getLuminosityContrastRatio(this.opaqueForegroundColor, this.backgroundColor);

		// Render the color values
		colorEl.innerHTML = '<div class="color"><span class="color__label">Foreground:</span><br /><span class="color__value">' + this.foregroundColor + '</span><br /><span class="color__value">' + this.opaqueForegroundColor + '</span></div><div class="color"><span class="color__label">Background:</span><br /><span class="color__value">' + this.backgroundColor + '</span>';

		// Render the calculated contrast
		let contrastEl = document.createElement('div');
		contrastEl.classList.add('combination__contrast');
		contrastEl.innerHTML = '<span class="label">Contrast</span><br /><span class="value">' + MathUtils.round(this.colorContrast, 2) + '</span>';
		el.appendChild(contrastEl);

		// Render the compliance overview
		let complianceEl = document.createElement('ul');
		complianceEl.classList.add('combination__compliance', 'compliance');
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'AA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'AAA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'AA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'AAA', 'li'));
		// Add the compliance block to the DOM
		el.appendChild(complianceEl);

		// Make the color combination visible
		el.style.removeProperty('display');

		return el;
	}
}

export default ColorCombinationView;