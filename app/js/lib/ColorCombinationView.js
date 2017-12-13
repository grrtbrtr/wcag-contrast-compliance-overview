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

		if (level === 'aa') {
			htmlContent += '4.5';
		} else if (level === 'aaa') {
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
	 * @param colors	An object containing the colors as valid CSS strings (properties: foreground, background and base)
	 * @param parent		The HTMLElement object to which the resulting color combination view element will be added
	 *
	 * @return Returns the added HTMLElement
	 */
	constructor(id, colorCombination, parent) {
		// Create row
		let el = document.createElement('article');
		el.classList.add('combination');
		el.id = id;

		// Create preview
		let previewEl = document.createElement('div');
		previewEl.classList.add('combination__preview', 'preview');
		// Create preview background base
		let previewBaseEl = document.createElement('div');
		previewBaseEl.classList.add('preview__base');
		previewBaseEl.style.backgroundColor = colorCombination.base;
		previewEl.appendChild(previewBaseEl);
		// Create actual preview element
		let previewActualEl = document.createElement('div');
		previewActualEl.classList.add('preview__element');
		previewActualEl.style.color = colorCombination.foreground;
		previewActualEl.style.backgroundColor = colorCombination.background;
		previewEl.appendChild(previewActualEl);
		// Add to element
		el.appendChild(previewEl);

		parent.appendChild(el);

		// Get computed colors
		let previewBaseElColorStyle = window.getComputedStyle(previewBaseEl);
		let actualPreviewElColorStyle = window.getComputedStyle(previewActualEl);
		this.baseColor = new Color(previewBaseElColorStyle.backgroundColor);
		this.foregroundColor = new Color(actualPreviewElColorStyle.color);
		this.backgroundColor = new Color(actualPreviewElColorStyle.backgroundColor);
		this.flattenedBackgroundColor = this.backgroundColor.flattenTransparency(this.baseColor);
		this.flattenedForegroundColor = this.foregroundColor.flattenTransparency(this.flattenedBackgroundColor);
		this.colorContrast = WCAGColorChecker.getLuminosityContrastRatio(this.flattenedForegroundColor, this.flattenedBackgroundColor);

		// Set the text on the preview
		previewActualEl.innerHTML = this.foregroundColor + ' on<br />' + this.backgroundColor;

		// Add original colors
		let originalColorsContainerEl = document.createElement('div');
		originalColorsContainerEl.classList.add('combination__colors', 'color_list');
		el.appendChild(originalColorsContainerEl);
		let originalColorsListLabelEl = document.createElement('span');
		originalColorsListLabelEl.classList.add('color_list__title');
		originalColorsListLabelEl.innerHTML = 'Original colors';
		originalColorsContainerEl.appendChild(originalColorsListLabelEl);
		let originalColors = [
			{
				label: 'Foreground',
				value: colorCombination.foreground
			},
			{
				label: 'Background',
				value: colorCombination.background
			},
			{
				label: 'Base',
				value: colorCombination.base
			}
		];
		let originalColorsListEl = createColorList(originalColors);
		originalColorsListEl.classList.add('color_list__colors');
		originalColorsContainerEl.appendChild(originalColorsListEl);

		// Add flattened colors
		let flattenedColorsContainerEl = document.createElement('div');
		flattenedColorsContainerEl.classList.add('combination__colors', 'color_list');
		el.appendChild(flattenedColorsContainerEl);
		let flattenedColorsListLabelEl = document.createElement('span');
		flattenedColorsListLabelEl.classList.add('color_list__title');
		flattenedColorsListLabelEl.innerHTML = 'Flattened colors';
		flattenedColorsContainerEl.appendChild(flattenedColorsListLabelEl);
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
		let contrastContainerEl = document.createElement('div');
		contrastContainerEl.classList.add('combination__contrast', 'contrast');
		let contrastLabelEl = document.createElement('span');
		contrastLabelEl.classList.add('contrast__title');
		contrastLabelEl.innerHTML = 'Contrast';
		contrastContainerEl.appendChild(contrastLabelEl);
		let contrastEl = document.createElement('div');
		contrastEl.classList.add('contrast__value');
		contrastEl.innerHTML = MathUtils.round(this.colorContrast, 2);
		contrastContainerEl.appendChild(contrastEl);
		el.appendChild(contrastContainerEl);

		// Add an overview of compliance
		let complianceEl = document.createElement('ul');
		complianceEl.classList.add('combination__compliance_overview', 'compliance_overview');
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'aa', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'aaa', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'AA', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'AAA', 'li'));
		el.appendChild(complianceEl);

		return el;
	}
}

export default ColorCombinationView;
