import { calculatePercent, roundNumberToDigits } from '@sporkbytes/math-utils';

const maxExponent = 6;
const errors = {
	cannotParse: `Your amount could not be parsed into a floating point number. Please pass an amount that can be parsed as a float.`,
	numberTooBig: 'Your numbers are too big to calculate safely.',
};

/**
 * A Money datatype to properly handle calculations and avoid floating point errors.
 */
class Money {
	amount: number;

	/**
	 * @param amount - The amount of money to be represented by the Money object.
	 * This can be a number or a string that can be parsed into a floating point number.
	 */
	constructor(amount: number | string) {
		const floatAmount = parseFloat(amount.toString());

		if (isNaN(floatAmount)) {
			throw new Error(errors.cannotParse);
		}

		this.amount = floatAmount;
	}

	/**
	 * Returns the value of the Money object rounded to the number of digits specified as a floating point number.
	 * @param precision - The number of digits you want to round to.
	 * @returns The amount of the Money object, rounded to the specified number of digits.
	 */
	valueOf(precision: number = 2): number {
		return roundNumberToDigits(this.amount, precision);
	}

	/**
	 * Returns the value of the Money object rounded to the number of digits specified as a string.
	 * @param precision - The number of digits you want to round to.
	 * @returns The amount of the Money object, rounded to the specified number of digits.
	 */
	toString(precision: number = 2): string {
		return this.valueOf(precision).toString();
	}

	/**
	 * Adds `money` to the Money object.
	 * @param money - The amount to be added to the Money object.
	 * This can be another Money object, a number, or a string that can be parsed into a floating point number.
	 * @returns A Money object with `money` amount added to the original object.
	 */
	add(money: Money | number | string): Money {
		if (!(money instanceof Money)) {
			money = new Money(money);
		}

		const [thisAmount, thatAmount] = Money.getNormalizedIntegerValues([
			this.amount,
			money.amount,
		]);
		const sum = thisAmount + thatAmount;

		if (!Money.numberInSafeIntegerRange(sum)) {
			throw new Error(errors.numberTooBig);
		}

		return new Money(`${sum}e-${maxExponent}`);
	}

	/**
	 * Subtracts `money` from the Money object.
	 * @param money - The amount to be subtracted from the Money object.
	 * This can be another Money object, a number, or a string that can be parsed into a floating point number.
	 * @returns A Money object with `money` amount subtracted from the original object.
	 */
	subtract(money: Money | number | string): Money {
		if (!(money instanceof Money)) {
			money = new Money(money);
		}

		const [thisAmount, thatAmount] = Money.getNormalizedIntegerValues([
			this.amount,
			money.amount,
		]);
		const difference = thisAmount - thatAmount;

		if (!Money.numberInSafeIntegerRange(difference)) {
			throw new Error(errors.numberTooBig);
		}

		return new Money(`${difference}e-${maxExponent}`);
	}

	/**
	 * Multiplies `money` by the Money object's value.
	 * @param money - The amount to be multiplied with the Money object.
	 * This can be another Money object, a number, or a string that can be parsed into a floating point number.
	 * @returns A Money object with `money` amount multiplied by the original object's value.
	 */
	multiply(money: Money | number | string): Money {
		if (!(money instanceof Money)) {
			money = new Money(money);
		}

		const [thisAmount, thatAmount] = Money.getNormalizedIntegerValues([
			this.amount,
			money.amount,
		]);
		const product = thisAmount * thatAmount;

		if (!Money.numberInSafeIntegerRange(product)) {
			throw new Error(errors.numberTooBig);
		}

		return new Money(`${product}e-${maxExponent * 2}`);
	}

	/**
	 * Adds `percent` of the original Money object to the Money object.
	 * This is handy for calculating taxes.
	 * @param percent - The percentage amount to be added to the Money object.
	 * @returns A Money object with `percent` amount added to the original object.
	 */
	addPercent(percent: number | string): Money {
		const amountToAdd = calculatePercent(this.amount, percent);

		return this.add(amountToAdd);
	}

	/**
	 * Subtracts `percent` of the original Money object from the Money object.
	 * This is handy for calculating discounts.
	 * @param percent - The percentage amount to be subtracted from the Money object.
	 * @returns A Money object with `percent` amount subtracted from the original object.
	 */
	subtractPercent(percent: number | string): Money {
		const amountToSubtract = calculatePercent(this.amount, percent);

		return this.subtract(amountToSubtract);
	}

	/**
	 * Given an array of numbers, return an array with the numbers represented as integers.
	 * @private
	 * @param numbers - An array of numbers to be converted to integers.
	 * @returns The array of numbers converted to integers.
	 */
	private static getNormalizedIntegerValues(
		numbers: [number, number]
	): [number, number] {
		return numbers.map((num) =>
			Math.round(Number(`${num}e${maxExponent}`))
		) as [number, number];
	}

	/**
	 * Checks whether the given number is in the range of safe integers.
	 * @private
	 * @param number - The number to check.
	 * @returns Whether the given number is in the range of safe integers.
	 */
	private static numberInSafeIntegerRange(number: number): boolean {
		return (
			number < Number.MAX_SAFE_INTEGER && number > Number.MIN_SAFE_INTEGER
		);
	}
}

export default Money;
