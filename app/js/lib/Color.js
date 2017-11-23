import MathUtils from 'MathUtils';

class Color {
	constructor(rgba) {
		if (rgba === 'transparent') {
			rgba = [0, 0, 0, 0];
		} else if (typeof rgba === 'string') {
			let rgbaString = rgba;
			rgba = rgbaString.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)(?:, ([\d.]+))?\)/);

			if (rgba) {
				rgba.shift();
			} else {
				throw new Error('Invalid string: ' + rgbaString);
			}
		}

		// If the opacity parameter is ommited, assume it's 1
		if (typeof rgba[3] === 'undefined') {
			rgba[3] = 1;
		}

		rgba = rgba.map((a) => {
			return MathUtils.round(a, 3)
		});

		this.rgba = rgba;
	}

	get rgb() {
		return this.rgba.slice(0, 3);
	}

	get alpha() {
		return this.rgba[3];
	}
	set alpha(alpha) {
		this.rgba[3] = alpha;
	}

	get luminance() {
		// Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
		let rgba = this.rgba.slice();
		for (let i = 0; i < 3; i++) {
			let rgb = rgba[i];
			rgb /= 255;
			rgb = rgb < 0.03928 ? rgb / 12.92 : Math.pow((rgb + 0.055) / 1.055, 2.4);
			rgba[i] = rgb;
		}
		return (0.2126 * rgba[0]) + (0.7152 * rgba[1]) + (0.0722 * rgba[2]);
	}

	flattenTransparency(backgroundColor) {
		let appliedColor = [];

		for (let i = 0; i < 3; i++) {
			appliedColor[i] = Math.round((this.alpha * this.rgb[i]) + ((1 - this.alpha) * backgroundColor.rgb[i]));
		}

		return new Color(appliedColor);
	}

	toString() {
		return 'rgb' + (this.alpha < 1 ? 'a' : '') + '(' + this.rgba.slice(0, this.alpha >= 1 ? 3 : 4).join(', ') + ')';
	}
}

export default Color;