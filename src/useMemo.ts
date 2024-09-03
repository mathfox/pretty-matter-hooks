import { useHookState } from "@rbxts/matter";
import { PhantomArray } from "@rbxts/phantom/src/Array";

interface Storage<T> {
	dependencies?: ReadonlyArray<unknown>;
	value?: [T];
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

	if (storage.value === undefined || !PhantomArray.equals(dependencies, storage.dependencies)) {
		storage.dependencies = dependencies;
		storage.value = [callback()];
	}

	return $tuple(...storage.value);
}
