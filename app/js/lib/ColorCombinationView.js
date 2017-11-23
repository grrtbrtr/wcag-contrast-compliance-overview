import Color from 'Color';
import MathUtils from 'MathUtils';
import WCAGColorChecker from 'WCAGColorChecker';

/**
 * Generate a color list (label & value pairs)
 *
 * @param color 	An array of objects representing a color to render (objects should contain a 'label' and a 'value' property containing a string)
 *
 * @return Returns the resulting HTMLElement object
 */
const createColorList = (colors) => {
	// Create the container
	let el = document.createElement('ul');
	el.classList.add('colors');

	// Loop through all the colors and render them
	for (let i = 0; i < colors.length; i++) {
		// Color container
		let colorEl = document.createElement('li');
		colorEl.classList.add('colors__color', 'color');

		// Swatch
		let swatchEl = document.createElement('span');
		swatchEl.classList.add('color__swatch');
		swatchEl.style.backgroundColor = colors[i].value;
		colorEl.appendChild(swatchEl);

		// Description
		let descriptionEl = document.createElement('span');
		descriptionEl.classList.add('color__description');
		// Label
		let labelEl = document.createElement('span');
		labelEl.classList.add('color__label');
		labelEl.innerHTML = colors[i].label;
		descriptionEl.appendChild(labelEl);
		// Value
		let valueEl = document.createElement('span');
		valueEl.classList.add('color__value');
		valueEl.innerHTML = colors[i].value;
		descriptionEl.appendChild(valueEl);
		// Add the description element
		colorEl.appendChild(descriptionEl);

		// Add the color container element
		el.appendChild(colorEl);
	}

	return el;
}

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
	el.classList.add('compliance_overview__element');
	
	let complianceCheckFunc;
	let htmlContent = '<span class="level">' + level + '</span><span class="threshold">';

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
	htmlContent += '</span>';

	el.classList.add(complianceCheckFunc(contrast, level) ? 'compliance_overview__element--passed' : 'compliance_overview__element--failed');
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
		// Create row
		let el = document.createElement('article');
		el.classList.add('combination');
		el.id = id;

		// Create preview
		let previewEl = document.createElement('div');
		previewEl.classList.add('combination__preview')
		previewEl.style.color = foreground;
		previewEl.style.backgroundColor = background;
		el.appendChild(previewEl);

		parent.appendChild(el);

		// Get computed colors
		let colorStyle = window.getComputedStyle(previewEl);
		this.foregroundColor = new Color(colorStyle.color);
		this.backgroundColor = new Color(colorStyle.backgroundColor);
		this.flattenedBackgroundColor = this.backgroundColor.flattenTransparency(new Color('transparent'));
		this.flattenedForegroundColor = this.foregroundColor.flattenTransparency(this.flattenedBackgroundColor);
		this.colorContrast = WCAGColorChecker.getLuminosityContrastRatio(this.flattenedForegroundColor, this.flattenedBackgroundColor);

		// Set the text on the preview
		previewEl.innerHTML = this.foregroundColor + ' on<br />' + this.backgroundColor;

		// Add original colors
		let originalColorsContainerEl = document.createElement('div');
		originalColorsContainerEl.classList.add('combination__colors', 'color_list');
		el.appendChild(originalColorsContainerEl);
		/*let originalColorsTitleEl = document.createElement('h2');
		originalColorsTitleEl.classList.add('color_list__title');
		originalColorsTitleEl.innerHTML = 'Original colors';
		originalColorsContainerEl.appendChild(originalColorsTitleEl);*/
		let originalColors = [
			{
				label: 'Foreground',
				value: foreground
			},
			{
				label: 'Background',
				value: background
			}/*,
			{
				label: 'Base',
				value: background
			}*/
		];
		let originalColorsListEl = createColorList(originalColors);
		originalColorsListEl.classList.add('color_list__colors');
		originalColorsContainerEl.appendChild(originalColorsListEl);

		// Add flattened colors
		let flattenedColorsContainerEl = document.createElement('div');
		flattenedColorsContainerEl.classList.add('combination__colors', 'color_list');
		el.appendChild(flattenedColorsContainerEl);
		/*let flattenedColorsTitleEl = document.createElement('h2');
		flattenedColorsTitleEl.classList.add('color_list__title');
		flattenedColorsTitleEl.innerHTML = 'Flattened colors';
		flattenedColorsContainerEl.appendChild(flattenedColorsTitleEl);*/
		let flattenedColors = [
			{
				label: 'Foreground',
				value: this.flattenedForegroundColor
			},
			{
				label: 'Background',
				value: this.flattenedBackgroundColor
			}
		];
		let flattenedColorsListEl = createColorList(flattenedColors);
		flattenedColorsListEl.classList.add('color_list__colors');
		flattenedColorsContainerEl.appendChild(flattenedColorsListEl);

		// Show the contrast ratio
		let contrastEl = document.createElement('div');
		contrastEl.classList.add('combination__contrast');
		contrastEl.innerHTML = MathUtils.round(this.colorContrast, 2);
		el.appendChild(contrastEl);

		// Add an overview of compliance
		let complianceEl = document.createElement('ul');
		complianceEl.classList.add('combination__compliance_overview', 'compliance_overview');
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'AA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'AAA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'AA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'AAA', 'li'));
		el.appendChild(complianceEl);

		return el;
	}
}

export default ColorCombinationView;