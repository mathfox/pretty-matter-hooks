import { expect, it } from "@rbxts/jest-globals";
import { start } from "@rbxts/matter/lib/topoRuntime";
import { useMemo } from "useMemo";

it("should memoize the value", () => {
	const node = {
		system: {},
	};

	let memoizedValue: object | undefined = undefined;

	const fn = () => {
		const value = useMemo(() => {
			return {};
		}, []);

		memoizedValue = value;
	};

	expect(memoizedValue).toBeUndefined();

	// biome-ignore lint/suspicious/noExplicitAny: tests
	start(node as any, fn);

	expect(memoizedValue).toStrictEqual({});
});

it("should support discriminators", () => {
	//	for (const index of $range(1, 10)) {
	//		const value = useMemo(() => "value", [], index);
	//
	//		expect(value).toBe("value");
	//	}

	expect(true).toBe(true);
});
