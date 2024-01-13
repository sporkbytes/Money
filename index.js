import { calculatePercent, roundNumberToDigits } from '@sporkbytes/math-utils';

const maxExponent = 6;
const errors = {
	cannotParse: `Your amount could not be parsed into a floating point number. Please pass an amount that can be parsed as a float.`,
	numberTooBig: 'Your numbers are too big to calculate safely.',
};

/**
 * A Money datatype to properly handle calculations and avoid floating point errors.
 * @class
 * @param {number} amount - The amount of money to be represented by the Money object.  This can be a number or a string that can be parsed into a floating point number.
 */
function Money(amount) {
	const floatAmount = parseFloat(amount);

	if (isNaN(floatAmount)) {
		throw new Error(errors.cannotParse);
	}

	this.amount = floatAmount;
}

/**
 * @description Returns the value of the Money object rounded to the number of digits specified as a floating point number.
 * @param {number} [precision = 2] - The number of digits you want to round to.
 * @return {number} The amount of the Money object, rounded to the specified number of digits.
 */
Money.prototype.valueOf = function (precision = 2) {
	return roundNumberToDigits(this.amount, precision);
};

/**
 * @description Returns the value of the Money object rounded to the number of digits specified as a string.
 * @param {number} [precision = 2] - The number of digits you want to round to.
 * @return {string} The amount of the Money object, rounded to the specified number of digits.
 */
Money.prototype.toString = function (precision = 2) {
	return this.valueOf(precision).toString();
};

/**
 * @description Adds `money` to the Money object.
 * @param {Money|number|string} money - The amount to be added to the Money object.  This can be another Money object, a number, or a string that can be parsed into a floating point number.
 * @return {Money} A Money object with `money` amount added to the original object.
 */
Money.prototype.add = function (money) {
	if (!(money instanceof Money)) {
		money = new Money(money);
	}

	const [thisAmount, thatAmount] = getNormalizedIntegerValues([
		this.amount,
		money.amount,
	]);
	const sum = thisAmount + thatAmount;

	if (!numberInSafeIntegerRange(sum)) {
		throw new Error(errors.numberTooBig);
	}

	return new Money(sum + `e-${maxExponent}`);
};

/**
 * @description Subtracts `money` from the Money object.
 * @param {Money|number|string} money - The amount to be subtracted from the Money object.  This can be another Money object, a number, or a string that can be parsed into a floating point number.
 * @return {Money} A Money object with `money` amount subtracted from the original object.
 */
Money.prototype.subtract = function (money) {
	if (!(money instanceof Money)) {
		money = new Money(money);
	}

	const [thisAmount, thatAmount] = getNormalizedIntegerValues([
		this.amount,
		money.amount,
	]);
	const difference = thisAmount - thatAmount;

	if (!numberInSafeIntegerRange(difference)) {
		throw new Error(errors.numberTooBig);
	}

	return new Money(difference + `e-${maxExponent}`);
};

/**
 * @description Multiplies `money` by the Money object's value.
 * @param {Money|number|string} money - The amount to be multiplied from the Money object.  This can be another Money object, a number, or a string that can be parsed into a floating point number.
 * @return {Money} A Money object with `money` amount multiplied by the original object's value.
 */
Money.prototype.multiply = function (money) {
	if (!(money instanceof Money)) {
		money = new Money(money);
	}

	const [thisAmount, thatAmount] = getNormalizedIntegerValues([
		this.amount,
		money.amount,
	]);
	const product = thisAmount * thatAmount;

	if (!numberInSafeIntegerRange(product)) {
		throw new Error(errors.numberTooBig);
	}

	return new Money(product + `e-${maxExponent * 2}`);
};

/**
 * @description Adds `percent` of the original Money object to the Money object.
 * @param {number|string} percent - The percentage amount to be added to the Money object.  This is handy for calculating taxes.
 * @return {Money} A Money object with `percent` amount added to the original object.
 */
Money.prototype.addPercent = function (percent) {
	const amountToAdd = calculatePercent(this.amount, percent);

	return this.add(amountToAdd);
};

/**
 * @description Subtracts `percent` of the original Money object from the Money object.
 * @param {number|string} percent - The percentage amount to be subtracted from the Money object.  This is handy for calculating discounts.
 * @return {Money} A Money object with `percent` amount subtracted from the original object.
 */
Money.prototype.subtractPercent = function (percent) {
	const amountToSubtract = calculatePercent(this.amount, percent);

	return this.subtract(amountToSubtract);
};

/**
 * @description Given an array of numbers, return an array with the numbers represented as integers.
 * @private
 * @param {array} numbers - An array of numbers to be converted to integers.
 * @return {array} The array of numbers converted to integers.
 */
function getNormalizedIntegerValues(numbers) {
	return numbers.map((number) => Math.round(number + `e${maxExponent}`));
}

/**
 * @description Checks whether the given number is in the range of safe integers.
 * @private
 * @param {number} number - The number to check.
 * @return {boolean} Whether the given number is in the range of safe integers.
 */
function numberInSafeIntegerRange(number) {
	return number < Number.MAX_SAFE_INTEGER && number > Number.MIN_SAFE_INTEGER;
}

export default Money;
