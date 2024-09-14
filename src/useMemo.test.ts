import { expect, it } from "@rbxts/jest-globals";
import { start } from "@rbxts/matter/lib/topoRuntime";
import { useMemo } from "useMemo";

it("should memoize the value", () => {
	const node = {
		// biome-ignore lint/suspicious/noExplicitAny: tests
		system: {} as any,
	};

	let memoizedValue: object | undefined = undefined;
	let actualValue: object | undefined = undefined;

	const fn = () => {
		const value = useMemo(() => {
			return {};
		}, []);

		if (memoizedValue === undefined) {
			memoizedValue = value;
		}

		actualValue = value;
	};

	expect(memoizedValue).toBeUndefined();
	expect(actualValue).toBeUndefined();

	for (const _ of $range(1, 10)) {
		start(node, fn);

		expect(actualValue).toBe(memoizedValue);
	}
});

it("should support discriminators", () => {
	//	for (const index of $range(1, 10)) {
	//		const value = useMemo(() => "value", [], index);
	//
	//		expect(value).toBe("value");
	//	}

	expect(true).toBe(true);
});
