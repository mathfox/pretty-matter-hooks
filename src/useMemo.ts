import { useHookState } from "@rbxts/matter";
import { deepEquals } from "@rbxts/phantom/src/Array";

interface Storage<TValue> {
	dependencies?: ReadonlyArray<unknown>;
	value?: [TValue];
}

export function useMemo<TValue>(
	callback: () => TValue,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): TValue;

export function useMemo<TValues extends Array<unknown>>(
	callback: () => LuaTuple<TValues>,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): LuaTuple<TValues>;

export function useMemo(callback: Callback, dependencies: ReadonlyArray<unknown>, discriminator?: unknown) {
	const storage = useHookState(discriminator) as Storage<unknown>;

	if (storage.value === undefined || !deepEquals(dependencies, storage.dependencies)) {
		storage.dependencies = dependencies;
		storage.value = [callback()];
	}

	return $tuple(...storage.value);
}
