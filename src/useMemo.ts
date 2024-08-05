import { useHookState } from "@rbxts/matter";
import { equals } from "@rbxts/phantom/src/Array";

type Storage<T> = {
	dependencies?: ReadonlyArray<unknown>;
	value?: [T];
};

export function useMemo<const T>(
	callback: () => T,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): T;

export function useMemo<const T extends Array<unknown>>(
	callback: () => LuaTuple<T>,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
): LuaTuple<T>;

export function useMemo(
	callback: Callback,
	dependencies: ReadonlyArray<unknown>,
	discriminator?: unknown,
) {
	const storage = useHookState(discriminator) as Storage<unknown>;

	if (
		storage.value === undefined ||
		!equals(dependencies, storage.dependencies)
	) {
		storage.dependencies = dependencies;
		storage.value = [callback()];
	}

	return $tuple(...storage.value);
}
