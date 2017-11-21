class MathUtils {
	static round(number, decimals) {
		let round = Math.round;

		decimals = parseInt(decimals, 10) || 0;
		var multiplier = Math.pow(10, decimals);
		return round(number * multiplier) / multiplier;
	}
}

export default MathUtils;