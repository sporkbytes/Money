/**
 * A Money datatype to properly handle calculations and avoid floating point errors.
 * @module Money
 */
(function(root, factory) {
	/* istanbul ignore next */
	if (typeof define === 'function' && define.amd) {
		define([
			'@sporkbytes/math-utils'
		], factory);
	}
	else if (typeof module === 'object' && module.exports) {
		module.exports = factory(
			require('@sporkbytes/math-utils')
		);
	}
	else {
		root.Money = factory(
			root.mathUtils
		);
	}
})(/* istanbul ignore next */ typeof self !== 'undefined' ? self : this, function(
	mathUtils
) {
	function Money(amount) {
		const floatAmount = parseFloat(amount);

		if (isNaN(floatAmount)) {
			throw new Error('Your amount could not be parsed into a floating point number. Please pass an amount that can be parsed as a float.');
		}

		this.amount = floatAmount;
	}

	/**
	 * @alias module:Money.valueOf
	 * @description Returns the value of the Money object rounded to the number of digits specified as a floating point number.
	 * @param {number} [precision = 2] - The number of digits you want to round to.
	 * @return {number} The amount of the Money object, rounded to the specified number of digits.
	 */
	Money.prototype.valueOf = function(precision = 2) {
		return mathUtils.roundNumberToDigits(this.amount, precision);
	}

	/**
	 * @alias module:Money.toString
	 * @description Returns the value of the Money object rounded to the number of digits specified as a string.
	 * @param {number} [precision = 2] - The number of digits you want to round to.
	 * @return {string} The amount of the Money object, rounded to the specified number of digits.
	 */
	Money.prototype.toString = function(precision = 2) {
		return this.valueOf(precision).toString();
	}

	/**
	 * @alias module:Money.add
	 * @description Adds `money` to the Money object.
	 * @param {Money|number|string} money - The amount to be added to the Money object.  This can be another Money object, a number, or a string that can be parsed into a floating point number.
	 * @return {Money} A Money object with `money` amount added to the original object.
	 */
	Money.prototype.add = function(money) {
		if (!(money instanceof Money)) {
			money = new Money(money);
		}

		return new Money((this.amount * 100 + money.amount * 100) / 100);
	}

	/**
	 * @alias module:Money.subtract
	 * @description Subtracts `money` from the Money object.
	 * @param {Money|number|string} money - The amount to be subtracted from the Money object.  This can be another Money object, a number, or a string that can be parsed into a floating point number.
	 * @return {Money} A Money object with `money` amount subtracted from the original object.
	 */
	Money.prototype.subtract = function(money) {
		if (!(money instanceof Money)) {
			money = new Money(money);
		}

		return new Money((this.amount * 100 - money.amount * 100) / 100);
	}

	/**
	 * @alias module:Money.multiply
	 * @description Multiplies `money` by the Money object's value.
	 * @param {Money|number|string} money - The amount to be multiplied from the Money object.  This can be another Money object, a number, or a string that can be parsed into a floating point number.
	 * @return {Money} A Money object with `money` amount multiplied by the original object's value.
	 */
	Money.prototype.multiply = function(money) {
		if (!(money instanceof Money)) {
			money = new Money(money);
		}

		return new Money(((this.amount * 100) * (money.amount * 100)) / 10000);
	}

	/**
	 * @alias module:Money.addPercent
	 * @description Adds `percent` of the original Money object to the Money object.
	 * @param {number|string} percent - The percentage amount to be added to the Money object.  This is handy for calculating taxes.
	 * @return {Money} A Money object with `percent` amount added to the original object.
	 */
	Money.prototype.addPercent = function(percent) {
		const amountToAdd = mathUtils.calculatePercent(this.amount, percent);

		return this.add(amountToAdd);
	}

	/**
	 * @alias module:Money.subtractPercent
	 * @description Subtracts `percent` of the original Money object from the Money object.
	 * @param {number|string} percent - The percentage amount to be subtracted from the Money object.  This is handy for calculating discounts.
	 * @return {Money} A Money object with `percent` amount subtracted from the original object.
	 */
	Money.prototype.subtractPercent = function(percent) {
		const amountToSubtract = mathUtils.calculatePercent(this.amount, percent);

		return this.subtract(amountToSubtract);
	}

	return Money;
});
