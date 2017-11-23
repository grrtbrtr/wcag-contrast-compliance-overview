class WCAGColorChecker {
	/**
	 * Checks the contrast between 2 colors according to their relative luminosity.
	 * Formula: http://juicystudio.com/article/luminositycontrastratioalgorithm.php#suggestedalgorithm
	 * 
	 * @return Returns a value from 1 to 21, where 1 means no contrast and 21 means the highest possible contrast.
	 */
	static getLuminosityContrastRatio(color1, color2) {
		let c1luminance = color1.luminance;
		let c2luminance = color2.luminance;

		if (c1luminance >= c2luminance) {
			return (c1luminance + 0.05) / (c2luminance + 0.05);
		}
		return (c2luminance + 0.05) / (c1luminance + 0.05);
	}

	/**
	 * Gets the WCAG compliancy for small text for a certain luminosity contrast ratio.
	 * See: https://www.w3.org/TR/WCAG/#visual-audio-contrast
	 *
	 * @param contrast The luminosity contrast ratio to check
	 * @param compliancyLevel Which compliancy level to check for ('AA' or 'AAA')
   */
	static isWCAGComplianceForSmallText(contrast, compliancyLevel) {
		compliancyLevel = compliancyLevel.toUpperCase();
		switch (compliancyLevel) {
			case 'AA':
				if (contrast >= 4.5) {
					return true;
				}
				break;
			case 'AAA':
				if (contrast >= 7) {
					return true;
				}
				break;
			default:
				throw new Error('Please provide a valid compliancy level, either \'AA\' or \'AAA\'');
		}

		return false;
	}

	/**
	 * Gets the WCAG compliancy for large text for a certain luminosity contrast ratio.
	 * See: https://www.w3.org/TR/WCAG/#visual-audio-contrast
	 *
	 * @param contrast The luminosity contrast ratio to check
	 * @param compliancyLevel Which compliancy level to check for ('AA' or 'AAA')
   */
	static isWCAGComplianceForLargeText(contrast, compliancyLevel) {
		switch (compliancyLevel) {
			case 'AA':
				if (contrast >= 3) {
					return true;
				}
				break;
			case 'AAA':
				if (contrast >= 4.5) {
					return true;
				}
				break;
			default:
				throw new Error('Please provide a valid compliancy level, either \'AA\' or \'AAA\'');
		}

		return false;
	}
}

export default WCAGColorChecker;