const Money = require("./index");

describe("Money", () => {
	const tenCents = new Money(0.1);
	const twentyCents = new Money(0.2);
	const originalAmount = new Money(25.9);
	const discountAmount = new Money(6.475);
	const discountPercent = 25;

	describe("constructor", () => {
		it('should create a new instance of the Money object with a floating point "amount" property equal to the amount passed to the constructor', () => {
			const numericMoney = new Money(0.125);
			const stringMoney = new Money("0.125");

			expect(numericMoney.amount).toBe(0.125);
			expect(stringMoney.amount).toBe(0.125);
		});

		it("should throw an error if the value passed to the constructor could not be parsed as a floating point number", () => {
			expect(() => new Money("randomString")).toThrow(
				"Your amount could not be parsed into a floating point number. Please pass an amount that can be parsed as a float."
			);
		});
	});

	describe("valueOf", () => {
		it("should round values to 2 digits by default", () => {
			expect(new Money(0.125).valueOf()).toBe(0.13);
		});

		it("should round to the specified number of digits", () => {
			expect(new Money(0.1234321).valueOf(3)).toBe(0.123);
		});

		it("should use valueOf implicitly if you coerce the object to a number", () => {
			expect(+new Money(0.125)).toBe(0.13);
		});
	});

	describe("toString", () => {
		it("should round values to 2 digits by default and return a string", () => {
			expect(new Money(0.125).toString()).toBe("0.13");
		});

		it("should round to the specified number of digits and return a string", () => {
			expect(new Money(0.1234321).toString(3)).toBe("0.123");
		});
	});

	describe("add", () => {
		it("should correctly add commonly miscalculated floating point additions", () => {
			// 0.1 + 0.2 = 0.30000000000000004
			expect(+tenCents.add(twentyCents)).toBe(0.3);
		});

		it("should retain the full, non-rounded amount accessible via .amount", () => {
			const highPrecision1 = new Money(12.2345);
			const highPrecision2 = new Money(12.2454);

			expect(originalAmount.add(discountAmount).amount).toBe(32.375);
			expect(highPrecision1.add(highPrecision2).amount).toBe(24.4799);
			expect(() => new Money(9007199256).add(1)).toThrow(
				"Your numbers are too big to calculate safely."
			);
		});

		it("should allow you to a add non-Money object to a Money object", () => {
			expect(+tenCents.add(0.2)).toBe(0.3);
		});
	});

	describe("subtract", () => {
		it("should correctly subtract commonly miscalculated floating point subtractions", () => {
			// 25.9 - 6.475 = 19.424999999999997
			expect(+originalAmount.subtract(discountAmount)).toBe(19.43);
		});

		it("should retain the full, non-rounded amount accessible via .amount", () => {
			const highPrecision1 = new Money(24.4799);
			const highPrecision2 = new Money(12.2454);

			expect(originalAmount.subtract(discountAmount).amount).toBe(19.425);
			expect(highPrecision1.subtract(highPrecision2).amount).toBe(
				12.2345
			);
			expect(() => new Money(9007199258).subtract(1)).toThrow(
				"Your numbers are too big to calculate safely."
			);
		});

		it("should allow you to a subtract non-Money object from a Money object", () => {
			expect(+new Money(0.2).subtract(0.1)).toBe(0.1);
		});
	});

	describe("multiply", () => {
		it("should correctly multiply commonly miscalculated floating point multiplications", () => {
			// 0.1 * 0.2 = 0.020000000000000004
			expect(+tenCents.multiply(twentyCents)).toBe(0.02);
		});

		it("should retain the full, non-rounded amount accessible via .amount", () => {
			expect(originalAmount.multiply(discountAmount).amount).toBe(
				167.7025
			);
			expect(originalAmount.multiply(0.75).amount).toBe(19.425);
			expect(() => new Money(4503599629).multiply(2)).toThrow(
				"Your numbers are too big to calculate safely."
			);
		});

		it("should allow you to a multiply non-Money object to a Money object", () => {
			expect(+tenCents.multiply(0.2)).toBe(0.02);
		});
	});

	describe("addPercent", () => {
		it("should correctly add commonly miscalculated floating point percentage additions", () => {
			// 0.2 + 50% [0.1] = 0.30000000000000004
			expect(+twentyCents.addPercent(50)).toBe(0.3);
		});

		it("should retain the full, non-rounded amount accessible via .amount", () => {
			expect(new Money(0.125).addPercent(50).amount).toBe(0.1875);
		});
	});

	describe("subtractPercent", () => {
		it("should correctly subtract commonly miscalculated floating point percentage subtractions", () => {
			// 25.9 - 25% [6.475] = 19.424999999999997
			expect(+originalAmount.subtractPercent(discountPercent)).toBe(
				19.43
			);
		});

		it("should retain the full, non-rounded amount accessible via .amount", () => {
			expect(originalAmount.subtractPercent(discountPercent).amount).toBe(
				19.425
			);
		});
	});
});
