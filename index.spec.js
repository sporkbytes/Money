const { describe, it } = intern.getInterface('bdd');
const { assert, expect } = intern.getPlugin('chai');

const Money = require('./index');

describe('Money', () => {
	const tenCents = new Money(0.1);
	const twentyCents = new Money(0.2);
	const originalAmount = new Money(25.9);
	const discountAmount = new Money(6.475);
	const discountPercent = 25;

	describe('constructor', () => {
		it('should create a new instance of the Money object with a floating point "amount" property equal to the amount passed to the constructor', () => {
			const numericMoney = new Money(0.125);
			const stringMoney = new Money('0.125');

			assert.strictEqual(numericMoney.amount, 0.125);
			assert.strictEqual(stringMoney.amount, 0.125);
		});

		it('should throw an error if the value passed to the constructor could not be parsed as a floating point number', () => {
			expect(() => new Money('randomString')).to.throw('Your amount could not be parsed into a floating point number. Please pass an amount that can be parsed as a float.');
		});
	});

	describe('valueOf', () => {
		it('should round values to 2 digits by default', () => {
			assert.strictEqual(new Money(0.125).valueOf(), 0.13);
		});

		it('should round to the specified number of digits', () => {
			assert.strictEqual(new Money(0.1234321).valueOf(3), 0.123);
		});

		it('should use valueOf implicitly if you coerce the object to a number', () => {
			assert.strictEqual(+new Money(0.125), 0.13);
		});
	});

	describe('toString', () => {
		it('should round values to 2 digits by default and return a string', () => {
			assert.strictEqual(new Money(0.125).toString(), "0.13");
		});

		it('should round to the specified number of digits and return a string', () => {
			assert.strictEqual(new Money(0.1234321).toString(3), "0.123");
		});
	});

	describe('add', () => {
		it('should correctly add commonly miscalculated floating point additions', () => {
			// 0.1 + 0.2 = 0.30000000000000004
			assert.strictEqual(+tenCents.add(twentyCents), 0.3);
		});

		it('should retain the full, non-rounded amount accessible via .amount', () => {
			assert.strictEqual(originalAmount.add(discountAmount).amount, 32.375);
		});

		it('should allow you to a add non-Money object to a Money object', () => {
			assert.strictEqual(+tenCents.add(0.2), 0.3);
		});
	});

	describe('subtract', () => {
		it('should correctly subtract commonly miscalculated floating point subtractions', () => {
			// 25.9 - 6.475 = 19.424999999999997
			assert.strictEqual(+originalAmount.subtract(discountAmount), 19.43);
		});

		it('should retain the full, non-rounded amount accessible via .amount', () => {
			assert.strictEqual(originalAmount.subtract(discountAmount).amount, 19.425);
		});

		it('should allow you to a subtract non-Money object from a Money object', () => {
			assert.strictEqual(+new Money(0.2).subtract(0.1), 0.1);
		});
	});

	describe('multiply', () => {
		it('should correctly multiply commonly miscalculated floating point multiplications', () => {
			// 0.1 * 0.2 = 0.020000000000000004
			assert.strictEqual(+tenCents.multiply(twentyCents), 0.02);
		});

		it('should retain the full, non-rounded amount accessible via .amount', () => {
			assert.strictEqual(originalAmount.multiply(discountAmount).amount, 167.7025);
		});

		it('should allow you to a multiply non-Money object to a Money object', () => {
			assert.strictEqual(+tenCents.multiply(0.2), 0.02);
		});
	});

	describe('addPercent', () => {
		it('should correctly add commonly miscalculated floating point percentage additions', () => {
			// 0.2 + 50% [0.1] = 0.30000000000000004
			assert.strictEqual(+twentyCents.addPercent(50), 0.3);
		});

		it('should retain the full, non-rounded amount accessible via .amount', () => {
			assert.strictEqual(new Money(0.125).addPercent(50).amount, 0.1875);
		});
	});

	describe('subtractPercent', () => {
		it('should correctly subtract commonly miscalculated floating point percentage subtractions', () => {
			// 25.9 - 25% [6.475] = 19.424999999999997
			assert.strictEqual(+originalAmount.subtractPercent(discountPercent), 19.43);
		});

		it('should retain the full, non-rounded amount accessible via .amount', () => {
			assert.strictEqual(originalAmount.subtractPercent(discountPercent).amount, 19.425);
		});
	});
});
