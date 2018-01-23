import Color from 'Color';
import MathUtils from 'MathUtils';
import WCAGColorChecker from 'WCAGColorChecker';

/**
 * Generate compliance indication item
 *
 * @param contrast		The contrast value
 * @param size 				The size to check compliancy for ('small' or 'large' text)
 * @param elementType The type of HTML element to create
 *
 * @return Returns the resulting HTMLElement object
 */
const createComplianceIndicatorItem = (contrast, size, elementType) => {
	let el = document.createElement(elementType);
	el.classList.add('compliance_overview__element');

	let complianceCheckFunc;

	switch (size) {
		case 'small':
			complianceCheckFunc = WCAGColorChecker.isWCAGComplianceForSmallText;
			break;
		case 'large':
			complianceCheckFunc = WCAGColorChecker.isWCAGComplianceForLargeText;
			break;
		default:
			break;
	}

	let htmlContent = '';
	if (complianceCheckFunc(contrast, 'AAA')) {
		htmlContent += '<span class="level  level--aaa">AAA</span>';
	} else if (complianceCheckFunc(contrast, 'AA')) {
		htmlContent += '<span class="level  level--aa">AA</span>';
	} else {
		htmlContent = '<span class="level  level--not_compliant"><i class="icon">error_outline</i></span>';
	}
	el.innerHTML = htmlContent;

	return el;
}

/**
 * A color combination view element
 */
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
		let previewContainerEl = document.createElement('div');
		previewContainerEl.classList.add('combination__preview', 'preview');
		// Create preview background base
		let previewBaseEl = document.createElement('div');
		previewBaseEl.classList.add('preview__base');
		previewBaseEl.style.backgroundColor = colorCombination.base;
		previewContainerEl.appendChild(previewBaseEl);
		// Create actual preview element
		let previewForegroundEl = document.createElement('div');
		previewForegroundEl.classList.add('preview__element');
		previewForegroundEl.style.color = colorCombination.foreground;
		previewForegroundEl.style.backgroundColor = colorCombination.background;
		previewForegroundEl.innerHTML = '<div class="preview__inner_element" style="background-color: ' + colorCombination.foreground + '"></div>'
		previewContainerEl.appendChild(previewForegroundEl);
		// Add to element
		el.appendChild(previewContainerEl);

		parent.appendChild(el);

		// Get computed colors
		let previewBaseElColorStyle = window.getComputedStyle(previewBaseEl);
		let previewForegroundElColorStyle = window.getComputedStyle(previewForegroundEl);
		this.baseColor = new Color(previewBaseElColorStyle.backgroundColor);
		this.foregroundColor = new Color(previewForegroundElColorStyle.color);
		this.backgroundColor = new Color(previewForegroundElColorStyle.backgroundColor);
		this.flattenedBackgroundColor = this.backgroundColor.flattenTransparency(this.baseColor);
		this.flattenedForegroundColor = this.foregroundColor.flattenTransparency(this.flattenedBackgroundColor);
		this.colorContrast = WCAGColorChecker.getLuminosityContrastRatio(this.flattenedForegroundColor, this.flattenedBackgroundColor);

		// Add colors
		let originalColorsListEl = document.createElement('ul');
		originalColorsListEl.classList.add('combination__colors', 'color_list');
		el.appendChild(originalColorsListEl);
		// Overlay
		let originalColorsOverlayEl = document.createElement('li');
		originalColorsOverlayEl.classList.add('color_list__color');
		let originalColorsOverlayLabelEl = document.createElement('span');
		originalColorsOverlayLabelEl.classList.add('color_list__label');
		originalColorsOverlayLabelEl.innerHTML = 'Background overlay';
		originalColorsOverlayEl.appendChild(originalColorsOverlayLabelEl);
		let originalColorsOverlayColorEl = document.createElement('span');
		originalColorsOverlayColorEl.classList.add('color_list__value');
		originalColorsOverlayColorEl.innerHTML = this.backgroundColor.toHexString() + ', ' + (this.backgroundColor.alpha * 100) + '%';
		originalColorsOverlayEl.appendChild(originalColorsOverlayColorEl);
		originalColorsListEl.appendChild(originalColorsOverlayEl);
		// Text
		let originalColorsTextEl = document.createElement('li');
		originalColorsTextEl.classList.add('color_list__color');
		let originalColorsTextLabelEl = document.createElement('span');
		originalColorsTextLabelEl.classList.add('color_list__label');
		originalColorsTextLabelEl.innerHTML = 'Text';
		originalColorsTextEl.appendChild(originalColorsTextLabelEl);
		let originalColorsTextColorEl = document.createElement('span');
		originalColorsTextColorEl.classList.add('color_list__value');
		originalColorsTextColorEl.innerHTML = this.foregroundColor.toHexString() + ', ' + (this.foregroundColor.alpha * 100) + '%';
		originalColorsTextEl.appendChild(originalColorsTextColorEl);
		originalColorsListEl.appendChild(originalColorsTextEl);

		// Show the contrast ratio
		let contrastEl = document.createElement('div');
		contrastEl.classList.add('combination__contrast');
		contrastEl.innerHTML = MathUtils.round(this.colorContrast, 2);
		el.appendChild(contrastEl);

		// Add an overview of compliance
		let complianceEl = document.createElement('ul');
		complianceEl.classList.add('combination__compliance_overview', 'compliance_overview');
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'small', 'li'));
		complianceEl.appendChild(createComplianceIndicatorItem(this.colorContrast, 'large', 'li'));
		el.appendChild(complianceEl);

		el.dataset.contrast = this.colorContrast;

		return el;
	}
}

export default ColorCombinationView;
